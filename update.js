/* Не Заяц — обнова 2.0: вход, каналы, liquid glass, фиксы. Подключается ПОСЛЕ основного скрипта. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const E=s=>esc(s);

/* ================= CSS ================= */
const css=`
:root{--gl:rgba(255,255,255,.55);--glm:rgba(255,255,255,.8);--glb:rgba(255,255,255,.75);--glsh:0 10px 34px rgba(10,61,36,.13)}
[data-theme="dark"]{--gl:rgba(12,34,22,.55);--glm:rgba(8,26,16,.82);--glb:rgba(120,255,170,.16);--glsh:0 10px 34px rgba(0,0,0,.5)}
#app{background:var(--bg)}
.nz-blobs{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.nz-blobs i{position:absolute;border-radius:50%;filter:blur(52px);opacity:.5;animation:nzBlob 18s ease-in-out infinite}
.nz-blobs i:nth-child(1){width:290px;height:290px;background:#1f9c56;top:-70px;left:-90px}
.nz-blobs i:nth-child(2){width:250px;height:250px;background:#3ddc97;bottom:90px;right:-100px;animation-delay:-6s}
.nz-blobs i:nth-child(3){width:210px;height:210px;background:#2563eb;top:42%;left:28%;opacity:.25;animation-delay:-12s}
@keyframes nzBlob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,40px) scale(1.2)}66%{transform:translate(-40px,70px) scale(.9)}}
.vw{z-index:1}
.hd,.nav{background:var(--gl)!important;backdrop-filter:blur(22px) saturate(1.8);-webkit-backdrop-filter:blur(22px) saturate(1.8)}
.hd{border-bottom:1px solid var(--glb)}
.nav{border-top:1px solid var(--glb)}
.nav-item{font-size:9px;padding-left:2px;padding-right:2px}
.nav-item.on .icon{filter:drop-shadow(0 0 8px var(--green-glow2))}
.hd .logo{animation:nzFloat 4s ease-in-out infinite}
@keyframes nzFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2px) rotate(-3deg)}}
.route:not(.cancelled):not(.delayed),.form-card,.feature-card,.post,.list-block,.sched-item:not(.cancelled):not(.delayed),.review,.rating-summary,.info-block,.stops-table,.route-diagram,.ch-card{
 background:var(--gl)!important;backdrop-filter:blur(16px) saturate(1.6);-webkit-backdrop-filter:blur(16px) saturate(1.6);
 border:1px solid var(--glb)!important;box-shadow:var(--glsh),inset 0 1px 0 rgba(255,255,255,.55),inset 0 -1px 0 rgba(255,255,255,.08)}
.form-card,.post,.ch-card{position:relative;overflow:hidden}
.route::after,.feature-card::after,.form-card::after,.post::after,.ch-card::after,.hero::after,.btn::after,.submit-btn::after{
 content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.38) 50%,transparent 62%);
 transform:translateX(-130%);animation:nzShine 7s ease-in-out infinite}
.feature-card:nth-child(2n)::after,.post:nth-child(2n)::after{animation-delay:-3.5s}
.btn::after,.submit-btn::after{animation-duration:4s}
.btn,.submit-btn{position:relative;overflow:hidden}
@keyframes nzShine{0%,55%{transform:translateX(-130%)}100%{transform:translateX(130%)}}
.hero{background-size:220% 220%!important;animation:nzGrad 10s ease infinite}
.hero{position:relative}
@keyframes nzGrad{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
.vw.on{animation:nzView .45s cubic-bezier(.2,.9,.25,1)}
@keyframes nzView{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
.vw.on .ls>*{animation:nzUp .6s cubic-bezier(.2,.9,.25,1) both}
.vw.on .ls>*:nth-child(2){animation-delay:.05s}.vw.on .ls>*:nth-child(3){animation-delay:.1s}.vw.on .ls>*:nth-child(4){animation-delay:.15s}
.vw.on .ls>*:nth-child(5){animation-delay:.2s}.vw.on .ls>*:nth-child(6){animation-delay:.25s}.vw.on .ls>*:nth-child(n+7){animation-delay:.3s}
.routes-list>*,.ch-card,.nz-post{animation:nzUp .55s cubic-bezier(.2,.9,.25,1) both}
.routes-list>*:nth-child(2),.ch-card:nth-child(2){animation-delay:.06s}.routes-list>*:nth-child(3),.ch-card:nth-child(3){animation-delay:.12s}
.routes-list>*:nth-child(4),.ch-card:nth-child(4){animation-delay:.18s}.routes-list>*:nth-child(n+5),.ch-card:nth-child(n+5){animation-delay:.24s}
@keyframes nzUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.mo{background:rgba(4,16,10,.42)!important;backdrop-filter:blur(14px) saturate(1.4)!important}
.mbox{background:var(--glm)!important;backdrop-filter:blur(30px) saturate(1.8);-webkit-backdrop-filter:blur(30px) saturate(1.8);border:1px solid var(--glb)!important}
.mo.active .mbox{animation:nzPop .5s cubic-bezier(.2,1.25,.3,1)}
@keyframes nzPop{from{opacity:0;transform:translateY(40px) scale(.92)}to{opacity:1;transform:none}}
.btn:active,.submit-btn:active,.feature-card:active,.route:active,.ch-card:active{transform:scale(.96)!important}
/* вход */
#nzGate{position:fixed;inset:0;z-index:20000;display:none;align-items:center;justify-content:center;padding:18px;overflow-y:auto;background:var(--bg)}
#nzGate.on{display:flex;animation:fadeIn .4s}
#nzGate .nz-blobs{position:fixed}
.gate-card{position:relative;z-index:1;width:100%;max-width:420px;border-radius:32px;padding:26px 22px;background:var(--glm);backdrop-filter:blur(30px) saturate(1.8);-webkit-backdrop-filter:blur(30px) saturate(1.8);border:1px solid var(--glb);box-shadow:var(--shadow-lg),inset 0 1px 0 rgba(255,255,255,.7);animation:nzPop .7s cubic-bezier(.2,1.2,.3,1)}
.gate-logo{width:72px;height:72px;border-radius:22px;margin:0 auto 12px;overflow:hidden;background:linear-gradient(135deg,var(--green),var(--green-light));display:flex;align-items:center;justify-content:center;color:#fff;font:800 24px Unbounded,sans-serif;box-shadow:0 10px 30px var(--green-glow2);animation:nzFloat 4s ease-in-out infinite}
.gate-logo img{width:100%;height:100%;object-fit:cover}
.gate-title{font:800 26px Unbounded,sans-serif;text-align:center;letter-spacing:-1px}
.gate-sub{text-align:center;font-size:12px;color:var(--txt3);margin-top:4px}
.gate-tabs{display:flex;background:var(--bg3);border-radius:16px;padding:4px;position:relative;margin:18px 0 14px}
.gate-tabs button{flex:1;padding:11px;position:relative;z-index:1;font:700 12px Unbounded,sans-serif;color:var(--txt2);transition:color .3s}
.gate-tabs button.on{color:#fff}
.gate-pill{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:12px;background:linear-gradient(135deg,var(--green),var(--green-light));box-shadow:0 6px 18px var(--green-glow2);transition:transform .45s cubic-bezier(.3,1.3,.4,1)}
.gate-tabs.reg .gate-pill{transform:translateX(100%)}
.gate-in{width:100%;padding:15px 16px;border-radius:16px;border:1.5px solid var(--line);background:var(--bg3);color:var(--txt);font-size:16px;font-weight:600;outline:none;margin-bottom:10px;transition:border-color .2s,box-shadow .2s}
.gate-in:focus{border-color:var(--green);box-shadow:0 0 0 4px var(--green-glow)}
.gate-chk{display:flex;align-items:center;gap:10px;padding:13px 14px;border-radius:16px;background:var(--bg3);border:1.5px solid var(--line);margin-bottom:10px;font-size:13px;font-weight:600;cursor:pointer;line-height:1.35}
.gate-chk input{width:22px;height:22px;accent-color:var(--green);flex-shrink:0}
.gate-chk a{color:var(--green-mid);text-decoration:underline}
.gate-card:not(.reg) .gate-reg{display:none}
.gate-reg{animation:nzUp .4s both}
.nz-terms{font-size:12.5px;line-height:1.55;color:var(--txt2)}.nz-terms b{color:var(--txt);display:block;margin-top:10px}
#nzTerms{z-index:20001}
/* каналы */
.ch-top{font:800 22px Unbounded,sans-serif;margin-bottom:4px;letter-spacing:-.5px}
.ch-top+div{font-size:12px;color:var(--txt3);margin-bottom:14px}
.ch-card{display:flex;align-items:center;gap:12px;padding:14px;border-radius:22px;margin-bottom:10px;cursor:pointer}
.ch-ava{width:52px;height:52px;border-radius:18px;display:flex;align-items:center;justify-content:center;font:800 20px Unbounded,sans-serif;color:#fff;flex-shrink:0;box-shadow:0 6px 18px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.4)}
.ch-inf{flex:1;min-width:0}
.ch-name{font:800 14px Unbounded,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ch-sub{font-size:11px;color:var(--txt3);margin-top:3px}
.ch-sbtn{padding:9px 13px;border-radius:12px;font:700 11px Unbounded,sans-serif;background:linear-gradient(135deg,var(--green),var(--green-light));color:#fff;flex-shrink:0;box-shadow:0 6px 16px var(--green-glow);transition:all .3s}
.ch-sbtn.on{background:var(--green-soft);color:var(--green);box-shadow:none}
#chOverlay{position:fixed;inset:0;z-index:9000;display:none;justify-content:center;background:rgba(0,0,0,.35);backdrop-filter:blur(8px)}
#chOverlay.on{display:flex}
.ch-page{width:100%;max-width:560px;height:100%;background:var(--bg);display:flex;flex-direction:column;position:relative;overflow:hidden;animation:nzSlide .5s cubic-bezier(.2,.9,.25,1)}
@keyframes nzSlide{from{transform:translateX(100%)}to{transform:none}}
.ch-head{display:flex;align-items:center;gap:10px;padding:12px 14px;padding-top:calc(12px + env(safe-area-inset-top,0px));background:var(--gl);backdrop-filter:blur(22px) saturate(1.8);-webkit-backdrop-filter:blur(22px) saturate(1.8);border-bottom:1px solid var(--glb);position:relative;z-index:2}
.ch-head .ch-ava{width:42px;height:42px;font-size:17px;border-radius:14px}
.ch-body{flex:1;overflow-y:auto;padding:14px 14px 60px;position:relative;z-index:1;-webkit-overflow-scrolling:touch}
.ch-body .post{margin-bottom:12px}
.ch-ib{width:38px;height:38px;border-radius:12px;background:var(--bg3);border:1px solid var(--line);font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rx-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.rx{display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:14px;background:var(--bg3);border:1px solid var(--line);font-size:14px;font-weight:700;transition:transform .25s cubic-bezier(.3,1.7,.4,1),background .2s}
.rx span{font-size:11px;font-family:Unbounded,sans-serif;color:var(--txt2)}
.rx.on{background:var(--green-soft);border-color:var(--green)}
.rx:active{transform:scale(1.3)}
.ch-compose{background:var(--gl);border:1px solid var(--glb);border-radius:20px;padding:12px;margin-bottom:14px}
.ch-compose textarea{width:100%;min-height:70px;border:none;background:transparent;color:var(--txt);font-size:15px;outline:none;resize:vertical;font-family:Inter,sans-serif}
.nz-row{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--line);font-size:13px;font-weight:600}
`;
const stEl=document.createElement('style');stEl.textContent=css;document.head.appendChild(stEl);

