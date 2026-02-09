(() => {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = "© " + new Date().getFullYear();

  // Smooth scroll (kept, but safe)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Starfield
  const c = document.getElementById("stars");
  if (!c) return;

  const ctx = c.getContext("2d", { alpha: false });
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  let w = 0, h = 0, stars = [];
  let rafId = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  const makeStar = (randomPos = false) => {
    const z = rand(0.2, 1);
    return {
      x: randomPos ? rand(0, w) : w + 80,
      y: randomPos ? rand(0, h) : rand(0, h),
      r: rand(0.6, 2.2) * z,
      z,
      tw: rand(0, Math.PI * 2),
      sp: rand(0.08, 0.35) * (1.4 - z),
    };
  };

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;

    c.width = Math.floor(w * DPR);
    c.height = Math.floor(h * DPR);
    c.style.width = w + "px";
    c.style.height = h + "px";

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const count = Math.floor((w * h) / 12000);
    stars = Array.from({ length: count }, () => makeStar(true));
  };

  const draw = () => {
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      s.tw += 0.02;
      s.x -= s.sp;

      if (s.x < -80) Object.assign(s, makeStar(false));

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.18 + 0.75 * s.z})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  };

  // Pause animation when tab is hidden (best practice)
  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVis);

  resize();
  draw();
})();
