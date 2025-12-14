import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { connectDB } from './db';
import { User } from './models';

// Configure OTP settings
authenticator.options = {
  window: 2, // Allow 2 time steps (60 seconds) of tolerance
  step: 30, // 30-second time step
};

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  isValid: boolean;
  backupCodeUsed?: boolean;
}

export class TwoFactorAuth {
  /**
   * Generate a new 2FA secret for a user
   */
  static async generateSecret(userId: string, userEmail: string): Promise<TwoFactorSetup> {
    const secret = authenticator.generateSecret();
    const serviceName = 'WeddingLK';
    const accountName = userEmail;
    
    // Generate QR code URL
    const otpauthUrl = authenticator.keyuri(accountName, serviceName, secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);
    
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Store secret and backup codes in database (encrypted)
    await this.storeSecret(userId, secret, backupCodes);
    
    return {
      secret,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify a 2FA token
   */
  static async verifyToken(
    userId: string, 
    token: string
  ): Promise<TwoFactorVerification> {
    try {
      await connectDB();
      
      const user = await User.findById(userId);
      if (!user || !user.twoFactorSecret) {
        return { isValid: false };
      }

      // Check if it's a backup code
      if (user.backupCodes && user.backupCodes.includes(token)) {
        // Remove used backup code
        user.backupCodes = user.backupCodes.filter((code: string) => code !== token);
        await user.save();
        
        return { isValid: true, backupCodeUsed: true };
      }

      // Verify TOTP token
      const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      });

      return { isValid };
    } catch (error) {
      console.error('2FA verification error:', error);
      return { isValid: false };
    }
  }

  /**
   * Enable 2FA for a user
   */
  static async enable2FA(userId: string, token: string): Promise<boolean> {
    try {
      const verification = await this.verifyToken(userId, token);
      
      if (verification.isValid) {
        await connectDB();
        await User.findByIdAndUpdate(userId, {
          twoFactorEnabled: true,
          twoFactorVerified: true,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Enable 2FA error:', error);
      return false;
    }
  }

  /**
   * Disable 2FA for a user
   */
  static async disable2FA(userId: string, token: string): Promise<boolean> {
    try {
      const verification = await this.verifyToken(userId, token);
      
      if (verification.isValid) {
        await connectDB();
        await User.findByIdAndUpdate(userId, {
          twoFactorEnabled: false,
          twoFactorVerified: false,
          twoFactorSecret: null,
          backupCodes: [],
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return false;
    }
  }

  /**
   * Check if user has 2FA enabled
   */
  static async is2FAEnabled(userId: string): Promise<boolean> {
    try {
      await connectDB();
      const user = await User.findById(userId);
      return user?.twoFactorEnabled === true;
    } catch (error) {
      console.error('Check 2FA status error:', error);
      return false;
    }
  }

  /**
   * Generate new backup codes
   */
  static async regenerateBackupCodes(userId: string): Promise<string[]> {
    try {
      const backupCodes = this.generateBackupCodes();
      
      await connectDB();
      await User.findByIdAndUpdate(userId, {
        backupCodes,
      });
      
      return backupCodes;
    } catch (error) {
      console.error('Regenerate backup codes error:', error);
      throw error;
    }
  }

  /**
   * Store 2FA secret and backup codes (encrypted)
   */
  private static async storeSecret(
    userId: string, 
    secret: string, 
    backupCodes: string[]
  ): Promise<void> {
    try {
      await connectDB();
      
      // In a real implementation, encrypt the secret before storing
      const encryptedSecret = this.encryptSecret(secret);
      
      await User.findByIdAndUpdate(userId, {
        twoFactorSecret: encryptedSecret,
        backupCodes,
        twoFactorVerified: false,
      });
    } catch (error) {
      console.error('Store 2FA secret error:', error);
      throw error;
    }
  }

  /**
   * Generate backup codes
   */
  private static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-character alphanumeric codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Encrypt 2FA secret (simple implementation - use proper encryption in production)
   */
  private static encryptSecret(secret: string): string {
    // In production, use proper encryption like AES-256
    // This is a simple base64 encoding for demo purposes
    return Buffer.from(secret).toString('base64');
  }

  /**
   * Decrypt 2FA secret
   */
  private static decryptSecret(encryptedSecret: string): string {
    // In production, use proper decryption
    return Buffer.from(encryptedSecret, 'base64').toString();
  }

  /**
   * Validate backup code format
   */
  static isValidBackupCode(code: string): boolean {
    return /^[A-Z0-9]{8}$/.test(code);
  }

  /**
   * Validate TOTP token format
   */
  static isValidTOTPToken(token: string): boolean {
    return /^\d{6}$/.test(token);
  }

  /**
   * Get 2FA status for a user
   */
  static async get2FAStatus(userId: string): Promise<{
    enabled: boolean;
    verified: boolean;
    hasBackupCodes: boolean;
  }> {
    try {
      await connectDB();
      const user = await User.findById(userId);
      
      if (!user) {
        return { enabled: false, verified: false, hasBackupCodes: false };
      }
      
      return {
        enabled: user.twoFactorEnabled === true,
        verified: user.twoFactorVerified === true,
        hasBackupCodes: user.backupCodes && user.backupCodes.length > 0,
      };
    } catch (error) {
      console.error('Get 2FA status error:', error);
      return { enabled: false, verified: false, hasBackupCodes: false };
    }
  }
}

// 2FA middleware for protecting routes
export function require2FA(handler: Function) {
  return async (request: Request, context?: any) => {
    try {
      // Get user from session/token
      const userId = context?.userId; // This should come from your auth middleware
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if 2FA is enabled and verified
      const is2FAEnabled = await TwoFactorAuth.is2FAEnabled(userId);
      
      if (is2FAEnabled) {
        // Check for 2FA token in request
        const twoFactorToken = request.headers.get('x-2fa-token');
        
        if (!twoFactorToken) {
          return new Response(
            JSON.stringify({ 
              error: '2FA token required',
              requires2FA: true 
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Verify 2FA token
        const verification = await TwoFactorAuth.verifyToken(userId, twoFactorToken);
        
        if (!verification.isValid) {
          return new Response(
            JSON.stringify({ 
              error: 'Invalid 2FA token',
              requires2FA: true 
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Proceed with the original handler
      return handler(request, context);
    } catch (error) {
      console.error('2FA middleware error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

// Utility functions for 2FA setup flow
export const TwoFactorUtils = {
  /**
   * Generate setup data for 2FA
   */
  async setup(userId: string, userEmail: string): Promise<TwoFactorSetup> {
    return TwoFactorAuth.generateSecret(userId, userEmail);
  },

  /**
   * Verify and enable 2FA
   */
  async verifyAndEnable(userId: string, token: string): Promise<boolean> {
    return TwoFactorAuth.enable2FA(userId, token);
  },

  /**
   * Disable 2FA
   */
  async disable(userId: string, token: string): Promise<boolean> {
    return TwoFactorAuth.disable2FA(userId, token);
  },

  /**
   * Get 2FA status
   */
  async getStatus(userId: string) {
    return TwoFactorAuth.get2FAStatus(userId);
  },

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    return TwoFactorAuth.regenerateBackupCodes(userId);
  },
};
