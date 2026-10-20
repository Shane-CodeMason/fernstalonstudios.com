// Email links: many computers have no mail app set up, so a mailto: click can do nothing.
// Clicking an email link also copies the address and says so, while still trying the mail app.
(function () {
  function toast(text) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2600);
  }
  function fallbackCopy(text) {
    var a = document.createElement('textarea');
    a.value = text; a.setAttribute('readonly', ''); a.style.position = 'fixed'; a.style.opacity = '0';
    document.body.appendChild(a); a.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    a.remove(); return ok;
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!link) return;
    var address = link.getAttribute('href').slice(7).split('?')[0];
    var copied = function () { toast('Address copied: ' + address); };
    var failed = function () { toast('Email us at ' + address); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(address).then(copied, function () { (fallbackCopy(address) ? copied : failed)(); });
    } else {
      (fallbackCopy(address) ? copied : failed)();
    }
  });
})();
