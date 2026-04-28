import { data } from "react-router";
import {
  useLoaderData,
  useActionData,
  useNavigation,
  Form,
} from "react-router";
import { authenticate } from "../shopify.server";
import { prisma } from "../db.server";
import { useState } from "react";

// Default settings matching WordPress plugin
const DEFAULT_SETTINGS = {
  // Placement
  enable_cart_drawer: true,
  auto_open_cart: true,
  menu_placement: "none",

  // Design
  inherit_fonts: true,
  bg_color: "#ffffff",
  accent_color: "#f6f6f7",
  text_color: "#000000",
  savings_text_color: "#2ea818",
  cart_icon_type: "bag-1",
  cart_icon_color: "#000000",
  cart_icon_size: 24,
  show_cart_count: true,
  cart_bubble_bg: "#000000",
  cart_bubble_text: "#ffffff",
  btn_radius: "5px",
  btn_color: "#000000",
  btn_text_color: "#ffffff",
  btn_hover_color: "#333333",
  btn_hover_text_color: "#ffffff",

  // Announcements
  show_announcement: false,
  announcement_text: "Your products are reserved for {timer}!",
  announcement_bg: "#fffbeb",
  announcement_text_color: "#92400e",
  announcement_font_size: "13px",
  announcement_bar_size: "medium",
  timer_duration: 15,

  // Rewards
  enable_rewards_bar: true,
  show_rewards_on_empty: true,
  reward_type: "subtotal",
  reward_away_text: "You're only {amount} away from {goal}",
  reward_completed_text: "Congratulations! You have unlocked all rewards.",
  reward_goal_one_threshold: 50,
  reward_goal_one_label: "Free Shipping",
  reward_goal_one_icon: "truck",
  reward_goal_two_threshold: 100,
  reward_goal_two_label: "10% Discount",
  reward_goal_two_icon: "tag",
  rewards_bar_bg: "#e2e2e2",
  rewards_bar_fg: "#93d3ff",
  rewards_complete_icon_color: "#4d4949",
  rewards_incomplete_icon_color: "#4d4949",
  rewards_bars_layout: "column",
  progress_bars: [
    {
      type: "subtotal",
      away_text: "You're only {amount} away from {goal}",
      completed_text: "Congratulations! You have unlocked all rewards.",
      show_labels: true,
      checkpoints: [
        { threshold: 50, label: "Free Shipping", icon: "truck" },
        { threshold: 100, label: "10% Discount", icon: "tag" },
      ],
    },
  ],

  // Cart Items
  show_item_images: true,
  show_strikethrough: true,
  show_savings: true,
  trans_savings_prefix: "Save",

  // Upsells
  show_upsells: true,
  show_upsells_on_empty: true,
  upsell_title: "You might also like...",
  upsell_source: "related",
  upsell_category: "",
  upsell_max: 3,
  upsell_intent: "related",
  upsell_btn_text: "Add to Cart",

  // Discount
  enable_coupon: true,
  trans_coupon_accordion_title: "Have a Coupon?",
  trans_coupon_placeholder: "Coupon code",
  trans_coupon_apply_btn: "Apply",

  // Summary
  enable_subtotal_line: true,
  trans_subtotal: "Subtotal",
  trans_discounts: "Discounts",
  enable_total_line: true,
  trans_total: "Total",
  show_shipping_notice: true,
  shipping_notice_text: "Shipping and taxes will be calculated at checkout.",
  trans_checkout_btn: "Checkout",
  show_subtotal_on_checkout: true,

  // Badges
  show_trust_badges: true,
  trust_badge_image: "",

  // Settings
  cart_title: "Your Cart",
  trans_continue_shopping: "Continue Shopping",
  trans_empty_cart: "Your cart is currently empty.",
  custom_css: "",
};

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  let settings = DEFAULT_SETTINGS;

  const existingSettings = await prisma.cartDrawerSettings.findUnique({
    where: { shop: session.shop },
  });

  if (existingSettings) {
    try {
      settings = {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(existingSettings.settings),
      };
    } catch (e) {
      console.error("Failed to parse settings:", e);
    }
  }

  return data({ settings, shop: session.shop });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const settingsJson = formData.get("settings");

  if (!settingsJson) {
    return data({ error: "Settings are required" }, { status: 400 });
  }

  try {
    await prisma.cartDrawerSettings.upsert({
      where: { shop: session.shop },
      update: { settings: settingsJson },
      create: { shop: session.shop, settings: settingsJson },
    });

    return data({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return data({ error: "Failed to save settings" }, { status: 500 });
  }
};

export default function Settings() {
  const { settings: initialSettings, shop } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";
  const [activeTab, setActiveTab] = useState("placement");
  const [settings, setSettings] = useState(initialSettings);
  const [isDirty, setIsDirty] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const tabs = [
    {
      section: "General",
      items: [
        { id: "placement", label: "Placement", icon: "Layout" },
        { id: "design", label: "Design", icon: "Paint" },
      ],
    },
    {
      section: "Body",
      items: [
        { id: "announcements", label: "Announcements", icon: "Megaphone" },
        { id: "rewards", label: "Tiered rewards", icon: "Award" },
        { id: "cart_items", label: "Cart items", icon: "Cart" },
        { id: "upsells", label: "Recommendations", icon: "Product" },
      ],
    },
    {
      section: "Footer",
      items: [
        { id: "discount", label: "Coupon form", icon: "Ticket" },
        { id: "summary", label: "Cart summary", icon: "Clipboard" },
        { id: "badges", label: "Trust badges", icon: "Shield" },
      ],
    },
    {
      section: "",
      items: [{ id: "settings", label: "Settings", icon: "Settings" }],
    },
  ];

  return (
    <s-page heading="Cart Drawer Settings">
      <s-button
        slot="primary-action"
        type="submit"
        form="settings-form"
        disabled={isSaving || !isDirty}
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </s-button>

      <s-section heading="Configure your cart drawer">
        <s-stack gap="base">
          <s-banner tone="info" heading="App-level settings">
            These settings apply to your entire store and will be used by the
            cart drawer across all themes.
          </s-banner>

          <s-paragraph>
            Store: <s-text>{shop}</s-text>
          </s-paragraph>

          {actionData?.success && (
            <s-banner tone="success" heading="Settings saved successfully" />
          )}

          {actionData?.error && (
            <s-banner tone="critical" heading={actionData.error} />
          )}

          <Form method="post" id="settings-form">
            <input
              type="hidden"
              name="settings"
              value={JSON.stringify(settings)}
            />
          </Form>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "250px 1fr",
              gap: "20px",
            }}
          >
            {/* Sidebar */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {tabs.map((group) => (
                <div key={group.section}>
                  {group.section && (
                    <h3
                      style={{
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "8px",
                        marginTop: group.section === "General" ? "0" : "16px",
                      }}
                    >
                      {group.section}
                    </h3>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {group.items.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          border: "none",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          backgroundColor:
                            activeTab === tab.id ? "#ffffff" : "transparent",
                          color: activeTab === tab.id ? "#000000" : "#666666",
                          transition: "all 0.2s",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                minHeight: "600px",
                padding: "24px",
              }}
            >
              {activeTab === "placement" && (
                <PlacementTab
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}
              {activeTab === "design" && (
                <DesignTab settings={settings} updateSetting={updateSetting} />
              )}
              {activeTab === "announcements" && (
                <AnnouncementsTab
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}
              {activeTab === "rewards" && (
                <RewardsTab settings={settings} updateSetting={updateSetting} />
              )}
              {activeTab === "cart_items" && (
                <CartItemsTab
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}
              {activeTab === "upsells" && (
                <UpsellsTab settings={settings} updateSetting={updateSetting} />
              )}
              {activeTab === "discount" && (
                <DiscountTab
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}
              {activeTab === "summary" && (
                <SummaryTab settings={settings} updateSetting={updateSetting} />
              )}
              {activeTab === "badges" && (
                <BadgesTab settings={settings} updateSetting={updateSetting} />
              )}
              {activeTab === "settings" && (
                <SettingsTab
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}
            </div>
          </div>
        </s-stack>
      </s-section>
    </s-page>
  );
}

// Tab Components
function PlacementTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Placement
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Manage how and where the cart drawer appears on your site.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.enable_cart_drawer}
            onChange={(e) =>
              updateSetting("enable_cart_drawer", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable Cart Drawer Site-wide
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.auto_open_cart}
            onChange={(e) => updateSetting("auto_open_cart", e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Auto open on Add to cart
          </span>
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            Show Cart icon on menu
          </label>
          <select
            value={settings.menu_placement}
            onChange={(e) => updateSetting("menu_placement", e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e5e5e5",
              fontSize: "14px",
            }}
          >
            <option value="none">None</option>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function DesignTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
        Design
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            General
          </h3>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={settings.inherit_fonts}
              onChange={(e) => updateSetting("inherit_fonts", e.target.checked)}
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Inherit fonts from theme
            </span>
          </label>
        </div>

        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            Colors
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <ColorPicker
              label="Background color"
              value={settings.bg_color}
              onChange={(v) => updateSetting("bg_color", v)}
            />
            <ColorPicker
              label="Cart accent color"
              value={settings.accent_color}
              onChange={(v) => updateSetting("accent_color", v)}
            />
            <ColorPicker
              label="Cart text color"
              value={settings.text_color}
              onChange={(v) => updateSetting("text_color", v)}
            />
            <ColorPicker
              label="Savings text color"
              value={settings.savings_text_color}
              onChange={(v) => updateSetting("savings_text_color", v)}
            />
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            Cart icon
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Icon style
                </label>
                <select
                  value={settings.cart_icon_type}
                  onChange={(e) =>
                    updateSetting("cart_icon_type", e.target.value)
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    fontSize: "14px",
                    width: "100%",
                  }}
                >
                  <option value="bag-1">Bag 1</option>
                  <option value="bag-2">Bag 2</option>
                  <option value="cart">Cart</option>
                  <option value="basket">Basket</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Icon size (px)
                </label>
                <input
                  type="number"
                  value={settings.cart_icon_size}
                  onChange={(e) =>
                    updateSetting("cart_icon_size", parseInt(e.target.value))
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    fontSize: "14px",
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <ColorPicker
                label="Icon color"
                value={settings.cart_icon_color}
                onChange={(v) => updateSetting("cart_icon_color", v)}
              />
              <ColorPicker
                label="Bubble background"
                value={settings.cart_bubble_bg}
                onChange={(v) => updateSetting("cart_bubble_bg", v)}
              />
            </div>
            <ColorPicker
              label="Bubble text color"
              value={settings.cart_bubble_text}
              onChange={(v) => updateSetting("cart_bubble_text", v)}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.show_cart_count}
                onChange={(e) =>
                  updateSetting("show_cart_count", e.target.checked)
                }
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                Show cart count bubble
              </span>
            </label>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            Button settings
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Corner radius
              </label>
              <input
                type="text"
                value={settings.btn_radius}
                onChange={(e) => updateSetting("btn_radius", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <ColorPicker
                label="Button color"
                value={settings.btn_color}
                onChange={(v) => updateSetting("btn_color", v)}
              />
              <ColorPicker
                label="Button text color"
                value={settings.btn_text_color}
                onChange={(v) => updateSetting("btn_text_color", v)}
              />
              <ColorPicker
                label="Button hover color"
                value={settings.btn_hover_color}
                onChange={(v) => updateSetting("btn_hover_color", v)}
              />
              <ColorPicker
                label="Button hover text color"
                value={settings.btn_hover_text_color}
                onChange={(v) => updateSetting("btn_hover_text_color", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Announcements
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Set up global announcements for your cart.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_announcement}
            onChange={(e) =>
              updateSetting("show_announcement", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable Announcement Bar
          </span>
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Timer Duration (Minutes)
            </label>
            <input
              type="number"
              value={settings.timer_duration}
              onChange={(e) =>
                updateSetting("timer_duration", parseInt(e.target.value))
              }
              min="1"
              max="60"
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Bar Size
            </label>
            <select
              value={settings.announcement_bar_size}
              onChange={(e) =>
                updateSetting("announcement_bar_size", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Announcement Message
          </label>
          <textarea
            value={settings.announcement_text}
            onChange={(e) => updateSetting("announcement_text", e.target.value)}
            rows="2"
            placeholder="Your products are reserved for {timer}!"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e5e5e5",
              fontSize: "14px",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
          <p style={{ fontSize: "12px", color: "#999999", marginTop: "4px" }}>
            Use <strong>{"{timer}"}</strong> as a placeholder to display a
            real-time countdown timer.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <ColorPicker
            label="Background Color"
            value={settings.announcement_bg}
            onChange={(v) => updateSetting("announcement_bg", v)}
          />
          <ColorPicker
            label="Text Color"
            value={settings.announcement_text_color}
            onChange={(v) => updateSetting("announcement_text_color", v)}
          />
        </div>
      </div>
    </div>
  );
}

function RewardsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Progress Rewards
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Configure tiered rewards that customers unlock as they add items to
        their cart.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.enable_rewards_bar}
            onChange={(e) =>
              updateSetting("enable_rewards_bar", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable Tiered Rewards Bar
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_rewards_on_empty}
            onChange={(e) =>
              updateSetting("show_rewards_on_empty", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show rewards when cart is empty
          </span>
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Reward progress type
            </label>
            <select
              value={settings.reward_type}
              onChange={(e) => updateSetting("reward_type", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            >
              <option value="subtotal">Cart subtotal</option>
              <option value="quantity">Item quantity</option>
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Bars Stacking Layout
            </label>
            <select
              value={settings.rewards_bars_layout}
              onChange={(e) =>
                updateSetting("rewards_bars_layout", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            >
              <option value="column">Stacked (Rows)</option>
              <option value="row">Side-by-side (Columns)</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Away text
            </label>
            <input
              type="text"
              value={settings.reward_away_text}
              onChange={(e) =>
                updateSetting("reward_away_text", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Completed text
            </label>
            <input
              type="text"
              value={settings.reward_completed_text}
              onChange={(e) =>
                updateSetting("reward_completed_text", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              First goal threshold
            </label>
            <input
              type="number"
              value={settings.reward_goal_one_threshold}
              onChange={(e) =>
                updateSetting(
                  "reward_goal_one_threshold",
                  parseInt(e.target.value),
                )
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              First goal label
            </label>
            <input
              type="text"
              value={settings.reward_goal_one_label}
              onChange={(e) =>
                updateSetting("reward_goal_one_label", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Second goal threshold
            </label>
            <input
              type="number"
              value={settings.reward_goal_two_threshold}
              onChange={(e) =>
                updateSetting(
                  "reward_goal_two_threshold",
                  parseInt(e.target.value),
                )
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Second goal label
            </label>
            <input
              type="text"
              value={settings.reward_goal_two_label}
              onChange={(e) =>
                updateSetting("reward_goal_two_label", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <ColorPicker
            label="Progress background"
            value={settings.rewards_bar_bg}
            onChange={(v) => updateSetting("rewards_bar_bg", v)}
          />
          <ColorPicker
            label="Progress fill"
            value={settings.rewards_bar_fg}
            onChange={(v) => updateSetting("rewards_bar_fg", v)}
          />
        </div>
      </div>
    </div>
  );
}

function CartItemsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Cart items
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Customize how cart items are displayed inside the drawer.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_item_images}
            onChange={(e) =>
              updateSetting("show_item_images", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show product images
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_strikethrough}
            onChange={(e) =>
              updateSetting("show_strikethrough", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show strikethrough prices
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_savings}
            onChange={(e) => updateSetting("show_savings", e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show savings text
          </span>
        </label>

        {settings.show_savings && (
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Savings text prefix
            </label>
            <input
              type="text"
              value={settings.trans_savings_prefix}
              onChange={(e) =>
                updateSetting("trans_savings_prefix", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function UpsellsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Product Recommendations
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Increase your average order value by suggesting complementary products.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_upsells}
            onChange={(e) => updateSetting("show_upsells", e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable Product Recommendations
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_upsells_on_empty}
            onChange={(e) =>
              updateSetting("show_upsells_on_empty", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show recommendations even when cart is empty
          </span>
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Section Title
            </label>
            <input
              type="text"
              value={settings.upsell_title}
              onChange={(e) => updateSetting("upsell_title", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Maximum Products to Show
            </label>
            <input
              type="number"
              value={settings.upsell_max}
              onChange={(e) =>
                updateSetting("upsell_max", parseInt(e.target.value))
              }
              min="1"
              max="10"
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Recommendation intent
            </label>
            <select
              value={settings.upsell_intent}
              onChange={(e) => updateSetting("upsell_intent", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            >
              <option value="related">Related</option>
              <option value="complementary">Complementary</option>
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Button Text
            </label>
            <input
              type="text"
              value={settings.upsell_btn_text}
              onChange={(e) => updateSetting("upsell_btn_text", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscountTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
        Coupon form
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.enable_coupon}
            onChange={(e) => updateSetting("enable_coupon", e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable coupon form
          </span>
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Accordion title text
            </label>
            <input
              type="text"
              value={settings.trans_coupon_accordion_title}
              onChange={(e) =>
                updateSetting("trans_coupon_accordion_title", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Coupon placeholder text
            </label>
            <input
              type="text"
              value={settings.trans_coupon_placeholder}
              onChange={(e) =>
                updateSetting("trans_coupon_placeholder", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Apply button text
            </label>
            <input
              type="text"
              value={settings.trans_coupon_apply_btn}
              onChange={(e) =>
                updateSetting("trans_coupon_apply_btn", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
        Cart Summary
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={settings.enable_subtotal_line}
              onChange={(e) =>
                updateSetting("enable_subtotal_line", e.target.checked)
              }
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Enable subtotal line
            </span>
          </label>

          {settings.enable_subtotal_line && (
            <>
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Subtotal text
                </label>
                <input
                  type="text"
                  value={settings.trans_subtotal}
                  onChange={(e) =>
                    updateSetting("trans_subtotal", e.target.value)
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    fontSize: "14px",
                    width: "100%",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Discounts text
                </label>
                <input
                  type="text"
                  value={settings.trans_discounts}
                  onChange={(e) =>
                    updateSetting("trans_discounts", e.target.value)
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    fontSize: "14px",
                    width: "100%",
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={settings.enable_total_line}
              onChange={(e) =>
                updateSetting("enable_total_line", e.target.checked)
              }
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Enable total line
            </span>
          </label>

          {settings.enable_total_line && (
            <div>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Total text
              </label>
              <input
                type="text"
                value={settings.trans_total}
                onChange={(e) => updateSetting("trans_total", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={settings.show_shipping_notice}
              onChange={(e) =>
                updateSetting("show_shipping_notice", e.target.checked)
              }
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Enable shipping notice
            </span>
          </label>

          {settings.show_shipping_notice && (
            <div>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Shipping notice text
              </label>
              <input
                type="text"
                value={settings.shipping_notice_text}
                onChange={(e) =>
                  updateSetting("shipping_notice_text", e.target.value)
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Checkout button text
            </label>
            <input
              type="text"
              value={settings.trans_checkout_btn}
              onChange={(e) =>
                updateSetting("trans_checkout_btn", e.target.value)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={settings.show_subtotal_on_checkout}
              onChange={(e) =>
                updateSetting("show_subtotal_on_checkout", e.target.checked)
              }
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Show subtotal on checkout button
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

function BadgesTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Trust badges
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Display payment methods and security trust badges at the bottom of the
        cart.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={settings.show_trust_badges}
            onChange={(e) =>
              updateSetting("show_trust_badges", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable Trust Badges Section
          </span>
        </label>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Badge Image URL
          </label>
          <input
            type="text"
            value={settings.trust_badge_image}
            onChange={(e) => updateSetting("trust_badge_image", e.target.value)}
            placeholder="https://..."
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e5e5e5",
              fontSize: "14px",
              width: "100%",
            }}
          />
          <p style={{ fontSize: "12px", color: "#999999", marginTop: "4px" }}>
            Upload a single image containing all your trusted payment logos
            (PNG, JPG, SVG).
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
        Settings
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            Translations
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Cart Title
              </label>
              <input
                type="text"
                value={settings.cart_title}
                onChange={(e) => updateSetting("cart_title", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Continue Shopping
              </label>
              <input
                type="text"
                value={settings.trans_continue_shopping}
                onChange={(e) =>
                  updateSetting("trans_continue_shopping", e.target.value)
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Empty Cart Message
              </label>
              <input
                type="text"
                value={settings.trans_empty_cart}
                onChange={(e) =>
                  updateSetting("trans_empty_cart", e.target.value)
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            Custom CSS
          </h3>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Custom CSS editor
            </label>
            <textarea
              value={settings.custom_css}
              onChange={(e) => updateSetting("custom_css", e.target.value)}
              rows="12"
              placeholder="/* Add your custom CSS here */\n.popsi-cart-drawer {\n    border-left: 2px solid #000;\n}"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "13px",
                width: "100%",
                fontFamily: "monospace",
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
              }}
            />
            <p style={{ fontSize: "12px", color: "#999999", marginTop: "4px" }}>
              Add custom styles to override existing cart design. Use
              .popsi-cart-drawer as root selector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label
        style={{
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "8px",
          display: "block",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "40px",
            height: "40px",
            padding: "0",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength="7"
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #e5e5e5",
            fontSize: "14px",
          }}
        />
      </div>
    </div>
  );
}
