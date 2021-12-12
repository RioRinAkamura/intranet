# HD Internal Tools

A simple tool for HD to manage resources

## Install & Start

⚠️ Using [Yarn Package Manager](https://yarnpkg.com) is recommended over `npm`.

This project uses a SDK package to communicate with our API. The configuration of NPM repo can be found in .npmrc. It does not work for you, please run these command to configure authentication for NPM repo

```shell
npm config set @hdwebsoft:registry=https://gitlab.com/api/v4/projects/31966285/packages/npm/
npm config set -- //gitlab.com/api/v4/projects/31966285/packages/npm/:_authToken=TC5t7sz3rpyZLxieCE5u
```

Start and check our example app, if you want

```shell
yarn install
yarn start
```

Remove the example app to start your project!

```shell
yarn cleanAndSetup
```

## Unit Test

```shell
yarn test
```

## Dev server

- http://app.boilerplate.dev.hdwebsoft.co/

---

## Storybook

```shell
yarn storybook
```

## Reference

This is created using CRA template

---

**📚 Documentation:** [Gitbook](https://cansahin.gitbook.io/react-boilerplate-cra-template/)

**🎨 Check the example app:** [Demonstrating the features](https://react-boilerplate.github.io/react-boilerplate-cra-template/)

**📦 Package:** [npm](https://www.npmjs.com/package/cra-template-rb)
