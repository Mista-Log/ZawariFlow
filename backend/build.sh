#!/usr/bin/env bash
set -e

uv sync

uv run python manage.py collectstatic --no-input
uv run python manage.py migrate