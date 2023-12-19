# React SVG

> A performant way to load and show SVG in React applications.

<p>
    <a aria-label="NPM version" href="https://www.npmjs.com/package/@obelism/react-svg">
        <img alt="" src="https://badgen.net/npm/v/@obelism/react-svg">
    </a>
    <a aria-label="Package size" href="https://bundlephobia.com/result?p=@obelism/react-svg">
        <img alt="" src="https://badgen.net/bundlephobia/minzip/@obelism/react-svg">
    </a>
    <a aria-label="License" href="https://github.com/Obelism/react-SVG/blob/main/LICENSE">
        <img alt="" src="https://badgen.net/npm/license/@obelism/react-svg">
    </a>
</p>

The concept is to provide a minimal API to render SVGs without needing to convert them to React components. This library support three ways to show SVGs;

- **Image**, it uses an image element to lazy load the SVG while provider the correct aspect ratio at all times. The most performant way of loading but doesn't give any context to the loaded SVG.
- **Reference**, Using a global definition. This lazy loads the SVG in the provider and makes it possible to reference it in multiple places. This has the advantage of having the SVG in the DOM once and displaying it multiple times. This still works with contextual properties like; `fill: currentColor` in multiple places. A good middle ground between performance and control.
- **Inline**, When specific parts of the SVG need to be controlled, nothing beats inlining the SVG. However with that comes the drawback that when

## Quick start

```js
import setupReactSvg from '@obelism/react-svg'

export const { SvgProvider, Svg } = setupReactSvg({
    svgs: {
        arrowBack: {
            path: '/SVGs/arrow-back.svg',
            width: 800,
            height: 800,
            x: 0,
            y: 0,
            alt: 'Back arrow',
        },
    },
})
```

In the initialization there needs to be an object of all SVGs that you support. This is a key/value object with path, viewbox info and alt tag. This gives you back two components. The `SvgProvider` needs to wrap all places where the `Svg` component is going to be used. Then when using the SVG component you provide the SVG to be shown, and the way it needs to be loaded; `link`, `external` or `inline`.

```jsx
<SvgProvider>
    <header>
        <a href='/previous'>
            <Svg type="link" svg='arrowBack' />
            Back to overview
        </a>
    </header>

    <main>...</main>

    <footer>
        <a href='/previous'>
            <Svg type="link" svg='arrowBack' />
            Previous article
        </a>

        <a href='/next'>
            <span className="flipped">
                <Svg type="link" svg='arrowBack' alt="Forward arrow" />
            </span>
            Next article
        </a>
    </footer>
<SvgProvider>
```

## API

This library consist of three parts; the generator which gives you a provider and a consumer.

### setupReactSvg

```js
export const { SvgProvider, Svg } = setupReactSvg({
    svgs: {...},
    rootFolder: "/images/icons",
    idPrefix: "🦦",
})
```

Accepted arguments;

#### svgs

```js
...
svgs: {
    arrowBack: {
        path: '/SVGs/arrow-back.svg',
        width: 800,
        height: 800,
        x: 0,
        y: 0,
        alt: 'Back arrow',
    },
},
...
```

This is the key/value store for all SVGs you want in your application. The provided key is used to load it using the component. It supports the following options;

- `path` {string} - Path of the SVG, optional when the rootFolder is set
- `width` {number} - Viewbox width of the SVG
- `height` {number} - Viewbox height of the SVG
- `x` {number} - (optional) Horizontal start postion of the SVG Viewbox
- `y` {number} - (optional) Vertical start postion of the SVG Viewbox
- `alt` {string} - (optional) SVG alt text, can be left empty for decorative usage

#### rootFolder

```js
...
rootFolder: "/images/icons",
...
```

When having most SVGs in the same folder this feature can be used skip having to set a path for each SVG. For example when setting this value to; `/images/icons`. It would automatically generate the path for the `arrowBack` like this; `/images/icons/arowBack.svg`.

#### idPrefix

```js
...
idPrefix: "🦦",
...
```

To make references to the loaded SVGs we make use of ids. By default these are prefixed by; `_RI`. So for the the `arrowBack` the id would be; `_RI-arrowBack`. However if this gives problems in your application or you want to add some flair you can modify this to any string; `🦦-arrowBack`.

### SvgProvider

```jsx
<SvgProvider />
```

This is the provider that keeps track of the context for the Svgs that use the `type="link"`. This contains the context provider and a hidden SVG that has the SVG `<defs>`. If you're only using the `inline` and `external` this provider could be skipped.

### Svg

```jsx
<Svg type="link" svg="arrowBack" alt="Forward arrow" />
```

This is the primitive component that can be used to show the SVG. It will either render a; `<img />` for when the type is external or a `<svg>` for when the type is `link` or `inline`. For each type of rendering extra props can be passed to be used as html attributes; `className`, `style`, `data-*`, etc.

Specific arguments;

#### type

Type of rendering the SVG;

- `external` - Renders an image tag and links to the path of the SVG
- `link` (default) - Lazy loads the SVG in the provider and links it up using the id.
- `inline` - Lazy loads the SVG in the component

#### svg

Key of the SVF to be rendered. This value needs to match up with a key you passed as a singular SVG entry in the `setupReactSvg`.

#### loading

Specifically for when using `external`. This library relies on the [loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes) attrribute for images. The default behaviour that we pass is `lazy`. For above the fold SVGs it's recommended to use `eager`.

## Why?

✨ SVGs are awesome ✨. However using them in React can be a crappy experience without the right tools. Changing every `fill-rule` to `fillRule` is not that fun. And at the same time this adds bundle size and increases the initial document when using SSG or SSG. But sometimes you do need that flexibilty for animations. The goal with this library is to load SVGs in the most performant way and giving the flexibility to switch without having to refactor a lot. To keep the API minimal the functionality is also limited, for full control options like [react-svg](https://www.npmjs.com/package/react-svg) might be a better fit.

## Notes

### React server components / NextJS App router

Because this library uses context and client fetching both the provider and Svg component need to be client components. The easiest way to let NextJS know these are client components is using this strucutre:

```ts
"use client";

import setupReactSvg from "@obelism/react-svg";

const { SvgProvider: Provider, Svg: SvgComponent } = setupReactSvg({ ... });

export const SvgProvider = Provider;
export const Svg = SvgComponent;
```

## Dependencies

- [react](https://www.npmjs.com/package/react) - For React.createElement, useContext and useEffect
- [swr](https://www.npmjs.com/package/swr) - Solution to fetch the SVG content and cache the response across components

## License

[MIT](LICENSE).
