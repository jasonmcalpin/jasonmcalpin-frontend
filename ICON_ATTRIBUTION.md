# Icon sources and attribution

All general-purpose interface icons in `src/components/global/Icons/index.tsx`
are sourced from **Dazzle Line Icons**, designed by **Dazzle UI**, as listed
in the [SVG Repo Dazzle Line collection](https://www.svgrepo.com/collection/dazzle-line-icons/).

The icons were embedded as inline SVG path data with `currentColor` to keep
the website's existing CSS-driven colors. Dimensions are controlled by the
site's `site-icon` component rather than the source SVGs' explicit pixel sizes.

| Site icon | Dazzle source icon | Source |
| --- | --- | --- |
| `angle-right` | chevron-right | [Collection SVG](https://github.com/noname21024/viconic-svg/blob/main/assets/dazzle-line/svg/chevron-right.svg) |
| `calendar-days` | calendar-alt | [SVG Repo](https://www.svgrepo.com/svg/533381/calendar-alt) |
| `clock` | alarm-clock-alt | [SVG Repo](https://www.svgrepo.com/svg/532083/alarm-clock-alt) |
| `link` | link-alt-1 | [SVG Repo](https://www.svgrepo.com/svg/532869/link-alt-1) |
| `envelope` | mail | [Collection SVG](https://github.com/noname21024/viconic-svg/blob/main/assets/dazzle-line/svg/mail.svg) |
| `location-dot` | map-pin-alt | [Collection SVG](https://github.com/noname21024/viconic-svg/blob/main/assets/dazzle-line/svg/map-pin-alt.svg) |
| `building` | building | [Collection SVG](https://github.com/noname21024/viconic-svg/blob/main/assets/dazzle-line/svg/building.svg) |
| `gauge-high` | gauge | [Collection SVG](https://github.com/noname21024/viconic-svg/blob/main/assets/dazzle-line/svg/gauge.svg) |

**Attribution:** Dazzle UI — Dazzle Line Icons. The Dazzle Line collection
is commonly attributed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/);
some SVG Repo item pages identify particular icons as CC0. This notice is
maintained for the collection and its author, with individual SVG Repo pages
as authoritative references for specific item licenses.

**Brand-logo exception:** The `github` icon is the GitHub mark and is not
represented as a Dazzle Line icon. It remains separately scoped to the
site's existing GitHub links; it is not a general UI glyph.

No SVGs or icon fonts are fetched from third parties at runtime.
