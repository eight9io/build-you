import Detox, { device, expect, element, by } from "detox";
import { execSync } from "child_process";

import { TEST_ACCOUNT } from "./constant/account";
import { registerNewAccountWithEmail } from "./utils/auth.util";
import { fillOnboardingStep1 } from "./utils/onboading.utils";

describe("OnboardingStep1", () => {
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
    await registerNewAccountWithEmail();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // SCREEN 1
  it("should show onboarding screen when user haven't completed onboarding", async () => {
    // Expect onboarding screen to be visible
    const onboardingScreen = element(by.id("complete_profile_step_1"));
    await expect(onboardingScreen).toBeVisible();
  });

  it("should show errors when all fields are empty", async () => {
    // Mock input
    const nameInput = element(by.id("complete_profile_step_1_name_input"));
    await nameInput.replaceText("");
    await nameInput.tapReturnKey();

    const surnameInput = element(
      by.id("complete_profile_step_1_surname_input")
    );
    await surnameInput.replaceText("");
    await surnameInput.tapReturnKey();

    // Submit form
    const submitBtn = element(by.id("complete_profile_step_1_next_button"));
    await submitBtn.tap();

    // Expect error message
    const errorMessageName = element(
      by.id("complete_profile_step_1_name_error_message")
    );
    await expect(errorMessageName).toExist();

    const errorMessageSurname = element(
      by.id("complete_profile_step_1_surname_error_message")
    );
    await expect(errorMessageSurname).toExist();

    const errorMessageBirthdate = element(
      by.id("complete_profile_step_1_birthdate_input_error_message")
    );
    await expect(errorMessageBirthdate).toExist();

    const errorMessageOccupation = element(
      by.id("complete_profile_step_1_occupation_input_error_message")
    );
    await expect(errorMessageOccupation).toExist();
  });

  it("should not show error when name and surname is filled with valid characters", async () => {
    // Mock input
    const nameInput = element(by.id("complete_profile_step_1_name_input"));
    await nameInput.replaceText(`${TEST_ACCOUNT.nameValid}`);
    await nameInput.tapReturnKey();

    const surnameInput = element(
      by.id("complete_profile_step_1_surname_input")
    );
    await surnameInput.replaceText(`${TEST_ACCOUNT.surnameValid}`);
    await surnameInput.tapReturnKey();

    // Submit form
    const submitBtn = element(by.id("complete_profile_step_1_next_button"));
    await submitBtn.tap();

    // Expect error message
    const errorMessage = element(
      by.id("complete_profile_step_1_name_error_message")
    );
    await expect(errorMessage).not.toExist();

    const occupationErrorMessage = element(
      by.id("complete_profile_step_1_occupation_input_error_message")
    );

    await expect(occupationErrorMessage).toExist();
  });

  it("should show error when name and surname is filled with invalid characters (specical charaters)", async () => {
    // Mock input
    const nameInput = element(by.id("complete_profile_step_1_name_input"));
    await nameInput.replaceText(`${TEST_ACCOUNT.nameInvalid}`);
    await nameInput.tapReturnKey();

    const surnameInput = element(
      by.id("complete_profile_step_1_surname_input")
    );
    await surnameInput.replaceText(`${TEST_ACCOUNT.surnameInvalid}`);
    await surnameInput.tapReturnKey();

    // Submit form
    const submitBtn = element(by.id("complete_profile_step_1_next_button"));
    await submitBtn.tap();

    // Expect error message
    const errorMessageName = element(
      by.id("complete_profile_step_1_name_error_message")
    );
    await expect(errorMessageName).toExist();

    const errorMessageSurname = element(
      by.id("complete_profile_step_1_surname_error_message")
    );
    await expect(errorMessageSurname).toExist();
  });

  it("should not show error when birthdate is selected", async () => {
    const birthdateInput = element(
      by.id("complete_profile_step_1_birthdate_input")
    );
    await birthdateInput.tap();

    const birthdatePickerSaveBtn = element(
      by.id("date_time_picker_confirm_btn")
    );
    await birthdatePickerSaveBtn.tap();

    const errorMessage = element(
      by.id("complete_profile_step_1_birthdate_input_error_message")
    );
    await expect(errorMessage).not.toExist();
  });

  it("should not show error when occupation is selected", async () => {
    const occupationInput = element(
      by.id("complete_profile_step_1_occupation_input")
    );
    await occupationInput.tap();
    // Select first item in picker
    const occupationPickerItem = element(
      by.id("complete_profile_step_1_occupation_picker_item_0")
    );
    await occupationPickerItem.tap();

    const occupationPickerSaveBtn = element(
      by.id("complete_profile_step_1_occupation_picker_save_btn")
    );
    await occupationPickerSaveBtn.tap();

    const submitBtn = element(by.id("complete_profile_step_1_next_button"));
    await submitBtn.tap();

    const occupationErrorMessage = element(
      by.id("complete_profile_step_1_occupation_input_error_message")
    );
    await expect(occupationErrorMessage).not.toExist();
  });

  it("should navigate to onboarding step 2 when all fields are fille with valid input", async () => {
    // Mock input
    const nameInput = element(by.id("complete_profile_step_1_name_input"));
    await nameInput.replaceText(`${TEST_ACCOUNT.nameValid}`);
    await nameInput.tapReturnKey();

    const surnameInput = element(
      by.id("complete_profile_step_1_surname_input")
    );
    await surnameInput.replaceText(`${TEST_ACCOUNT.surnameValid}`);
    await surnameInput.tapReturnKey();

    // Select birthdate
    const birthdateInput = element(
      by.id("complete_profile_step_1_birthdate_input")
    );
    await birthdateInput.tap();

    const birthdatePickerSaveBtn = element(
      by.id("date_time_picker_confirm_btn")
    );
    await birthdatePickerSaveBtn.tap();

    // Select occupation
    const occupationInput = element(
      by.id("complete_profile_step_1_occupation_input")
    );
    await occupationInput.tap();
    // Select first item in picker
    const occupationPickerItem = element(
      by.id("complete_profile_step_1_occupation_picker_item_0")
    );
    await occupationPickerItem.tap();

    const occupationPickerSaveBtn = element(
      by.id("complete_profile_step_1_occupation_picker_save_btn")
    );
    await occupationPickerSaveBtn.tap();

    // Submit form
    const submitBtn = element(by.id("complete_profile_step_1_next_button"));
    await submitBtn.tap();

    // Expect onboarding step 2 to be visible
    const onboardingStep2Screen = element(by.id("complete_profile_step_2"));
    await expect(onboardingStep2Screen).toBeVisible();
  });
});

