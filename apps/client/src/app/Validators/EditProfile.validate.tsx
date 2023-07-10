import * as yup from 'yup';

import { useTranslation } from 'react-i18next';

export const EditProfileValidators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('form_onboarding.screen_1.first_name_error') as string),

    surname: yup
      .string()
      .trim()
      .required(t('form_onboarding.screen_1.last_name_error') as string),

    birth: yup
      .string()
      .required(t('form_onboarding.screen_1.birthday_error') as string),

    occupation: yup
      .string()
      .required(t('form_onboarding.screen_1.occupation_error') as string),
    biography: yup.string(),
    hardSkill: yup
      .array()
      .min(3, t('form_onboarding.screen_3.error') as string),
    isShowCompany: yup.boolean(),
  });
};

export const OnboardingScreen4Validators = () => {};

export const EditCompanyProfileValidators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('edit_company_profile_screen.first_name_required') as string),
    bio: yup.string(),
  });
};