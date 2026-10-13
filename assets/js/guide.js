/*
 * "From Fear to Freedom" guide sign-up (Resources page).
 *
 * TO START COLLECTING EMAILS: paste your form endpoint below — e.g. a Formspree
 * form URL (https://formspree.io/f/xxxxxxx) or another service that accepts a
 * JSON POST. Each sign-up is sent as { firstName, email, source }.
 * Until an endpoint is set, the form still works (it shows the download),
 * but email addresses are NOT saved anywhere.
 */
var GUIDE_FORM_ENDPOINT = '';

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
        source: 'From Fear to Freedom 7-Day Guide'
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        success();
      }).catch(function () {
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Send Me the Guide';
      });
    });
  });
})();
