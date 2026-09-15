/* ============================================================
   AE Portfolio — interaction layer
   All effects honor prefers-reduced-motion.
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ----------------------------------------------------------
     1. Intro overlay — fast, skippable, once per session
     ---------------------------------------------------------- */
  const intro = $("#intro");
  if (intro) {
    const seen = sessionStorage.getItem("ae-intro-seen");
    const finish = () => {
      intro.classList.add("is-done");
      document.body.classList.add("is-ready");
      sessionStorage.setItem("ae-intro-seen", "1");
    };
    if (seen || reduceMotion) {
      intro.remove();
      document.body.classList.add("is-ready");
    } else {
      $(".intro-skip", intro)?.addEventListener("click", finish);
      window.addEventListener("keydown", (e) => { if (e.key === "Escape") finish(); }, { once: true });
      setTimeout(finish, 1700); // keep it brief — anticipation, not delay
    }
  } else {
    document.body.classList.add("is-ready");
  }

  /* ----------------------------------------------------------
     2. Navigation — glass on scroll, hide on fast scroll-down,
        active-section indicator, mobile menu
     ---------------------------------------------------------- */
  const nav = $("#nav");
  if (nav) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 24);
      // Hide only on decisive downward scroll, past the hero
      if (y > 640 && y - lastY > 6) nav.classList.add("is-hidden");
      else if (lastY - y > 4 || y < 640) nav.classList.remove("is-hidden");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active section dots (index page only)
    const sectionLinks = $$('.nav-links a[href^="#"]');
    if (sectionLinks.length) {
      const map = new Map();
      sectionLinks.forEach((a) => {
        const sec = $(a.getAttribute("href"));
        if (sec) map.set(sec, a);
      });
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            sectionLinks.forEach((a) => a.classList.remove("is-active"));
            map.get(en.target)?.classList.add("is-active");
          }
        });
      }, { rootMargin: "-38% 0px -55% 0px" });
      map.forEach((_, sec) => spy.observe(sec));
    }
  }

  const burger = $("#nav-burger");
  const mobileMenu = $("#mobile-menu");
  if (burger && mobileMenu) {
    const setOpen = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () =>
      setOpen(burger.getAttribute("aria-expanded") !== "true"));
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ----------------------------------------------------------
     3. Reveal on scroll
     ---------------------------------------------------------- */
  const revealables = $$(".reveal");
  if (revealables.length && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  /* ----------------------------------------------------------
     4. Magnetic buttons — subtle pull toward the pointer
     ---------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = 0.24;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ----------------------------------------------------------
     5. Hero canvas — a quiet system of connected nodes.
        Nodes drift along slow orbits; edges form between
        neighbors; occasional signal pulses travel the edges.
        Pointer adds gentle attraction. Static frame when
        reduced motion is requested.
     ---------------------------------------------------------- */
  const canvas = $("#hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, nodes = [], pulses = [], raf = null;
    const pointer = { x: -9999, y: -9999, active: false };
    const ACCENT = "85, 183, 255";
    const INK = "236, 239, 244";
    const LINK_DIST = () => Math.min(W, H) * 0.24;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduceMotion) draw(0);
    };

    const seed = () => {
      const count = Math.round(Math.min(46, Math.max(22, (W * H) / 34000)));
      nodes = Array.from({ length: count }, () => {
        // Bias nodes to the right half so text stays readable
        const biasRight = Math.random() < 0.62;
        return {
          x: (biasRight ? 0.45 + Math.random() * 0.55 : Math.random() * 0.5) * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 1 + Math.random() * 1.6,
          hot: Math.random() < 0.18,
        };
      });
      pulses = [];
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const linkDist = LINK_DIST();

      // Move
      if (!reduceMotion) {
        for (const n of nodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
          if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
          if (pointer.active) {
            const dx = pointer.x - n.x, dy = pointer.y - n.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 220 * 220 && d2 > 1) {
              const f = 8 / d2; // gentle attraction
              n.x += dx * f; n.y += dy * f;
            }
          }
        }
      }

      // Edges
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.16;
            const hot = a.hot && b.hot;
            ctx.strokeStyle = `rgba(${hot ? ACCENT : INK}, ${hot ? alpha * 2.4 : alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Occasionally launch a signal pulse along a hot edge
            if (!reduceMotion && hot && pulses.length < 5 && Math.random() < 0.0015) {
              pulses.push({ a, b, p: 0, speed: 0.006 + Math.random() * 0.006 });
            }
          }
        }
      }

      // Signal pulses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const s = pulses[k];
        s.p += s.speed;
        if (s.p >= 1) { pulses.splice(k, 1); continue; }
        const x = s.a.x + (s.b.x - s.a.x) * s.p;
        const y = s.a.y + (s.b.y - s.a.y) * s.p;
        const fade = Math.sin(s.p * Math.PI);
        ctx.fillStyle = `rgba(${ACCENT}, ${0.85 * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      for (const n of nodes) {
        ctx.fillStyle = n.hot
          ? `rgba(${ACCENT}, 0.75)`
          : `rgba(${INK}, 0.35)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const hero = canvas.closest(".hero");
    hero?.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    });
    hero?.addEventListener("pointerleave", () => { pointer.active = false; });

    // Pause when off-screen — no wasted frames
    const vis = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        if (!raf && !reduceMotion) raf = requestAnimationFrame(draw);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
    vis.observe(canvas);

    window.addEventListener("resize", resize, { passive: true });
    resize();
  }

  /* ----------------------------------------------------------
     6. Expertise capability map — select a node, wires light
        up, the detail panel swaps. Fully keyboard operable.
     ---------------------------------------------------------- */
  const capMap = $("#cap-map");
  if (capMap) {
    const nodes = $$(".cap-node", capMap.parentElement);
    const panels = $$(".cap-panel");
    const wires = $$(".wire", capMap);
    const select = (key) => {
      nodes.forEach((n) => n.setAttribute("aria-selected", String(n.dataset.cap === key)));
      panels.forEach((p) => {
        const active = p.dataset.cap === key;
        p.hidden = !active;
        if (active) { // retrigger entrance animation
          p.style.animation = "none";
          void p.offsetWidth;
          p.style.animation = "";
        }
      });
      wires.forEach((w) => w.classList.toggle("is-hot", w.dataset.cap === key));
    };
    nodes.forEach((n) => n.addEventListener("click", () => select(n.dataset.cap)));
    select("product"); // default
  }

  /* ----------------------------------------------------------
     7. Copy email
     ---------------------------------------------------------- */
  $$("[data-copy-email]").forEach((btn) => {
    const email = btn.dataset.copyEmail;
    const label = $(".copy-label", btn);
    const original = label ? label.textContent : "";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        btn.classList.add("is-copied");
        if (label) label.textContent = "Copied to clipboard";
        setTimeout(() => {
          btn.classList.remove("is-copied");
          if (label) label.textContent = original;
        }, 2200);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  /* ----------------------------------------------------------
     8. Contact monogram — strokes draw themselves into view
     ---------------------------------------------------------- */
  const contactMark = $("#contact-mark");
  if (contactMark && !reduceMotion) {
    const paths = $$("path", contactMark);
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        paths.forEach((p, i) => {
          p.style.transitionDelay = `${i * 0.15}s`;
          p.style.strokeDashoffset = "0";
        });
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(contactMark);
  }

  /* ----------------------------------------------------------
     9. Footer year
     ---------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