describe("OnboardingStep2", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // fill in onboarding step 1
    await fillOnboardingStep1();
  });

  it("SCREEN 2: should have back, next, skip button and those buttons are working", async () => {
    // Expect back button to be visible
    const backButton = element(by.id("complete_profile_step_2_back_button"));
    await expect(backButton).toBeVisible();
    await backButton.tap();
    const onboardingStep1Screen = element(by.id("complete_profile_step_1"));
    await expect(onboardingStep1Screen).toBeVisible();

    // Navigate to onboarding step 2
    const submitBtn = element(by.id("complete_profile_step_1_next_button"));
    await submitBtn.tap();

    // Expect skip button to be visible
    const skipButton = element(by.id("complete_profile_step_2_skip_button"));
    await expect(skipButton).toBeVisible();
    await skipButton.tap();

    const onboardingStep3Screen = element(by.id("complete_profile_step_3"));
    await expect(onboardingStep3Screen).toBeVisible();

    // Navigate to onboarding step 2
    const backButton2 = element(by.id("complete_profile_step_3_back_button"));
    await backButton2.tap();

    const nextButton = element(by.id("complete_profile_step_2_next_button"));
    await expect(nextButton).toBeVisible();

    // Navigate to onboarding step 3
    await nextButton.tap();
    await expect(onboardingStep3Screen).toBeVisible();
  });
});

