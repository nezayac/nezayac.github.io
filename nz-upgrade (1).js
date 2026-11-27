/* Не Заяц — nz-upgrade.js
   Подключить ПОСЛЕ основного скрипта: <script src="nz-upgrade.js"></script> перед </body> */
(function(){
'use strict';
var $=function(id){return document.getElementById(id)};

/* ============ CSS: жидкое мокрое стекло + фиксы Android ============ */
var CSS=`
html{background:#0b1a14}
body{background:transparent!important;--g1:rgba(255,255,255,.74);--g2:rgba(255,255,255,.4);--gb:rgba(255,255,255,.8);--gm:rgba(255,255,255,.9);
--gs:0 10px 28px rgba(10,40,60,.16),inset 0 1.5px 1px rgba(255,255,255,.95),inset 0 -12px 22px rgba(255,255,255,.2),inset 0 0 0 1px rgba(255,255,255,.3)}
body[data-theme=dark]{--g1:rgba(24,56,40,.66);--g2:rgba(6,20,13,.46);--gb:rgba(255,255,255,.15);--gm:rgba(7,24,15,.93);
--gs:0 10px 28px rgba(0,0,0,.5),inset 0 1.5px 1px rgba(255,255,255,.26),inset 0 -12px 22px rgba(255,255,255,.03)}
button{touch-action:manipulation}
#app{background:transparent!important;box-shadow:none!important}
html,body{position:fixed;inset:0;width:100%;height:100%}
#app{height:100%!important}
@media(min-width:900px){#app{height:calc(100% - 40px)!important}}
.ls{overscroll-behavior:contain}
*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
body.nz-lite *,body.nz-lite *::before,body.nz-lite *::after{animation:none!important;transition:none!important}
body.nz-lite #nz-fx{display:none}

/* --- анти-мигание: убираем бесконечные и тяжёлые анимации --- */
#bg-anim{display:none!important}
.alert-banner,.hero::before,.r-timer-top{animation:none!important}
.ripple{display:none!important}
.vw.on{animation:none!important}
@keyframes nzFade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){#nz-fx{display:none}}

/* --- стекло --- */
.form-card,.feature-card,.post,.rating-summary,.review,.list-block,.route,.sched-item,.station-header,.info-block,.stops-table,.cat-header,.route-diagram,.skeleton-card,.date-chip,.sort-btn,.filter-btn,.dir-switch,#homeWeatherMain>div{
background:linear-gradient(145deg,var(--g1),var(--g2))!important;border:1px solid var(--gb)!important;box-shadow:var(--gs)!important}
.date-chip.on,.filter-btn.on{background:linear-gradient(135deg,var(--green),var(--green-mid))!important;color:#fff;border-color:var(--green-dark)!important}
.sort-btn.on{background:rgba(31,156,86,.3)!important}
.route.cancelled{background-image:linear-gradient(135deg,rgba(217,32,32,.16),transparent)!important}
.route.delayed{background-image:linear-gradient(135deg,rgba(245,180,0,.18),transparent)!important}
.r-foot{background:rgba(120,150,130,.12)!important;border-top-color:var(--gb)!important}
.hd,.nav{background:var(--gm)!important;border-color:var(--gb)!important;
}
.mo{background:rgba(4,16,10,.62)!important}
.mbox{background:var(--gm)!important}
.form-card{position:relative;overflow:hidden}
.route,.sched-item{position:relative;overflow:hidden}
/* капли и блик на стекле */
.hero::after,.form-card::after,.feature-card::after,.station-header::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;
background:radial-gradient(ellipse 70% 26% at 28% -2%,rgba(255,255,255,.42),transparent 72%),
radial-gradient(circle at 35% 30%,#fff 0 12%,rgba(255,255,255,.28) 38%,rgba(0,40,30,.14) 100%) 9% 14%/9px 9px no-repeat,
radial-gradient(circle at 35% 30%,#fff 0 12%,rgba(255,255,255,.28) 38%,rgba(0,40,30,.14) 100%) 91% 28%/6px 6px no-repeat,
radial-gradient(circle at 35% 30%,#fff 0 12%,rgba(255,255,255,.28) 38%,rgba(0,40,30,.14) 100%) 78% 88%/11px 11px no-repeat,
radial-gradient(circle at 35% 30%,#fff 0 12%,rgba(255,255,255,.28) 38%,rgba(0,40,30,.14) 100%) 18% 92%/5px 5px no-repeat}

/* --- фикс вертикального текста в карточке рейса --- */
.r-foot .model-chip,.r-foot .r-num{order:0}
.r-foot>span.r-action{order:1;margin-left:auto}
.r-foot>div{order:2;flex:1 1 100%;display:flex;flex-wrap:wrap;gap:6px!important;margin-left:0!important}
.r-foot .r-title{order:3;flex:1 1 100%;min-width:100%;word-break:normal;overflow-wrap:break-word}
.r-station{word-break:normal;overflow-wrap:break-word}

/* --- 15. цветовая индикация задержек --- */
.route.dl-y::before,.route.dl-r::before,.sched-item.dl-y::before,.sched-item.dl-r::before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;z-index:3}
.dl-y::before{background:#f5b400}.dl-r::before{background:#e5252a}

/* --- 13. плавное появление карточек --- */
@keyframes nzCardIn{from{opacity:0;transform:translate3d(0,26px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
.routes-list>.route,.cat-section>.sched-item{animation:nzCardIn .5s cubic-bezier(.22,.8,.24,1) backwards}
.no-anim .route,.no-anim .sched-item{animation:none!important}

/* --- 3. Мой поезд / 1. Поделиться --- */
.r-foot .nz-star{background:transparent;color:var(--txt3);width:auto;padding:4px 8px}
.r-foot .nz-star.on{color:#f5b400}
.route.pinned{border-color:#f5b400!important}
.nz-share{display:flex;border-top:1px solid var(--gb)}
.nz-share button{flex:1;padding:11px;font:700 11.5px Unbounded,sans-serif;color:var(--green);display:flex;gap:6px;align-items:center;justify-content:center}

/* --- небо --- */
#nz-sky{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
#nz-sky i,#nz-sky canvas,#nz-sky b{position:absolute;inset:0;width:100%;height:100%}
#nz-sky i{opacity:0;transition:opacity 1.4s ease}
#nz-sky i.on{opacity:1}
#nz-sky b{transition:background .6s}
body[data-theme=dark] #nz-sky b{background:rgba(0,8,4,.5)}
body[data-sky=dark]:not([data-theme=dark]) .section-title,body[data-sky=dark]:not([data-theme=dark]) .em .t,body[data-sky=dark]:not([data-theme=dark]) .em .d{color:#eaf3ff}

/* --- 19. пасхалка --- */
.nz-hare{position:fixed;inset:0;z-index:20000;pointer-events:none;background:rgba(0,0,0,.25);animation:nzFade .3s}
.nz-h-e{position:absolute;bottom:34%;left:calc(50% - 50px);font-size:100px;line-height:1;animation:nzRun 1.3s cubic-bezier(.2,.7,.3,1) both}
.nz-h-e span{display:block;animation:nzHop .32s ease-in-out 4}
.nz-h-e.go{animation:nzGo .9s ease-in both}
.nz-h-b{position:absolute;bottom:calc(34% + 120px);left:50%;transform:translateX(-50%);background:#fff;color:#08170f;font:800 15px Unbounded,sans-serif;padding:12px 18px;border-radius:18px;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.3);animation:nzFade .3s 1.3s both}
@keyframes nzRun{from{transform:translateX(-80vw)}to{transform:none}}
@keyframes nzGo{from{transform:none}to{transform:translateX(120vw)}}
@keyframes nzHop{50%{transform:translateY(-26px)}}
.route,.sched-item{box-shadow:0 4px 12px rgba(10,40,60,.12),inset 0 1px 0 rgba(255,255,255,.9)!important}
body[data-theme=dark] .route,body[data-theme=dark] .sched-item{box-shadow:0 4px 12px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.18)!important}
.nz-nb{flex-shrink:0;position:relative;z-index:30;margin:10px 14px 2px;padding:12px 44px 12px 16px;border-radius:18px;background:linear-gradient(135deg,#ff9f1c,#ff5e3a 55%,#e5252a);color:#fff;box-shadow:0 10px 24px rgba(229,37,42,.35),inset 0 1.5px 1px rgba(255,255,255,.5)}
.nz-nb b{display:block;font:400 15px/1.2 'Rubik Mono One',Unbounded,sans-serif;text-transform:uppercase}
.nz-nb span{display:block;margin-top:5px;font:600 11.5px/1.3 Inter,sans-serif}
.nz-nb button{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:9px;background:rgba(255,255,255,.25);color:#fff;font-size:13px}
.nz-ghost{margin-left:auto;font-size:8px;padding:2px 6px;border-radius:5px;border:1.5px dashed #ff5e3a;color:#ff5e3a;font-weight:700;letter-spacing:.4px;text-decoration:line-through;flex-shrink:0}
#nz-arrow{position:absolute;left:0;top:0;width:100%;height:100%;z-index:60;pointer-events:none;overflow:visible}
`;
var st=document.createElement('style');
var stag='';for(var i=1;i<=12;i++){stag+='.routes-list>:nth-child('+i+'){animation-delay:'+((i-1)*45)+'ms}.cat-section>:nth-child('+(i+1)+'){animation-delay:'+((i-1)*40)+'ms}'}
st.textContent=CSS+stag+'.routes-list>:nth-child(n+13),.cat-section>:nth-child(n+14){animation-delay:540ms}';
document.head.appendChild(st);

/* ============ Небо по погоде ============ */
var SKY={
clear_d:'radial-gradient(circle at 82% 8%,rgba(255,244,190,.95) 0 6%,rgba(255,236,150,.35) 14%,transparent 34%),linear-gradient(180deg,#3d9bff,#8ad0ff 55%,#dcf2ff)',
clear_n:'radial-gradient(circle at 20% 12%,#fff 0 1px,transparent 2px),radial-gradient(circle at 70% 22%,#fff 0 1px,transparent 2px),radial-gradient(circle at 45% 8%,#fff 0 1.5px,transparent 2.5px),radial-gradient(circle at 88% 40%,#fff 0 1px,transparent 2px),radial-gradient(circle at 10% 50%,#fff 0 1px,transparent 2px),linear-gradient(180deg,#040a22,#13265a 60%,#2b4380)',
clouds_d:'radial-gradient(ellipse 60% 18% at 25% 14%,rgba(255,255,255,.55),transparent 70%),radial-gradient(ellipse 55% 16% at 80% 30%,rgba(255,255,255,.45),transparent 70%),linear-gradient(180deg,#768fa8,#aebfce 60%,#dbe4eb)',
clouds_n:'linear-gradient(180deg,#171f2e,#2c3a4d 70%,#3a4a60)',
rain_d:'linear-gradient(180deg,#46596b,#728a99 60%,#a1b2bd)',
rain_n:'linear-gradient(180deg,#0a121c,#192836 70%,#26394a)',
storm:'linear-gradient(180deg,#1a1c2b,#363b55 70%,#4a5170)',
snow_d:'linear-gradient(180deg,#9bb2cc,#d2e0ee 60%,#f4f8fc)',
snow_n:'linear-gradient(180deg,#222d44,#465674 70%,#62759a)',
fog:'linear-gradient(180deg,#98a3a6,#c1c9cb 70%,#dde2e3)'};
var sky=document.createElement('div');sky.id='nz-sky';
Object.keys(SKY).forEach(function(k){var e=document.createElement('i');e.dataset.k=k;e.style.background=SKY[k];sky.appendChild(e)});
var cv=document.createElement('canvas');cv.id='nz-fx';sky.appendChild(cv);sky.appendChild(document.createElement('b'));
document.body.insertBefore(sky,document.body.firstChild);

var cx=cv.getContext('2d'),mode=null,P=[],raf=0,last=0;
function fit(){cv.width=innerWidth;cv.height=innerHeight}
function mk(){var n=innerWidth<500?36:60;P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*cv.width,y:Math.random()*cv.height,v:mode==='rain'?9+Math.random()*7:.6+Math.random()*1.2,s:mode==='rain'?8+Math.random()*10:1.5+Math.random()*2.5,d:Math.random()*6})}
function frame(t){raf=requestAnimationFrame(frame);if(t-last<42||scrolling)return;last=t;cx.clearRect(0,0,cv.width,cv.height);
 if(mode==='rain'){cx.strokeStyle='rgba(255,255,255,.35)';cx.lineWidth=1.2;cx.beginPath();P.forEach(function(p){cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.s*.25,p.y+p.s);p.y+=p.v;p.x-=p.v*.2;if(p.y>cv.height){p.y=-12;p.x=Math.random()*cv.width+40}});cx.stroke()}
 else{cx.fillStyle='rgba(255,255,255,.85)';P.forEach(function(p){cx.beginPath();cx.arc(p.x,p.y,p.s,0,6.283);cx.fill();p.y+=p.v;p.x+=Math.sin((p.y+p.d*50)/40)*.5;if(p.y>cv.height){p.y=-5;p.x=Math.random()*cv.width}})}}
