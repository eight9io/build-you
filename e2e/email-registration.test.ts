import Detox, { device, expect, element, by } from "detox";
import { disablePasswordAutofill } from "./utils/auth.util";
import { MOCK_DATA } from "./mock/mock-data";
import i18n from "../src/app/i18n/i18n";
import { FORM_ERROR_TYPES } from "./common/constants";

describe("Email Registration", () => {
  beforeAll(async () => {
    disablePasswordAutofill();
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Navigate to register screen
    const registerBtn = element(by.id("intro_register_btn"));
    await expect(element(by.id("intro_register_btn"))).toBeVisible();
    await registerBtn.tap();

    // Navigate to register with email screen
    const registerWithEmailBtn = element(by.id("register_with_email_btn"));
    await expect(registerWithEmailBtn).toBeVisible();
    await registerWithEmailBtn.tap();
  });

  it("Check UI of Email registration screen", async () => {
    // Check if email registration screen is visible
    await expect(element(by.id("register_with_email_screen"))).toBeVisible();
  });

  it("Check that Register screen is displayed after click [Back]", async () => {
    // Click [Back] button
    const backBtn = element(by.id("email_registration_back_btn"));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();

    // Check if register screen is visible
    await expect(element(by.id("intro_screen"))).toBeVisible();
  });

  it("Validate Hide/Unhide feature on Password & Repeat password field", async () => {
    // ----------------- Password field -----------------
    // Get first index to prevent error: Multiple elements were matched when using dynamically rendering
    const passwordInput = element(by.id("register_password_input")).atIndex(0);
    await expect(passwordInput).toBeVisible();

    const showPasswordBtn = element(
      by.id("register_password_show_password_btn")
    );
    await expect(showPasswordBtn).toBeVisible();

    await passwordInput.replaceText("123456"); // Mock input
    await passwordInput.tapReturnKey(); // Leave focus on password input

    let passwordInputAttr =
      (await passwordInput.getAttributes()) as Detox.ElementAttributes;
    if (passwordInputAttr.text === passwordInputAttr.value)
      // Value are dots when password is hidden
      throw new Error(
        "Failed because password input is visible even though show password button is not clicked"
      );

    await showPasswordBtn.tap(); // Tap on show password button
    const hidePasswordBtn = element(
      by.id("register_password_hide_password_btn")
    );
    await expect(hidePasswordBtn).toBeVisible();
    passwordInputAttr =
      (await passwordInput.getAttributes()) as Detox.ElementAttributes;
    if (passwordInputAttr.text !== passwordInputAttr.value)
      // Value are dots when password is hidden
      throw new Error(
        "Failed because password input is not visible even though show password button is clicked"
      );

    // Reset state
    await hidePasswordBtn.tap(); // Tap on hide password button

    // ----------------- Repeat password field -----------------
    // Get first index to prevent error: Multiple elements were matched when using dynamically rendering
    const repeatPasswordInput = element(
      by.id("register_repeat_password_input")
    ).atIndex(0);
    await expect(repeatPasswordInput).toBeVisible();

    const showRepeatPasswordBtn = element(
      by.id("register_repeat_password_show_password_btn")
    );
    await expect(showRepeatPasswordBtn).toBeVisible();

    await repeatPasswordInput.replaceText("123456"); // Mock input
    await repeatPasswordInput.tapReturnKey(); // Leave focus on password input

    let repeatPasswordInputAttr =
      (await repeatPasswordInput.getAttributes()) as Detox.ElementAttributes;
    if (repeatPasswordInputAttr.text === repeatPasswordInputAttr.value)
      // Value are dots when password is hidden
      throw new Error(
        "Failed because repeat password input is visible even though show password button is not clicked"
      );

    await showRepeatPasswordBtn.tap(); // Tap on show password button
    const hideRepeatPasswordBtn = element(
      by.id("register_repeat_password_hide_password_btn")
    );
    await expect(hideRepeatPasswordBtn).toBeVisible();
    repeatPasswordInputAttr =
      (await repeatPasswordInput.getAttributes()) as Detox.ElementAttributes;
    if (repeatPasswordInputAttr.text !== repeatPasswordInputAttr.value)
      // Value are dots when password is hidden
      throw new Error(
        "Failed because repeat password input is not visible even though show password button is clicked"
      );
  });

  it("Check that Privacy screen is displayed after click on [Privacy policy]", async () => {
    const privacyPolicyLink = element(by.id("register_policy_link"));
    await expect(privacyPolicyLink).toBeVisible();
    await privacyPolicyLink.tap();

    const policyModal = element(by.id("policy_modal"));
    await expect(policyModal).toBeVisible();

    // Close modal
    const closeBtn = element(by.id("policy_modal_back_btn"));
    await expect(closeBtn).toBeVisible();
    await closeBtn.tap();
  });

  it("Check that Term Condition screen is displayed after click on [Terms and Conditions]", async () => {
    const termsLink = element(by.id("register_terms_link"));
    await expect(termsLink).toBeVisible();
    await termsLink.tap();

    const termsModal = element(by.id("terms_modal"));
    await expect(termsModal).toBeVisible();

    // Close modal
    const closeBtn = element(by.id("terms_modal_back_btn"));
    await expect(closeBtn).toBeVisible();
    await closeBtn.tap();
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
    const emailError = element(by.id("register_email_error"));
    const passwordError = element(by.id("register_password_error"));
    const repeatPasswordError = element(
      by.id("register_repeat_password_error")
    );
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    // Leave blank input
    await registerSubmitBtn.tap();
    await expect(emailError).toHaveText(requiredErrors[FORM_ERROR_TYPES.EMAIL]);
    await expect(passwordError).toHaveText(
      requiredErrors[FORM_ERROR_TYPES.PASSWORD]
    );
    await expect(repeatPasswordError).toHaveText(
      requiredErrors[FORM_ERROR_TYPES.REPEAT_PASSWORD]
    );
  });

  it("Check that error displayed on Email field when using invalid email", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const emailInput = element(by.id("register_email_input"));
    const emailError = element(by.id("register_email_error"));
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    // Invalid email
    await emailInput.replaceText(MOCK_DATA.INVALID_EMAIL);
    await element(by.id("register_scroll_view")).scrollTo("bottom");
    await registerSubmitBtn.tap();
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(inputErrors[FORM_ERROR_TYPES.EMAIL]);
  });

  it("Check that error displayed on Password field when using invalid: Not fulfill 8 character", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const passwordInput = element(by.id("register_password_input"));
    const passwordError = element(by.id("register_password_error"));
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    // Password need to be 8 character at least
    await passwordInput.replaceText(MOCK_DATA.PASSWORD_NOT_LONG_ENOUGH);
    await element(by.id("register_scroll_view")).scrollTo("bottom"); // Scroll to bottom to make sure that the submit button is able to be tapped
    await registerSubmitBtn.tap();
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText(
      inputErrors[FORM_ERROR_TYPES.PASSWORD]
    );
  });

  it("Check that error displayed on Password field when using invalid: Not fulfill Uppercase", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const passwordInput = element(by.id("register_password_input"));
    const passwordError = element(by.id("register_password_error"));
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    // Password need to have at least 1 uppercase
    await passwordInput.replaceText(MOCK_DATA.PASSWORD_MISSING_UPPERCASE);
    await element(by.id("register_scroll_view")).scrollTo("bottom"); // Scroll to bottom to make sure that the submit button is able to be tapped
    await registerSubmitBtn.tap();
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText(
      inputErrors[FORM_ERROR_TYPES.PASSWORD]
    );
  });

  it("Check that error displayed on Password field when using invalid: Not fulfill Lowercase", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const passwordInput = element(by.id("register_password_input"));
    const passwordError = element(by.id("register_password_error"));
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    // Password need to have at least 1 lowercase
    await passwordInput.replaceText(MOCK_DATA.PASSWORD_MISSING_LOWERCASE);
    await element(by.id("register_scroll_view")).scrollTo("bottom"); // Scroll to bottom to make sure that the submit button is able to be tapped
    await registerSubmitBtn.tap();
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText(
      inputErrors[FORM_ERROR_TYPES.PASSWORD]
    );
  });

  it("Check that error displayed on Password field when using invalid: Not fulfill number", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const passwordInput = element(by.id("register_password_input"));
    const passwordError = element(by.id("register_password_error"));
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    // Password need to have at least 1 lowercase
    await passwordInput.replaceText(MOCK_DATA.PASSWORD_MISSING_NUMBER);
    await element(by.id("register_scroll_view")).scrollTo("bottom"); // Scroll to bottom to make sure that the submit button is able to be tapped
    await registerSubmitBtn.tap();
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText(
      inputErrors[FORM_ERROR_TYPES.PASSWORD]
    );
  });

  it("Check that error displayed on Repeat Password field when not match", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const passwordInput = element(by.id("register_password_input"));
    const repeatPasswordInput = element(
      by.id("register_repeat_password_input")
    );
    const repeatPasswordError = element(
      by.id("register_repeat_password_error")
    );
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    await passwordInput.replaceText(MOCK_DATA.PASSWORD);
    await repeatPasswordInput.replaceText(MOCK_DATA.PASSWORD_NOT_MATCH);
    await element(by.id("register_scroll_view")).scrollTo("bottom"); // Scroll to bottom to make sure that the submit button is able to be tapped
    await registerSubmitBtn.tap();
    await expect(repeatPasswordError).toBeVisible();
    await expect(repeatPasswordError).toHaveText(
      inputErrors[FORM_ERROR_TYPES.REPEAT_PASSWORD]
    );
  });

  it("Check that error is displayed when using existed email", async () => {
    const form = i18n.t("form", { returnObjects: true }) as Array<
      Record<string, string>
    >;
    const requiredErrors = {};
    const inputErrors = {};
    form.forEach((item) => {
      if (!requiredErrors[item.type]) requiredErrors[item.type] = item.required;
      if (!inputErrors[item.type]) inputErrors[item.type] = item.error;
    });

    const emailInput = element(by.id("register_email_input"));
    const passwordInput = element(by.id("register_password_input"));
    const repeatPasswordInput = element(
      by.id("register_repeat_password_input")
    );
    const registerError = element(by.id("register_error"));
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    await emailInput.replaceText(MOCK_DATA.EXISTING_EMAIL);
    await passwordInput.replaceText(MOCK_DATA.PASSWORD);
    await repeatPasswordInput.replaceText(MOCK_DATA.PASSWORD);
    await registerSubmitBtn.tap();
    waitFor(registerError).toBeVisible();
    await expect(registerError).toHaveText(
      i18n.t("errorMessage:err_register.409")
    );
  });

  it("Check that error is displayed when user not click agree checkbox", async () => {
    const registerSubmitBtn = element(by.id("register_submit_btn"));
    await expect(registerSubmitBtn).toBeVisible();

    const agreeCheckbox = element(by.id("register_argee_policy_checkbox"));
    const agreeCheckboxError = element(by.id("register_argee_policy_error"));
    let agreeCheckboxAttr =
      (await agreeCheckbox.getAttributes()) as Detox.ElementAttributes;
    if (agreeCheckboxAttr.value !== "checkbox, checked")
      throw new Error("Checkbox should be checked by default");

    await agreeCheckbox.tap(); // Uncheck
    agreeCheckboxAttr =
      (await agreeCheckbox.getAttributes()) as Detox.ElementAttributes;
    await element(by.id("register_scroll_view")).scrollTo("bottom"); // Scroll to bottom to make sure that the submit button is able to be tapped
    await registerSubmitBtn.tap();
    await expect(agreeCheckboxError).toBeVisible();
    await expect(agreeCheckboxError).toHaveText(
      i18n.t("register_screen.err_policy")
    );
  });
});
