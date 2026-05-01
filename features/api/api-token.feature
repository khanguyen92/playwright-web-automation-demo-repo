Feature: API Token Management

  Scenario: TC-API-001 Create a token with valid payload
    Given I have a valid API request context
    When I create a token with payload key "type" and value "bearer"
    Then The API response status should be 200 or 201
