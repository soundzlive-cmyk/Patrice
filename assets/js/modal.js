var SEEN_COOKIE = 'pa_modal_seen';

/*
 * "Get Your Copy" / "Notify Me" email sign-up in the modal.
 * TO START COLLECTING EMAILS: paste a form endpoint below (e.g. a Formspree URL
 * https://formspree.io/f/xxxxxxx). Each sign-up is POSTed as JSON { email, source }.
 * Until it's set, the form still validates and shows the thank-you message,
 * but addresses are NOT saved anywhere.
 */
var NOTIFY_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzuanCpYCrgSpm1Z90yyEGkZTK0oeQ1gPLcfaiQr_JdOrb0NW8RAd1RY4LTJDwWuJGm/exec';

function getCookie(name) {
  var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// No expires/max-age = a true session cookie: it's cleared when the browser
// session ends, so the auto-open logic below re-fires on the next new session.
function setSessionCookie(name, value) {
  document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; SameSite=Lax';
}

document.addEventListener('DOMContentLoaded', function () {
  function openModal(overlay) {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    setSessionCookie(SEEN_COOKIE, '1');
    var firstInput = overlay.querySelector('input:not([disabled]):not([hidden]):not([name="website"])');
    var closeBtn = overlay.querySelector('[data-modal-close]');
    var target = firstInput || closeBtn;
    if (target) target.focus({ preventScroll: true });
  }

  function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(document.getElementById(trigger.getAttribute('data-modal-open')));
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    }
  });

  document.querySelectorAll('form[data-notify-form]').forEach(function (form) {
    var body = form.parentNode;
    var done = body.querySelector('[data-notify-done]');
    var err = body.querySelector('[data-notify-error]');
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (err) err.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      function success() {
        form.hidden = true;
        if (done) done.hidden = false;
      }

      if (!NOTIFY_FORM_ENDPOINT) { success(); return; }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      // text/plain keeps this a "simple" request, so the browser skips the
      // CORS preflight that Google Apps Script can't answer.
      fetch(NOTIFY_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          email: form.elements.email.value.trim(),
          website: form.elements.website ? form.elements.website.value : '',
          source: form.getAttribute('data-notify-source') || 'Addicted to Fear - Notify Me',
          page: location.pathname
        })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error);
        success();
      }).catch(function () {
        if (err) err.hidden = false;
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  });

  // Auto-open: any page whose <body> carries data-modal-autoopen="<id>"
  // (currently only the home page) opens that modal shortly after every load,
  // on all devices.
  var autoTrigger = document.querySelector('[data-modal-autoopen]');
  if (autoTrigger) {
    window.setTimeout(function () {
      openModal(document.getElementById(autoTrigger.getAttribute('data-modal-autoopen')));
    }, 1200);
  }
});
