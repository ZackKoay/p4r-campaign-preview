/* =========================================================
   COOKIE CONTROL — PREVIEW LOOK-ALIKE (GitHub Pages preview only)

   The real site loads CIVIC's Cookie Control v9 with the client's
   licence key, which only works on the licensed domain, so it can't
   run here. This is a static copy of how it will look with our
   settings: Cookie Control's default dark slide-out panel on the
   right, its default English text, and our one optional category
   (Analytics) plus the Privacy Policy link. Colours, sizes and text
   are taken from Cookie Control's own default stylesheet and text.

   Nothing is tracked: the choice is only remembered in this browser
   (localStorage) so the panel doesn't reopen on every page. Anything
   with data-cookie-settings reopens it, like on the real site.
   ========================================================= */
(function () {
  var KEY = 'p4r_cookie_control_preview';
  var css = [
    '#ccp{font-family:Arial,sans-serif;font-size:16px;line-height:1.4em;position:fixed;z-index:2147483647}',
    '#ccp *{box-sizing:border-box}',
    '#ccp[hidden]{display:none}',
    '#ccp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:1;animation:ccp-fade .4s}',
    '#ccp-module{position:fixed;top:0;bottom:0;right:0;width:90%;max-width:520px;z-index:2;animation:ccp-slide .4s}',
    '#ccp-content{position:absolute;inset:0;overflow-y:auto;padding:24px;background:#313147;color:#fff}',
    '#ccp-close{position:absolute;top:16px;right:16px;z-index:10;display:flex;align-items:center;padding:0;border:0;background:transparent;color:#fff;cursor:pointer}',
    '#ccp-close svg{width:24px;height:24px}',
    '#ccp h2{font-size:1.2em;font-weight:700;line-height:1.5em;margin:0;padding-right:32px;text-align:left}',
    '#ccp h3{font-size:1em;font-weight:700;line-height:1.5em;margin:0;padding-right:120px}',
    '#ccp p{font-size:1em;line-height:1.5em;margin:16px 0 0;text-align:left}',
    '#ccp a{color:#fff;font-weight:700;text-decoration:underline}',
    '#ccp a svg{display:inline-block;width:16px;height:16px;margin-left:8px;position:relative;top:3px}',
    '#ccp hr{border:0;height:1px;margin:24px 0;background:#fff;opacity:.25}',
    '#ccp-buttons{margin-top:16px}',
    '#ccp .ccp-button{display:inline-block;background:transparent;border:2px solid #fff;border-radius:4px;color:#fff;cursor:pointer;font:inherit;font-size:1em;font-weight:400;line-height:1.5em;margin:4px 8px 16px 0;padding:8px 16px}',
    '#ccp .ccp-button--solid{background:#fff;color:#111125;font-weight:700}',
    '#ccp .ccp-category{position:relative}',
    '#ccp .ccp-toggle{position:absolute;right:0;top:-3px;display:flex;width:96px;height:32px;border:4px solid #111125;border-radius:50px;background:#111125;cursor:pointer}',
    '#ccp .ccp-toggle input{position:absolute;opacity:0;width:1px;height:1px}',
    '#ccp .ccp-toggle span{flex:1 1 50%;z-index:2;display:flex;align-items:center;justify-content:center;font-size:.75em;font-weight:700;color:#fff}',
    '#ccp .ccp-toggle .ccp-off{opacity:.65}',
    '#ccp .ccp-toggle i{position:absolute;top:0;left:0;width:50%;height:100%;border-radius:50px;background:#2f2f5f;transition:all .4s ease;z-index:1}',
    '#ccp .ccp-toggle input:checked~i{left:50%;background:#fff}',
    '#ccp .ccp-toggle input:checked~.ccp-on{color:#111125}',
    '#ccp .ccp-toggle:focus-within{outline:3px solid #fff;outline-offset:2px}',
    '#ccp-end{margin:16px 0 32px;font-size:.8em;opacity:.8}',
    '#ccp-icon{position:fixed;right:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:2147483646;width:56px;height:56px;border:0;border-radius:50%;background:#000025;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35)}',
    '#ccp-icon[hidden]{display:none}',
    '#ccp-icon svg{width:30px;height:30px}',
    '@keyframes ccp-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes ccp-slide{from{transform:translateX(100%)}to{transform:none}}',
    '@media (prefers-reduced-motion:reduce){#ccp-overlay,#ccp-module{animation:none}#ccp .ccp-toggle i{transition:none}}'
  ].join('\n');

  var EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  var html =
    '<div id="ccp-overlay"></div>' +
    '<div id="ccp-module" role="dialog" aria-modal="true" aria-labelledby="ccp-title">' +
      '<div id="ccp-content">' +
        '<button type="button" id="ccp-close" aria-label="Close Cookie Control"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
        '<h2 id="ccp-title">This site uses cookies to store information on your computer.</h2>' +
        '<p>Some of these cookies are essential, while others help us to improve your experience by providing insights into how the site is being used.</p>' +
        '<p>For more detailed information, please read our <a href="https://www.sega.co.jp/en/privacypolicy/" target="_blank" rel="noopener">Privacy Policy' + EXT + '</a></p>' +
        '<div id="ccp-buttons">' +
          '<button type="button" class="ccp-button ccp-button--solid" data-ccp="accept">I Accept Cookies</button>' +
          '<button type="button" class="ccp-button" data-ccp="reject">I Do Not Accept Cookies</button>' +
        '</div>' +
        '<hr>' +
        '<h3>Necessary Cookies</h3>' +
        '<p>Necessary cookies enable core functionality such as page navigation and access to secure areas. The website cannot function properly without these cookies, and can only be disabled by changing your browser preferences.</p>' +
        '<hr>' +
        '<div class="ccp-category">' +
          '<h3>Analytics</h3>' +
          '<label class="ccp-toggle"><input type="checkbox" id="ccp-analytics" aria-label="Analytics cookies"><span class="ccp-off">Off</span><span class="ccp-on">On</span><i></i></label>' +
          '<p>Analytics cookies help us improve the site by measuring how visitors use it.</p>' +
        '</div>' +
        '<hr>' +
        '<div id="ccp-end">Cookie Control by CIVIC — preview look-alike</div>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'ccp';
  root.hidden = true;
  root.innerHTML = html;
  document.body.appendChild(root);

  var icon = document.createElement('button');
  icon.type = 'button';
  icon.id = 'ccp-icon';
  icon.hidden = true;
  icon.setAttribute('aria-label', 'Cookie settings');
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.6 6.1 6.6.5-5 4.4 1.5 6.5L12 16.6 6.3 20l1.5-6.5-5-4.4 6.6-.5z"/></svg>';
  document.body.appendChild(icon);

  var analytics = root.querySelector('#ccp-analytics');
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var opener = null;
  function open() {
    var c = load();
    analytics.checked = !!(c && c.analytics);
    opener = document.activeElement;
    root.hidden = false;
    icon.hidden = true;
    root.querySelector('#ccp-close').focus();
  }
  function close() {
    root.hidden = true;
    icon.hidden = false;
    if (opener && opener.focus && document.contains(opener)) opener.focus();
  }
  function choose(on) {
    analytics.checked = on;
    save({ analytics: on, interacted: true });
    close();
  }

  root.addEventListener('click', function (e) {
    if (e.target.id === 'ccp-overlay' || e.target.closest('#ccp-close')) {
      save({ analytics: analytics.checked, interacted: true });
      close();
    }
    var b = e.target.closest('[data-ccp]');
    if (b) choose(b.getAttribute('data-ccp') === 'accept');
  });
  analytics.addEventListener('change', function () { save({ analytics: analytics.checked, interacted: true }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !root.hidden) close(); });
  icon.addEventListener('click', open);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); open(); }
  });

  // Like the real one with its default initialState ('open'): the panel
  // opens on a first visit; afterwards only the small icon shows.
  if (load()) icon.hidden = false;
  else open();
})();
