### UVicorn Dockerfile pip install

# FROM python:3.12-slim

# WORKDIR /app

# COPY requirements.txt .

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 8000

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


### uv project Dockerfile

FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy dependency files first for Docker caching
COPY pyproject.toml uv.lock ./

# Install dependencies only
RUN uv sync --frozen --no-dev --no-install-project

# Copy application
COPY . .

EXPOSE 8000

CMD ["uv", "run", "--no-sync", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]