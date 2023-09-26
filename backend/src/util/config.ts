import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('Database url missing');
  process.exit(1);
}

// it seems that ts can't figure out that dbUrl is a string (due to process.exit)
// using a second variable seems to fix this
const DATABASE_URL = dbUrl;

const PORT = process.env.PORT || 3003;

export { DATABASE_URL, PORT };
