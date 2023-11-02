const usingTs =
  process.env.TS_NODE === 'true' || process.env.TS_NODE_DEV === 'true';
if (!usingTs) {
  // required for umzug migration
  require('ts-node/register');
}

import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import countryRouter from './routes/countryRouter';
import gameRouter from './routes/gameRouter';
import loginRouter from './routes/loginRouter';
import usersRouter from './routes/usersRouter';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

const app = express();

app.use(express.static('build'));

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

app.use('/api/countries', countryRouter);
app.use('/api/game', gameRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.get('/api/*', (_req, res) => {
  res.status(404).send('Unknown endpoint');
});

app.get('/health', (_req, res) => {
  res.status(200).send('ok');
});

app.use('/*', express.static('build'));

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void start();
