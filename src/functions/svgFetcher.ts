const ATTRIUBTES_TO_STRIP = ['xmlns', 'viewBox', 'xml:space']

const removeSvgTag = (str: string): string => {
	const parser = new DOMParser()
	const svg = parser.parseFromString(str, 'image/svg+xml').querySelector('svg')
	const innerContent = svg?.innerHTML

	if (!innerContent) return ''

	const attributes = Array.from(svg.attributes)
		.filter((attr) => !ATTRIUBTES_TO_STRIP.includes(attr.name))
		.map((attr) => `${attr.name}="${attr.value}"`)
		.join(' ')

	return `<g ${attributes}>${innerContent}</g>`
}

export const svgFetcher = async (path: string) => {
	const res = await fetch(path)
	const svgText = await res.text()
	return removeSvgTag(svgText)
}
