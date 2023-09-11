import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const EditProgressValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    caption: yup
      .string()
      .trim()
      .required(t("edit_progress_modal.caption_required") as string),
  });
};
