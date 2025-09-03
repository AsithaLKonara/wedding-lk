import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function generateJWT(user: any): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'weddinglk',
    audience: 'weddinglk-users'
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'weddinglk',
      audience: 'weddinglk-users',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function refreshJWT(token: string): string | null {
  try {
    const decoded = verifyJWT(token);
    if (!decoded) return null;
    
    // Generate new token with same payload
    return generateJWT({
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    console.error('JWT refresh error:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

export function createAccessToken(user: any): string {
  return generateJWT(user);
}

export function createRefreshToken(user: any): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d', // Refresh tokens last longer
    issuer: 'weddinglk',
    audience: 'weddinglk-refresh',
  });
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'weddinglk',
      audience: 'weddinglk-refresh',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return null;
  }
} 