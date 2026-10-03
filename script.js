/* ============================================================
   MIDNIGHT 1000
   Main Website + Registration + UPI
============================================================ */


/* ============================================================
   CENTRAL CONFIG
============================================================ */

const CONFIG = {

  eventName: "MIDNIGHT 1000",

  organizer: "AESTHETICS STUDIO",

  eventDate: "17 October 2026",

  eventTime: "9 PM – 1 AM",

  venue: "Raj Vilas Resort, Kawabandh, Gobindpur",

  age: 18,

  /*
   CURRENT PAYMENT PRICE

   This is intentionally LOCKED at ₹999 now.

   Displayed:
   First 50 = ₹999
   Later = ₹1,710

   When you actually want to switch the live payment
   amount to ₹1,710, change ONLY this value.
  */

  currentTicketPrice: 999,

  firstTicketPrice: 999,

  regularTicketPrice: 1710,

  upiId: "7082653911@ybl",

  payeeName: "AESTHETICS STUDIO",

  supportEmail: "support.aesthetics@gmail.com",

  supportWhatsApp: "+91 7082653911",

  /*
   AFTER DEPLOYING YOUR GOOGLE APPS SCRIPT,

   paste its /exec URL here.

   Example structure:

   https://script.google.com/macros/s/XXXXXXXX/exec

   Do not put the /dev URL here.
  */

  backendEndpoint: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE"

};


/* ============================================================
   DOM
============================================================ */

const body = document.body;

const pageLoader =
  document.getElementById("pageLoader");

const siteHeader =
  document.getElementById("siteHeader");

const explorePage =
  document.getElementById("explorePage");

const registrationModal =
  document.getElementById("registrationModal");

const registrationForm =
  document.getElementById("registrationForm");

const fullNameInput =
  document.getElementById("fullName");

const whatsappInput =
  document.getElementById("whatsappNumber");

const payButton =
  document.getElementById("payButton");

const paymentConfirm =
  document.getElementById("paymentConfirm");

const paymentReturn =
  document.getElementById("paymentReturn");

const completedPaymentButton =
  document.getElementById("completedPaymentButton");

const tryPaymentAgain =
  document.getElementById("tryPaymentAgain");

const mobileMenuButton =
  document.getElementById("mobileMenuButton");

const mobileMenu =
  document.getElementById("mobileMenu");

const currentPrice =
  document.getElementById("currentPrice");


/* ============================================================
   INITIAL PRICE
============================================================ */

function updateDisplayedPrice() {

  const formatted =
    `₹${CONFIG.currentTicketPrice.toLocaleString("en-IN")}`;

  if (currentPrice) {

    currentPrice.textContent = formatted;

  }

  if (payButton) {

    payButton.textContent =
      `Pay ${formatted}`;

  }

}


updateDisplayedPrice();


/* ============================================================
   PAGE LOADER
============================================================ */

window.addEventListener("load", () => {

  setTimeout(() => {

    pageLoader.classList.add("hidden");

  }, 500);

});


/* ============================================================
   HEADER SCROLL
============================================================ */

function updateHeader() {

  if (window.scrollY > 40) {

    siteHeader.classList.add("scrolled");

  } else {

    siteHeader.classList.remove("scrolled");

  }

}


window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* ============================================================
   MOBILE MENU
============================================================ */

mobileMenuButton.addEventListener("click", () => {

  const isOpen =
    mobileMenu.classList.toggle("active");

  mobileMenuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});


function closeMobileMenu() {

  mobileMenu.classList.remove("active");

  mobileMenuButton.setAttribute(
    "aria-expanded",
    "false"
  );

}


/* ============================================================
   HOME
============================================================ */

