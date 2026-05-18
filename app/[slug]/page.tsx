import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getAllLandingPageSlugs,
  getLandingPage,
  LandingPageBlock,
} from "@/lib/landing-page-api";
import BlockRenderer from "@/components/BlockRenderer";

type Props = {
  params: { slug: string };
};

export const generateStaticParams = async () => {
  const slugs = await getAllLandingPageSlugs();
  return slugs.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const page = await getLandingPage(params.slug);
  if (!page) return {};
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? undefined,
  };
};

const LandingPage = async ({ params }: Props) => {
  const { isEnabled } = draftMode();
  const page = await getLandingPage(params.slug, isEnabled);

  if (!page) notFound();

  const blocks = page.blocksCollection.items.filter(
    (block): block is LandingPageBlock => block !== null
  );

  return (
    <main>
      {blocks.map((block) => (
        <BlockRenderer key={block.sys.id} block={block} />
      ))}
    </main>
  );
};

export default LandingPage;
