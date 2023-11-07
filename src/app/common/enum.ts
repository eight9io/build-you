export enum NOTIFICATION_TYPES {
  NEW_COMMENT = "NewComment",
  NEW_MENTION = "CommentTag",
  NEW_FOLLOWER = "NewFollower",
  CHALLENGE_CREATED = "ChallengeCreated",
  PROGRESS_CREATED = "ProgressCreated",
  ADDEDASEMPLOYEE = "AddedAsEmployee",
  NEW_MESSAGE = "Message",
  CLOSEDCHALLENGE = "ClosedChallenge",
}

export enum NOTIFICATION_TOKEN_STATUS {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum NOTIFICATION_TOKEN_DEVICE_TYPE {
  ANDROID = "Android",
  IOS = "iOS",
}

export enum SORT_ORDER {
  ASC = "asc",
  DESC = "desc",
}

export enum LOGIN_TYPE {
  GOOGLE = "google",
  LINKEDIN = "linkedin",
  APPLE = "apple",
  EMAIL_PASSWORD = "email_password",
}

export enum CHALLENGE_TABS_KEY {
  PROGRESS = "progress",
  DESCRIPTION = "description",
  COACH = "coach",
  SKILLS = "skills",
  CHAT = "chat",
  PARTICIPANTS = "participants",
  COACH_CALENDAR = "coach_calendar",
}

export enum PROFILE_TABS_KEY {
  BIOGRAPHY = "biography",
  FOLLOWERS = "followers",
  FOLLOWING = "following",
  EMPLOYEES = "employees",
  SKILLS = "skills",
  CHALLENGES = "challenges",
}

export enum COACH_CALENDAR_TABS_KEY {
  UPCOMING = "upcoming",
  PAST = "past",
}
