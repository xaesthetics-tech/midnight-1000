/* ============================================================
   MIDNIGHT 1000
   CENTRAL EVENT CONFIGURATION

   EDIT EVENT DETAILS HERE.
   Do not place passwords, private credentials or API keys here.

   IMPORTANT:
   - ticketPrice controls the current displayed ticket price everywhere.
   - upiId controls the UPI payment destination.
   - backendEndpoint is where your Google Apps Script Web App URL goes.
   - lanternStatus controls the public lantern wording.
   ============================================================ */

const CONFIG = {
    eventName: "MIDNIGHT 1000",
    organizer: "AESTHETICS STUDIO",

    date: "17 October 2026",
    time: "9 PM – 1 AM",
    lanternTime: "12 AM",

    venue: "Raj Vilas Resort, Kawabandh, Gobindpur, Dhanbad, Jharkhand",

    ticketPrice: 999,

    firstTicketPrice: 999,
    regularTicketPrice: 1710,

    age: 18,

    upiId: "7082653911@ybl",
    payeeName: "AESTHETICS STUDIO",

    supportWhatsApp: "+91 7082653911",
    supportEmail: "support.aesthetics@gmail.com",
    instagram: "_aesthetics_studio",

    mapsUrl: "https://maps.app.goo.gl/ytzYMg5rqccHP1Hi6",

    backendEndpoint: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL",

    lanternStatus: "PENDING_APPROVAL"
};


/* ============================================================
   INTERNAL STATE
   ============================================================ */

const state = {
    currentStep: 1,
    submitting: false,
    registration: null,
    lastFocusedElement: null
};


/* ============================================================
   DOM HELPERS
   ============================================================ */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector)
];

const bookingModal = $("#bookingModal");
const bookingForm = $("#bookingForm");
const bookingStepOne = $("#bookingStepOne");
const bookingStepTwo = $("#bookingStepTwo");
const bookingStepThree = $("#bookingStepThree");

const continueButton = $("#continueButton");
const upiButton = $("#upiButton");
const paymentDoneButton = $("#paymentDoneButton");
const closeSuccessButton = $("#closeSuccessButton");

const formError = $("#formError");
const paymentError = $("#paymentError");

const nameInput = $("#fullName");
const whatsappInput = $("#whatsapp");

const nameError = $("#nameError");
const whatsappError = $("#whatsappError");

const summaryName = $("#summaryName");
const summaryWhatsapp = $("#summaryWhatsapp");


/* ============================================================
   BASIC UTILITIES
   ============================================================ */

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}


function sanitizeText(value) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .trim();
}


function normalizeWhatsapp(value) {
    return String(value || "")
        .replace(/\D/g, "")
        .slice(0, 10);
}


