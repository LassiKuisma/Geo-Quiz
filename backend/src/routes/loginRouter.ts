import express from 'express';
import { isString } from '../util/utils';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUser } from '../services/userService';
import { JWT_SECRET } from '../util/config';

const router = express.Router();

router.post('/', async (req, res) => {
  const body: unknown = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).send('Malformed request');
  }

  if (!('username' in body) || !isString(body.username)) {
    return res.status(400).send('Username missing or invalid');
  }

  if (!('password' in body) || !isString(body.password)) {
    return res.status(400).send('Password missing or invalid');
  }

  const username = body.username;
  const password = body.password;

  const userResult = await findUser(username);
  if (userResult.k === 'error') {
    return res.status(500).send(userResult.message);
  }

  const user = userResult.value;

  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.passwordhash);

  if (!passwordCorrect || !user) {
    return res.status(401).send('Invalid username or password');
  }

  const payload = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return res.status(200).send({ token, username: user.username });
});

export default router;
