const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const video = document.querySelector('#hero-video');
const play = document.querySelector('#video-play');
function startVideo(){if(reduced.matches){video.pause();play.hidden=false;return;}video.muted=true;video.play().then(()=>play.hidden=true).catch(()=>play.hidden=false);}
startVideo();
play.addEventListener('click',()=>{video.play().then(()=>play.hidden=true).catch(()=>play.hidden=false);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else startVideo();});
reduced.addEventListener('change',startVideo);
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!reduced.matches){entry.target.animate([{opacity:.3,transform:'translateY(24px)'},{opacity:1,transform:'translateY(-3px)',offset:.8},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.2,.75,.3,1)'});}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const lightbox=document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=button.dataset.image;img.alt=button.querySelector('img').alt;lightbox.showModal();}));
lightbox.querySelector('.close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close();});
