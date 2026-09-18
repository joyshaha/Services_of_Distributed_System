REGISTRY:=docker.io
REGISTRY_NAME:=joy7140

NETWORK_NAME:=svc-network
SERVICE_NAME:=svc2
IMG_NAME:=${REGISTRY_NAME}/${SERVICE_NAME}
IMG_TAG:=v1.0.1

PULL_IMAGE:=${IMG_NAME}:${IMG_TAG}

DOCKER_USERNAME:=joy7140
DOCKER_PASSWORD:=<password>

all: docker_build docker_login docker_push

docker_build:
	@ docker buildx build -t ${IMG_NAME}:${IMG_TAG} .
# 	@ docker build --platform linux/amd64 -t ${IMG_NAME}:${IMG_TAG} .

docker_login:
	@ echo "Logging into $(REGISTRY)..."
	@ docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}

docker_push:
	@ echo "Pushing image ${IMG_NAME}:${IMG_TAG} to $(REGISTRY)..."
# 	@ docker tag ${IMG_NAME}:${IMG_TAG} ${REGISTRY}/${IMG_NAME}:${IMG_TAG}
	@ docker push ${IMG_NAME}:${IMG_TAG}

docker_pull:
	@ echo "Pulling image $(PULL_IMAGE)..."
	@ docker pull $(PULL_IMAGE)

docker_run:
	@ docker run --name ${SERVICE_NAME} -p 8000:8000 ${IMG_NAME}:${IMG_TAG}

docker_run_network:
# 	@ docker network create ${NETWORK_NAME}
	@ docker run --name ${SERVICE_NAME} --network ${NETWORK_NAME} -p 8000:8000 -d ${IMG_NAME}:${IMG_TAG}
	@ docker network connect ${NETWORK_NAME} ${SERVICE_NAME}

docker_rm:
	@ docker stop ${SERVICE_NAME}
	@ docker rm -f ${SERVICE_NAME}
	@ docker network rm ${NETWORK_NAME}

docker_network:
	@ docker network ls
	@ docker network inspect ${NETWORK_NAME}


# tag:=v1.0.1
# image_name:=svc2

# build:
# 	@ docker build -t $(image_name):$(tag) .

# run:
# 	@ docker run --name $(image_name) -p 8000:8000 $(image_name):$(tag)

# rm:
# 	@ docker stop $(image_name)
# 	@ docker rm -f $(image_name)


kube_deploy:
	@ kubectl apply -f deployment/deployment.yaml -n <namespace-name>

kube_delete_deploy:
	@ kubectl delete -f deployment/deployment.yaml -n <namespace-name>

kube_pods:
	@ kubectl get pods -n <namespace-name>

kube_svc:
	@ kubectl get svc -n <namespace-name>

kube_all:
	@ kubectl get all -A

kube_describe:
	@ kubectl describe pod -n <namespace-name> <pod-name>

kube_logs:
	@ kubectl logs -n <namespace-name> <pod-name>

kube_exec:
	@ kubectl exec -it -n <namespace-name> <pod-name> -- /bin/bash

kube_endpoints:
# 	@ kubectl get ep
	@ kubectl get endpoints -n default
# 	@ kubectl describe endpoints -n default <service-name>

kube_namespace:
	@ kubectl get namespaces

kube_create_namespace:
	@ kubectl create namespace <namespace-name>

kube_delete_namespace:
	@ kubectl delete namespace <namespace-name>