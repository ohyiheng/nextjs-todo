![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

# Tugas

Tugas is a self-hostable to-do list app heavily inspired by [Todoist](https://www.todoist.com).

> [!NOTE]  
> This project is not production-ready yet, but here's a [demo instance](https://tugas-demo.ohyiheng.com) for you try out.

## Screenshot

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="/docs/screenshots/inbox-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="/docs/screenshots/inbox-light.png">
    <img alt="Screenshot of Inbox Page" src="/docs/screenshots/inbox-light.png">
</picture>

## Self-hosting with Docker Compose

1. Download example [docker-compose.yml](https://raw.githubusercontent.com/ohyiheng/tugas/refs/heads/main/docker-compose.yml) file or create one yourself by copying the following:

    ```yaml
    services:
        db:
            image: postgres
            container_name: tugas-db
            restart: unless-stopped
            shm_size: 128mb
            volumes:
                - ./postgres:/var/lib/postgresql/data
            environment:
                POSTGRES_PASSWORD: example
            healthcheck:
                test: /usr/bin/pg_isready
                interval: 5s
                timeout: 10s
                retries: 60
        tugas:
            image: ohyiheng/tugas:latest
            container_name: tugas
            restart: unless-stopped
            ports:
                - 2558:3000
            depends_on:
            db:
                condition: service_healthy
            environment:
                POSTGRES_PASSWORD: example
                # POSTGRES_HOSTNAME must match db's container name
                POSTGRES_HOSTNAME: tugas-db
    ```

2. Configure environment variables, and run:

    ```
    docker compose up -d
    ```

3. Access it at http://localhost:2558

## License

This project is licensed under the [MIT license](https://github.com/ohyiheng/tugas/blob/main/LICENSE).
