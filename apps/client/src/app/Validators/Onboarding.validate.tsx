import * as yup from 'yup';

import { useTranslation } from 'react-i18next';

export const OnboardingScreen1Validators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    firstName: yup
      .string()
      .required(t('form_onboarding.screen_1.first_name_error') as string),

    lastName: yup
      .string()
      .required(t('form_onboarding.screen_1.last_name_error') as string),

    birthday: yup
      .string()
      .required(t('form_onboarding.screen_1.birthday_error') as string),

    occupation: yup
      .string()
      .required(t('form_onboarding.screen_1.occupation_error') as string),
  });
};

export const OnboardingScreen3Validators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    hards_skills: yup
      .string()
      .required(t('form_onboarding.screen_3.hards_skills_error') as string),

    emoji: yup
      .string()
      .required(t('form_onboarding.screen_3.emoji_error') as string),

    adding_skills: yup
      .string()
      .required(t('form_onboarding.screen_3.adding_skills_error') as string),
  });
};

export const OnboardingScreen4Validators = () => {};