/* ================= DOM ================= */
const app=$('app');
const bl=document.createElement('div');bl.className='nz-blobs';bl.innerHTML='<i></i><i></i><i></i>';app.insertBefore(bl,app.firstChild);
document.querySelector('.svg-sprite').insertAdjacentHTML('beforeend','<symbol id="i-mega" viewBox="0 0 24 24"><path d="M3 10v4h3l5 4V6L6 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></symbol>');
document.querySelector('.nav-item[data-tab="news"]').insertAdjacentHTML('afterend','<div class="nav-item ripple-host" data-tab="channels" onclick="switchTab(\'channels\')"><svg class="icon"><use href="#i-mega"/></svg><span>Каналы</span></div>');
$('vwNews').insertAdjacentHTML('afterend','<div class="vw" id="vwChannels"><div class="ls" id="chList"></div></div>');
if(typeof tabsOrder!=='undefined')tabsOrder.splice(4,0,'channels');

document.body.insertAdjacentHTML('beforeend',`
<div id="nzGate"><div class="nz-blobs"><i></i><i></i><i></i></div>
<div class="gate-card" id="gateCard">
 <div class="gate-logo"><img src="535AC982-E720-4BE0-B005-04BCB460C40B.png" alt="" onerror="this.parentNode.textContent='НЗ'"></div>
 <div class="gate-title"><span style="color:var(--red)">Не</span> Заяц</div>
 <div class="gate-sub">Расписание электричек и поездов</div>
 <div class="gate-tabs" id="gateTabs"><span class="gate-pill"></span><button class="on" onclick="gateMode(0)">Вход</button><button onclick="gateMode(1)">Регистрация</button></div>
 <input class="gate-in" id="gNick" placeholder="Ник (a-z, 0-9, _)" maxlength="20" autocapitalize="none" autocomplete="username">
 <input class="gate-in" id="gPass" type="password" placeholder="Пароль" autocomplete="current-password">
 <div class="gate-reg"><input class="gate-in" id="gPass2" type="password" placeholder="Повторите пароль (минимум 8 символов)" autocomplete="new-password"></div>
 <label class="gate-chk"><input type="checkbox" id="gBot"> Я не робот</label>
 <label class="gate-chk gate-reg"><input type="checkbox" id="gTerms"><span>Я принимаю <a onclick="gateTerms(event)">Пользовательское соглашение</a> и <a onclick="gateTerms(event)">Политику конфиденциальности</a></span></label>
 <div class="err" id="gErr"></div>
 <button class="btn ripple-host" id="gBtn" onclick="gateGo()">Войти</button>
</div></div>

<div class="mo" id="nzTerms"><div class="mbox"><button class="mclose" onclick="closeModal('nzTerms')">✕</button><h3>Соглашение</h3><div class="nz-terms">
<b>1. О сервисе</b>«Не Заяц» — информационный сервис. Расписания берутся из Яндекс.Расписаний, точность и актуальность не гарантируются. Проверяйте время отправления на вокзале.
<b>2. Аккаунт</b>Вы отвечаете за свой ник и пароль. Не передавайте пароль другим. Один человек — один аккаунт.
<b>3. Правила</b>Запрещены оскорбления, спам, мошенничество, реклама без согласования, материалы 18+ и призывы к опасным действиям на железной дороге. Модераторы вправе удалять контент и блокировать аккаунты.
<b>4. Каналы</b>Каналы публикуются только после проверки модерацией. Владелец отвечает за публикации в своём канале.
<b>5. Конфиденциальность</b>Мы храним ник, настройки профиля, избранное, комментарии и токен уведомлений. Почту и телефон не запрашиваем, данные не продаём и не передаём третьим лицам.
<b>6. Изменения</b>Правила могут обновляться. Продолжая пользоваться сервисом, вы с ними соглашаетесь.
</div></div></div>

<div id="chOverlay"><div class="ch-page" id="chPage"></div></div>

<div class="mo" id="chNew"><div class="mbox"><button class="mclose" onclick="closeModal('chNew')">✕</button><h3>Новый канал</h3>
<div style="font-size:12px;color:var(--txt2);margin-bottom:12px;line-height:1.5">Заявка уйдёт на модерацию. После одобрения канал появится в списке, и ты сможешь публиковать посты.</div>
<div class="fld"><label>Название</label><input id="chnName" maxlength="30"></div>
<div class="fld"><label>Юзер канала (a-z, 0-9, _, от 4 символов)</label><input id="chnHandle" maxlength="20" autocapitalize="none"></div>
<div class="fld"><label>Описание</label><textarea id="chnDesc" maxlength="200"></textarea></div>
<div class="err" id="chnErr"></div>
<button class="btn ripple-host" onclick="chSubmitReq()">Отправить на модерацию</button></div></div>

<div class="mo" id="chMgr"><div class="mbox"><button class="mclose" onclick="closeModal('chMgr')">✕</button><h3>Управление</h3><div id="chMgrBody"></div></div></div>

<div class="mo" id="nzAChat"><div class="mbox"><button class="mclose" onclick="closeModal('nzAChat')">✕</button><h3 id="nzAChatT">Чат</h3>
<div class="chat-messages" id="nzAChatMsgs"></div>
<div class="comment-form"><input id="nzAChatIn" placeholder="Ответить..." maxlength="500"><button type="button" onclick="adminChatSend()">➤</button></div></div></div>
`);

