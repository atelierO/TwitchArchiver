FROM ubuntu:20.04
#python 3.8.10
MAINTAINER beatheat <beatheat888@gmail.com>

WORKDIR /usr/src/app

ARG DEBIAN_FRONTEND=noninteractive

COPY . .

RUN  apt update && apt-get update && apt upgrade -y 
# 	&& apt-get install curl -y && apt-get install wget -y && apt install unzip -y
#파이썬 의존성
RUN	apt install python3-pip -y\
	&& pip install --upgrade pip \
	&& pip install django requests 

#dotnet 다운
RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
	&& dpkg --purge packages-microsoft-prod && dpkg -i packages-microsoft-prod.deb\
	&& apt-get update \
	&& dpkg -i packages-microsoft-prod.deb \
	&& rm packages-microsoft-prod.deb \
    && apt-get install -y aspnetcore-runtime-6.0 \
	&& (./TwitchDownloaderCLI --download-ffmpeg || true)


CMD python3 arsite/manage.py runserver 0.0.0.0:8000 --insecure

EXPOSE 8000
