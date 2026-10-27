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

function initSignupForm() {
  const form = document.querySelector("#signup-form");
  const status = document.querySelector("#form-message");
  const fields = {
    name: {
      input: form.elements.name,
      error: document.querySelector("#name-error"),
      validate: (input) => input.value.trim().length >= 2 ? "" : "Please enter a name with at least 2 characters."
    },
    email: {
      input: form.elements.email,
      error: document.querySelector("#email-error"),
      validate: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? "" : "Please enter a valid email address."
    },
    plan: {
      input: form.elements.plan,
      error: document.querySelector("#plan-error"),
      validate: (input) => input.value ? "" : "Please choose a plan."
    },
    terms: {
      input: form.elements.terms,
      error: document.querySelector("#terms-error"),
      validate: (input) => input.checked ? "" : "Please agree to the terms to continue."
    }
  };
  let hasSubmitted = false;

  function setFieldError(field, message) {
    field.error.textContent = message;
    field.error.classList.toggle("is-visible", Boolean(message));
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function validateField(field) {
    const error = field.validate(field.input);
    setFieldError(field, error);
    return !error;
  }

  Object.values(fields).forEach((field) => {
    const eventName = field.input.type === "checkbox" || field.input.tagName === "SELECT" ? "change" : "input";
    field.input.addEventListener(eventName, () => {
      status.textContent = "";
      if (hasSubmitted) validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hasSubmitted = true;
    status.textContent = "";

    const isValid = Object.values(fields).map(validateField).every(Boolean);
    if (!isValid) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const name = fields.name.input.value.trim();
    const email = fields.email.input.value.trim();
    let signups;

    try {
      const savedSignups = localStorage.getItem("signups");
      signups = savedSignups === null ? [] : JSON.parse(savedSignups);
      if (!Array.isArray(signups)) throw new TypeError("Saved sign-ups are not an array.");
    } catch (error) {
      console.error("Could not read Oteri sign-ups from localStorage.", error);
      status.textContent = "We couldn’t check sign-ups just now. Please try again.";
      return;
    }

    if (signups.some((signup) => signup && typeof signup.email === "string" && signup.email.toLowerCase() === email.toLowerCase())) {
      setFieldError(fields.email, "You've already signed up");
      status.textContent = "You've already signed up";
      fields.email.input.focus();
      return;
    }

    signups.push({
      name,
      email,
      plan: fields.plan.input.value,
      createdAt: new Date().toISOString()
    });

    try {
      localStorage.setItem("signups", JSON.stringify(signups));
    } catch (error) {
      console.error("Could not save Oteri sign-up to localStorage.", error);
      status.textContent = "We couldn’t save your sign-up just now. Please try again.";
      return;
    }

    form.reset();
    hasSubmitted = false;
    Object.values(fields).forEach((field) => setFieldError(field, ""));
    status.textContent = `Thanks, ${name}! You’re signed up. We can’t wait to see you.`;
  });
}

initSignupForm();

document.querySelector("#current-year").textContent = new Date().getFullYear();