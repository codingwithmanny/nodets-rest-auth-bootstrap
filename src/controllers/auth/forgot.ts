// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import {
  buildSuccessResponse,
  buildErrorResponse,
  createResetToken,
  sendResetPasswordEmail,
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
  [check('email').isEmail()],
  validation,
  async (req: Request, res: Response) => {
    const { body } = req;

    const user = await prisma.user.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return res.status(404).json(
        buildErrorResponse({
          msg: CONST.AUTH.FORGOT.ERRORS.NOT_FOUND,
        }),
      );
    }

    // Update with new reset token
    const resetToken = createResetToken(user);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        reset_token: resetToken,
      },
    });

    // Send email
    try {
      if (process.env.ENABLE_EMAIL === 'true') {
        await sendResetPasswordEmail(user.email, resetToken);
      }
    } catch (error) {
      return res.status(500).json(
        buildErrorResponse({
          msg: CONST.AUTH.FORGOT.ERRORS.EMAIL,
        }),
      );
    }

    // Success message
    return res.json(
      buildSuccessResponse({
        msg: CONST.AUTH.FORGOT.SUCCESS.EMAIL,
      }),
    );
  },
);

// Exports
// ========================================================
export default router;
