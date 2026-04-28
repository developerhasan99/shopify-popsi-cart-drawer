(function () {
  "use strict";

  const CART_UPDATED_EVENT = "popsi-cart:cart-updated";
  const OPEN_CART_EVENT = "open-popsi-cart";

  const DEFAULTS = {
    autoOpenCart: true,
    showFloatingTrigger: true,
    floatingPosition: "bottom-right",
    inheritFonts: true,
    cartTitle: "Your Cart",
    showCartCount: true,
    cartIconType: "bag-1",
    cartIconColor: "#000000",
    cartIconSize: 24,
    cartBubbleBg: "#000000",
    cartBubbleText: "#ffffff",
    bgColor: "#ffffff",
    textColor: "#000000",
    accentColor: "#f6f6f7",
    btnColor: "#000000",
    btnTextColor: "#ffffff",
    btnHoverColor: "#333333",
    btnHoverTextColor: "#ffffff",
    btnRadius: 5,
    showAnnouncement: false,
    announcementText: "Your products are reserved for {timer}!",
    announcementBg: "#fffbeb",
    announcementTextColor: "#92400e",
    announcementSize: "medium",
    timerDuration: 15,
    enableRewardsBar: true,
    showRewardsOnEmpty: true,
    rewardType: "subtotal",
    rewardAwayText: "You're only {amount} away from {goal}",
    rewardCompletedText: "Congratulations! You have unlocked all rewards.",
    rewardGoalOneThreshold: 50,
    rewardGoalOneLabel: "Free Shipping",
    rewardGoalOneIcon: "truck",
    rewardGoalTwoThreshold: 100,
    rewardGoalTwoLabel: "10% Discount",
    rewardGoalTwoIcon: "tag",
    rewardsBarBg: "#e2e2e2",
    rewardsBarFg: "#93d3ff",
    rewardsCompleteIconColor: "#4d4949",
    rewardsIncompleteIconColor: "#4d4949",
    showItemImages: true,
    showStrikethrough: true,
    showSavings: true,
    savingsTextColor: "#2ea818",
    savingsPrefix: "Save",
    enableCoupon: true,
    enableSubtotalLine: true,
    enableTotalLine: true,
    showShippingNotice: true,
    showSubtotalOnCheckout: true,
    showUpsells: true,
    showUpsellsOnEmpty: true,
    upsellTitle: "You might also like...",
    upsellMax: 3,
    upsellIntent: "related",
    upsellBtnText: "Add to Cart",
    showTrustBadges: true,
    trustBadgeUrl: "",
    transCheckoutBtn: "Checkout",
    transContinueShopping: "Continue Shopping",
    transEmptyCart: "Your cart is currently empty.",
    transSubtotal: "Subtotal",
    transTotal: "Total",
    transDiscounts: "Discounts",
    transCouponAccordionTitle: "Have a Coupon?",
    transCouponPlaceholder: "Coupon code",
    transCouponApplyBtn: "Apply",
    shippingNoticeText: "Shipping and taxes will be calculated at checkout.",
  };

  function asBoolean(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === true || value === "true" || value === "1";
  }

  function asNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function asText(value, fallback) {
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeImageUrl(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `${window.location.protocol}${url}`;
    return url;
  }

  function humanizePropertyName(name) {
    return String(name).replace(/^_+/, "").replace(/[_-]+/g, " ");
  }

  function iconSvg(name, className = "") {
    const iconClass = escapeHtml(className);
    const icons = {
      truck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${iconClass}"><path d="M4.75 4.5a.75.75 0 0 0 0 1.5h3.25a1 1 0 0 1 0 2h-4.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 0 0 1.5h.458a2.5 2.5 0 1 0 4.78.75h3.024a2.5 2.5 0 1 0 4.955-.153 1.75 1.75 0 0 0 1.033-1.597v-1.22a1.75 1.75 0 0 0-1.326-1.697l-1.682-.42a.25.25 0 0 1-.18-.174l-.426-1.494a2.75 2.75 0 0 0-2.645-1.995h-6.991Zm2.75 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill-rule="evenodd"></path></svg>`,
      tag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${iconClass}"><path d="M8.575 4.649a3.75 3.75 0 0 1 2.7-1.149h1.975a3.25 3.25 0 0 1 3.25 3.25v2.187a3.25 3.25 0 0 1-.996 2.34l-4.747 4.572a2.5 2.5 0 0 1-3.502-.033l-2.898-2.898a2.75 2.75 0 0 1-.036-3.852l4.254-4.417Zm4.425 3.351a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill-rule="evenodd"></path></svg>`,
      gift: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${iconClass}"><path d="M7.835 9.5h-.96c-.343 0-.625-.28-.625-.628 0-.344.28-.622.619-.622.242 0 .463.142.563.363l.403.887Z"></path><path d="M10.665 9.5h.96c.343 0 .625-.28.625-.628 0-.344-.28-.622-.619-.622-.242 0-.463.142-.563.363l-.403.887Z"></path><path fill-rule="evenodd" d="M8.5 4h-3.25c-1.519 0-2.75 1.231-2.75 2.75v2.25h1.25c.414 0 .75.336.75.75s-.336.75-.75.75h-1.25v2.75c0 1.519 1.231 2.75 2.75 2.75h3.441c-.119-.133-.191-.308-.191-.5v-2c0-.414.336-.75.75-.75s.75.336.75.75v2c0 .192-.072.367-.191.5h4.941c1.519 0 2.75-1.231 2.75-2.75v-2.75h-2.75c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2.75v-2.25c0-1.519-1.231-2.75-2.75-2.75h-4.75v2.25c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-2.25Z"></path></svg>`,
      star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${iconClass}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
      image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${iconClass}"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
      close: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${iconClass}"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
      trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${iconClass}"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-.5.2-1 .6-1h6c.4 0 .6.5.6 1v2"></path></svg>`,
      cart: `<svg xmlns="http://www.w3.org/2000/svg" class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path></svg>`,
      basket: `<svg xmlns="http://www.w3.org/2000/svg" class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18l-2 9H5l-2-9Zm6-5h6l3 5H6l3-5Z"></path></svg>`,
      "bag-2": `<svg xmlns="http://www.w3.org/2000/svg" class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z"></path><circle cx="12" cy="14" r="2" stroke-width="2"></circle></svg>`,
      "bag-1": `<svg xmlns="http://www.w3.org/2000/svg" class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z"></path></svg>`,
    };

    return icons[name] || icons["bag-1"];
  }

  class PopsiCartDrawer extends HTMLElement {
    constructor() {
      super();
      this.cart = null;
      this.count = 0;
      this.error = "";
      this.isOpen = false;
      this.isLoading = false;
      this.couponOpen = false;
      this.timerCount = 0;
      this.timerInterval = null;
      this.recommendations = [];
      this.recommendationsSignature = "";
      this.previousBodyOverflow = "";

      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleCartSubmit = this.handleCartSubmit.bind(this);
      this.handleOpenEvent = this.handleOpenEvent.bind(this);
    }

    connectedCallback() {
      this.settings = this.readSettings();
      this.timerCount = Math.max(1, this.settings.timerDuration) * 60;
      this.render();

      this.addEventListener("click", this.handleClick);
      this.addEventListener("change", this.handleChange);
      document.addEventListener("keydown", this.handleKeydown);
      document.addEventListener("submit", this.handleCartSubmit, true);
      window.addEventListener(OPEN_CART_EVENT, this.handleOpenEvent);

      this.refreshCart();
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
      this.removeEventListener("change", this.handleChange);
      document.removeEventListener("keydown", this.handleKeydown);
      document.removeEventListener("submit", this.handleCartSubmit, true);
      window.removeEventListener(OPEN_CART_EVENT, this.handleOpenEvent);
      this.stopTimer();
      if (this.isOpen) document.body.style.overflow = this.previousBodyOverflow;
    }

    readSettings() {
      const data = this.dataset;

      return {
        blockId: asText(data.blockId, ""),
        currentProductId: asText(data.currentProductId, ""),
        autoOpenCart: asBoolean(data.autoOpenCart, DEFAULTS.autoOpenCart),
        showFloatingTrigger: asBoolean(data.showFloatingTrigger, DEFAULTS.showFloatingTrigger),
        floatingPosition: asText(data.floatingPosition, DEFAULTS.floatingPosition),
        inheritFonts: asBoolean(data.inheritFonts, DEFAULTS.inheritFonts),
        cartTitle: asText(data.cartTitle, DEFAULTS.cartTitle),
        showCartCount: asBoolean(data.showCartCount, DEFAULTS.showCartCount),
        cartIconType: asText(data.cartIconType, DEFAULTS.cartIconType),
        cartIconColor: asText(data.cartIconColor, DEFAULTS.cartIconColor),
        cartIconSize: asNumber(data.cartIconSize, DEFAULTS.cartIconSize),
        cartBubbleBg: asText(data.cartBubbleBg, DEFAULTS.cartBubbleBg),
        cartBubbleText: asText(data.cartBubbleText, DEFAULTS.cartBubbleText),
        bgColor: asText(data.bgColor, DEFAULTS.bgColor),
        textColor: asText(data.textColor, DEFAULTS.textColor),
        accentColor: asText(data.accentColor, DEFAULTS.accentColor),
        btnColor: asText(data.btnColor, DEFAULTS.btnColor),
        btnTextColor: asText(data.btnTextColor, DEFAULTS.btnTextColor),
        btnHoverColor: asText(data.btnHoverColor, DEFAULTS.btnHoverColor),
        btnHoverTextColor: asText(data.btnHoverTextColor, DEFAULTS.btnHoverTextColor),
        btnRadius: asNumber(data.btnRadius, DEFAULTS.btnRadius),
        showAnnouncement: asBoolean(data.showAnnouncement, DEFAULTS.showAnnouncement),
        announcementText: asText(data.announcementText, DEFAULTS.announcementText),
        announcementBg: asText(data.announcementBg, DEFAULTS.announcementBg),
        announcementTextColor: asText(data.announcementTextColor, DEFAULTS.announcementTextColor),
        announcementSize: asText(data.announcementSize, DEFAULTS.announcementSize),
        timerDuration: asNumber(data.timerDuration, DEFAULTS.timerDuration),
        enableRewardsBar: asBoolean(data.enableRewardsBar, DEFAULTS.enableRewardsBar),
        showRewardsOnEmpty: asBoolean(data.showRewardsOnEmpty, DEFAULTS.showRewardsOnEmpty),
        rewardType: asText(data.rewardType, DEFAULTS.rewardType),
        rewardAwayText: asText(data.rewardAwayText, DEFAULTS.rewardAwayText),
        rewardCompletedText: asText(data.rewardCompletedText, DEFAULTS.rewardCompletedText),
        rewardGoalOneThreshold: asNumber(data.rewardGoalOneThreshold, DEFAULTS.rewardGoalOneThreshold),
        rewardGoalOneLabel: asText(data.rewardGoalOneLabel, DEFAULTS.rewardGoalOneLabel),
        rewardGoalOneIcon: asText(data.rewardGoalOneIcon, DEFAULTS.rewardGoalOneIcon),
        rewardGoalTwoThreshold: asNumber(data.rewardGoalTwoThreshold, DEFAULTS.rewardGoalTwoThreshold),
        rewardGoalTwoLabel: asText(data.rewardGoalTwoLabel, DEFAULTS.rewardGoalTwoLabel),
        rewardGoalTwoIcon: asText(data.rewardGoalTwoIcon, DEFAULTS.rewardGoalTwoIcon),
        rewardsBarBg: asText(data.rewardsBarBg, DEFAULTS.rewardsBarBg),
        rewardsBarFg: asText(data.rewardsBarFg, DEFAULTS.rewardsBarFg),
        rewardsCompleteIconColor: asText(data.rewardsCompleteIconColor, DEFAULTS.rewardsCompleteIconColor),
        rewardsIncompleteIconColor: asText(data.rewardsIncompleteIconColor, DEFAULTS.rewardsIncompleteIconColor),
        showItemImages: asBoolean(data.showItemImages, DEFAULTS.showItemImages),
        showStrikethrough: asBoolean(data.showStrikethrough, DEFAULTS.showStrikethrough),
        showSavings: asBoolean(data.showSavings, DEFAULTS.showSavings),
        savingsTextColor: asText(data.savingsTextColor, DEFAULTS.savingsTextColor),
        savingsPrefix: asText(data.savingsPrefix, DEFAULTS.savingsPrefix),
        enableCoupon: asBoolean(data.enableCoupon, DEFAULTS.enableCoupon),
        enableSubtotalLine: asBoolean(data.enableSubtotalLine, DEFAULTS.enableSubtotalLine),
        enableTotalLine: asBoolean(data.enableTotalLine, DEFAULTS.enableTotalLine),
        showShippingNotice: asBoolean(data.showShippingNotice, DEFAULTS.showShippingNotice),
        showSubtotalOnCheckout: asBoolean(data.showSubtotalOnCheckout, DEFAULTS.showSubtotalOnCheckout),
        showUpsells: asBoolean(data.showUpsells, DEFAULTS.showUpsells),
        showUpsellsOnEmpty: asBoolean(data.showUpsellsOnEmpty, DEFAULTS.showUpsellsOnEmpty),
        upsellTitle: asText(data.upsellTitle, DEFAULTS.upsellTitle),
        upsellMax: Math.min(10, Math.max(1, asNumber(data.upsellMax, DEFAULTS.upsellMax))),
        upsellIntent: asText(data.upsellIntent, DEFAULTS.upsellIntent),
        upsellBtnText: asText(data.upsellBtnText, DEFAULTS.upsellBtnText),
        showTrustBadges: asBoolean(data.showTrustBadges, DEFAULTS.showTrustBadges),
        trustBadgeUrl: asText(data.trustBadgeUrl, DEFAULTS.trustBadgeUrl),
        transCheckoutBtn: asText(data.transCheckoutBtn, DEFAULTS.transCheckoutBtn),
        transContinueShopping: asText(data.transContinueShopping, DEFAULTS.transContinueShopping),
        transEmptyCart: asText(data.transEmptyCart, DEFAULTS.transEmptyCart),
        transSubtotal: asText(data.transSubtotal, DEFAULTS.transSubtotal),
        transTotal: asText(data.transTotal, DEFAULTS.transTotal),
        transDiscounts: asText(data.transDiscounts, DEFAULTS.transDiscounts),
        transCouponAccordionTitle: asText(data.transCouponAccordionTitle, DEFAULTS.transCouponAccordionTitle),
        transCouponPlaceholder: asText(data.transCouponPlaceholder, DEFAULTS.transCouponPlaceholder),
        transCouponApplyBtn: asText(data.transCouponApplyBtn, DEFAULTS.transCouponApplyBtn),
        shippingNoticeText: asText(data.shippingNoticeText, DEFAULTS.shippingNoticeText),
      };
    }

    route(path) {
      const root = window.Shopify?.routes?.root || "/";
      const normalizedRoot = root.endsWith("/") ? root : `${root}/`;
      return `${normalizedRoot}${String(path).replace(/^\//, "")}`;
    }

    async fetchJson(path, options = {}) {
      const headers = {
        Accept: "application/json",
        ...(options.headers || {}),
      };

      const response = await fetch(this.route(path), {
        credentials: "same-origin",
        ...options,
        headers,
      });

      if (!response.ok) {
        let message = "Cart request failed.";
        try {
          const json = await response.json();
          message = json.description || json.message || message;
        } catch (_error) {
          message = response.statusText || message;
        }
        throw new Error(message);
      }

      return response.json();
    }

    async postJson(path, payload) {
      return this.fetchJson(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    async refreshCart({ loading = false } = {}) {
      if (loading) this.setLoading(true);
      try {
        const cart = await this.fetchJson("cart.js");
        this.receiveCart(cart);
      } catch (error) {
        this.setError(error.message);
      } finally {
        if (loading) this.setLoading(false);
      }
    }

    receiveCart(cart) {
      this.cart = cart;
      this.count = Number(cart?.item_count || 0);
      this.error = "";
      this.render();
      this.emitCartUpdated();
      this.loadRecommendations();
    }

    emitCartUpdated() {
      const detail = { cart: this.cart, count: this.count };
      window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail }));
      document.dispatchEvent(new CustomEvent("cart:updated", { detail }));
    }

    setError(message) {
      this.error = message || "";
      this.render();
    }

    setLoading(loading) {
      this.isLoading = Boolean(loading);
      this.render();
    }

    handleOpenEvent() {
      this.openCart(true);
    }

    async handleCartSubmit(event) {
      if (!this.settings.autoOpenCart) return;

      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const action = form.getAttribute("action") || "";
      if (!action.includes("/cart/add") && !action.endsWith("cart/add")) return;
      if (form.dataset.popsiCartIgnore === "true") return;

      event.preventDefault();
      await this.addFromForm(form, event.submitter);
    }

    async handleClick(event) {
      const control = event.target.closest("[data-popsi-action]");
      if (!control || !this.contains(control)) return;

      const action = control.dataset.popsiAction;

      if (action === "checkout") return;

      event.preventDefault();

      if (action === "open") {
        this.openCart(true);
      } else if (action === "close" || action === "continue-shopping") {
        this.closeCart();
      } else if (action === "remove-item") {
        await this.updateItem(control.dataset.key, 0);
      } else if (action === "change-quantity") {
        await this.updateItem(control.dataset.key, Number(control.dataset.quantity));
      } else if (action === "toggle-coupon") {
        this.couponOpen = !this.couponOpen;
        this.render();
      } else if (action === "apply-coupon") {
        const input = this.querySelector(".bc-coupon-input");
        await this.applyCoupon(input?.value || "");
      } else if (action === "remove-coupon") {
        await this.removeCoupon(control.dataset.code || "");
      } else if (action === "add-upsell") {
        await this.addUpsell(control);
      }
    }

    handleChange(event) {
      const select = event.target.closest(".bc-upsell-select");
      if (!select || !this.contains(select)) return;

      const option = select.selectedOptions[0];
      const price = option?.dataset.price;
      const item = select.closest(".bc-upsell-item");
      const priceEl = item?.querySelector(".bc-upsell-price");
      if (price && priceEl) priceEl.textContent = price;
    }

    handleKeydown(event) {
      if (event.key === "Escape" && this.isOpen) {
        this.closeCart();
        return;
      }

      if (event.key !== "Enter") return;
      const target = event.target;
      if (target instanceof HTMLInputElement && target.classList.contains("bc-coupon-input")) {
        event.preventDefault();
        this.applyCoupon(target.value);
      }
    }

    async addFromForm(form, submitter) {
      this.setLoading(true);

      try {
        let formData;
        try {
          formData = new FormData(form, submitter || undefined);
        } catch (_error) {
          formData = new FormData(form);
          if (submitter?.name) formData.append(submitter.name, submitter.value);
        }

        const response = await fetch(this.route("cart/add.js"), {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.description || payload.message || "Unable to add this product.");
        }

        await this.refreshCart();
        this.openCart();
      } catch (error) {
        this.setError(error.message);
        this.openCart();
      } finally {
        this.setLoading(false);
      }
    }

    async updateItem(key, quantity) {
      if (!key || quantity < 0) return;
      this.setLoading(true);

      try {
        const cart = await this.postJson("cart/change.js", {
          id: key,
          quantity,
        });
        this.receiveCart(cart);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    }

    async applyCoupon(rawCode) {
      const code = rawCode.trim();
      if (!code) return;

      this.setLoading(true);
      try {
        const codes = new Set(this.discountCodes());
        codes.add(code);
        const cart = await this.postJson("cart/update.js", {
          discount: Array.from(codes).join(","),
        });
        this.couponOpen = false;
        this.receiveCart(cart);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    }

    async removeCoupon(code) {
      if (!code) return;

      this.setLoading(true);
      try {
        const remainingCodes = this.discountCodes().filter((existingCode) => existingCode !== code);
        const cart = await this.postJson("cart/update.js", {
          discount: remainingCodes.join(","),
        });
        this.receiveCart(cart);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    }

    async addUpsell(button) {
      const item = button.closest(".bc-upsell-item");
      const select = item?.querySelector(".bc-upsell-select");
      const variantId = select?.value || button.dataset.variantId;
      if (!variantId) return;

      this.setLoading(true);
      try {
        await this.postJson("cart/add.js", {
          items: [{ id: Number(variantId), quantity: 1 }],
        });
        await this.refreshCart();
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    }

    openCart(forceRefresh = false) {
      if (!this.isOpen) {
        this.previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }

      this.isOpen = true;
      this.render();
      this.startTimer();

      window.setTimeout(() => {
        this.querySelector(".bc-drawer-close")?.focus();
      }, 0);

      if (forceRefresh) this.refreshCart({ loading: true });
    }

    closeCart() {
      this.isOpen = false;
      document.body.style.overflow = this.previousBodyOverflow;
      this.render();
    }

    startTimer() {
      if (this.timerInterval || !this.settings.showAnnouncement) return;

      this.timerInterval = window.setInterval(() => {
        if (this.timerCount > 0) {
          this.timerCount -= 1;
          const timer = this.querySelector(".bc-timer-bold");
          if (timer) timer.textContent = this.formatTime(this.timerCount);
        } else {
          this.stopTimer();
        }
      }, 1000);
    }

    stopTimer() {
      if (!this.timerInterval) return;
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    formatMoney(cents) {
      const currency = this.cart?.currency || window.Shopify?.currency?.active || "USD";
      const locale = window.Shopify?.locale || document.documentElement.lang || navigator.language || "en";
      const amount = Number(cents || 0) / 100;

      try {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
        }).format(amount);
      } catch (_error) {
        return `${amount.toFixed(2)} ${currency}`;
      }
    }

    discountCodes() {
      const codes = new Set();
      const applications = this.cart?.cart_level_discount_applications || [];
      applications.forEach((discount) => {
        if (discount.title) codes.add(discount.title);
      });

      (this.cart?.items || []).forEach((item) => {
        (item.discounts || []).forEach((discount) => {
          if (discount.title) codes.add(discount.title);
        });
      });

      return Array.from(codes);
    }

    getRecommendationAnchorProductId() {
      const firstCartItem = this.cart?.items?.[0];
      return firstCartItem?.product_id || this.settings.currentProductId || "";
    }

    async loadRecommendations() {
      if (!this.settings.showUpsells || !this.cart) return;

      const isEmpty = this.count === 0;
      if (isEmpty && !this.settings.showUpsellsOnEmpty) {
        this.recommendations = [];
        this.recommendationsSignature = "";
        this.render();
        return;
      }

      const productId = this.getRecommendationAnchorProductId();
      if (!productId) {
        this.recommendations = [];
        this.recommendationsSignature = "";
        this.render();
        return;
      }

      const cartProductIds = new Set((this.cart.items || []).map((item) => Number(item.product_id)));
      const signature = [
        productId,
        Array.from(cartProductIds).sort().join(":"),
        this.settings.upsellMax,
        this.settings.upsellIntent,
      ].join("|");

      if (signature === this.recommendationsSignature) return;
      this.recommendationsSignature = signature;

      try {
        const params = new URLSearchParams({
          product_id: String(productId),
          limit: String(this.settings.upsellMax),
          intent: this.settings.upsellIntent,
        });
        const response = await this.fetchJson(`recommendations/products.json?${params.toString()}`);
        this.recommendations = (response.products || [])
          .filter((product) => !cartProductIds.has(Number(product.id)))
          .slice(0, this.settings.upsellMax);
        this.render();
      } catch (_error) {
        this.recommendations = [];
        this.render();
      }
    }

    cssVars() {
      const settings = this.settings;
      return [
        `--bc-bg: ${settings.bgColor}`,
        `--bc-text: ${settings.textColor}`,
        `--bc-accent: ${settings.accentColor}`,
        `--bc-btn-bg: ${settings.btnColor}`,
        `--bc-btn-text: ${settings.btnTextColor}`,
        `--bc-btn-hover-bg: ${settings.btnHoverColor}`,
        `--bc-btn-hover-text: ${settings.btnHoverTextColor}`,
        `--bc-btn-radius: ${settings.btnRadius}px`,
        `--bc-cart-icon-color: ${settings.cartIconColor}`,
        `--bc-cart-icon-size: ${settings.cartIconSize}px`,
        `--bc-cart-bubble-bg: ${settings.cartBubbleBg}`,
        `--bc-cart-bubble-text: ${settings.cartBubbleText}`,
        `--bc-savings: ${settings.savingsTextColor}`,
      ].join("; ");
    }

    render() {
      if (!this.settings) return;

      const settings = this.settings;
      const count = Number(this.count || 0);
      const countMarkup = settings.showCartCount
        ? `<span><span class="bc-drawer-title-sep">•</span> <span class="bc-cart-count-display">${count}</span></span>`
        : "";

      this.innerHTML = `
        ${settings.showFloatingTrigger ? this.renderFloatingTrigger(count) : ""}
        <div class="bc-drawer-wrap ${this.isOpen ? "is-open" : ""}" style="${this.cssVars()}; font-family: ${settings.inheritFonts ? "inherit" : "sans-serif"};">
          <div class="bc-overlay" data-popsi-action="close"></div>
          <aside class="bc-drawer-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(settings.cartTitle)}">
            <div class="bc-drawer-header">
              <h2 class="bc-drawer-title">
                <span>${escapeHtml(settings.cartTitle)}</span>
                ${countMarkup}
              </h2>
              <button type="button" title="Close Cart" aria-label="Close cart" class="bc-drawer-close" data-popsi-action="close">
                ${iconSvg("close")}
              </button>
            </div>
            ${this.renderAnnouncement()}
            <div class="bc-drawer-body ${this.isLoading ? "is-loading" : ""}">
              <div class="bc-cart-html-container">
                ${this.renderCartContent()}
              </div>
              ${this.isLoading ? this.renderLoadingOverlay() : ""}
            </div>
          </aside>
        </div>
      `;
    }

    renderFloatingTrigger(count) {
      const settings = this.settings;
      return `
        <button
          type="button"
          class="popsi-cart-floating-trigger ${settings.floatingPosition === "bottom-left" ? "is-left" : "is-right"}"
          data-popsi-action="open"
          aria-label="Open cart"
          style="${this.cssVars()}"
        >
          ${iconSvg(settings.cartIconType, "popsi-cart-icon-svg")}
          ${settings.showCartCount ? `<span class="popsi-cart-count-bubble" ${count > 0 ? "" : "hidden"}>${count}</span>` : ""}
        </button>
      `;
    }

    renderAnnouncement() {
      const settings = this.settings;
      if (!settings.showAnnouncement) return "";

      const text = escapeHtml(settings.announcementText).replace(
        "{timer}",
        `<strong class="bc-timer-bold">${this.formatTime(this.timerCount)}</strong>`,
      );

      return `
        <div class="bc-drawer-top-notices">
          <div class="bc-announcement size-${escapeHtml(settings.announcementSize)}" style="background-color: ${settings.announcementBg}; color: ${settings.announcementTextColor};">
            ${text}
          </div>
        </div>
      `;
    }

    renderCartContent() {
      const cart = this.cart || { item_count: 0, items: [] };
      const isEmpty = Number(cart.item_count || 0) === 0;

      return `
        <div class="bc-cart-contents-scroll">
          ${this.renderRewards(cart)}
          ${isEmpty ? this.renderEmptyCart() : this.renderItems(cart.items || [])}
          ${this.renderUpsells(isEmpty)}
        </div>
        ${isEmpty ? "" : this.renderFooter(cart)}
      `;
    }

    renderRewards(cart) {
      const settings = this.settings;
      const isEmpty = Number(cart.item_count || 0) === 0;
      if (!settings.enableRewardsBar || (isEmpty && !settings.showRewardsOnEmpty)) return "";

      const goals = [
        {
          threshold: settings.rewardGoalOneThreshold,
          label: settings.rewardGoalOneLabel,
          icon: settings.rewardGoalOneIcon,
        },
        {
          threshold: settings.rewardGoalTwoThreshold,
          label: settings.rewardGoalTwoLabel,
          icon: settings.rewardGoalTwoIcon,
        },
      ]
        .filter((goal) => goal.threshold > 0)
        .sort((a, b) => a.threshold - b.threshold);

      if (!goals.length) return "";

      const currentValue =
        settings.rewardType === "quantity" ? Number(cart.item_count || 0) : Number(cart.items_subtotal_price || 0) / 100;
      const maxThreshold = goals[goals.length - 1].threshold;
      const progress = Math.min((currentValue / maxThreshold) * 100, 100);
      const nextGoal = goals.find((goal) => currentValue < goal.threshold);

      const progressText = nextGoal
        ? this.renderRewardAwayText(nextGoal, Math.max(nextGoal.threshold - currentValue, 0))
        : escapeHtml(settings.rewardCompletedText);

      return `
        <div class="bc-rewards-bars-wrap">
          <div class="bc-progress-wrap">
            <div class="bc-progress-text">${progressText}</div>
            <div class="bc-progress-bar" style="background-color: ${settings.rewardsBarBg}; margin-bottom: 24px;">
              <div class="bc-progress-fill" style="width: ${progress}%; background-color: ${settings.rewardsBarFg};"></div>
              <div class="bc-checkpoints">
                ${goals
                  .map((goal) => {
                    const reached = currentValue >= goal.threshold;
                    const position = Math.min((goal.threshold / maxThreshold) * 100, 100);
                    return `
                      <div class="bc-checkpoint ${reached ? "is-reached" : ""}" style="left: ${position}%; background-color: ${
                        reached ? settings.rewardsBarFg : settings.rewardsBarBg
                      }; color: ${reached ? settings.rewardsCompleteIconColor : settings.rewardsIncompleteIconColor};">
                        ${iconSvg(goal.icon, "bc-checkpoint-icon")}
                        <div class="bc-checkpoint-label">${escapeHtml(goal.label)}</div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    renderRewardAwayText(goal, difference) {
      const amount =
        this.settings.rewardType === "quantity" ? String(Math.ceil(difference)) : this.formatMoney(Math.ceil(difference * 100));

      return escapeHtml(this.settings.rewardAwayText)
        .replace("{amount}", `<strong>${escapeHtml(amount)}</strong>`)
        .replace("{goal}", `<strong>${escapeHtml(goal.label)}</strong>`);
    }

    renderItems(items) {
      return `
        <div class="bc-item-list">
          ${items.map((item) => this.renderItem(item)).join("")}
        </div>
      `;
    }

    renderItem(item) {
      const settings = this.settings;
      const title = item.product_title || item.title || "Product";
      const productUrl = item.url || "#";
      const imageUrl = normalizeImageUrl(item.image);
      const hasSale = Number(item.original_price || 0) > Number(item.final_price || item.price || 0);
      const itemDiscounts = this.discountCodes();
      const savings = (Number(item.original_price || 0) - Number(item.final_price || item.price || 0)) * Number(item.quantity || 1);

      return `
        <div class="bc-item">
          ${
            settings.showItemImages
              ? `<a href="${escapeHtml(productUrl)}" class="bc-item-img-wrap">
                  ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" loading="lazy">` : iconSvg("image", "bc-placeholder-icon")}
                </a>`
              : ""
          }
          <div class="bc-item-details">
            <button type="button" class="bc-item-remove" aria-label="Remove ${escapeHtml(title)}" data-popsi-action="remove-item" data-key="${escapeHtml(item.key)}">
              ${iconSvg("trash")}
            </button>

            <a href="${escapeHtml(productUrl)}" class="bc-item-title-link">
              <h4 class="bc-item-title">${escapeHtml(title)}</h4>
            </a>
            ${this.renderItemMeta(item)}

            <div class="bc-item-prices">
              ${hasSale && settings.showStrikethrough ? `<span class="bc-item-old-price">${this.formatMoney(item.original_price)}</span>` : ""}
              <span class="bc-item-price">${this.formatMoney(item.final_price || item.price)}</span>
              ${
                hasSale && settings.showSavings && savings > 0
                  ? `<span class="bc-item-price bc-item-savings">(${escapeHtml(settings.savingsPrefix)} ${this.formatMoney(savings)})</span>`
                  : ""
              }
            </div>

            <div class="bc-item-bottom">
              <div class="bc-qty-wrap">
                <button type="button" class="bc-qty-btn minus" aria-label="Decrease ${escapeHtml(title)} quantity" data-popsi-action="change-quantity" data-key="${escapeHtml(
                  item.key,
                )}" data-quantity="${Number(item.quantity || 0) - 1}">-</button>
                <span class="bc-qty-val">${Number(item.quantity || 0)}</span>
                <button type="button" class="bc-qty-btn plus" aria-label="Increase ${escapeHtml(title)} quantity" data-popsi-action="change-quantity" data-key="${escapeHtml(
                  item.key,
                )}" data-quantity="${Number(item.quantity || 0) + 1}">+</button>
              </div>

              ${
                itemDiscounts.length
                  ? `<div class="bc-item-coupons">
                      ${itemDiscounts
                        .map(
                          (code) => `
                            <div class="bc-item-discount-badge">
                              ${iconSvg("tag", "bc-badge-icon")}
                              <span class="bc-badge-text">${escapeHtml(code).toUpperCase()}</span>
                            </div>
                          `,
                        )
                        .join("")}
                    </div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    }

    renderItemMeta(item) {
      const meta = [];
      if (item.variant_title && item.variant_title !== "Default Title") meta.push(item.variant_title);
      if (Array.isArray(item.variant_options)) {
        item.variant_options
          .filter((option) => option && option !== "Default Title" && option !== item.variant_title)
          .forEach((option) => meta.push(option));
      }

      Object.entries(item.properties || {}).forEach(([key, value]) => {
        if (!key || key.startsWith("_") || value === null || value === "") return;
        meta.push(`${humanizePropertyName(key)}: ${value}`);
      });

      return meta.length ? `<div class="bc-item-meta">${meta.map(escapeHtml).join(", ")}</div>` : "";
    }

    renderEmptyCart() {
      return `
        <div class="bc-empty-cart">
          <svg class="bc-empty-cart-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p class="bc-empty-cart-text">${escapeHtml(this.settings.transEmptyCart)}</p>
          <button type="button" class="bc-empty-cart-btn" data-popsi-action="continue-shopping">${escapeHtml(this.settings.transContinueShopping)}</button>
        </div>
      `;
    }

    renderUpsells(isEmpty) {
      const settings = this.settings;
      if (!settings.showUpsells || (isEmpty && !settings.showUpsellsOnEmpty) || !this.recommendations.length) return "";

      return `
        <div class="bc-upsells">
          <h3 class="bc-upsells-title">${escapeHtml(settings.upsellTitle)}</h3>
          <div class="bc-upsells-list">
            ${this.recommendations.map((product) => this.renderUpsell(product)).join("")}
          </div>
        </div>
      `;
    }

    renderUpsell(product) {
      const variants = product.variants || [];
      const availableVariants = variants.filter((variant) => variant.available);
      const selectedVariant = availableVariants[0] || variants[0] || null;
      const productUrl = product.url || (product.handle ? this.route(`products/${product.handle}`) : "#");
      const imageUrl = normalizeImageUrl(product.featured_image || product.images?.[0] || selectedVariant?.featured_image?.src);
      const price = selectedVariant?.price ?? product.price_min ?? product.price;
      const compareAtPrice = selectedVariant?.compare_at_price ?? product.compare_at_price;
      const hasCompareAt = Number(compareAtPrice || 0) > Number(price || 0);

      return `
        <div class="bc-upsell-item">
          <div class="bc-upsell-img-wrap">
            <a href="${escapeHtml(productUrl)}" class="bc-upsell-link">
              ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.title)}" loading="lazy">` : iconSvg("image", "bc-placeholder-icon")}
            </a>
          </div>
          <div class="bc-upsell-details">
            <h5 class="bc-upsell-title">
              <a href="${escapeHtml(productUrl)}">${escapeHtml(product.title)}</a>
            </h5>
            <div class="bc-upsell-prices">
              ${hasCompareAt ? `<span class="bc-upsell-old-price">${this.formatMoney(compareAtPrice)}</span>` : ""}
              <span class="bc-upsell-price">${this.formatMoney(price)}</span>
            </div>
            <div class="bc-upsell-actions">
              ${
                variants.length > 1
                  ? `<div class="bc-upsell-select-wrap">
                      <select class="bc-upsell-select" aria-label="Choose ${escapeHtml(product.title)} variant">
                        ${variants
                          .map((variant) => {
                            const label = variant.public_title || variant.title || "Default";
                            const disabled = variant.available ? "" : "disabled";
                            const selected = selectedVariant && variant.id === selectedVariant.id ? "selected" : "";
                            return `<option value="${variant.id}" data-price="${this.formatMoney(variant.price)}" ${selected} ${disabled}>${escapeHtml(label)}</option>`;
                          })
                          .join("")}
                      </select>
                      <span class="bc-upsell-select-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                      </span>
                    </div>`
                  : ""
              }
              <button type="button" class="bc-upsell-add" data-popsi-action="add-upsell" data-variant-id="${selectedVariant?.id || ""}" ${
                selectedVariant ? "" : "disabled"
              }>
                ${escapeHtml(this.settings.upsellBtnText)}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    renderFooter(cart) {
      const settings = this.settings;
      const discountCodes = this.discountCodes();

      return `
        <div class="bc-drawer-footer">
          ${this.error ? `<div class="bc-cart-error" role="alert">${escapeHtml(this.error)}</div>` : ""}
          ${settings.enableCoupon ? this.renderCoupon(discountCodes) : ""}
          ${
            settings.enableSubtotalLine
              ? `<div class="bc-summary-row">
                  <span>${escapeHtml(settings.transSubtotal)}</span>
                  <span class="val-wrap">${this.formatMoney(cart.items_subtotal_price || cart.original_total_price || 0)}</span>
                </div>`
              : ""
          }
          ${
            Number(cart.total_discount || 0) > 0
              ? `<div class="bc-summary-row">
                  <div class="label-wrap">
                    <span>${escapeHtml(settings.transDiscounts)}:</span>
                    ${discountCodes.map((code) => this.renderDiscountBadge(code)).join("")}
                  </div>
                  <span class="val-wrap bc-discount-val">- ${this.formatMoney(cart.total_discount)}</span>
                </div>`
              : ""
          }
          ${
            settings.enableTotalLine
              ? `<div class="bc-summary-row bc-total-row">
                  <span>${escapeHtml(settings.transTotal)}</span>
                  <span class="val-wrap">${this.formatMoney(cart.total_price || 0)}</span>
                </div>`
              : ""
          }
          ${settings.showShippingNotice ? `<div class="bc-shipping-notice">${escapeHtml(settings.shippingNoticeText)}</div>` : ""}
          <div class="bc-checkout-btn-wrap">
            <a href="${this.route("checkout")}" class="bc-checkout-btn" data-popsi-action="checkout">
              <span>${escapeHtml(settings.transCheckoutBtn)}</span>
              ${
                settings.showSubtotalOnCheckout
                  ? `<span class="bc-checkout-sep">•</span><span>${this.formatMoney(cart.total_price || 0)}</span>`
                  : ""
              }
            </a>
          </div>
          ${
            settings.showTrustBadges && settings.trustBadgeUrl
              ? `<div class="bc-trust-badges"><img src="${escapeHtml(settings.trustBadgeUrl)}" alt="Payment badges" loading="lazy"></div>`
              : ""
          }
        </div>
      `;
    }

    renderCoupon() {
      return `
        <div class="bc-coupon-accordion">
          <button type="button" class="bc-coupon-toggle" data-popsi-action="toggle-coupon" aria-expanded="${this.couponOpen ? "true" : "false"}">
            <span>${escapeHtml(this.settings.transCouponAccordionTitle)}</span>
            <span class="bc-coupon-toggle-icon ${this.couponOpen ? "is-open" : ""}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
            </span>
          </button>
          <div class="bc-coupon-accordion-content" style="max-height: ${this.couponOpen ? "92px" : "0"};">
            <div class="bc-coupon-wrap">
              <input type="text" placeholder="${escapeHtml(this.settings.transCouponPlaceholder)}" class="bc-coupon-input" autocomplete="off">
              <button type="button" class="bc-coupon-btn" data-popsi-action="apply-coupon">${escapeHtml(this.settings.transCouponApplyBtn)}</button>
            </div>
          </div>
        </div>
      `;
    }

    renderDiscountBadge(code) {
      return `
        <button type="button" class="bc-summary-discount-badge" data-popsi-action="remove-coupon" data-code="${escapeHtml(code)}" aria-label="Remove discount ${escapeHtml(code)}">
          <span class="bc-summary-badge-text">${escapeHtml(code).toUpperCase()}</span>
          <span class="bc-badge-remove" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </span>
        </button>
      `;
    }

    renderLoadingOverlay() {
      return `
        <div class="bc-loading-overlay">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="bc-spinner" aria-hidden="true">
            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"></path>
          </svg>
        </div>
      `;
    }
  }

  class PopsiCartTrigger extends HTMLElement {
    constructor() {
      super();
      this.count = 0;
      this.handleClick = this.handleClick.bind(this);
      this.handleCartUpdated = this.handleCartUpdated.bind(this);
    }

    connectedCallback() {
      this.settings = this.readSettings();
      this.render();
      this.addEventListener("click", this.handleClick);
      window.addEventListener(CART_UPDATED_EVENT, this.handleCartUpdated);
      this.refreshCount();
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
      window.removeEventListener(CART_UPDATED_EVENT, this.handleCartUpdated);
    }

    readSettings() {
      const data = this.dataset;
      return {
        cartIconType: asText(data.cartIconType, DEFAULTS.cartIconType),
        cartIconColor: asText(data.cartIconColor, DEFAULTS.cartIconColor),
        cartIconSize: asNumber(data.cartIconSize, DEFAULTS.cartIconSize),
        cartBubbleBg: asText(data.cartBubbleBg, DEFAULTS.cartBubbleBg),
        cartBubbleText: asText(data.cartBubbleText, DEFAULTS.cartBubbleText),
        showCartCount: asBoolean(data.showCartCount, DEFAULTS.showCartCount),
        label: asText(data.label, "Open cart"),
      };
    }

    route(path) {
      const root = window.Shopify?.routes?.root || "/";
      const normalizedRoot = root.endsWith("/") ? root : `${root}/`;
      return `${normalizedRoot}${String(path).replace(/^\//, "")}`;
    }

    async refreshCount() {
      try {
        const response = await fetch(this.route("cart.js"), {
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return;
        const cart = await response.json();
        this.count = Number(cart.item_count || 0);
        this.render();
      } catch (_error) {
        // The drawer remains usable if a theme blocks the count request.
      }
    }

    handleCartUpdated(event) {
      this.count = Number(event.detail?.count || 0);
      this.render();
    }

    handleClick(event) {
      event.preventDefault();
      const drawer = document.querySelector("popsi-cart-drawer");
      if (drawer && typeof drawer.openCart === "function") {
        drawer.openCart(true);
        return;
      }

      window.dispatchEvent(new CustomEvent(OPEN_CART_EVENT));

      window.setTimeout(() => {
        const lateDrawer = document.querySelector("popsi-cart-drawer");
        if (!lateDrawer) window.location.href = this.route("cart");
      }, 50);
    }

    cssVars() {
      const settings = this.settings;
      return [
        `--bc-cart-icon-color: ${settings.cartIconColor}`,
        `--bc-cart-icon-size: ${settings.cartIconSize}px`,
        `--bc-cart-bubble-bg: ${settings.cartBubbleBg}`,
        `--bc-cart-bubble-text: ${settings.cartBubbleText}`,
      ].join("; ");
    }

    render() {
      if (!this.settings) return;

      this.innerHTML = `
        <button type="button" class="popsi-cart-icon-wrapper bc-icon-trigger" aria-label="${escapeHtml(this.settings.label)}" style="${this.cssVars()}">
          ${iconSvg(this.settings.cartIconType, "popsi-cart-icon-svg")}
          ${
            this.settings.showCartCount
              ? `<span class="popsi-cart-count-bubble" ${this.count > 0 ? "" : "hidden"}>${this.count}</span>`
              : ""
          }
        </button>
      `;
    }
  }

  if (!customElements.get("popsi-cart-drawer")) {
    customElements.define("popsi-cart-drawer", PopsiCartDrawer);
  }

  if (!customElements.get("popsi-cart-trigger")) {
    customElements.define("popsi-cart-trigger", PopsiCartTrigger);
  }
})();
