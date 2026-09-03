# Test Specification — C-137 Task Protocol

## 1. Purpose

This document identifies the functional behaviours of the C-137 application and defines the test scenarios that will be used to build the test plan.

The scenarios are based on the current application specification, API routes, validation schemas, React components, authentication context, task context, and task services.

## 2. Scope

The test specification covers:

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


## 3. Test Scenario Conventions

| Prefix | Area |
|---|---|
| AU | Authentication |
| TK | Task management |
| FL | Filtering |
| SR | Search |
| SO | Sorting |
| ST | Statistics and progress metrics |
| API | API validation and error handling |
| ACC | Accessibility |

Priority:

- **High** — critical functionality or security behaviour
- **Medium** — important functional behaviour
- **Low** — secondary behaviour or UI detail

---

# 4. Test Scenarios

## 4.1 Authentication

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Registration | AU-01 | Register a new user with valid information | User does not already exist | Account is created and the authenticated user is returned | High |
| Registration | AU-02 | Register with an invalid email format | User is not registered | Validation error, no account is created | High |
| Registration | AU-03 | Register with a password shorter than 8 characters | User is not registered | Validation error, no account is created | High |
| Registration | AU-04 | Register with a password longer than 128 characters | User is not registered | Validation error, no account is created | Low |
| Registration | AU-05 | Register with a name shorter than 2 characters | User is not registered | Validation error, no account is created | Medium |
| Registration | AU-06 | Register with a name longer than 100 characters | User is not registered | Validation error, no account is created | Low |
| Registration | AU-07 | Register with an email that already exists | Account already exists | Registration is rejected with a conflict error | High |
| Registration | AU-08 | Register using an email with leading/trailing spaces | User does not already exist | Email is trimmed and the account is created | Low |
| Registration | AU-09 | Register using a name with leading/trailing spaces | User does not already exist | Name is trimmed before being stored | Low |
| Login | AU-10 | Sign in with valid credentials | Existing user | Login succeeds and an authentication session cookie is issued | High |
| Login | AU-11 | Sign in with a non-existing email | No matching user exists | Login is rejected with an invalid credentials error | High |
| Login | AU-12 | Sign in with an incorrect password | Existing user | Login is rejected with an invalid credentials error | High |
| Login | AU-13 | Sign in with an invalid email format | — | Validation error is returned | Medium |
| Login | AU-14 | Sign in with an empty password | — | Validation error is returned | Medium |
| Session | AU-15 | Retrieve the current authenticated user | Valid authenticated session | Current user profile is returned | High |
| Logout | AU-16 | Log out from an authenticated session | User is logged in | Session cookie is cleared and logout succeeds | High |
| Session | AU-17 | Access the application after logout | User has logged out | User is no longer authenticated | High |
| Session | AU-18 | Reload the application with a valid session | User is logged in | Session is restored and user remains authenticated | High |

## 4.2 Task Creation

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Create task | TK-01 | Create a task with a valid title | User is authenticated | Task is created and appears in the task list | High |
| Create task | TK-02 | Create a task with an empty title or only spaces | User is authenticated | Task is not created and a validation error is displayed | High |
| Create task | TK-03 | Create a task with a description | User is authenticated | Task is created with the supplied description | Medium |
| Create task | TK-04 | Create a task without a description | User is authenticated | Task is created with an empty description | Medium |
| Create task | TK-05 | Create a task with each supported priority | User is authenticated | Task is created with the selected priority | Medium |
| Create task | TK-06 | Create a task without explicitly selecting a priority | User is authenticated | Task uses the default medium priority | Medium |
| Create task | TK-07 | Create a task with a category | User is authenticated | Task is created with the selected category | Medium |
| Create task | TK-08 | Create a task without explicitly changing the category | User is authenticated | Task uses the form's default category | Medium |
| Create task | TK-09 | Create a task with a due date | User is authenticated | Task is created with the selected due date | Medium |
| Create task | TK-10 | Create a task without a due date | User is authenticated | Task is created without a due date | Medium |
| Create task | TK-11 | Create a task with a title exceeding the maximum length | User is authenticated | Task is rejected by validation | Medium |
| Create task | TK-12 | Create a task with a description exceeding the maximum length | User is authenticated | Task is rejected by validation | Medium |
| Create task | TK-13 | Create a task with an empty category | User is authenticated | Task falls back to the application's defined default behaviour | Medium |

