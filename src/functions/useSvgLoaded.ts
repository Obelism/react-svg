import { useMemo } from 'react'
import useSWR, { KeyedMutator } from 'swr'

const useLinkedSvg = (
	svg: string,
): [boolean | undefined, KeyedMutator<boolean>] => {
	const { data, mutate } = useSWR<boolean>(svg)
	return [data || false, mutate]
}

export const useLinkedSvgLoaded = (svg: string) => {
	const [svgLoaded] = useLinkedSvg(svg)
	return svgLoaded
}

export const useSetLinkedSvgLoaded = (svg: string) => {
	const [svgLoaded, setSvgLoaded] = useLinkedSvg(svg)

	return useMemo(() => {
		if (svgLoaded) return () => {}
		return () => setSvgLoaded(true)
	}, [svgLoaded, setSvgLoaded])
}
