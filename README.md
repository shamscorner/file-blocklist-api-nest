## Description

This is a block list service API for sharing files. This API is created with [Nest](https://github.com/nestjs/nest) framework.

## Rename .env.example to .env on the root of the project
```bash
$ mv .env.example .env
```

## Rename docker.env.example to docker.env on the root of the project
```bash
$ mv docker.env.example docker.env
```

## Run docker container for postgres, pgadmin4, redis, redis-commander

```bash
$ docker-compose up -d
```

**note:** If there is any permission error, follow the below steps on the docker dashboard:
- Open settings on the docker dashboard
- Go to Resources tab
- Open FILE SHARING
- Register the following directories if not exist
  - `/private`
	- `/var/folders`
	- `/data`
	- `/root`
- Run `docker-compose down`
- Run `docker-compose up -d` again

## Installation

```bash
$ npm install
or,
$ pnpm install
```

## Running the app

```bash
# development
$ npm run start
or,
$ pnpm run start

# watch mode
$ npm run start:dev
or,
$ pnpm run start:dev

# production mode
$ npm run start:prod
or,
$ pnpm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
