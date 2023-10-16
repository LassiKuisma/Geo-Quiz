import 'dotenv/config';

const dbUrl =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

if (!dbUrl) {
  console.log('Database url missing');
  process.exit(1);
}

// it seems that ts can't figure out that dbUrl is a string (due to process.exit)
// using a second variable seems to fix this
const DATABASE_URL = dbUrl;

const PORT = process.env.PORT || 3003;

const jwt = process.env.JWT_SECRET;
if (!jwt) {
  console.log('JWT secret missing');
  process.exit(1);
}

const JWT_SECRET = jwt;

export { DATABASE_URL, PORT, JWT_SECRET };
