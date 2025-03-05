import argon2 from "argon2";

export default {
  hashPassword: (password: string): Promise<string> => {
    return argon2.hash(password);
  },
  verifyPassword: (password: string, hash: string) => {
    return argon2.verify(hash, password);
  },
};
