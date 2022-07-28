# OSCAR-UI - A UI for the OSCAR framework
[![License](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## Introduction
OSCAR-UI is a Vue.js-based user interface for the [OSCAR](https://github.com/grycap/oscar) framework. It is intended to be run inside a Kubernetes cluster in order to provide a unified web-based graphical user interface to interact with the [OSCAR Manager](https://o-scar.readthedocs.io/en/latest/intro.html#architecture) and the underlying data-storage back-end (e.g. Minio).

Note: In the src/env.js path there are variables that the web needs to connect with the api, and with the EGI Check-in client. Also to change the values of the MINIO client, go to src/components/services.js

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Make it works in localhost installation 

To simplify the development process of OSCAR-UI, have access to the dashboard to see and control buckets and services. OSCAR must be installed, highly recommended to have it in localhost.

```
curl -sSL http://go.oscar.grycap.net | bash
```

Once OSCAR and OSCAR-UI are both working, in `localhost:8080` will appear OSCAR UI, but you can not sign in. So have to edit an OSCAR configuration file with the following command:

```
kubectl edit ingress oscar -n oscar
```

Remember that it uses vim editor. So put the cursor in the Annotations section. Press the `i` key and paste with `Ctrl+Mayus+V` the text in the box below. In order to save and exit the file, press `Esc` and `:wq`

```
nginx.ingress.kubernetes.io/cors-allow-headers: '*'
nginx.ingress.kubernetes.io/cors-allow-methods: PUT, GET, POST, OPTIONS, DELETE
nginx.ingress.kubernetes.io/cors-allow-origin: '*'
nginx.ingress.kubernetes.io/enable-cors: "true"
```

Now introducing the user and password of OSCAR will sign in but will not see or manage MinIO buckets.


Change services.js file. In `created` section comment the variables `minio_endpoint`, `minio_port` and `minio_useSSL`. Redirect the MinIO endpoint to localhost, port to 30300 and ssl use to false.

```
var minio_endpoint = "localhost";
var minio_port = "30300"
var minio_useSSL = false;
//var minio_endpoint = localStorage.getItem("endpoint");
//var minio_port = localStorage.getItem("port");
//var minio_useSSL = localStorage.getItem("useSSL");
```

Now the MinIo storage tab can see the buckets.

## Licensing

OSCAR-UI is licensed under the Apache License, Version 2.0. See
[LICENSE](https://github.com/grycap/scar/blob/master/LICENSE) for the full
license text.