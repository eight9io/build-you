import {
  IUnformatedCertifiedChallengeState,
  IChallengeTouchpointStatus,
  CheckpointType,
  IChallenge,
} from "../types/challenge";

export const formatChallengeStatePayload = (
  payload: IUnformatedCertifiedChallengeState
) => {
  try {
    let completedCheckpoint = Math.min(
      payload.completedCheckpoint,
      payload.checkpoint
    );

    const touchpoints = [];
    for (let i = 1; i <= payload.checkpoint; i++) {
      touchpoints.push(`check-${i}`);
    }
    touchpoints.push("closing");

    let currentTouchpoint =
      completedCheckpoint === 0 && payload.intakeStatus != "closed"
        ? "intake"
        : touchpoints[completedCheckpoint];

    let status: IChallengeTouchpointStatus;
    if (currentTouchpoint === "intake") {
      status = payload.intakeStatus;
    } else if (currentTouchpoint === "closing") {
      status = payload.closingStatus;
    } else {
      status = payload.checkStatus;
    }

    const totalChecks = payload.checkpoint;

    const formattedPayload = {
      currentTouchpoint,
      status,
      totalChecks,
    };

    return formattedPayload;
  } catch (error) {
    console.error("Error occurred:", error);
    return {
      currentTouchpoint: "intake" as CheckpointType,
      status: "init" as IChallengeTouchpointStatus,
      totalChecks: 0,
    };
  }
};

export const extractSkillsFromChallengeData = (challenge: IChallenge) => {
  if (!challenge?.softSkill) {
    return [];
  }
  return challenge?.softSkill.map((item) => item.skill);
};