function setFx(m){mode=m;cancelAnimationFrame(raf);cx.clearRect(0,0,cv.width,cv.height);if(!m||matchMedia('(prefers-reduced-motion: reduce)').matches)return;fit();mk();raf=requestAnimationFrame(frame)}
document.addEventListener('visibilitychange',function(){if(document.hidden)cancelAnimationFrame(raf);else if(mode)raf=requestAnimationFrame(frame)});
addEventListener('resize',function(){if(mode)fit()});
var scrolling=false,sT;addEventListener('scroll',function(){scrolling=true;clearTimeout(sT);sT=setTimeout(function(){scrolling=false},140)},true);

function skyKey(d){
 if(!d||!d.weather||!d.weather[0])return'clear_d';
 var w=d.weather[0],id=w.id,n=/n$/.test(w.icon||''),k;
 if(id>=200&&id<300)return'storm';
 if(id>=300&&id<600)return n?'rain_n':'rain_d';
 if(id>=700&&id<800)return'fog';
 k=id>=600&&id<700?'snow':id===800?'clear':'clouds';
 return k+(n?'_n':'_d')}
function setSky(d){
 var k=skyKey(d);
 sky.querySelectorAll('i').forEach(function(e){e.classList.toggle('on',e.dataset.k===k)});
 document.body.dataset.sky=(/_n$|storm/.test(k))?'dark':'light';
 var m=/^rain|storm/.test(k)?'rain':/^snow/.test(k)?'snow':null;
 if(m!==mode)setFx(m)}

