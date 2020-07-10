// Imports
// ========================================================
import app from './index';
import * as dotenv from 'dotenv';

// ENV VARS
// ========================================================
dotenv.config();

const NODE_ENV: string = process.env.NODE_ENV || 'development';
const PORT: number =
  NODE_ENV === 'production' ? 80 : parseInt(process.env.PORT as string, 10);
const VERSION: string = process.env.VERSION || 'unknown';

// Server
// ========================================================
app.listen(PORT, () =>
  console.log(
    `Listening on PORT ${PORT}\nEnvironment: ${NODE_ENV}\nVersion: ${VERSION}`,
  ),
);
