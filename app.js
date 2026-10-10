const lightbox=document.querySelector('#lightbox');
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal();}));

const heroVideo=document.querySelector('#hero-video');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(heroVideo){
 const fallback=document.querySelector('.video-fallback');
 heroVideo.muted=true;heroVideo.defaultMuted=true;heroVideo.playsInline=true;
 heroVideo.controls=false;
 const play=()=>heroVideo.play().catch(()=>{});
 const autoPlay=()=>{if(!motion.matches&&!document.hidden&&heroVideo.paused&&!heroVideo.hidden)play();};
 const fail=()=>{heroVideo.hidden=true;fallback.hidden=false;};
 heroVideo.addEventListener('error',fail);heroVideo.querySelector('source').addEventListener('error',fail);
 heroVideo.addEventListener('canplay',autoPlay);
 // Retry once on a direct gesture if the browser initially blocks autoplay.
 document.addEventListener('touchend',autoPlay,{once:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else autoPlay();});
 window.addEventListener('pageshow',autoPlay);
 motion.addEventListener('change',()=>{heroVideo.autoplay=!motion.matches;if(motion.matches)heroVideo.pause();else autoPlay();});
 heroVideo.autoplay=!motion.matches;if(motion.matches)heroVideo.pause();autoPlay();
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
 document.querySelectorAll('.sg-hero-content,.chapter h2,.worry-grid p,.split-layout,.work,.process-grid article,.review-card,.offer-card,.comparison,.retouch-note').forEach(el=>observer.observe(el));
 motion.addEventListener('change',()=>{if(motion.matches){running.forEach(animation=>animation.cancel());running.clear();}});
}
