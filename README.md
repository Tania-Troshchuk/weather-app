# Weather App

## Environment Variables
- **For convenience in development and testing**, all required environment variables are defined directly in the `docker-compose.yaml` file. This allows you to start the entire stack with a single command, without needing to copy or manage environment files separately.
- **In real production applications**, environment variables should be managed securely and injected into each service's environment (e.g., using Docker secrets, environment files, or a secrets manager). Storing sensitive information directly in `docker-compose.yaml` is not recommended for production.

## Quick Start
To start all services (backend, frontend, and database) with the environment variables already set, simply run:

```sh
docker-compose up --build
```

- The backend will be available at [http://localhost:4000](http://localhost:4000).
- The frontend  will be available at [http://localhost:3000](http://localhost:3000).
- PostgreSQL will be running on port 5432 (inside Docker) and can be accessed on your host as configured in `docker-compose.yaml`.


## Migrations
The initial migration for creating tables was generated using the following command:

```sh
npm run typeorm -- migration:generate -d dist/data-source.js migrations/CreateTables
```

The DataSource path was chosen dist/data-source.js instead of src/data-source.ts because TypeORM CLI requires the compiled JavaScript version of the data source file.