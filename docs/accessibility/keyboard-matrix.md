# Keyboard Interaction Matrix

Date: 2026-03-16

| Flow                      | Keyboard Path                             | Expected                                                  | Status |
| ------------------------- | ----------------------------------------- | --------------------------------------------------------- | ------ |
| Toolbar focus order       | `Tab` / `Shift+Tab`                       | Predictable left-to-right navigation, no skipped controls | Pass   |
| Pagination buttons        | `Enter` / `Space` on First/Prev/Next/Last | Page changes and focus remains stable                     | Pass   |
| Page input                | Type number + `Enter`                     | Commits page navigation                                   | Pass   |
| Zoom controls             | `Enter` / `Space` on Zoom out/Fit/Zoom in | Zoom updates and state announcement occurs                | Pass   |
| More options menu open    | `Enter` / `Space` on summary trigger      | Menu panel opens and menu items reachable                 | Pass   |
| More options menu close   | `Escape`                                  | Menu closes and trigger regains focus                     | Pass   |
| Download/Print/Fullscreen | `Enter` / `Space` on action buttons       | Action fires with no keyboard trap                        | Pass   |
| Loading state             | Continue tabbing while loading            | No focus trap, controls remain reachable as expected      | Pass   |
| Error state               | Tabbing in error state                    | Error announced and focus behavior remains stable         | Pass   |
