FROM nginx
WORKDIR /
# RUN apt-get update
# RUN apt-get install -y inetutils-ping 
# RUN apt-get install telnet wget -y

RUN rm /etc/nginx/conf.d/default.conf

ENV SC_HOST localhost

ADD default.conf /etc/nginx/conf.d/

COPY dist/ /usr/share/nginx/html/
CMD ["/bin/bash", "-c", "sed -i \"s~sc-host~sc-host=\"$SC_HOST\"~\" /usr/share/nginx/html/index.html; nginx -g \"daemon off;\""]
