FROM ubuntu:24.04

ARG KUBECTL_VERSION=v1.34.0
ARG KIND_VERSION=v0.33.0
ARG HELM_VERSION=v3.18.6

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    make \
    jq \
    vim \
    telnet \
    dnsutils \
    tcpdump \
    net-tools \
    bash-completion \
    ca-certificates \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*


# ---------------------------------------------------
# Docker CLI + Docker daemon
# ---------------------------------------------------

RUN curl -fsSL https://get.docker.com | sh


# ---------------------------------------------------
# kubectl
# ---------------------------------------------------

RUN ARCH="$(dpkg --print-architecture)" \
    && curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/${ARCH}/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl


# ---------------------------------------------------
# kind
# ---------------------------------------------------

RUN ARCH="$(dpkg --print-architecture)" \
    && if [ "$ARCH" = "amd64" ]; then KIND_ARCH="amd64"; \
       elif [ "$ARCH" = "arm64" ]; then KIND_ARCH="arm64"; \
       else echo "Unsupported architecture: $ARCH" && exit 1; fi \
    && curl -Lo /usr/local/bin/kind \
       "https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-linux-${KIND_ARCH}" \
    && chmod +x /usr/local/bin/kind


# ---------------------------------------------------
# Helm
# ---------------------------------------------------

RUN ARCH="$(dpkg --print-architecture)" \
    && curl -fsSL \
       "https://get.helm.sh/helm-${HELM_VERSION}-linux-${ARCH}.tar.gz" \
       -o /tmp/helm.tar.gz \
    && tar -xzf /tmp/helm.tar.gz -C /tmp \
    && mv "/tmp/linux-${ARCH}/helm" /usr/local/bin/helm \
    && rm -rf /tmp/helm.tar.gz "/tmp/linux-${ARCH}"


# ---------------------------------------------------
# kubectl completion
# ---------------------------------------------------

RUN echo 'source <(kubectl completion bash)' >> /home/vscode/.bashrc \
    && echo 'alias k=kubectl' >> /home/vscode/.bashrc \
    && echo 'complete -o default -F __start_kubectl k' >> /home/vscode/.bashrc

WORKDIR /workspace