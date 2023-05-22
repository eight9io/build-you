import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
export const LoginValidationSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    email: yup
      .string()
      .email(t('form.0.error') as string)
      .required(t('form.0.required') as string),

    password: yup
      .string()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        t('form.1.error') as string
      )
      .required(t('form.2.required') as string),
  });
};
