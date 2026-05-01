🏗 Module 1: Homepage (Arrivals & Sliders)
Feature: Homepage Element Validation

Scenario 01: Verify exactly three sliders exist on the home page

GIVEN I navigate to "https://practice.automationtesting.in/"

WHEN I locate the slider containers on the homepage

THEN I should count exactly 3 slider elements

And each slider should be visible to the user

Scenario 02: Verify new arrivals count

GIVEN I am on the homepage

WHEN I scroll down to the "New Arrivals" section

THEN I should see exactly 3 product items displayed

And each product should have an "Add to Basket" button or "Read More" link

Scenario 03: Navigation via Arrival Images

GIVEN I am on the homepage

WHEN I click on the image of the first product in "New Arrivals"

THEN The URL should change to the specific product detail page

And The page should display the product title and "Add to Basket" button

Scenario 04: Product Description Tab validation

GIVEN I have clicked on a product from the Arrivals section

WHEN I click on the "Description" tab at the bottom of the page

THEN The description text area should be visible

And It should contain more than 50 characters of text

Scenario 05: Product Reviews Tab validation

GIVEN I have clicked on a product from the Arrivals section

WHEN I click on the "Reviews" tab

THEN I should see the "Add a review" form

And The "Submit" button for the review should be present

🔐 Module 2: My Account (Authentication)
Feature: User Identity & Access Management

Scenario 01: Successful Registration

GIVEN I navigate to "https://practice.automationtesting.in/my-account/"

WHEN I enter a unique email "tester_unique@example.com" in the Register email field

And I enter a strong password "P@ssword12345!" in the Register password field

And I click the "Register" button

THEN I should be redirected to the account dashboard

And I should see the welcome message "Hello [username]"

Scenario 02: Login with valid credentials

GIVEN I am on the "My Account" page

WHEN I enter my registered email in the Login username field

And I enter my correct password in the Login password field

And I click the "Login" button

THEN The "Sign out" link should be visible in the navigation

And I should have access to the "Orders" and "Addresses" links

Scenario 03: Login with incorrect password

GIVEN I am on the "My Account" page

WHEN I enter a valid email but an incorrect password "wrongpassword"

And I click the "Login" button

THEN I should see an error message starting with "Error: The password you entered"

And I should remain on the login page

Scenario 04: Registration with invalid email format

GIVEN I am on the "My Account" page

WHEN I enter "invalid_email_format" in the Register email field

And I enter a valid password

And I click "Register"

THEN The system should prevent submission

And I should see an error related to invalid email address

Scenario 05: User Logout

GIVEN I am logged into my account

WHEN I click the "Logout" link in the dashboard menu

THEN I should be redirected back to the "My Account" login page

And The login form should be empty and visible

🛍 Module 3: Shop & Basket (E-Commerce Logic)
Feature: Inventory and Cart Calculations

Scenario 01: Filter products by price range

GIVEN I navigate to "https://practice.automationtesting.in/shop/"

WHEN I adjust the price filter slider to a specific range (e.g., 150-450)

And I click the "Filter" button

THEN All displayed products must have prices within the selected range

Scenario 02: Add item to basket from Shop page

GIVEN I am on the Shop page

WHEN I click the "Add to Basket" button for a specific book

THEN A "View Basket" button should appear next to the product

And The cart count in the header should update to "1 Item"

Scenario 03: Apply valid Coupon Code

GIVEN I have "Selenium Ruby" book in my basket

And I am on the "Basket" page

WHEN I enter the coupon code "krishnasakthi" in the coupon field

And I click "Apply Coupon"

THEN I should see a success message "Coupon code applied successfully"

And The total amount should show a discount deduction

Scenario 04: Remove product from Basket

GIVEN I have at least one product in my basket

WHEN I click the "X" (Remove) button next to the product in the Basket table

THEN The product should disappear from the list

And I should see the message "Your basket is currently empty"

Scenario 05: Update Basket Quantity

GIVEN I have one book in my basket

WHEN I change the quantity input field to "3"

And I click the "Update Basket" button

THEN The subtotal for that item should be multiplied by 3

And The total cart value should be updated accordingly