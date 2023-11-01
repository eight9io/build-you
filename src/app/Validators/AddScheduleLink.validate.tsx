import * as yup from "yup";

import { useTranslation } from "react-i18next";

export const AddScheduleLinkSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    link: yup
      .string()
      .url(t("form.5.error") as string)
      .notOneOf([""], t("form.5.required") as string),
  });
};
