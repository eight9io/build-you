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
    const registerBtn = element(by.id("intro_register_btn"));
    await expect(element(by.id("intro_register_btn"))).toBeVisible();
    await registerBtn.tap();
  });


  it("Check that Register screen is displayed after click [Back]", async () => {
    // Click [Back] button
    const backBtn = element(by.id("register_modal_back_btn"));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();
    // Check if register screen is visible
    await expect(element(by.id("intro_screen"))).toBeVisible();
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
    await expect(element(by.id('linkend_modal'))).toBeVisible();
    const linkedln_modal_cancel_btn = element(by.id('linkedln_modal_cancel_btn'));
    await expect(linkedln_modal_cancel_btn).toExist();
    await linkedln_modal_cancel_btn.tap();
    await expect(element(by.id('register_modal'))).toBeVisible();

  });

});
