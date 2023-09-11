export enum NOTIFICATION_TYPES {
  NEW_COMMENT = "NewComment",
  NEW_MENTION = "CommentTag",
  NEW_FOLLOWER = "NewFollower",
  CHALLENGE_CREATED = "ChallengeCreated",
  PROGRESS_CREATED = "ProgressCreated",
  ADDEDASEMPLOYEE = "AddedAsEmployee",
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