/* ================= ВХОД ================= */
const gate=$('nzGate');
window.gateMode=function(m){
  $('gateCard').classList.toggle('reg',!!m);$('gateTabs').classList.toggle('reg',!!m);
  $('gateTabs').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===m));
  $('gBtn').textContent=m?'Зарегистрироваться':'Войти';$('gErr').classList.remove('show');
  $('gPass').autocomplete=m?'new-password':'current-password';
};
window.gateTerms=function(e){e.preventDefault();e.stopPropagation();openModal('nzTerms')};
function gErr(t){const e=$('gErr');e.textContent=t;e.classList.add('show');$('gBtn').disabled=false}
window.gateGo=function(){
  const nick=$('gNick').value.trim().toLowerCase(),p=$('gPass').value,reg=$('gateCard').classList.contains('reg');
  $('gErr').classList.remove('show');
  if(!nick||!p)return gErr('Заполни ник и пароль');
  if(!/^[a-z0-9_]{3,20}$/.test(nick))return gErr('Ник: 3–20 символов, a-z, 0-9 и _');
  if(reg){
    if(p.length<8)return gErr('Пароль минимум 8 символов');
    if(p!==$('gPass2').value)return gErr('Пароли не совпадают');
  }
  if(!$('gBot').checked)return gErr('Поставь галочку «Я не робот»');
  if(reg&&!$('gTerms').checked)return gErr('Нужно принять соглашение');
  $('gBtn').disabled=true;
  const email=nick+EMAIL_DOMAIN;
  if(!reg){
    auth.signInWithEmailAndPassword(email,p).then(()=>{$('gBtn').disabled=false;$('gPass').value=''}).catch(e=>{
      gErr(/network/.test(e.code)?'Нет сети':'Неверный ник или пароль')});
    return;
  }
  auth.createUserWithEmailAndPassword(email,p).then(c=>{
    const uid=c.user.uid;
    return db.ref('usernames/'+nick).transaction(cur=>{if(cur!==null&&cur!==undefined)return;return uid}).then(r=>{
      if(!r.committed)return c.user.delete().catch(()=>{}).then(()=>{throw new Error('NICK_TAKEN')});
      return db.ref('users/'+uid).set({uid:uid,username:nick,nickname:nick,isAdmin:ADMIN_UIDS.indexOf(uid)!==-1,theme:'light',online:true,createdAt:Date.now(),lastSeen:Date.now(),bio:'',lastNickChange:0,homeStation:{code:'s2000002',title:'Москва Ярославская'}})
    })
  }).then(()=>{$('gBtn').disabled=false;$('gPass').value='';$('gPass2').value='';toast('Аккаунт создан')}).catch(e=>{
    gErr(e.message==='NICK_TAKEN'||e.code==='auth/email-already-in-use'?'Этот ник уже занят':'Ошибка регистрации')});
};
auth.onAuthStateChanged(u=>{
  gate.classList.toggle('on',!u);
  if(u)db.ref('users/'+u.uid+'/nickname').once('value').then(s=>{const t=document.querySelector('.hero-title');if(t&&s.val())t.textContent='Привет, '+s.val()+'!'}).catch(()=>{});
});

