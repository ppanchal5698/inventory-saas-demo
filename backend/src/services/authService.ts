import { userRepository } from '../repositories/userRepository';
import { organizationRepository } from '../repositories/organizationRepository';
import { UserOrganization } from '../models/userOrganization';
import { Role } from '../models/role';
import { Session } from '../models/session';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';
import { sequelize } from '../db/index';

export class AuthService {
  async register(data: any) {
    const transaction = await sequelize.transaction();
    try {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await userRepository.create({
        ...data,
        passwordHash,
        status: 'active',
        isActive: true,
      }, transaction);

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is inactive', 403);
    }

    // Check for default organization
    const userOrg = await UserOrganization.findOne({
      where: { userId: user.userId, isDefault: true },
    });

    const organizationId = userOrg ? userOrg.organizationId : undefined;

    const token = this.generateToken(user.userId, organizationId);

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await Session.create({
      userId: user.userId,
      sessionToken: token,
      expiresAt,
    });

    return { user, token, organizationId };
  }

  async createOrganization(userId: number, data: any) {
    const transaction = await sequelize.transaction();
    try {
      const existingOrg = await organizationRepository.findBySlug(data.slug);
      if (existingOrg) {
        throw new AppError('Organization slug already exists', 400);
      }

      // Create Organization
      const org = await organizationRepository.create({
        organizationName: data.organizationName,
        slug: data.slug,
        email: data.email,
        status: 'active',
        isActive: true,
      }, transaction);

      // Create Admin Role for this Org
      const adminRole = await Role.create({
        organizationId: org.organizationId,
        roleName: 'Admin',
        description: 'Organization Administrator',
        isSystem: true,
        isActive: true,
      }, { transaction });

      // Link User to Org as Admin
      await UserOrganization.create({
        userId,
        organizationId: org.organizationId,
        roleId: adminRole.roleId,
        isDefault: true,
      }, { transaction });

      await transaction.commit();

      const token = this.generateToken(userId, org.organizationId);

      return { organization: org, token };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  generateToken(userId: number, organizationId?: number) {
    return jwt.sign(
      { userId, organizationId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
