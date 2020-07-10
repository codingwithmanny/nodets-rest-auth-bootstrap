FROM node:alpine

COPY $PWD /home/node

WORKDIR /home/node

RUN yarn install --production=true; \
    yarn build; \
    apk add git; \
    cp .env.example .env; \
    sed -i "/COMMIT=/c\COMMIT=$(git log -1 --format="%H")" .env; \
    sed -i "/VERSION=/c\VERSION=$(node -p 'require(`./package.json`).version')" .env; \
    apk del git;

EXPOSE 80

CMD ["/bin/sh", "-c", "yarn start"]