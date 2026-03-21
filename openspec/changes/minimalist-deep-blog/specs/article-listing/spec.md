## ADDED Requirements

### Requirement: Display article list
The system SHALL display a paginated list of all articles sorted by publish date (newest first).

#### Scenario: Default list view
- **WHEN** user visits the homepage
- **THEN** the system displays up to 10 articles per page
- **AND** articles are sorted by date in descending order

#### Scenario: Pagination
- **WHEN** there are more than 10 articles
- **THEN** pagination controls are shown
- **AND** user can navigate to next/previous pages

### Requirement: Article list item display
The system SHALL display article information in list view.

#### Scenario: Article card content
- **WHEN** rendering an article list item
- **THEN** the system displays title, date, summary, and tags
- **AND** the title links to the article detail page

### Requirement: Empty state
The system SHALL display an appropriate message when no articles exist.

#### Scenario: No articles available
- **WHEN** the content directory is empty
- **THEN** the system displays "暂无文章" message
- **AND** provides guidance on adding articles
