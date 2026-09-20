import argon2 from 'argon2';

export const hashPassword = async (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (hashedPassword, password) => {
  return argon2.verify(hashedPassword, password);
};