/* ================= КАНАЛЫ ================= */
const RX=['👍','❤️','🔥','😂','😮'];
const CH={cur:null,data:null,draft:'',reqs:[]};
const hue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const ava=(n,h)=>'<div class="ch-ava" style="background:linear-gradient(135deg,hsl('+hue(h)+',70%,42%),hsl('+((hue(h)+55)%360)+',78%,56%))">'+E((n||'?').charAt(0).toUpperCase())+'</div>';
const _sw=window.switchTab;
window.switchTab=function(t){_sw(t);if(t==='channels')renderChannels()};

window.renderChannels=function(){
  const box=$('chList');
  Promise.all([db.ref('channels').once('value'),db.ref('channelSubs').once('value'),isAdmin?db.ref('channelRequests').once('value'):Promise.resolve(null)]).then(r=>{
    const chs=Object.values(r[0].val()||{}),subs=r[1].val()||{};
    CH.reqs=r[2]?Object.entries(r[2].val()||{}).map(([k,v])=>Object.assign({id:k},v)):[];
    chs.sort((a,b)=>Object.keys(subs[b.handle]||{}).length-Object.keys(subs[a.handle]||{}).length);
    let h='<div class="ch-top">Каналы</div><div>Публикации владельцев каналов</div>';
    h+='<button class="btn ripple-host" onclick="chOpenNew()">＋ Создать канал</button><div style="height:10px"></div>';
    if(CH.reqs.length){
      h+='<div class="section-title">На модерации ('+CH.reqs.length+')</div>'+CH.reqs.map(q=>'<div class="ch-card" style="cursor:default">'+ava(q.name,q.handle)+'<div class="ch-inf"><div class="ch-name">'+E(q.name)+'</div><div class="ch-sub">@'+E(q.handle)+' · от '+E(q.ownerNick)+'</div><div class="ch-sub">'+E(q.desc||'')+'</div></div><div style="display:flex;gap:6px"><button class="ch-ib" onclick="chApprove(\''+q.id+'\')">✅</button><button class="ch-ib" onclick="chReject(\''+q.id+'\')">❌</button></div></div>').join('');
    }
    h+='<div class="section-title">Все каналы</div>';
    if(!chs.length)h+='<div class="em"><div class="ic">📢</div><div class="t">Каналов пока нет</div><div class="d">Создай первый!</div></div>';
    else h+=chs.map(c=>{const sb=subs[c.handle]||{},n=Object.keys(sb).length,on=currentUID&&sb[currentUID];
      return '<div class="ch-card ripple-host" onclick="openChannel(\''+c.handle+'\')">'+ava(c.name,c.handle)+'<div class="ch-inf"><div class="ch-name">'+E(c.name)+'</div><div class="ch-sub">@'+E(c.handle)+' · '+n+' подп.</div></div><button class="ch-sbtn'+(on?' on':'')+'" onclick="event.stopPropagation();chSub(\''+c.handle+'\')">'+(on?'Вы подписаны':'Подписаться')+'</button></div>'}).join('');
    box.innerHTML=h;
  }).catch(e=>{box.innerHTML='<div class="em"><div class="ic">📡</div><div class="t">Не загрузилось</div><div class="d">'+E(e.message)+'</div></div>'});
};
window.chOpenNew=function(){if(!currentUID){toast('Войдите');return}$('chnErr').classList.remove('show');openModal('chNew')};
window.chSubmitReq=function(){
  const name=$('chnName').value.trim(),handle=$('chnHandle').value.trim().toLowerCase(),desc=$('chnDesc').value.trim(),er=$('chnErr');
  const bad=t=>{er.textContent=t;er.classList.add('show')};er.classList.remove('show');
  if(name.length<2)return bad('Введи название');
  if(!/^[a-z0-9_]{4,20}$/.test(handle))return bad('Юзер: 4–20 символов, a-z, 0-9, _');
  db.ref('channels/'+handle).once('value').then(s=>{
    if(s.exists())return bad('Этот юзер занят');
    return db.ref('channelRequests').push({name,handle,desc,ownerUid:currentUID,ownerNick:currentProfile.nickname||currentProfile.username||'—',time:Date.now()}).then(()=>{
      closeModal('chNew');$('chnName').value=$('chnHandle').value=$('chnDesc').value='';toast('Отправлено на модерацию ✨')})
  }).catch(()=>bad('Ошибка (проверь правила Firebase)'));
};
window.chApprove=function(id){
  const q=CH.reqs.find(x=>x.id===id);if(!q)return;
  db.ref('channels/'+q.handle).once('value').then(s=>{
    if(s.exists()){toast('Юзер уже занят');return}
    return db.ref('channels/'+q.handle).set({name:q.name,handle:q.handle,desc:q.desc||'',owner:q.ownerUid,ownerNick:q.ownerNick,created:Date.now()}).then(()=>db.ref('channelRequests/'+id).remove()).then(()=>{toast('Канал одобрен');renderChannels()})
  });
};
window.chReject=function(id){db.ref('channelRequests/'+id).remove().then(()=>{toast('Отклонено');renderChannels()})};
window.chSub=function(h){
  if(!currentUID){toast('Войдите');return}
  const r=db.ref('channelSubs/'+h+'/'+currentUID);
  r.once('value').then(s=>s.exists()?r.remove():r.set(Date.now())).then(()=>{CH.cur?chRefresh():renderChannels()});
};
window.openChannel=function(h){CH.cur=h;CH.draft='';$('chOverlay').classList.add('on');$('chPage').innerHTML='<div class="ch-body">'+renderLoadScreen()+'</div>';chRefresh()};
window.closeChannel=function(){CH.cur=null;$('chOverlay').classList.remove('on');if($('vwChannels').classList.contains('on'))renderChannels()};
function chRefresh(){
  const h=CH.cur;if(!h)return;
  Promise.all(['channels','channelPosts','channelReacts','channelSubs'].map(p=>db.ref(p+'/'+h).once('value'))).then(r=>{
    if(h!==CH.cur)return;
    if(!r[0].exists()){closeChannel();toast('Канал удалён');return}
    chRender(r[0].val(),r[1].val()||{},r[2].val()||{},r[3].val()||{});
  }).catch(e=>{$('chPage').innerHTML='<div class="ch-body">'+niceError('Не получилось',e.message)+'<button class="btn" onclick="closeChannel()">Назад</button></div>'});
}
function chRender(ch,posts,reacts,subs){
  const uid=currentUID,n=Object.keys(subs).length,isSub=uid&&subs[uid],ad=ch.admins||{};
  const isOwner=uid&&ch.owner===uid,canPost=uid&&(isOwner||ad[uid]),canDel=canPost||isAdmin;
  CH.data=ch;
  const ta=$('chText');if(ta)CH.draft=ta.value;
  const old=$('chBody'),sc=old?old.scrollTop:0;
  const arr=Object.entries(posts).map(([k,v])=>Object.assign({id:k},v)).sort((a,b)=>b.time-a.time);
  let h='<div class="ch-head"><button class="ch-ib" onclick="closeChannel()">‹</button>'+ava(ch.name,ch.handle)+'<div class="ch-inf"><div class="ch-name">'+E(ch.name)+'</div><div class="ch-sub">@'+E(ch.handle)+' · '+n+' подп.</div></div>'
   +'<button class="ch-sbtn'+(isSub?' on':'')+'" onclick="chSub(\''+ch.handle+'\')">'+(isSub?'Вы в канале':'Подписаться')+'</button>'
   +((isOwner||isAdmin)?'<button class="ch-ib" onclick="chManage()">⚙</button>':'')+'</div>';
  h+='<div class="ch-body" id="chBody">';
  if(ch.desc)h+='<div class="post"><div class="text">'+E(ch.desc)+'</div><div class="meta" style="margin:10px 0 0"><span>Владелец: '+E(ch.ownerNick||'—')+'</span></div></div>';
  if(canPost)h+='<div class="ch-compose"><textarea id="chText" maxlength="2000" placeholder="Что нового в канале?"></textarea><button class="btn ripple-host" style="margin:8px 0 0" onclick="chPost()">Опубликовать</button></div>';
  if(!arr.length)h+='<div class="em"><div class="ic">📝</div><div class="t">Постов пока нет</div></div>';
  h+=arr.map(p=>{
    const rr=reacts[p.id]||{},cnt={};Object.values(rr).forEach(e=>cnt[e]=(cnt[e]||0)+1);const mine=uid?rr[uid]:null;
    return '<div class="post nz-post"><div class="meta"><span class="author">'+E(ch.name)+'</span><span>'+smartTime(p.time)+'</span></div><div class="text">'+E(p.text)+'</div><div class="rx-row">'
     +RX.map(e=>'<button class="rx'+(mine===e?' on':'')+'" onclick="chReact(\''+p.id+'\',\''+e+'\')">'+e+(cnt[e]?' <span>'+cnt[e]+'</span>':'')+'</button>').join('')
     +'<button class="rx" onclick="chComments(\''+p.id+'\')">💬</button>'+(canDel?'<button class="rx" onclick="chDelPost(\''+p.id+'\')">🗑</button>':'')+'</div></div>'}).join('');
  h+='</div>';
  $('chPage').innerHTML=h;
  const nb=$('chBody');if(nb)nb.scrollTop=sc;
  const nt=$('chText');if(nt)nt.value=CH.draft||'';
}
window.chPost=function(){
  const t=$('chText').value.trim();if(!t)return;
  db.ref('channelPosts/'+CH.cur).push({text:t,time:Date.now(),author:currentUID}).then(()=>{CH.draft='';toast('Опубликовано');chRefresh()}).catch(()=>toast('Нет прав'));
};
window.chReact=function(p,e){
  if(!currentUID){toast('Войдите');return}
  const r=db.ref('channelReacts/'+CH.cur+'/'+p+'/'+currentUID);
  r.once('value').then(s=>s.val()===e?r.remove():r.set(e)).then(chRefresh);
};
window.chDelPost=function(p){if(!confirm('Удалить пост?'))return;Promise.all([db.ref('channelPosts/'+CH.cur+'/'+p).remove(),db.ref('channelReacts/'+CH.cur+'/'+p).remove(),db.ref('channelComments/'+CH.cur+'/'+p).remove()]).then(chRefresh)};
window.chComments=function(p){currentCommentsThread='channelComments/'+CH.cur+'/'+p;$('commentsTitle').textContent='Комментарии';$('commentInput').value='';renderCommentsList();openModal('commentsOverlay')};

