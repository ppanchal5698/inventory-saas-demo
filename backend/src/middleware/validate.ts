import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedBody = await schema.parseAsync(req.body);
    req.body = validatedBody;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    return next(error);
  }
};
