FROM ubuntu:22.04
# python 3.8.10 버전의 컨테이너 이미지를 base이미지

MAINTAINER beatheat <beatheat888@gmail.com>
# Docker의 컨테이너를 생성 및 관리 하는 사람의 정보를 기입해줍니다.
WORKDIR /usr/src/app

COPY . .

# manage.py를 실행할 수 있는 디렉토리로 이동합니다.
RUN ["chmod", "+x", "/usr/src/app/setting.sh"]
RUN ["./setting.sh"]

CMD ["python3", "./site/manage.py", "runserver", "0.0.0.0:8000"]
# 이동한 디렉토리에서 django를 가동시켜주는 코드를 작성합니다. 여기서 port는 8000로 실행시키겠습니다.

EXPOSE 8000
# django 서버의 포트를 8000로 지정하였으므로 Docker의 컨테이너 또한 8000 포트를 열어줍니다.
a