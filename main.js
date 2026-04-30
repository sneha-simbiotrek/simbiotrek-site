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

// HERO
function initHero() {
  const heroFrame = document.getElementById("heroFrame");
  const progressFill = document.getElementById("progressFill");

  const slideEls = [
    document.getElementById("slide0"),
    document.getElementById("slide1"),
  ];

  if (!heroFrame || !progressFill || !slideEls[0] || !slideEls[1]) return;

  const SLIDES = [
    "We help companies move faster with clarity defining priorities, redesigning operations, and building the systems growth depends on.",
    "We work with growing businesses to design their next stage of evolution from direction and experience to the systems that power it.",
  ];

  function buildSlide(el, text) {
    const p = el.querySelector("p");
    p.innerHTML = text
      .split(" ")
      .map((w, i) => `<span class="word" data-i="${i}">${w}</span>`)
      .join(" ");
    return p.querySelectorAll(".word");
  }

  const wordSets = [
    buildSlide(slideEls[0], SLIDES[0]),
    buildSlide(slideEls[1], SLIDES[1]),
  ];

  // Entrance animation
  const heroLogo = document.querySelector(".hero .logo");
  const heroHeadline = document.querySelector(".hero__headline");
  const heroCta = document.querySelector(".hero__cta");

  if (heroLogo && heroHeadline && heroCta) {
    gsap.set([heroLogo, heroHeadline, heroCta], { autoAlpha: 0, y: 22 });

    gsap
      .timeline({ delay: 0.15 })
      .to(heroLogo, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" })
      .to(
        heroHeadline,
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.4",
      )
      .to(
        heroCta,
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5",
      );
  }

  // Card expands while hero top scrolls normally
  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "+=100vh",
    scrub: true,
    onUpdate(self) {
      const p = self.progress;
      heroFrame.style.width = `${gsap.utils.interpolate(95, 100, p)}vw`;
      heroFrame.style.marginTop = `${gsap.utils.interpolate(16, 0, p)}px`;
      heroFrame.style.borderRadius = `${gsap.utils.interpolate(22, 0, p)}px`;
    },
  });

  // Sticky reveal text and single progress bar
  ScrollTrigger.create({
    trigger: "#revealSection",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate(self) {
      const p = self.progress;
      const idx = p < 0.5 ? 0 : 1;
      const localP = idx === 0 ? p / 0.5 : (p - 0.5) / 0.5;

      slideEls.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === idx);
      });

      progressFill.style.width = `${p * 100}%`;

      const revealP = Math.min(localP / 0.9, 1);
      const words = wordSets[idx];
      const litCount = Math.round(revealP * words.length);

      words.forEach((word, i) => {
        word.classList.toggle("lit", i < litCount);
      });

      if (idx === 1) {
        wordSets[0].forEach((word) => word.classList.add("lit"));
      }

      if (idx === 0 && localP < 0.05) {
        wordSets[1].forEach((word) => word.classList.remove("lit"));
      }
    },
  });
}

function initValueSection() {
  const valueSection = document.getElementById("valueSection");
  if (!valueSection) return;

  const valueLeft = valueSection.querySelector(".value-section__left");
  const valueLabel = valueSection.querySelector(".value-section__list-label");
  const valueItems = gsap.utils.toArray(".value-section__list li");
  const valueCenter = valueSection.querySelector(".value-section__center");
  const valueCards = valueSection.querySelector(".value-section__cards");

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
    .to(valueLabel, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: "power3.out",
    })
    .to(valueItems, {
      autoAlpha: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.11,
      ease: "power3.out",
    })
    .to(valueCenter, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    })
    .to(valueCards, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    });
}

// function initValueSection() {
//   const valueSection = document.getElementById("valueSection");
//   if (!valueSection) return;

//   const valueLeft = valueSection.querySelector(".value-section__left");
//   const valueLabel = valueSection.querySelector(".value-section__list-label");
//   const valueItems = gsap.utils.toArray(".value-section__list li");
//   const valueCenter = valueSection.querySelector(".value-section__center");

//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: valueSection,
//       start: "top 72%",
//       end: "bottom 58%",
//       toggleActions: "play none none reverse",
//     },
//   });

//   tl.to(valueLeft, {
//     autoAlpha: 1,
//     y: 0,
//     duration: 0.9,
//     ease: "power3.out",
//   })
//     .to(valueLabel, {
//       autoAlpha: 1,
//       y: 0,
//       duration: 0.55,
//       ease: "power3.out",
//     })
//     .to(valueItems, {
//       autoAlpha: 1,
//       x: 0,
//       duration: 0.7,
//       stagger: 0.11,
//       ease: "power3.out",
//     })
//     .to(valueCenter, {
//       autoAlpha: 1,
//       y: 0,
//       duration: 0.9,
//       ease: "power3.out",
//     });
// }

