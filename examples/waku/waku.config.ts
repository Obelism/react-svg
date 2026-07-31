import react from "@vitejs/plugin-react"
import { defineConfig } from "waku/config"

// Everything in `resolve` here is only needed because this example links the
// library straight from the repo root (`file:../..`) instead of installing it
// from npm. A normal install needs none of it.
const linkedLibrary = {
	// The package ships its components as "use client" chunks. A linked
	// dependency is externalised by default, which skips the directive and runs
	// them as server components.
	noExternal: ["@obelism/react-svg"],
	// The repo root has its own react (a dev dependency), and resolving through
	// the symlink finds that copy instead of this app's.
	dedupe: ["react", "react-dom", "swr"],
}

export default defineConfig({
	vite: {
		plugins: [react()],
		resolve: linkedLibrary,
		environments: {
			rsc: { resolve: linkedLibrary },
			ssr: { resolve: linkedLibrary },
		},
	},
})
