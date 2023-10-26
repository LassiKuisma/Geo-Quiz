import 'dotenv/config';

const dbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL_PRODUCTION
    : process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_URL_DEVELOPMENT
    : process.env.DATABASE_URL_TEST;

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

export { DATABASE_URL, JWT_SECRET, PORT };
