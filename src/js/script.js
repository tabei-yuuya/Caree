"use strict";

// SPハンバーガーメニュー
const toggle = document.querySelector(".header__toggle");
const nav = document.querySelector(".header__nav");

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".visually-hidden").textContent = open ? "メニューを閉じる" : "メニューを開く";
  nav.classList.toggle("is-open", open);
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

// ページトップへ
document.querySelector(".footer__pagetop").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
