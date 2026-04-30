// ColorPicker Component
export function ColorPicker({ label, value, onChange }) {
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
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "40px",
            height: "40px",
            border: "1px solid #e5e5e5",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "0",
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

// Tab Components
export function PlacementTab({ settings, updateSetting }) {
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
      </div>
    </div>
  );
}

export function DesignTab({ settings, updateSetting }) {
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
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

export function AnnouncementsTab({ settings, updateSetting }) {
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

export function RewardsTab({ settings, updateSetting }) {
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
            label="Progress bar background"
            value={settings.rewards_bar_bg}
            onChange={(v) => updateSetting("rewards_bar_bg", v)}
          />
          <ColorPicker
            label="Progress bar foreground"
            value={settings.rewards_bar_fg}
            onChange={(v) => updateSetting("rewards_bar_fg", v)}
          />
          <ColorPicker
            label="Complete icon color"
            value={settings.rewards_complete_icon_color}
            onChange={(v) => updateSetting("rewards_complete_icon_color", v)}
          />
          <ColorPicker
            label="Incomplete icon color"
            value={settings.rewards_incomplete_icon_color}
            onChange={(v) => updateSetting("rewards_incomplete_icon_color", v)}
          />
        </div>
      </div>
    </div>
  );
}

export function CartItemsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Cart items
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Configure how cart items are displayed.
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
            checked={settings.show_item_images}
            onChange={(e) =>
              updateSetting("show_item_images", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show item images
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
            Show strikethrough on sale prices
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
            Show savings amount
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
              Savings prefix
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
          <ColorPicker
            label="Savings text color"
            value={settings.savings_text_color}
            onChange={(v) => updateSetting("savings_text_color", v)}
          />
        </div>
      </div>
    </div>
  );
}

export function UpsellsTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Recommendations
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Configure product recommendations in the cart drawer.
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
            Enable product recommendations
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
            Show recommendations when cart is empty
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
              Recommendation title
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
              Maximum products to show
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
              Recommendation source
            </label>
            <select
              value={settings.upsell_source}
              onChange={(e) => updateSetting("upsell_source", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
              }}
            >
              <option value="related">Related products</option>
              <option value="collection">Collection</option>
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
              Add to cart button text
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

export function DiscountTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Coupon form
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Configure the discount code input field.
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
            checked={settings.enable_coupon}
            onChange={(e) => updateSetting("enable_coupon", e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Enable coupon input field
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
              Accordion title
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
              Input placeholder
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
  );
}

export function SummaryTab({ settings, updateSetting }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
        Cart summary
      </h2>
      <p style={{ fontSize: "14px", color: "#666666", marginBottom: "24px" }}>
        Configure the order summary section.
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
            checked={settings.enable_subtotal_line}
            onChange={(e) =>
              updateSetting("enable_subtotal_line", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show subtotal line
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
            Subtotal label
          </label>
          <input
            type="text"
            value={settings.trans_subtotal}
            onChange={(e) => updateSetting("trans_subtotal", e.target.value)}
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
            checked={settings.enable_total_line}
            onChange={(e) =>
              updateSetting("enable_total_line", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show total line
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
            Total label
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

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Discounts label
          </label>
          <input
            type="text"
            value={settings.trans_discounts}
            onChange={(e) => updateSetting("trans_discounts", e.target.value)}
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
            checked={settings.show_shipping_notice}
            onChange={(e) =>
              updateSetting("show_shipping_notice", e.target.checked)
            }
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Show shipping notice
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
            Shipping notice text
          </label>
          <textarea
            value={settings.shipping_notice_text}
            onChange={(e) =>
              updateSetting("shipping_notice_text", e.target.value)
            }
            rows="2"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e5e5e5",
              fontSize: "14px",
              width: "100%",
              fontFamily: "inherit",
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
      </div>
    </div>
  );
}

export function BadgesTab({ settings, updateSetting }) {
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

export function SettingsTab({ settings, updateSetting }) {
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
              Custom CSS
            </label>
            <textarea
              value={settings.custom_css}
              onChange={(e) => updateSetting("custom_css", e.target.value)}
              rows="8"
              placeholder="/* Add your custom CSS here */"
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                fontSize: "14px",
                width: "100%",
                fontFamily: "monospace",
              }}
            />
            <p style={{ fontSize: "12px", color: "#999999", marginTop: "4px" }}>
              Add custom CSS to override default styles. Use CSS selectors to
              target specific elements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
