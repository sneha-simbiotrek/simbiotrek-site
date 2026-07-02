gsap.registerPlugin(ScrollTrigger);

const raf2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

function safeSTRefresh() {
  if (!window.ScrollTrigger) return;
  raf2(() => {
    ScrollTrigger.update(true);
    ScrollTrigger.refresh(true);
  });
}

// Lenis
const lenis = new Lenis({
  lerp: 0.075,
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((t) => {
  lenis.raf(t * 1000);
});

gsap.ticker.lagSmoothing(0);

// Centralized initialization flag
let animationsInitialized = false;

// Refresh on normal load
window.addEventListener("load", () => {
  safeSTRefresh();
});

// Refresh when page is restored from bfcache
window.addEventListener("pageshow", () => {
  safeSTRefresh();
});

// Refresh after fonts load
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => safeSTRefresh());
}

// Refresh after images settle
(function refreshAfterImages() {
  const imgs = Array.from(document.images || []);
  const pending = imgs.filter((img) => !img.complete);

  if (!pending.length) {
    safeSTRefresh();
    return;
  }

  let done = 0;
  const onDone = () => {
    done += 1;
    if (done >= pending.length) safeSTRefresh();
  };

  pending.forEach((img) => {
    img.addEventListener("load", onDone, { once: true });
    img.addEventListener("error", onDone, { once: true });
  });
})();

function initValueSection() {
  const valueSection = document.getElementById("valueSection");
  if (!valueSection) return;

  const valueLeft = valueSection.querySelector(".value-section__left");
  const valueLabel = valueSection.querySelector(".value-section__list-label");
  const valueItems = gsap.utils.toArray(
    valueSection.querySelectorAll(".value-section__list li"),
  );
  const valueCenter = valueSection.querySelector(".value-section__center");

  gsap.set(valueLeft, {
    autoAlpha: 0,
    y: 34,
  });

  gsap.set(valueLabel, {
    autoAlpha: 0,
    y: 20,
  });

  gsap.set(valueItems, {
    autoAlpha: 0,
    x: 34,
  });

  gsap.set(valueCenter, {
    autoAlpha: 0,
    y: 34,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: valueSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(valueLeft, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  })
    .to(
      valueLabel,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      "-=0.35",
    )
    .to(
      valueItems,
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: "power3.out",
      },
      "-=0.2",
    )
    .to(
      valueCenter,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.15",
    );
}

// GROW PANEL
function initStage() {
  const panel = document.querySelector(".stage__panel");
  const rows = document.querySelectorAll(".stage__row");
  const topLine = document.querySelector(".stage__line-top");
  const bottomLines = document.querySelectorAll(".stage__line-bottom");

  if (!panel) return;

  gsap.fromTo(
    panel,
    { "--panelW": "70%", "--panelR": "20px" },
    {
      "--panelW": "100%",
      "--panelR": "0px",
      ease: "none",
      scrollTrigger: {
        trigger: ".stage",
        start: "top bottom",
        end: "top 35%",
        scrub: 1,
      },
    },
  );

  if (topLine) {
    const topLinePath = topLine.querySelector("path");

    if (topLinePath) {
      const lineLength = topLinePath.getTotalLength();

      gsap.fromTo(
        topLinePath,
        {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
        },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".stage",
            start: "top bottom",
            end: "top 35%",
            scrub: 1.5,
          },
        },
      );
    }
  }

  bottomLines.forEach((svgLine) => {
    const linePath = svgLine.querySelector("path");

    if (linePath) {
      const lineLength = linePath.getTotalLength();

      gsap.fromTo(
        linePath,
        {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
        },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: svgLine,
            start: "top 90%",
            end: "top 50%",
            scrub: 1.5,
          },
        },
      );
    }
  });

  rows.forEach((row) => {
    const number = row.querySelector(".stage__number");
    const title = row.querySelector(".stage__row-title");
    const subtitle = row.querySelector(".stage__row-subtitle");
    const text = row.querySelector(".stage__row-text");
    const points = row.querySelectorAll(".stage__point");

    const elementsToAnimate = [number, title, subtitle, text, ...points].filter(
      Boolean,
    );

    gsap.fromTo(
      elementsToAnimate,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          end: "top 45%",
          scrub: 1,
        },
      },
    );
  });
}

