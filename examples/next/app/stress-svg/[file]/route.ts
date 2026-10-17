import { MAX_SVGS } from "../../stress/stress-config"

/**
 * One generated icon per index, each different, so the stress pages can link
 * thousands of distinct svgs without thousands of files in public/. A few
 * shapes rather than one, to cost roughly what a real icon does to parse.
 */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ file: string }> },
): Promise<Response> {
	const { file } = await params
	const match = /^s(\d+)\.svg$/.exec(file)
	const index = match ? Number(match[1]) : Number.NaN

	if (!(index >= 0 && index < MAX_SVGS)) {
		return new Response("Not found", { status: 404 })
	}

	const hue = Math.round((index * 137.508) % 360)
	const radius = 4 + (index % 7)
	const rotation = (index * 23) % 360

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5" fill="hsl(${hue} 70% 92%)"/><circle cx="12" cy="12" r="${radius}" fill="hsl(${hue} 70% 45%)"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="hsl(${hue} 70% 30%)" stroke-width="2" stroke-linecap="round" transform="rotate(${rotation} 12 12)"/></svg>`

	return new Response(svg, {
		headers: {
			"content-type": "image/svg+xml",
			"cache-control": "public, max-age=31536000, immutable",
		},
	})
}
