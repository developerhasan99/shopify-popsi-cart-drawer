import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { prisma } from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  // eslint-disable-next-line no-undef
  const apiKey = process.env.SHOPIFY_API_KEY || "";
  const appEmbedDeepLink = `https://${session.shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/cart-drawer`;

  // Get configuration count
  const configs = await prisma.cartDrawerSettings.findMany({
    where: { shop: session.shop },
  });

  return {
    shop: session.shop,
    appEmbedDeepLink,
    configCount: configs.length,
  };
};

export default function Index() {
  const { shop, appEmbedDeepLink, configCount } = useLoaderData();

  return (
    <s-page heading="Popsi Cart Drawer">
      <s-button slot="primary-action" href="/app/settings">
        Configure Settings
      </s-button>

      {/* Stats Cards */}
      <s-section heading="Overview">
        <s-grid columns={3} gap="base">
          <s-card>
            <s-text>
              <s-heading level={3}>Configurations</s-heading>
              <s-heading level={1}>{configCount}</s-heading>
            </s-text>
          </s-card>
          <s-card>
            <s-text>
              <s-heading level={3}>Status</s-heading>
              <s-heading level={1} tone="success">
                Active
              </s-heading>
            </s-text>
          </s-card>
          <s-card>
            <s-text>
              <s-heading level={3}>Store</s-heading>
              <s-heading level={3}>{shop}</s-heading>
            </s-text>
          </s-card>
        </s-grid>
      </s-section>

      {/* Quick Actions */}
      <s-section heading="Quick Actions">
        <s-grid columns={2} gap="base">
          <s-card sectioned>
            <s-button href="/app/settings" variant="primary" fullWidth>
              Configure Settings
            </s-button>
            <s-paragraph>
              Customize your cart drawer design, rewards, announcements, and
              more.
            </s-paragraph>
          </s-card>
          <s-card sectioned>
            <s-button href={appEmbedDeepLink} target="_blank" fullWidth>
              Open Theme Editor
            </s-button>
            <s-paragraph>
              Enable the cart drawer app embed and add cart icon blocks to your
              theme.
            </s-paragraph>
          </s-card>
        </s-grid>
      </s-section>

      {/* Getting Started */}
      <s-section heading="Getting Started">
        <s-card sectioned>
          <s-stack gap="base">
            <s-banner tone="info" heading="Setup your cart drawer in 3 steps">
              Follow these steps to get your cart drawer up and running on your
              store.
            </s-banner>
            <s-ordered-list>
              <s-list-item>
                <s-link url="/app/settings">Configure app settings</s-link> for
                design, rewards, announcements, and more.
              </s-list-item>
              <s-list-item>
                Open the theme editor and enable the Cart drawer app embed.
              </s-list-item>
              <s-list-item>
                Add the Cart icon app block anywhere the theme supports app
                blocks, such as a header, footer, or app section.
              </s-list-item>
            </s-ordered-list>
          </s-stack>
        </s-card>
      </s-section>

      {/* Features */}
      <s-section heading="Features">
        <s-grid columns={2} gap="base">
          <s-card sectioned>
            <s-heading level={3}>🎨 Customizable Design</s-heading>
            <s-paragraph>
              Full control over colors, fonts, icons, and button styles to match
              your brand.
            </s-paragraph>
          </s-card>
          <s-card sectioned>
            <s-heading level={3}>🎁 Tiered Rewards</s-heading>
            <s-paragraph>
              Motivate customers with progress bars and unlockable rewards based
              on cart value.
            </s-paragraph>
          </s-card>
          <s-card sectioned>
            <s-heading level={3}>📢 Announcements</s-heading>
            <s-paragraph>
              Display urgency messages with countdown timers to encourage faster
              checkout.
            </s-paragraph>
          </s-card>
          <s-card sectioned>
            <s-heading level={3}>🛍️ Product Recommendations</s-heading>
            <s-paragraph>
              Show related products in the drawer to increase average order
              value.
            </s-paragraph>
          </s-card>
        </s-grid>
      </s-section>

      <s-section slot="aside" heading="Extension Blocks">
        <s-stack gap="base">
          <s-card sectioned>
            <s-heading level={3}>Cart Drawer</s-heading>
            <s-paragraph>
              App embed for the sliding cart drawer overlay with smooth
              animations.
            </s-paragraph>
          </s-card>
          <s-card sectioned>
            <s-heading level={3}>Cart Icon</s-heading>
            <s-paragraph>
              App block for inline cart icon placement in headers, footers, or
              sections.
            </s-paragraph>
          </s-card>
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
