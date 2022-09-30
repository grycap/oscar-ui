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

## Licensing

OSCAR-UI is licensed under the Apache License, Version 2.0. See
[LICENSE](https://github.com/grycap/scar/blob/master/LICENSE) for the full
license text.