window.chManage=function(){
  const ch=CH.data;if(!ch)return;
  const ad=ch.admins||{},isOwner=currentUID===ch.owner;
  let h='<div class="section-title">Админы</div>';
  h+=Object.keys(ad).length?Object.entries(ad).map(([u,nk])=>'<div class="nz-row"><span style="flex:1">@'+E(nk)+'</span>'+(isOwner?'<button class="ch-ib" onclick="chRmAdmin(\''+u+'\')">✕</button>':'')+'</div>').join(''):'<div style="font-size:12px;color:var(--txt3);padding:6px 0">Нет</div>';
  h+='<div class="fld" style="margin-top:14px"><label>Ник пользователя</label><input id="chMgrNick" autocapitalize="none"></div>';
  if(isOwner)h+='<button class="btn ripple-host" onclick="chAddAdmin()">Назначить администратором</button><button class="btn btn-amber ripple-host" onclick="chTransfer()">Передать канал</button>';
  h+='<button class="btn btn-red ripple-host" onclick="chDelete()">Удалить канал</button>';
  $('chMgrBody').innerHTML=h;openModal('chMgr');
};
function chFind(){const nk=$('chMgrNick').value.trim().toLowerCase();if(!nk){toast('Введи ник');return Promise.resolve(null)}
  return db.ref('usernames/'+nk).once('value').then(s=>{if(!s.val()){toast('Пользователь не найден');return null}return{uid:s.val(),nick:nk}})}
