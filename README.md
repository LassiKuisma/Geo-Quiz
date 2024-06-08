# About this project

This is my final project for [Full Stack open](https://fullstackopen.com/en/). It is a game where you get to use your geography knowledge to try to guess a country.

## How to play

Click on "new game" button in main menu, then select a country and click on "guess". Your guess will appear in the list below, along with some additional information about the country _(region, population, area, etc)_. You need to use this info to figure out the correct answer.

If your guess is in the same region as the correct answer, the game will display a green check mark next to it _(same for subregion)_. If the guess has larger area than the correct answer, a downward arrow will be displayed next to it _(upward arrow if it's smaller)_. You can think of this as "the area is too high, guess lower". Same goes for population.

If your guess and the correct answer have any common neighbours or languages, they will be shown. For example if the correct answer is Germany and you guess Spain, France will be displayed in the "common neighbours" section.

## Setting up the project

1. `git clone` this project
2. `npm install`
3. fill out values in `backend/.env`
   - change url in `frontend/.env` if needed
4. set up a PostgreSQL database. **Note:** Postgres is required, other dialects do not work
   - for development you can use a Docker container _(see below)_
5. populate the database with country data
   1. `cd backend`
   2. `npm run setup:import-country-data`
   - see backend's README for more info
6. setup is done

## Development and production

### Run in development mode

1. `npm run start-dev-env`
2. `npm run dev:back`
3. `npm run dev:front`
4. open <http://localhost:5173/> in browser

### Run in production mode

1. `npm run build`
2. `npm start`
3. frontend can be accessed in `localhost:<backend_port>/`
4. backend can be accessed in `localhost:<backend_port>/api/`

## Available scripts

### `npm run start`

Run application in production mode. You need to build the app before running this command.

### `npm run dev:back`

Run backend in development mode.

### `npm run dev:front`

Run frontend in development mode.

### `npm run build`

Build application so it can be run in production mode.

### `npm run build:import`

Import frontend and common builds to backend.

### `npm run clear`

Clear build directories.

### `npm run start-dev-env`

Starts Postgres container.

See [Docker documentation](https://docs.docker.com/compose/) for more info on Docker Compose.

### `npm run stop-dev-env`

Stops Postgres container.

### `npm run lint`

### `npm run test`

Runs backend's tests.

### `npm run test:e2e`

Runs Playwright's end-to-end tests.

## Contributing

Currently I'm not accepting any pull requests as this is my personal project. However, you can always open issues on GitHub if you find any bugs or would like to request a feature.

## Special thanks

[Full Stack open](https://fullstackopen.com/en/) - for amazing course on web development

[restcountries.com](https://restcountries.com/) - for providing country data

[Natural Earth](https://www.naturalearthdata.com/) - world map

[SVG Repo](https://www.svgrepo.com/svg/513568/globe-2) - app icon
