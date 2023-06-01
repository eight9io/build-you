import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
export const ResetPasswordValidationSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    code: yup
      .string()

      .required(t('form.1.required') as string),
    password: yup
      .string()
      .required(t('form.3.required') as string)
      .notOneOf([''], t('form.3.required') as string)
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        t('form.3.error') as string
      ),

    repeat_password: yup
      .string()
      .required(t('form.4.required') as string)
      .notOneOf([''], t('form.4.required') as string)
      .oneOf([yup.ref('password')], t('form.4.error') as string),
  });
};
