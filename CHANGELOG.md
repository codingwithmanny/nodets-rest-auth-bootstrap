# Changelog

All notable changes to this project will be documented in this file. See
[standard-version](https://github.com/conventional-changelog/standard-version)
for commit guidelines.

## 3.0.0 (2020-08-12)

### ⚠ BREAKING CHANGES

- **component:** Cookies are less restricted now
- **component:** Cookies are now restricted based the env vars and there are new
  env vars that prevent emails being sent for local development
- Initial Commit

### Features

- **component:** add postman tests
  ([23843d3](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/23843d392e07470abca1a4fa9e6ceea2e57d8dc8)),
  closes
  [#2](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/2)
- **dependabot.yml:** changed npm to yarn
  ([cf37894](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/cf378944790a985894e9c07dad558a2fbe97173a)),
  closes
  [#6](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/6)
- **dockerfile:** added docker file
  ([fc60862](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/fc6086216accd6c5c6c3cca277efca51dba25235)),
  closes
  [#5](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/5)
- **github worflows:** postgres github workflow
  ([07f4f17](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/07f4f17eebbbe1b2905dfb9eebc72f582ed8a5ec)),
  closes
  [#54](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/54)
- **tests:** support github actions
  ([fdeaa1b](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/fdeaa1ba699e20fc3cd42ddb9d2de482f0ae4d99)),
  closes
  [#3](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/3)
- initial-commit
  ([9a5bf3d](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/9a5bf3de841ecea7007d7042775ef741bc41404d))

### Bug Fixes

- **add env:** add environment vars reading
  ([410960e](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/410960e53e1cfd9b428e6e183a49105e76bf4fc0)),
  closes
  [#49](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/49)
  [#51](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/51)
- **add env vars:** env vars node.js.yml
  ([ba76db4](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/ba76db4a1c35dfaf4b8f843bced30e3acf079d2f))
- **add migration:** migrate to workflow
  ([76a0dfc](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/76a0dfc18cb735ff614557abaf97b53bd5266c12)),
  closes
  [#54](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/54)
- **changed env var:** update env var location
  ([77278f8](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/77278f881291060d50ece77815db960cab44a748))
- **component:** axios-jest-test-fix
  ([d18b635](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/d18b63541098031ed782e9ece691b3d74b8cde7a)),
  closes
  [#1](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/1)
- **component:** remove Cookie Domain Url Option
  ([20d88fd](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/20d88fd225479ee772266ae11126ce9d961a8609)),
  closes
  [#9](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/9)
- **confirm.ts:** abstracted confirm controller for tests
  ([5232490](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/5232490719948eb9122b453b203c5667a831e386))
- **dependabot.yml:** changed from yarn to npm
  ([f1416be](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/f1416beadbaec99e7836e0c45fa147d704fc66ee)),
  closes
  [#6](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/6)
- **node.js.yml:** add env export
  ([79f2631](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/79f26316740cdf6af6242650abfa7a8c1e9a7daf)),
  closes
  [#54](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/54)
- **node.js.yml:** added docker ports
  ([7dea20e](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/7dea20e2d9ffe3edf9d96d98bc1627e060c3b49f))
- **node.js.yml:** updated port
  ([90c38cc](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/90c38cc3fc4295774c09c87f35e4ea86928e729c))
- **node.js.yml:** updated postgres host
  ([861e330](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/861e3306f60eb20899075a071214f54324f76688))
- **package.json:** updated wait port
  ([446bc3f](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/446bc3f1b03eeeb50f58e406e907b6235e1d02d6))
- **prisma disconnect:** updated prisma disconnect
  ([0a68c6f](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/0a68c6ffb8eea345ab2aa87357684daf2b943fa2)),
  closes
  [#54](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/54)
- **prisma env:** added prisma database env to root
  ([d6daa18](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/d6daa1884f81b813310b3167bce477727634f215)),
  closes
  [#19](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/19)
- **server.ts:** changed port to 8080
  ([ed7bdaa](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/ed7bdaae7adf694cfa674ab79524d73be19b0678))
- **testing env vars:** testing env vars
  ([7fe3993](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/7fe39934a57ce07b5c411b1eaee48940fd668b77))
- **tsconfig.json:** add custom types directory
  ([d95f40b](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/d95f40b687f57ccb2f3cb1420d2ab2aa7b9557eb)),
  closes
  [#21](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/21)
- **updated package scripts:** yarn test newman
  ([777f387](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/777f387c6af51d324325715cb00d333f35b45f7b)),
  closes
  [#54](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/54)

## 2.0.0 (2020-08-12)

### ⚠ BREAKING CHANGES

- **component:** Cookies are less restricted now
- **component:** Cookies are now restricted based the env vars and there are new
  env vars that prevent emails being sent for local development
- Initial Commit

### Features

- **component:** add postman tests
  ([23843d3](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/23843d392e07470abca1a4fa9e6ceea2e57d8dc8)),
  closes
  [#2](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/2)
- **dependabot.yml:** changed npm to yarn
  ([cf37894](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/cf378944790a985894e9c07dad558a2fbe97173a)),
  closes
  [#6](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/6)
- **dockerfile:** added docker file
  ([fc60862](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/fc6086216accd6c5c6c3cca277efca51dba25235)),
  closes
  [#5](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/5)
- **tests:** support github actions
  ([fdeaa1b](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/fdeaa1ba699e20fc3cd42ddb9d2de482f0ae4d99)),
  closes
  [#3](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/3)
- initial-commit
  ([9a5bf3d](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/9a5bf3de841ecea7007d7042775ef741bc41404d))

### Bug Fixes

- **add env:** add environment vars reading
  ([410960e](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/410960e53e1cfd9b428e6e183a49105e76bf4fc0)),
  closes
  [#49](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/49)
  [#51](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/51)
- **component:** axios-jest-test-fix
  ([d18b635](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/d18b63541098031ed782e9ece691b3d74b8cde7a)),
  closes
  [#1](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/1)
- **component:** remove Cookie Domain Url Option
  ([20d88fd](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/20d88fd225479ee772266ae11126ce9d961a8609)),
  closes
  [#9](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/9)
- **confirm.ts:** abstracted confirm controller for tests
  ([5232490](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/5232490719948eb9122b453b203c5667a831e386))
- **dependabot.yml:** changed from yarn to npm
  ([f1416be](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/f1416beadbaec99e7836e0c45fa147d704fc66ee)),
  closes
  [#6](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/6)
- **prisma env:** added prisma database env to root
  ([d6daa18](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/d6daa1884f81b813310b3167bce477727634f215)),
  closes
  [#19](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/19)
- **tsconfig.json:** add custom types directory
  ([d95f40b](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/d95f40b687f57ccb2f3cb1420d2ab2aa7b9557eb)),
  closes
  [#21](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/21)

## [1.1.0](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/compare/v1.0.6...v1.1.0) (2020-07-13)

### Features

- **dockerfile:** added docker file
  ([fc60862](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/commit/fc6086216accd6c5c6c3cca277efca51dba25235)),
  closes
  [#5](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/issues/5)

### [1.0.6](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/compare/v1.0.5...v1.0.6) (2020-07-10)

### [1.0.5](https://github.com/codingwithmanny/nodets-rest-auth-bootstrap/compare/v1.0.4...v1.0.5) (2020-07-10)
