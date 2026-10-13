/* Mobile menu: keyboard support, open/closed state, and auto-close. */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('nav-toggle');
  var burger = document.querySelector('.burger');
  var header = document.querySelector('.site-nav');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !burger || !header || !menu) return;

  function sync() {
    var open = toggle.checked;
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function setOpen(open) { toggle.checked = open; sync(); }

  toggle.addEventListener('change', sync);
  burger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!toggle.checked); }
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.checked) { setOpen(false); burger.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 860 && toggle.checked) setOpen(false);
  });
  sync();
});
