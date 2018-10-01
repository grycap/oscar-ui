FROM ubuntu:16.04
LABEL Name=lemp Version=0.0.1

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y software-properties-common python-software-properties &&\
    LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php &&\
    apt-get update -y &&\
    apt-get install -y nginx curl gnupg2 supervisor &&\
    curl --silent --location https://deb.nodesource.com/setup_8.x |su - && \
    apt-get install -y nodejs build-essential unzip vim mc
    

COPY frontend/. /usr/src/frontend/.
RUN cd /usr/src/frontend; npm install && npm run build
RUN cp -r /usr/src/frontend/dist/. /var/www/html
COPY backend/.  /usr/src/appbackend/.
RUN cd /usr/src/appbackend; npm install 
EXPOSE 80 3000
#CMD ["nginx", "-g", "daemon off;"]
#WORKDIR /usr/src/appbackend
#CMD ["npm", "start"] 
CMD ["sh","-c","service nginx start && cd /usr/src/appbackend && npm start"]






