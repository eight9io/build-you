import * as yup from "yup";
import { useTranslation } from "react-i18next";
import {
  ICreateChallengeForm,
  ICreateCretifiedChallengeForm,
} from "../types/challenge";

export const CreateChallengeValidationSchema = (): yup.ObjectSchema<
  Record<keyof ICreateChallengeForm, yup.AnySchema>
> => {
  const { t } = useTranslation();

  return yup.object().shape<Record<keyof ICreateChallengeForm, yup.AnySchema>>({
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
      .mixed()
      .required(
        t("new_challenge_screen.time_to_reach_goal_required") as string
      ),

    image: yup
      .string()
      .required(t("new_challenge_screen.image_required") as string),
  });
};

export const CreateCretifiedChallengeValidationSchema = (): yup.ObjectSchema<
  Record<keyof ICreateCretifiedChallengeForm, yup.AnySchema>
> => {
  const { t } = useTranslation();

  return yup
    .object()
    .shape<Record<keyof ICreateCretifiedChallengeForm, yup.AnySchema>>({
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
        .mixed()
        .required(
          t("new_challenge_screen.time_to_reach_goal_required") as string
        ),

      image: yup
        .string()
        .required(t("new_challenge_screen.image_required") as string),

      softSkills: yup
        .array()
        .of(
          yup.object().shape({
            label: yup.string().required(),
            id: yup.string().required(),
          })
        )
        .min(3, t("new_challenge_screen.soft_skill_required") as string),
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

export const CreateCretifiedCompanyChallengeValidationSchema = () => {
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

    softSkills: yup
      .array()
      .of(
        yup.object().shape({
          label: yup.string().required(),
          id: yup.string().required(),
        })
      )
      .min(3, t("new_challenge_screen.soft_skill_required") as string),
  });
};
