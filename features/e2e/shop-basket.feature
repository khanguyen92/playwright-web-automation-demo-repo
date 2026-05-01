Feature: Inventory and Cart Calculations

  Scenario: 01 Filter products by price range
    Given I am on the Shop page
    When I adjust the price filter slider to a specific range
    And I click the "Filter" button
    Then All displayed products must have prices within the selected range

  Scenario: 02 Add item to basket from Shop page
    Given I am on the Shop page
    When I click the "Add to Basket" button for a specific book
    Then A "View Basket" button should appear next to the product
    And The cart count in the header should update to "1 item"

  Scenario: 03 Apply valid Coupon Code
    Given I have "Selenium Ruby" book in my basket
    And I am on the "Basket" page
    When I enter the coupon code "krishnasakthi" in the coupon field
    And I click "Apply Coupon"
    Then I should see a response message after applying coupon

  Scenario: 04 Remove product from Basket
    Given I have at least one product in my basket
    When I click the "X" button next to the product in the Basket table
    Then The product should disappear from the list
    And I should see the message "Your basket is currently empty"

  Scenario: 05 Update Basket Quantity
    Given I have one book in my basket
    When I change the quantity input field to "3"
    And I click the "Update Basket" button
    Then The subtotal for that item should be multiplied by 3
    And The total cart value should be updated accordingly
