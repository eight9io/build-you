import Detox, { device, expect, element, by } from "detox";
import i18n from "../src/app/i18n/i18n";
import { FORM_ERROR_TYPES } from "./common/constants";
import { MOCK_DATA } from "./mock/mock-data";
import { disablePasswordAutofill } from "./utils/auth.util";
import { TEST_ACCOUNT } from "./constant/account";
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
};

describe("Login", () => {
  beforeAll(async () => {
    disablePasswordAutofill();
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    const loginBtn = element(by.id("intro_login_btn"));
    await expect(loginBtn).toBeVisible();
    await loginBtn.tap();
  });
  it("Check UI of Login screen", async () => {

    await expect(element(by.id("login_with_email_screen"))).toBeVisible();
  })

  it("Check that Login screen is displayed after click [Back]", async () => {
    // Click [Back] button
    const backBtn = element(by.id("login_back_btn"));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();

    // Check if register screen is visible
    await expect(element(by.id("intro_screen"))).toBeVisible();
  });

  it("Validate Hide/Unhide feature on Password", async () => {
    const passwordInput = element(by.id("login_password_input"));
    await expect(passwordInput).toBeVisible();

    const showPasswordBtn = element(by.id("login_show_password_btn"));
    await expect(showPasswordBtn).toBeVisible();

    await passwordInput.replaceText("123456");
    await passwordInput.tapReturnKey();

    let passwordInputAttr =
      (await passwordInput.getAttributes()) as Detox.ElementAttributes;
    if (passwordInputAttr.text === passwordInputAttr.value)
      throw new Error(
        "Failed because password input is visible even though show password button is not clicked"
      );

    await showPasswordBtn.tap(); // Tap on show password button
    const hidePasswordBtn = element(by.id("login_hide_password_btn"));
    await expect(hidePasswordBtn).toBeVisible();
    passwordInputAttr =
      (await passwordInput.getAttributes()) as Detox.ElementAttributes;
    if (passwordInputAttr.text !== passwordInputAttr.value)
      throw new Error(
        "Failed because password input is not visible even though show password button is clicked"
      );
    await hidePasswordBtn.tap();
  });

  it('should display Apple screen after clicking Apple button', async () => {
    const appleBtn = element(by.id('appleButton'));
    await expect(appleBtn).toBeVisible();
    await appleBtn.tap();
  });
  it('should display google screen after clicking google button', async () => {
    const googleBtn = element(by.id('googleButton'));
    await expect(googleBtn).toBeVisible();
    await googleBtn.tap();
  });
  it('should display LinkedLn screen after clicking LinkedLn button', async () => {
    const linkedlnBtn = element(by.id('linkedlnButton'));
    await expect(linkedlnBtn).toBeVisible();
    await linkedlnBtn.tap();
  });
  it('should display the Forgot password screen after clicking the link', async () => {
    await expect(element(by.id('forgotPasswordButton'))).toBeVisible();
    await element(by.id('forgotPasswordButton')).tap();
    // Check if the "Forgot password" screen content is displayed
    await expect(element(by.id('forgotPasswordScreen'))).toBeVisible();
    const backBtn = element(by.id("forgot_password_back_btn"));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();
    await expect(element(by.id("login_with_email_screen"))).toBeVisible();


  });
  it("Check that error is displayed when input leave blank all fields", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });
    const emailError = element(by.id("login_email_error"));
    const passwordError = element(by.id("login_password_error"));

    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await expect(loginSubmitBtn).toBeVisible();


    // Leave blank input
    await loginSubmitBtn.tap();
    await expect(emailError).toHaveText(requiredErrors[FORM_ERROR_TYPES.EMAIL]);
    await expect(passwordError).toHaveText(
      requiredErrors[FORM_ERROR_TYPES.PASSWORD]
    );

  });
  it("should show error when inputting wrong email", async () => {

    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });
    // Mock inputting wrong email
    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText(MOCK_DATA.PASSWORD); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect error message
    const errorMessage = element(by.id("login_error_message"));
    await expect(errorMessage).toExist();
  });

  it("should show error when inputting wrong password", async () => {


    // Mock inputting wrong email
    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText(MOCK_DATA.EXISTING_EMAIL);
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText(MOCK_DATA.PASSWORD_NOT_MATCH); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect error message
    const errorMessage = element(by.id("login_error_message"));
    await expect(errorMessage).toExist();
  });

  it("should navigate to home feed after logging in successfully if user completed profile before", async () => {

    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText("th1@gmail.com"); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText("Th123456"); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect home feed to be visible
    const homeFeed = element(by.id("home_feed"));
    await expect(homeFeed).toBeVisible();
  });

  it("should navigate to complete profile screen after logging in successfully if user didn't completed profile", async () => {
    const emailInput = element(by.id("login_email_input"));
    await emailInput.replaceText(MOCK_DATA.EXISTING_EMAIL); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    const passwordInput = element(by.id("login_password_input"));
    await passwordInput.replaceText(MOCK_DATA.PASSWORD); // Replace password input with valid test password
    await passwordInput.tapReturnKey();

    // Submit login form
    const loginSubmitBtn = element(by.id("login_submit_btn"));
    await loginSubmitBtn.tap();

    // Expect complete profile screen to be visible
    const completeProfileScreen = element(by.id("complete_profile_step_1"));
    await expect(completeProfileScreen).toBeVisible();
    const btnBack = element(by.id("complete_profile_step_1_logout_button"));
    await expect(btnBack).toBeVisible();
    await btnBack.tap();
  });
});
