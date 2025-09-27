import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

function resolveImagePath(name: string) {
  const map: Record<string, string> = {
    head: "Head.png",
    tail: "Tail.png",
    flipbg: "flipbg.png",
    logo: "Logo.png",
    logo1: "Logo1.png",
  };
  const file = map[name.toLowerCase()];
  if (!file) return null;
  // serve from public/coinflip inside the app root for Vercel
  return path.resolve(process.cwd(), "public", "coinflip", file);
}

export async function GET(_: Request, { params }: { params: { name: string } }) {
  try {
    const p = resolveImagePath(params.name);
    if (!p) return new NextResponse("Not found", { status: 404 });
    const buf = await readFile(p);
    return new NextResponse(buf, {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}


