# Front dockerfile

# ── Stage 1 : GraphQL generation ──────────────────────────────────────────────
FROM python:3.12-slim as graphql-gen

WORKDIR /opt

RUN pip install --no-cache-dir poetry

COPY pyproject.toml .
COPY poetry.lock .

ENV POETRY_CACHE_DIR=/opt/.cache/pypoetry
RUN poetry install --only main --no-root

COPY manage.py .
COPY backend backend

# Schema generation from Django
ENV ENV=build
RUN poetry run python ./manage.py graphql_schema \
      --schema backend.schema.schema \
      --out /opt/schema.graphql

# ── Stage 2 : Build app ───────────────────────────────────────────────────────
FROM node:24 as build-app

WORKDIR /opt

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

COPY frontend .

# Get generated schema
COPY --from=graphql-gen /opt/schema.graphql ./schema.graphql
RUN npm run graphql:generate

# Used to get git version in React view
COPY package.json global-package.json

RUN PUBLIC_URL=/app npm run build

RUN npm run docs:build

# ── Stage 3 : Build website ───────────────────────────────────────────────────
FROM node:24 as build-website

WORKDIR /opt

COPY website/package.json .
COPY website/package-lock.json .

RUN npm install

COPY website .

# Get generated schema
COPY --from=graphql-gen /opt/schema.graphql ./schema.graphql
RUN npm run graphql:generate

RUN npm run build

# ── Stage 4 : Deploy ──────────────────────────────────────────────────────────
FROM nginxinc/nginx-unprivileged:1.20-alpine

ARG UID=101
ARG GID=101

COPY ./dockerfiles/nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build-app /opt/dist /usr/share/nginx/app
COPY --from=build-app /opt/docs/.vitepress/dist /usr/share/nginx/doc
COPY --from=build-website /opt/build /usr/share/nginx/website

USER 0

RUN apk --no-cache add shadow # needed to use usermod and groupmod
RUN usermod -u $UID -o nginx
RUN groupmod -g $GID -o nginx
RUN find / -user 101 -exec chown -h nginx {} \;
RUN find / -group 101 -exec chgrp -h nginx {} \;

USER $UID
