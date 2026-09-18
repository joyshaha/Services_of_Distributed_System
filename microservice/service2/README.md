# Micro-Service Architecture:
### Service 2 Fastapi
(For a modern FastAPI project, uv + pyproject.toml + uv.lock is a much nicer setup than maintaining a requirements.txt)

* Run locally with uv (You don't have to manually activate a virtual environment.)

```
Install uv:
- brew install uv

Start project:
- uv init

Add packages:
- uv add fastapi "fastapi[standard]" "uvicorn[standard]"

Run mode:
- uv run uvicorn main:app --reload

Development Mode Or FastAPI's CLI (with hot-reloading and auto-routing):
- uv run fastapi dev main.py

Production Mode Or FastAPI's CLI (optimized for speed and self-healing):
- uv run fastapi run main.py

```

* Run locally with pip

```
Virtual environment:
- python3 -m venv venv
- source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:
- pip install -r requirements.txt

Run mode:
- uvicorn main:app --reload

Or
- python3 main.py

```

* Run with docker

```
Using makefile:
- make all
- make docker_run

Or(if want same network with FQDN facilities)
- make docker_network_run

End/wrap:
- make docker_rm
```