import * as yup from 'yup';
import { Role, UserInterface } from '../interfaces/user.interface';
class UserValidation {
  private userSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .matches(/^[A-Za-z]/, 'Username must start with a letter'),
    email: yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    password: yup.string()
      .required('Password is required')
      .min(3, 'Password must be at least 3 characters'),
    role: yup.string()
      .oneOf(Object.values(Role))
      .default(Role.Customer)
  });

  private loginSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .required('Password is required'),
  });


  private editUserSchema = yup.object().shape({
    username: yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .matches(/^[A-Za-z]/, 'Username must start with a letter'),
    email: yup.string()
      .email('Invalid email address')
  })
  validateUser(data: UserInterface): Promise<{ username: string; email: string; password: string; role: Role}> {
    return this.userSchema.validate(data, { abortEarly: false });
  }

  validateLogin(data: UserInterface): Promise<{ username: string; password: string }> {
    return this.loginSchema.validate(data, { abortEarly: false });
  }

  validateEditUser(data: UserInterface): Promise<{ username?: string|undefined; email?: string|undefined }>{
    return this.editUserSchema.validate(data, { abortEarly: false})
  }
}

export default new UserValidation();
