# Micro-Service Architecture:
### Call Service 2 from Service 1 
(use svc1 as LoadBalancer service-type and svc2 as NordPort or ClusterIP service-type)


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


* Run with docker compose (network binding)

```
Using makefile:
- make up

End:
- make down
```