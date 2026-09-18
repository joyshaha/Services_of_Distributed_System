# Micro-Service Architecture:
### Service 1 ExpressJs

* Run locally with node

```
Install node:
- brew install node

Start project:
- npm init -y

Install dependencies:
- npm i axios express

Run mode:
- node server.js

Or
- npm start
- npm run dev

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