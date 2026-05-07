// Hand-minified IIFE for inline injection into VariantLayout.
// Powers the floating Rubik's-cube button that shuffles to a different
// homepage variant. Persists the choice to the same localStorage key the
// rotator uses ("bentoo-variant"), so the next bare-root visit lands on
// the user's last shuffled pick.
//
// VARIANTS list and non-default LOCALES are interpolated from
// src/data/variants.ts and src/utils/getLang.ts at build time, so the
// inline script auto-syncs (no equivalent of check-variants-sync.mjs).
//
// Contains "bentoo-variant" → classified as core-rotator by
// scripts/check-js-budget.mjs (gzip budget ≤ 1536 B).
import { VARIANTS } from '~/data/variants';
import { DEFAULT_LOCALE, LOCALES } from '~/utils/getLang';

const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const SHUFFLE_JS: string =
  '(function(){try{' +
  'var V=' + JSON.stringify(VARIANTS) + ';' +
  'var L=' + JSON.stringify(NON_DEFAULT_LOCALES) + ';' +
  'var b=document.querySelector("[data-bd-shuffle]");if(!b)return;' +
  'b.addEventListener("click",function(e){' +
  'e.preventDefault();' +
  'var p=location.pathname,P="";' +
  'for(var i=0;i<L.length;i++){var x="/"+L[i];if(p===x||p.indexOf(x+"/")===0){P=x;break;}}' +
  'var m=p.match(/\\/v\\/([^\\/]+)\\/?$/),c=m?m[1]:"";' +
  'var n=c,t=0;while(n===c&&t<12){n=V[Math.floor(Math.random()*V.length)];t++;}' +
  'try{localStorage.setItem("bentoo-variant",n);localStorage.setItem("bentoo-variant-expires",String(Date.now()+86400000));}catch(_){}' +
  'b.classList.add("is-spinning");' +
  'setTimeout(function(){location.href=P+"/v/"+n+"/";},480);' +
  '});' +
  '}catch(e){}})();';
