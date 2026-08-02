import type {
	SvgConfig,
	SvgMap,
	SvgOptions,
	SvgRenderMap,
} from "../config/types"
import { DEFAULT_NAMESPACE } from "./getSvgId"

/**
 * @function createSvgConfig
 * @description Normalize the user facing options into the config every
 * component consumes. Call this once (module scope, or memoized) — the
 * components use its identity to skip re-renders.
 */
export const createSvgConfig = <
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
>({
	svgMap,
	rootFolder,
	namespace,
	svgRenderers,
}: SvgOptions<SvgMapT, SvgRenderMapT>): SvgConfig<SvgMapT> => ({
	svgMap,
	rootFolder,
	namespace: namespace || DEFAULT_NAMESPACE,
	svgRenderers,
})
