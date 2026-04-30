import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// middleware untuk validasi request body
export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse & validate body
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format error message
        const errorMessage = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessage,
        });
      }
      next(error);
    }
  };
};

// middleware untuk validasi params
export const validateParams = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse & validate body
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format error message
        const errorMessage = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          error: 'Invalid Parameters',
          details: errorMessage,
        });
      }
      next(error);
    }
  };
};
