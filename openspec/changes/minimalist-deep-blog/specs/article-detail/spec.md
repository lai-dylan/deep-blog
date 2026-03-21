## ADDED Requirements

### Requirement: Render article content
The system SHALL render Markdown content to HTML with proper formatting.

#### Scenario: Basic Markdown rendering
- **WHEN** an article contains Markdown syntax
- **THEN** the system converts it to semantic HTML
- **AND** includes proper heading hierarchy

#### Scenario: Code syntax highlighting
- **WHEN** an article contains code blocks with language identifier
- **THEN** the system applies syntax highlighting
- **AND** displays line numbers optionally

### Requirement: Generate table of contents
The system SHALL generate a table of contents from article headings.

#### Scenario: Article with headings
- **WHEN** an article contains H2 and H3 headings
- **THEN** the system generates a TOC
- **AND** links each TOC item to the corresponding heading

#### Scenario: Article without headings
- **WHEN** an article has no H2/H3 headings
- **THEN** the TOC is not displayed

### Requirement: Handle 404 for missing articles
The system SHALL display a 404 page for non-existent article slugs.

#### Scenario: Invalid article slug
- **WHEN** user visits a non-existent article URL
- **THEN** the system displays a 404 page
- **AND** provides a link back to the article list