window.chAddAdmin=function(){chFind().then(u=>{if(!u)return;if(u.uid===CH.data.owner){toast('Это владелец');return}db.ref('channels/'+CH.cur+'/admins/'+u.uid).set(u.nick).then(()=>{toast('Админ назначен');closeModal('chMgr');chRefresh()})})};
window.chRmAdmin=function(u){db.ref('channels/'+CH.cur+'/admins/'+u).remove().then(()=>{toast('Снят');closeModal('chMgr');chRefresh()})};
window.chTransfer=function(){chFind().then(u=>{if(!u)return;if(!confirm('Передать канал @'+u.nick+'? Вы станете администратором.'))return;
  const up={owner:u.uid,ownerNick:u.nick};up['admins/'+u.uid]=null;up['admins/'+currentUID]=currentProfile.nickname||currentProfile.username||'—';
  db.ref('channels/'+CH.cur).update(up).then(()=>{toast('Канал передан');closeModal('chMgr');chRefresh()})})};
window.chDelete=function(){if(!confirm('Удалить канал и все посты?'))return;const h=CH.cur;
  Promise.all(['channels','channelPosts','channelReacts','channelSubs','channelComments'].map(p=>db.ref(p+'/'+h).remove())).then(()=>{closeModal('chMgr');closeChannel();toast('Канал удалён')})};

