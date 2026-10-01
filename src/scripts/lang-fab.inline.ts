// Hand-minified IIFE for inline injection into VariantLayout.
// Powers the floating language picker that sits above the Rubik's-cube
// shuffle FAB: opens/closes its menu and, when a locale is chosen, persists
// it in localStorage (`bentoo-lang` + a 24 h `bentoo-lang-expires`) so the
// rotator on `/` honours it on the next visit. The write is best-effort:
// a storage error never blocks the link's navigation.
//
// MUST NOT contain the literal string that marks the core language script
// (the old footer toggle's data attribute), or the budget classifier in
// scripts/check-js-budget.mjs would file this as core-lang. Items are
// selected by class and their data-target-lang instead.
export const LANG_FAB_JS: string =
  '(function(){try{' +
  'var f=document.querySelector("[data-bd-lang-fab]");if(!f)return;' +
  'var t=f.querySelector("[data-bd-lang-trigger]");if(!t)return;' +
  'function c(){f.classList.remove("is-open");t.setAttribute("aria-expanded","false");}' +
  'function o(){f.classList.add("is-open");t.setAttribute("aria-expanded","true");}' +
  't.addEventListener("click",function(e){e.stopPropagation();' +
  'if(f.classList.contains("is-open"))c();else o();' +
  '});' +
  'document.addEventListener("click",function(e){if(f.contains(e.target))return;c();});' +
  'document.addEventListener("keydown",function(e){if(e.key==="Escape")c();});' +
  'var it=f.querySelectorAll(".bd-lang-item[data-target-lang]");' +
  'for(var i=0;i<it.length;i++){it[i].addEventListener("click",function(){' +
  'try{localStorage.setItem("bentoo-lang",this.getAttribute("data-target-lang"));' +
  'localStorage.setItem("bentoo-lang-expires",String(Date.now()+86400000));}catch(_){}' +
  '});}' +
  '}catch(e){}})();';
