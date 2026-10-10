const lightbox=document.querySelector('#lightbox');
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal();}));

const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const slides=[...document.querySelectorAll('.hero-slide')];
let slideIndex=0, slideTimer;
const nextSlide=()=>{
 const next=(slideIndex+1)%slides.length;
 if(!slides[next].complete||!slides[next].naturalWidth)return;
 slides[slideIndex].classList.remove('is-active');slides[slideIndex].setAttribute('aria-hidden','true');
 slideIndex=next;
 slides[slideIndex].classList.add('is-active');slides[slideIndex].setAttribute('aria-hidden','false');
};
const syncSlideshow=()=>{
 clearInterval(slideTimer);
 if(slides.length>1&&!document.hidden&&!motion.matches)slideTimer=setInterval(nextSlide,3000);
};
document.addEventListener('visibilitychange',syncSlideshow);
motion.addEventListener('change',syncSlideshow);
syncSlideshow();
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
