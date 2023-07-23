import * as yup from "yup";
import { useTranslation } from "react-i18next";
export const CreateChallengeValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    goal: yup
      .string()
      .trim()
      .required(t("new_challenge_screen.your_goal_required") as string),

    benefits: yup
      .string()
      .trim()
      .required(t("new_challenge_screen.benefits_required") as string),

    reasons: yup
      .string()
      .trim()
      .required(t("new_challenge_screen.reasons_required") as string),

    achievementTime: yup
      .string()
      .required(
        t("new_challenge_screen.time_to_reach_goal_required") as string
      ),

    image: yup
      .string()
      .required(t("new_challenge_screen.image_required") as string),
  });
};

export const CreateCompanyChallengeValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    goal: yup
      .string()
      .trim()
      .required(t("new_challenge_screen.your_goal_required") as string),

    benefits: yup
      .string()
      .trim()
      .required(t("new_challenge_screen.benefits_required") as string),

    reasons: yup
      .string()
      .trim()
      .required(t("new_challenge_screen.reasons_required") as string),

    achievementTime: yup
      .string()
      .required(
        t("new_challenge_screen.time_to_reach_goal_required") as string
      ),

    image: yup
      .string()
      .required(t("new_challenge_screen.image_required") as string),

    maximumPeople: yup
      .number()
      .min(2, t("new_challenge_screen.min_people_required") as string)
      .required(t("new_challenge_screen.max_people_required") as string),
  });
};
