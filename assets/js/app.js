
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('sc', scrollY > 60));

    const slides = document.querySelectorAll('.hs');
    let si = 0;
    setInterval(() => {
      slides[si].classList.remove('on');
      si = (si + 1) % slides.length;
      slides[si].classList.add('on');
    }, 5000);

    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('vis'); ro.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.rev').forEach(el => ro.observe(el));

    const imgs = [
      'IMG_9049.jpeg','IMG_9044.jpeg','IMG_9045.jpeg','IMG_9043.jpeg',
      'IMG_9050.jpeg','IMG_9051.jpeg','IMG_9047.jpeg','IMG_9053.jpeg',
      'IMG_9037.jpeg','IMG_9041.jpeg','IMG_9048.jpeg','IMG_9042.jpeg',
      'IMG_9046.jpeg','IMG_9039.jpeg','IMG_9040.jpeg','IMG_9036.jpeg',
      'IMG_9052.jpeg','IMG_9038.jpeg'
    ];
    let lbi = 0;
    function openLb(i){ lbi=i; document.getElementById('lbImg').src=imgs[i]; document.getElementById('lbCnt').textContent=(i+1)+' / '+imgs.length; document.getElementById('lb').classList.add('open') }
    function closeLb(){ document.getElementById('lb').classList.remove('open') }
    function lbNav(d){ lbi=(lbi+d+imgs.length)%imgs.length; openLb(lbi) }
    document.getElementById('lb').addEventListener('click', e => { if(e.target===document.getElementById('lb')) closeLb() });
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeLb(); if(e.key==='ArrowLeft') lbNav(-1); if(e.key==='ArrowRight') lbNav(1) });

    function setLang(lang){
      const d={he:'rtl',en:'ltr',ar:'rtl'};
      const f={he:"'Frank Ruhl Libre',serif",en:"'Montserrat',sans-serif",ar:"'Tajawal',sans-serif"};
      document.documentElement.setAttribute('lang',lang);
      document.documentElement.setAttribute('dir',d[lang]);
      document.body.className='lang-'+lang;
      document.body.style.fontFamily=f[lang];
      document.querySelectorAll('.lbtn').forEach(b=>b.classList.toggle('active',b.getAttribute('onclick').includes("'"+lang+"'")));
      document.querySelectorAll('[data-'+lang+']').forEach(el=>el.innerHTML=el.getAttribute('data-'+lang));
      localStorage.setItem('dvl',lang);
    }
    setLang(localStorage.getItem('dvl')||'he');
  