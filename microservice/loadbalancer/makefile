REGISTRY:=docker.io
REGISTRY_NAME:=joy7140

NETWORK_NAME:=svc-network
SERVICE_NAME:=loadbalancer
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
	@ docker run --name ${SERVICE_NAME} -p 80:80 ${IMG_NAME}:${IMG_TAG}
	
docker_run_network:
# 	@ docker network create ${NETWORK_NAME}
# 	@ docker network connect ${NETWORK_NAME} ${SERVICE_NAME}
	@ docker run --name ${SERVICE_NAME} --network ${NETWORK_NAME} -p 80:80 -d ${IMG_NAME}:${IMG_TAG}

docker_rm:
	@ docker stop ${SERVICE_NAME}
	@ docker rm -f ${SERVICE_NAME}
# 	@ docker network rm ${NETWORK_NAME}