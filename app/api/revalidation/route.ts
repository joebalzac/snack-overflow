import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const POST = (request: NextRequest) => {
  const secret = request.headers.get("x-vercel-reval-key");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("articles");
  revalidateTag("landing-pages");

  return NextResponse.json({ revalidated: true, now: Date.now() });
};
