# Screen Reader Matrix

Date: 2026-03-16

## Environments

- macOS + Safari + VoiceOver
- Windows + Firefox + NVDA

## Results

| Behavior                            | VoiceOver | NVDA | Notes                                                                      |
| ----------------------------------- | --------- | ---- | -------------------------------------------------------------------------- |
| Toolbar landmark/role announced     | Pass      | Pass | Toolbar exposes `role="toolbar"` and accessible label                      |
| Icon controls have accessible names | Pass      | Pass | Buttons use explicit `aria-label`                                          |
| Page input name announced           | Pass      | Pass | `aria-label="Page number"`                                                 |
| Loading status announced            | Pass      | Pass | Polite live region + status message                                        |
| Error state announced               | Pass      | Pass | Assertive live region + alert role                                         |
| Page change announcement            | Pass      | Pass | Polite live region reports `Page X of Y`                                   |
| Zoom change announcement            | Pass      | Pass | Polite live region reports zoom percent                                    |
| More options menu semantics         | Pass      | Pass | Summary trigger with expanded/haspopup, menu items announced as actionable |
| Escape close on menu                | Pass      | Pass | Focus returned to trigger                                                  |

## Caveats

- Canvas page content itself is not exposed as semantic document text.
- For strict document-reading accessibility, provide alternate accessible source or text extraction workflow.
