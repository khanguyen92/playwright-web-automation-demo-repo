Feature: User Identity & Access Management

  Scenario: 01 Successful Registration
    Given I am on the "My Account" page
    And I assigned a unique value to variable  "${EMAIL}"
    When I enter the email ${EMAIL} in the Register email field
    And I assigned string "${uniqueUser.password}" to variable "${PASSWORD}"
    And I enter a strong password in the Register password field
    And I click the "Register" button
    Then I should be redirected to the account dashboard
    And I should see the welcome message "Hello [username]"

  Scenario: 02 Login with valid credentials
    Given I am on the "My Account" page
    When I enter my registered email in the Login username field
    And I enter my correct password in the Login password field
    And I click the "Login" button
    Then The "Logout" link should be visible in the navigation
    And I should have access to the "Orders" and "Addresses" links

  Scenario: 03 Login with incorrect password
    Given I am on the "My Account" page
    When I enter a valid email but an incorrect password
    And I click the "Login" button
    Then I should see an error message starting with "Error: The password you entered"
    And I should remain on the login page

  Scenario: 04 Registration with invalid email format
    Given I am on the "My Account" page
    When I enter an invalid email format in the Register email field
    And I enter a valid password
    And I click "Register"
    Then The system should prevent submission
    And I should see an error related to invalid email address

  Scenario: 05 User Logout
    Given I am logged into my account
    When I click the "Logout" link in the dashboard menu
    Then I should be redirected back to the "My Account" login page
    And The login form should be empty and visible
