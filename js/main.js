const billingOptions = document.querySelectorAll("[data-billing]");
const prices = document.querySelectorAll(".pricing-card__price strong[data-monthly]");
const billingNotes = document.querySelectorAll(".pricing-card__billing-note");

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const period = option.dataset.billing;

    billingOptions.forEach((button) => {
      const isActive = button === option;
      button.classList.toggle("billing-toggle__option--active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    prices.forEach((price) => {
      price.textContent = price.dataset[period];
    });

    billingNotes.forEach((note) => {
      note.textContent = period === "yearly" ? "Billed yearly" : "Billed monthly";
    });
  });
});

document.querySelectorAll(".faq-item__question").forEach((question) => {
  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(question.getAttribute("aria-controls"));

    question.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const signupForm = document.querySelector(".signup-form");
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const firstName = formData.get("name").trim().split(/\s+/)[0];
  signupForm.querySelector(".signup-form__status").textContent =
    `Thanks, ${firstName}! This demo form isn't connected to a signup service yet.`;
});

const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.nextElementSibling.textContent =
    "Thanks for your interest! Newsletter sign-up isn't connected yet.";
  newsletterForm.reset();
});
