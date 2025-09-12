// Audit Logging System
// Tracks all user actions for compliance and security

export interface AuditLog {
  _id: string;
  userId: string;
  userRole: 'admin' | 'vendor' | 'user' | 'planner';
  action: string;
  resource: string;
  resourceId?: string;
  details: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    metadata?: Record<string, any>;
  };
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export class AuditLogger {
  private static instance: AuditLogger;

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async logAction(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    action: string,
    resource: string,
    details: {
      resourceId?: string;
      before?: Record<string, any>;
      after?: Record<string, any>;
      metadata?: Record<string, any>;
    },
    request: {
      ipAddress: string;
      userAgent: string;
    },
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      const auditLog: Omit<AuditLog, '_id'> = {
        userId,
        userRole,
        action,
        resource,
        resourceId: details.resourceId,
        details: {
          before: details.before,
          after: details.after,
          metadata: details.metadata,
        },
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        timestamp: new Date(),
        success,
        errorMessage,
      };

      // Save to database
      await this.saveAuditLog(auditLog);

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Audit Log:', {
          action,
          resource,
          userId,
          userRole,
          success,
          timestamp: auditLog.timestamp,
        });
      }
    } catch (error) {
      console.error('Failed to log audit action:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  private async saveAuditLog(auditLog: Omit<AuditLog, '_id'>): Promise<void> {
    try {
      const response = await fetch('/api/audit/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditLog),
      });

      if (!response.ok) {
        throw new Error(`Failed to save audit log: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving audit log:', error);
      throw error;
    }
  }

  // Specific logging methods for common actions
  async logUserLogin(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    request: { ipAddress: string; userAgent: string },
    success: boolean,
    errorMessage?: string
  ) {
    await this.logAction(
      userId,
      userRole,
      'LOGIN',
      'AUTH',
      { metadata: { loginMethod: 'email' } },
      request,
      success,
      errorMessage
    );
  }

  async logUserLogout(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    request: { ipAddress: string; userAgent: string }
  ) {
    await this.logAction(
      userId,
      userRole,
      'LOGOUT',
      'AUTH',
      {},
      request,
      true
    );
  }

  async logDataAccess(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    resource: string,
    resourceId: string,
    request: { ipAddress: string; userAgent: string }
  ) {
    await this.logAction(
      userId,
      userRole,
      'READ',
      resource,
      { resourceId },
      request,
      true
    );
  }

  async logDataModification(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    resource: string,
    resourceId: string,
    before: Record<string, any>,
    after: Record<string, any>,
    request: { ipAddress: string; userAgent: string }
  ) {
    await this.logAction(
      userId,
      userRole,
      action,
      resource,
      {
        resourceId,
        before,
        after,
      },
      request,
      true
    );
  }

  async logPaymentAction(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    action: 'PAYMENT_INITIATED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND',
    paymentId: string,
    amount: number,
    currency: string,
    request: { ipAddress: string; userAgent: string },
    success: boolean,
    errorMessage?: string
  ) {
    await this.logAction(
      userId,
      userRole,
      action,
      'PAYMENT',
      {
        resourceId: paymentId,
        metadata: {
          amount,
          currency,
        },
      },
      request,
      success,
      errorMessage
    );
  }

  async logSecurityEvent(
    userId: string,
    userRole: 'admin' | 'vendor' | 'user' | 'planner',
    event: 'SUSPICIOUS_ACTIVITY' | 'UNAUTHORIZED_ACCESS' | 'RATE_LIMIT_EXCEEDED' | '2FA_FAILED',
    details: Record<string, any>,
    request: { ipAddress: string; userAgent: string }
  ) {
    await this.logAction(
      userId,
      userRole,
      event,
      'SECURITY',
      { metadata: details },
      request,
      false
    );
  }

  async logAdminAction(
    adminId: string,
    action: string,
    targetResource: string,
    targetResourceId: string,
    details: Record<string, any>,
    request: { ipAddress: string; userAgent: string }
  ) {
    await this.logAction(
      adminId,
      'admin',
      action,
      targetResource,
      {
        resourceId: targetResourceId,
        metadata: details,
      },
      request,
      true
    );
  }

  // Query audit logs
  async getAuditLogs(
    filters: {
      userId?: string;
      userRole?: string;
      action?: string;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
      success?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.userRole) params.append('userRole', filters.userRole);
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters.success !== undefined) params.append('success', filters.success.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/audit/logs?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  // Export audit logs for compliance
  async exportAuditLogs(
    filters: {
      startDate: Date;
      endDate: Date;
      format: 'csv' | 'json' | 'pdf';
    }
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        format: filters.format,
      });

      const response = await fetch(`/api/audit/export?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to export audit logs: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();

// Middleware helper for Express/Next.js
export function auditMiddleware(
  action: string,
  resource: string,
  getResourceId?: (req: any) => string
) {
  return async (req: any, res: any, next: any) => {
    const originalSend = res.send;
    
    res.send = function(data: any) {
      // Log the action after response is sent
      setImmediate(async () => {
        try {
          const userId = req.user?.id || 'anonymous';
          const userRole = req.user?.role || 'user';
          const resourceId = getResourceId ? getResourceId(req) : undefined;
          
          await auditLogger.logAction(
            userId,
            userRole,
            action,
            resource,
            { resourceId },
            {
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.get('User-Agent') || '',
            },
            res.statusCode < 400
          );
        } catch (error) {
          console.error('Audit middleware error:', error);
        }
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}


