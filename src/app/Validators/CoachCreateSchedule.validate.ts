import * as yup from "yup";

import { useTranslation } from "react-i18next";

export const CoachCreateScheduleSchema = () => {
  const { t } = useTranslation();
  return yup.object().shape({
    linkVideoCall: yup
      .string()
      .url(t("form.6.error") as string)
      .notOneOf([""], t("form.6.required") as string),

    note: yup.string(),

    date: yup
      .string()
      .required(
        t("new_challenge_screen.time_to_reach_goal_required") as string
      ),
  });
};
