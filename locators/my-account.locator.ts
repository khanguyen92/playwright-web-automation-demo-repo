export const MyAccountLocator = {
  // Login Form
  loginUsernameInput: '#username',
  loginPasswordInput: '#password',
  loginButton: 'input[name="login"]',
  
  // Register Form
  registerEmailInput: '#reg_email',
  registerPasswordInput: '#reg_password',
  registerButton: 'input[name="register"]',
  
  // Dashboard & Errors
  dashboardWelcomeText: '.woocommerce-MyAccount-content p:first-child',
  dashboardSignOutLink: '.woocommerce-MyAccount-navigation-link--customer-logout a',
  dashboardOrdersLink: '.woocommerce-MyAccount-navigation-link--orders a',
  dashboardAddressesLink: '.woocommerce-MyAccount-navigation-link--edit-address a',
  errorMessage: 'ul.woocommerce-error li',
};
