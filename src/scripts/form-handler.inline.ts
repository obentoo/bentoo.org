// Hand-minified IIFE for inline injection into variant pages via VariantLayout.
// Behavior mirrors src/scripts/form-handler.ts (unit-tested at
// tests/unit/form-handler.test.ts).

export const FORM_HANDLER_JS: string =
  '(function(){function init(){' +
  'var ifr=document.querySelector(\'iframe[name="bd-sink"]\');if(!ifr)return;' +
  'var fs=document.querySelectorAll(\'form[data-bentoo-subscribe]\');' +
  'for(var i=0;i<fs.length;i++){(function(f){' +
  'f.addEventListener("submit",function(e){' +
  'e.preventDefault();' +
  'var ok=f.dataset.successMsg||"",ng=f.dataset.errorMsg||"";' +
  'f.target="bd-sink";' +
  'var t=setTimeout(function(){' +
  'var sib=f.nextElementSibling;' +
  'if(sib&&sib.classList.contains("bentoo-form-error")){sib.textContent=ng;return;}' +
  'var p=document.createElement("p");p.className="bentoo-form-error";p.setAttribute("role","alert");p.textContent=ng;' +
  'f.insertAdjacentElement("afterend",p);' +
  '},10000);' +
  'ifr.addEventListener("load",function(){' +
  'clearTimeout(t);' +
  'var p=document.createElement("p");p.className="bentoo-form-success";p.setAttribute("role","status");p.textContent=ok;' +
  'f.replaceWith(p);' +
  '},{once:true});' +
  'f.submit();' +
  '});' +
  '})(fs[i]);}' +
  '}' +
  'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}' +
  '})();';