/* ================= ОБРАЩЕНИЯ: кнопка перехода к пользователю ================= */
let acUid=null,acRef=null;
window.openAdminSupport=function(){
  if(!isAdmin){toast('Только для админа');return}
  openModal('adminSupportOverlay');
  db.ref('support').once('value').then(s=>{
    const d=s.val()||{},arr=Object.entries(d).map(([uid,v])=>Object.assign({uid},v)).filter(x=>x.lastTime).sort((a,b)=>(b.lastTime||0)-(a.lastTime||0)),box=$('adminSupportList');
    if(!arr.length){box.innerHTML='<div style="text-align:center;color:var(--txt3);font-size:12.5px;padding:18px">Обращений нет</div>';return}
    box.innerHTML='<div class="list-block">'+arr.map(a=>'<div class="list-row ripple-host" onclick="openAdminChat(\''+a.uid+'\',\''+E(a.username||'user')+'\')"><div class="lr-icon purple"><svg class="icon"><use href="#i-user"/></svg></div><div class="lr-inf"><div class="t">@'+E(a.username||'—')+'</div><div class="s">'+smartTime(a.lastTime)+'</div></div><svg class="icon" style="color:var(--txt3)"><use href="#i-chev"/></svg></div>').join('')+'</div>';
  });
};
window.openAdminChat=function(uid,name){
  acUid=uid;$('nzAChatT').textContent='@'+name;
  if(acRef)acRef.off();
  acRef=db.ref('support/'+uid+'/messages');
  acRef.on('value',s=>{
    const arr=Object.entries(s.val()||{}).map(([k,v])=>v).sort((a,b)=>a.time-b.time),box=$('nzAChatMsgs');
    box.innerHTML=arr.length?arr.map(m=>'<div class="chat-msg '+(m.from==='user'?'admin':'user')+'">'+E(m.text||'')+'</div>').join(''):'<div class="chat-msg system">Сообщений нет</div>';
    box.scrollTop=box.scrollHeight;
  });
  openModal('nzAChat');
};
window.adminChatSend=function(){
  const i=$('nzAChatIn'),t=i.value.trim();if(!t||!acUid)return;i.value='';
  db.ref('support/'+acUid+'/messages').push({from:'admin',uid:currentUID,author:'Админ',text:t,time:Date.now()}).then(()=>db.ref('support/'+acUid).update({lastTime:Date.now()}));
};

/* ================= ФИКСЫ СТАРОГО КОДА ================= */
window.renderHomeStationSettings=function(){};
window.submitReview=function(){
  if(!currentUID){toast('Войдите');return}
  if(selectedReviewStars<1){toast('Поставь оценку');return}
  const text=$('reviewText').value.trim();
  if(text.length<2){toast('Отзыв слишком короткий');return}
  db.ref('reviews').orderByChild('uid').equalTo(currentUID).once('value',snap=>{
    if(snap.exists()){toast('Вы уже оставляли отзыв!');return}
    db.ref('reviews').push({uid:currentUID,author:currentProfile.nickname||currentProfile.username||'—',stars:selectedReviewStars,text:text,time:Date.now()}).then(()=>{
      toast('Спасибо за отзыв!');$('reviewText').value='';selectedReviewStars=0;highlightStars(0);renderReviews()})
  });
};
try{renderHomeStationButton()}catch(e){}

/* ================= НОВАЯ ФИЧА: «НЕ ОПОЗДАЙ» ================= */
/* Живой обратный отсчёт до ближайшей электрички по твоему избранному маршруту:
   показывает, во сколько ВЫЙТИ ИЗ ДОМА (учитывает дорогу до станции), и пищит, когда пора. */
