import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import setupReactSvg from '../src/main'

describe('setupReactSvg', () => {
	const { Svg, SvgProvider } = setupReactSvg({
		idPrefix: '🧪',
		svgs: {
			icon: {
				path: '/path/to/icon.svg',
				x: 0,
				y: 0,
				height: 16,
				width: 9,
				alt: 'Icon',
			},
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

	it('Image with invalid svg', () => {
		render(
			<SvgProvider>
				<Svg type="external" svg="non-referenced-icon" />
			</SvgProvider>,
		)
		cleanup()
	})

	it('SVG inline default alt', () => {
		const { getByTitle, container } = render(
			<SvgProvider>
				<Svg type="inline" svg="icon" />
			</SvgProvider>,
		)
		getByTitle('Icon')
		const defs = container.querySelector('defs')
		expect(defs?.children.length).toBe(0)
		cleanup()
	})

	it('SVG inline alt overwrite', () => {
		const { getByTitle, container } = render(
			<SvgProvider>
				<Svg type="inline" svg="icon" alt="Something different" />
			</SvgProvider>,
		)
		getByTitle('Something different')
		const defs = container.querySelector('defs')
		expect(defs?.children.length).toBe(0)
		cleanup()
	})

	it('SVG inline with invalid svg', () => {
		render(
			<SvgProvider>
				<Svg type="inline" svg="non-referenced-icon" />
			</SvgProvider>,
		)
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

	it('SVG link with invalid svg', () => {
		render(
			<SvgProvider>
				<Svg type="link" svg="non-referenced-icon" />
			</SvgProvider>,
		)
		cleanup()
	})
})
