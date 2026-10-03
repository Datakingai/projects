# Kubernetes website starter

A dependency-free sample website with container packaging and Kubernetes hosting manifests. This folder is independent of the repository's other projects.

**Status:** source configuration only. No cloud cluster, DNS record, TLS certificate, container registry image, or public deployment has been provisioned. Local HTTP and manifest consistency checks are possible independently; live Kubernetes deployment requires cluster access.

## What is included
- A sample website served on port 8080 with a health endpoint.
- Two replicas, rolling updates, HTTP probes, CPU/memory requests and limits, a disruption budget, and an unprivileged read-only container.
- Optional TLS Ingress and CPU autoscaling.
- A two-node local kind cluster configuration.

This is a stateless website starter, not a database or user account backend. Replace public/index.html to change the website; add application features separately.

## Run directly
From this folder, install Node.js 24 and run:
```sh
npm start
```
Open http://localhost:8080. /healthz should return ok.

## Local Kubernetes demonstration
Prerequisites: Docker, kind, and kubectl. Run from this folder:
```sh
kind create cluster --name website-demo --config kind.yaml
docker build -t website:local .
kind load docker-image website:local --name website-demo
kubectl --context kind-website-demo apply -f k8s/base.yaml
kubectl --context kind-website-demo -n website rollout status deployment/website --timeout=180s
kubectl --context kind-website-demo -n website port-forward service/website 8080:80
```
Open http://localhost:8080 while port forwarding runs. This creates a local development cluster, not a public website.

Remove the demonstration cluster:
```sh
kind delete cluster --name website-demo
```

## Deploy to an existing hosted Kubernetes cluster
You need a running cluster, its kubectl credentials, a registry you can push to, and an installed maintained ingress controller. Cloud nodes, load balancers, registry storage, and domains can incur provider charges. This starter does not create cloud resources.

1. Select and verify the intended cluster context before any mutation:
```sh
kubectl config current-context
kubectl cluster-info
```
2. Build and push the image; use your actual registry location and a unique version tag:
```sh
docker build -t YOUR_REGISTRY/website:v1 .
docker push YOUR_REGISTRY/website:v1
```
For an ARM cluster, build an ARM image or a multi-platform image. For reproducible production builds, pin the base image to a verified digest.
3. Edit k8s/base.yaml to replace website:local with the pushed image, preferably its digest. Set imagePullPolicy to Always for mutable tags. If the registry is private, create an image pull Secret in namespace website and add imagePullSecrets to the pod spec; never commit registry credentials.
4. Validate against your cluster and deploy:
```sh
kubectl create namespace website --dry-run=client -o yaml | kubectl apply -f -
kubectl apply --dry-run=server -f k8s/base.yaml
kubectl apply -f k8s/base.yaml
kubectl -n website rollout status deployment/website --timeout=180s
kubectl -n website get pods,service
kubectl -n website port-forward service/website 8080:80
```
5. Copy k8s/ingress.example.yaml to a local configured file. Set your actual domain and the installed controller's IngressClass. Point DNS to that controller's public endpoint. Create a TLS Secret named website-tls in namespace website using a certificate for your domain, or integrate your chosen certificate manager. Configure HTTPS redirects using that controller's documented settings. The example does not install a controller or issue certificates.
6. Apply your configured ingress file and inspect its endpoint:
```sh
kubectl apply -f YOUR_CONFIGURED_INGRESS_FILE
kubectl -n website get ingress
```
Then verify your domain over HTTPS and confirm its certificate is valid. A missing controller, wrong DNS, private load balancer, or missing TLS Secret prevents correct public access.

## Optional autoscaling
Install or enable your provider's resource metrics API first, verify kubectl top pods works, then:
```sh
kubectl apply -f k8s/autoscaling.optional.yaml
kubectl -n website get hpa
```
Once HPA owns scaling, remove spec.replicas from the deployment manifest before subsequent applies so it does not reset HPA's count. HPA scales pods, not cluster nodes; ensure there is enough node capacity.

## Updates and rollback
Build and push a new uniquely tagged image, then:
```sh
kubectl -n website set image deployment/website website=YOUR_REGISTRY/website:v2
kubectl -n website rollout status deployment/website --timeout=180s
```
Also update the image in your manifest to keep source in sync. If necessary:
```sh
kubectl -n website rollout undo deployment/website
```

## Removal
After checking that the namespace contains only this starter:
```sh
kubectl delete namespace website
```
This deletes everything in the namespace. It does not remove your cloud cluster, external ingress controller, registry images, DNS records, or provider charges.

## Hosting outside Kubernetes
The same Dockerfile can host this sample website on a connected container hosting service, with this folder as its build context and port 8080 (or its PORT environment variable). Such a deployment would host the website, not create a Kubernetes cluster.

## References
- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/
- https://kubernetes.io/docs/concepts/services-networking/ingress/
- https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/
- https://kind.sigs.k8s.io/docs/user/quick-start/
