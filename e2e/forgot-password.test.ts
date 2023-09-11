import Detox, { device, expect, element, by } from "detox";
import i18n from "../src/app/i18n/i18n";
import { FORM_ERROR_TYPES } from "./common/constants";
import { MOCK_DATA } from "./mock/mock-data";
import { disablePasswordAutofill } from "./utils/auth.util";
import { TEST_ACCOUNT } from "./constant/account";
const execSync = require("child_process").execSync;

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
    await expect(element(by.id("login_with_email_screen"))).toBeVisible();
    await expect(element(by.id('forgotPasswordButton'))).toBeVisible();
    await element(by.id('forgotPasswordButton')).tap();
    // Check if the "Forgot password" screen content is displayed
    await expect(element(by.id('forgotPasswordScreen'))).toBeVisible();


  });

  // it("Check that Login screen is displayed after click [Back]", async () => {
  //   // Click [Back] button
  //   const backBtn = element(by.id("forgot_password_back_btn"));
  //   await expect(backBtn).toBeVisible();
  //   await backBtn.tap();
  //   await expect(element(by.id("login_with_email_screen"))).toBeVisible();
  // });

  // it("Check that error is displayed after click [Send code] when user leave blank or input invalid email", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   const emailError = element(by.id("email_forgot_password_error"));
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   // Leave blank input
  //   await senCodeBtn.tap();
  //   await expect(emailError).toHaveText(requiredErrors[FORM_ERROR_TYPES.EMAIL]);

  // });
  // it("Check that Reset password screen is displayed after click [Send code] with valid email", async () => {
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit login form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   await expect(element(by.id('forgot_password_modal'))).toBeVisible();
  // });
  // it("Check that Reset password screen is displayed after click [Send code] with valid email", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.INVALID_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit send form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   const emailError = element(by.id("email_forgot_password_error"));
  //   await expect(emailError).toHaveText(inputErrors[FORM_ERROR_TYPES.EMAIL]);
  // });
  // it("Check that error is displayed after click Reset password when leave blank ", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit send form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   await expect(element(by.id('forgot_password_modal'))).toBeVisible();
  //   const codeError = element(by.id("forgot_password_code_error"));
  //   const passwordError = element(by.id("forgot_password_password_error"));
  //   const repeatPasswordError = element(
  //     by.id("forgot_password_repeat_password_error")
  //   );
  //   const resetPasswordBtn = element(by.id("forgot_password_submit_btn"));
  //   await expect(resetPasswordBtn).toBeVisible();
  //   await resetPasswordBtn.tap();
  //   await expect(codeError).toHaveText(requiredErrors[FORM_ERROR_TYPES.CODE]);
  //   await expect(passwordError).toHaveText(
  //     requiredErrors[FORM_ERROR_TYPES.PASSWORD]
  //   );
  //   await expect(repeatPasswordError).toHaveText(
  //     requiredErrors[FORM_ERROR_TYPES.REPEAT_PASSWORD]
  //   );
  // });
  // it("Check that error displayed on Password field when using invalid: Not fulfill 8 character", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit send email form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   await expect(element(by.id('forgot_password_modal'))).toBeVisible()

  //   // Submit send resetPasswordBtn
  //   const passwordInput = element(by.id("forgot_password_password_input"));
  //   const passwordError = element(by.id("forgot_password_password_error"));
  //   const resetPasswordBtn = element(by.id("forgot_password_submit_btn"));

  //   // Password need to be 8 character at least
  //   await passwordInput.replaceText(MOCK_DATA.PASSWORD_NOT_LONG_ENOUGH);

  //   await expect(resetPasswordBtn).toBeVisible();
  //   await resetPasswordBtn.tap();
  //   await expect(passwordError).toBeVisible();
  //   await expect(passwordError).toHaveText(
  //     inputErrors[FORM_ERROR_TYPES.PASSWORD]
  //   );
  // });
  // it("Check that error displayed on Password field when using invalid: Not fulfill Uppercase", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit send form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   await expect(element(by.id('forgot_password_modal'))).toBeVisible()

  //   // Submit send form
  //   const passwordInput = element(by.id("forgot_password_password_input"));
  //   const passwordError = element(by.id("forgot_password_password_error"));
  //   const resetPasswordBtn = element(by.id("forgot_password_submit_btn"));

  //   // Password need to be 8 character at least
  //   await passwordInput.replaceText(MOCK_DATA.PASSWORD_MISSING_UPPERCASE);

  //   await expect(resetPasswordBtn).toBeVisible();
  //   await resetPasswordBtn.tap();
  //   await expect(passwordError).toBeVisible();
  //   await expect(passwordError).toHaveText(
  //     inputErrors[FORM_ERROR_TYPES.PASSWORD]
  //   );
  // });
  // it("Check that error displayed on Password field when using invalid: Not fulfill Lowercase", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit send form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   await expect(element(by.id('forgot_password_modal'))).toBeVisible()

  //   // Submit send form
  //   const passwordInput = element(by.id("forgot_password_password_input"));
  //   const passwordError = element(by.id("forgot_password_password_error"));
  //   const resetPasswordBtn = element(by.id("forgot_password_submit_btn"));

  //   // Password need to be 8 character at least
  //   await passwordInput.replaceText(MOCK_DATA.PASSWORD_MISSING_LOWERCASE);

  //   await expect(resetPasswordBtn).toBeVisible();
  //   await resetPasswordBtn.tap();
  //   await expect(passwordError).toBeVisible();
  //   await expect(passwordError).toHaveText(
  //     inputErrors[FORM_ERROR_TYPES.PASSWORD]
  //   );
  // });
  // it("Check that error displayed on Password field when using invalid: Not fulfill number", async () => {
  //   const form = i18n.t("form", { returnObjects: true }) as Array<
  //     Record<string, string>
  //   >;
  //   const requiredErrors = {};
  //   const inputErrors = {};
  //   form.forEach((item) => {
  //     if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
  //     if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
  //   });
  //   // Mock inputting wrong email
  //   const emailInput = element(by.id("email_forgot_password_input"));
  //   await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
  //   await emailInput.tapReturnKey();

  //   // Submit send form
  //   const senCodeBtn = element(by.id("send_code_btn"));
  //   await expect(senCodeBtn).toBeVisible();
  //   await senCodeBtn.tap();
  //   await expect(element(by.id('forgot_password_modal'))).toBeVisible()

  //   // Submit send form
  //   const passwordInput = element(by.id("forgot_password_password_input"));
  //   const passwordError = element(by.id("forgot_password_password_error"));
  //   const resetPasswordBtn = element(by.id("forgot_password_submit_btn"));

  //   // Password need to be 8 character at least
  //   await passwordInput.replaceText(MOCK_DATA.PASSWORD_NOT_MATCH);

  //   await expect(resetPasswordBtn).toBeVisible();
  //   await resetPasswordBtn.tap();
  //   await expect(passwordError).toBeVisible();
  //   await expect(passwordError).toHaveText(
  //     inputErrors[FORM_ERROR_TYPES.PASSWORD]
  //   );
  // });
  it("Check that error displayed on Repeat Password field when not match ", async () => {
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
    const emailInput = element(by.id("email_forgot_password_input"));
    await emailInput.replaceText(MOCK_DATA.WRONG_EMAIL); // Replace email input with invalid email
    await emailInput.tapReturnKey();

    // Submit send form email
    const senCodeBtn = element(by.id("send_code_btn"));
    await expect(senCodeBtn).toBeVisible();
    await senCodeBtn.tap();
    await expect(element(by.id('forgot_password_modal'))).toBeVisible();
    const passwordInput = element(by.id("forgot_password_password_input"));
    const repeatPasswordInput = element(by.id("forgot_password_confirm_password_input"));


    // Password need to be 8 character at least
    await passwordInput.replaceText(MOCK_DATA.PASSWORD);
    await repeatPasswordInput.replaceText(MOCK_DATA.PASSWORD_NOT_MATCH);


    const repeatPasswordError = element(
      by.id("forgot_password_repeat_password_error")
    );
    const resetPasswordBtn = element(by.id("forgot_password_submit_btn"));
    await expect(resetPasswordBtn).toBeVisible();
    await resetPasswordBtn.tap();

    await expect(repeatPasswordError).toHaveText(
      inputErrors[FORM_ERROR_TYPES.REPEAT_PASSWORD]
    );
  });

});
