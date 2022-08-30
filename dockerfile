FROM python:3.8.10

MAINTAINER beatheat <beatheat888@gmail.com>

WORKDIR /usr/src/app

COPY ./source .

RUN pip install --upgrade pip && pip install django requests 

RUN chmod +x init.sh && ./init.sh

CMD python3 arsite/manage.py runserver 0.0.0.0:8000 --insecure

EXPOSE 8000
