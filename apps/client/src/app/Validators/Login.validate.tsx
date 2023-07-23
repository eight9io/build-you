import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
export const LoginValidationSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    user: yup
      .string()
      .email(t('form.0.error') as string)
      .required(t('form.0.required') as string)
      .notOneOf([''], t('form.0.required') as string),

    password: yup
      .string()

      .required(t('form.3.required') as string)
      .notOneOf([''], t('form.3.required') as string)
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        t('form.3.error') as string
      ),
  });
};
