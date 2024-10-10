FROM python:3.11

RUN mkdir -p /app/flask

WORKDIR /app/flask

ARG GIT_SSH
ARG GIT_USER
ARG EXECUTION_ENV

ENV FLASK_ENV=$EXECUTION_ENV

COPY . /app/flask

RUN apt-get update
RUN apt-get install -y gdal-bin libgdal-dev g++
RUN pip install --upgrade pip
RUN pip install git+https://$GIT_USER:$GIT_SSH@gitlab.lbd.org.es/litheum/calculo.git
RUN pip install -r requirements.txt

CMD ["python", "app.py"]