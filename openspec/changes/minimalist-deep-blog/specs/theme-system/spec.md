## ADDED Requirements

### Requirement: Support light and dark themes
The system SHALL support both light and dark color themes.

#### Scenario: Light theme
- **WHEN** light theme is active
- **THEN** the UI uses light background with dark text
- **AND** code blocks use light syntax highlighting

#### Scenario: Dark theme
- **WHEN** dark theme is active
- **THEN** the UI uses dark background with light text
- **AND** code blocks use dark syntax highlighting

### Requirement: Theme toggle
The system SHALL provide a theme toggle control.

#### Scenario: Toggle theme
- **WHEN** user clicks the theme toggle button
- **THEN** the theme switches between light and dark
- **AND** the preference is persisted in localStorage

### Requirement: Respect system preference
The system SHALL detect and respect the user's system theme preference.

#### Scenario: System preference detection
- **WHEN** user has not set a theme preference
- **THEN** the system uses prefers-color-scheme media query
- **AND** applies the appropriate theme automatically

### Requirement: Prevent theme flash
The system SHALL prevent theme flashing on page load.

#### Scenario: Initial page load
- **WHEN** a page loads
- **THEN** the theme is applied before any content renders
- **AND** no visible flash occurs between themes
