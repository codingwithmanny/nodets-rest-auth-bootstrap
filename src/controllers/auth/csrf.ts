// Imports
// ========================================================
import { Router, Request, Response } from 'express';
import { buildSuccessResponse } from '../../utils';

// Config
// ========================================================
const router = Router();

// Function
// ========================================================
/**
 * Function that creates a new cross site request forgery token
 * @param req Express Request
 * @param res Express Response
 */
export const Csrf = async (req: Request, res: Response) => {
  return res.json(buildSuccessResponse({ token: req.csrfToken() }));
};

// Route
// ========================================================
router.get('/', Csrf);

// Exports
// ========================================================
export default router;
