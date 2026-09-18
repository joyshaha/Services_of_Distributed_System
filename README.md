# Kubernetes Hands-on:
```
# check docker
sudo dockerd > /tmp/dockerd.log 2>&1 &
docker info

# create your Kubernetes cluster:
kind create cluster --name learning

# Check the cluster:
kubectl cluster-info
kubectl get nodes

# Deploy: 
kubectl apply -f kubernetes/nginx.yaml

# Constantly used commands:
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get all

# Inspect a pod:
kubectl describe pod <pod-name>

# View logs:
kubectl logs <pod-name>

Watch pods:
kubectl get pods -w

Scale Nginx:
kubectl scale deployment nginx --replicas=5


# local testing (Port-forward):
kubectl port-forward service/nginx-service 8080:80

# open/vist:
http://localhost:8080

remove everything:
kubectl delete -f kubernetes/nginx.yaml
kind delete cluster --name learning

```

