import { User } from '../models/user.model';

export const existEmail = async (email = '') => {
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    throw new Error(`The email: ${email}, already registered`);
  }
};

export const existUserByID = async (id: string) => {
  const existeUser = await User.findById(id);
  if (!existeUser) {
    throw new Error(`The id not exist ${id}`);
  }
};