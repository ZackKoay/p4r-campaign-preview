/* Persona 4 Revival — "Midnight Channel": Thai copy and language choice.
   Loaded as a plain script in <head> on Home, Loading and Event (and the
   prototype copies), before anything renders.

   Thai text comes from the "Midnight Channel Translation" sheet; the keys
   are the sheet's own keys. English lives in the pages themselves, so a
   key missing here (or English mode) leaves the page's English as it is.
   Where a sheet cell offered alternatives ("A/B"), the first one is used.

   Language, first match wins:
     1. The visitor's own choice from Home's EN/TH toggle (localStorage).
     2. The server's country (<meta name="p4r-country">, from Cloudflare's
        CF-IPCountry or CloudFront's CloudFront-Viewer-Country header):
        TH = Thai, any other country = English.
     3. The device: time zone Asia/Bangkok, or a Thai browser language.
     4. English.

   window.P4R_I18N:
     lang                 'en' | 'th'
     t(key, english, vars) Thai for key in Thai mode, else `english`;
                          {name} placeholders are filled from vars.
     apply()              swaps every [data-i18n] element's text (and
                          [data-i18n-aria] aria-labels, [data-i18n-alt]
                          image descriptions) to the current
                          language; English is restored from the markup.
     set(lang)            Home's toggle: remembers the choice and applies.
     subscribe(fn)        called with the new lang after set(); returns
                          an unsubscribe function. */
