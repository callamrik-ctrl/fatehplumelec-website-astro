const themeToggle = document.querySelector(".theme-toggle");
const themeStorageKey = "fateh_theme";

function setTheme(mode) {
  const dark = mode === "dark";
  document.body.classList.toggle("theme-dark", dark);
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
}

const savedTheme = localStorage.getItem(themeStorageKey);
setTheme(savedTheme === "dark" ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
  });
}

const newsletterModal = document.querySelector(".newsletter-modal");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterSuccess = document.querySelector(".newsletter-success");
const footerNewsletterForm = document.querySelector(".footer-newsletter-form");
const footerNewsletterSuccess = document.querySelector(".footer-newsletter-success");
const newsletterStorageKey = "fateh_newsletter_subscribers";
const newsletterNextShowKey = "fateh_newsletter_next_show";
const newsletterWaitDays = 30;

function scheduleNewsletterReminder() {
  const nextShow = Date.now() + newsletterWaitDays * 24 * 60 * 60 * 1000;
  localStorage.setItem(newsletterNextShowKey, String(nextShow));
}

function closeNewsletter() {
  if (!newsletterModal) return;
  newsletterModal.hidden = true;
  scheduleNewsletterReminder();
}

function shouldShowNewsletter() {
  const nextShow = Number(localStorage.getItem(newsletterNextShowKey) || "0");
  return Date.now() > nextShow;
}

if (newsletterModal && shouldShowNewsletter()) {
  window.setTimeout(() => {
    newsletterModal.hidden = false;
  }, 15000);
}

document.querySelectorAll("[data-newsletter-close]").forEach((button) => {
  button.addEventListener("click", closeNewsletter);
});

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(newsletterForm);
    const signup = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      consent: "Express consent for seasonal plumbing and electrical tips plus promotional emails under CASL wording shown on form.",
      submittedAt: new Date().toLocaleString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem(newsletterStorageKey) || "[]");
      localStorage.setItem(newsletterStorageKey, JSON.stringify([signup, ...existing].slice(0, 100)));
    } catch (error) {
      localStorage.setItem(newsletterStorageKey, JSON.stringify([signup]));
    }
    scheduleNewsletterReminder();
    if (newsletterSuccess) newsletterSuccess.hidden = false;
    window.setTimeout(() => {
      if (newsletterModal) newsletterModal.hidden = true;
    }, 1400);
  });
}

if (footerNewsletterForm) {
  footerNewsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(footerNewsletterForm);
    const signup = {
      name: "",
      email: String(data.get("email") || "").trim(),
      consent: "Footer signup consent for promotional emails under CASL wording shown on form.",
      submittedAt: new Date().toLocaleString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem(newsletterStorageKey) || "[]");
      localStorage.setItem(newsletterStorageKey, JSON.stringify([signup, ...existing].slice(0, 100)));
    } catch (error) {
      localStorage.setItem(newsletterStorageKey, JSON.stringify([signup]));
    }
    scheduleNewsletterReminder();
    if (footerNewsletterSuccess) footerNewsletterSuccess.hidden = false;
    footerNewsletterForm.reset();
  });
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".mega-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!window.matchMedia("(max-width: 980px)").matches) return;
    const wrap = trigger.closest(".mega-wrap");
    if (!wrap) return;
    const open = wrap.classList.toggle("mobile-open");
    trigger.setAttribute("aria-expanded", String(open));
  });
});

const form = document.querySelector(".contact-form");
const inquiryList = document.querySelector(".inquiry-list");
const storageKey = "fateh_quote_requests";

function getRequests() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch (error) {
    return [];
  }
}

function saveRequest(request) {
  const requests = [request, ...getRequests()].slice(0, 20);
  localStorage.setItem(storageKey, JSON.stringify(requests));
  renderRequests();
}

function renderRequests() {
  if (!inquiryList) return;
  const requests = getRequests();
  if (!requests.length) {
    inquiryList.innerHTML = "<p>No test quote requests saved yet.</p>";
    return;
  }
  inquiryList.innerHTML = requests.map((request) => (
    '<article class="inquiry-item">' +
      '<h3>' + request.service + '</h3>' +
      '<p><strong>Name:</strong> ' + request.name + '</p>' +
      '<p><strong>Phone:</strong> ' + request.phone + '</p>' +
      '<p><strong>Message:</strong> ' + request.message + '</p>' +
      '<p><strong>Submitted:</strong> ' + request.submittedAt + '</p>' +
    '</article>'
  )).join("");
}

renderRequests();

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const request = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      service: String(data.get("service") || "").trim(),
      message: String(data.get("message") || "").trim(),
      submittedAt: new Date().toLocaleString(),
    };
    saveRequest(request);
    const success = form.querySelector(".success-message");
    if (success) success.hidden = false;
    const subject = encodeURIComponent("Plumbing service request");
    const body = encodeURIComponent(
      "Name: " + request.name + "\n" +
      "Phone: " + request.phone + "\n" +
      "Service: " + request.service + "\n" +
      "Submitted: " + request.submittedAt + "\n\n" +
      request.message
    );
    window.location.href = "mailto:info@fatehplumelec.com?subject=" + subject + "&body=" + body;
  });
}

