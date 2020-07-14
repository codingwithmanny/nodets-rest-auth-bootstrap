// Imports
// ========================================================
import faker from 'faker';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import formData from 'form-data';
import { User } from '@prisma/client';
import {
  hashPassword,
  getGeneratedToken,
  verifyPassword,
  createAuthToken,
  createRefreshToken,
  createResetToken,
  verifyAuthToken,
  verifyRefreshToken,
  verifyResetToken,
  buildSuccessResponse,
  buildErrorResponse,
  ErrorDefinition,
  sendEmail,
  sendResetPasswordEmail,
  sendConfirmAccountEmail,
} from '../';

// Mocks
// ========================================================
jest.mock('axios', () => {
  return Object.assign(jest.fn(), {
    post: jest.fn().mockReturnValue({ success: true }),
  });
});

const formDataAppend = jest.fn();
const formDataGetHeaders = jest.fn();
jest.mock('form-data', () => {
  return jest.fn().mockImplementation(() => {
    return { append: formDataAppend, getHeaders: formDataGetHeaders };
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
// ========================================================
/**
 * Validates if password is successfully hashed
 */
test('test - hashPassword - asdf1234', async () => {
  const password = 'asdf1234';

  const result = await hashPassword(password);

  expect(result.length).toBe(60);
});

/**
 * Validates if tokens are successfully generated
 */
test('test - getGeneratedToken', () => {
  const result = getGeneratedToken();

  expect(result.length).toBe(64);
});

/**
 * Validates if password comparing is working
 */
test('test - getGeneratedToken - passes - asdf1234', async () => {
  const password = 'asdf1234';
  const verify = '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i';
  const result = await verifyPassword(password, verify);

  expect(result).toBeTruthy();
});

/**
 * Validates if when password comparing should not work
 */
test('test - getGeneratedToken - fails - asdf1234!', async () => {
  const password = 'asdf1234!';
  const verify = '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i';
  const result = await verifyPassword(password, verify);

  expect(result).toBeFalsy();
});

/**
 * Validates creating an authentication jwt
 */
test('test - createAuthToken', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  // Init
  const result = await createAuthToken(user);

  // Expectations
  const decoded: any = jwtDecode(result);

  expect(decoded.sub).toBe(user.id);
  expect(decoded.email).toBe(user.email);
  expect(decoded.iss).toBe('api.localhost');
  expect(decoded.aud).toBe('api.localhost');
  expect(typeof decoded.iat === 'number').toBeTruthy();
  expect(typeof decoded.exp === 'number').toBeTruthy();
  expect(decoded.exp - decoded.iat).toBe(900);
});

/**
 * Validates creating an refresh jwt
 */
test('test - createRefreshToken', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  // Init
  const result = await createRefreshToken(user);

  // Expectations
  const decoded: any = jwtDecode(result);

  expect(decoded.sub).toBe(user.id);
  expect(decoded.email).toBe(user.email);
  expect(decoded.iss).toBe('api.localhost');
  expect(decoded.aud).toBe('api.localhost');
  expect(typeof decoded.iat === 'number').toBeTruthy();
  expect(typeof decoded.exp === 'number').toBeTruthy();
  expect(decoded.exp - decoded.iat).toBe(604800);
});

/**
 * Validates creating an reset jwt
 */
test('test - createResetToken', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  // Init
  const result = await createResetToken(user);

  // Expectations
  const decoded: any = jwtDecode(result);

  expect(decoded.sub).toBe(user.id);
  expect(decoded.email).toBe(user.email);
  expect(decoded.iss).toBe('api.localhost');
  expect(decoded.aud).toBe('api.localhost');
  expect(typeof decoded.iat === 'number').toBeTruthy();
  expect(typeof decoded.exp === 'number').toBeTruthy();
  expect(decoded.exp - decoded.iat).toBe(300);
});

/**
 * Validates creating an reset jwt overiding time
 */
test('test - createResetToken - overide - 100000', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  // Init
  const result = await createResetToken(user, 100000);

  // Expectations
  const decoded: any = jwtDecode(result);

  expect(decoded.sub).toBe(user.id);
  expect(decoded.email).toBe(user.email);
  expect(decoded.iss).toBe('api.localhost');
  expect(decoded.aud).toBe('api.localhost');
  expect(typeof decoded.iat === 'number').toBeTruthy();
  expect(typeof decoded.exp === 'number').toBeTruthy();
  expect(decoded.exp - decoded.iat).toBe(100000);
});

/**
 * Validates authentication jwt
 */
