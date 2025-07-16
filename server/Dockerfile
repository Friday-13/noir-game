FROM python:3.12-slim AS base

WORKDIR /usr/app/server

RUN pip install --upgrade pip \
    && pip install poetry


RUN pip install poetry  \
  && poetry config virtualenvs.create false 

COPY pyproject.toml poetry.lock ./
RUN poetry install --only main --no-root --no-directory

COPY . .

RUN poetry install --only main

EXPOSE 8000

CMD uvicorn server.main:app --host 0.0.0.0  --port 8000 --reload
