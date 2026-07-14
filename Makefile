# ============================================================
# 构建 & 推送 & 部署 脚本
# 用法:
#   make build         构建 Docker 镜像
#   make push          推送镜像到 Registry
#   make deploy        部署到 K8s
#   make all           一键构建+推送+部署
# ============================================================

# ---- 可配置变量 ----
REGISTRY         ?= 148286033932.dkr.ecr.cn-north-1.amazonaws.com.cn
IMAGE_NAME       ?= $(REGISTRY)/pontocare/pontocare-operation-web
IMAGE_TAG        ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo latest)
DOCKERFILE_DIR   ?= ./docker
BUILD_MODE       ?= prod
K8S_DIR          ?= ./k8s
NAMESPACE        ?= pontocare

# ---- 派生变量 ----
FULL_IMAGE       := $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: build push deploy all clean

# ---- Docker 构建 ----
build:
	docker build \
	  --build-arg BUILD_MODE=$(BUILD_MODE) \
	  -t $(FULL_IMAGE) \
	  -f $(DOCKERFILE_DIR)/Dockerfile \
	  .

# ---- 推送镜像 ----
push:
	docker push $(FULL_IMAGE)

# ---- 部署到 K8s ----
deploy:
	cd $(K8S_DIR) && \
	  kustomize edit set image $(IMAGE_NAME):latest=$(FULL_IMAGE) && \
	  kubectl apply -k . && \
	  kubectl rollout status deploy/pontocare-operation-web -n $(NAMESPACE) --timeout=120s

# ---- 一键完成 ----
all: build push deploy

# ---- 清理 Docker 构建缓存 ----
clean:
	docker builder prune -f
