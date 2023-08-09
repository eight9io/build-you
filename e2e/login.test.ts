import Detox, { device, expect, element, by }  from "detox";
const execSync = require("child_process").execSync;

const logOut = async () => {
  const profileBtn = element(by.id("profile_tab_btn"));
  await profileBtn.atIndex(0).tap();
  const settingBtn = element(by.id("settings_btn"));
  await settingBtn.tap();
  const logoutBtn = element(by.id("logout_btn"));
  await logoutBtn.tap();
  const confirmLogoutBtn = element(by.id("logout_confirm_btn"));
  await confirmLogoutBtn.tap();
}

describe("Login", () => {
  beforeAll(async () => {
    if (device.getPlatform() === "ios") {
      // disable password autofill
      // Workaround to bypass native save password prompt of iOS. Reference: https://github.com/wix/Detox/issues/3761#issuecomment-1523946316
      execSync(
        `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Containers/Shared/SystemGroup/systemgroup.com.apple.configurationprofiles/Library/ConfigurationProfiles/UserSettings.plist`
      );
      execSync(
        `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Library/UserConfigurationProfiles/EffectiveUserSettings.plist`
      );
      execSync(
        `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Library/UserConfigurationProfiles/PublicInfo/PublicEffectiveUserSettings.plist`
      );
    }
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // await device.clearKeychain();
  });

  it("should show error when inputting wrong email", async () => {
    // Navigate to login screen
    const loginBtn = element(by.id("intro_login_btn"));
    await expect(loginBtn).toBeVisible();
    await loginBtn.tap();

    // Mock inputting wrong email
    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText("wrongemail@test.com"); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText("Aa1234567"); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect error message
    const errorMessage = element(by.id("login_error_message"));
    await expect(errorMessage).toExist();
  });

  it("should navigate to home feed after logging in successfully if user completed profile before", async () => {
    // Navigate to login screen
    const loginBtn = element(by.id("intro_login_btn"));
    await expect(loginBtn).toBeVisible();
    await loginBtn.tap();

    // Mock input
    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText("ktest5@gmail.com"); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText("Aa1234567"); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect home feed to be visible
    const homeFeed = element(by.id("home_feed"));
    await expect(homeFeed).toBeVisible();
  });

  it("should navigate to complete profile screen after logging in successfully if user didn't completed profile", async () => {
    // Logout first to clear user data
    await logOut();

    // Navigate to login screen
    const loginBtn = element(by.id("intro_login_btn"));
    await expect(loginBtn).toBeVisible();
    await loginBtn.tap();

    // Mock input
    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText("nocompleteprofile@test.com"); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText("Aa1234567"); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect complete profile screen to be visible
    const completeProfileScreen = element(by.id("complete_profile_step_1"));
    await expect(completeProfileScreen).toBeVisible();
  });
});
