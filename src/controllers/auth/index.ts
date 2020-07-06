// Imports
// ========================================================
import { Router } from 'express';

// Imported Routes
// ========================================================
import Login from './login';
import Logout from './logout';
import Register from './register';
import Confirm from './confirm';
import Forgot from './forgot';
import Validate from './validate';
import Reset from './reset';
import Refresh from './refresh';
import Me from './me';
import Csrf from './csrf';

// Config
// ========================================================
const router = Router();

// Routes
// ========================================================
router.use('/login', Login);
router.use('/logout', Logout);
router.use('/register', Register);
router.use('/confirm', Confirm);
router.use('/forgot', Forgot);
router.use('/reset/validate', Validate);
router.use('/reset', Reset);
router.use('/refresh', Refresh);
router.use('/me', Me);
router.use('/csrf', Csrf);

// Exports
// ========================================================
export default router;
