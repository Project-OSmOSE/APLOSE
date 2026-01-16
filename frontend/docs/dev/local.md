# Local installation

## Preparation

Pull the project
```shell
git clone https://github.com/Project-OSmOSE/osmose-app.git
```

Be sure to have Python 3.12 installed.
We recommend setting up a virtual environment for the project.

You will need poetry as package manager:
```shell
pip install poetry
```

### Prepare the database

The database must be a PostgreSQL. For now, we do not use `postgis` features.

We recommend setting up a database in a docker container:

```shell
docker run --name devdb -e POSTGRES_PASSWORD=postgres -p 127.0.0.1:5432:5432 -d postgis/postgis
docker start devdb
```

### Install the project

```shell
# Backend
poetry install
poetry run python ./manage.py migrate   # Migrate the database (the database container must be started)
poetry run python ./manage.py see       # Seed the database (the database container must be started)

# Frontend
cd frontend
npm install
```

### Possible .env variable

```
ENV=                # either "development" or "production", used for backend.api.settings
STAGING=            # "true" if we are in staging, used in backend/start.sh to install dev libraries
SECRET_KEY=         # see https://docs.djangoproject.com/en/3.2/ref/settings/#secret-key
OSMOSE_HOST=        # "osmose.ifremer.fr" for production, use what you want for staging and localhost
OSMOSE_DB_USER=     # database username
OSMOSE_DB_PWD=      # database password
HTTPS_PORTAL_STAGE= # see https://github.com/SteveLTN/https-portal, use "local" to test on your machine
OSMOSE_SENTRY_URL=  # if you use https://sentry.io (more for staging and production)
```

<br/>

## Run

Run backend:
```shell
poetry run python ./manage.py runserver
```

Run frontend:
```shell
cd frontend
npm run dev
```

Run documentation:
```shell
cd frontend
npm run docs:dev
```

<br/>

## Test

Test backend:
```shell
poetry run python ./manage.py test
```

Test frontend:
```shell
cd frontend

# Component testing
#npm run test:components    # None written for now

# End-to-end testing
npm run test:e2e
```