(function () {
  var TH = {
    "home.meta.title": "Persona 4 Revival | Midnight Channel",
    "home.hero.headline_1": "ยินดีต้อนรับสู่",
    "home.hero.headline_2": "MIDNIGHT CHANNEL",
    "home.hero.tagline": "ทำภารกิจและรับรางวัล",
    "home.hero.cta_start": "เริ่ม",
    "home.controls.mute": "ปิดเสียง",
    "home.controls.unmute": "เปิดเสียง",
    "home.controls.language_label": "ภาษา",
    "home.controls.lang_hint": "คลิกที่นี่สำหรับภาษาไทย",
    "home.controls.lang_hint_close_aria": "ปิด",
    "home.controls.channel_label": "CHANNEL",
    "home.controls.tuning_label": "TUNING",
    "home.controls.dial_aria": "ปุ่มหมุนปรับช่อง ซึ่งขณะนี้อยู่ที่ {n} แตะเพื่อหมุน",
    "home.info.login_cta": "เข้าสู่ระบบ",
    "home.info.heading": "ทำภารกิจให้สำเร็จ รับรางวัลใหญ่!",
    "home.info.copy": "ทำภารกิจ Midnight Channel ให้สำเร็จทั้งหมด เพื่อปลดล็อกรางวัลและลุ้นรับของสะสมสุดพิเศษจาก Persona 4 Revival ใน Lucky Draw",
    "home.info.join_cta": "เข้าร่วมเลย",
    "home.info.tnc": "เป็นไปตามข้อกำหนดและเงื่อนไข",
    "home.merch.placeholder": "พื้นที่สำหรับสินค้า",
    "home.footer.copyright": "©ATLUS. ©SEGA. สงวนลิขสิทธิ์ทั้งหมด | แคมเปญ Persona 4 Revival “Midnight Channel”",
    "home.toast.login_error_generic": "เกิดปัญหาในการเชื่อมต่อบัญชี SEGA ของคุณ โปรดลองอีกครั้ง",
    "loading.meta.title": "Persona 4 Revival | กำลังโหลด…",
    "loading.status_connecting": "กำลังเชื่อมต่อบัญชี SEGA…",
    "loading.error_cancelled": "การเข้าสู่ระบบถูกยกเลิก",
    "loading.error_sega_failed": "การเข้าสู่ระบบบัญชี SEGA ล้มเหลว",
    "loading.error_callback_failed": "เกิดปัญหาในการเชื่อมต่อบัญชี SEGA ของคุณ โปรดลองอีกครั้ง",
    "loading.back_link": "← กลับไปที่หน้าหลัก",
    "event.meta.title": "Persona 4 Revival | Midnight Channel",
    "event.header.logout": "ออกจากระบบ",
    "event.audio.mute": "ปิดเสียง",
    "event.audio.unmute": "เปิดเสียง",
    "event.mission.label_prefix": "ภารกิจ {n}:",
    "event.mission.1_name": "ติดตามข่าวสารล่าสุด",
    "event.mission.2_name": "เผยแพร่ข่าวสาร",
    "event.mission.3_name": "บรรลุเป้าหมาย",
    "event.mission.toggle_aria": "แสดงภารกิจ {n}",
    "event.task.1_gate": "เข้าสู่ระบบด้วยบัญชี SEGA",
    "event.task.1_a": "เพิ่ม Persona 4 Revival ลงในรายการสิ่งที่อยากได้",
    "event.task.1_b": "ติดตาม Instagram ของ ATLUS SEA",
    "event.task.1_c": "เชิญชวนเพื่อน",
    "event.task.go": "ไปทำ",
    "event.task.done": "เสร็จสิ้น",
    "event.mission.progress_label": "ความคืบหน้าภารกิจ {n}",
    "event.mission.progress_complete_suffix": "เสร็จสิ้น",
    "event.bonus_button": "รางวัลพิเศษ",
    "event.luckydraw.title": "จับรางวัล",
    "event.luckydraw.copy": "ทำภารกิจให้สำเร็จเพื่อสะสมสิทธิ์ลุ้นรางวัล!",
    "event.luckydraw.entries_label": "ภารกิจที่สำเร็จ: {n}/{total}",
    "event.merch.placeholder": "พื้นที่สำหรับสินค้าที่ระลึก",
    "event.luckydraw.enter_button": "ร่วมลุ้นรางวัล",
    "event.luckydraw.period": "ระยะเวลากิจกรรม: xx ตุลาคม – xx พฤศจิกายน 2025",
    "event.footer.privacy": "นโยบายความเป็นส่วนตัว",
    "event.footer.tos": "ข้อกำหนดการให้บริการ",
    "event.footer.copyright": "©ATLUS. ©SEGA.",
    "event.task.2_a": "เข้าร่วมเซิร์ฟเวอร์ ATLUS SEA บน Discord",
    "event.task.2_b": "กรอกรหัสผ่านที่ได้รับจากไลฟ์ของ KOL",
    "event.task.3_a": "ทดลองเล่นเดโม Persona 4 Revival",
    "event.task.3_b": "สั่งซื้อล่วงหน้า Persona 4 Revival",
    "event.task.3_c": "ถอดรหัสข้อความลับ",
    "event.stamp.completed": "สำเร็จแล้ว!",
    "event.stamp.claimed": "รับรางวัลแล้ว!",
    "event.modal.close_aria": "ปิด",
    "event.modal.luckydraw_header": "กิจกรรมจับรางวัล",
    "event.modal.luckydraw_heading": "ทำภารกิจทั้งหมดสำเร็จแล้ว!",
    "event.modal.luckydraw_draws_copy": "สิทธิ์ลุ้นรางวัลทั้งหมด: {draws}/{total} ครั้ง",
    "event.modal.luckydraw_tnc": "เป็นไปตามข้อกำหนดและเงื่อนไข",
    "event.modal.luckydraw_submit": "ส่งสิทธิ์ลุ้นรางวัล",
    "event.modal.submitted_heading": "ส่งสิทธิ์ลุ้นรางวัลเรียบร้อยแล้ว!",
    "event.modal.submitted_copy": "โปรดทราบว่า สิทธิ์ลุ้นรางวัลของคุณอาจถูกยกเลิก หากไม่เป็นไปตามเงื่อนไขของภารกิจ เช่น อีเมลไม่ถูกต้อง หลักฐานการซื้อไม่ถูกต้อง เป็นต้น",
    "event.modal.submitted_return": "กลับไปยังภารกิจ",
    "event.modal.bonus_header": "รางวัลพิเศษ",
    "event.modal.bonus_copy": "รับสินค้า ที่ระลึกสุดพิเศษจาก Persona 4 Revival",
    "event.modal.bonus_desktop": "เดสก์ท็อป",
    "event.modal.bonus_mobile": "มือถือ",
    "event.modal.logout_heading": "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ",
    "event.modal.logout_confirm": "ใช่ ออกจากระบบ",
    "event.modal.logout_cancel": "ไม่ กลับไป",
    "event.modal.share_heading": "แชร์ให้เพื่อนของคุณ!",
    "event.modal.share_copy_button": "คัดลอก",
    "event.toast.link_copied": "คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว!",
    "event.modal.password_placeholder": "กรอกรหัสผ่าน",
    "event.modal.password_submit": "กรอก",
    "event.modal.password_verifying": "กำลังตรวจสอบ...",
    "event.modal.password_error": "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
    "event.toast.link_pending": "เมื่อกลับมาหน้านี้ ภารกิจจะถูกแสดงว่า Done หรือ เสร็จสิ้นแล้ว!",
    "event.status.loading": "กำลังโหลดภารกิจของคุณ…",
    "event.status.error": "ไม่สามารถโหลดความคืบหน้าภารกิจของคุณได้",
    "event.status.retry": "ลองอีกครั้ง",
    "event.toast.demo_not_played": "ยังไม่พบประวัติการเล่น โปรดลองอีกครั้งหลังจากทดลองเล่นเดโม",
    "event.toast.sega_check_failed": "ไม่สามารถตรวจสอบกับ SEGA Account ได้ในขณะนี้",
    "event.toast.save_failed": "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง",
    "event.toast.bonus_failed": "บันทึกรายการไม่สำเร็จ โปรดลองอีกครั้ง",
    "event.toast.entry_failed": "ส่งสิทธิ์เข้าร่วมไม่สำเร็จ โปรดลองอีกครั้ง",
    "home.modal.sega_header": "ยินดีต้อนรับสู่ SEGA Account! สมัครสมาชิกเพื่อรับรางวัลในเกมสุดพิเศษสำหรับสมาชิกเท่านั้น!",
    "home.modal.sega_heading": "SEGA Account คืออะไร?",
    "home.modal.sega_body_1": "SEGA Account คือโปรไฟล์ที่ช่วยให้คุณใช้บริการออนไลน์และสิทธิประโยชน์ต่าง ๆ ของ SEGA ได้อย่างเต็มที่ พร้อมรับสิทธิประโยชน์มากมาย สมัครสมาชิกได้ทุกคนและไม่มีค่าใช้จ่าย!",
    "home.modal.sega_body_2": "สมัครบัญชีวันนี้ เพื่อรับไอเทมโบนัสจากเกมยอดฮิต!",
    "home.modal.sega_register": "ลงทะเบียน",
    "home.modal.sega_login": "เข้าสู่ระบบ",
  };

  var STORE_KEY = 'p4r_lang';

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
      var s = api.lang === 'th' && TH[key] ? TH[key] : english;
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
        var th = api.lang === 'th' && TH[el.getAttribute('data-i18n')];
        if (th) el.textContent = th;
        else el.innerHTML = el.__p4rEnglish;
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
  };

  document.documentElement.lang = api.lang;
  window.P4R_I18N = api;
})();
