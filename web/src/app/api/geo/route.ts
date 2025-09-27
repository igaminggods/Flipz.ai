import { headers } from 'next/headers';

export const runtime = 'edge';

type GeoResponse = {
	country?: string;
	countryCode?: string;
	city?: string;
	ip?: string;
};

export async function GET() {
	try {
		const h = await headers();
		const geo: GeoResponse = {
			country: h.get('x-vercel-ip-country-region') || undefined,
			countryCode: h.get('x-vercel-ip-country') || undefined,
			city: h.get('x-vercel-ip-city') || undefined,
			ip: h.get('x-forwarded-for') || undefined,
		};

		// If Vercel headers are not available (local dev), fall back to ipapi
		if (!geo.countryCode) {
			try {
				const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
				if (res.ok) {
					const data = await res.json();
					geo.country = data.country_name;
					geo.countryCode = data.country;
					geo.city = data.city;
					geo.ip = data.ip;
				}
			} catch {
				// ignore fallback errors
			}
		}

		return new Response(JSON.stringify(geo), {
			headers: { 'content-type': 'application/json' },
			status: 200,
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'geo_unavailable' }), {
			headers: { 'content-type': 'application/json' },
			status: 200,
		});
	}
}



