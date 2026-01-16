# Contribute to APLOSE

Thank you for your interest in this project.

This document describes the rules and best practices to 
follow when contributing to the development of the software.


## Contributions

Contributions are welcome in the form of:
- Bug fixes, 
- Improvements, 
- Documentation.

Any contribution submitted to this project is deemed to be provided 
under the project's MIT license, without additional restrictions.

By submitting a contribution, you warrant that:
- You are the author of the contribution or have the necessary rights, 
- The contribution does not violate any third-party rights, 
- The contribution is provided under the project's MIT license. 
- No contributions can be accepted under a different or incompatible license.

## Contribution process

### Before pushing a PR

Be sure to not forget any migrations and check they are part of your commit
```bash
poetry run ./manage.py makemigrations
```

Clean the backend code
```bash
# You should run Pylint regularly when coding to get tips and avoid bad patterns
poetry run pylint backend
# Also don't forget to use black in order to unify code style
poetry run black backend
```
_If you use VSCode, you can add `"python.formatting.provider": "black"` to your .vscode/settings.json_


Make sure the frontend still build
```bash
cd frontend
npm run build
```

Add test to cover your changes and make sure all tests runs clear.

Update documentation to cover your changes (in `frontend/docs`).
