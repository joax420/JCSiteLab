const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursorRing');
const isTouchDevice=('ontouchstart'in window)||(navigator.maxTouchPoints>0);

if(cursor&&ring){
  if(isTouchDevice){
    cursor.style.display='none';
    ring.style.display='none';
    document.body.style.cursor='auto';
    function spawnRipple(x,y,big){
      const ripple=document.createElement('div');
      ripple.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:${big?80:40}px;height:${big?80:40}px;border-radius:50%;transform:translate(-50%,-50%) scale(0);background:radial-gradient(circle,rgba(47,95,232,.35) 0%,rgba(47,95,232,0) 70%);border:1.5px solid rgba(47,95,232,.6);pointer-events:none;z-index:9999;animation:touchRipple .55s ease-out forwards;`;
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend',()=>ripple.remove());
    }
    document.addEventListener('touchstart',e=>{for(const t of e.changedTouches)spawnRipple(t.clientX,t.clientY,false)},{passive:true});
    document.addEventListener('touchend',e=>{for(const t of e.changedTouches)spawnRipple(t.clientX,t.clientY,true)},{passive:true});
  }else{
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
    function animateRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animateRing)}
    animateRing();
    document.querySelectorAll('a,button,input,select,textarea').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(2)';ring.style.transform='translate(-50%,-50%) scale(1.5)';ring.style.opacity='.3'});
      el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)';ring.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='.6'});
    });
  }
}

const currentPage=window.location.pathname.split('/').pop()||'index.html';
window.addEventListener('pageshow',()=>{
  const shell=document.querySelector('.page-shell');
  if(shell)shell.classList.remove('is-leaving');
});

document.querySelectorAll('nav a[href], footer a[href]').forEach(link=>{
  const href=link.getAttribute('href');
  if(href===currentPage||(currentPage===''&&href==='index.html'))link.classList.add('active');
});

const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  });
},{threshold:.1});
reveals.forEach(reveal=>observer.observe(reveal));

const contactForm=document.querySelector('.contact-form form');
if(contactForm){
  contactForm.addEventListener('submit',event=>{
    event.preventDefault();
    const status=document.querySelector('.form-status');
    if(status)status.textContent='Thanks — your project details are ready to send. Connect this form to your email tool or backend to receive submissions.';
    contactForm.reset();
  });
}
