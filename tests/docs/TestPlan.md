## 1. INTRODUCTION 

### Application description 

C-137 is an accessible full-stack task management web application with user authentication (registration, login, logout, session persistence), categorized task tracking, priority management, due dates, filtering, search, and progress metrics.

This plan is based on the test scenarios defined in the Test Specification. 

### Objective 

The main objectives of the testing process are to:

- Verify that the main application functionalities work as expected.
- Verify that the application behaves correctly for both valid and invalid inputs.
- Detect functional and technical defects.
- Verify the interaction between the React frontend, Node backend and database.
- Verify authentication.
- Ensure that critical user journeys work from end to end.
- Identify regressions when the application is modified.

## 2. SCOPE 

### In-Scope 

We plan to test the following functionalities: 
- Authentication and session management
- Task creation
- Task retrieval and display
- Task update
- Task completion status
- Task deletion
- Clearing completed tasks
- Categories
- Priority management
- Due dates and overdue status
- Filtering
- Search
- Sorting
- Progress metrics
- Basic accessibility behaviours

### Out-of-Scope 

The following aspects are outside the scope of this test plan unless
specifically required:

- Performance testing under production-level load
- Security penetration testing
- Browser compatibility across all existing browsers
- Production infrastructure testing

## 3. TEST SCHEDULE

### Start date and Entry Criteria

September 1st 2026.

Testing can begin when:

- The application can be installed successfully.
- The frontend can be started.
- The backend can be started.
- PostgreSQL is available.
- The test environment is configured.
- Required dependencies are installed.
- The relevant test data is available.
- The Test Specification has been completed.
- The Test Plan has been defined.

### End date and Exit Criteria

September 4th 2026.

Testing can be considered complete when:

- All planned high-priority tests have been executed.
- All critical tests pass.
- No unresolved critical defect remains.
- The main end-to-end user journeys pass.
- Unit and integration test suites pass.
- Test results have been documented.

### Testing phases 

The testing strategy follows a layered approach.

#### Unit Testing

Unit tests will verify individual functions and components in isolation.

They will focus on:

- Input validation
- Task manipulation logic
- Filtering and sorting logic
- Progress calculations
- Individual React components
- Utility functions

#### Integration Testing

Integration tests will verify that different parts of the application
work correctly together.

They will focus on:

- React components interacting with application logic
- Frontend services communicating with the API
- API routes interacting with the database
- Authentication and session management
- Task persistence

#### End-to-End Testing

End-to-end tests will verify complete user journeys through the application.

They will cover critical workflows such as:

1. Registering a user
2. Signing in
3. Creating a task
4. Editing a task
5. Completing a task
6. Filtering and searching tasks
7. Deleting a task
8. Signing out

## 4. TEST RESOURCES ##

### Test Team ###

Me, myself and I

### Test Environment ###

#### Frontend

- React 18.3.1
- Vite 6.4.3

#### Backend

- Node.js 22 LTS
- Express 

#### Database

- PostgreSQL

#### Operating System

- Windows, Linux and MacOS

The tests will be executed in a local development environment.

### Test data

Test data will include:

- Valid and invalid user accounts
- Valid and invalid authentication inputs
- Tasks with different priorities
- Tasks with different categories
- Completed and pending tasks
- Tasks with and without descriptions
- Tasks with and without due dates
- Tasks with future and past due dates
- Tasks with different titles and descriptions

### Tools and software

| Tool | Purpose |
|---|---|
| Vitest | Unit and functional testing |
| React Testing Library | Testing React components |
| Playwright / Cypress | End-to-end testing |
| PostgreSQL | Database testing |
| Lighthouse | Web navigator tester (accessibility)  |
| GitHub | Version control and test documentation |

## 5. TESTING APROACHES 

### Testing Types 

The following test types will be used:

#### Functional Testing

Verify that application features behave according to the expected results
defined in the Test Specification.

#### Validation Testing

Verify that invalid inputs are rejected correctly.

#### Regression Testing

Verify that previously working functionality remains functional after
changes to the application.

#### Accessibility Testing

Verify that important user interface controls can be used with keyboard
navigation and assistive technologies.

#### Error Handling Testing

Verify that the application handles API, authentication and validation
errors correctly.

### Testing Techniques 

The following test design techniques will be used:

#### Positive Testing

Testing valid inputs and expected user actions.

#### Negative Testing

