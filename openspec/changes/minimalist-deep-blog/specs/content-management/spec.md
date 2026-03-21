## ADDED Requirements

### Requirement: Parse Markdown files with frontmatter
The system SHALL parse Markdown files containing YAML frontmatter metadata.

#### Scenario: Valid article with frontmatter
- **WHEN** a Markdown file contains valid frontmatter
- **THEN** the system extracts title, date, tags, and summary fields
- **AND** the system extracts the Markdown content body

#### Scenario: Article without frontmatter
- **WHEN** a Markdown file lacks frontmatter
- **THEN** the system uses the filename as title
- **AND** the system sets the current date as publish date

### Requirement: Extract article metadata
The system SHALL extract and validate article metadata from frontmatter.

#### Scenario: Complete metadata
- **WHEN** frontmatter contains title, date, tags, summary
- **THEN** all fields are extracted and available for rendering

#### Scenario: Missing optional fields
- **WHEN** frontmatter lacks tags or summary
- **THEN** tags default to empty array
- **AND** summary defaults to first 200 characters of content

### Requirement: Handle images in content
The system SHALL support image references in Markdown content.

#### Scenario: Local image reference
- **WHEN** a Markdown file references an image via relative path
- **THEN** the image is copied to the output directory
- **AND** the image is accessible via the referenced path

#### Scenario: External image URL
- **WHEN** a Markdown file references an external image URL
- **THEN** the URL is preserved in the output
