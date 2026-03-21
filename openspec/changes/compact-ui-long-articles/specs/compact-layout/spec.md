## ADDED Requirements

### Requirement: Reduce global spacing
The system SHALL use compact spacing values for margins and paddings.

#### Scenario: Spacing variables
- **WHEN** CSS variables are defined
- **THEN** spacing scale uses compact values (xs: 0.25rem, sm: 0.375rem, md: 0.75rem, lg: 1rem, xl: 1.5rem, 2xl: 2rem)

#### Scenario: Page layout padding
- **WHEN** page layout is rendered
- **THEN** horizontal padding is px-4 sm:px-6 (compact)
- **AND** vertical padding is reduced from py-12 to py-8

### Requirement: Adjust line height
The system SHALL use compact line height for long text readability.

#### Scenario: Body text
- **WHEN** prose content is rendered
- **THEN** line-height is 1.65 (reduced from 1.75)

#### Scenario: Headings
- **WHEN** headings are rendered
- **THEN** margin-top is reduced by 25% for h2, h3