test('test - verifyAuthToken', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;
  const token = await createAuthToken(user);

  // Init
  const result = await verifyAuthToken(token);

  // Expectations
  expect(result.sub).toBe(user.id);
  expect(result.email).toBe(user.email);
  expect(result.iss).toBe('api.localhost');
  expect(result.aud).toBe('api.localhost');
  expect(typeof result.iat === 'number').toBeTruthy();
  expect(typeof result.exp === 'number').toBeTruthy();
  expect(result.exp - result.iat).toBe(900);
});

/**
 * Validates refresh jwt
 */
test('test - verifyRefreshToken', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;
  const token = await createRefreshToken(user);

  // Init
  const result = await verifyRefreshToken(token);

  // Expectations
  expect(result.sub).toBe(user.id);
  expect(result.email).toBe(user.email);
  expect(result.iss).toBe('api.localhost');
  expect(result.aud).toBe('api.localhost');
  expect(typeof result.iat === 'number').toBeTruthy();
  expect(typeof result.exp === 'number').toBeTruthy();
  expect(result.exp - result.iat).toBe(604800);
});

/**
 * Validates reset jwt
 */
test('test - verifyResetToken', async () => {
  // Setup
  const user = {
    id: faker.random.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: '$2b$12$xd1XVYEIxtzHDbKYnW/GHOilt9FyW996NzV2iw9cXJajgKIqghg4i',
    reset_token: null,
    refresh_token: null,
    confirmation_token: 'asdf',
    confirmed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;
  const token = await createResetToken(user);

  // Init
  const result = await verifyResetToken(token);

  // Expectations
  expect(result.sub).toBe(user.id);
  expect(result.email).toBe(user.email);
  expect(result.iss).toBe('api.localhost');
  expect(result.aud).toBe('api.localhost');
  expect(typeof result.iat === 'number').toBeTruthy();
  expect(typeof result.exp === 'number').toBeTruthy();
  expect(result.exp - result.iat).toBe(300);
});

/**
 * Validates successful response message formatting
 */
test("test - buildSuccessResponse - { hello: 'there' }", () => {
  // Setup
  const data = { hello: 'there' };

  // Init
  const result = buildSuccessResponse(data);

  // Expectations
  expect(result.success).toBeTruthy();
  expect(result.data).toBe(data);
});

/**
 * Validates error response message formatting
 */
test("test - buildErrorResponse - { not: 'working' }", () => {
  // Setup
  const data = { not: 'working' };

  // Init
  const result = buildErrorResponse(data);

  // Expectations
  expect(result.success).toBeFalsy();
  expect(result.errors).toBe(data);
});

/**
 * Validates errors definitions
 */
test("test - ErrorDefinition - { error: { code: 'P2002', meta: { target: ['one', 'two']} } }", () => {
  // Setup
  const data = {
    code: 'P2002',
    meta: {
      target: ['one', 'two'],
    },
  };

  // Init
  const result = ErrorDefinition(data);

  // Expectations
  expect(result).toBe('Duplicate entry for: one, two');
});

/**
 * Validates default error definition
 */
test('test - ErrorDefinition - null', () => {
  // Setup
  const data = null;

  // Init
  const result = ErrorDefinition(data);

  // Expectations
  expect(result).toBe('Unknown error');
});

/**
 * Validates send email request
 */
test('test - sendEmail - hello@email.com, some@email.com, my subject, hello there!', async () => {
  // Setup
  const from = 'hello@email.com';
  const to = 'some@email.com';
  const subject = 'my subject';
  const body = 'hello there!';
  const basicAuth = Buffer.from(`api:secret`).toString('base64');
  const spyOnAxiosPost = jest.spyOn(axios, 'post');

  process.env.ENABLE_EMAIL = 'true';
  process.env.MAILGUN_API_URL = 'url';
  process.env.MAILGUN_DOMAIN = 'domain';
  process.env.MAILGUN_SECRET_KEY = 'secret';

  // Pre Expectations
  expect(formData).not.toHaveBeenCalled();
  expect(spyOnAxiosPost).not.toBeCalled();

  // Init
  const result = await sendEmail(from, to, subject, body);

  // Post Expectations
  // Form Data
  expect(formData).toHaveBeenCalledTimes(1);
  expect(formDataAppend).toHaveBeenCalledTimes(4);
  expect(formDataAppend.mock.calls[0][0]).toEqual('from');
  expect(formDataAppend.mock.calls[0][1]).toEqual(from);
  expect(formDataAppend.mock.calls[1][0]).toEqual('to');
  expect(formDataAppend.mock.calls[1][1]).toEqual(to);
  expect(formDataAppend.mock.calls[2][0]).toEqual('subject');
  expect(formDataAppend.mock.calls[2][1]).toEqual(subject);
  expect(formDataAppend.mock.calls[3][0]).toEqual('html');
  expect(formDataAppend.mock.calls[3][1]).toEqual(body);
  expect(formDataGetHeaders).toHaveBeenCalledTimes(1);

  // Axios
  expect(spyOnAxiosPost).toBeCalledTimes(1);
  expect(axios.post).toHaveBeenCalledWith(
    'url/domain/messages',
    { append: formDataAppend, getHeaders: formDataGetHeaders },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  expect(result).toStrictEqual({ success: true });
});

/**
 * Validates send email request for reseting an account's password
 */
test('test - sendResetPasswordEmail - hello@email.com, some@email.com, my subject, hello there!', async () => {
  // Setup
  const from = 'noreply@domain';
  const to = 'some@email.com';
  const subject = 'my subject';
  const body =
    '<p>Here is the link to <a href="/asdf1234">reset your password</a>.</p><p><a href="/asdf1234">/asdf1234</a></p>.';
  const basicAuth = Buffer.from(`api:secret`).toString('base64');
  const spyOnAxiosPost = jest.spyOn(axios, 'post');

  process.env.ENABLE_EMAIL = 'true';
  process.env.MAILGUN_DOMAIN = 'domain';
  process.env.MAILGUN_SECRET_KEY = 'secret';
  process.env.EMAIL_SUBJECT_RESET = subject;

  // Pre Expectations
  expect(formData).not.toHaveBeenCalled();
  expect(spyOnAxiosPost).not.toBeCalled();

  // Init
  const result = await sendResetPasswordEmail(to, 'asdf1234');

  // Post Expectations
  // Form Data
  expect(formData).toHaveBeenCalledTimes(1);
  expect(formDataAppend).toHaveBeenCalledTimes(4);
  expect(formDataAppend.mock.calls[0][0]).toEqual('from');
  expect(formDataAppend.mock.calls[0][1]).toEqual(from);
  expect(formDataAppend.mock.calls[1][0]).toEqual('to');
  expect(formDataAppend.mock.calls[1][1]).toEqual(to);
  expect(formDataAppend.mock.calls[2][0]).toEqual('subject');
  expect(formDataAppend.mock.calls[2][1]).toEqual(subject);
  expect(formDataAppend.mock.calls[3][0]).toEqual('html');
  expect(formDataAppend.mock.calls[3][1]).toEqual(body);
  expect(formDataGetHeaders).toHaveBeenCalledTimes(1);

  // Axios
  expect(spyOnAxiosPost).toBeCalledTimes(1);
  expect(axios.post).toHaveBeenCalledWith(
    'url/domain/messages',
    { append: formDataAppend, getHeaders: formDataGetHeaders },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  expect(result).toStrictEqual({ success: true });
});

/**
 * Validates send email request for confirming account
 */
test('test - sendConfirmAccountEmail - hello@email.com, some@email.com, my subject, hello there!', async () => {
  // Setup
  const from = 'noreply@domain';
  const to = 'some@email.com';
  const subject = 'my subject';
  const body =
    '<p>Here is the link to <a href="/asdf1234">confirm your account</a>.</p><p><a href="/asdf1234">/asdf1234</a></p>.';
  const basicAuth = Buffer.from(`api:secret`).toString('base64');
  const spyOnAxiosPost = jest.spyOn(axios, 'post');

  process.env.MAILGUN_DOMAIN = 'domain';
  process.env.MAILGUN_SECRET_KEY = 'secret';
  process.env.EMAIL_SUBJECT_CONFIRM = subject;

  // Pre Expectations
  expect(formData).not.toHaveBeenCalled();
  expect(spyOnAxiosPost).not.toBeCalled();

  // Init
  const result = await sendConfirmAccountEmail(to, 'asdf1234');

  // Post Expectations
  // Form Data
  expect(formData).toHaveBeenCalledTimes(1);
  expect(formDataAppend).toHaveBeenCalledTimes(4);
  expect(formDataAppend.mock.calls[0][0]).toEqual('from');
  expect(formDataAppend.mock.calls[0][1]).toEqual(from);
  expect(formDataAppend.mock.calls[1][0]).toEqual('to');
  expect(formDataAppend.mock.calls[1][1]).toEqual(to);
  expect(formDataAppend.mock.calls[2][0]).toEqual('subject');
  expect(formDataAppend.mock.calls[2][1]).toEqual(subject);
  expect(formDataAppend.mock.calls[3][0]).toEqual('html');
  expect(formDataAppend.mock.calls[3][1]).toEqual(body);
  expect(formDataGetHeaders).toHaveBeenCalledTimes(1);

  // Axios
  expect(spyOnAxiosPost).toBeCalledTimes(1);
  expect(axios.post).toHaveBeenCalledWith(
    'url/domain/messages',
    { append: formDataAppend, getHeaders: formDataGetHeaders },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  expect(result).toStrictEqual({ success: true });
});
