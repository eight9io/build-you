import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
export const RegisterValidationSchema = () => {
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
        t('form.2.error') as string
      )
      .required(t('form.2.required') as string),

    repeat_password: yup
      .string()
      .oneOf([yup.ref('password')], t('form.3.error') as string)
      .required(t('form.3.required') as string),

    check_policy: yup
      .boolean()
      .oneOf([true], t('register_screen.err_policy') as string)
      .required(t('register_screen.err_policy') as string),
  });
};
