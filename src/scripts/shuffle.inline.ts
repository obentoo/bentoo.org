// Hand-minified IIFE for inline injection into VariantLayout.
// Powers the floating Rubik's-cube button that shuffles to a different
// homepage variant. Persists the choice to the same localStorage key the
// rotator uses ("bentoo-variant"), so the next bare-root visit lands on
// the user's last shuffled pick.
//
// VARIANTS list is interpolated from src/data/variants.ts at build time
// via JSON.stringify, so this script stays auto-synced (no need for an
// equivalent of check-variants-sync.mjs).
//
// Contains "bentoo-variant" → classified as core-rotator by
// scripts/check-js-budget.mjs (gzip budget ≤ 1536 B).
import { VARIANTS } from '~/data/variants';

export const SHUFFLE_JS: string =
  '(function(){try{' +
  'var V=' + JSON.stringify(VARIANTS) + ';' +
  'var b=document.querySelector("[data-bd-shuffle]");if(!b)return;' +
  'b.addEventListener("click",function(e){' +
  'e.preventDefault();' +
  'var p=location.pathname,P=p.indexOf("/pt/")===0?"/pt":"";' +
  'var m=p.match(/\\/v\\/([^\\/]+)\\/?$/),c=m?m[1]:"";' +
  'var n=c,t=0;while(n===c&&t<12){n=V[Math.floor(Math.random()*V.length)];t++;}' +
  'try{localStorage.setItem("bentoo-variant",n);localStorage.setItem("bentoo-variant-expires",String(Date.now()+86400000));}catch(_){}' +
  'b.classList.add("is-spinning");' +
  'setTimeout(function(){location.href=P+"/v/"+n+"/";},480);' +
  '});' +
  '}catch(e){}})();';