function isValidName(name) {
    const cleanName = sanitizeText(name);

    if (cleanName.length < 2) {
        return false;
    }

    if (cleanName.length > 80) {
        return false;
    }

    return /^[A-Za-zÀ-ÖØ-öø-ÿ.'\-\s]+$/.test(cleanName);
}


function isValidWhatsapp(number) {
    return /^[6-9]\d{9}$/.test(normalizeWhatsapp(number));
}


function getTimestamp() {
    return new Date().toISOString();
}


function setText(selector, value) {
    $$(selector).forEach((element) => {
        element.textContent = value;
    });
}


/* ============================================================
   PRICE / EVENT CONTENT
   ============================================================ */

function updateAllPrices() {
    const price = formatCurrency(CONFIG.ticketPrice);

    setText(".js-price", price);

    const bookButtons = $$(".js-book-button");

    bookButtons.forEach((button) => {
        if (button.dataset.dynamicButton === "true") {
            return;
        }

        button.dataset.dynamicButton = "true";
    });
}


function updateDynamicContent() {
    updateAllPrices();

    updateHeroTagline();
    updateLanternStatus();
}


function updateHeroTagline() {
    const tagline = $(".js-hero-tagline");

    if (!tagline) {
        return;
    }

    if (CONFIG.lanternStatus === "CONFIRMED") {
        tagline.innerHTML = "ONE NIGHT.<br>ONE THOUSAND LIGHTS.";
    } else {
        tagline.innerHTML = "ONE NIGHT.<br>A MIDNIGHT LIGHT FINALE.";
    }
}


function updateLanternStatus() {
    const statusText = $("#lanternStatusText");
    const lanternCopy = $("#lanternCopy");

    if (!statusText || !lanternCopy) {
        return;
    }

    if (CONFIG.lanternStatus === "CONFIRMED") {
        statusText.textContent = "CONFIRMED · 12:00 AM";

        lanternCopy.innerHTML = `
            <strong>1,000 SKY LANTERNS</strong>
            <p>
                The midnight finale is scheduled for 12:00 AM.
            </p>
        `;
    } else {
        statusText.textContent = "PLANNED · SUBJECT TO APPROVAL";

        lanternCopy.innerHTML = `
            <strong>1,000 SKY LANTERNS</strong>
            <p>
                are planned for the midnight finale, subject to
                final safety and regulatory approval.
            </p>
        `;
    }
}


/* ============================================================
   PAGE LOADER
   ============================================================ */

function initializeLoader() {
    window.addEventListener("load", () => {
        window.setTimeout(() => {
            const loader = $(".page-loader");

            if (loader) {
                loader.classList.add("loaded");
            }
        }, 650);
    });
}


/* ============================================================
   HEADER
   ============================================================ */

function initializeHeader() {
    const header = $("#siteHeader");

    if (!header) {
        return;
    }

    const updateHeader = () => {
        if (window.scrollY > 35) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });
}


/* ============================================================
   MOBILE MENU
   ============================================================ */

function initializeMobileMenu() {
    const toggle = $(".menu-toggle");
    const menu = $("#mobileMenu");

    if (!toggle || !menu) {
        return;
    }

    const closeMenu = () => {
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
    };

    const openMenu = () => {
        toggle.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
        menu.classList.add("open");
        menu.setAttribute("aria-hidden", "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    $$(".mobile-links a", menu).forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    $$(".mobile-book-button", menu).forEach((button) => {
        button.addEventListener("click", () => {
            closeMenu();
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}


/* ============================================================
   SCROLL REVEALS
   ============================================================ */

function initializeRevealAnimations() {
    const elements = $$(".reveal");

    if (!elements.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observerInstance.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* ============================================================
   IMAGE REVEALS
   ============================================================ */

function initializeImageAnimations() {
    const images = $$(".image-reveal");

    if (!images.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.transition =
                    "clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1)";

                entry.target.style.clipPath = "inset(0 0 0 0)";

                observerInstance.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1
        }
    );

    images.forEach((image) => {
        image.style.clipPath = "inset(0 0 0 100%)";
        observer.observe(image);
    });
}


/* ============================================================
   MOBILE STICKY CTA
   ============================================================ */

function initializeMobileStickyCTA() {
    const sticky = $(".mobile-sticky-cta");

    if (!sticky) {
        return;
    }

    const mediaQuery = window.matchMedia("(max-width: 600px)");

    const updateSticky = () => {
        if (!mediaQuery.matches) {
            sticky.classList.remove("visible");
            return;
        }

        if (window.scrollY > window.innerHeight * 0.65) {
            sticky.classList.add("visible");
        } else {
            sticky.classList.remove("visible");
        }
    };

    updateSticky();

    window.addEventListener("scroll", updateSticky, {
        passive: true
    });

    window.addEventListener("resize", updateSticky);
}


/* ============================================================
   BOOKING MODAL
   ============================================================ */

function openBookingModal() {
    if (!bookingModal) {
        return;
    }

    state.lastFocusedElement = document.activeElement;
    state.currentStep = 1;

    resetBookingUI();

    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
        if (nameInput) {
            nameInput.focus();
        }
    }, 300);
}


function closeBookingModal() {
    if (!bookingModal) {
        return;
    }

    bookingModal.classList.remove("open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (
        state.lastFocusedElement &&
        typeof state.lastFocusedElement.focus === "function"
    ) {
        state.lastFocusedElement.focus();
    }
}


function resetBookingUI() {
    showBookingStep(1);

    clearFieldErrors();

    if (formError) {
        formError.classList.remove("visible");
        formError.textContent = "";
    }

    if (paymentError) {
        paymentError.classList.remove("visible");
        paymentError.textContent = "";
    }

    if (bookingForm) {
        bookingForm.reset();
    }

    state.registration = null;
    state.submitting = false;

    if (continueButton) {
        continueButton.disabled = false;
        continueButton.innerHTML = `
            CONTINUE TO PAYMENT — <span class="js-price">${formatCurrency(CONFIG.ticketPrice)}</span>
            <span>↗</span>
        `;
    }

    updateAllPrices();
}


function showBookingStep(step) {
    state.currentStep = step;

    [bookingStepOne, bookingStepTwo, bookingStepThree].forEach(
        (element) => {
            if (element) {
                element.classList.remove("active");
            }
        }
    );

    const target = {
        1: bookingStepOne,
        2: bookingStepTwo,
        3: bookingStepThree
    }[step];

    if (target) {
        target.classList.add("active");
    }
}


/* ============================================================
   BOOK BUTTONS
   ============================================================ */

function initializeBookButtons() {
    $$(".js-book-button").forEach((button) => {
        button.addEventListener("click", openBookingModal);
    });

    $$("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", closeBookingModal);
    });

    if (closeSuccessButton) {
        closeSuccessButton.addEventListener("click", closeBookingModal);
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            bookingModal &&
            bookingModal.classList.contains("open")
        ) {
            closeBookingModal();
        }
    });
}


