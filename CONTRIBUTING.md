# Contributing to `@callstack/react-theme-provider`

## Code of Conduct

We want this community to be friendly and respectful to each other. Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Development Process

The core team works directly on GitHub and all work is public.

### Workflow and Pull Requests

> **Working on your first Pull Request?** 
You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

*Before* submitting a pull request, please make sure the following is done:

1. Fork the repo and create your branch from `master` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/)).
1. We have a commit message convention:
    - `fix` - bug fixes
    - `feature` -  new features, e.g. add GrouppeList component
    - `docs` - code/structure refactor, e.g. new structure folder for components
    - `refactor` - changes into documentation, e.g. add usage example for Button
    - `chore` - tooling changes, e.g. change circle ci config
1. Always make sure that your code passes `eslint` before opening a PR.
1. If you've changed APIs, update the documentation.  
1. Make sure to provide an example usage (check how others do it).

## Running the example

Just run `yarn example:web`.
After each change you have to build code using `yarn build:babel`.

## Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. Please provide a public repository with a runnable example if possible.

## How to Get in Touch

* Callstack Open Source Slack - [#react-theme-provider](https://slack.callstack.com/)

## Code Conventions

We use Prettier with ESLint integration.

## License

By contributing to `@callstack/react-theme-provider`, you agree that your contributions will be licensed under its **MIT** license.