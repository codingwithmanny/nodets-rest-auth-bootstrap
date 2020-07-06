// Imports
// ========================================================
import { PrismaClient, User } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { buildSuccessResponse, buildErrorResponse } from '../../utils';

// Midddlewares
// ========================================================
import authenticated from '../../middlewares/authenticated';
import CONST from '../../utils/constants';

// Config
// ========================================================
const router = Router();
const prisma = new PrismaClient();

// Routes
// ========================================================
router.get('/', authenticated, async (req: Request, res: Response) => {
  const user = req?.user ?? null;

  if (!user) {
    return res.status(404).send(
      buildErrorResponse({
        msg: CONST.AUTH.ME.ERRORS.NOT_FOUND,
      }),
    );
  }

  const userData: User | null = await prisma.user.findOne({
    where: {
      id: user.sub,
    },
  });

  if (!userData) {
    return res.status(404).send(
      buildErrorResponse({
        msg: CONST.AUTH.ME.ERRORS.NOT_FOUND,
      }),
    );
  }

  return res.json(
    buildSuccessResponse({
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
    }),
  );
});

// Exports
// ========================================================
export default router;
