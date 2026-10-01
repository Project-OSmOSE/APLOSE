# Back dockerfile
FROM python:3.12-slim

WORKDIR /opt

RUN mkdir -p staticfiles

RUN pip install --no-cache-dir  poetry

COPY pyproject.toml .
COPY poetry.lock .

ENV POETRY_CACHE_DIR=/opt/.cache/pypoetry
RUN if [ "$STAGING" = "true" ]; then \
      poetry install --no-root; \
    else \
      poetry install --only main --no-root; \
    fi

COPY manage.py .
COPY backend backend

ENV ENV=build

RUN chmod -R o+rw .

EXPOSE 8000

CMD ["backend/start.sh"]
