# React SVG

A React library for rendering SVGs from a declared set, without converting each
one into a component. Consumers declare what SVGs exist and how to find them,
then render them by name.

## Language

**Svg map**:
The declared set of SVGs an application can render, keyed by name. Declaring it
is what makes rendering by name possible, and what makes the names checkable.
_Avoid_: icon set, sprite map, registry

**Svg entry**:
What a single key in the svg map maps to — the intrinsic dimensions of one SVG,
plus optionally where to find it and what it depicts.
_Avoid_: svg config, icon definition, svg data

**Svg options**:
What a consumer declares before defaults are applied — an svg map plus how to
locate and namespace it. Resolving it produces an svg config.
_Avoid_: args, settings, setup

**Svg config**:
The resolved settings a set of components renders against: an svg map together
with how to locate and namespace it, with every default filled in. "Config"
always means this whole object, never a single entry and never the unresolved
options it came from.
_Avoid_: resolved config, setup

**Namespace**:
The prefix that scopes one config's DOM ids and shared cache keys, so two
configs living in the same application cannot collide. Named the same in the
options a consumer writes and in the resolved config.
_Avoid_: id prefix, scope

**Definitions block**:
The hidden SVG element holding one definition per linked SVG, which linked SVGs
elsewhere on the page point at. Exists once per config.
_Avoid_: defs, sprite, symbol sheet

### Render types

**Render type**:
How a single SVG gets onto the page. Three are built in; more can be added.
_Avoid_: mode, variant, strategy, loading method

**Link**:
The render type that fetches an SVG once into the definitions block and
references it wherever it appears. One copy in the DOM, many places on screen,
each still responsive to inherited styling.
_Avoid_: reference, use, sprite

**Inline**:
The render type that embeds an SVG's markup directly at the point of use, so
its internal parts can be targeted individually. Costs a copy per usage.
_Avoid_: embed, raw

**External**:
The render type that points an image element at the SVG file, reserving its
aspect ratio while it loads. Cheapest to render, but the SVG's internals are
unreachable.
_Avoid_: img, image, file

**Renderer**:
A consumer-supplied component that adds a render type beyond the built-in
three, receiving the same information the built-in ones do.
_Avoid_: custom component, adapter, plugin
