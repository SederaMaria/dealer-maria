FROM node:16.0.0

# Common dependencies
RUN apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y vim \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

# Create app directory and copy source
RUN mkdir -p /app
WORKDIR /app
COPY . .

# Install app dependencies
RUN yarn global add react-scripts

EXPOSE 3000

CMD [ "yarn", "start" ]