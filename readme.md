<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">🚧 nestjs-rest-api-boilerplate 🚧</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-in--development-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)

</div>

---

## 🧐 About <a name = "about"></a>

... todo
<br/><br/>

## 👻 Prerequisites

```
node (version >= 16.20)
pnpm (version >= 8.5.1)
```

To install pnpm :

```
npm install -g pnpm
```

<br/>

## ⌨️ Development <a name="development"></a>

### To install dependencies :

```
pnpm install
```

### To start the local server :

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

<br/>

## 🔧 Running the tests <a name = "tests"></a>

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

<br/>

## 🚀 Deployment <a name = "deployment"></a>

Build UI static assets

```
pnpm build
```

<br/>

## 🔎 Project Structure <a name = "project-structure"></a>

<pre>
├── libs                   libraries
│   ├── core               (can reuse for other project)
│   ├── ...
│   ├── infrastructures    (only use for similar project)
│   ├── ...
├── apps\api               (applications - main api)
│   ├── ...
│   ├── main.ts            (entry point)
</pre>
