(function initLtTracking() {
  "use strict";

  const CONFIG = Object.freeze({
    consentKey: "lt_tracking_consent_v2",
    attributionKey: "lt_attribution_v2",
    ga4Id: "G-901CW6RW4H",
    clarityId: "xs3yejldmx",
    metaPixelId: "941784835609445",
    attributionMaxLength: 160,
    debug: new URLSearchParams(window.location.search).get("tracking_debug") === "1"
  });

  const ATTRIBUTION_KEYS = Object.freeze([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "utm_id",
    "campaign_id",
    "adset_id",
    "ad_id",
    "placement",
    "site_source"
  ]);

  let activeConsent = readConsent();
  const attributionFromUrl = captureAttributionFromUrl();
  let attribution = mergeAttribution(readStoredAttribution(), attributionFromUrl);

  function sanitizeValue(value) {
    if (typeof value !== "string") return "";
    return value
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[<>"'`]/g, "")
      .trim()
      .slice(0, CONFIG.attributionMaxLength);
  }

  function safeStorage(storage, action, key, value) {
    try {
      if (action === "get") return storage.getItem(key);
      if (action === "set") storage.setItem(key, value);
      if (action === "remove") storage.removeItem(key);
    } catch (_error) {
      return null;
    }
    return null;
  }

  function parseJson(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }

  function normalizeConsent(value) {
    if (!value || value.version !== 2) return null;
    return Object.freeze({
      version: 2,
      necessary: true,
      analytics: value.analytics === true,
      marketing: value.marketing === true,
      updatedAt: sanitizeValue(value.updatedAt)
    });
  }

  function readConsent() {
    return normalizeConsent(parseJson(safeStorage(window.localStorage, "get", CONFIG.consentKey)));
  }

  function readStoredAttribution() {
    return parseJson(safeStorage(window.sessionStorage, "get", CONFIG.attributionKey)) || {};
  }

  function captureAttributionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const captured = {};
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = sanitizeValue(params.get(key));
      if (value) captured[key] = value;
    });
    return captured;
  }

  function mergeAttribution(stored, incoming) {
    const merged = { ...(stored || {}), ...(incoming || {}) };
    const clean = {};
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = sanitizeValue(merged[key]);
      if (value) clean[key] = value;
    });
    return Object.freeze(clean);
  }

  function persistAttributionIfAllowed() {
    if (!activeConsent || (!activeConsent.analytics && !activeConsent.marketing)) return;
    safeStorage(window.sessionStorage, "set", CONFIG.attributionKey, JSON.stringify(attribution));
  }

  function appendScript(id, src, onLoad) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    if (typeof onLoad === "function") script.addEventListener("load", onLoad, { once: true });
    document.head.appendChild(script);
  }

  function loadAnalytics() {
    if (window.__ltAnalyticsInitialized) return;
    window.__ltAnalyticsInitialized = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.ga4Id, {
      debug_mode: CONFIG.debug,
      send_page_view: true
    });
    appendScript(
      "lt-ga4-script",
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4Id)}`
    );

    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    Object.entries(attribution).forEach(([key, value]) => window.clarity("set", key, value));
    appendScript("lt-clarity-script", `https://www.clarity.ms/tag/${encodeURIComponent(CONFIG.clarityId)}`);
  }

  function loadMetaPixel() {
    if (window.__ltMetaInitialized) return;
    window.__ltMetaInitialized = true;

    const fbq = function fbq() {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = window.fbq || fbq;
    window._fbq = window._fbq || window.fbq;

    appendScript("lt-meta-pixel-script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CONFIG.metaPixelId);
    window.fbq("track", "PageView");
    window.fbq("track", "ViewContent", {
      content_name: "Aulas de jiu-jitsu — Studio Trion",
      content_category: "Captação de alunos BJJ",
      content_type: "landing_page",
      ...attribution
    });
  }

  function applyConsent() {
    if (!activeConsent) return;
    persistAttributionIfAllowed();
    if (activeConsent.analytics) loadAnalytics();
    if (activeConsent.marketing) loadMetaPixel();
  }

  function saveConsent(analytics, marketing) {
    activeConsent = Object.freeze({
      version: 2,
      necessary: true,
      analytics: analytics === true,
      marketing: marketing === true,
      updatedAt: new Date().toISOString()
    });
    safeStorage(window.localStorage, "set", CONFIG.consentKey, JSON.stringify(activeConsent));
    applyConsent();
    removeBanner();
  }

  function getElementLocation(anchor) {
    if (anchor.classList.contains("wa-fab")) return "mobile_fab";
    if (anchor.closest("header.nav")) return "nav";
    if (anchor.closest("#inicio")) return "hero";
    if (anchor.closest("#primeira-aula")) return "primeira_aula";
    if (anchor.closest("#localizacao")) return "localizacao";
    if (anchor.closest("footer")) return "footer";
    return "site";
  }

  function getElementLabel(anchor) {
    return sanitizeValue(anchor.getAttribute("aria-label") || anchor.textContent || "link");
  }

  function classifyLink(anchor) {
    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (_error) {
      return null;
    }

    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    if (host === "wa.me" || host.endsWith("whatsapp.com")) {
      return { ga4Event: "click_whatsapp", clarityEvent: "click_whatsapp", metaEvent: "Contact" };
    }
    if (host === "docs.google.com" && path.includes("/forms/")) {
      return { ga4Event: "click_form", clarityEvent: "click_form", metaEvent: "FormOpen", metaCustom: true };
    }
    if (host.includes("google.com") && path.includes("/maps/")) {
      return { ga4Event: "click_route", clarityEvent: "click_route" };
    }
    if (host === "instagram.com" || host === "www.instagram.com") {
      return { ga4Event: "click_instagram", clarityEvent: "click_instagram" };
    }
    if (url.origin === window.location.origin && path.includes("/alunos")) {
      return { ga4Event: "click_student_area", clarityEvent: "click_student_area" };
    }
    return null;
  }

  function trackLink(anchor, map) {
    const parameters = {
      element_location: getElementLocation(anchor),
      element_label: getElementLabel(anchor),
      link_url: sanitizeValue(anchor.href),
      ...attribution
    };

    if (activeConsent && activeConsent.analytics) {
      if (typeof window.gtag === "function") window.gtag("event", map.ga4Event, parameters);
      if (typeof window.clarity === "function") {
        window.clarity("event", map.clarityEvent);
        Object.entries(parameters).forEach(([key, value]) => {
          if (value !== "") window.clarity("set", key, String(value));
        });
      }
    }

    if (activeConsent && activeConsent.marketing && map.metaEvent && typeof window.fbq === "function") {
      if (map.metaCustom) window.fbq("trackCustom", map.metaEvent, parameters);
      else window.fbq("track", map.metaEvent, parameters);
    }
  }

  function bindTracking() {
    document.addEventListener("click", (event) => {
      const anchor = event.target.closest && event.target.closest("a[href]");
      if (!anchor) return;
      const map = classifyLink(anchor);
      if (!map) return;
      trackLink(anchor, map);
    });
  }

  function removeBanner() {
    const banner = document.getElementById("lt-consent");
    if (banner) banner.remove();
  }

  function showBanner() {
    if (activeConsent || document.getElementById("lt-consent")) return;

    const banner = document.createElement("aside");
    banner.id = "lt-consent";
    banner.className = "lt-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Preferências de privacidade");
    banner.innerHTML = `
      <div class="lt-consent__body">
        <p class="lt-consent__title">Privacidade e métricas</p>
        <p class="lt-consent__copy">Uso métricas para entender como o site é utilizado e melhorar a experiência. Você pode aceitar tudo, usar apenas o necessário ou escolher as categorias.</p>
        <div class="lt-consent__choices" hidden>
          <label><input type="checkbox" data-consent-analytics checked /> Analytics: Google Analytics e Microsoft Clarity</label>
          <label><input type="checkbox" data-consent-marketing /> Marketing: Meta Pixel</label>
        </div>
        <div class="lt-consent__actions">
          <button type="button" class="lt-consent__btn lt-consent__btn--primary" data-consent-all>Aceitar tudo</button>
          <button type="button" class="lt-consent__btn" data-consent-necessary>Somente necessário</button>
          <button type="button" class="lt-consent__btn" data-consent-custom>Escolher</button>
          <button type="button" class="lt-consent__btn lt-consent__btn--primary" data-consent-save hidden>Salvar escolhas</button>
        </div>
      </div>`;

    document.body.appendChild(banner);

    const choices = banner.querySelector(".lt-consent__choices");
    const allButton = banner.querySelector("[data-consent-all]");
    const necessaryButton = banner.querySelector("[data-consent-necessary]");
    const customButton = banner.querySelector("[data-consent-custom]");
    const saveButton = banner.querySelector("[data-consent-save]");
    const analyticsInput = banner.querySelector("[data-consent-analytics]");
    const marketingInput = banner.querySelector("[data-consent-marketing]");

    allButton.addEventListener("click", () => saveConsent(true, true));
    necessaryButton.addEventListener("click", () => saveConsent(false, false));
    customButton.addEventListener("click", () => {
      choices.hidden = false;
      allButton.hidden = true;
      necessaryButton.hidden = true;
      customButton.hidden = true;
      saveButton.hidden = false;
    });
    saveButton.addEventListener("click", () => saveConsent(analyticsInput.checked, marketingInput.checked));
  }

  function exposeDebug() {
    if (!CONFIG.debug) return;
    window.__ltTrackingDebug = Object.freeze({
      config: CONFIG,
      get consent() { return activeConsent; },
      get attribution() { return attribution; }
    });
  }

  bindTracking();
  exposeDebug();

  if (activeConsent) applyConsent();
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showBanner, { once: true });
  else showBanner();
})();