## 4.3 Task Retrieval and Display

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Task list | TK-14 | Retrieve all tasks for the authenticated user | User is authenticated | Only and all of the user's tasks are returned | High |
| Task list | TK-15 | Open the application with no tasks | User is authenticated | Empty-state message is displayed | Medium |
| Task display | TK-16 | Display a task with a description | Task has a description | Description is displayed | Low |
| Task display | TK-17 | Display a task with a priority | Task has a priority | Correct priority label is displayed | Medium |
| Task display | TK-18 | Display a task with a category | Task has a category | Correct category is displayed | Medium |
| Task display | TK-19 | Display a task with a due date | Task has a due date | Due date is displayed | Medium |
| Task display | TK-20 | Display an overdue incomplete task | Task is incomplete and due date is in the past | Task is visually identified as overdue | Medium |
| Task display | TK-21 | Display an overdue completed task | Task is completed and due date is in the past | Task is not treated as an active overdue task | Medium |
| Task display | TK-22 | Display completed task | Task is completed | Completed task is displayed | Medium

## 4.4 Task Update

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Update task | TK-23 | Edit the title of an existing task | User is authenticated and task exists | Title is updated | High |
| Update task | TK-24 | Edit the description of an existing task | User is authenticated and task exists | Description is updated | Medium |
| Update task | TK-25 | Change task priority | User is authenticated and task exists | Priority is updated | Medium |
| Update task | TK-26 | Change task category | User is authenticated and task exists | Category is updated | Medium |
| Update task | TK-27 | Change task due date | User is authenticated and task exists | Due date is updated | Medium |
| Update task | TK-28 | Remove a task due date | User is authenticated and task has a due date | Due date is cleared | Medium |
| Update task | TK-29 | Attempt to save an empty title | User is editing a task | Task is not updated with an empty title validation error | High |
| Update task | TK-30 | Cancel task editing | User is editing a task | Original values are restored and no update is sent | Medium |

## 4.5 Task Completion

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Completion | TK-31 | Mark an incomplete task as completed | Task is incomplete | Task becomes completed | High |
| Completion | TK-32 | Mark a completed task as incomplete | Task is completed | Task becomes pending | High |

## 4.6 Task Deletion

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Delete task | TK-33 | Delete an existing task | Task exists | Task is removed from the list and database | High |
| Clear completed | TK-34 | Clear completed tasks | At least one task is completed | All completed tasks are removed | High |
| Clear completed | TK-35 | Clear completed tasks when none exist | No completed tasks | No task is removed and count is zero | Medium |
| Clear completed | TK-36 | Clear completed tasks when pending tasks also exist | Completed and pending tasks exist | Completed tasks are removed and pending tasks remain | High |

## 4.7 Priority Management

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Priority | PR-01 | Create a task with low priority | User is authenticated | Task has low priority | Medium |
| Priority | PR-02 | Create a task with medium priority | User is authenticated | Task has medium priority | Medium |
| Priority | PR-03 | Create a task with high priority | User is authenticated | Task has high priority | Medium |
| Priority | PR-04 | Create a task with urgent priority | User is authenticated | Task has urgent priority | High |

## 4.8 Categories

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Categories | CT-01 | Create a task with a predefined category | User is authenticated | Task is assigned to the selected category | Medium |
| Categories | CT-02 | Create a task with a custom category | User is authenticated | Custom category is stored and displayed | Medium |
| Categories | CT-05 | Create a task with a category longer than the maximum length | User is authenticated | Validation error is returned | Medium |

## 4.9 Due Dates

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Due dates | DU-01 | Create a task with a future due date | User is authenticated | Due date is stored and displayed | Medium |
| Due dates | DU-02 | Create a task with today's date | User is authenticated | Due date is stored and displayed | Medium |
| Due dates | DU-03 | Create a task with a past due date | User is authenticated | Task is created and identified as overdue while incomplete | Medium |

## 4.10 Filtering

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Status filter | FL-01 | Display all tasks | Tasks exist | Completed and pending tasks are displayed | High |
| Status filter | FL-02 | Display pending tasks only | Completed and pending tasks exist | Only incomplete tasks are displayed | High |
| Status filter | FL-03 | Display completed tasks only | Completed and pending tasks exist | Only completed tasks are displayed | High |
| Priority filter | FL-04 | Filter by low priority | Tasks have different priorities | Only low-priority tasks are displayed | Medium |
| Priority filter | FL-05 | Filter by medium priority | Tasks have different priorities | Only medium-priority tasks are displayed | Medium |
| Priority filter | FL-06 | Filter by high priority | Tasks have different priorities | Only high-priority tasks are displayed | Medium |
| Priority filter | FL-07 | Filter by urgent priority | Tasks have different priorities | Only urgent tasks are displayed | High |
| Category filter | FL-08 | Filter by category | Tasks have different categories | Only tasks in the selected category are displayed | High |
| Combined filters | FL-09 | Combine status and priority filters | Matching tasks exist | Only tasks matching both filters are displayed | High |

