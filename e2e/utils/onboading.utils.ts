import { TEST_ACCOUNT } from "../constant/account";

export const fillOnboardingStep1 = async () => {
  // Mock input
  const nameInput = element(by.id("complete_profile_step_1_name_input"));
  await nameInput.replaceText(`${TEST_ACCOUNT.nameValid}`);
  await nameInput.tapReturnKey();

  const surnameInput = element(by.id("complete_profile_step_1_surname_input"));
  await surnameInput.replaceText(`${TEST_ACCOUNT.surnameValid}`);
  await surnameInput.tapReturnKey();

  // Select birthdate
  const birthdateInput = element(
    by.id("complete_profile_step_1_birthdate_input")
  );
  await birthdateInput.tap();

  const birthdatePickerSaveBtn = element(by.id("date_time_picker_confirm_btn"));
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
};
