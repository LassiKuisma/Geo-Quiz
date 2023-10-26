import express from 'express';
import { isString } from '../util/utils';
import bcrypt from 'bcrypt';
import { validateUserInfo } from '../util/newUser';
import { createUser } from '../services/userService';
import { createToken } from '../util/authentication';
import { UserWithToken } from '../util/types';

const router = express.Router();

router.post('/create', async (req, res) => {
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

  const validate = await validateUserInfo(username, password);
  if (validate.k === 'error') {
    return res.status(validate.statusCode).send(validate.message);
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const saveResult = await createUser(username, hash);
  if (saveResult.k === 'error') {
    return res.status(500).send(saveResult.message);
  }

  const user = saveResult.value;

  // sign them in
  const userWithToken: UserWithToken = createToken(user.username, user.id);
  return res.status(200).send(userWithToken);
});

export default router;
