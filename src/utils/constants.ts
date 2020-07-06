// Constants
// ========================================================
const CONST = {
  AUTH: {
    CONFIRM: {
      ERRORS: {
        NOT_FOUND: 'User not found.',
      },
      SUCCESS: {
        CONFIRMED: 'Account confirmed.',
      },
    },
    FORGOT: {
      ERRORS: {
        NOT_FOUND: 'Could not find a user with that email address.',
        EMAIL: 'There was an errors sending the email. Please try again later.',
      },
      SUCCESS: {
        EMAIL: 'Please check your email for the reset instructions.',
      },
    },
    LOGIN: {
      ERRORS: {
        NOT_FOUND: 'Could not find an account with this email address.',
        NOT_CONFIRMED: 'Please check your email to confirm your account.',
        INVALID: 'Invalid email/password combination.',
      },
    },
    LOGOUT: {
      SUCCESS: {
        LOGGED_OUT: 'Successfully logged out.',
      },
    },
    ME: {
      ERRORS: {
        NOT_FOUND: 'User not found.',
      },
    },
    REFRESH: {
      ERRORS: {
        INVALID: 'Invalid or expired refresh token.',
      },
      SUCCESS: {
        REFRESHED: 'Token successfully refreshed.',
      },
    },
    REGISTER: {
      SUCCESS: {
        PENDING: 'Account pending confirmation via email.',
      },
    },
    RESET: {
      ERRORS: {
        INVALID: 'Token not found or invalid.',
        RESTART: 'Invalid or expired reset token, please restart the process.',
      },
      SUCCESS: {
        RESET: 'Password successfully reset. Please login again.',
      },
    },
    VALIDATE: {
      ERRORS: {
        INVALID: 'Invalid or missing token.',
      },
      SUCCESS: {
        VALID: 'Valid token.',
      },
    },
  },
  MIDDLEWARE: {
    AUTHENTICATE: {
      ERRORS: {
        INVALID: 'Token is invalid.',
        AUTHORIZE: 'There was a problem authorizing the request.',
      },
    },
    CSRF: {
      ERRORS: {
        INVALID: 'Invalid CSRF token.',
      },
    },
  },
};

// Exports
// ========================================================
export default CONST;
