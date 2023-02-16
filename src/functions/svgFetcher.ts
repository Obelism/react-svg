export const svgFetcher = async (path: string) => {
	const res = await fetch(path)
	return await res.text()
}