document
  .querySelectorAll("[data-scroll-home]")
  .forEach(button => {

    button.addEventListener("click", () => {

      closeMobileMenu();

      closeExplore();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  });


/* ============================================================
   EXPLORE PAGE
============================================================ */

function openExplore() {

  closeMobileMenu();

  explorePage.classList.add("active");

  explorePage.setAttribute(
    "aria-hidden",
    "false"
  );

  body.classList.add("explore-open");

  explorePage.scrollTo({
    top: 0,
    behavior: "instant"
  });

}


function closeExplore() {

  explorePage.classList.remove("active");

  explorePage.setAttribute(
    "aria-hidden",
    "true"
  );

  body.classList.remove("explore-open");

}


document
  .querySelectorAll("[data-explore]")
  .forEach(button => {

    button.addEventListener(
      "click",
      openExplore
    );

  });


document
  .querySelectorAll("[data-close-explore]")
  .forEach(button => {

    button.addEventListener(
      "click",
      closeExplore
    );

  });


/* ============================================================
   REGISTRATION MODAL
============================================================ */

function openRegistration() {

  closeMobileMenu();

  registrationModal.classList.add("active");

  registrationModal.setAttribute(
    "aria-hidden",
    "false"
  );

  body.classList.add("modal-open");

  /*
   Always start at registration state.
  */

  registrationForm.hidden = false;

  paymentConfirm.hidden = true;

  paymentReturn.hidden = true;

  setTimeout(() => {

    fullNameInput.focus();

  }, 200);

}


function closeRegistration() {

  registrationModal.classList.remove("active");

  registrationModal.setAttribute(
    "aria-hidden",
    "true"
  );

  body.classList.remove("modal-open");

}


document
  .querySelectorAll("[data-register]")
  .forEach(button => {

    button.addEventListener(
      "click",
      openRegistration
    );

  });


document
  .querySelectorAll("[data-close-modal]")
  .forEach(button => {

    button.addEventListener(
      "click",
      closeRegistration
    );

  });


/* ============================================================
   ESCAPE KEY
============================================================ */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {

      return;

    }

    closeRegistration();

    closeExplore();

  }
);


/* ============================================================
   NAME SANITIZATION
============================================================ */

function cleanName(value) {

  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

}


/* ============================================================
   WHATSAPP VALIDATION
============================================================ */

function cleanWhatsApp(value) {

  return value
    .replace(/\D/g, "")
    .slice(0, 10);

}


function isValidWhatsApp(value) {

  return /^[6-9]\d{9}$/.test(value);

}


whatsappInput.addEventListener(
  "input",
  () => {

    whatsappInput.value =
      cleanWhatsApp(
        whatsappInput.value
      );

  }
);


/* ============================================================
   REGISTRATION ID
============================================================ */

function createRegistrationId() {

  const timestamp =
    Date.now().toString(36).toUpperCase();

  const random =
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  return `MID-${timestamp}-${random}`;

}


/* ============================================================
   UPI URL
============================================================ */

function createUpiUrl() {

  const params =
    new URLSearchParams({

      pa: CONFIG.upiId,

      pn: CONFIG.payeeName,

      am:
        Number(CONFIG.currentTicketPrice)
          .toFixed(2),

      cu: "INR",

      tn: CONFIG.eventName

    });


  return `upi://pay?${params.toString()}`;

}


/* ============================================================
   SUBMIT REGISTRATION TO APPS SCRIPT
============================================================ */

/*
   We use a hidden HTML form + iframe instead of fetch.

   Why?

   It avoids browser CORS/preflight complications and allows
   Apps Script to receive a normal POST request.

   The user does not see the iframe.
*/


function submitRegistrationToBackend(
  registration
) {

  const endpoint =
    CONFIG.backendEndpoint;


  if (
    !endpoint ||
    endpoint.includes("PASTE_YOUR")
  ) {

    /*
     Backend not connected yet.

     Payment can still be tested.
    */

    console.warn(
      "Google Apps Script endpoint is not connected."
    );

    return false;

  }


  const hiddenForm =
    document.createElement("form");


  hiddenForm.method = "POST";

  hiddenForm.action = endpoint;

  hiddenForm.target = "registrationFrame";

  hiddenForm.style.display = "none";


  const fields = {

    registrationId:
      registration.registrationId,

    name:
      registration.name,

    whatsapp:
      registration.whatsapp,

    ticketPrice:
      registration.ticketPrice,

    eventName:
      registration.eventName,

    eventDate:
      registration.eventDate,

    eventTime:
      registration.eventTime,

    venue:
      registration.venue,

    timestamp:
      registration.timestamp,

    paymentStatus:
      registration.paymentStatus

  };


  Object.entries(fields)
    .forEach(([key, value]) => {

      const input =
        document.createElement("input");

      input.type = "hidden";

      input.name = key;

      input.value = value;

      hiddenForm.appendChild(input);

    });


  document.body.appendChild(hiddenForm);


  hiddenForm.submit();


  /*
   Remove after submission.
  */

  setTimeout(() => {

    hiddenForm.remove();

  }, 3000);


  return true;

}


/* ============================================================
   BUILD REGISTRATION OBJECT
============================================================ */

function buildRegistration() {

  return {

    registrationId:
      createRegistrationId(),

    name:
      cleanName(fullNameInput.value),

    whatsapp:
      cleanWhatsApp(whatsappInput.value),

    ticketPrice:
      CONFIG.currentTicketPrice,

    eventName:
      CONFIG.eventName,

    eventDate:
      CONFIG.eventDate,

    eventTime:
      CONFIG.eventTime,

    venue:
      CONFIG.venue,

    timestamp:
      new Date().toISOString(),

    paymentStatus:
      "PENDING VERIFICATION"

  };

}


