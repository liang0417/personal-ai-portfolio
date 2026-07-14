# Design

## Canonical naming

| Surface | Canonical value |
| --- | --- |
| Public personal brand | `Liangshanbobo` |
| Display wordmark | `LIANGSHANBOBO` |
| Stable GitHub login | `@liang0417` |
| GitHub profile repository | `liang0417/liang0417` |
| Personal website repository | `liang0417/liangshanbobo` |
| Current website link | `https://github.com/liang0417/liangshanbobo` |
| Flagship product | `Shanbo Context` |
| Flagship repository | `liang0417/shanbo-context` |
| Python import package | `shanbo_context` |

## Boundaries

- The GitHub login stays `liang0417` because renaming it would invalidate or
  redirect a large set of historical URLs and the special profile repository.
- `Shanbo Context` remains a distinct product name under the Liangshanbobo
  identity instead of repeating the full personal name in every product.
- The current website link points to the renamed public repository. A custom
  domain or mainland-China deployment must not be claimed until domain, ICP,
  CDN, HTTPS, and live access are verified.
- The avatar remains unchanged because it contains no deprecated text and a new
  avatar has not been approved.
- The existing local checkout directory is not moved as part of this public
  rename; moving a non-temporary directory outside the active workspace
  requires a separate explicit filesystem instruction.

## Migration approach

1. Update and validate repository contents before remote renames.
2. Rename the two GitHub repositories.
3. Update local remotes to the canonical URLs.
4. Push sanitized commits and verify local/remote SHA parity.
5. Update the GitHub profile website field and README links.
