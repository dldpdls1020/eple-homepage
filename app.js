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
// Replay a small settling bounce only after an element leaves and re-enters view.
// The document remains visible if motion is disabled or animation is unavailable.
if('IntersectionObserver' in window && Element.prototype.animate){
 const active=new Map();
 const entered=new Set();
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   const element=entry.target;
   if(!entry.isIntersecting){
    entered.delete(element);
    active.get(element)?.cancel();active.delete(element);
    return;
   }
   if(entry.intersectionRatio<0.12||entered.has(element))return;
   entered.add(element);
   if(motion.matches)return;
   const animation=element.animate([
    {opacity:.45,transform:'translateY(20px) scale(.985)',offset:0},
    {opacity:1,transform:'translateY(-4px) scale(1.004)',offset:.62},
    {opacity:1,transform:'translateY(1px) scale(1)',offset:.82},
    {opacity:1,transform:'translateY(0) scale(1)',offset:1}
   ],{duration:760,easing:'cubic-bezier(.22,.65,.35,1)',fill:'none'});
   active.set(element,animation);
   animation.onfinish=()=>{if(active.get(element)===animation)active.delete(element);};
  });
 },{threshold:[0,.12]});
 document.querySelectorAll('.sg-hero-content,.story-section h2,.story-quote,.story-evidence,.story-points article,.work,.review-card,.offer-card').forEach(el=>observer.observe(el));
 motion.addEventListener('change',()=>{if(motion.matches){active.forEach(animation=>animation.cancel());active.clear();}});
}
