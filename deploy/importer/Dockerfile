FROM python:3.10

ARG SKIP_IMPORTATION
ARG GIT_USER
ARG GIT_SSH

ENV SKIP_IMPORTATION $SKIP_IMPORTATION

RUN mkdir -p /app/importer/resources
COPY . /app/importer

WORKDIR /app/importer

RUN pip install --upgrade pip
RUN pip install git+https://$GIT_USER:$GIT_SSH@gitlab.lbd.org.es/litheum/calculo.git
RUN pip install -r requirements.txt

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
