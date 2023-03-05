FROM python:3.9-alpine3.13
LABEL maintainer="fireflyteam"

# run python and dont buffer the outputs so they appear on the screen
ENV PYTHONUNBUFFERED 1

# copy local files into the docker container
COPY ./requirements.txt /tmp/requirements.txt
COPY ./app /app

# use /app as the dir to run commands in
WORKDIR /app

# define container port to access the container
EXPOSE 8000

# run a command when the alpine image is building
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    adduser \
    --disabled-password \
    --no-create-home \
    fireflyteam

ENV PATH="/scripts:/py/bin:$PATH"

USER fireflyteam

CMD ["python /inference/flame_inferencer.py"]