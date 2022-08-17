FROM ubuntu:22.04
# python 3.8.10 버전의 컨테이너 이미지를 base이미지

MAINTAINER beatheat <beatheat888@gmail.com>
# Docker의 컨테이너를 생성 및 관리 하는 사람의 정보를 기입해줍니다.
RUN apt update && apt upgrade -y
RUN apt-get update

#python dependencies 설치
RUN apt-get install python3-pip -y
RUN pip install --upgrade pip
RUN pip install django
RUN pip install selenium
RUN pip install requests

# 크롬설치
RUN apt-get install wget -y
RUN apt-get install curl -y
RUN apt-get install -y unzip openjdk-8-jre-headless xvfb libxi6 libgconf-2-4
RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update
RUN apt-get -y install google-chrome-stable


# WORKDIR은 cd와 같은 명령으로, 작업 경로를 /usr/src/app으로 이동합니다.
# CMD에서 설정한 실행 파일이 실행될 디렉터리를 지정해주어야 한다.

WORKDIR /usr/src/app

COPY . .

# manage.py를 실행할 수 있는 디렉토리로 이동합니다.

CMD ["./download-chromedriver.sh"]

CMD ["python3", "./archivesite/manage.py", "runserver", "0.0.0.0:8000"]
# 이동한 디렉토리에서 django를 가동시켜주는 코드를 작성합니다. 여기서 port는 8000로 실행시키겠습니다.

EXPOSE 8000
# django 서버의 포트를 8000로 지정하였으므로 Docker의 컨테이너 또한 8000 포트를 열어줍니다.
