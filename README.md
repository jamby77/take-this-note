# Take This Note
This app relies on [Drizzle](https://github.com/drizzle-orm/drizzle) for the database and 
[Clerk](https://clerk.com) for authentication.
## Prerequisites

1. In order for authentication to work, you need to set up a Clerk account.
2. In order for the database to work, you need to set up a PostgreSQL database. 
This project is developed using local database, running in Docker. See `docker-compose.yml`
## Installation

open ./server folder,
edit `.env` or `.env.local`, add `CLERK_PUBLISHABLE_KEY=*********` and `CLERK_API_KEY=********`
run 

```npm run drizzle:migrate```
