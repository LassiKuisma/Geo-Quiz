import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import countryRouter from './routes/countryRouter';
import gameRouter from './routes/gameRouter';
import usersRouter from './routes/usersRouter';
import loginRouter from './routes/loginRouter';

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
