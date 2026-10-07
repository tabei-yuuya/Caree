"use strict";

// SPハンバーガーメニュー
var toggle = document.querySelector(".header__toggle");
var nav = document.querySelector(".header__nav");
var setMenu = function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".visually-hidden").textContent = open ? "メニューを閉じる" : "メニューを開く";
  nav.classList.toggle("is-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", function () {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    return setMenu(false);
  });
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") setMenu(false);
});

// PC幅に戻ったらメニューを閉じる
window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
  if (e.matches) setMenu(false);
});

// ページトップへ
document.querySelector(".footer__pagetop").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});