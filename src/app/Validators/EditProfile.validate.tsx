import * as yup from "yup";

import { useTranslation } from "react-i18next";

export const EditProfileValidators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t("form_onboarding.screen_1.first_name_error") as string),

    surname: yup
      .string()
      .trim()
      .required(t("form_onboarding.screen_1.last_name_error") as string),

    birth: yup
      .mixed()
      .required(t("form_onboarding.screen_1.birthday_error") as string),

    occupation: yup
      .string()
      .required(t("form_onboarding.screen_1.occupation_error") as string),

    bio: yup.string(),
    hardSkill: yup
      .array()
      .min(3, t("form_onboarding.screen_3.error") as string),

    occupationDetail: yup.string(),
    isShowCompany: yup.boolean(),
    city: yup.string(),
    employeeOf: yup.mixed(),
    phone: yup.string(),
  });
};

export const EditProfileOccupationValidators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    occupation: yup
      .string()
      .trim()
      .required(t("occupation_error") as string),
  });
};

export const EditProfileCompanyValidators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    company: yup.string().trim(),
  });
};

export const OnboardingScreen4Validators = () => {};

export const EditCompanyProfileValidators = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t("edit_company_profile_screen.first_name_required") as string),
    bio: yup.string(),
    webSite: yup.string(),
    phone: yup.string(),
    mailContact: yup.string(),
    pIva: yup.string(),
  });
};
