FROM ubuntu:16.04
LABEL Name=OSCAR-UI Version=1.0.0

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y software-properties-common python-software-properties &&\
    LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php &&\
    apt-get update -y &&\
    apt-get install -y nginx curl gnupg2 supervisor &&\
    curl --silent --location https://deb.nodesource.com/setup_8.x |su - && \
    apt-get install -y nodejs build-essential unzip vim mc
    
RUN apt-get install -y gettext
COPY vue_app/. /usr/src/vue_app/.
RUN cd /usr/src/vue_app; npm install && npm run build
COPY node_server/.  /usr/src/node_server/.
RUN cd /usr/src/node_server; npm install && mkdir static
RUN cp -r /usr/src/vue_app/dist/. /usr/src/node_server/static/.
COPY entrypoint.sh /
RUN ["chmod", "+x", "entrypoint.sh"]
EXPOSE 3000
#CMD ["/entrypoint.sh"]
CMD ["sh","-c","/entrypoint.sh && cd /usr/src/node_server && npm start"]






