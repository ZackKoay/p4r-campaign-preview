/* Persona 4 Revival — "Midnight Channel": Thai copy and language choice.
   Loaded as a plain script in <head> on Home, Loading and Event (and the
   prototype copies), before anything renders.

   All Thai comes from the backend (the API's translation store, below);
   none is built into this file. English lives in the pages themselves, so
   a key the backend hasn't set (or English mode) shows the page's
   English. The keys are the "Midnight Channel Translation" sheet's own;
   translations/site-text-th.json holds the sheet's Thai, ready to import.

   Language, first match wins:
     1. The visitor's own choice from Home's EN/TH toggle (localStorage).
     2. The server's country (<meta name="p4r-country">, from Cloudflare's
        CF-IPCountry or CloudFront's CloudFront-Viewer-Country header):
        TH = Thai, any other country = English.
     3. The device: time zone Asia/Bangkok, or a Thai browser language.
     4. English.

   window.P4R_I18N:
     lang                 'en' | 'th'
     t(key, english, vars) the backend's text for key, else `english`;
                          {name} placeholders are filled from vars.
     apply()              swaps every [data-i18n] element's text (and
                          [data-i18n-aria] aria-labels, [data-i18n-alt]
                          image descriptions) to the current
                          language; English is restored from the markup.
     set(lang)            Home's toggle: remembers the choice and applies.
     subscribe(fn)        called with the new lang after set(); returns
                          an unsubscribe function.
     url(key)             an https:// link the backend has set for key
                          (e.g. "link.tnc"), or null.
     ready                a Promise, resolved once the backend's copy is
                          in (or after 1.5 s at most); pages wait for it
                          before their first render.

   [data-i18n-href="key"] on a [data-i18n] element links its text to
   url(key) once the backend sets one (the T&Cs notes use "link.tnc").

   Copy from the backend: the P4R Mission API's translation store
   (GET /api/language/en and /th, edited with the admin key) overrides
   this file and the pages' built-in English, key by key, so copy can
   change without a frontend release. The API address comes from this
   script tag's data-api attribute; without it (the static preview) only
   the built-in copy is used. The last copy fetched is kept in
   localStorage, so a returning visitor gets it at once while a fresh
   copy loads for next time. If the API is slow, refuses or is down, the
   built-in English stays: nothing breaks (Thai mode then shows English
   for anything not cached). Order for a key: Thai mode = backend Thai,
   backend English, the page's English; English mode = backend English,
   the page's English. Backend values are
   always shown as plain text (never as HTML). */