/* ============================================================
   FORM VALIDATION
   ============================================================ */

function clearFieldErrors() {
    if (nameError) {
        nameError.textContent = "";
    }

    if (whatsappError) {
        whatsappError.textContent = "";
    }

    if (nameInput) {
        nameInput.classList.remove("invalid");
    }

    if (whatsappInput) {
        whatsappInput.classList.remove("invalid");
    }
}


function validateForm() {
    clearFieldErrors();

    let valid = true;

    const name = sanitizeText(nameInput ? nameInput.value : "");
    const whatsapp = normalizeWhatsapp(
        whatsappInput ? whatsappInput.value : ""
    );

    if (!isValidName(name)) {
        valid = false;

        if (nameInput) {
            nameInput.classList.add("invalid");
        }

        if (nameError) {
            nameError.textContent =
                "Please enter your full name.";
        }
    }

    if (!isValidWhatsapp(whatsapp)) {
        valid = false;

        if (whatsappInput) {
            whatsappInput.classList.add("invalid");
        }

        if (whatsappError) {
            whatsappError.textContent =
                "Enter a valid 10-digit WhatsApp number.";
        }
    }

    return {
        valid,
        name,
        whatsapp
    };
}


/* ============================================================
   BACKEND CONFIGURATION
   ============================================================ */

function isBackendConfigured() {
    const endpoint = String(CONFIG.backendEndpoint || "").trim();

    return (
        endpoint &&
        endpoint !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" &&
        /^https:\/\//i.test(endpoint)
    );
}


/* ============================================================
   BACKEND SUBMISSION
   ============================================================ */

