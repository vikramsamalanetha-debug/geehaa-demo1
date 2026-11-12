(function(){
  var btns=document.querySelectorAll('.designs button');
  function set(d,save){
    if(['blue','green','white'].indexOf(d)<0) d='blue';
    if(d==='blue') document.documentElement.removeAttribute('data-design'); else document.documentElement.setAttribute('data-design',d);
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.d===d?'true':'false')});
    if(save){try{localStorage.setItem('gh-design',d)}catch(e){}}
  }
  var cur=document.documentElement.getAttribute('data-design')||'blue'; set(cur,false);
  btns.forEach(function(b){b.addEventListener('click',function(){set(b.dataset.d,true)})});
  window.addEventListener('hashchange',function(){var h=location.hash.slice(1);if(['blue','green','white'].indexOf(h)>-1)set(h,true)});
  var f=document.getElementById('wo');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var m=document.getElementById('f-msg');
    var n=document.getElementById('f-name').value.trim(), p=document.getElementById('f-phone').value.trim();
    if(!n||!p){m.textContent='Please add your name and phone number so we can call you back.';m.hidden=false;return;}
    m.textContent='Thanks, '+n+'. This demo form is not connected yet. For service now, call 731-225-9722 — we answer 24/7.';
    m.hidden=false;
  });}
})();