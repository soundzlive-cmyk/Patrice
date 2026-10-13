var SEEN_COOKIE = 'pa_modal_seen';

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
    var closeBtn = overlay.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.focus();
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

  // Auto-open: any element carrying data-modal-autoopen="<id>" triggers that
  // modal shortly after load, but only on a first visit or a new session
  // (i.e. no pa_modal_seen session cookie present yet).
  var autoTrigger = document.querySelector('[data-modal-autoopen]');
  // Skipped on phones: a full-screen popup on arrival hurts mobile usability
  // (and Google's mobile ranking). The popup still opens from its buttons.
  var isPhone = window.matchMedia('(max-width: 699px)').matches;
  if (autoTrigger && !isPhone && !getCookie(SEEN_COOKIE)) {
    window.setTimeout(function () {
      openModal(document.getElementById(autoTrigger.getAttribute('data-modal-autoopen')));
    }, 1200);
  }
});
