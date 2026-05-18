import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !token) {
    return NextResponse.json({
      error: "missing env vars",
      CONTENTFUL_SPACE_ID: !!spaceId,
      CONTENTFUL_ACCESS_TOKEN: !!token,
    });
  }

  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `{ landingPageCollection { items { slug } } }`,
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
};
