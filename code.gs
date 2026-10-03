/* ============================================================
   MIDNIGHT 1000
   EMAIL-ONLY REGISTRATION BACKEND

   No Google Sheets.
   No database.
   Registration is emailed directly to:

   support.aesthetics@gmail.com
============================================================ */


const CONFIG = {

  recipientEmail:
    "support.aesthetics@gmail.com",

  eventName:
    "MIDNIGHT 1000",

  organizer:
    "AESTHETICS STUDIO"

};


/* ============================================================
   GET
============================================================ */

function doGet() {

  return ContentService
    .createTextOutput(
      JSON.stringify({
        ok: true,
        service: "MIDNIGHT 1000 Registration",
        status: "online"
      })
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}


/* ============================================================
   POST
============================================================ */

function doPost(e) {

  try {

    const data =
      readRequestData_(e);


    /*
     Validate required fields.
    */

    if (
      !data.name ||
      !data.whatsapp ||
      !data.registrationId
    ) {

      return jsonResponse_({
        ok: false,
        message: "Missing required registration data."
      });

    }


    /*
     Sanitize values.
    */

    const name =
      sanitize_(data.name);

    const whatsapp =
      sanitize_(data.whatsapp);

    const registrationId =
      sanitize_(data.registrationId);

    const ticketPrice =
      sanitize_(data.ticketPrice);

    const eventName =
      sanitize_(data.eventName);

    const eventDate =
      sanitize_(data.eventDate);

    const eventTime =
      sanitize_(data.eventTime);

    const venue =
      sanitize_(data.venue);

    const timestamp =
      sanitize_(data.timestamp);

    const paymentStatus =
      sanitize_(data.paymentStatus);


    /*
     Email subject.
    */

    const subject =
      "NEW MIDNIGHT 1000 REGISTRATION — " +
      name;


    /*
     Plain text version.
    */

    const plainBody =

`NEW MIDNIGHT 1000 REGISTRATION

Registration ID:
${registrationId}

Name:
${name}

WhatsApp:
${whatsapp}

Ticket Price:
₹${ticketPrice}

Event:
${eventName}

Date:
${eventDate}

Time:
${eventTime}

Venue:
${venue}

Registration Time:
${timestamp}

Payment Status:
${paymentStatus}

IMPORTANT:
Payment must be manually verified from the UPI transaction history.

After verification:
1. Add attendee to the official WhatsApp group.
2. Send the event ticket to the registered WhatsApp number.
`;


    /*
     HTML email.
    */

    const htmlBody = `

      <!DOCTYPE html>

      <html>

      <body
        style="
          margin:0;
          padding:30px;
          background:#eee9df;
          font-family:Arial,Helvetica,sans-serif;
          color:#171614;
        "
      >

        <div
          style="
            max-width:620px;
            margin:auto;
            background:#ffffff;
            padding:40px;
          "
        >

          <div
            style="
              font-size:11px;
              letter-spacing:3px;
              color:#9b754b;
              margin-bottom:16px;
            "
          >
            AESTHETICS STUDIO
          </div>


          <h1
            style="
              margin:0 0 30px;
              font-family:Georgia,serif;
              font-size:42px;
              font-weight:400;
              line-height:1;
            "
          >
            NEW MIDNIGHT<br>
            1000 REGISTRATION
          </h1>


          <table
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="
              border-collapse:collapse;
              font-size:14px;
            "
          >

            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Registration ID
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(registrationId)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Name
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(name)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                WhatsApp
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(whatsapp)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Ticket
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ₹${escapeHtml_(ticketPrice)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Event
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(eventName)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Date
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(eventDate)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Time
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(eventTime)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  color:#777;
                "
              >
                Registered
              </td>

              <td
                style="
                  padding:14px 0;
                  border-bottom:1px solid #ddd;
                  font-weight:bold;
                "
              >
                ${escapeHtml_(timestamp)}
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:14px 0;
                  color:#777;
                "
              >
                Payment
              </td>

              <td
                style="
                  padding:14px 0;
                  font-weight:bold;
                  color:#9b754b;
                "
              >
                ${escapeHtml_(paymentStatus)}
              </td>
            </tr>

          </table>


          <div
            style="
              margin-top:30px;
              padding:20px;
              background:#f3efe7;
              font-size:13px;
              line-height:1.7;
            "
          >

            <strong>
              MANUAL VERIFICATION REQUIRED
            </strong>

            <br><br>

            Check the UPI transaction history before confirming
            the attendee.

          </div>

        </div>

      </body>

      </html>

    `;


    /*
     Send email.

     MailApp is used because this is an email-only backend.
    */

    MailApp.sendEmail({

      to:
        CONFIG.recipientEmail,

      subject:
        subject,

      body:
        plainBody,

      htmlBody:
        htmlBody,

      name:
        CONFIG.organizer

    });


    /*
     Return success.
    */

    return jsonResponse_({

      ok: true,

      registrationId:
        registrationId

    });


  } catch (error) {

    console.error(error);


    return jsonResponse_({

      ok: false,

      message:
        "Registration email could not be sent."

    });

  }

}


/* ============================================================
   READ REQUEST
============================================================ */

function readRequestData_(e) {

  if (
    e &&
    e.parameter
  ) {

    return {

      registrationId:
        e.parameter.registrationId || "",

      name:
        e.parameter.name || "",

      whatsapp:
        e.parameter.whatsapp || "",

      ticketPrice:
        e.parameter.ticketPrice || "",

      eventName:
        e.parameter.eventName || "",

      eventDate:
        e.parameter.eventDate || "",

      eventTime:
        e.parameter.eventTime || "",

      venue:
        e.parameter.venue || "",

      timestamp:
        e.parameter.timestamp || "",

      paymentStatus:
        e.parameter.paymentStatus || ""

    };

  }


  /*
   Also support JSON POST requests.
  */

  if (
    e &&
    e.postData &&
    e.postData.contents
  ) {

    try {

      return JSON.parse(
        e.postData.contents
      );

    } catch (error) {

      return {};

    }

  }


  return {};

}


/* ============================================================
   SANITIZE
============================================================ */

function sanitize_(value) {

  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 1000);

}


/* ============================================================
   HTML ESCAPE
============================================================ */

function escapeHtml_(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ============================================================
   JSON RESPONSE
============================================================ */

function jsonResponse_(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}
