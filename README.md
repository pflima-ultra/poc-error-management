![Ultra logo](doc/img/doc-header.png)

# _COMPONENT_NAME_ server

_COMPONENT_DESCRIPTION_

**Summary :**

-   [Technological stack](#technological-stack)
-   [Configuration](#configuration)
-   [How to start the MongoDB database](#how-to-start-the-mongodb-database)
-   [How to start it in developer mode](#how-to-start-it-in-developer-mode)
-   [How to start it with docker](#how-to-start-it-with-docker)
-   [How to switch Express server to Fastify Server](#how-to-switch-express-server-to-fastify-server)

## Technological stack

This project is coded in [Typescript](https://www.typescriptlang.org/).

This application uses [NestJS](https://docs.nestjs.com/), [NodeJs](https://nodejs.org/en/) (>= 12.16) and [Docker](https://docs.docker.com/).

For the logging part, [Winston](https://github.com/winstonjs/winston) has been used.

## Configuration

Different application properties can be configured. To change them, two options are available:

-   either, modify the default values in the `.env` file
-   or configure global environment variables which will replace the default ones

The options to specify before deploying the application are:

-   database properties (user/password/url/db name)

## How to start the MongoDB database

As prerequisite, [Docker](https://nodejs.org/en/) should be installed and correctly configured.

In order to connect to database you should use docker-compose from e2e folder, because this service use transactions and it needs to be replica set.

    cd e2e
    docker-compose up -d

To connect to the database manually use:

    mongo -u ultraadmin -p ultrapass --authenticationDatabase admin

## How to start it in developer mode

As prerequisite, [NodeJs](https://nodejs.org/en/) >= 12.16 (with NPM) should be installed and correctly configured.

Open a command line, go to the project directory and run the following commands:

    npm install

Once your installation finished then you can start _COMPONENT_NAME_-service:

    npm run start

**Note**: [nodemon](https://nodemon.io/) is available and can be used as alternative to start the application using `npm run start:dev`. As soon as a source file is
modified, the application will be reloaded.

## How to start it with docker

**Note:** To start the application with Docker, Docker needs to already be installed on the machine.

### Using npm

Open a command line, go to the project and run the following command

    npm run build:docker
    npm run start:docker

### Using docker

Open a command line, go to the project and run the following command to generate the `dist` folder:

    npm run build

Then execute the following command to create the Docker image:

    npm run build:docker

Finally start a container as follow:

     npm run start:docker

The application should run correctly by now. The API documentation should be available at the url: [http://localhost:_COMPONENT_PORT_/graphql](http://localhost:_COMPONENT_PORT_/graphql)

## How to switch Express server to Fastify Server

Single one step, you need to open src/main.ts and here you will find below line.

const app = await NestFactory.create(ApplicationModule);

you need to replace with below syntax

const app = await NestFactory.create(ApplicationModule, new FastifyAdapter());

and save this file.

Now you can start your application with Fastify Server using the cmd:

npm run start

The application should run correctly by now. The API documentation should be available at the url: [http://localhost:_COMPONENT_PORT_/graphql](http://localhost:_COMPONENT_PORT_/graphql)