const nlSt=document.createElement('style');nlSt.textContent=`
.nz-late{position:relative;overflow:hidden;border-radius:26px;padding:18px;margin-bottom:16px;color:var(--txt);
 background:linear-gradient(135deg,rgba(31,156,86,.28),rgba(37,99,235,.18))!important;border:1px solid var(--glb);
 backdrop-filter:blur(18px) saturate(1.7);-webkit-backdrop-filter:blur(18px) saturate(1.7);box-shadow:var(--glsh),inset 0 1px 0 rgba(255,255,255,.6)}
.nl-top{display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin-bottom:12px}
.nl-top b{font:800 13px Unbounded,sans-serif}.nl-top span{font-size:11px;color:var(--txt2);font-weight:600;text-align:right}
.nl-main{position:relative;width:150px;height:150px;margin:0 auto 12px}
.nl-main svg{width:150px;height:150px;transform:rotate(-90deg)}
.nl-main circle{fill:none;stroke-width:9;stroke-linecap:round}
.nl-bg{stroke:var(--line)}
#nlRing{stroke:var(--green-light);transition:stroke-dashoffset 1s linear,stroke .5s;filter:drop-shadow(0 0 6px var(--green-glow2))}
.nl-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 18px}
#nlBig{font:800 26px Unbounded,sans-serif;letter-spacing:-1px}
#nlSm{font-size:10px;color:var(--txt2);font-weight:600;margin-top:4px;line-height:1.3}
.nl-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:14px;background:var(--gl);border:1px solid var(--glb);margin-bottom:6px;font-size:12px;font-weight:600}
.nl-row b{font:800 16px Unbounded,sans-serif}.nl-row span{color:var(--txt2);margin-left:auto}
.nl-walk{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:10px;font-size:12px;font-weight:600;color:var(--txt2)}
.nl-walk button{width:34px;height:34px;border-radius:11px;background:var(--bg3);border:1px solid var(--line);font:800 16px Unbounded,sans-serif;color:var(--txt)}
.nl-walk button:active{transform:scale(.88)}
.nl-pulse #nlBig{animation:alertPulse .8s ease-in-out infinite;color:var(--red)}
`;document.head.appendChild(nlSt);
$('homeFavsBlock').insertAdjacentHTML('beforebegin','<div id="nzLate"></div>');
const NO={key:'',segs:[],from:null,to:null,walk:parseInt(localStorage.getItem('nz_walk'))||15,fired:{},t:0};
const RC=2*Math.PI*46;
function noPick(){
  const f=currentProfile&&currentProfile.favorites?Object.values(currentProfile.favorites):[];
  const l=f[f.length-1];
  if(l&&l.from&&l.to)return{from:l.from,to:l.to};
  if(fromStation&&toStation)return{from:fromStation,to:toStation};
  return null;
}
function noKey(){const r=noPick();return r?r.from.code+'>'+r.to.code:'none'}
function noLoad(){
  const r=noPick();NO.key=noKey();NO.from=r&&r.from;NO.to=r&&r.to;NO.segs=[];NO.fired={};
  noDraw();
  if(!r)return;
  const path='/search/?apikey='+APIKEY+'&from='+encodeURIComponent(r.from.code)+'&to='+encodeURIComponent(r.to.code)+'&date='+dateToYmd(new Date())+'&format=json&limit=200&transport_types=suburban&system=yandex&show_systems=all';
  fetchWithRetry(path).then(d=>{
    NO.segs=(d.segments||[]).filter(s=>s&&s.departure).map(s=>({dep:new Date(s.departure).getTime(),plat:extractPlatform(s)})).sort((a,b)=>a.dep-b.dep);
  }).catch(()=>{});
}
function noDraw(){
  const box=$('nzLate');if(!box)return;
  if(!NO.from){box.innerHTML='<div class="nz-late"><div class="nl-top"><b>⏱ Не опоздай</b></div><div style="font-size:12.5px;color:var(--txt2);line-height:1.5">Добавь маршрут в избранное (вкладка «Маршрут» → ♥), и здесь появится живой отсчёт: во сколько выйти из дома, чтобы успеть на электричку.</div></div>';return}
  box.innerHTML='<div class="nz-late" id="nlCard"><div class="nl-top"><b>⏱ Не опоздай</b><span>'+E(NO.from.title)+' → '+E(NO.to.title)+'</span></div>'
   +'<div class="nl-main"><svg viewBox="0 0 100 100"><circle class="nl-bg" cx="50" cy="50" r="46"/><circle id="nlRing" cx="50" cy="50" r="46" stroke-dasharray="'+RC+'" stroke-dashoffset="'+RC+'"/></svg><div class="nl-c"><div id="nlBig">··:··</div><div id="nlSm">Загружаем рейсы…</div></div></div>'
   +'<div id="nlList"></div><div class="nl-walk"><button onclick="noWalk(-5)">−</button><span>Дорога до станции: <b id="nlW">'+NO.walk+'</b> мин</span><button onclick="noWalk(5)">+</button></div></div>';
}
window.noWalk=function(d){NO.walk=Math.max(0,Math.min(120,NO.walk+d));localStorage.setItem('nz_walk',NO.walk);const w=$('nlW');if(w)w.textContent=NO.walk;noTick()};
const hm=ms=>new Date(ms).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
function noTick(){
  const big=$('nlBig');if(!big)return;
  const now=Date.now(),up=NO.segs.filter(s=>s.dep>now).slice(0,3),card=$('nlCard'),ring=$('nlRing');
  if(!NO.segs.length){return}
  if(!up.length){big.textContent='—';$('nlSm').textContent='Сегодня рейсов больше нет';$('nlList').innerHTML='';ring.style.strokeDashoffset=RC;return}
  const n=up[0],leave=n.dep-NO.walk*60000-now;
  if(leave>0){
    const s=Math.floor(leave/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60);
    big.textContent=(h>0?h+':'+pad(m):pad(m))+':'+pad(s%60);
    $('nlSm').textContent='до выхода из дома · выйти в '+hm(n.dep-NO.walk*60000);
    card.classList.remove('nl-pulse');
  }else{
    big.textContent='Выходи!';
    $('nlSm').textContent='поезд в '+hm(n.dep)+' · через '+Math.max(0,Math.ceil((n.dep-now)/60000))+' мин';
    card.classList.add('nl-pulse');
    if(!NO.fired[n.dep]){
      NO.fired[n.dep]=1;
      if(leave>-30000){
        toast('🏃 Пора выходить!');
        try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}
        try{if(window.Notification&&Notification.permission==='granted')new Notification('Не Заяц',{body:'Пора выходить! Электричка в '+hm(n.dep)})}catch(e){}
      }
    }
  }
  const p=Math.max(0,Math.min(1,leave/1800000));
  ring.style.strokeDashoffset=RC*(1-p);
  ring.style.stroke=leave<=0?'var(--red)':leave<300000?'var(--amber)':'var(--green-light)';
  $('nlList').innerHTML=up.map(s=>'<div class="nl-row"><b>'+hm(s.dep)+'</b><span>через '+Math.max(0,Math.ceil((s.dep-now)/60000))+' мин'+(s.plat?' · путь '+E(s.plat):'')+'</span></div>').join('');
}
setInterval(()=>{
  if(noKey()!==NO.key||Date.now()-NO.t>600000){NO.t=Date.now();noLoad()}
  noTick();
},1000);
})();