(function () {
  // No Thai is built in: it all comes from the backend (see below). The
  // pages' own English is the only built-in copy.

  var STORE_KEY = 'p4r_lang';
  var COPY_KEY = 'p4r_copy_v1';
  var script = document.currentScript;
  var API_BASE = script && script.getAttribute('data-api') ? script.getAttribute('data-api').replace(/\/+$/, '') : '';

  // Backend copy: { en: {key: text}, th: {key: text} }. Only short plain
  // strings are kept.
  var REMOTE = { en: {}, th: {} };
  function cleanMap(data) {
    var out = {};
    if (!data || typeof data !== 'object') return out;
    Object.keys(data).forEach(function (k) {
      var v = data[k];
      if (typeof v === 'string' && v.length <= 5000 && k.length <= 200) out[k] = v;
    });
    return out;
  }
  try {
    var cached = JSON.parse(localStorage.getItem(COPY_KEY) || 'null');
    if (cached && cached.api === API_BASE) { REMOTE.en = cleanMap(cached.en); REMOTE.th = cleanMap(cached.th); }
  } catch (e) {}
  function lookup(lang, key) {
    if (lang === 'th') return REMOTE.th[key] || REMOTE.en[key] || null;
    return REMOTE.en[key] || null;
  }

  function storedChoice() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      return v === 'en' || v === 'th' ? v : null;
    } catch (e) { return null; }
  }

  function fromCountry() {
    var meta = document.querySelector('meta[name="p4r-country"]');
    var c = meta ? String(meta.content || '').trim().toUpperCase() : '';
    // XX = unknown and T1 = Tor (Cloudflare): no answer, use the device.
    if (!/^[A-Z]{2}$/.test(c) || c === 'XX') return null;
    return c === 'TH' ? 'th' : 'en';
  }

  function fromDevice() {
    try {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Bangkok') return 'th';
    } catch (e) {}
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      if (/^th(-|$)/i.test(langs[i])) return 'th';
    }
    return null;
  }

  var listeners = [];
  var api = {
    lang: storedChoice() || fromCountry() || fromDevice() || 'en',

    t: function (key, english, vars) {
      var s = lookup(api.lang, key);
      if (s === null) s = english;
      if (vars) {
        s = s.replace(/\{(\w+)\}/g, function (m, name) { return name in vars ? vars[name] : m; });
      }
      return s;
    },

    apply: function () {
      document.documentElement.lang = api.lang;
      var els = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.__p4rEnglish === undefined) el.__p4rEnglish = el.innerHTML;
        var text = lookup(api.lang, el.getAttribute('data-i18n'));
        if (text) el.textContent = text;
        else el.innerHTML = el.__p4rEnglish;
        // data-i18n-href="link.tnc": once the backend sets that link, the
        // element's text becomes a link to it (new tab).
        var href = el.getAttribute('data-i18n-href') && api.url(el.getAttribute('data-i18n-href'));
        if (href) {
          var a = document.createElement('a');
          a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.textContent = el.textContent;
          el.textContent = ''; el.appendChild(a);
        }
      }
      var labelled = document.querySelectorAll('[data-i18n-aria]');
      for (var j = 0; j < labelled.length; j++) {
        var l = labelled[j];
        if (l.__p4rEnglishLabel === undefined) l.__p4rEnglishLabel = l.getAttribute('aria-label') || '';
        l.setAttribute('aria-label', api.t(l.getAttribute('data-i18n-aria'), l.__p4rEnglishLabel));
      }
      var imgs = document.querySelectorAll('[data-i18n-alt]');
      for (var k = 0; k < imgs.length; k++) {
        var im = imgs[k];
        if (im.__p4rEnglishAlt === undefined) im.__p4rEnglishAlt = im.getAttribute('alt') || '';
        im.setAttribute('alt', api.t(im.getAttribute('data-i18n-alt'), im.__p4rEnglishAlt));
      }
    },

    set: function (lang) {
      if (lang !== 'en' && lang !== 'th') return;
      api.lang = lang;
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      api.apply();
      listeners.slice().forEach(function (fn) { fn(lang); });
    },

    subscribe: function (fn) {
      listeners.push(fn);
      return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
    },

    url: function (key) {
      var u = lookup(api.lang, key) || REMOTE.en[key] || '';
      return /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : null;
    },
  };

  // Fetch the backend's copy for both languages. Resolves `ready` as soon
  // as it's in, or after 1.5 s; a late answer still updates the plain-HTML
  // text (apply) and the cache, for the next page.
  function fetchLang(lang) {
    return fetch(API_BASE + '/api/language/' + lang, { headers: { Accept: 'application/json' }, credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (body) { return body && body.success ? cleanMap(body.data) : null; })
      .catch(function () { return null; });
  }
  api.ready = !API_BASE || typeof fetch !== 'function' ? Promise.resolve() : new Promise(function (resolve) {
    var hadCache = Object.keys(REMOTE.en).length > 0 || Object.keys(REMOTE.th).length > 0;
    if (hadCache) resolve();
    var timer = setTimeout(resolve, 1500);
    Promise.all([fetchLang('en'), fetchLang('th')]).then(function (res) {
      if (res[0] || res[1]) {
        if (res[0]) REMOTE.en = res[0];
        if (res[1]) REMOTE.th = res[1];
        try { localStorage.setItem(COPY_KEY, JSON.stringify({ api: API_BASE, en: REMOTE.en, th: REMOTE.th, at: Date.now() })); } catch (e) {}
        if (document.readyState !== 'loading') api.apply();
      }
      clearTimeout(timer);
      resolve();
    });
  });

  document.documentElement.lang = api.lang;
  window.P4R_I18N = api;
})();