window.loadWeatherMainV2=async function(){
 var box=$('homeWeatherMain'),d=null;
 try{var r=await fetch(OWM_PROXY+'?lat=55.75&lon=37.61');d=await r.json();if(d.cod!==200)throw 0;try{localStorage.setItem('nz_wx',JSON.stringify(d))}catch(e){}}
 catch(e){try{d=JSON.parse(localStorage.getItem('nz_wx')||'null')}catch(x){d=null}}
 setSky(d);
 if(!box)return;
 if(!d||!d.main){box.innerHTML='';return}
 var w=d.weather[0];
 box.innerHTML='<div style="border-radius:20px;padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:14px"><img src="https://openweathermap.org/img/wn/'+w.icon+'@2x.png" width="50" height="50" alt=""><div><div style="font-family:Unbounded;font-size:20px;font-weight:800">'+Math.round(d.main.temp)+'°C</div><div style="font-size:12px;color:var(--txt2)">'+esc(w.description)+'</div></div><div style="margin-left:auto;font-size:11px;color:var(--txt3);text-align:right">Погода в<br>Москве</div></div>'};

/* ============ 3. Мой поезд ============ */
var MT='nz_mytrains';
function mtLoad(){try{return JSON.parse(localStorage.getItem(MT)||'[]')}catch(e){return[]}}
function mtSave(a){try{localStorage.setItem(MT,JSON.stringify(a))}catch(e){}try{if(currentUID)db.ref('users/'+currentUID+'/myTrains').set(a)}catch(e){}}
function isMy(uid){return mtLoad().some(function(t){return t.uid===uid})}
function rerender(){var b=$('routeResults');if(b&&b._segments){window.__nzNoAnim=true;renderRouteResults(b._segments,b,dateToYmd(routeDate))}}

