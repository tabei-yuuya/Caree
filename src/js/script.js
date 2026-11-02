"use strict";

// SPハンバーガーメニュー
const toggle = document.querySelector(".header__toggle");
const nav = document.querySelector(".header__nav");

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".visually-hidden").textContent = open ? "メニューを閉じる" : "メニューを開く";
  nav.classList.toggle("is-open", open);
  document.querySelector(".header").classList.toggle("is-menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// PC幅に戻ったらメニューを閉じる
window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

// スクロールに合わせてヘッダーの背景とページトップボタンを切り替える
const header = document.querySelector(".header");
const pagetop = document.querySelector(".footer__pagetop");
const footerBottom = document.querySelector(".footer__bottom");

const updateOnScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 30);
  // ボタンのデザイン上の位置(フッター内)が画面に入ったら固定を解除する
  const docked = footerBottom.getBoundingClientRect().bottom <= window.innerHeight;
  pagetop.classList.toggle("is-floating", window.scrollY > 100 && !docked);
};

window.addEventListener("scroll", updateOnScroll, { passive: true });
window.addEventListener("resize", updateOnScroll);
updateOnScroll();

// ページトップへ
document.querySelector(".footer__pagetop").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// お問い合わせ:入力 → 確認 → 送信の間、入力内容をタブ内に一時保存する
// ※実際の送信処理は未実装(サーバー側の仕組みが別途必要)
const CONTACT_KEY = "contact";

const loadContact = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CONTACT_KEY));
  } catch (e) {
    return null;
  }
};

const contactForm = document.querySelector(".contact-form__form");

if (contactForm) {
  const saved = loadContact();

  if (saved) {
    Object.keys(saved).forEach((name) => {
      if (contactForm.elements[name]) contactForm.elements[name].value = saved[name];
    });
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(CONTACT_KEY, JSON.stringify(Object.fromEntries(new FormData(contactForm))));
    } catch (err) {
      return;
    }
    window.location.href = contactForm.getAttribute("action");
  });
}

const confirmFields = document.querySelectorAll("[data-confirm]");

if (confirmFields.length) {
  const saved = loadContact();

  if (saved) {
    confirmFields.forEach((field) => {
      field.textContent = saved[field.dataset.confirm] || "";
    });
  } else {
    // 入力せずに直接開いたときはフォームへ戻す
    window.location.replace("./contact.html");
  }

  document.querySelector(".confirm__send").addEventListener("click", () => {
    try {
      sessionStorage.removeItem(CONTACT_KEY);
    } catch (e) {
      // 保存できない環境では何もしない
    }
  });
}

// 数字のカウントアップ(画面に入ったら0から動かす)
const countUp = (el, target) => {
  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const numbers = document.querySelectorAll(".number__num");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (numbers.length && !reduceMotion && "IntersectionObserver" in window) {
  document.fonts.ready.then(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          countUp(entry.target, Number(entry.target.dataset.count));
        });
      },
      { threshold: 0.5 }
    );

    numbers.forEach((el) => {
      // 桁数が変わっても周りの配置が動かないよう、最終的な幅を固定する
      el.style.minWidth = `${el.offsetWidth}px`;
      el.style.textAlign = "center";
      el.dataset.count = el.textContent;
      el.textContent = "0";
      observer.observe(el);
    });
  });
}
