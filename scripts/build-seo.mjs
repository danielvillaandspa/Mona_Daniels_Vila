import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
const villa=process.cwd();
function addHead(d,{domain,url,title,description,lang,alternates,image,graph}) {
 d.querySelector('title').textContent=title;
 for(const sel of ['meta[name="description"]','link[rel="canonical"]','link[hreflang]','script[type="application/ld+json"]','meta[property^="og:"]','meta[name^="twitter:"]'])d.querySelectorAll(sel).forEach(e=>e.remove());
 const meta=(key,value,attr='name')=>{const e=d.createElement('meta');e.setAttribute(attr,key);e.content=value;d.head.append(e);};
 meta('description',description);meta('robots','index,follow,max-image-preview:large');
 const link=(rel,href,lang)=>{const e=d.createElement('link');e.rel=rel;e.href=href;if(lang)e.hreflang=lang;d.head.append(e);};
 link('canonical',url);
 for(const [l,u] of Object.entries(alternates))link('alternate',u,l);
 for(const [key,value] of Object.entries({title,description,url,type:'website',site_name:domain==='shoparomify.store'?'Aromifystore':"Daniel's Villa & Spa",image,locale:{he:'he_IL',ar:'ar_IL',en:'en_US'}[lang]}))meta('og:'+key,value,'property');
 meta('twitter:card','summary_large_image');meta('twitter:title',title);meta('twitter:description',description);meta('twitter:image',image);
 const e=d.createElement('script');e.type='application/ld+json';e.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');d.head.append(e);
}
function saveSitemap(dir,domain,urls) {
 fs.writeFileSync(path.join(dir,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+u+'</loc></url>').join('\n')+'\n</urlset>\n');
 fs.writeFileSync(path.join(dir,'robots.txt'),'User-agent: *\nAllow: /\n\nSitemap: https://'+domain+'/sitemap.xml\n');
}
const villaCopy={
 he:["Daniel's Villa & Spa | וילה עם בריכה וספא בעוספיה","דניאל'ס וילה וספא בעוספיה, על הכרמל: בריכה מחוממת, ג'קוזי, סאונה, חדרים וגינה. צפו בתמונות ופנו אלינו לבירור זמינות והזמנות."],
 ar:['فيلا دانيالز وسبا في عسفيا | Daniel’s Villa & Spa','فيلا دانيالز وسبا في عسفيا على جبل الكرمل: مسبح مدفأ، جاكوزي، ساونا، غرف وحديقة. شاهد الصور وتواصل معنا للاستفسار عن التوفر والحجز.'],
 en:["Daniel's Villa & Spa | Villa with Pool in Isfiya","Discover Daniel's Villa & Spa in Isfiya on Mount Carmel, with a heated pool, jacuzzi, sauna, rooms and garden. View photos and contact us for availability."]
};
const vt=path.join(villa,'scripts/seo-template.html');if(!fs.existsSync(vt))fs.copyFileSync(path.join(villa,'index.html'),vt);
const vtemplate=fs.readFileSync(vt,'utf8'),vurls=[];
for(const lang of ['he','ar','en']) {
 const file=lang==='he'?'index.html':'index-'+lang+'.html',url='https://danielvillaspa.site/'+(lang==='he'?'':file),dom=new JSDOM(vtemplate),d=dom.window.document;
 d.documentElement.lang=lang;d.documentElement.dir=lang==='en'?'ltr':'rtl';d.body.className='lang-'+lang;
 d.querySelectorAll('[data-'+lang+']').forEach(el=>el.innerHTML=el.getAttribute('data-'+lang));
 d.querySelectorAll('.lbtn').forEach(el=>{const l=el.getAttribute('onclick').match(/'(he|en|ar)'/)[1];const a=d.createElement('a');a.className='lbtn'+(l===lang?' active':'');a.href=l==='he'?'/':'/index-'+l+'.html';a.textContent={he:'עברית',ar:'العربية',en:'English'}[l];el.replaceWith(a);});
 d.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
 d.querySelector('script[src="assets/js/app.js"]').src='assets/js/seo-app.js?v=seo-20260913';
 d.querySelectorAll('.rev').forEach(e=>e.classList.add('vis'));
 const [title,description]=villaCopy[lang],home='https://danielvillaspa.site/';
 addHead(d,{domain:'danielvillaspa.site',url,title,description,lang,alternates:{he:home,ar:home+'index-ar.html',en:home+'index-en.html','x-default':home},image:home+'IMG_9049.jpeg',graph:[{'@type':'WebSite','@id':home+'#website',name:"Daniel's Villa & Spa",alternateName:['فيلا دانيالز وسبا',"דניאל'ס וילה וספא"],url:home,inLanguage:['he','ar','en']},{'@type':'LodgingBusiness','@id':home+'#business',name:"Daniel's Villa & Spa",url:home,image:home+'IMG_9049.jpeg',description,telephone:'+972507771781',address:{'@type':'PostalAddress',addressLocality:'Isfiya',addressCountry:'IL'}},{'@type':'WebPage',url,name:title,inLanguage:lang,isPartOf:{'@id':home+'#website'}}]});
 fs.writeFileSync(path.join(villa,file),dom.serialize());vurls.push(url);dom.window.close();
}
let va=fs.readFileSync(path.join(villa,'assets/js/app.js'),'utf8');
va=va.replace("const d={he:","if(!['he','en','ar'].includes(lang)) lang='he';\n      const d={he:");
va=va.replace("b.getAttribute('onclick').includes(\"'\"+lang+\"'\")","(b.getAttribute('onclick')||'').includes(\"'\"+lang+\"'\") || b.getAttribute('href')===(lang==='he'?'/':'/index-'+lang+'.html')");
va=va.replace("setLang(localStorage.getItem('dvl')||'he');","setLang(document.documentElement.lang || 'he');");
va=va.replace("localStorage.setItem('dvl',lang);","try { localStorage.setItem('dvl',lang); } catch {};");
fs.writeFileSync(path.join(villa,'assets/js/seo-app.js'),va);saveSitemap(villa,'danielvillaspa.site',vurls);
console.log('Built '+vurls.length+' villa pages');
