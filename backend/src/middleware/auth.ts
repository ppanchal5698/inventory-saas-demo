import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { User } from '../models/user';
import { Role } from '../models/role';
import { UserOrganization } from '../models/userOrganization';
import { Organization } from '../models/organization';

interface JwtPayload {
  userId: number;
  organizationId?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      organizationId?: number;
      role?: string;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      throw new AppError('Unauthorized: User not found or inactive', 401);
    }

    req.user = user;
    req.organizationId = decoded.organizationId; // If token is scoped to an org
    req.role = user.role; // Default role from User model

    // If organization context is required, we can check user_organizations
    if (decoded.organizationId) {
      const userOrg = await UserOrganization.findOne({
        where: { userId: user.userId, organizationId: decoded.organizationId },
        include: [{ model: Role }],
      });

      if (!userOrg) {
        throw new AppError('Unauthorized: User does not belong to this organization', 403);
      }

      // Override role with organization-specific role if available, otherwise fallback to user global role
      // In this schema, UserOrganization has a roleId linking to Roles table.
      if (userOrg.roleId) {
        const role = await Role.findByPk(userOrg.roleId);
        if (role) {
           // This is a simplification. Ideally, we map DB roles to permission sets.
           // For now, we store the role name.
           req.role = role.roleName as any;
        }
      }
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Unauthorized: Token expired', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Unauthorized: Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.role) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.role)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    next();
  };
};
