import { UserModel } from '../models';

type NotValid = {
  k: 'error';
  statusCode: number;
  message: string;
};

type ResultValid = { k: 'ok' } | NotValid;

const minLength = 3;
const maxLength = 100;

export const validateUserInfo = async (
  username: string,
  password: string
): Promise<ResultValid> => {
  if (username.length < minLength) {
    return tooShort('Username');
  }
  if (password.length < minLength) {
    return tooShort('Password');
  }

  if (username.length > maxLength) {
    return tooLong('Username');
  }

  if (password.length > maxLength) {
    return tooLong('Password');
  }

  try {
    const user = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return { k: 'ok' };
    } else {
      return {
        k: 'error',
        statusCode: 400,
        message: 'Username is already taken',
      };
    }
  } catch (e) {
    return {
      k: 'error',
      statusCode: 500,
      message: 'DB error',
    };
  }
};

const tooShort = (fieldName: string): NotValid => {
  return {
    k: 'error',
    statusCode: 400,
    message: `${fieldName} is too short, minimum length is ${minLength}`,
  };
};

const tooLong = (fieldName: string): NotValid => {
  return {
    k: 'error',
    statusCode: 400,
    message: `${fieldName} is too long, maximum length is ${maxLength}`,
  };
};