/* ============================================================
   SAVE CURRENT REGISTRATION LOCALLY
============================================================ */

function saveRegistration(registration) {

  try {

    sessionStorage.setItem(
      "midnight1000_registration",
      JSON.stringify(registration)
    );

  } catch (error) {

    console.warn(
      "Session storage unavailable.",
      error
    );

  }

}


/* ============================================================
   OPEN UPI
============================================================ */

function openUpiPayment() {

  const upiUrl =
    createUpiUrl();


  /*
   Store the fact that we launched UPI.
  */

  try {

    sessionStorage.setItem(
      "midnight1000_upi_launched",
      "true"
    );

  } catch (error) {}


  /*
   Launch UPI.
  */

  window.location.href =
    upiUrl;


  /*
   The page may return if the UPI app
   returns control to the browser.
  */

  setTimeout(() => {

    showPaymentConfirm();

  }, 1500);

}


/* ============================================================
   SHOW PAYMENT CONFIRM
============================================================ */

function showPaymentConfirm() {

  registrationForm.hidden = true;

  paymentReturn.hidden = true;

  paymentConfirm.hidden = false;

}


/* ============================================================
   SHOW FINAL CONFIRMATION
============================================================ */

function showFinalConfirmation() {

  paymentConfirm.hidden = true;

  registrationForm.hidden = true;

  paymentReturn.hidden = false;

}


/* ============================================================
   MAIN FORM
============================================================ */

registrationForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      cleanName(fullNameInput.value);

    const whatsapp =
      cleanWhatsApp(whatsappInput.value);


    /*
     Name validation
    */

    if (name.length < 2) {

      fullNameInput.focus();

      return;

    }


    /*
     WhatsApp validation
    */

    if (!isValidWhatsApp(whatsapp)) {

      whatsappInput.focus();

      whatsappInput.setCustomValidity(
        "Enter a valid 10-digit WhatsApp number."
      );

      whatsappInput.reportValidity();

      return;

    }


    whatsappInput.setCustomValidity("");


    /*
     Build registration.
    */

    const registration =
      buildRegistration();


    /*
     Save registration locally.
    */

    saveRegistration(registration);


    /*
     Send registration to email backend.
    */

    submitRegistrationToBackend(
      registration
    );


    /*
     Prevent duplicate submission.
    */

    payButton.disabled = true;

    payButton.textContent =
      "Opening UPI…";


    /*
     Launch UPI.
    */

    setTimeout(() => {

      openUpiPayment();

    }, 250);

  }
);


/* ============================================================
   COMPLETED PAYMENT
============================================================ */

completedPaymentButton.addEventListener(
  "click",
  () => {

    showFinalConfirmation();

  }
);


/* ============================================================
   OPEN UPI AGAIN
============================================================ */

tryPaymentAgain.addEventListener(
  "click",
  () => {

    openUpiPayment();

  }
);


/* ============================================================
   DETECT RETURN FROM UPI
============================================================ */

window.addEventListener(
  "pageshow",
  () => {

    let launched = null;


    try {

      launched =
        sessionStorage.getItem(
          "midnight1000_upi_launched"
        );

    } catch (error) {}


    if (
      launched === "true" &&
      !registrationModal.classList.contains("active")
    ) {

      /*
       Do not automatically show a success state.

       The customer must open registration and
       confirm that they completed payment.
      */

    }

  }
);


/* ============================================================
   IMAGE FAILURE HANDLING
============================================================ */

/*
   External image hosts can occasionally fail.

   Instead of leaving broken-image icons, we replace the
   failed image with a premium visual fallback.

   This guarantees the layout remains intact.
*/


document
  .querySelectorAll(".image-safe")
  .forEach(image => {

    image.addEventListener(
      "error",
      () => {

        image.style.display = "none";

        const parent =
          image.parentElement;

        if (parent) {

          parent.classList.add(
            "image-fallback"
          );

        }

      },
      { once: true }
    );

  });


/* ============================================================
   INTERSECTION REVEALS
============================================================ */

const revealElements =
  document.querySelectorAll(
    ".story-section, .food-item, .venue-section, .info-block"
  );


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.style.opacity =
              "1";

            entry.target.style.transform =
              "translateY(0)";

            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.08
      }
    );


  revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(24px)";

    element.style.transition =
      "opacity .9s cubic-bezier(.22,.61,.36,1), transform .9s cubic-bezier(.22,.61,.36,1)";

    revealObserver.observe(element);

  });

}


/* ============================================================
   PREVENT ACCIDENTAL DOUBLE CLICK
============================================================ */

window.addEventListener(
  "beforeunload",
  () => {

    try {

      sessionStorage.removeItem(
        "midnight1000_upi_launched"
      );

    } catch (error) {}

  }
);
