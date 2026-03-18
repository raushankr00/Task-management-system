import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';
import { errorResponse } from '../utils/response';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Access token required', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        errorResponse(res, 'Access token expired', 401);
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        errorResponse(res, 'Invalid access token', 401);
        return;
      }
    }
    errorResponse(res, 'Authentication failed', 401);
  }
};
