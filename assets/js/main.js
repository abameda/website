/* ==========================================================================
   The Register — interaction layer.
   Everything here is progressive: the pages read completely without it.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const html = document.documentElement;

  /* 1. Sources — mark every claim by what backs it (shown / documented /
        stated / withheld). The preference follows the visitor between pages. */
  const toggles = $$("[data-sources-toggle]");
  if (toggles.length) {
    const KEY = "ae-sources";
    const set = (on) => {
      html.classList.toggle("sources-on", on);
      toggles.forEach((btn) => btn.setAttribute("aria-pressed", String(on)));
      try { localStorage.setItem(KEY, on ? "1" : "0"); } catch { /* storage unavailable */ }
    };
    let saved = false;
    try { saved = localStorage.getItem(KEY) === "1"; } catch { /* storage unavailable */ }
    set(saved);
    toggles.forEach((btn) =>
      btn.addEventListener("click", () => set(!html.classList.contains("sources-on"))));
  }

  /* 2. Copy email — announced through a status region next to the button */
  $$("[data-copy]").forEach((btn) => {
    const out = btn.nextElementSibling;
    let timer;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        out.textContent = "Copied";
      } catch {
        out.textContent = "Select the address to copy it";
      }
      clearTimeout(timer);
      timer = setTimeout(() => { out.textContent = ""; }, 2600);
    });
  });

  /* 3. Timetable — place the "now" line at the current month.
        Grid lines count months from Jan 2021 (line 1) to Dec 2028 (line 97). */
  const tt = $(".tt");
  if (tt) {
    const d = new Date();
    const line = (d.getFullYear() - 2021) * 12 + d.getMonth() + 2;
    tt.style.setProperty("--now", String(Math.max(1, Math.min(97, line))));
  }

  /* 4. Exhibit viewer — full screenshots in a native dialog.
        Without dialog support the link simply opens the image. */
  const viewer = $("#viewer");
  if (viewer && typeof viewer.showModal === "function") {
    const frame = $(".viewer-frame", viewer);
    const cap = $(".viewer-cap", viewer);
    $$("a[data-view]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const thumb = $("img", link);
        const caption = link.closest("figure")?.querySelector("figcaption");
        const img = document.createElement("img");
        img.className = "viewer-img";
        img.src = link.href;
        img.alt = thumb ? thumb.alt : "";
        frame.replaceChildren(img);
        cap.textContent = caption ? caption.textContent.replace(/\s+/g, " ").trim() : "";
        viewer.showModal();
        viewer.scrollTop = 0;
      });
    });
    viewer.addEventListener("close", () => frame.replaceChildren());
  }

  /* 5. Wayfinding — mark the section being read in the header nav / contents */
  const spy = (links) => {
    const targets = new Map();
    links.forEach((a) => {
      const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (el) targets.set(el, a);
    });
    if (!targets.size || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        targets.get(entry.target).setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    targets.forEach((_, el) => io.observe(el));
  };
  spy($$('.bar nav a[href^="#"]'));
  spy($$('.toc a[href^="#"]'));

  /* 6. Colophon year */
  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* 7. Gate — the register signs the visitor in. The head script already decided
        it should show (once per session, motion allowed); this sets the type,
        hidden, then prints the beats. Any key, click, tap or wheel skips to the lift. */
  const gate = $(".gate");
  if (gate && html.classList.contains("gate-on")) {
    try { sessionStorage.setItem("ae-gate", "1"); } catch { /* storage unavailable */ }
    const span = (text = "", className = "") =>
      Object.assign(document.createElement("span"), { textContent: text, className });
    const name = $("[data-gate-name]", gate);
    const words = name.dataset.type.split(" ").map((word) => {
      const el = span("", "gate-word");
      el.append(...[...word].map((glyph) => span(glyph)));
      return el;
    });
    name.replaceChildren(...words.flatMap((el, i) => (i ? [" ", el] : [el])));
    const key = $("[data-gate-key]", gate);
    key.replaceChildren(...Array.from({ length: 8 }, () => span()));
    const skipOn = ["keydown", "pointerdown", "wheel", "touchstart"];
    const timers = [];
    let over = false;

    const done = () => { gate.remove(); html.classList.remove("gate-on"); };
    const lift = () => {
      over = true;
      skipOn.forEach((type) => window.removeEventListener(type, skip));
      gate.addEventListener("transitionend", (e) => { if (e.target === gate) done(); });
      setTimeout(done, 900); // in case transitionend never fires
      gate.classList.add("is-lifting");
    };
    const skip = () => {
      timers.forEach(clearTimeout);
      gate.classList.add("is-skip", "is-open");
      lift();
    };
    skipOn.forEach((type) => window.addEventListener(type, skip, { passive: true }));

    // Timeline, ms from start: rules 0 · name 300–960 · key 1000–1330 ·
    // stamp 1400 · rules to the edges 1760 · lift 1980, gone at 2400.
    const run = () => {
      if (over) return;
      const at = (ms, fn) => timers.push(setTimeout(fn, ms));
      const press = (el) => () => el.classList.add("is-set");
      let t = 0;
      at(t, () => gate.classList.add("is-ruled"));
      t = 300;
      words.forEach((word) => {
        t += 70;
        [...word.children].forEach((glyph) => at(t += 26, press(glyph)));
      });
      [...key.children].forEach((square, i) => at(t += i === 4 ? 90 : 40, press(square)));
      at(t += 70, () => gate.classList.add("is-verified"));
      at(t += 360, () => gate.classList.add("is-open"));
      at(t += 220, lift);
    };
    // Type in the real faces, but never wait on the network for long
    Promise.race([document.fonts ? document.fonts.ready : null, new Promise((r) => setTimeout(r, 700))]).then(run);
  }
})();
