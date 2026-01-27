# Contribute to APLOSE

This guide will take you to the steps to follow in order to contribute to APLOSE.

There are many ways to contribute to this project, including:

- **Starring** the [APLOSE GitHub page](https://github.com/Project-OSmOSE/APLOSE) to show the world that you use it
- **Referencing APLOSE** in your articles

  (see *"Cite this repository"* in [the About section of the APLOSE GitHub page](https://github.com/Project-OSmOSE/APLOSE))

- **Participating** in the [APLOSE GitHub](https://github.com/Project-OSmOSE/APLOSE) by:
    - **Reporting** difficulties you encounter when using the platform in new [issues](https://github.com/Project-OSmOSE/APLOSE/issues)
    - **Suggesting** functionalities that would come in handy in **APLOSE** in new [issues](https://github.com/Project-OSmOSE/APLOSE/issues)
    - **Reviewing** existing [pull requests](https://github.com/Project-OSmOSE/APLOSE/pulls)
    - **Authoring** new [pull requests](https://github.com/Project-OSmOSE/APLOSE/pulls) to:
        - **Add** new cool functionalities
        - **Fix** things that don't work exactly the way they should
        - **Improve** the documentation

::: info

Any contribution submitted to this project is deemed to be provided
under the project's MIT license, without additional restrictions.

By submitting a contribution, you warrant that:
- You are the author of the contribution or have the necessary rights,
- The contribution does not violate any third-party rights,
- The contribution is provided under the project's MIT license.
- No contributions can be accepted under a different or incompatible license.

:::

## GitHub contributing workflow

Contributions to the **APLOSE** codebase are done with **GitHub**.

If you’re new to this tool, we recommend taking a look at some resources
to get you started, such as the [Introduction to GitHub interactive course](https://github.com/skills/introduction-to-github).

If you want to dig in **APLOSE**’s code to do anything you’d like (adding 
functionalities, fixing bugs, working on the documentation…), you’ll have to 
submit a new **pull request**.

There are lots of great tutorials out there that’ll guide you in the process 
of submitting a pull request. We recommend you follow one of those, e.g. 
[DigitalOcean’s How To Create a Pull Request on GitHub](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

We use [poetry](https://python-poetry.org/) and [npm](https://www.npmjs.com/) 
to manage the project, and suggest that you install the project following the 
instructions in the [Local installation](./installation/local.md) documentation.

## Validation process

We use a GitHub Action to validate both [backend](https://github.com/Project-OSmOSE/APLOSE/blob/master/.github/workflows/backend.yml) and [frontend](https://github.com/Project-OSmOSE/APLOSE/blob/master/.github/workflows/frontend.yml) 
when code is being pushed to our repo.

### Backend validation

The backend action validates that:
- All new migrations are included in the commit
- The code style is correct
- The tests pass


#### :x: Missed migrations

If a migration is missing, run the `makemigrations` to make sure all the migrations are generated.
```bash
poetry run ./manage.py makemigrations
```
Then check that all the migration files (in `api/migrations`) are added to the git.


#### :x: Missed black
Run black to unify code style
```bash
poetry run black backend
```

::: info
If you use VSCode, you can add `"python.formatting.provider": "black"` to your .vscode/settings.json
:::

#### :x: Missed pylint warning
Run pylint to raise code smells and fix it.
```bash
poetry run pylint backend
```

#### :x: Failing tests
Run the tests and fix the failing ones
```bash
poetry run python ./manage.py test 
```
This should point you to the part of the codebase that has
been altered by your code modifications, and help you fix it.


### Frontend validation

The frontend action validates that:
- The tests pass

#### :x: Failing tests
Run Playwright to raise code smells and fix it.
```bash
cd frontend
npm run test:e2e
```
You can add `--ui` parameter the open the GUI and visualize the tests 
running.