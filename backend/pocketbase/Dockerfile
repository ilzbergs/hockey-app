FROM alpine:latest

ARG PB_VERSION=0.25.8

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    openssh

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip

RUN unzip /tmp/pb.zip -d /pb/ && \
    chmod +x /pb/pocketbase

COPY ./pb_migrations /pb/pb_migrations
COPY ./pb_data /pb/pb_data

WORKDIR /pb

EXPOSE 8090

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
