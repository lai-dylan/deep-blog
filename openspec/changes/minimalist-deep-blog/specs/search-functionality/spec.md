## ADDED Requirements

### Requirement: Build search index
The system SHALL generate a search index at build time.

#### Scenario: Index generation
- **WHEN** the site is built
- **THEN** the system generates search-index.json
- **AND** the index contains title, summary, tags, and content excerpt for each article

### Requirement: Client-side search
The system SHALL perform full-text search on the client side.

#### Scenario: Search execution
- **WHEN** user enters search terms
- **THEN** the system searches across titles, summaries, and tags
- **AND** returns matching articles sorted by relevance

#### Scenario: No search results
- **WHEN** search returns no matches
- **THEN** the system displays "未找到相关文章"
- **AND** suggests trying different keywords

### Requirement: Search interface
The system SHALL provide a search input component.

#### Scenario: Search input display
- **WHEN** the search page or search modal is opened
- **THEN** a search input field is displayed
- **AND** placeholder text reads "搜索文章..."

#### Scenario: Real-time search
- **WHEN** user types in the search input
- **THEN** results update in real-time as they type
- **AND** a minimum of 2 characters is required before searching