Testing invalid inputs and unexpected user actions.

#### Boundary Value Testing

Testing values at the limits of accepted input ranges, such as password length and maximum field length.

### Testing Levels 

#### Unit Tests

Unit tests will be used to validate isolated pieces of application logic.

The objective is to detect errors as early as possible.

#### Integration Tests

Integration tests will verify interactions between application components,
services, API routes and the database.

#### End-to-End Tests

End-to-end tests will validate complete user workflows through the
frontend and backend.

## 6. TEST CASE DESIGN

### Test Case Creation

Test cases will be derived from the scenarios defined in the Test Specification.

Each test case will include:

- Test ID
- Scenario
- Preconditions
- Test steps
- Test data
- Expected result
- Test level
- Priority
- Actual result
- Status

### Test Case Organization

Test cases will be organized by functionality and test level.

The test IDs and categories defined in the Test Specification will be used to maintain traceability between the Test Specification, the Test Plan and the automated tests.

### Test Coverage Matrix

The following matrix defines which test level will be used for each test scenario.

| Test Area              | Test IDs      | Unit | Integration | E2E | Accessibility |
| ---------------------- | ------------- | :--: | :---------: | :-: | :-----------: |
| Registration           | AU-01–AU-09   |   ✓  |      ✓      |  ✓  |       ✓       |
| Login                  | AU-10–AU-14   |   ✓  |      ✓      |  ✓  |       ✓       |
| Session / Logout       | AU-15–AU-18   |      |      ✓      |  ✓  |               |
| Task creation          | TK-01–TK-13   |   ✓  |      ✓      |  ✓  |       ✓       |
| Task retrieval/display | TK-14–TK-22   |   ✓  |      ✓      |  ✓  |               |
| Task update            | TK-23–TK-30   |   ✓  |      ✓      |  ✓  |       ✓       |
| Task completion        | TK-31–TK-32   |   ✓  |      ✓      |  ✓  |       ✓       |
| Task deletion          | TK-33–TK-36   |      |      ✓      |  ✓  |       ✓       |
| Priority Management    | PR-01–PR-04   |   ✓  |      ✓      |  ✓  |               |
| Categories             | CAT-01–CAT-03   |   ✓  |      ✓      |  ✓  |               |
| Due dates              | DU-01–DU-03   |   ✓  |      ✓      |  ✓  |               |
| Filtering              | FL-01–FL-09   |   ✓  |      ✓      |  ✓  |               |
| Search                 | SR-01–SR-07   |   ✓  |      ✓      |  ✓  |               |
| Sorting                | SO-01–SO-04   |   ✓  |      ✓      |  ✓  |               |
| Statistics & Progress Metrics  | ST-01–ST-09   |  ✓  |  ✓    |    ✓  |           
| Accessibility          | ACC-01–ACC-07 |      |             |  ✓  |       ✓       |


## 7. TEST EXECUTION 

### Test Execution Plan 

Tests will be executed progressively according to the following order:

1. Unit tests
2. Integration tests
3. End-to-end tests
4. Accessibility tests
5. Regression tests after defect fixes


### Defect Management 

When a test fails, the defect will be documented with:

- Test ID
- Description
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Environment
- Status

Defects will be classified according to the following severity levels:

- Critical: prevents a critical user journey from functioning.
- High: significantly affects an important functionality.
- Medium: affects functionality but does not prevent normal use of the application.
- Low: minor functional or UI issue.

## 8. TEST METRICS 

### Test Progress Metrics 

Key metrics include:

1. Percentage of test cases executed
2. Percentage of test cases passed
3. Percentage of test cases failed
4. Number of defects identified
5. Number of critical and high-severity defects

### Test Completion Criteria 

Testing is considered complete when:

- All planned high-priority test cases have been executed.
- Critical user journeys have been successfully validated.
- No unresolved critical defect remains.
- Test results have been documented.
- Known limitations and unresolved lower-severity defects have been documented.

## 9. RISKS AND LIMITATIONS

Potential risks include:

- Database availability problems
- Differences between the test environment and production
- Unexpected API failures
- Insufficient test data
- Undetected regressions
- Limitations in end-to-end test coverage
- Limited time for executing the full test suite.
- Limited end-to-end test coverage.
- Accessibility testing may be limited to the main application controls and workflows.

## 10. APPROVAL 

### Sign-off 

The Test Plan will be reviewed by the project author before test execution begins.