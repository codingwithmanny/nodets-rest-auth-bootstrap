// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { check, body } from 'express-validator';
import {
  buildErrorResponse,
  buildSuccessResponse,
  hashPassword,
  verifyResetToken,
} from '../../utils';
import CONST from '../../utils/constants';

// Midddlewares
// ========================================================
import validation from '../../middlewares/validation';

// Config
// ========================================================
const router = Router();
const prisma = new PrismaClient();

// Routes
// ========================================================
router.post(
  '/',
  [
    check('token').isLength({ min: 1 }),
    check('new_password').isLength({ min: 8 }),
    check('confirm_password').isLength({ min: 8 }),
    body('new_password').custom((value, { req }) => {
      if (value !== req.body.confirm_password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  validation,
  async (req: Request, res: Response) => {
    // Get body
    const { body } = req;

    // validate token
    try {
      verifyResetToken(body.token);

      // Create hash password
      const hashedPassword = await hashPassword(body.new_password);

      // Validate reset token
      const users: User[] | null = await prisma.user.findMany({
        take: 1,
        where: {
          reset_token: body.token as string,
        },
      });

      if (!users || users.length === 0) {
        return res.status(404).json(
          buildErrorResponse({
            msg: CONST.AUTH.RESET.ERRORS.INVALID,
          }),
        );
      }

      await prisma.user.update({
        where: {
          id: users[0].id,
        },
        data: {
          password: hashedPassword,
          reset_token: null,
          refresh_token: null,
        },
      });

      return res.json(
        buildSuccessResponse({
          msg: CONST.AUTH.RESET.SUCCESS.RESET,
        }),
      );
    } catch (error) {
      return res.status(401).json(
        buildErrorResponse({
          msg: CONST.AUTH.RESET.ERRORS.RESTART,
        }),
      );
    }
  },
);

// Exports
// ========================================================
export default router;
