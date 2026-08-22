/* Leo Thaylor V2 — interações. Vanilla, RAF único, reduced-motion respeitado.
   Three.js só é baixado quando o usuário pede uma variante 3D. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(max-width: 720px)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Reveals ---------- */
  const reveals = $$("[data-reveal],[data-reveal-line]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const sibs = el.parentElement
            ? [...el.parentElement.querySelectorAll(":scope > [data-reveal], :scope > [data-reveal-line]")]
            : [el];
          const i = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(i * 80, 320) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Nav sticky ---------- */
  const nav = $("[data-nav]");
  const hero = $("#inicio");
  if (nav && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([e]) => nav.classList.toggle("is-stuck", !e.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    ).observe(hero);
  }

  /* ---------- Menu mobile ---------- */
  const burger = $("[data-burger]");
  const menu = $("[data-menu]");
  if (burger && menu) {
    const toggle = (open) => {
      const next = open ?? !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", next);
      burger.setAttribute("aria-expanded", String(next));
      document.body.style.overflow = next ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle());
    menu.addEventListener("click", (e) => { if (e.target.tagName === "A") toggle(false); });
    window.addEventListener("keydown", (e) => e.key === "Escape" && toggle(false));
  }

  /* ---------- Parallax leve do hero ---------- */
  const media = $("[data-parallax]");
  if (media && !reduce && !isTouch) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        media.style.transform = "translate3d(0," + y * 0.15 + "px,0) scale(1.06)";
        ticking = false;
      });
    };
    media.style.willChange = "transform";
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Galeria: setas ---------- */
  const gallery = $("[data-gallery]");
  if (gallery) {
    const prev = $("[data-gallery-prev]");
    const next = $("[data-gallery-next]");
    const step = () => {
      const fig = gallery.querySelector("figure");
      return fig ? fig.getBoundingClientRect().width + 16 : 320;
    };
    const update = () => {
      const max = gallery.scrollWidth - gallery.clientWidth - 2;
      if (prev) prev.toggleAttribute("disabled", gallery.scrollLeft <= 2);
      if (next) next.toggleAttribute("disabled", gallery.scrollLeft >= max);
    };
    prev && prev.addEventListener("click", () => gallery.scrollBy({ left: -step() * 1.5, behavior: "smooth" }));
    next && next.addEventListener("click", () => gallery.scrollBy({ left: step() * 1.5, behavior: "smooth" }));
    gallery.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Lightbox ---------- */
  const lb = $("[data-lightbox]");
  if (lb) {
    const lbImg = $("[data-lb-img]", lb);
    const items = $$(".mtile img, .card__media img");
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const el = items[idx];
      lbImg.src = el.currentSrc || el.src;
      lbImg.alt = el.alt || "";
    };
    const open = (i) => { show(i); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
    const close = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    items.forEach((el, i) => { el.style.cursor = "zoom-in"; el.addEventListener("click", () => open(i)); });
    $("[data-lb-close]", lb).addEventListener("click", close);
    $("[data-lb-prev]", lb).addEventListener("click", () => show(idx - 1));
    $("[data-lb-next]", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    window.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---------- Momentos: grade que se monta em 3D ao rolar ---------- */
  const mgrid = $("[data-mgrid]");
  if (mgrid) {
    const tiles = $$(".mtile", mgrid);
    const n = tiles.length;
    if (!reduce && n) {
      mgrid.classList.add("js-mgrid");
      const easeOut = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
      const W = () => window.innerWidth;
      const H = () => window.innerHeight;

      /* estado inicial por card: vindo de cima-direita, em curva/leque */
      const starts = tiles.map((el, i) => {
        const s = n > 1 ? i / (n - 1) : 0;
        return {
          dx: 0.55 + 0.65 * (1 - s),  /* fração de W (direita) */
          dy: -0.55 - 0.35 * s,       /* fração de H (acima) */
          rz: -16 + 26 * s,           /* graus */
          ry: 32,                     /* graus (inclinação 3D) */
          tz: -700,                   /* px de profundidade */
          sc: 0.55
        };
      });

      const STAGGER = 0.045, DUR = 0.5;

      function apply(p) {
        const w = W(), h = H();
        for (let i = 0; i < n; i++) {
          const st = starts[i];
          const lp = easeOut((p - i * STAGGER) / DUR);
          const inv = 1 - lp;
          const tx = st.dx * w * inv;
          const ty = st.dy * h * inv;
          const tz = st.tz * inv;
          const ry = st.ry * inv;
          const rz = st.rz * inv;
          const sc = st.sc + (1 - st.sc) * lp;
          tiles[i].style.transform =
            "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px," + tz.toFixed(0) + "px)" +
            " rotateY(" + ry.toFixed(1) + "deg) rotateZ(" + rz.toFixed(1) + "deg) scale(" + sc.toFixed(3) + ")";
          tiles[i].style.opacity = Math.min(1, lp * 1.6).toFixed(3);
        }
      }

      function progress() {
        const r = mgrid.getBoundingClientRect();
        const start = 0.9 * H(), end = 0.3 * H();
        return Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      }

      let ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { apply(progress()); ticking = false; });
      }

      apply(0);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }
  }

  /* ---------- Cursor customizado + etiqueta "Ampliar" ---------- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (finePointer && !reduce) {
    const cur = document.createElement("div");
    cur.className = "cursor is-hidden";
    cur.setAttribute("aria-hidden", "true");
    document.body.appendChild(cur);
    document.body.classList.add("has-cursor");

    let seen = false;

    const AMPLIAR = ".mtile, .card__media";
    const POINTER = "a, button, [role='button'], .btn, .filter-btn, .nav__burger, summary, label";

    window.addEventListener("mousemove", (e) => {
      /* posição instantânea — sem delay, gruda no ponteiro nativo */
      cur.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0) translate(-50%,-50%)";
      if (!seen) { seen = true; cur.classList.remove("is-hidden"); }
      const t = e.target;
      if (t.closest && t.closest(AMPLIAR)) {
        cur.className = "cursor is-ampliar"; cur.textContent = "Ampliar";
      } else if (t.closest && t.closest(POINTER)) {
        cur.className = "cursor is-pointer"; cur.textContent = "";
      } else {
        cur.className = "cursor"; cur.textContent = "";
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => cur.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cur.classList.remove("is-hidden"));
  }

})();
