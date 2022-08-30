FROM python:3.8.10

MAINTAINER beatheat <beatheat888@gmail.com>

WORKDIR /usr/src/app

COPY ./source .

RUN pip install --upgrade pip && pip install django requests 

RUN wget https://github.com/lay295/TwitchDownloader/releases/download/1.40.7/TwitchDownloaderCLI-Linux-x64.zip \
	&& unzip -o TwitchDownloaderCLI-Linux-x64.zip && chmod +x TwitchDownloaderCLI \
	&& (./TwitchDownloaderCLI  --download-ffmpeg || true)

CMD python3 arsite/manage.py runserver 0.0.0.0:8000 --insecure

EXPOSE 8000
