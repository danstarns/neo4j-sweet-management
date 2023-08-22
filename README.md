# neo4j-sweet-management

This repo is for the Pynea backend challenge.

- https://teampynea.notion.site/Backend-Hiring-Challenge-de26c804d8bb42e589dde964e044fa30

It contains a Typescript, Node.js GraphQL server that uses a Neo4j database.

The application contains the following entities:

- Sweets
- Machines
- Orders

Consumers of the GraphQL API can perfom various operations on the entities as stated in the challenge document.

Here is the data model for the application:

![Data model of the sweet shop.](./data-model.png)

## Getting Started

### Requirements

1. Node.js v18
2. Docker v24

### Starting Neo4j

This API connects to Neo4j, therefore you first need to run a local instance of Neo4j.

```shell
docker run -d \
    --name neo4j-container \
    -p 7474:7474 \
    -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/super-strong-password-123 \
    neo4j:latest
```

### Installing dependencies

Now that Neo4j is running locally, you can install the dependencies for the API.

```bash
npm i
```

### Setting up the environment variables

The API uses environment variables to connect to Neo4j. You can set these variables by creating a `.env` file in the root of the project.

```bash
HTTP_PORT=3000
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=super-strong-password-123
```

### Starting the API

Now that the dependencies are installed, you can start the API.

```bash
npm run dev
```

### Testing the API

You can test the API by running the following command:

```bash
npm run test
```
