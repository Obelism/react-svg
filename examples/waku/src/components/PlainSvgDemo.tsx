"use client"

// The same config module the server components import. A client component
// needs no config — and no provider — of its own; it reads the one the layout
// already put in context.
import { Svg } from "../svg-config"

/** The package components used inside a client component. */
export const PlainSvgDemo = () => (
	<>
		<h2>The same config, inside a client component</h2>
		<Svg svg="globe" type="link" data-testid="client-link" width={32} />
		<Svg svg="window" type="inline" data-testid="client-inline" width={32} />
		<Svg svg="globe" type="external" data-testid="client-external" width={32} />
	</>
)
