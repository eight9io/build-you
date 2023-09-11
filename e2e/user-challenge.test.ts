import Detox, { device, expect, element, by,DetoxConstants } from "detox";
import { disablePasswordAutofill, logOut, login } from "./utils/auth.util";

describe("Challenge (User)", () => {
  beforeAll(async () => {
    disablePasswordAutofill();
    await device.launchApp();
    await login();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("Check that Create challenge model is disappear after click [X]", async () => {
    const createChallengeBtn = element(
      by.id("bottom_nav_bar_create_challenge_btn")
    ).atIndex(0);

    await expect(createChallengeBtn).toBeVisible();
    await createChallengeBtn.tap();
    
    const createChallengeScreen = element(by.id("user_create_challenge_screen"));
    await expect(createChallengeScreen).toBeVisible();

    const closeBtn = element(by.id("user_create_challenge_close_btn"));
    await expect(closeBtn).toBeVisible();
    await closeBtn.tap();

    await expect(createChallengeScreen).not.toBeVisible();
  });

  it("Check that Create challenge model is disappear after scroll down", async () => {
    const createChallengeBtn = element(
      by.id("bottom_nav_bar_create_challenge_btn")
    ).atIndex(0);

    await expect(createChallengeBtn).toBeVisible();
    await createChallengeBtn.tap();

    const createChallengeScreen = element(
      by.id("user_create_challenge_screen")
    );
    await expect(createChallengeScreen).toBeVisible();

    await createChallengeScreen.swipe("down");
    await expect(createChallengeScreen).not.toBeVisible();
  });

  afterAll(async () => {
    await logOut();
  });
});
