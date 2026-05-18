import { draftMode } from "next/headers";

export const GET = () => {
  draftMode().disable();
  return new Response("Draft mode is disabled");
};