window.nzToggleMy=function(token){
 var s=window['_routeSegments_'+token];if(!s)return;
 var th=getFirstThread(s);if(!th||!th.uid)return;
 var a=mtLoad();
 if(a.some(function(t){return t.uid===th.uid})){a=a.filter(function(t){return t.uid!==th.uid});toast('Убрано из «Моих поездов»')}
 else{a.push({uid:th.uid,num:extractThreadNumber({thread:th}),dep:s.departure,from:fromStation?fromStation.title:'',to:toStation?toStation.title:''});toast('★ Поезд закреплён. Напомню за 15 и 5 минут');
  if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}
 mtSave(a);rerender();renderMyTrains()};

function nzNotify(title,body){
 toast(title+' — '+body);
 try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}
 if(window.Notification&&Notification.permission==='granted'){
  navigator.serviceWorker&&navigator.serviceWorker.getRegistration().then(function(reg){
   var o={body:body,icon:'535AC982-E720-4BE0-B005-04BCB460C40B.png',tag:'nz-my'};
   if(reg)reg.showNotification(title,o);else try{new Notification(title,o)}catch(e){}
  }).catch(function(){})}}

var baseTitle=document.title,tc=document.querySelector('meta[name=theme-color]');
function mtTick(){
 var a=mtLoad(),now=Date.now(),ch=false,keep=[],minM=null;
 a.forEach(function(t){
  var m=Math.round((new Date(t.dep).getTime()-now)/60000);
  if(m<-15){ch=true;return}
  var hm=fmtHM(t.dep);
  if(m<=15&&m>5&&!t.n15){t.n15=true;ch=true;nzNotify('🚆 '+t.num+': через '+m+' мин',t.from+' → '+t.to+', отправление в '+hm)}
  if(m<=5&&m>=0&&!t.n5){t.n5=t.n15=true;ch=true;nzNotify('🚆 Поезд подъезжает!',t.num+' · '+t.from+', отправление в '+hm)}
  if(m>=0&&(minM===null||m<minM))minM=m;
  keep.push(t)});
 if(ch)mtSave(keep);
 var nt,nc;
 if(minM!==null&&minM<=15){nt='🚆 через '+minM+' мин — Не Заяц';nc=minM<=5?'#e5252a':'#f5b400'}else{nt=baseTitle;nc='#0a3d24'}
 if(document.title!==nt)document.title=nt;
 if(tc&&tc.content!==nc)tc.content=nc;
 renderMyTrains()}

