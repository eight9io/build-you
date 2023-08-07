describe("Example", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have login screen", async () => {
    const loginBtn = element(by.id("intro_login_btn"));
    await expect(loginBtn).toBeVisible();
    await loginBtn.tap();
  });
});
