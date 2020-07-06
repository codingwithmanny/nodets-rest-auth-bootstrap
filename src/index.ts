// Imports
// ========================================================
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'express';
import helmet from 'helmet';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import csrfMiddleware from './middlewares/csrf';
import routes from './controllers';

// ENV VARS
// ========================================================
dotenv.config();

const NODE_ENV: string = process.env.NODE_ENV || 'development';
const VERSION: string = process.env.VERSION || 'unknown';

// Init
// ========================================================
const app = express();

// Middlewares
// ========================================================
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(
  csrf({
    cookie: {
      key: process.env.CSRF_COOKIE_PREFIX || '',
      maxAge: parseInt(process.env.CSRF_COOKIE_MAXAGE || '900'),
      signed: NODE_ENV === 'production' ? true : false, // signature
      secure: NODE_ENV === 'production' ? true : false, // https
      httpOnly: true,
      sameSite: NODE_ENV === 'production' ? true : false, // sets the same site policy for the cookie
    },
  }),
);
app.use(csrfMiddleware);

// Endpoints / Routess
// ========================================================
app.get('/', (_req, res) =>
  res.send({ version: VERSION, environment: NODE_ENV }),
);

app.use('/api', routes);

// Exprots
// ========================================================
export default app;
