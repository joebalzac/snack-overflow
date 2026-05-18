export type Review = {
  reviewerName: string;
  reviewerTitle: string;
  body: string;
  rating: number;
};

export type HeroBlock = {
  __typename: "HeroBlock";
  sys: { id: string };
  heading: string;
  subheading: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
};

export type ReviewsBlock = {
  __typename: "ReviewsBlock";
  sys: { id: string };
  title: string;
  reviewsCollection: {
    items: Review[];
  };
};


export type LandingPageBlock = HeroBlock | ReviewsBlock;

export type LandingPage = {
  sys: { id: string };
  title: string;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  blocksCollection: {
    items: (LandingPageBlock | null)[];
  };
};


const HERO_BLOCK_FIELDS = `
  ... on HeroBlock {
    sys { id }
    heading
    subheading
    ctaText
    ctaUrl
  }
`;

const REVIEWS_BLOCK_FIELDS = `
  ... on ReviewsBlock {
    sys { id }
    title
    reviewsCollection {
      items {
        ... on Review {
          reviewerName
          reviewerTitle
          body
          rating
        }
      }
    }
  }
`;

const LANDING_PAGE_GRAPHQL_FIELDS = `
  sys { id }
  title
  slug
  seoTitle
  seoDescription
  blocksCollection {
    items {
      __typename
      ${HERO_BLOCK_FIELDS}
      ${REVIEWS_BLOCK_FIELDS}
    }
  }
`;


const fetchGraphQL = async (
  query: string,
  preview = false,
): Promise<unknown> => {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
      next: { tags: ["landing-pages"] },
    },
  );
  return response.json();
};

export const getLandingPage = async (
  slug: string,
  isDraftMode = false,
): Promise<LandingPage | null> => {
  const data = (await fetchGraphQL(
    `query {
      landingPageCollection(where: { slug: "${slug}" }, limit: 1, preview: ${isDraftMode}) {
        items {
          ${LANDING_PAGE_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode,
  )) as { data?: { landingPageCollection?: { items?: LandingPage[] } } };

  return data?.data?.landingPageCollection?.items?.[0] ?? null;
};


export const getAllLandingPageSlugs = async (): Promise<{ slug: string }[]> => {
  const data = (await fetchGraphQL(
    `query {
      landingPageCollection(where: { slug_exists: true }) {
        items {
          slug
        }
      }
    }`,
  )) as { data?: { landingPageCollection?: { items?: { slug: string }[] } } };

  return data?.data?.landingPageCollection?.items ?? [];
};
