## MODIFIED Requirements

### Requirement: Article list density
The system SHALL display articles with compact spacing.

#### Scenario: Article list layout
- **WHEN** article list is rendered
- **THEN** space-y-4 is used (reduced from space-y-8)
- **AND** each card padding is reduced

#### Scenario: Article card content
- **WHEN** article card is rendered
- **THEN** title margin-bottom is 0.5rem (reduced from 1rem)
- **AND** meta info margin-bottom is 0.25rem (reduced from 0.75rem)
- **AND** summary line-clamp is 2 lines
