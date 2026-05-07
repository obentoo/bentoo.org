// Hand-minified IIFE for inline injection into `/`, `/pt/`, and `/es/`.
// The 21-variant array is duplicated from src/data/variants.ts and validated
// by scripts/check-variants-sync.mjs on every CI run.
//
// Behavior mirrors src/scripts/rotator.ts (unit-tested at tests/unit/rotator.test.ts).
import { DEFAULT_LOCALE, LOCALES } from '~/utils/getLang';

const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const ROTATOR_JS: string =
  '(function(){' +
  'var L=' + JSON.stringify(NON_DEFAULT_LOCALES) + ';' +
  'function px(p){for(var i=0;i<L.length;i++){var x="/"+L[i];if(p===x||p.indexOf(x+"/")===0)return x;}return "";}' +
  'try{' +
  'var V=["2001","beos","breaking-bad","castlevania","death-stranding-v3","mario","matrix","minecraft","severance-v2","synthwave","v3","v3a","v3b","v3c","v3e","v3f","v3h","v3i","v3j","v3-vaporwave","v4"];' +
  'var D="v4";var T=86400000;' +
  'var u=new URL(location.href);' +
  'var P=px(u.pathname);' +
  'function g(k){try{return localStorage.getItem(k);}catch(e){return null;}}' +
  'function s(k,v){try{localStorage.setItem(k,v);}catch(e){}}' +
  'function rd(k,e){var v=g(k),x=g(e);if(!v||!x)return null;var n=+x;if(!isFinite(n)||n<=Date.now())return null;return v;}' +
  'function pv(sl){s("bentoo-variant",sl);s("bentoo-variant-expires",String(Date.now()+T));}' +
  'function srch(){var p=new URLSearchParams(u.searchParams);p.delete("v");var q=p.toString();return q?"?"+q:"";}' +
  'function valid(sl){return V.indexOf(sl)>=0;}' +
  'function tgt(sl,nl){for(var i=0;i<L.length;i++){if(sl===L[i])return L[i];}if(sl)return null;for(var j=0;j<L.length;j++){if(nl.indexOf(L[j])===0)return L[j];}return null;}' +
  'var vp=u.searchParams.get("v");' +
  'if(vp&&valid(vp)){pv(vp);location.replace(P+"/v/"+vp+"/"+srch());return;}' +
  'if(P===""){var sl=rd("bentoo-lang","bentoo-lang-expires");var nl=(navigator.language||"").toLowerCase();var t=tgt(sl,nl);if(t){location.replace("/"+t+"/"+(u.search||""));return;}}' +
  'var st=rd("bentoo-variant","bentoo-variant-expires"),slug;' +
  'if(st&&valid(st)){slug=st;}else{slug=V[Math.floor(Math.random()*V.length)]||D;pv(slug);}' +
  'location.replace(P+"/v/"+slug+"/"+srch());' +
  '}catch(e){try{location.replace(px(location.pathname)+"/v/v4/");}catch(e2){}}' +
  '})();';
