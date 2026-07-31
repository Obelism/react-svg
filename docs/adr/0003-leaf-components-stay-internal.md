# Leaf components stay internal

Splitting the generators into real modules ([ADR-0001](./0001-library-owns-the-use-client-boundary.md))
produced seven components where there were previously two exports. The
intermediate ones — the base SVG element, the three render-type
implementations, and the group that fetches an SVG's markup — are all working
components that could be exported.

We decided not to export them. The public surface is the two components, the
config factory, the setup helper, and the pure URL helpers.

## Consequences

- Their props are resolved internals rather than a designed API — a leaf takes
  the already-looked-up svg entry and an already-defaulted folder string.
  Exporting them would freeze that shape as a compatibility promise for
  something nobody asked for.
- Every export is also a boundary and a documentation obligation. Keeping the
  set small keeps both small.
- This is easy to reverse in the permissive direction: any leaf can be exported
  later if a real use case appears. Going the other way is a major version.
  The absence is deliberate — it is not an oversight to be "fixed".
