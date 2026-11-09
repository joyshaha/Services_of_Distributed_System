REGISTRY:=docker.io
REGISTRY_NAME:=joy7140

NETWORK_NAME:=svc-network
SERVICE_NAME:=loadbalancer
IMG_NAME:=${REGISTRY_NAME}/${SERVICE_NAME}
IMG_TAG:=v1.0.1

PULL_IMAGE:=${IMG_NAME}:${IMG_TAG}

all: docker-login docker-build-go docker-build-fastapi docker-build-express docker-build-loadbalancer

docker-login:
	@ echo "Logging into $(REGISTRY)..."
	@ docker login -u $$DOCKER_USERNAME -p $$DOCKER_PASSWORD

docker-build-go: docker-login
	@ docker buildx build -t ${REGISTRY_NAME}/go:${IMG_TAG} ./microservice/service3
	@ docker push ${REGISTRY_NAME}/go:${IMG_TAG}

docker-build-fastapi: docker-login
	@ docker buildx build -t ${REGISTRY_NAME}/fastapi:${IMG_TAG} ./microservice/service2
	@ docker push ${REGISTRY_NAME}/fastapi:${IMG_TAG}

docker-build-express: docker-login
	@ docker buildx build -t ${REGISTRY_NAME}/express:${IMG_TAG} ./microservice/service1
	@ docker push ${REGISTRY_NAME}/express:${IMG_TAG}

docker-build-loadbalancer: docker-login
	@ docker buildx build -t ${REGISTRY_NAME}/loadbalancer:${IMG_TAG} ./microservice/loadbalancer
	@ docker push ${REGISTRY_NAME}/loadbalancer:${IMG_TAG}

