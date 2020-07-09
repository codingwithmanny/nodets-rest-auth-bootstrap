// Imports
// ========================================================
import bcrypt from 'bcrypt';
import randToken from 'rand-token';
import { sign, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import formData from 'form-data';
import axios, { AxiosPromise } from 'axios';

// Types
// ========================================================
interface ResponseFormat {
  success: boolean;
  data?: any;
  errors?: any;
}

// Functions
// ========================================================
/**
 * Function used to hash passwords
 * @param password
 * @returns {Promise<string>}
 */
export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  });

/**
 * Function used to generated a confirmation|refresh token
 * @returns {string}
 */
export const getGeneratedToken = (): string => {
  return randToken.uid(64);
};

/**
 * Compares password and returns true or false if correct
 * @param passwordAttempt string
 * @param hashedPassword sring
 */
export const verifyPassword = (
  passwordAttempt: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

/**
 * Created authentication json web token
 * @param user User
 * @returns {string} jwt
 */
export const createAuthToken = (user: User): string => {
  return sign(
    {
      sub: user.id,
      email: user.email,
      iss: process.env.JWT_ISSUER || 'api.localhost',
      aud: process.env.JWT_AUDIENCE || 'api.localhost',
    },
    process.env.JWT_SECRET || 'JWT_SECRET_NOT_SET',
    {
      algorithm: 'HS256',
      expiresIn: parseInt(process.env.JWT_MAX_AGE || '900'),
    },
  );
};

/**
 * Created refresh json web token
 * @param user User
 * @returns {string} jwt
 */
export const createRefreshToken = (user: User): string => {
  return sign(
    {
      sub: user.id,
      email: user.email,
      iss: process.env.JWT_ISSUER || 'api.localhost',
      aud: process.env.JWT_AUDIENCE || 'api.localhost',
    },
    process.env.JWT_REFESH_SECRET || 'JWT_REFESH_SECRET_NOT_SET',
    {
      algorithm: 'HS256',
      expiresIn: parseInt(process.env.JWT_REFRESH_MAX_AGE || '604800'),
    },
  );
};

/**
 * Created reset json web token
 * @param user User
 * @returns {string} jwt
 */
export const createResetToken = (user: User, time?: number): string => {
  return sign(
    {
      sub: user.id,
      email: user.email,
      iss: process.env.JWT_ISSUER || 'api.localhost',
      aud: process.env.JWT_AUDIENCE || 'api.localhost',
    },
    process.env.JWT_RESET_SECRET || 'JWT_RESET_SECRET_NOT_SET',
    {
      algorithm: 'HS256',
      expiresIn: time || parseInt(process.env.JWT_RESET_MAX_AGE || '300'),
    },
  );
};

/**
 * Validates authentication token
 * @param token String
 * @returns object
 */
export const verifyAuthToken = (token: string): any =>
  verify(token, process.env.JWT_SECRET || 'JWT_SECRET_NOT_SET');

/**
 * Validates refresh token
 * @param token String
 * @returns object
 */
export const verifyRefreshToken = (token: string): any =>
  verify(token, process.env.JWT_REFESH_SECRET || 'JWT_REFESH_SECRET_NOT_SET');

/**
 * Validates reset token
 * @param token String
 * @returns object
 */
export const verifyResetToken = (token: string): any =>
  verify(token, process.env.JWT_RESET_SECRET || 'JWT_RESET_SECRET_NOT_SET');

/**
 * Create success response object
 * @param data Any object
 * @returns {ResponseFormat}
 */
export const buildSuccessResponse = (data: any): ResponseFormat => {
  return {
    success: true,
    data,
  };
};

/**
 * Create errors response object
 * @param data Any object
 * @returns {ResponseFormat}
 */
export const buildErrorResponse = (errors: any): ResponseFormat => {
  return {
    success: false,
    errors,
  };
};

/**
 * Attempts to interpret the error from the database
 * @param error Any object
 * @returns {string}
 */
export const ErrorDefinition = (error: any): string => {
  let message = 'Unknown error';

  switch (error?.code) {
    case 'P2002':
      const fields = error?.meta?.target;
      message = `Duplicate entry for: ${fields?.join(', ')}`;
      break;
  }

  return message;
};

/**
 * Template for sending mail
 * @param from email address
 * @param to email address
 * @param subject title
 * @param body html as string
 */
export const sendEmail = (
  from: string,
  to: string,
  subject: string,
  body: string,
): AxiosPromise<any> => {
  // Data Setup
  const data = new formData();
  data.append('from', `${from}`);
  data.append('to', to);
  data.append('subject', subject);
  data.append('html', body);

  // Mailgun Setup
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Basic ${Buffer.from(
        `api:${process.env.MAILGUN_SECRET_KEY || ''}`,
      ).toString('base64')}`,
      ...data.getHeaders(),
    },
  };

  return axios.post(
    `${process.env.MAILGUN_API_URL || ''}/${
      process.env.MAILGUN_DOMAIN || ''
    }/messages`,
    data,
    config,
  );
};

/**
 * Sends email for resetting password
 * @param email Email
 * @param token Token to be sent
 */
export const sendResetPasswordEmail = (
  email: string,
  token: string,
): AxiosPromise<any> => {
  return sendEmail(
    `${process.env.EMAIL_FROM || 'noreply'}@${
      process.env.MAILGUN_DOMAIN || ''
    }`,
    email,
    process.env.EMAIL_SUBJECT_RESET || 'Password Reset',
    `<p>Here is the link to <a href="${
      process.env.EMAIL_URL_RESET_PASSWORD || ''
    }/${token}">reset your password</a>.</p><p><a href="${
      process.env.EMAIL_URL_RESET_PASSWORD || ''
    }/${token}">${
      process.env.EMAIL_URL_RESET_PASSWORD || ''
    }/${token}</a></p>.`,
  );
};

/**
 * Sends email for confirming account
 * @param email Email
 * @param token Token to be sent
 */
export const sendConfirmAccountEmail = (
  email: string,
  token: string,
): AxiosPromise<any> => {
  return sendEmail(
    `${process.env.EMAIL_FROM || 'noreply'}@${
      process.env.MAILGUN_DOMAIN || ''
    }`,
    email,
    process.env.EMAIL_SUBJECT_CONFIRM || 'Confirm Account',
    `<p>Here is the link to <a href="${
      process.env.EMAIL_URL_CONFIRM_ACCOUNT || ''
    }/${token}">confirm your account</a>.</p><p><a href="${
      process.env.EMAIL_URL_CONFIRM_ACCOUNT || ''
    }/${token}">${
      process.env.EMAIL_URL_CONFIRM_ACCOUNT || ''
    }/${token}</a></p>.`,
  );
};
