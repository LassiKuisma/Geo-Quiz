import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import countryRouter from './routes/countryRouter';
import gameRouter from './routes/gameRouter';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

const app = express();

app.use(express.static('build'));

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

app.use('/api/countries', countryRouter);
app.use('/api/game', gameRouter);

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void start();
