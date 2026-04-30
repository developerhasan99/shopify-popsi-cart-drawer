import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useState } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Settings() {
  const { shop } = useLoaderData();
  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: "placement",
      content: "Placement",
    },
    {
      id: "design",
      content: "Design",
    },
    {
      id: "announcements",
      content: "Announcements",
    },
    {
      id: "rewards",
      content: "Tiered rewards",
    },
  ];

  return (
    <s-page heading="Cart Drawer Settings">
      <s-grid gridTemplateColumns="250px 1fr" gap="large-100">
        <s-section heading="Store Information">
          <s-paragraph>
            Store: <s-text>{shop}</s-text>
          </s-paragraph>
        </s-section>

        <s-section heading="Configure your cart drawer">
          <s-stack gap="base">
            <s-card sectioned>
              <s-tabs
                tabs={tabs.map((tab) => ({ content: tab.content }))}
                selected={selected}
                onSelect={setSelected}
              >
                <s-card sectioned>
                  <s-paragraph>
                    {tabs[selected].content} settings will go here
                  </s-paragraph>
                </s-card>
              </s-tabs>
            </s-card>
          </s-stack>
        </s-section>
      </s-grid>
    </s-page>
  );
}