## 4.11 Search

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Search | SR-01 | Search for text contained in a task title | Matching task exists | Matching task is displayed | High |
| Search | SR-02 | Search for text contained in a task description | Matching task exists | Matching task is displayed | High |
| Search | SR-03 | Search using uppercase/lowercase variations | Matching task exists | Search remains case-insensitive | Medium |
| Search | SR-04 | Search using leading/trailing spaces | Matching task exists | Search ignores surrounding spaces | Medium |
| Search | SR-05 | Search for a term with no match | Tasks exist | Empty-state message is displayed | Medium |
| Search | SR-06 | Clear the search field | Search is active | Full task list is restored according to the other active filters | High |
| Search | SR-07 | Combine search with another filter | Matching tasks exist | Only tasks matching all active criteria are displayed | High |

## 4.12 Sorting

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Sorting | SO-01 | Sort by newest creation date | Multiple tasks exist | Newest tasks appear first | Medium |
| Sorting | SO-02 | Sort by oldest creation date | Multiple tasks exist | Oldest tasks appear first | Medium |
| Sorting | SO-03 | Sort by due date ascending | Multiple tasks have due dates | Tasks are ordered by due date ascending | Medium |
| Sorting | SO-04 | Sort by priority | Tasks have different priorities | Tasks are ordered according to the application's priority mapping | High |

## 4.13 Statistics and Progress Metrics

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Metrics | ST-01 | Display total task count | User has tasks | Total count matches the user's tasks | High |
| Metrics | ST-02 | Display completed task count | User has completed tasks | Completed count is correct | High |
| Metrics | ST-03 | Display pending task count | User has pending tasks | Pending count is correct | High |
| Metrics | ST-04 | Display priority distribution | User has tasks with different priorities | Counts by priority are correct | Medium |
| Metrics | ST-05 | Display categories | User has categorized tasks | Categories are returned and displayed | Medium |
| Metrics | ST-06 | Display completion percentage | User has tasks | Percentage equals completed / total * 100, rounded to the nearest integer | High |
| Metrics | ST-07 | Display metrics with no tasks | User has no tasks | Counts are zero and completion percentage is 0% | Medium |
| Metrics | ST-08 | Complete a task and verify metrics update | User has pending task | Completed/pending counts and progress percentage update | High |
| Metrics | ST-09 | Delete a task and verify metrics update | User has tasks | Total and relevant metrics update | High |

## 4.14 Accessibility

| Functionality | Test ID | Scenario | Preconditions | Expected Result | Priority |
|---|---|---|---|---|---|
| Accessibility | ACC-01 | Navigate authentication controls using the keyboard | Application is open | All interactive controls can receive keyboard focus | High |
| Accessibility | ACC-02 | Navigate task creation form using the keyboard | User is authenticated | Form controls can be operated without a mouse | High |
| Accessibility | ACC-03 | Use the task completion checkbox with assistive technology | Task exists | Checkbox has an accessible role, state and label | High |
| Accessibility | ACC-04 | Use edit and delete controls with assistive technology | Task exists | Controls expose meaningful accessible labels | High |
| Accessibility | ACC-05 | Inspect loading state with assistive technology | Tasks are loading | Loading state exposes an appropriate busy/label state | Medium |
| Accessibility | ACC-06 | Inspect empty task list with assistive technology | No tasks match | Empty-state content is exposed as status information | Medium |
| Accessibility | ACC-07 | Inspect completion progress | User has tasks | Progress bar exposes value, minimum, maximum and accessible label | Medium |

---

# 5. Test Specification Summary

The current specification contains scenarios covering:

- Authentication and session management
- CRUD operations
- Completion status
- Categories
- Priorities
- Due dates
- Filtering
- Search
- Sorting
- Statistics
- Accessibility

These scenarios will be used as the functional basis for the C-137 Test Plan.

The Test Plan will determine:

1. Which scenarios require unit tests.
2. Which scenarios require integration tests.
3. Which scenarios require end-to-end tests.
4. Which scenarios require accessibility testing.