function renderMyTrains(){
 var hb=$('homeFavsBlock');if(!hb)return;
 var box=$('nzMyTrains');if(!box){box=document.createElement('div');box.id='nzMyTrains';hb.parentNode.insertBefore(box,hb)}
 var a=mtLoad().sort(function(x,y){return new Date(x.dep)-new Date(y.dep)});
 if(!a.length){box.innerHTML='';return}
 box.innerHTML='<div class="section-title">Мои поезда</div>'+a.map(function(t){
  var m=Math.round((new Date(t.dep)-Date.now())/60000);
  var lab=m>0?'через '+(m>=60?Math.floor(m/60)+' ч '+(m%60)+' мин':m+' мин'):'отправляется';
  var c=m>=0&&m<=5?' dl-r':m>=0&&m<=15?' dl-y':'';
  return '<div class="route pinned'+c+'" style="padding:12px 16px 12px 20px;margin-bottom:8px;cursor:pointer" onclick="openRouteDetail(\''+esc(t.uid)+'\')"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><span style="font-family:Unbounded;font-weight:800;font-size:20px">'+fmtHM(t.dep)+'</span><span style="font-size:11px;font-weight:700;color:var(--green)">'+lab+'</span></div><div style="font-size:12px;color:var(--txt2);margin-top:4px">★ '+esc(t.num)+' · '+esc(t.from)+' → '+esc(t.to)+'</div></div>'}).join('')}

var _rf=window.renderFavorites;
window.renderFavorites=function(){_rf();renderMyTrains()};

var _ss=window.sortSegments;
window.sortSegments=function(seg){
 var r=_ss(seg),my=mtLoad().map(function(t){return t.uid});
 if(!my.length)return r;
 var p=[],o=[];r.forEach(function(s){var th=getFirstThread(s);(th&&my.indexOf(th.uid)>-1?p:o).push(s)});
 return p.concat(o)};

