# React Icon

> A performant way to load and show SVG in a React applications.

The concept is to provide a minimal interface to render icons without needing to convert SVGs to React components. This library support three ways to show icons;

- **Image**, it uses an image element to lazy load the svg while provider the correct aspect ratio at all times. The most performant way of loading but doesn't give any context to the loaded SVG.
- **Reference**, Using a global definition. This lazy loads the SVG in the provider and makes it possible to reference it in multiple places. This has the advantage of having the icon in the DOM once and displaying it multiple times. This still works with contextual properties like; `fill: currentColor` in multiple places. A good middle ground between performance and control.
- **Inline**, When specific parts of the SVG need to be controlled, nothing beats inlining the SVG. However with that comes the drawback that when

## Quick start

```js
import setupReactIcon from '@obelism/react-svg'

export const { IconProvider, Icon } = setupReactIcon({
	icons: {
		arrowBack: {
			path: '/icons/arrow-back.svg',
			x: 0,
			y: 0,
			width: 800,
			height: 800,
			alt: 'Back arrow',
		},
	},
})
```

In the initialization there needs to be an object of all icons that you support. This is a key/value object with path, viewbox info and alt tag. This gives you back two components. The `IconProvider` needs to wrap all places where the `Icon` component is going to be used. Then when using the icon component you provide the icon to be shown, and the way it needs to be loaded; `link`, `external` or `inline`.

```jsx
<IconProvider>
	<header>
		<a href='/previous'>
			<Icon type="link" icon='arrowBack' />
			Back to overview
		</a>
	</header>

	<main>...</main>

	<footer>
		<a href='/previous'>
			<Icon type="link" icon='arrowBack' />
			Previous article
		</a>

		<a href='/next'>
			<span className="flipped">
				<Icon type="link" icon='arrowBack' alt="Forward arrow" />
			</span>
			Next article
		</a>
	</footer>
<IconProvider>
```

## Interface

This library consist of three parts; the generator which gives you a provider and a consumer.

### setupReactIcon

```js
export const { IconProvider, Icon } = setupReactIcon({
	icons: {...},
	idPrefix: "🦦",
})
```

Accepted arguments;

#### icons

```js
...
icons: {
	arrowBack: {
		path: '/icons/arrow-back.svg',
		x: 0,
		y: 0,
		width: 800,
		height: 800,
		alt: 'Back arrow',
	},
},
...
```

This is the key/value store for all icons you want in your application. The provided key is used to load it using the component. It supports the following options;

- `path` {string} - Path of the SVG
- `x` {number} - Horizontal start postion of the SVG Viewbox
- `y` {number} - Vertical start postion of the SVG Viewbox
- `width` {number} - Viewbox width of the SVG
- `height` {number} - Viewbox height of the SVG
- `alt` {string} - (optional) SVG alt text, can be left empty for decorative usage

#### idPrefix

```js
...
idPrefix: "🦦",
...
```

To make references to the loaded SVG's we make use of ids. By default these are prefixed by; `_RI`. So for the the `arrowBack` the id would be; `_RI-arrowBack`. However if this gives problems in your application or you want to add some flair you can modify this to any string; `🦦-arrowBack`.

### IconProvider

```jsx
<IconProvider />
```

This is the provider that keeps track of the context for the Icons that use the `type="link"`. This contains the context provider and a hidden SVG that has the SVG `<defs>`. If you're only using the `inline` and `external` this provider could be skipped.

### Icon

```jsx
<Icon type="link" icon="arrowBack" alt="Forward arrow" />
```

This is the primitive component that can be used to show the icon. It will either render a; `<img />` for when the type is external or a `<svg>` for when the type is `link` or `inline`. For each type of rendering extra props can be passed to be used as html attributes; `className`, `style`, `data-*`, etc.

Specific arguments;

#### type

Type of rendering the icon;

- `external` - Renders an image tag and links to the path of the SVG
- `link` (default) - Lazy loads the SVG in the provider and links it up using the id.
- `inline` - Lazy loads the SVG in the component

#### icon

Key of the icon to be rendered. This value needs to match up with a key you passed as an `icon` in the `setupReactIcon`.

#### loading

Specifically for when using `external`. This library relies on the (loading)[https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes] attrribute for images. The default behaviour that we pass is `lazy`. For above the fold icons it's recommended to use `eager`.

## Why?

✨ SVGs are awesome ✨. However using them in React can be a crappy experience without the right tools. Changing every `fill-rule` to `fillRule` is not that fun. And at the same time this adds bundle size and increases the initial document when using SSG or SSG. But sometimes you do need that flexibilty for animations. The goal with this library is to load SVGs in the most performant way and giving the flexibility to switch without having to refactor a lot. To keep the API minimal the functionality is also limited, for full control options like [react-svg](https://www.npmjs.com/package/react-svg) might be a better fit.

## Dependencies

- [react](https://www.npmjs.com/package/react) - For React.createElement, useContext and useEffect
- [swr](https://www.npmjs.com/package/swr) - Solution to fetch the SVG content and cache the response across components

## License

[MIT](LICENSE).
