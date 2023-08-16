import { element, by } from "detox";
import { execSync } from "child_process";
import { MOCK_DATA } from "../mock/mock-data";

export const login = async () => {
  // Navigate to login screen
  const loginBtn = element(by.id("intro_login_btn"));
  await loginBtn.tap();

  // Mock input
  const emailInput = element(by.id("login_email_input"));
  await emailInput.replaceText(MOCK_DATA.NORMAL_USER.EMAIL); // Replace email input with invalid email
  await emailInput.tapReturnKey();

  const passwordInput = element(by.id("login_password_input"));
  await passwordInput.replaceText(MOCK_DATA.NORMAL_USER.PASSWORD); // Replace password input with valid test password
  await passwordInput.tapReturnKey();

  // Submit login form
  const loginSubmitBtn = element(by.id("login_submit_btn"));
  await loginSubmitBtn.tap();
};

export const logOut = async () => {
  const profileBtn = element(by.id("profile_tab_btn"));
  await profileBtn.atIndex(0).tap();
  const settingBtn = element(by.id("settings_btn"));
  await settingBtn.tap();
  const logoutBtn = element(by.id("logout_btn"));
  await logoutBtn.tap();
  const confirmLogoutBtn = element(by.id("logout_confirm_btn"));
  await confirmLogoutBtn.tap();
};

export const disablePasswordAutofill = () => {
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
}