# NGINX Ingress Controller with Kubernetes
(we can use HAProxy as well as alternative ingress controller)

## Architectural Design
![Logo](/asset/ingress.png)


This example routes HTTP requests for `api.loadbalancer.io` to Service1 using
the community **ingress-nginx** controller.

An Ingress defines host and path routing rules. The controller watches those
rules and configures NGINX to handle incoming requests.

```text
Client (Host: api.loadbalancer.io)
  -> ingress-nginx controller (HTTP port 80)
  -> service1-service (Service port 80)
  -> Service1 pod (application port 3000)
```

The community ingress-nginx project retired in March 2026. This directory is a
learning example; see the [official retirement announcement](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/)
for maintenance status and migration guidance.

## Files

| File | Purpose |
| --- | --- |
| [deploy.yaml](deploy.yaml) | Installs controller version `v1.15.1`, the `ingress-nginx` namespace, RBAC, admission webhook resources, a NodePort Service, and the `nginx` IngressClass. |
| [ingress.yaml](ingress.yaml) | Routes host `api.loadbalancer.io` and path `/` with `Prefix` matching to `service1-service:80`, using class `nginx`. |

The active Ingress uses `networking.k8s.io/v1`. The commented `v1beta1`
examples at the top of the file are historical and are not applied.

## Prerequisites

- A running learning cluster and `kubectl` configured to access it.
- Permissions to create namespaces, cluster RBAC, IngressClasses, and webhooks.
- Linux worker nodes able to pull the images specified in the manifests.
- Service1 running behind `service1-service` in the same namespace as the Ingress.

Run the following commands from this directory:

```sh
cd microservice/nginx-ingress-controller
kubectl config get-contexts
kubectl config use-context <learning-context>
kubectl config current-context
kubectl config view --minify -o 'jsonpath={.contexts[0].context.namespace}'
```

Replace `<learning-context>` with your cluster context. An empty namespace means
`default`. The examples below explicitly use `devops` for the application and
`ingress-nginx` for the controller.

## 1. Prepare Service1

Before deploying, review [Service1's deployment](../service1/deployment/deployment.yml).
It includes both a Deployment and a Service. For this example, set that embedded
Service's selector to `app: service1` to match the pod labels, and its type to
`ClusterIP`. It should expose port `80` with `targetPort: 3000`.

The checked-in selector is currently `app: service1-deployment`, which does not
match the pods. Its current type is `LoadBalancer`; an external backend load
balancer is unnecessary for this ingress example.

After making those edits:

```sh
kubectl create namespace devops --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n devops -f ../service1/deployment/deployment.yml
kubectl rollout status -n devops deployment/service1-deployment --timeout=180s
kubectl get -n devops service service1-service
kubectl get -n devops endpointslices -l kubernetes.io/service-name=service1-service
```

Ensure the image `joy7140/svc1:v1.0.1` is available to the cluster and the endpoint
slices contain ready pod addresses. Do not also apply the separate
`../service1/deployment/service.yml`: it defines the same Service as a NodePort
and would override this setup.

## 2. Install the controller

Check for an existing installation before applying this manifest:

```sh
kubectl get pods -A -l app.kubernetes.io/name=ingress-nginx
kubectl get ingressclass
```

If an existing controller already manages class `nginx`, reuse it and skip the
installation below. For a fresh learning cluster:

```sh
kubectl apply -f deploy.yaml
kubectl rollout status -n ingress-nginx deployment/ingress-nginx-controller --timeout=180s
kubectl get -n ingress-nginx pods,services,jobs
kubectl get ingressclass nginx
```

The admission jobs create a certificate and configure the validating webhook.
They have `ttlSecondsAfterFinished: 0`, so completed jobs may disappear immediately.
If applying an Ingress fails while the webhook initializes, check the controller
and webhook resources, then retry once ready.

## 3. Apply the routing rule

```sh
kubectl apply -n devops -f ingress.yaml
kubectl get -n devops ingress
kubectl describe -n devops ingress ingress-service1-service
```

`ingress.yaml` omits `metadata.namespace`, so `-n devops` puts it alongside its
backend Service. The controller can run in its separate namespace.
The `/` prefix forwards paths such as `/` and `/add` without rewriting them.
Only Service1 is configured as an ingress backend, and no TLS certificate is
configured in this Ingress.

## 4. Test locally

Forward a local port to the controller Service and leave this terminal running:

```sh
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
```

In another terminal, send the host header required by the routing rule:

```sh
curl -i -H 'Host: api.loadbalancer.io' http://127.0.0.1:8080/
curl -i -H 'Host: api.loadbalancer.io' \
  -H 'Content-Type: application/json' \
  -d '{"a":10,"b":20}' http://127.0.0.1:8080/add
```

The addition request should return HTTP 200 with:

```json
{"a":10,"b":20,"result":30}
```

These requests require no DNS changes. For browser access, add
`127.0.0.1 api.loadbalancer.io` to your local hosts file and visit
`http://api.loadbalancer.io:8080` while port forwarding runs. Remove that entry
when finished.

### Access through NodePort

The controller Service uses dynamically assigned NodePorts. Discover the HTTP
port and node addresses:

```sh
kubectl get -n ingress-nginx service ingress-nginx-controller \
  -o 'jsonpath={.spec.ports[?(@.name=="http")].nodePort}'
kubectl get nodes -o wide
curl -i -H 'Host: api.loadbalancer.io' http://<reachable-node-ip>:<http-node-port>/
```

Replace the placeholders with values reachable from your computer. Local clusters
running inside containers or VMs may need additional port mappings; port forwarding
is the simpler local test. Creating an Ingress does not create a DNS record.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| NGINX returns 404 | Send `Host: api.loadbalancer.io`; check that the Ingress exists and uses class `nginx`. |
| NGINX returns 503 | Check ready Service endpoints, selector `app: service1`, and namespace alignment. |
| Connection refused or timeout | Check controller readiness, the port-forward process, or node reachability and the assigned NodePort. |
| Admission webhook error | Inspect controller readiness, admission Service endpoints, and admission job logs if the jobs still exist. |
| `ImagePullBackOff` | Inspect pod events and verify image availability and registry access. |
| Ingress `ADDRESS` is empty | A bare-metal NodePort setup may leave this empty; test the reachable NodePort or port-forward route. |

```sh
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller --tail=100
kubectl get -n devops pods --show-labels
kubectl describe -n devops service service1-service
kubectl get -n devops endpointslices -l kubernetes.io/service-name=service1-service
kubectl get events -n ingress-nginx --sort-by=.metadata.creationTimestamp
```

The `/service-calling` route also depends on Service1's downstream client
configuration. Adding ingress does not resolve its existing Compose hostname
`svc2:8000` to the Kubernetes Service2 Service.

## Cleanup

Remove this example's routing rule:

```sh
kubectl delete -n devops -f ingress.yaml
```

Only if you installed the controller exclusively for this exercise and no other
applications use it, remove it with `kubectl delete -f deploy.yaml`. That manifest
also deletes the `ingress-nginx` namespace and its contents. Stop port forwarding
with Ctrl+C. The Service1 resources remain available for other exercises.

## References

- [Kubernetes Ingress concepts](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [Ingress NGINX repository and maintenance status](https://github.com/kubernetes/ingress-nginx)
