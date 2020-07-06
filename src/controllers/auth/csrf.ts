// Imports
// ========================================================
import { Router, Request, Response } from 'express';
import { buildSuccessResponse } from '../../utils';

// Config
// ========================================================
const router = Router();

// Routes
// ========================================================
router.get('/', async (req: Request, res: Response) => {
  return res.json(buildSuccessResponse({ token: req.csrfToken() }));
});

// Exports
// ========================================================
export default router;
