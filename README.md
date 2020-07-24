[![Version](https://img.shields.io/github/package-json/v/codingwithmanny/nodets-rest-auth-bootstrap?style=flat-square)](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/blob/master/package.json)

[![Build](https://img.shields.io/github/workflow/status/codingwithmanny/nodets-rest-auth-bootstrap/Node.js%20CI?style=flat-square)](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/actions/runs/163925691)

[![Coverage](https://img.shields.io/codecov/c/github/codingwithmanny/nodets-rest-auth-bootstrap?style=flat-square)](https://codecov.io/gh/codingwithmanny/nodets-rest-auth-bootstrap)

# NodeTS REST Auth Bootstrap

Original based off the
[NodeTS Bootstrap](https://github.com/codingwithmanny/nodets-bootstrap)
repository.

This is a base NodeJS REST Auth TypeScript App built with express and all
configurations files included.

This repository is meant to be a base to build on top of for building an API.

## Copy This App

```bash
git clone https://github.com/codingwithmanny/nodets-rest-auth-bootstrap myproject;
cd myproject;
rm -rf .git;
git init -y;
git remote add origin https://github.com/your/newrepo;
```

## Requirements

- NodeJS 12.18.1 or NVM
- Docker or Postgres Database
- MailGun account for emails

## Local Setup

While in project directory:

**0 - (Optional) NVM Installation**

```bash
nvm install;
```

**1 - Install Depencies**

```bash
yarn install; # npm install;
```

**2 - Start Database**

Using `Docker`

```bash
docker run -it -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=postgres --name nodetsdb postgres;
```

**3 - Setup ENV VARS**

**NOTE:** Make sure to fill them with the correct ENV Variables

```bash
cp .env.example .env;
```

and configure the correct `DATABASE_URL`

**File:** `./.env`

```bash
DATABASE_URL="postgresql://postgres:secret@localhost:5432/postgres?schema=public"
```

**4 - Run Migrations**

```bash
yarn db:migrate; # npm run db:migrate;
```

**5 - Server Start**

`Development:`

```bash
yarn dev; # npm dev;
```

`Production:`

```bash
yarn start; # npm start;
```

**6 - (Optional) Seeding**

```bash
yarn db:seed:all; # npm run db:seed:all
```

## Production Commands

`Build`

```bash
yarn build; # npm run build
```

`Build & Serve`

```bash
yarn start; # npm start
```

## Tests

`All Tests`

```bash
yarn test; # npm run test;
```

`Jest Watch`

```bash
yarn test:jest; # npm run test:jest;
```

`Jest Coverage`

```bash
yarn test:coverage; # npm run test:coverage;
```

`Eslint`

```bash
yarn test:lint; # npm run test:lint
```

## Development

Guidelines for development

### New Migration

There is a checklist for creating a new migration:

- [ ] - Create new model in `./prisma/schema.prisma`
- [ ] - Double check that it adheres to the criteria
- [ ] - `yarn db:save;`
- [ ] - `yarn db:gen;`
- [ ] - Create new sed `yarn db:seed:gen` and modify `NEW.ts` with name
    `ModelNameSeed.ts`
- [ ] - Run migrations `yarn db:migrate`
- [ ] - Write tests

Create new models in the `./prisma/schema.prisma` file.

**Criteria:**

- Singular: `User` _NOT_ `Users`
- Camelcase capitalized `MyModel` _NOT_ `myModel`

**Example:**

```prima
model ModelName {
  id                 String    @default(uuid()) @id
  updated_at         DateTime  @default(now())
}
```
