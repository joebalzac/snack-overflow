import { LandingPageBlock } from "@/lib/landing-page-api";
import HeroBlock from "@/components/blocks/HeroBlock";
import ReviewsCarousel from "@/components/blocks/ReviewsCarousel";

type Props = {
  block: LandingPageBlock;
};

// Central dispatch: maps a block's __typename to its component.
// Adding a new block type = add a Contentful content type + one case here.
// The default branch silently skips unknown/unpublished blocks so a CMS
// misconfiguration never crashes the page.
const BlockRenderer = ({ block }: Props) => {
  switch (block.__typename) {
    case "HeroBlock":
      return <HeroBlock block={block} />;
    case "ReviewsBlock":
      return (
        <ReviewsCarousel
          title={block.title}
          reviews={block.reviewsCollection.items}
        />
      );
    default:
      return null;
  }
};

export default BlockRenderer;