function initTrekSection() {
  const trekSection = document.getElementById("trekSection");
  if (!trekSection) return;

  const trekEyebrow = trekSection.querySelector(".trek-section__eyebrow");
  const trekHeading = trekSection.querySelector(".trek-section h2");
  const trekLine = trekSection.querySelector(".trek-section__line");
  const trekIntro = trekSection.querySelector(".trek-section__intro");
  const trekClosing = trekSection.querySelector(".trek-section__closing");
  const trekCards = gsap.utils.toArray(
    trekSection.querySelectorAll(".trek-card"),
  );

  gsap.set([trekEyebrow, trekHeading, trekLine, trekIntro, trekClosing], {
    autoAlpha: 0,
    y: 28,
  });

  gsap.set(trekCards, {
    autoAlpha: 0,
    y: 54,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trekSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(trekEyebrow, {
    autoAlpha: 1,
    y: 0,
    duration: 0.55,
    ease: "power3.out",
  })
    .to(
      trekHeading,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.3",
    )
    .to(
      trekLine,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.45",
    )
    .to(
      trekIntro,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.25",
    )
    .to(
      trekCards,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.14,
        ease: "power3.out",
      },
      "-=0.25",
    )
    .to(
      trekClosing,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.35",
    );
}

function initBuildSection() {
  const buildSection = document.getElementById("buildSection");
  if (!buildSection) return;

  const buildHeader = buildSection.querySelector(".build-section__header");
  const buildCards = gsap.utils.toArray(
    buildSection.querySelectorAll(".build-card"),
  );

  gsap.set(buildHeader, {
    autoAlpha: 0,
    y: 30,
  });

  gsap.set(buildCards, {
    autoAlpha: 0,
    y: 40,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: buildSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(buildHeader, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  }).to(
    buildCards,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    },
    "-=0.35",
  );
}

function initWhySection() {
  const whySection = document.getElementById("whySection");
  if (!whySection) return;

  const whyLeft = whySection.querySelector(".why-section__left");
  const whyCards = gsap.utils.toArray(whySection.querySelectorAll(".why-card"));

  gsap.set(whyLeft, {
    autoAlpha: 0,
    y: 34,
  });

  gsap.set(whyCards, {
    autoAlpha: 0,
    x: 44,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: whySection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(whyLeft, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  }).to(
    whyCards,
    {
      autoAlpha: 1,
      x: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: "power3.out",
    },
    "-=0.35",
  );
}

function initFitSection() {
  const fitSection = document.getElementById("fitSection");
  if (!fitSection) return;

  const fitLeft = fitSection.querySelector(".fit-section__left");
  const fitRight = fitSection.querySelector(".fit-section__right");
  const fitItems = gsap.utils.toArray(
    fitSection.querySelectorAll(".fit-section__list li"),
  );

  gsap.set([fitLeft, fitRight], {
    autoAlpha: 0,
    y: 34,
  });

  gsap.set(fitItems, {
    autoAlpha: 0,
    x: 34,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: fitSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(fitLeft, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  })
    .to(
      fitRight,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
      },
      "-=0.45",
    )
    .to(
      fitItems,
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.35",
    );
}

function initWorkSection() {
  const workSection = document.getElementById("workSection");
  if (!workSection) return;

  const workHeader = workSection.querySelector(".work-section__header");
  const workCards = gsap.utils.toArray(
    workSection.querySelectorAll(".work-card"),
  );

  gsap.set(workHeader, {
    autoAlpha: 0,
    y: 30,
  });

  gsap.set(workCards, {
    autoAlpha: 0,
    y: 40,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: workSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(workHeader, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  }).to(
    workCards,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    },
    "-=0.35",
  );
}

function initBehindSection() {
  const behindSection = document.getElementById("behindSection");
  if (!behindSection) return;

  const behindContent = behindSection.querySelector(".behind-section__content");
  const behindMedia = behindSection.querySelector(".behind-section__media");

  gsap.set([behindContent, behindMedia], {
    autoAlpha: 0,
    y: 34,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: behindSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(behindContent, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  }).to(
    behindMedia,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    },
    "-=0.45",
  );
}

function initCtaSection() {
  const ctaSection = document.getElementById("ctaSection");
  if (!ctaSection) return;

  const ctaCard = ctaSection.querySelector(".cta-section__card");

  gsap.set(ctaCard, {
    autoAlpha: 0,
    y: 44,
  });

  gsap.to(ctaCard, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ctaSection,
      start: "top 78%",
      toggleActions: "play none none reverse",
    },
  });
}

function initHeroWheel() {
  const wheel = document.querySelector("[data-hero-wheel]");

  if (!wheel) return;

  let rotation = 0;
  let targetSpeed = 0.08;
  let currentSpeed = 0.08;
  let lastPointerAngle = null;
  let isPointerInside = false;

  const getPointerAngle = (event) => {
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (
      (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
      Math.PI
    );
  };

  const normalizeDelta = (delta) => {
    if (delta > 180) return delta - 360;
    if (delta < -180) return delta + 360;

    return delta;
  };

  const render = () => {
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    rotation += currentSpeed;

    wheel.style.setProperty("--wheel-rotation", `${rotation}deg`);

    if (!isPointerInside) {
      targetSpeed = currentSpeed >= 0 ? 0.08 : -0.08;
    }

    requestAnimationFrame(render);
  };

  wheel.addEventListener("pointerenter", (event) => {
    isPointerInside = true;
    lastPointerAngle = getPointerAngle(event);
  });

  wheel.addEventListener("pointermove", (event) => {
    if (lastPointerAngle === null) {
      lastPointerAngle = getPointerAngle(event);
      return;
    }

    const currentPointerAngle = getPointerAngle(event);
    const delta = normalizeDelta(currentPointerAngle - lastPointerAngle);

    targetSpeed = delta * 0.22;
    lastPointerAngle = currentPointerAngle;
  });

  wheel.addEventListener("pointerleave", () => {
    isPointerInside = false;
    lastPointerAngle = null;
    targetSpeed = currentSpeed >= 0 ? 0.08 : -0.08;
  });

  render();
}

function initAllAnimations() {
  if (animationsInitialized) {
    console.warn("Animations already initialized");
    return;
  }

  initValueSection();
  initStage();
  initTrekSection();
  initBuildSection();
  initWhySection();
  initFitSection();
  initWorkSection();
  initBehindSection();
  initCtaSection();
  initHeroWheel();

  animationsInitialized = true;

  // Final refresh only after fonts AND all images are fully loaded
  const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const imgsReady = new Promise((resolve) => {
    const imgs = Array.from(document.images || []);
    const pending = imgs.filter((img) => !img.complete);
    if (!pending.length) return resolve();
    let done = 0;
    pending.forEach((img) => {
      const onDone = () => {
        done++;
        if (done >= pending.length) resolve();
      };
      img.addEventListener("load", onDone, { once: true });
      img.addEventListener("error", onDone, { once: true });
    });
  });
  Promise.all([fontReady, imgsReady]).then(() => safeSTRefresh());
}

// DOCUMENT READY
document.addEventListener("DOMContentLoaded", () => {
  initAllAnimations();
});