describe("OnboardingStep3", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await fillOnboardingStep1();
    const skipButton = element(by.id("complete_profile_step_2_skip_button"));
    await expect(skipButton).toBeVisible();
    await skipButton.tap();
  });

  it("SCREEN 3: should render Back button and should navigate to screen 2 on click", async () => {
    const backButton = element(by.id("complete_profile_step_3_back_button"));
    await expect(backButton).toBeVisible();
    await backButton.tap();

    const onboardingStep2Screen = element(by.id("complete_profile_step_2"));
    await expect(onboardingStep2Screen).toBeVisible();
  });

  it("SCREEN 3: should show error when user haven't selected", async () => {
    // scroll to bottom
    await element(by.id("complete_profile_step_3")).scrollTo("bottom");
    const submitBtn = element(by.id("complete_profile_step_3_next_button"));
    await submitBtn.tap();

    const errorMessage = element(by.id("complete_profile_step_3_error"));
    await expect(errorMessage).toExist();
  });

  it("SCREEN 3: should show error when user select less than 3 skills", async () => {
    const skill1 = element(by.id("complete_profile_step_3_skill_1"));
    await skill1.tap();
    const skill2 = element(by.id("complete_profile_step_3_skill_2"));
    await skill2.tap();

    await element(by.id("complete_profile_step_3")).scrollTo("bottom");
    const submitBtn = element(by.id("complete_profile_step_3_next_button"));
    await submitBtn.tap();

    const errorMessage = element(by.id("complete_profile_step_3_error"));
    await expect(errorMessage).toExist();
  });

  it("SCREEN 3: should show error when user selects more than 10 skills", async () => {
    const maxSkills = 12;

    for (let i = 1; i <= maxSkills; i++) {
      const skill = element(by.id(`complete_profile_step_3_skill_${i}`));
      await skill.tap();
    }
    await element(by.id("complete_profile_step_3")).scrollTo("bottom");

    const errorMessage = element(by.id("complete_profile_step_3_error"));
    await expect(errorMessage).toExist();
  });

  it("SCREEN 3: should move to next screen when skills is selected (3-10)", async () => {
    const selectedSkills = 5;
    for (let i = 1; i <= selectedSkills; i++) {
      const skill = element(by.id(`complete_profile_step_3_skill_${i}`));
      await skill.tap();
    }

    await element(by.id("complete_profile_step_3")).scrollTo("bottom");
    const submitBtn = element(by.id("complete_profile_step_3_next_button"));
    await submitBtn.tap();

    const onboardingStep4Screen = element(by.id("complete_profile_step_4"));
    await expect(onboardingStep4Screen).toBeVisible();
  });
});

describe("OnboardingStep4", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    // back to screen 3 then next
    const backButton = element(by.id("complete_profile_step_4_back_button"));
    await backButton.tap();
    const nextButton = element(by.id("complete_profile_step_3_next_button"));
    await nextButton.tap();
  });

  it("SCREEN 4: should show error when user haven't selected any soft skills", async () => {
    const submitBtn = element(by.id("complete_profile_step_4_next_button"));
    await submitBtn.tap();

    const errorMessage = element(by.id("complete_profile_step_4_error"));
    await expect(errorMessage).toExist();
  });

  it("SCREEN 4: should show error when user select less than 3 soft skills and haven't select skill level", async () => {
    // this is a dropdown so we need to tap on the input first
    const softSkillInput = element(by.id("soft_skill_dropdown_picker"));
    await softSkillInput.tap();
    await new Promise((r) => setTimeout(r, 1000));

    // select 4 soft skills
    const maxSkills = 4;
    for (let i = 1; i <= maxSkills; i++) {
      const skill = element(by.id(`soft_skill_dropdown_picker_item_${i}`));
      await skill.tap();
    }

    //tap input again to close the dropdown
    await softSkillInput.tap();
    const submitBtn = element(by.id("complete_profile_step_4_next_button"));
    await submitBtn.tap();

    const errorMessageLevel = element(
      by.id("soft_skill_dropdown_picker_item_1_error")
    );
    await expect(errorMessageLevel).toExist();
  });
  // it("SCREEN 4: should render Back button and should navigate to screen 3 on click", async () => {
  //   const backButton = element(by.id("complete_profile_step_4_back_button"));
  //   await expect(backButton).toBeVisible();
  //   await backButton.tap();

  //   const onboardingStep3Screen = element(by.id("complete_profile_step_3"));
  //   await expect(onboardingStep3Screen).toBeVisible();

  //   const submitBtn = element(by.id("complete_profile_step_3_next_button"));
  //   await submitBtn.tap();
  // });

  it("SCREEN$: should navigate to complete profile screen when all fields are filled", async () => {
    const softSkillInput = element(by.id("soft_skill_dropdown_picker"));
    await softSkillInput.tap();

    // select 3 soft skills
    const maxSkills = 3;
    for (let i = 1; i <= maxSkills; i++) {
      const skill = element(by.id(`soft_skill_dropdown_picker_item_${i}`));
      await skill.tap();
    }

    //tap input again to close the dropdown
    await softSkillInput.tap();

    // choose level for each skill
    const skill1Level1 = element(
      by.id("soft_skill_dropdown_picker_item_1_progress_3")
    );
    await skill1Level1.tap();
    const skill2Level1 = element(
      by.id("soft_skill_dropdown_picker_item_2_progress_3")
    );
    await skill2Level1.tap();
    const skill3Level1 = element(
      by.id("soft_skill_dropdown_picker_item_3_progress_3")
    );
    await skill3Level1.tap();

    const submitBtn = element(by.id("complete_profile_step_4_next_button"));
    await submitBtn.tap();
    // expect complete profile screen to be visible
    const completeProfileScreen = element(by.id("onboarding_complete_screen"));
    await expect(completeProfileScreen).toBeVisible();
  });
});
