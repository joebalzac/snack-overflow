import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = () => {
  return NextResponse.json({
    CONTENTFUL_SPACE_ID: !!process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: !!process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  });
};
