export enum NOTIFICATION_TYPES {
  NEW_COMMENT = "NewComment",
  NEW_MENTION = "CommentTag",
  NEW_FOLLOWER = "NewFollower",
  CHALLENGE_CREATED = "ChallengeCreated",
  PROGRESS_CREATED = "ProgressCreated",
  ADDEDASEMPLOYEE = "AddedAsEmployee",
  NEW_MESSAGE = "Message",
  CLOSEDCHALLENGE = "ClosedChallenge",
  COACH_ADDED = "CoachAdded",
  PHASE_OPENED = "PhaseOpened",
  SCHEDULE_CONFIRMED = "ScheduleConfirmed",
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

export enum PRODUCT_PLATFORM {
  APPLE = "apple",
  GOOGLE = "google",
}

export enum GOOGLE_IN_APP_PURCHASE_STATUS {
  PENDING = "pending",
  PURCHASED = "purchased",
  UNSPECIFIED = "unspecified",
  UNKNOWN = "unknown",
}

export enum APPLE_IN_APP_PURCHASE_STATUS {
  PENDING = "pending",
  PURCHASED = "purchased",
}

export enum PRODUCT_PACKAGE_TYPE {
  CHAT_CHECK = "chat_check",
  VIDEO_CHECK = "video_check",
  CHAT_CHALLENGE = "chat_challenge",
  VIDEO_CHALLENGE = "video_challenge",
}