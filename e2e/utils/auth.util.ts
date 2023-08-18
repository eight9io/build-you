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

import { TEST_ACCOUNT } from "../constant/account";

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
};

export const registerNewAccountWithEmail = async () => {
  const registerBtn = element(by.id("intro_register_btn"));
  await registerBtn.tap();

  // expect register modal to be visible
  const registerWithEmailBtn = element(by.id("register_with_email_btn"));
  await expect(registerWithEmailBtn).toBeVisible();
  await registerWithEmailBtn.tap();

  // expect register screen to be visible
  const registerScreen = element(by.id("register_with_email_screen"));
  await expect(registerScreen).toBeVisible();

  // Mock input
  const emailInput = element(by.id("register_with_email_email_input"));
  await emailInput.replaceText(`${TEST_ACCOUNT.email}`);

  const passwordInput = element(by.id("register_with_email_password_input"));
  await passwordInput.replaceText(`${TEST_ACCOUNT.password}`);

  const confirmPasswordInput = element(
    by.id("register_with_email_confirm_password_input")
  );
  await confirmPasswordInput.replaceText(`${TEST_ACCOUNT.password}`);

  // check terms and conditions
  const termsAndConditionsCheckbox = element(
    by.id("register_argee_policy_checkbox")
  );
  await termsAndConditionsCheckbox.tap();

  // Submit form
  const submitBtn = element(by.id("register_submit_btn"));
  await submitBtn.tap();

  // back to login screen
  const backToLoginBtn = element(by.id("email_registration_back_btn"));
  await backToLoginBtn.tap();

  //login
  const loginButton = element(by.id("intro_login_btn"));
  await loginButton.tap();
  
  // expect login screen to be visible
  const loginScreen = element(by.id("login_with_email_screen"));
  await expect(loginScreen).toBeVisible();

  // Mock input
  const loginEmailInput = element(by.id("login_email_input"));
  await loginEmailInput.replaceText(`${TEST_ACCOUNT.email}`);

  const loginPasswordInput = element(by.id("login_password_input"));
  await loginPasswordInput.replaceText(`${TEST_ACCOUNT.password}`);
  
  // Submit form
  const loginSubmitBtn = element(by.id("login_submit_btn"));
  await loginSubmitBtn.tap();

  // expect onboarding screen to be visible
  const onboardingScreen = element(by.id("complete_profile_step_1"));
  await expect(onboardingScreen).toBeVisible();

};
