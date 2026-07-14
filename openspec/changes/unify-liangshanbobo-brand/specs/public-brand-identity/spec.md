# Public Brand Identity Specification

## ADDED Requirements

### Requirement: Canonical personal identity

Every public personal identity surface SHALL use `Liangshanbobo` in normal
text and `LIANGSHANBOBO` in display wordmarks.

#### Scenario: A visitor opens the personal website

- **WHEN** the visitor sees the header, metadata, articles, about page, or footer
- **THEN** the visible personal identity is Liangshanbobo
- **AND** no `YOUR.NAME` or `LIANG.0417` placeholder remains

### Requirement: Stable GitHub account identity

The system SHALL preserve `@liang0417` as the GitHub login and the
`liang0417/liang0417` profile repository.

#### Scenario: A public link targets the GitHub account

- **WHEN** a visitor follows an account or ownership link
- **THEN** it resolves through `https://github.com/liang0417`

### Requirement: Canonical personal website identity

The personal website repository SHALL be named `liangshanbobo`, and all
repository-relative deployment base paths SHALL use that repository name.

#### Scenario: The website is built for GitHub hosting

- **WHEN** the production build runs under GitHub Actions
- **THEN** generated asset and route paths use `/liangshanbobo/`

### Requirement: Canonical flagship product identity

The former L41 Context product SHALL be named `Shanbo Context`, use the
`shanbo-context` repository/package identifier, and use
`shanbo_context` for Python imports.

#### Scenario: A developer installs or runs the backend

- **WHEN** the developer follows the public README
- **THEN** the documented package and module commands use Shanbo identifiers
- **AND** no active L41 package identifier remains

### Requirement: Verified public migration

Each renamed repository SHALL pass its normal project checks and redaction scan
before publication, and the pushed branch SHA SHALL match the local commit.

#### Scenario: The migration is reported complete

- **WHEN** completion is announced
- **THEN** repository visibility, canonical URL, branch, SHA, and check results
  have been verified
- **AND** no unverified custom-domain or mainland deployment claim is made
