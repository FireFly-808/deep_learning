# maybe need to be changed for js version
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

#RUN
# ENV PATH="/py/bin:$PATH"

