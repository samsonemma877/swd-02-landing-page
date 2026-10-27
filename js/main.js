"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  });
});

document.querySelectorAll(".billing-option").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".billing-option").forEach((button) => {
      const selected = button === option;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    const period = option.dataset.period;
    document.querySelectorAll(".price-amount").forEach((price) => {
      price.textContent = `$${price.dataset[period]}`;
    });

    document.querySelectorAll('#plan option[value]:not([value=""])').forEach((planOption) => {
      const plan = document.querySelector(`.plan-card[data-plan="${planOption.value}"]`);
      const price = plan.querySelector(".price-amount").dataset[period];
      const billing = period === "yearly" ? " / month, billed yearly" : " / month";
      planOption.textContent = `${plan.querySelector("h3").textContent} — $${price}${billing}`;
    });

    document.querySelectorAll(".plan-price > span:last-child").forEach((suffix) => {
      suffix.textContent = period === "yearly" ? "/ month, billed yearly" : "/ month";
    });
  });
});

document.querySelectorAll(".plan-card .button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#plan").value = button.closest(".plan-card").dataset.plan;
  });
});

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const expanded = question.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(question.getAttribute("aria-controls"));
    question.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
  });
});

document.querySelector("#signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name").trim();
  const message = document.querySelector("#form-message");
  message.textContent = `Thanks, ${name}! We’d love to see you at Oteri. See you soon.`;
  form.reset();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();