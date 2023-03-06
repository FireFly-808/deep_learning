FROM python:3.9
LABEL maintainer="fireflyteam"

# run python and dont buffer the outputs so they appear on the screen
ENV PYTHONUNBUFFERED 1

# copy local files into the docker container
COPY ./requirements_deploy.txt /tmp/requirements.txt
COPY ./app /app

# use /app as the dir to run commands in
WORKDIR /app/inference

# define container port to access the container
EXPOSE 8001

# run a command when the alpine image is building
RUN python -m venv /py && \
    apt-get update && \
    apt-get install libgl1 -y && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    adduser \
    --disabled-password \
    --no-create-home \
    fireflyteam && \
    chmod +x /app/inference/flame_inferencer.py

ENV PATH="/app/inference:/py/bin:$PATH"

USER fireflyteam