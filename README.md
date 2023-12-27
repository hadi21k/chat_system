# Project Title: Scalable Chat Application with WebSockets and Upstash Redis

<img 
src="https://i.imgur.com/tbEHhry.png"
        alt="Markdown Monster icon"
        style="float: left; margin-right: 10px; width:100%" />

## Features

- Send and receive messages
- Display current connection count

## Project Objectives

1. Implement real-time communication with WebSockets
2. Utilize Redis Pub/Sub for communication across multiple instances
3. Employ Redis for storing data (connection count/messages)
4. Containerize the application using Docker and docker-compose
5. Implement Docker multi-stage builds
6. Implement graceful shutdowns

## Technologies Used

- **Fastify** - Backend
- **Websockets** - Realtime communication
- **Next.js** - Frontend
- **Tailwind & Shadcn UI** - Styling
- **Redis** - Pub/Sub and data storage
- **Docker/docker-compose** - Containerization
- **Vercel** - Hosting the frontend

## Docker Initialization

To initialize the Docker environment for this project, follow these steps:

1. Clone the project repository.
2. Navigate to the project directory.
3. Create a new file named `.env` in the root directory.
4. Add the following line to the `.env` file, replacing `UPSTASH_REDIS_REST_URL` with your Upstash URL:

   ```
   UPSTASH_REDIS_REST_URL=your_upstash_url
   ```

5. Save the `.env` file.

## Docker Commands

<!-- make to run using the powershell start.ps1 -->

To run the project, use the following command:

```
docker-compose up
```

Feel free to explore and enhance this project.
