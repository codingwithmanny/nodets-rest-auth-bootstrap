// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import { buildSuccessResponse, buildErrorResponse } from '../../utils';
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
  [check('confirmation_token').isString().isLength({ min: 1 })],
  validation,
  async (req: Request, res: Response) => {
    const confirmationToken = req.body?.confirmation_token ?? '';

    // Get user
    const users: User[] | null = await prisma.user.findMany({
      take: 1,
      where: {
        confirmation_token: confirmationToken,
      },
    });

    if (!users || users?.length === 0) {
      return res.status(404).send(
        buildErrorResponse({
          msg: CONST.AUTH.CONFIRM.ERRORS.NOT_FOUND,
        }),
      );
    }

    await prisma.user.update({
      where: { id: users[0].id },
      data: { confirmed_at: new Date() },
    });

    return res.json(
      buildSuccessResponse({ msg: CONST.AUTH.CONFIRM.SUCCESS.CONFIRMED }),
    );
  },
);

// Exports
// ========================================================
export default router;
