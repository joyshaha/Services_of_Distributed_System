const axios = require("axios");

async function addNumbers(a, b) {
  try {
    /*
    - FQDN (Fully Qualified Domain Name) is a complete domain name that specifies the exact location of a resource within the DNS hierarchy. It includes the hostname and the domain name, providing a unique address for a specific resource on the internet or within a network.
    In a Docker network, services can communicate with each other using their container names as hostnames. For example, if you have two services named service1 and service2 running in the same Docker network, service1 can reach service2 by using the hostname service2.
    http://<container-name>:<port>
    
    In Kubernetes, services are discoverable by their DNS names. The DNS name for a service is typically in the format:
    <service-name>.<namespace>.svc.cluster.local
    
    In Localhost, When running services locally (e.g., on your development machine), you can use localhost or 127.0.0.1 as the hostname.
    http://localhost:8000
    
    In etc/hosts file entry for service2-service in service1 pod
    127.0.0.1 service2
    */
    const response = await axios.post("http://svc2:8000/add", {
      a,
      b,
    });

    console.log(response.data);
    // Handle the response as needed
    return { success: true, result: response.data.result };
  } catch (error) {
    console.error(
      "Request failed:",
      error.response?.data || error.message
    );
  }
}

module.exports = { addNumbers };
// addNumbers(10, 20);

// node client.js