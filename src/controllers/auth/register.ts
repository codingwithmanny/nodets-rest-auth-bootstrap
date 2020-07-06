// Imports
// ========================================================
import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import {
  buildErrorResponse,
  buildSuccessResponse,
  ErrorDefinition,
  hashPassword,
  getGeneratedToken,
  sendConfirmAccountEmail,
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
    check('first_name').isString().isLength({ min: 2 }),
    check('last_name').isString().isLength({ min: 2 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  validation,
  async (req: Request, res: Response) => {
    // Get body
    const { body } = req;

    // Create hash password
    const hashedPassword = await hashPassword(body.password);

    try {
      const confirmationToken = getGeneratedToken();

      // Attempt to create user
      await prisma.user.create({
        data: {
          email: body.email,
          first_name: body.first_name,
          last_name: body.last_name,
          password: hashedPassword,
          confirmation_token: confirmationToken,
        },
      });

      // Send email
      await sendConfirmAccountEmail(body.email, confirmationToken);

      return res.json(
        buildSuccessResponse({
          msg: CONST.AUTH.REGISTER.SUCCESS.PENDING,
        }),
      );
    } catch (error) {
      // Fail if could not create user (ex: duplicate record)
      return res.json(buildErrorResponse({ msg: ErrorDefinition(error) }));
    }
  },
);

// Exports
// ========================================================
export default router;
