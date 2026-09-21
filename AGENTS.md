# Repository guide for coding agents

## Purpose and layout

This is a hands-on microservices and Kubernetes learning repository. Its progression
is local processes -> Docker -> Docker Compose -> Kubernetes. Keep examples small
and understandable; avoid introducing production infrastructure without task scope.

- `README.md`: learning notes, cluster commands, and architecture images in `asset/`.
- `kubernetes/nginx.yaml`: standalone Nginx Deployment and ClusterIP Service demo.
- `microservice/service1/`: Node.js Express (CommonJS), Axios client, port 3000.
- `microservice/service2/`: Python 3.12+ FastAPI; HTTP app is `main.py`, port 8000.
- `microservice/docker-compose.yml`: `svc1` and `svc2` on `svc-network`.
- `microservice/loadbalancer/`: optional Nginx TCP (`stream`) proxy on port 80;
  currently commented out in Compose, with only `svc1:3000` enabled upstream.
- Each service has a Dockerfile, makefile, request examples, and Kubernetes manifests.

## Application contracts

Both APIs expose `GET /` and `POST /add` accepting JSON `{ "a": 10, "b": 20 }`.
Successful addition returns `{ "a": 10, "b": 20, "result": 30 }`.
Service1 also exposes `POST /service-calling`, which calls Service2 `/add` through
`client.js`. Its current success response nests the client result:
`{ "a": 10, "b": 20, "result": { "success": true, "result": 30 } }`.
Preserve contracts unless changing them is part of the requested task.

## Development commands

Run commands from the indicated directory. Use existing dependency manifests;
do not rerun `npm init` or `uv init` from the setup notes.

```sh
# microservice/service1/
npm ci
npm start
# Optional reload: npm run dev

# microservice/service2/
uv sync --frozen
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# microservice/
docker compose config --quiet
make up
make ps
```

Compose is the existing path for service-to-service DNS (`svc2`). Running both
processes locally does not by itself make that hostname resolve. Read the current
client configuration before claiming the local cross-service call works.

Keep `package-lock.json` consistent with Node dependency edits. For Python,
`pyproject.toml` and `uv.lock` drive the active Docker build; `requirements.txt`
is an alternative pip workflow. Update applicable dependency files deliberately.

## Validation

There is no implemented automated test suite; `npm test` is a placeholder that
exits with failure. Choose checks appropriate to the change and report what ran.
For documentation-only changes, review the diff and run `git diff --check`.
For JavaScript changes, syntax checks include `node --check server.js` and
`node --check client.js` from Service1. Validate Compose edits with
`docker compose config --quiet` from `microservice/`.

For API changes, use the `request.http` files or smoke requests against running
services. Check both direct addition routes, cross-service addition, invalid input,
and downstream failure behavior when relevant. Example from any directory:

```sh
curl -sS -H 'Content-Type: application/json' \
  -d '{"a":10,"b":20}' http://localhost:3000/add
curl -sS -H 'Content-Type: application/json' \
  -d '{"a":10,"b":20}' http://localhost:8000/add
curl -sS -H 'Content-Type: application/json' \
  -d '{"a":10,"b":20}' http://localhost:3000/service-calling
```

Before Kubernetes work, inspect the selected context and namespace. Check Service
selectors against pod labels, namespace alignment, service DNS and exposed ports,
image availability, and NodePort uniqueness. Use an explicitly selected learning
cluster for runtime validation when deployment is in scope. Do not claim deployment
success from YAML inspection alone.

## Known pitfalls in the current examples

Recheck these against the files; they describe the current state, not requirements
to preserve or instructions to fix unrelated code.

- Service1 hardcodes `http://svc2:8000/add`; Compose's `SVC2_URL` is unused.
  Kubernetes instead defines `service2-service` on service port 80.
- Application launch code fixes ports at 3000/8000; `PORT` environment entries do
  not currently configure those listeners.
- Service1's client catches downstream errors without returning an error result
  or rethrowing; its route can return HTTP 200 with no `result` field.
- Microservice Kubernetes Service selectors use `app: service1-deployment` or
  `app: service2-deployment`, while pod labels use `service1` or `service2`.
- Deployment files embed Services, while separate Service files use the same
  names, specify `devops`, and change the type to NodePort. Select the intended
  manifest set and namespace rather than blindly applying every file.
- Both separate NodePort Services request 30001. Service2 uses
  `imagePullPolicy: Never`, requiring its image to exist on the scheduled node.
- Service1's Kubernetes make recipes use separate-shell `cd` and the wrong
  deployment extension (`.yaml` instead of `.yml`). Service2 recipes contain
  literal namespace/pod placeholders. Inspect commands before running them.
- Some READMEs name `docker_network_run`; actual targets are `docker_run_network`.

## Change discipline

Inspect `git status` before editing and preserve existing user changes. Keep edits
scoped to the request and update nearby documentation when behavior changes.

Service-level `make all` builds, logs in, and pushes to the configured Docker Hub
account. Use `make docker_build` for build-only work. Publish images only when
authorized by the task; never replace password placeholders with committed secrets.
The Compose `make clean` removes volumes/images and runs host-wide Docker pruning;
do not use it as routine validation. Limit cleanup to resources created for the task.
