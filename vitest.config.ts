import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		exclude: ["**/node_modules/**", "**/dist/**", "**/.claude/**"],
		typecheck: {
			enabled: true,
			include: ["tests/**/*.test-d.tsx"],
			tsconfig: "tests/tsconfig.json",
		},
	},
})
