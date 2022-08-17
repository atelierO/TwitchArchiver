FROM ubuntu:22.04
# FROM python:3.8.10

MAINTAINER beatheat <beatheat888@gmail.com>

WORKDIR /usr/src/app

COPY . .

#파이썬 의존성
RUN pip install --upgrade pip \
	&& pip install django selenium requests

#크롬 다운
RUN apt update && apt-get update && apt upgrade -y \
	&& wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
	&& dpkg -i google-chrome-stable_current_amd64.deb || true \
    && apt --fix-broken install -y \
	&& apt-get install libnss3 -y

#크롬 드라이버 다운
RUN chrome_driver=$(curl "https://chromedriver.storage.googleapis.com/LATEST_RELEASE") \ 
	&& wget "https://chromedriver.storage.googleapis.com/${chrome_driver}/chromedriver_linux64.zip"\
	&& unzip chromedriver_linux64.zip

RUN ./TwitchDownloaderCLI --download-ffmpeg


CMD python3 site/manage.py runserver 0.0.0.0:8000 --insecure

EXPOSE 8000
