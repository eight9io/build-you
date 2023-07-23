export const getTimeDiffToNow = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  if (isNaN(createdDate.getTime())) {
    return createdAt;
  }
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - createdDate.getTime();
  const secondsElapsed = Math.floor(timeDifference / 1000);
  const minutesElapsed = Math.floor(secondsElapsed / 60);
  const hoursElapsed = Math.floor(minutesElapsed / 60);
  const daysElapsed = Math.floor(hoursElapsed / 24);

  if (daysElapsed >= 7) {
    return createdDate.toLocaleDateString(); // Returns the formatted date if it's more than 7 days ago
  } else if (daysElapsed >= 1) {
    return daysElapsed + " days ago"; // Returns the number of days ago if it's less than 7 days
  } else if (hoursElapsed >= 1) {
    return hoursElapsed + " hours ago"; // Returns the number of hours ago if it's less than a day
  } else {
    return minutesElapsed + " minutes ago"; // Returns the number of minutes ago if it's less than an hour
  }
};