async function submitRegistration(registration) {

    if (!isBackendConfigured()) {
        console.warn(
            "[MIDNIGHT 1000] Google Apps Script backend is not configured. " +
            "Set CONFIG.backendEndpoint in script.js before accepting registrations."
        );

        throw new Error("BACKEND_NOT_CONFIGURED");
    }

    const payload = {
        name: registration.name,
        whatsapp: registration.whatsapp,
        ticketPrice: CONFIG.ticketPrice,
        eventName: CONFIG.eventName,
        eventDate: CONFIG.date,
        eventTime: CONFIG.time,
        venue: CONFIG.venue,
        timestamp: registration.timestamp,
        paymentStatus: "PENDING VERIFICATION"
    };

    let response;

    try {
        response = await fetch(CONFIG.backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("[MIDNIGHT 1000] Network error:", error);
        throw new Error("NETWORK_ERROR");
    }

    if (!response.ok) {
        console.error(
            "[MIDNIGHT 1000] Backend returned HTTP status:",
            response.status
        );

        throw new Error("BACKEND_ERROR");
    }

    let result = null;

    try {
        result = await response.json();
    } catch (error) {
        /*
         * Some Google Apps Script deployments may return a response
         * that cannot be parsed consistently depending on deployment
         * configuration.
         *
         * The HTTP success itself is enough for this frontend to move
         * forward because payment is independently verified manually.
         */
        result = {
            success: true
        };
    }

    if (
        result &&
        Object.prototype.hasOwnProperty.call(result, "success") &&
        result.success === false
    ) {
        throw new Error("BACKEND_REJECTED");
    }

    return result;
}


/* ============================================================
   FORM SUBMISSION
   ============================================================ */

async function handleBookingSubmit(event) {
    event.preventDefault();

    if (state.submitting) {
        return;
    }

    const validation = validateForm();

    if (!validation.valid) {
        return;
    }

    if (!isBackendConfigured()) {
        showFormError(
            "Registration is temporarily unavailable. The event team has not connected the registration system yet."
        );

        console.warn(
            "[MIDNIGHT 1000] CONFIG.backendEndpoint is still using the placeholder."
        );

        return;
    }

    state.submitting = true;

    setSubmitLoading(true);

    const registration = {
        name: validation.name,
        whatsapp: validation.whatsapp,
        timestamp: getTimestamp()
    };

    try {
        await submitRegistration(registration);

        state.registration = registration;

        summaryName.textContent = registration.name;
        summaryWhatsapp.textContent = `+91 ${registration.whatsapp}`;

        showBookingStep(2);

    } catch (error) {
        console.error("[MIDNIGHT 1000] Registration submission failed:", error);

        let message =
            "We couldn't record your registration right now. Please check your connection and try again.";

        if (error.message === "BACKEND_NOT_CONFIGURED") {
            message =
                "Registration is not available yet because the event backend has not been connected.";
        }

        if (error.message === "NETWORK_ERROR") {
            message =
                "We couldn't reach the registration system. Please check your internet connection and try again.";
        }

        showFormError(message);

    } finally {
        state.submitting = false;
        setSubmitLoading(false);
    }
}


function setSubmitLoading(isLoading) {
    if (!continueButton) {
        return;
    }

    continueButton.disabled = isLoading;

    if (isLoading) {
        continueButton.innerHTML = `
            <span class="button-loading-dot"></span>
            RECORDING REGISTRATION…
        `;
    } else {
        continueButton.innerHTML = `
            CONTINUE TO PAYMENT — <span class="js-price">${formatCurrency(CONFIG.ticketPrice)}</span>
            <span>↗</span>
        `;
    }
}


function showFormError(message) {
    if (!formError) {
        return;
    }

    formError.textContent = message;
    formError.classList.add("visible");
}


/* ============================================================
   UPI
   ============================================================ */

function buildUpiUrl() {
    const params = new URLSearchParams({
        pa: CONFIG.upiId,
        pn: CONFIG.payeeName,
        am: String(CONFIG.ticketPrice),
        cu: "INR"
    });

    return `upi://pay?${params.toString()}`;
}


function openUpiPayment() {
    if (!state.registration) {
        showPaymentError(
            "Please complete the registration details first."
        );

        return;
    }

    if (!CONFIG.upiId) {
        showPaymentError(
            "UPI payment is temporarily unavailable."
        );

        return;
    }

    const upiUrl = buildUpiUrl();

    let opened = false;

    try {
        window.location.href = upiUrl;
        opened = true;
    } catch (error) {
        console.error("[MIDNIGHT 1000] UPI launch failed:", error);
    }

    if (!opened) {
        showPaymentError(
            "We couldn't open a UPI application. Please try again from a mobile device with a compatible UPI app."
        );
    }
}


function showPaymentError(message) {
    if (!paymentError) {
        return;
    }

    paymentError.textContent = message;
    paymentError.classList.add("visible");
}


/* ============================================================
   PAYMENT COMPLETED BUTTON
   ============================================================ */

function handlePaymentDone() {
    if (!state.registration) {
        showPaymentError(
            "Registration details could not be found. Please restart the booking process."
        );

        return;
    }

    /*
     * IMPORTANT:
     * This DOES NOT verify payment.
     *
     * It only records the user's declaration that they have
     * completed the UPI step and moves the UI to the
     * manual-verification state.
     */

    showBookingStep(3);
}


/* ============================================================
   INPUT FORMATTING
   ============================================================ */

function initializeInputs() {
    if (!whatsappInput) {
        return;
    }

    whatsappInput.addEventListener("input", () => {
        whatsappInput.value = normalizeWhatsapp(
            whatsappInput.value
        );
    });

    whatsappInput.addEventListener("blur", () => {
        if (
            whatsappInput.value &&
            !isValidWhatsapp(whatsappInput.value)
        ) {
            whatsappInput.classList.add("invalid");

            if (whatsappError) {
                whatsappError.textContent =
                    "Enter a valid 10-digit WhatsApp number.";
            }
        }
    });

    if (nameInput) {
        nameInput.addEventListener("input", () => {
            nameInput.classList.remove("invalid");

            if (nameError) {
                nameError.textContent = "";
            }
        });
    }

    whatsappInput.addEventListener("input", () => {
        whatsappInput.classList.remove("invalid");

        if (whatsappError) {
            whatsappError.textContent = "";
        }
    });
}


/* ============================================================
   SMOOTH ANCHOR LINKS
   ============================================================ */

function initializeSmoothLinks() {
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });
        });
    });
}


