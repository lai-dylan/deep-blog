## MODIFIED Requirements

### Requirement: Article content spacing
The system SHALL render article content with compact spacing.

#### Scenario: Paragraph spacing
- **WHEN** paragraphs are rendered
- **THEN** margin is 0.75rem 0 (reduced from 1rem)

#### Scenario: Heading margins
- **WHEN** headings are rendered
- **THEN** h2 margin-top is 1.5rem (reduced from 2rem)
- **AND** h3 margin-top is 1rem (reduced from 1.5rem)

#### Scenario: Code blocks
- **WHEN** code blocks are rendered
- **THEN** padding is 0.75rem (reduced from 1rem)
- **AND** margin is 1rem 0 (reduced from 1.5rem)

#### Scenario: Lists
- **WHEN** lists are rendered
- **THEN** margin is 0.75rem 0 (reduced from 1rem)
- **AND** li margin is 0.125rem 0 (reduced from 0.25rem)
