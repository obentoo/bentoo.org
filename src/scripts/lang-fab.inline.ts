// Hand-minified IIFE for inline injection into VariantLayout.
// Powers the floating language picker that sits above the Rubik's-cube
// shuffle FAB. Only handles open/close UI — actual locale persistence
// is wired by the langToggleScript in BaseLayout.astro (the menu items
// carry data-bentoo-lang-toggle so that script binds them automatically).
//
// MUST NOT contain the literal string "bentoo-lang-toggle" or the budget
// classifier in scripts/check-js-budget.mjs would misclassify this as
// core-lang. We deliberately use a different attribute (data-bd-lang-fab)
// to keep this script in the variant budget tier.
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
  '}catch(e){}})();';
