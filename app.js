const lightbox=document.querySelector('#lightbox');
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal();}));

const heroVideo=document.querySelector('#hero-video');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(heroVideo){
 const toggle=document.querySelector('.video-toggle');
 const fallback=document.querySelector('.video-fallback');
 let userPaused=false;
 heroVideo.muted=true;heroVideo.defaultMuted=true;heroVideo.playsInline=true;
 heroVideo.controls=false;toggle.hidden=false;
 const sync=()=>{toggle.textContent=heroVideo.paused?'▶ 영상 재생':'Ⅱ 일시정지';toggle.setAttribute('aria-label',heroVideo.paused?'히어로 영상 재생':'히어로 영상 일시정지');};
 const play=()=>heroVideo.play().catch(sync);
 const autoPlay=()=>{if(!motion.matches&&!userPaused&&!document.hidden&&heroVideo.paused&&!heroVideo.hidden)play();};
 const fail=()=>{heroVideo.hidden=true;fallback.hidden=false;toggle.hidden=true;};
 heroVideo.addEventListener('play',sync);heroVideo.addEventListener('pause',sync);
 heroVideo.addEventListener('error',fail);heroVideo.querySelector('source').addEventListener('error',fail);
 heroVideo.addEventListener('canplay',autoPlay);
 toggle.addEventListener('click',()=>{if(heroVideo.paused){userPaused=false;play();}else{userPaused=true;heroVideo.pause();}});
 // Retry once on a direct gesture if the browser initially blocks autoplay.
 document.addEventListener('touchend',event=>{if(!toggle.contains(event.target))autoPlay();},{once:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else autoPlay();});
 window.addEventListener('pageshow',autoPlay);
 motion.addEventListener('change',()=>{heroVideo.autoplay=!motion.matches;if(motion.matches)heroVideo.pause();else autoPlay();});
 heroVideo.autoplay=!motion.matches;if(motion.matches)heroVideo.pause();sync();autoPlay();
}
// Content stays visible even when observers or animation are unavailable.
if('IntersectionObserver' in window && Element.prototype.animate){
 const running=new Set();
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(motion.matches)return;
   const animation=entry.target.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});
   running.add(animation);animation.onfinish=()=>running.delete(animation);
  });
 },{threshold:0.12});
 document.querySelectorAll('.concern-card,.reason-list article,.work,.director-copy,.steps article,.review-card,.offer-card,.space-info,.closing h2').forEach(el=>observer.observe(el));
 motion.addEventListener('change',()=>{if(motion.matches){running.forEach(animation=>animation.cancel());running.clear();}});
}
