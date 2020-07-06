// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import { Router, Request, Response } from 'express';
import {
  buildSuccessResponse,
  buildErrorResponse,
  verifyResetToken,
} from '../../utils';
import CONST from '../../utils/constants';

// Config
// ========================================================
const router = Router();
const prisma = new PrismaClient();

// Routes
// ========================================================
router.get('/', async (req: Request, res: Response) => {
  const { query } = req;

  if (!query.token) {
    return res.status(400).json(
      buildErrorResponse({
        msg: CONST.AUTH.VALIDATE.ERRORS.INVALID,
      }),
    );
  }
  // Verify expiration of token
  try {
    verifyResetToken(query.token as string);

    // Validate reset token
    const users: User[] | null = await prisma.user.findMany({
      take: 1,
      where: {
        reset_token: query.token as string,
      },
    });

    if (!users || users.length === 0) {
      return res.status(404).json(
        buildErrorResponse({
          msg: CONST.AUTH.VALIDATE.ERRORS.INVALID,
        }),
      );
    }

    return res.json(
      buildSuccessResponse({ msg: CONST.AUTH.VALIDATE.SUCCESS.VALID }),
    );
  } catch (error) {
    return res.status(404).json(
      buildErrorResponse({
        msg: CONST.AUTH.VALIDATE.ERRORS.INVALID,
      }),
    );
  }
});

// Exports
// ========================================================
export default router;
