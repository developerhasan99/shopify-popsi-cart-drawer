import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  // eslint-disable-next-line no-undef
  const apiKey = process.env.SHOPIFY_API_KEY || "";
  const appEmbedDeepLink = `https://${session.shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/cart-drawer`;

  return {
    shop: session.shop,
    appEmbedDeepLink,
  };
};

export default function Index() {
  const { shop, appEmbedDeepLink } = useLoaderData();

  return (
    <s-page heading="Popsi Cart Drawer">
      <s-button slot="primary-action" href={appEmbedDeepLink} target="_blank">
        Activate drawer
      </s-button>

      <s-section heading="Setup">
        <s-stack gap="base">
          <s-banner tone="info" heading="Theme app extension ready">
            The drawer is delivered through a Shopify theme app embed, so it can
            be enabled and configured in the theme editor without editing theme
            code.
          </s-banner>

          <s-ordered-list>
            <s-list-item>
              Open the theme editor and enable the Cart drawer app embed.
            </s-list-item>
            <s-list-item>
              Adjust the drawer design, rewards bar, announcement, coupon field,
              upsells, trust badges, and text from the app embed settings.
            </s-list-item>
            <s-list-item>
              Add the Cart icon app block anywhere the theme supports app
              blocks, such as a header, footer, or app section.
            </s-list-item>
          </s-ordered-list>
        </s-stack>
      </s-section>

      <s-section heading="Storefront behavior">
        <s-unordered-list>
          <s-list-item>
            Uses Shopify Ajax Cart endpoints for add, quantity change, removal,
            discount code updates, and cart totals.
          </s-list-item>
          <s-list-item>
            Uses Shopify Product Recommendations for drawer upsells when a
            product context is available.
          </s-list-item>
          <s-list-item>
            Renders the storefront UI with custom elements:
            <code> popsi-cart-drawer </code> and
            <code> popsi-cart-trigger </code>.
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Theme editor">
        <s-stack gap="base">
          <s-paragraph>
            Store: <s-text>{shop}</s-text>
          </s-paragraph>
          <s-button href={appEmbedDeepLink} target="_blank" variant="primary">
            Open app embeds
          </s-button>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Extension blocks">
        <s-unordered-list>
          <s-list-item>
            <s-text>Cart drawer</s-text> app embed for the overlay drawer.
          </s-list-item>
          <s-list-item>
            <s-text>Cart icon</s-text> app block for inline placement.
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
