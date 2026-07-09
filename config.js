const CONFIG = {
  // Replace this with your Clerk Publishable Key from Clerk Dashboard
  // Example: "pk_test_..."
  CLERK_PUBLISHABLE_KEY: "",

  // When CLERK_PUBLISHABLE_KEY is empty, Demo Mode is activated.
  // In Demo Mode, Clerk auth is simulated using a mock local system.
  // This allows the checkout flow to work seamlessly out-of-the-box!
  DEMO_MODE_DEFAULT: true
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
