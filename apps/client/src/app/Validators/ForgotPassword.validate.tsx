import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
export const ForgotPasswordValidationSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    email: yup
      .string()
      .email(t('form.0.error') as string)
      .required(t('form.0.required') as string)
      .notOneOf([''], t('form.0.required') as string),
  });
};
