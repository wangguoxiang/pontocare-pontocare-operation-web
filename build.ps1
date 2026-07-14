<#
.SYNOPSIS
    Pontocare Operation Web - 构建 / 推送 / 部署 脚本
.DESCRIPTION
    用法:
      .\build.ps1 build              Docker 构建镜像
      .\build.ps1 push               推送镜像到 Registry
      .\build.ps1 deploy             部署到 K8s
      .\build.ps1 all                一键构建+推送+部署
      .\build.ps1 build -Tag v1.0.0  指定版本号构建
.PARAMETER Action
    build | push | deploy | all
.PARAMETER Tag
    镜像标签，默认取 git 短 hash，获取失败则用 latest
.PARAMETER Mode
    构建模式: prod | uat | test，默认 prod
#>

param(
    [Parameter(Position = 0, Mandatory = $false)]
    [ValidateSet('build', 'push', 'deploy', 'all', 'clean')]
    [string]$Action = 'build',

    [Parameter(Mandatory = $false)]
    [string]$Tag,

    [Parameter(Mandatory = $false)]
    [ValidateSet('prod', 'uat', 'test')]
    [string]$Mode = 'prod'
)

# ===== 配置区 =====
$REGISTRY   = "148286033932.dkr.ecr.cn-north-1.amazonaws.com.cn"
$IMAGE_NAME = "${REGISTRY}/pontocare/pontocare-operation-web"
$NAMESPACE  = "pontocare"
$K8S_DIR    = Join-Path $PSScriptRoot "k8s"
$DOCKER_DIR = Join-Path $PSScriptRoot "docker"

# ===== 自动获取镜像标签 =====
if (-not $Tag) {
    try {
        $Tag = git rev-parse --short HEAD 2>$null
        if (-not $Tag) { $Tag = "latest" }
    } catch {
        $Tag = "latest"
    }
}

$FULL_IMAGE = "${IMAGE_NAME}:${Tag}"

# ===== 颜色输出 =====
function Write-Info  { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Ok    { Write-Host "[ OK ] $args" -ForegroundColor Green }
function Write-Err   { Write-Host "[ERROR] $args" -ForegroundColor Red }
function Write-Step  { Write-Host "`n>>> $args" -ForegroundColor Yellow }

# ===== Action 实现 =====

function Invoke-Build {
    Write-Step "Docker 构建: ${FULL_IMAGE}"
    $result = docker build `
        --build-arg "BUILD_MODE=$Mode" `
        -t $FULL_IMAGE `
        -f (Join-Path $DOCKER_DIR "Dockerfile") `
        $PSScriptRoot 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        Write-Err "构建失败 (exit=$exitCode)"
        $result | Out-String | Write-Host -ForegroundColor Red
        exit $exitCode
    }
    Write-Ok "构建成功: ${FULL_IMAGE}"
}

function Invoke-Push {
    Write-Step "推送镜像: ${FULL_IMAGE}"
    docker push $FULL_IMAGE 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Err "推送失败"
        exit $LASTEXITCODE
    }
    Write-Ok "推送成功"
}

function Invoke-Deploy {
    Write-Step "部署到 K8s (namespace=${NAMESPACE})"

    # 1. 更新 kustomization 中的镜像标签
    $kustFile = Join-Path $K8S_DIR "kustomization.yaml"
    if (Test-Path $kustFile) {
        Write-Info "更新镜像标签: $FULL_IMAGE"
        & kustomize edit set image "${IMAGE_NAME}:latest=${FULL_IMAGE}" --kustomization $kustFile 2>&1 | Out-Null
    }

    # 2. 部署
    Write-Info "执行 kubectl apply -k ${K8S_DIR}"
    & kubectl apply -k $K8S_DIR 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Err "kubectl apply 失败"
        exit $LASTEXITCODE
    }

    # 3. 等待 rollout 完成
    Write-Info "等待 rollout 完成 ..."
    & kubectl rollout status deploy/pontocare-operation-web -n $NAMESPACE --timeout=120s 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Err "rollout 超时或失败"
        exit $LASTEXITCODE
    }
    Write-Ok "部署成功"
}

function Invoke-Clean {
    Write-Step "清理 Docker 构建缓存"
    docker builder prune -f 2>&1 | Out-Host
    Write-Ok "清理完成"
}

# ===== 主入口 =====

switch ($Action) {
    'build' { Invoke-Build }
    'push'  { Invoke-Push }
    'deploy' { Invoke-Deploy }
    'all' {
        Invoke-Build
        Invoke-Push
        Invoke-Deploy
    }
    'clean' { Invoke-Clean }
}

Write-Ok "操作完成"
