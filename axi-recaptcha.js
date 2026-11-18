/* ==========================================================================
   AXI Labs — Google reCAPTCHA v3 (invisible background check)
   --------------------------------------------------------------------------
   The site key is public. Real verification MUST happen on a server or
   Cloud Function using the SECRET key. This file only collects tokens.

   Usage from any page:
     axiRecaptchaExecute('login').then(token => { ... send to backend ... });

   IMPORTANT:
   - Only hosts registered for this key are allowed to load reCAPTCHA.
   - Add every real production hostname to ALLOWED_HOSTS below.
   - reCAPTCHA does NOT work from file:// or from 127.0.0.1 unless Google
     has that exact hostname registered.
   ========================================================================== */
(function () {
  'use strict';

  var SITE_KEY = '6LdYXxguAAAAAE9P6aNNk7w9aXNaid7khPhs93Ot';

  /* Exact hostnames only (no protocol, no path, no port). */
  var ALLOWED_HOSTS = [
    'axilabs.wuaze.com',
    'www.axilabs.wuaze.com',
    'localhost'
  ];

  if (window.__axiRecaptchaLoaded) return;
  window.__axiRecaptchaLoaded = true;

  window.AXI_RECAPTCHA_SITE_KEY = SITE_KEY;
  window.AXI_RECAPTCHA_ALLOWED_HOSTS = ALLOWED_HOSTS;
  window.axiRecaptchaToken = null;
  window.axiRecaptchaError = null;
  window.axiRecaptchaEnabled = false;

  function hostnameAllowed() {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return false;
    var host = (location.hostname || '').toLowerCase();
    if (!host) return false;
    for (var i = 0; i < ALLOWED_HOSTS.length; i++) {
      if (host === ALLOWED_HOSTS[i]) return true;
    }
    return false;
  }

  /* Ask Google for a token. Call this right before a real form submit. */
  window.axiRecaptchaExecute = function (action) {
    return new Promise(function (resolve, reject) {
      if (!window.axiRecaptchaEnabled) {
        reject(new Error('reCAPTCHA is not enabled on this host'));
        return;
      }
      if (!window.grecaptcha || typeof grecaptcha.execute !== 'function') {
        reject(new Error('reCAPTCHA is not loaded'));
        return;
      }
      grecaptcha.ready(function () {
        grecaptcha.execute(SITE_KEY, { action: action || 'page' })
          .then(function (token) {
            window.axiRecaptchaToken = token;
            window.axiRecaptchaError = null;
            resolve(token);
          })
          .catch(function (err) {
            window.axiRecaptchaError = String((err && err.message) || err);
            reject(err);
          });
      });
    });
  };

  function boot(attempt) {
    if (window.grecaptcha && typeof grecaptcha.execute === 'function') {
      window.axiRecaptchaExecute('page').catch(function (e) {
        console.warn('reCAPTCHA background check unavailable:', e);
      });
      return;
    }
    if (attempt < 40) setTimeout(function () { boot(attempt + 1); }, 250);
  }

  if (!hostnameAllowed()) {
    window.axiRecaptchaError = 'Host not registered for this reCAPTCHA key';
    console.info('reCAPTCHA skipped on this host:', location.hostname || '(file)');
    return;
  }

  window.axiRecaptchaEnabled = true;

  /* Position the badge on the left, clear of the AXI Assistant button. */
  function injectBadgeStyle() {
    if (document.getElementById('axi-recaptcha-style')) return;
    var css = [
      '.grecaptcha-badge{right:auto!important;left:14px!important;bottom:14px!important;z-index:9000!important}',
      'body.has-sidebar .grecaptcha-badge{left:254px!important}',
      '@media(max-width:768px){body.has-sidebar .grecaptcha-badge{left:10px!important;bottom:calc(72px + env(safe-area-inset-bottom,0px))!important}}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'axi-recaptcha-style';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
  injectBadgeStyle();

  var s = document.createElement('script');
  s.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(SITE_KEY);
  s.async = true;
  s.defer = true;
  s.onerror = function () {
    window.axiRecaptchaError = 'Google reCAPTCHA could not be loaded';
    console.warn('reCAPTCHA could not be loaded.');
  };
  (document.head || document.documentElement).appendChild(s);

  boot(0);
})();
