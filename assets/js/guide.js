/*
 * "From Fear to Freedom" guide sign-up (Resources page).
 *
 * TO START COLLECTING EMAILS: paste the Google Apps Script web app URL
 * (ends in /exec) below. Each sign-up is saved as a row in the sign-ups sheet
 * as { firstName, email, source }.
 * Until an endpoint is set, the form still works (it shows the download),
 * but email addresses are NOT saved anywhere.
 */
var GUIDE_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzuanCpYCrgSpm1Z90yyEGkZTK0oeQ1gPLcfaiQr_JdOrb0NW8RAd1RY4LTJDwWuJGm/exec';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('guide-form');
    if (!form) return;
    var done = document.getElementById('guide-done');
    var err = document.getElementById('guide-error');
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {
        firstName: form.elements.firstName.value.trim(),
        email: form.elements.email.value.trim(),
        source: 'From Fear to Freedom 7-Day Guide',
        website: form.elements.website ? form.elements.website.value : '',
        page: location.pathname
      };

      function success() {
        form.hidden = true;
        done.hidden = false;
        done.querySelector('a').focus();
      }

      if (!GUIDE_FORM_ENDPOINT) { success(); return; }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      fetch(GUIDE_FORM_ENDPOINT, {
        method: 'POST',
        // text/plain avoids a CORS preflight (Google Apps Script can't answer one)
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error);
        success();
      }).catch(function () {
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Send Me the Guide';
      });
    });
  });
})();