/* ============ 1. Поделиться поездкой ============ */
window.nzShare=async function(token){
 var s=window['_routeSegments_'+token];if(!s)return;
 var th=getFirstThread(s)||{},num=extractThreadNumber({thread:th}),info=detectTrainInfo(th);
 var f=fromStation?fromStation.title:'',t=toStation?toStation.title:'';
 var dep=fmtHM(s.departure),arr=fmtHM(s.arrival);
 var link=th.uid?'https://rasp.yandex.ru/thread/'+th.uid:location.origin;
 var text='Смотри, я еду этим поездом 🚆\n'+dep+' '+f+' → '+arr+' '+t+'\n№'+num+' '+(info.label||'')+'\n'+link+'\nНе Заяц: '+location.origin;
 try{
  try{await document.fonts.load('800 80px Unbounded')}catch(e){}
  var c=document.createElement('canvas');c.width=1080;c.height=1080;var g=c.getContext('2d');
  var bg=g.createLinearGradient(0,0,1080,1080);bg.addColorStop(0,'#052516');bg.addColorStop(1,'#1f9c56');g.fillStyle=bg;g.fillRect(0,0,1080,1080);
  g.fillStyle='rgba(255,255,255,.14)';g.beginPath();(g.roundRect||g.rect).call(g,70,200,940,680,48);g.fill();
  g.fillStyle='#fff';g.textBaseline='alphabetic';
  g.font='700 40px Unbounded,sans-serif';g.fillText('Я еду этим поездом',110,140);
  g.font='800 150px Unbounded,sans-serif';g.fillText(dep,110,400);g.fillText(arr,110,640);
  g.font='600 44px Unbounded,sans-serif';g.fillText(f.slice(0,22),110,460);g.fillText(t.slice(0,22),110,700);
  g.font='700 48px Unbounded,sans-serif';g.fillStyle='#ffe08a';g.fillText('№'+num+' · '+(info.label||'Электричка'),110,820);
  g.fillStyle='#fff';g.font='800 56px Unbounded,sans-serif';g.fillText('Не Заяц',110,975);
  g.font='500 34px Inter,sans-serif';g.fillText(location.host,110,1030);
  var blob=await new Promise(function(r){c.toBlob(r,'image/png')});
  var file=new File([blob],'nezayac.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text:text});return}
  if(navigator.share){await navigator.share({text:text});return}
  await navigator.clipboard.writeText(text);toast('Текст скопирован — отправь другу')
 }catch(e){if(e&&e.name==='AbortError')return;try{await navigator.clipboard.writeText(text);toast('Текст скопирован — отправь другу')}catch(x){toast('Не удалось поделиться')}}};

/* ============ карточка: задержки, звезда, «поделиться» ============ */
var _rc=window.renderRouteCard;
window.renderRouteCard=function(s,p,t){
 var h=_rc(s,p,t);if(!h)return h;
 var th=getFirstThread(s)||{},uid=th.uid||'',stt=getStatusInfo(s),cls='';
 if(stt.code==='cancelled')cls=' dl-r';else if(stt.code==='delayed')cls=stt.delay>=20?' dl-r':stt.delay>=5?' dl-y':'';
 var my=isMy(uid);if(my)cls+=' pinned';
 var tk=(h.match(/openRouteDetailByToken\('([^']+)'/)||[])[1]||'';
 h=h.replace('class="route ','class="route'+cls+' ');
 if(my)h=h.replace('<div class="r-mid">','<div class="r-mid"><span class="r-tag comfort">★ Мой поезд</span>');
 h=h.replace('<div style="display:flex;gap:4px;margin-left:auto">','<div class="nz-acts"><button class="r-action nz-star'+(my?' on':'')+'" onclick="event.stopPropagation();nzToggleMy(\''+tk+'\')"><svg class="icon"><use href="#i-star"/></svg></button>');
 var k=h.lastIndexOf('</div>');
 return h.slice(0,k)+'<div class="nz-share"><button onclick="event.stopPropagation();nzShare(\''+tk+'\')"><svg class="icon"><use href="#i-telegram"/></svg> Поделиться поездкой</button></div></div>'};

var _ri=window.renderStationItemNew;
window.renderStationItemNew=function(s,ty,p){
 var h=_ri(s,ty,p),stt=getStatusInfo(s);
 var c=stt.code==='cancelled'||(stt.code==='delayed'&&stt.delay>=20)?' dl-r':(stt.code==='delayed'&&stt.delay>=5?' dl-y':'');
 return c?h.replace('class="sched-item ','class="sched-item'+c+' '):h};

/* повторный рендер того же списка не анимируем (нет «моргания») */
var _rr=window.renderRouteResults;
window.renderRouteResults=function(seg,box,ymd){
 var l=seg[seg.length-1]||{},sig=ymd+'|'+seg.length+'|'+(seg[0]&&seg[0].departure)+'|'+l.arrival;
 box.classList.toggle('no-anim',box.__sig===sig||!!window.__nzNoAnim);
 box.__sig=sig;window.__nzNoAnim=false;return _rr(seg,box,ymd)};
var _rs=window.renderStationScheduleNew;
window.renderStationScheduleNew=function(sc,box,ymd){
 var sig=ymd+'|'+sc.length+'|'+(stationPick&&stationPick.code)+'|'+stationDir;
 box.classList.toggle('no-anim',box.__sig===sig);box.__sig=sig;return _rs(sc,box,ymd)};

/* ============ 19. Пасхалка «ЗАЯЦ» ============ */
function hare(){
 if(window.__hare)return;window.__hare=1;
 var o=document.createElement('div');o.className='nz-hare';
 o.innerHTML='<div class="nz-h-b">Я не заяц, я электричка!</div><div class="nz-h-e"><span>🐇</span></div>';
 document.body.appendChild(o);var e=o.querySelector('.nz-h-e');
 setTimeout(function(){e.firstChild.textContent='🚆';e.classList.add('go')},2500);
 setTimeout(function(){o.remove();window.__hare=0},3500)}
var si=$('stationSearchInput');
if(si)si.addEventListener('input',function(){if(normalizeStr(si.value)==='заяц'){si.blur();hare()}});

/* ============ свайп не мешает прокрутке чипов/списков ============ */
var app=$('app'),sbk=false,sy=0,ey=0;
app.addEventListener('touchstart',function(e){sbk=!!e.target.closest('.date-chips,.sort-bar,.filter-bar,.mbox,.stops-table,input,textarea');sy=ey=e.touches[0].clientY},{passive:true});
app.addEventListener('touchmove',function(e){ey=e.touches[0].clientY},{passive:true});
var _hs=window.handleSwipe;
window.handleSwipe=function(){if(sbk||Math.abs(ey-sy)>60)return;_hs()};

/* ============ починка багов исходника ============ */
window.submitReview=function(){
 if(!currentUID){toast('Войдите');return}
 if(selectedReviewStars<1){toast('Поставь оценку');return}
 var text=$('reviewText').value.trim();
 if(text.length<2){toast('Отзыв слишком короткий');return}
 db.ref('reviews').orderByChild('uid').equalTo(currentUID).once('value',function(snap){
  if(snap.exists()){toast('Вы уже оставляли отзыв!');return}
  db.ref('reviews').push({uid:currentUID,author:currentProfile.nickname||currentProfile.username||'—',stars:selectedReviewStars,text:text,time:Date.now()}).then(function(){
   toast('Спасибо за отзыв!');$('reviewText').value='';selectedReviewStars=0;highlightStars(0);renderReviews()})})};
window.renderHomeStationSettings=window.renderHomeStationSettings||function(){};

/* подтянуть «Мои поезда» из аккаунта */
auth.onAuthStateChanged(function(u){
 if(!u)return;
 db.ref('users/'+u.uid+'/myTrains').once('value').then(function(s){
  var v=s.val();if(v&&!mtLoad().length){localStorage.setItem(MT,JSON.stringify(v));renderMyTrains()}}).catch(function(){})});

/* ===== не перерисовываем блок, если HTML не изменился ===== */
(function(){
 var d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'),K={homeQuickRoute:1,homeFavsBlock:1,homeAlertBlock:1,homeWeatherMain:1,homeNewsBlock:1,homeStationBtnBlock:1,nzMyTrains:1,newsFeed:1,routeAlertBlock:1};
 if(!d||!d.set)return;
 Object.defineProperty(Element.prototype,'innerHTML',{get:d.get,configurable:true,set:function(v){if(this.id&&K[this.id]){if(this.__h===v)return;this.__h=v}d.set.call(this,v)}});
})();
/* тема: пишем в базу только при реальной смене (иначе цикл перерисовок) */
window.applyTheme=function(th){
 if(th!=='dark')th='light';
 if(document.body.getAttribute('data-theme')!==th)document.body.setAttribute('data-theme',th);
 try{localStorage.setItem('nz_theme',th)}catch(e){}
 if(currentUID&&(!currentProfile||currentProfile.theme!==th))db.ref('users/'+currentUID+'/theme').set(th)};
if(/[?&]lite/.test(location.search))document.body.classList.add('nz-lite');

/* ===== Больше не бета ===== */
var VERSION='2.0';
document.querySelectorAll('.ver').forEach(function(e){e.remove()});
document.querySelectorAll('#aboutOverlay div').forEach(function(e){if(/Версия/.test(e.textContent)&&!e.children.length)e.textContent='Версия '+VERSION});
if(!localStorage.getItem('nz_nobeta')){
 var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap';document.head.appendChild(fl);
 var hd=document.querySelector('.hd'),tn=document.querySelector('.hd .tname');
 var gh=document.createElement('span');gh.className='nz-ghost';gh.textContent='BETA';tn.appendChild(gh);
 var nb=document.createElement('div');nb.className='nz-nb';
 nb.innerHTML='<b>🎉 Мы больше не в бете!</b><span>Не Заяц '+VERSION+' — спасибо, что тестировали с нами 💚</span><button aria-label="Закрыть">✕</button>';
 hd.parentNode.insertBefore(nb,hd.nextSibling);
 var ar=document.createElementNS('http://www.w3.org/2000/svg','svg');ar.id='nz-arrow';app.appendChild(ar);
 var place=function(){
  if(!nb.isConnected)return;
  var A=app.getBoundingClientRect(),G=gh.getBoundingClientRect(),B=nb.getBoundingClientRect();
  var ex=G.left+G.width/2-A.left,ey=G.bottom-A.top+5,sx=ex-40,sy=B.top-A.top+3,cxp=ex-34,cyp=ey+(sy-ey)*.45;
  var dx=ex-cxp,dy=ey-cyp,L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;
  var hp=function(a){return[ex-(dx*Math.cos(a)-dy*Math.sin(a))*12,ey-(dx*Math.sin(a)+dy*Math.cos(a))*12]};
  var h1=hp(.5),h2=hp(-.5);
  var p='M'+sx+' '+sy+' Q'+cxp+' '+cyp+' '+ex+' '+ey,h='M'+h1[0]+' '+h1[1]+' L'+ex+' '+ey+' L'+h2[0]+' '+h2[1];
  ar.innerHTML='<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="'+p+'" stroke="#fff" stroke-width="7"/><path d="'+h+'" stroke="#fff" stroke-width="7"/><path d="'+p+'" stroke="#ff5e3a" stroke-width="3.5"/><path d="'+h+'" stroke="#ff5e3a" stroke-width="3.5"/></g>'};
 nb.querySelector('button').onclick=function(){localStorage.setItem('nz_nobeta','1');nb.remove();gh.remove();ar.remove()};
 place();setTimeout(place,300);addEventListener('resize',place);
 if(document.fonts)document.fonts.load("15px 'Rubik Mono One'").then(place,function(){});
 if(window.ResizeObserver){var ro=new ResizeObserver(place);ro.observe(nb);ro.observe(tn);ro.observe(app)}
}

/* старт */
try{var c0=JSON.parse(localStorage.getItem('nz_wx')||'null');if(c0)setSky(c0)}catch(e){}
try{renderHomeStationButton()}catch(e){}
renderMyTrains();mtTick();setInterval(mtTick,20000);
window.loadWeatherMainV2();setInterval(window.loadWeatherMainV2,900000);
})();
