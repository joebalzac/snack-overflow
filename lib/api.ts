import { Document } from "@contentful/rich-text-types";

export type Article = {
  sys: { id: string };
  title: string;
  slug: string;
  summary: string;
  details: {
    json: Document;
    links: {
      assets: {
        block: Array<{
          sys: { id: string };
          url: string;
          description: string;
        }>;
      };
    };
  };
  date: string;
  authorName: string;
  categoryName: string;
  articleImage: {
    url: string;
  };
};

const ARTICLE_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  summary
  details {
    json
    links {
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  date
  authorName
  categoryName
  articleImage {
    url
  }
`;

const fetchGraphQL = async (query: string, preview = false): Promise<unknown> =>
  fetch(
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
      next: { tags: ["articles"] },
    }
  ).then((response) => response.json());

const extractArticleEntries = (fetchResponse: unknown): Article[] => {
  const res = fetchResponse as {
    data?: { knowledgeArticleCollection?: { items?: Article[] } };
  };
  return res?.data?.knowledgeArticleCollection?.items ?? [];
};

export const getAllArticles = async (
  limit = 3,
  isDraftMode = false
): Promise<Article[]> => {
  const articles = await fetchGraphQL(
    `query {
      knowledgeArticleCollection(where:{slug_exists: true}, order: date_DESC, limit: ${limit}, preview: ${isDraftMode}) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  return extractArticleEntries(articles);
};

export const getArticle = async (
  slug: string,
  isDraftMode = false
): Promise<Article | undefined> => {
  const article = await fetchGraphQL(
    `query {
      knowledgeArticleCollection(where:{slug: "${slug}"}, limit: 1, preview: ${isDraftMode}) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  return extractArticleEntries(article)[0];
};