/* ============================================================
   ACCESSIBILITY — FOCUS TRAP
   ============================================================ */

function initializeFocusTrap() {
    if (!bookingModal) {
        return;
    }

    bookingModal.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") {
            return;
        }

        if (!bookingModal.classList.contains("open")) {
            return;
        }

        const focusable = $$(
            'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
            bookingModal
        ).filter((element) => {
            return element.offsetParent !== null;
        });

        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    });
}


/* ============================================================
   PERFORMANCE — PRECONNECT / IMAGE SAFETY
   ============================================================ */

function initializeImageFallbacks() {
    $$("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("image-load-error");
        });
    });
}


/* ============================================================
   GLOBAL EVENT LISTENERS
   ============================================================ */

function initializeBooking() {
    if (bookingForm) {
        bookingForm.addEventListener(
            "submit",
            handleBookingSubmit
        );
    }

    if (upiButton) {
        upiButton.addEventListener(
            "click",
            openUpiPayment
        );
    }

    if (paymentDoneButton) {
        paymentDoneButton.addEventListener(
            "click",
            handlePaymentDone
        );
    }
}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initialize() {
    updateDynamicContent();

    initializeLoader();
    initializeHeader();
    initializeMobileMenu();
    initializeRevealAnimations();
    initializeImageAnimations();
    initializeMobileStickyCTA();
    initializeBookButtons();
    initializeInputs();
    initializeSmoothLinks();
    initializeFocusTrap();
    initializeImageFallbacks();
    initializeBooking();

    /*
     * Developer-friendly configuration warning.
     * This is intentionally only logged to the console and is
     * never exposed as a raw technical error to attendees.
     */
    if (!isBackendConfigured()) {
        console.info(
            "%cMIDNIGHT 1000%c\n" +
            "Google Apps Script backend is not configured yet.\n" +
            "Set CONFIG.backendEndpoint in script.js before accepting registrations.",
            "font-weight:bold;font-size:16px;",
            "font-size:12px;"
        );
    }

    console.info(
        `[MIDNIGHT 1000] Current ticket price: ${formatCurrency(CONFIG.ticketPrice)}`
    );

    console.info(
        `[MIDNIGHT 1000] Lantern status: ${CONFIG.lanternStatus}`
    );
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
