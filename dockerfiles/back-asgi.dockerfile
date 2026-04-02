FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_CACHE_DIR=/opt/.cache/pypoetry
ENV ENV=build

# Set work directory
WORKDIR /opt

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# TODO: remove following!!
COPY django-extension django-extension
COPY metadatax metadatax

# Copy project
COPY osmose-app/pyproject-docker.toml pyproject.toml
COPY osmose-app/poetry.lock .
COPY osmose-app/manage.py .
COPY osmose-app/backend backend

# Install Python dependencies
RUN pip install --no-cache-dir  poetry
RUN poetry lock
RUN poetry install --only main --no-root

RUN mkdir -p staticfiles
RUN chmod -R o+rw .

# Expose port
EXPOSE 8000

# Default command (overridden by docker-compose)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]
