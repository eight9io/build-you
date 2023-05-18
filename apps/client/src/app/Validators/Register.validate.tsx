import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
export const RegisterValidationSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    email: yup
      .string()
      .email(t('register_screen.form.0.error') as string)
      .required(t('register_screen.form.0.required') as string),

    password: yup
      .string()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        t('register_screen.form.1.error') as string
      )
      .required(t('register_screen.form.1.required') as string),

    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('register_screen.form.2.error') as string)
      .required(t('register_screen.form.2.required') as string),

    checkPolicy: yup
      .boolean()
      .oneOf([true], t('register_screen.err_policy') as string),
  });
};
