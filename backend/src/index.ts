import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/greeting', (_req, res) => {
  res.send('Howdy');
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