// // GROWTH CARDS
// function initGrowthCards() {
//   const growthCards = document.querySelectorAll(".growth-card");
//   if (!growthCards.length) return;

//   growthCards.forEach((card) => {
//     card.addEventListener("mouseenter", () => {
//       growthCards.forEach((item) => item.classList.remove("is-active"));
//       card.classList.add("is-active");
//     });

//     card.addEventListener("focusin", () => {
//       growthCards.forEach((item) => item.classList.remove("is-active"));
//       card.classList.add("is-active");
//     });
//   });
// }

// IMPACT
function initImpact() {
  const impactSection = document.getElementById("impactSection");
  if (!impactSection) return;

  const impactVerticalLine = document.querySelector(
    ".impact-grid__line--vertical",
  );
  const impactHorizontalLine = document.querySelector(
    ".impact-grid__line--horizontal",
  );
  const impactHeadings = gsap.utils.toArray(".impact-heading__item");
  const impactContents = gsap.utils.toArray(".impact-content__item");

  gsap.set(impactVerticalLine, {
    scaleX: 1,
    scaleY: 0,
    transformOrigin: "center",
  });
  gsap.set(impactHorizontalLine, {
    scaleX: 0,
    scaleY: 1,
    transformOrigin: "center",
  });
  gsap.set([...impactHeadings, ...impactContents], { autoAlpha: 0, y: 26 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: impactSection,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  tl.to(impactVerticalLine, { scaleY: 1, duration: 0.18, ease: "none" }, 0)
    .to(impactHorizontalLine, { scaleX: 1, duration: 0.18, ease: "none" }, 0)
    .to(
      [impactHeadings[0], impactContents[0]],
      { autoAlpha: 1, y: 0, duration: 0.12, ease: "none" },
      0.22,
    )
    .to({}, { duration: 0.24 })
    .to(
      [impactHeadings[0], impactContents[0]],
      { autoAlpha: 0, y: -24, duration: 0.12, ease: "none" },
      0.58,
    )
    .to(
      [impactHeadings[1], impactContents[1]],
      { autoAlpha: 1, y: 0, duration: 0.14, ease: "none" },
      0.72,
    );
}

// ACTUAL WORK
function initActualWork() {
  const actualWorkSection = document.getElementById("actualWorkSection");
  if (!actualWorkSection) return;

  const actualWorkTexts = gsap.utils.toArray(".actual-work__text");
  const actualWorkCard = document.querySelector(".actual-work__card");

  gsap.set(actualWorkTexts, { autoAlpha: 0, y: 120 });
  gsap.set(actualWorkCard, { autoAlpha: 0, y: "120%" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: actualWorkSection,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  actualWorkTexts.forEach((text, index) => {
    const start = index * 0.18;
    tl.to(text, { autoAlpha: 1, y: 0, duration: 0.12, ease: "none" }, start)
      .to(text, { y: -180, duration: 0.22, ease: "none" }, start + 0.12)
      .to(
        text,
        { autoAlpha: 0, y: -340, duration: 0.14, ease: "none" },
        start + 0.34,
      );
  });

  tl.to(
    actualWorkCard,
    { autoAlpha: 1, y: 0, duration: 0.22, ease: "none" },
    0.68,
  ).to(
    actualWorkCard,
    { y: 0, autoAlpha: 1, duration: 0.26, ease: "none" },
    0.9,
  );
}

// WHO THIS IS FOR
function initWho() {
  const whoSection = document.getElementById("whoSection");
  if (!whoSection) return;

  const whoIntro = whoSection.querySelector(".who-section__intro");
  const whoLabel = whoSection.querySelector(".who-section__list-label");
  const whoItems = gsap.utils.toArray(".who-section__list li");
  const whoMedia = whoSection.querySelector(".who-section__media");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: whoSection,
      start: "top 72%",
      end: "bottom 58%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(whoIntro, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" })
    .to(
      whoMedia,
      { autoAlpha: 1, y: 0, rotation: 0, duration: 1, ease: "power3.out" },
      "-=0.65",
    )
    .to(
      whoLabel,
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
      "-=0.35",
    )
    .to(
      whoItems,
      { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.11, ease: "power3.out" },
      "-=0.25",
    );
}

function initAllAnimations() {
  if (animationsInitialized) {
    console.warn("Animations already initialized");
    return;
  }

  initHero();
  // initGrowthCards();
  initValueSection();
  initImpact();
  initActualWork();
  initWho();

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
