## ADDED Requirements

### Requirement: Display all tags
The system SHALL display a list of all tags used across articles.

#### Scenario: Tags page
- **WHEN** user visits the /tags page
- **THEN** the system displays all unique tags
- **AND** shows the count of articles for each tag
- **AND** tags are sorted alphabetically

### Requirement: Filter articles by tag
The system SHALL display articles filtered by a specific tag.

#### Scenario: Tag filter page
- **WHEN** user visits /tags/[tag] URL
- **THEN** the system displays only articles with that tag
- **AND** shows the tag name as page title

#### Scenario: Non-existent tag
- **WHEN** user visits a tag URL with no articles
- **THEN** the system displays "该标签下暂无文章"
- **AND** provides a link to view all tags

### Requirement: Tag display in article
The system SHALL display tags on article detail page.

#### Scenario: Article with tags
- **WHEN** viewing an article with tags
- **THEN** tags are displayed below the article title
- **AND** each tag links to its filter page
