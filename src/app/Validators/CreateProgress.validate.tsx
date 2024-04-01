import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const CreateProgressValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    challenge: yup.string().trim(),
    location: yup.string().trim(),
    caption: yup
      .string()
      .trim()
      .required(t("new_progress_modal.caption_required") as string),
    media: yup
      .mixed()
      .test(
        "required",
        t("new_progress_modal.image_required") ||
          "Please upload images or video",
        (value) => {
          return value != null && value != undefined;
        }
      ),
  });
};
