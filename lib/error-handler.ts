// Global error handling utilities
export interface ErrorLog {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string | null;
  sessionId?: string;
  type: 'client_error' | 'api_error' | 'unhandled_rejection' | 'uncaught_exception';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorHandler {
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private getOrCreateSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      this.logError({
        errorId: `rejection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'unhandled_rejection',
        severity: 'high',
        context: {
          reason: event.reason,
          promise: event.promise,
        },
      });
    });

    // Handle uncaught exceptions
    window.addEventListener('error', (event) => {
      console.error('Uncaught Error:', event.error);
      
      this.logError({
        errorId: `exception_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: event.message || 'Uncaught Exception',
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'uncaught_exception',
        severity: 'critical',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Handle console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      // Log significant console errors
      if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Error')) {
        this.logError({
          errorId: `console_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          message: args.join(' '),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          type: 'client_error',
          severity: 'medium',
          context: {
            consoleArgs: args,
          },
        });
      }
    };
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  async logError(errorData: Omit<ErrorLog, 'sessionId' | 'userId'>) {
    const fullErrorData: ErrorLog = {
      ...errorData,
      sessionId: this.sessionId,
      userId: this.userId,
    };

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullErrorData),
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  }

  // API error handler
  async handleApiError(error: any, context?: Record<string, any>) {
    const errorData: Omit<ErrorLog, 'sessionId' | 'userId'> = {
      errorId: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message || 'API Error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      type: 'api_error',
      severity: error.status >= 500 ? 'high' : 'medium',
      context: {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        ...context,
      },
    };

    await this.logError(errorData);
  }

  // React error handler
  handleReactError(error: Error, errorInfo: any) {
    this.logError({
      errorId: `react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      type: 'client_error',
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: errorInfo.errorBoundary,
      },
    });
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Export for use in components
export const useErrorHandler = () => {
  return {
    logError: errorHandler.logError.bind(errorHandler),
    handleApiError: errorHandler.handleApiError.bind(errorHandler),
    handleReactError: errorHandler.handleReactError.bind(errorHandler),
    setUserId: errorHandler.setUserId.bind(errorHandler),
  };
};

// API error interceptor for fetch
export const createApiClient = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const response = await originalFetch(input, init);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).url = response.url;
        
        await errorHandler.handleApiError(error, {
          method: init?.method || 'GET',
          headers: init?.headers,
        });
      }
      
      return response;
    } catch (error) {
      await errorHandler.handleApiError(error, {
        method: init?.method || 'GET',
        headers: init?.headers,
      });
      throw error;
    }
  };
  
  return originalFetch;
};

export default errorHandler;