# About this project

This is a project for a country guessing game, using [restcountries](https://restcountries.com/) api for the country data.

How the game works: the server will pick a random country and the player has to guess it. Each guess unlocks hints for the player about the country such as does it have more/less population than the guessed country, are they in the same region, etc.

## Setting up the project

1. `git clone` this project
2. Set up a PostgreSQL database. **Note:** Postgres is required, other dialects do not work
3. Set up backend _(see backend's readme for more details)_
   1. `cd backend`
   2. fill out values in `.env`
   3. `npm install`
   4. `npm run setup:prod`
4. Set up frontend
   1. `cd frontend`
   2. `npm install`

## Development and production

Frontend can be run separately from backend _(development mode)_ or backend can serve static build of frontend.

### Run in development mode

1. Backend
   1. `cd backend`
   2. `npm run setup:dev`
   3. `npm start dev`
   4. backend can be accessed in `localhost:<backend_port>/api/`
2. Frontend
   1. `cd frontend`
   2. change backend url in `.env` to match port set in `../backend/.env`
   3. `npm start`
   4. open <http://localhost:3000/> in browser

### Run in production mode

1. `cd backend`
2. `npm run build:front`
3. `npm run tsc`
4. `npm start`
5. open `localhost:<backend_port>/` in browser to open frontend
6. backend can be accessed in `localhost:<backend_port>/api/`

## Contributing

Currently I'm not accepting any pull requests as this is my personal project. However, you can always open issues on GitHub if you find any bugs or would like to request a feature.

## Special thanks

[Full Stack open](https://fullstackopen.com/en/) - for amazing course on web development

[restcountries.com](https://restcountries.com/) - for providing country data
