import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
export const EditChallengeValidationSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    goal: yup
      .string()
      .required(t('edit_challenge_screen.your_goal_required') as string),

    benefits: yup
      .string()
      .required(t('edit_challenge_screen.benefits_required') as string),

    reasons: yup
      .string()
      .required(t('edit_challenge_screen.reasons_required') as string),

    achievementTime: yup
      .string()
      .required(t('edit_challenge_screen.time_to_reach_goal_required') as string),
  });
};
