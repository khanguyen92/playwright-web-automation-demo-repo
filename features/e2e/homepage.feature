@test
Feature: Homepage Element Validation

  Scenario: 01 Verify exactly three sliders exist on the home page
    Given I navigate to "${BASE_URL}"
    When I locate the slider containers on the homepage
    Then I should count exactly 3 slider elements
    And each slider should be visible to the user

  Scenario: 02 Verify new arrivals count
    Given I am on the homepage
    When I scroll down to the "New Arrivals" section
    Then I should see exactly 3 product items displayed
    And each product should have an "Add to Basket" button or "Read More" link

  Scenario: 03 Navigation via Arrival Images
    Given I am on the homepage
    When I click on the image of the first product in "New Arrivals"
    Then The URL should change to the specific product detail page
    And The page should display the product title and "Add to Basket" button

  Scenario: 04 Product Description Tab validation
    Given I have clicked on a product from the Arrivals section
    When I click on the "Description" tab at the bottom of the page
    Then The description text area should be visible
    And It should contain more than 50 characters of text

  Scenario: 05 Product Reviews Tab validation
    Given I have clicked on a product from the Arrivals section
    When I click on the "Reviews" tab
    Then I should see the "Add a review" form
    And The "Submit" button for the review should be present
