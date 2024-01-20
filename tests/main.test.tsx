import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import setupReactSvg, { formatSvgPath } from '../src/main'

describe('setupReactSvg', () => {
	const { Svg, SvgProvider } = setupReactSvg({
		idPrefix: '🧪',
		rootFolder: '/path/to',
		svgMap: {
			icon: {
				height: 16,
				width: 9,
				alt: 'Icon',
			},
		},
		svgRenderers: {
			customElement: ({ svg, folder }) => (
				<div id="customElement">
					<img src={formatSvgPath(svg, folder)} alt="Custom alt tag" />
				</div>
			),
		},
	})

	it('Image with default alt', () => {
		const { getByAltText } = render(
			<SvgProvider>
				<Svg type="external" svg="icon" />
			</SvgProvider>,
		)
		getByAltText('Icon')
		cleanup()
	})

	it('Image with alt overwrite', () => {
		const { getByAltText } = render(
			<SvgProvider>
				<Svg type="external" svg="icon" alt="Something different" />
			</SvgProvider>,
		)
		getByAltText('Something different')
		cleanup()
	})

	it('SVG inline default alt', () => {
		const { getByTitle, container } = render(
			<SvgProvider>
				<Svg type="inline" svg="icon" />
			</SvgProvider>,
		)
		getByTitle('Icon')
		const svgs = container.querySelectorAll('svg')
		expect(svgs.length).toBe(1)
		cleanup()
	})

	it('SVG inline alt overwrite', () => {
		const { getByTitle, container } = render(
			<SvgProvider>
				<Svg type="inline" svg="icon" alt="Something different" />
			</SvgProvider>,
		)
		getByTitle('Something different')
		const svgs = container.querySelectorAll('svg')
		expect(svgs.length).toBe(1)
		cleanup()
	})

	it('SVG link default alt', () => {
		const { getByTitle, container } = render(
			<SvgProvider>
				<Svg type="link" svg="icon" />
			</SvgProvider>,
		)

		getByTitle('Icon')
		const use = container.querySelector('use')
		expect(!!use).toBe(true)
		cleanup()
	})

	it('SVG link alt overwrite', () => {
		const { getByTitle, container } = render(
			<SvgProvider>
				<Svg type="link" svg="icon" alt="🪩" />
			</SvgProvider>,
		)

		getByTitle('🪩')
		const use = container.querySelector('use')
		expect(!!use).toBe(true)
		cleanup()
	})

	it('Custom element', () => {
		const { getByAltText, container } = render(
			<SvgProvider>
				<Svg type="customElement" svg="icon" />
			</SvgProvider>,
		)

		getByAltText('Custom alt tag')
		const use = container.querySelector('#customElement')
		expect(!!use).toBe(true)
		cleanup()
	})
})
