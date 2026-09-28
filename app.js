const lightbox=document.querySelector('#lightbox');
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal();}));

const heroVideo=document.querySelector('#hero-video');
if(heroVideo){
 const toggle=document.querySelector('.video-toggle');
 const fallback=document.querySelector('.video-fallback');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 heroVideo.muted=true;heroVideo.controls=false;toggle.hidden=false;
 const sync=()=>{toggle.textContent=heroVideo.paused?'▶ 영상 재생':'Ⅱ 일시정지';toggle.setAttribute('aria-label',heroVideo.paused?'히어로 영상 재생':'히어로 영상 일시정지');};
 const play=()=>heroVideo.play().catch(()=>sync());
 const fail=()=>{heroVideo.hidden=true;fallback.hidden=false;toggle.hidden=true;};
 heroVideo.addEventListener('play',sync);heroVideo.addEventListener('pause',sync);
 heroVideo.addEventListener('error',fail);heroVideo.querySelector('source').addEventListener('error',fail);
 toggle.addEventListener('click',()=>{if(heroVideo.paused)play();else heroVideo.pause();});
 motion.addEventListener('change',()=>{if(motion.matches)heroVideo.pause();});
 sync();if(!motion.matches)play();
}
