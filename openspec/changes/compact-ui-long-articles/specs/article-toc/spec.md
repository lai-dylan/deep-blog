## ADDED Requirements

### Requirement: Generate table of contents
The system SHALL generate a TOC from article headings.

#### Scenario: Article with H2/H3
- **WHEN** article contains H2 or H3 headings
- **THEN** TOC is generated with all heading titles
- **AND** each item links to the corresponding heading

#### Scenario: Article without headings
- **WHEN** article has no H2/H3
- **THEN** TOC is not displayed

### Requirement: Display TOC component
The system SHALL display TOC in a fixed position on article pages.

#### Scenario: Desktop view
- **WHEN** viewport width >= 1280px
- **THEN** TOC is displayed on the right side
- **AND** position is fixed while scrolling

#### Scenario: Mobile view
- **WHEN** viewport width < 1280px
- **THEN** TOC is collapsed to a toggle button
- **AND** expands when clicked

### Requirement: Active section highlighting
The system SHALL highlight the current section in TOC.

#### Scenario: Section in viewport
- **WHEN** user scrolls to a section
- **THEN** corresponding TOC item is highlighted
- **AND** highlight updates on scroll
