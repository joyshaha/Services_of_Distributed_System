# Nginx frontend and API proxy

Open the page through Nginx at http://localhost (not as a local HTML file).
Browser JavaScript runs on your computer, outside Docker's network. Container
names such as `svc1` and `svc2` are resolved inside Docker, not by your browser.

The page sends same-origin requests to Nginx:

- `/api/service1/service-calling` forwards to `http://svc1:3000/service-calling`.
- `/api/service2/add` forwards to `http://svc2:8000/add`.

Both buttons POST JSON `{ "a": 10, "b": 20 }` and display the JSON response.
Nginx removes the corresponding `/api/service1/` or `/api/service2/` prefix.
No browser CORS configuration is needed for these same-origin requests.

## Run

Start `svc1` and `svc2` first. All three containers must share the same Docker
network, with `svc1` and `svc2` available as names or network aliases.
From this directory, for a new loadbalancer container:

```sh
make docker_build
make docker_run_network NETWORK_NAME=svc-network
```

Compose normally prefixes network names with its project name. If the backends
were started with Compose, use their actual network name instead of `svc-network`.
You can inspect it with:

```sh
docker inspect svc1 --format '{{json .NetworkSettings.Networks}}'
```

HTML and Nginx configuration are copied into the image at build time. After an
edit, rebuild and recreate your loadbalancer container to pick up the changes.
Avoid `make all` for local testing because it also logs in and pushes the image.
