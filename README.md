# Device Microservices Backend Deployment

## Tổng quan
Hệ thống được triển khai theo mô hình **GitOps** với ArgoCD, **Autoscaling** bằng Karpenter, **Observability** qua Grafana & Prometheus, và **CI/CD** sử dụng GitHub Actions + Docker Registry.

---

## 1. Triển khai ArgoCD
**Mục tiêu:** Quản lý GitOps, đồng bộ manifest từ GitHub vào Kubernetes Cluster.

### Bước 1: Deploy ArgoCD
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
````

### Bước 2: Đăng nhập ArgoCD

```bash
# Lấy password admin
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d

# Forward port
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Truy cập tại: [https://localhost:8080](https://localhost:8080)

### Bước 3: Tạo Application & Project

* Tạo file `application.yaml` và `project.yaml` trong repo manifest.

### Bước 4: Kiểm tra trong ArgoCD UI

* Vào UI để xem trạng thái `Synced/Healthy`.

---

## 2. Triển khai Karpenter

**Mục tiêu:** Tự động scale node theo nhu cầu workload.

### Bước 1: Tạo manifest

* **EC2NodeClass**: định nghĩa AMI, IAM Role, subnet, security group.
* **NodePool**: định nghĩa chính sách autoscale, instance type, capacity type.

### Bước 2: Cài đặt Helm chart

```bash
helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter \
  --namespace karpenter --create-namespace \
  --version <KARPENTER_VERSION> \
  --set "serviceAccount.annotations.eks\.amazonaws\.com/role-arn=<KARPENTER_IAM_ROLE_ARN>" \
  --set "settings.clusterName=<CLUSTER_NAME>" \
  --set "settings.interruptionQueueName=<SQS_QUEUE_NAME>"
```

---

## 3. Triển khai Grafana và Prometheus

**Mục tiêu:** Quan sát hệ thống (Monitoring & Observability).

### Bước 1: Thêm repo Helm

```bash
helm repo add grafana-charts https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### Bước 2: Cài đặt Prometheus & Grafana

* Tạo file `prometheus-values.yaml` và `grafana-values.yaml` để override cấu hình.

```bash
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring -f prometheus-values.yaml
helm install grafana grafana-charts/grafana -n monitoring -f grafana-values.yaml
```

### Bước 3: Lấy mật khẩu admin Grafana

```bash
kubectl get secret --namespace monitoring grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode
```

---

## 4. CI/CD Workflow

**Mục tiêu:** Tự động build, push và deploy microservices.

### Bước 1: Quản lý Secret

* Thêm các **Secret** trong GitHub repo để lưu:

  * API keys
  * DB credentials
  * Env variables
* Tránh hard-code trong source code.

### Bước 2: Flow CI/CD

1. Developer push code mới lên GitHub.
2. GitHub Actions pipeline:

   * Build Docker image.
   * Push image lên Docker Registry (ECR/GHCR).
   * Update giá trị `image.tag` trong repo manifest.
3. ArgoCD đồng bộ manifest → Kubernetes pull image mới và deploy.

---

## Sơ đồ luồng triển khai

```mermaid
flowchart TD
    Dev[Developer] -->|Push code| GitHub[GitHub Repo]
    GitHub -->|CI/CD Build & Push| Registry[Docker Registry]
    GitHub -->|Update manifests| ManifestRepo[Manifest Repo]
    ManifestRepo -->|GitOps Sync| ArgoCD[ArgoCD Controller]
    ArgoCD -->|Apply manifests| K8s[Kubernetes Cluster]
    K8s -->|Autoscale Nodes| Karpenter[Karpenter]
    K8s -->|Metrics & Logs| Prometheus[Prometheus]
    Prometheus --> Grafana[Grafana Dashboard]



