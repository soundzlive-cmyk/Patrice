/*
 * Contact page form. Sends each message to the same Google Apps Script web app
 * as the sign-up forms; it's saved to the "Contact messages" tab of the sheet
 * and emailed to contact@patriceambroise.com (reply goes straight to the sender).
 */
var CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzuanCpYCrgSpm1Z90yyEGkZTK0oeQ1gPLcfaiQr_JdOrb0NW8RAd1RY4LTJDwWuJGm/exec';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var done = document.getElementById('contact-done');
    var err = document.getElementById('contact-error');
    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      // text/plain avoids a CORS preflight (Google Apps Script can't answer one)
      fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'contact',
          name: form.elements.name.value.trim(),
          email: form.elements.email.value.trim(),
          subject: form.elements.subject.value,
          message: form.elements.message.value.trim(),
          website: form.elements.website ? form.elements.website.value : '',
          page: location.pathname
        })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error);
        form.hidden = true;
        done.hidden = false;
        done.focus();
      }).catch(function () {
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  });
})();
