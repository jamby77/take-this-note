# Take This Note
This app relies on [Drizzle](https://github.com/drizzle-orm/drizzle) for the database and 
[Clerk](https://clerk.com) for authentication.
## Prerequisites

1. In order for authentication to work, you need to set up a Clerk account.
2. In order for the database to work, you need to set up a PostgreSQL database. 
This project is developed using local database, running in Docker. See `docker-compose.yml`.
To ensure proper db flow, you need to follow these steps:
- ```ALTER ROLE postgres SET client_encoding TO 'utf8'```
- ```ALTER ROLE postgres SET default_transaction_isolation TO 'read committed'```

## Installation

1. ```cd ./server folder```
2. edit `.env` or `.env.local`, add `CLERK_PUBLISHABLE_KEY=*********` and `CLERK_API_KEY=********`
3. run ```npm install``` - to install all node dependencies
4. run ```npm run drizzle:migrate``` - to migrate the database
5. run ```npm run start``` - to start the server
6. ```cd ../client```
7. run ```npm install``` - to install all node dependencies
8. run ```npm run build``` - to build the client
9. run ```npm run preview``` - to start the client
