import { useCallback, useMemo } from 'react'
import useSWR, { KeyedMutator } from 'swr'

const useSharedState = <TData = unknown>(
	key: string,
	initialData?: TData,
): [TData | undefined, KeyedMutator<TData>] => {
	const { data, mutate } = useSWR<TData>(key, { fallbackData: initialData })
	return [data, mutate]
}

const SHARED_STATE_PREFIX = 'obelism-react-svg'

const INITIAL_LINKED_SVG_LIST: Record<string, boolean> = {}

export const useLinkedSvgList = () =>
	useSharedState(`${SHARED_STATE_PREFIX}-linked`, INITIAL_LINKED_SVG_LIST)

export const useLinkSvg = () => {
	const [linkedSvgList = INITIAL_LINKED_SVG_LIST, setLinkedSvgList] =
		useLinkedSvgList()

	return useCallback(
		(svg: string) => {
			if (!linkedSvgList || linkedSvgList[svg]) return

			return setLinkedSvgList({
				...linkedSvgList,
				[svg]: true,
			})
		},
		[linkedSvgList],
	)
}

const useLinkedSvg = (
	svg: string,
): [boolean | undefined, KeyedMutator<boolean>] => {
	return useSharedState(`${SHARED_STATE_PREFIX}-${svg}`, false)
}

export const useLinkedSvgLoaded = (svg: string) => {
	return useLinkedSvg(svg)?.at(0)
}

export const useSetLinkedSvgLoaded = (svg: string) => {
	const [svgLoaded, setSvgLoaded] = useLinkedSvg(svg)

	return useMemo(() => {
		if (svgLoaded) return () => {}
		return () => {
			return setSvgLoaded(true, {
				optimisticData: true,
				revalidate: false,
				populateCache: true,
			})
		}
	}, [svgLoaded, setSvgLoaded])
}
