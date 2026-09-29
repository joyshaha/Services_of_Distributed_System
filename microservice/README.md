# Micro-Service Architecture:
### * Loadbalancer for system call and serve UI 
### * Call Service 2 from Service 1
 
`Basic approach` - (use svc1 as LoadBalancer service-type and svc2 as NodePort or ClusterIP service-type) 
  
`Bare-metal approach` - (use svc1 as NodePort service-type and svc2 as NodePort or ClusterIP service-type, attach them with Application Loadbalancer(ALB/L7) or Network Loadbalancer(NLB/L4)) 

`Ingress approach` - (use svc1 as ClusterIP service-type and svc2 as ClusterIP service-type, ingress controller will connect all services with NodePort or Loadbalancer along as path routing ingress service. Network Loadbalancer(NLB/L4) is used for connecting multiple nodes of a cluster)


* Use makefile for load-balancer:
*** 
```
- Check index.html file of loadbalancer
- Initialize project with adding services api's
- Make sure loadbalancer nginx is running with docker
- Test the purpose is serving content is working fine
- Next, deploy loadbalancer with kubernates under a cluster
- Check all the pods, deployments replics's and services
```

* Use makefile for service 1:
*** 
```
- Check server.js file of service1
- Initialize project (npm init -y)
- Make sure service1 express server is running with docker
- Test the purpose is serving of adding two numbers
- Next, deploy service 1 with kubernates under a cluster
- Check all the pods, deployments replics's and services
```


* Use makefile for service 2:
*** 
```
- Check server.js file of service2
- Initialize project (uv init)
- Make sure service2 express server is running with docker
- Test the purpose is serving of adding two numbers
- Next, deploy service 2 with kubernates under a same or different cluster
- Check all the pods, deployments replics's and services
```

* Use makefile for service 3:
*** 
```
- Check main.go file of service3
- Initialize project (mise install and go mode download)
- Make sure service3 go server is running with docker
- Test the purpose is serving of substructing two numbers
- Next, deploy service 3 with kubernates under a same or different cluster
- Check all the pods, deployments replics's and services
```


* Run with docker compose (network binding)

```
Using makefile:
- make up

End:
- make down
```

Open http://localhost to use the Nginx frontend. The loadbalancer depends on
`svc1`, `svc2` and `svc3`, so Compose starts those containers first and their names are
available when Nginx resolves its upstreams. This controls startup order; it does
not wait for the APIs to be ready to handle requests.

After changing the frontend or Nginx configuration, run `make up` to rebuild
and recreate affected containers.
