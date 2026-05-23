/* Moyun Note - API 없이 작동하는 중국어 표현 노트 */
const CATEGORIES = ['인사','감사','사과','학교생활','친구 대화','발표/수업','여행','카페/음식','SNS','감정 표현','부탁','거절','칭찬','응원','공부 표현','Z세대 표현'];

function phrase(id, category, ko, cn, py, keywords, extra={}){
  return {
    id, category, inputExamples: Array.isArray(ko)?ko:[ko], keywords,
    natural: cn, naturalPinyin: py,
    literal: extra.literal || '한국어 어순 그대로 옮기면 다소 딱딱하게 들릴 수 있어요.',
    literalNote: extra.literalNote || '중국어는 단어를 하나씩 바꾸기보다 상황에서 자주 쓰는 문장 덩어리로 익히는 편이 더 자연스러워요.',
    grammar: extra.grammar || '이 표현은 실제 회화에서 자주 쓰이는 기본 문장입니다. 핵심 단어와 어순을 함께 익히면 비슷한 상황에도 쉽게 응용할 수 있어요.',
    errors: extra.errors || [{type:'표현 자연스러움',desc:'[문장 전체]를 하나의 표현처럼 익히면 직역보다 훨씬 자연스럽게 말할 수 있어요.',isGood:false}],
    situations: extra.situations || [{tag:'친구',cn,py},{tag:'공식',cn:extra.formal||cn,py:extra.formalPy||py}],
    conversation: extra.conversation || [{cn,py,ko:Array.isArray(ko)?ko[0]:ko}],
    culture: extra.culture || '중국어 표현은 상대와 상황에 따라 말투가 달라질 수 있어요. 친구에게는 짧고 편하게, 공식적인 자리에서는 조금 더 정중하게 말하는 것이 좋아요.',
    hsk: extra.hsk || {level:1,label:'HSK 1급',desc:'기초 일상 회화 표현이에요.'},
    recommend: extra.recommend || [{cn,py,ko:Array.isArray(ko)?ko[0]:ko}],
    source:'base'
  };
}

const PHRASE_DB = [
  phrase('greeting_001','인사',['안녕','안녕하세요'],'你好！','Nǐ hǎo!',['안녕','안녕하세요','인사'],{formal:'您好！',formalPy:'Nín hǎo!',recommend:[{cn:'早上好！',py:'Zǎoshang hǎo!',ko:'좋은 아침!'}]}),
  phrase('greeting_002','인사','만나서 반가워','很高兴见到你。','Hěn gāoxìng jiàn dào nǐ.',['만나서','반가워','처음'],{hsk:{level:2,label:'HSK 2급',desc:'자기소개 상황에 좋아요.'}}),
  phrase('greeting_003','인사','오랜만이야','好久不见！','Hǎojiǔ bú jiàn!',['오랜만','오래','만남']),
  phrase('thanks_001','감사','고마워','谢谢你！','Xièxie nǐ!',['고마워','감사','고맙'],{formal:'谢谢您！',formalPy:'Xièxie nín!'}),
  phrase('thanks_002','감사','정말 도움이 됐어','真的帮了我很多。','Zhēn de bāng le wǒ hěn duō.',['도움','고마워','정말'],{hsk:{level:3,label:'HSK 3급',desc:'감사를 구체적으로 표현할 때 좋아요.'}}),
  phrase('sorry_001','사과','미안해','对不起。','Duìbuqǐ.',['미안','죄송','사과'],{formal:'不好意思，麻烦您了。',formalPy:'Bù hǎoyìsi, máfan nín le.'}),
  phrase('sorry_002','사과','늦어서 미안해','不好意思，我迟到了。','Bù hǎoyìsi, wǒ chídào le.',['늦었','지각','미안'],{hsk:{level:2,label:'HSK 2급',desc:'학교와 약속 상황에서 자주 써요.'}}),
  phrase('school_001','학교생활','숙제 했어?','你写作业了吗？','Nǐ xiě zuòyè le ma?',['숙제','했어','과제']),
  phrase('school_002','학교생활','오늘 수업 어려웠어','今天的课有点难。','Jīntiān de kè yǒudiǎn nán.',['수업','어려워','오늘'],{hsk:{level:2,label:'HSK 2급',desc:'학교생활 감상 표현이에요.'}}),
  phrase('school_003','학교생활','선생님께 질문해도 될까요?','老师，我可以问一个问题吗？','Lǎoshī, wǒ kěyǐ wèn yí ge wèntí ma?',['선생님','질문','될까요'],{category:'학교생활'}),
  phrase('friend_001','친구 대화','밥 먹었어?','你吃饭了吗？','Nǐ chīfàn le ma?',['밥','먹었어','식사'],{culture:'중국어에서 “밥 먹었어?”는 실제 식사 질문이면서도 가벼운 안부처럼 쓰일 수 있어요.',recommend:[{cn:'一起吃饭吧。',py:'Yìqǐ chīfàn ba.',ko:'같이 밥 먹자.'}]}),
  phrase('friend_002','친구 대화','주말에 시간 있어?','你周末有空吗？','Nǐ zhōumò yǒu kòng ma?',['주말','시간','약속']),
  phrase('friend_003','친구 대화','같이 영화 볼래?','要不要一起看电影？','Yào bu yào yìqǐ kàn diànyǐng?',['같이','영화','볼래']),
  phrase('present_001','발표/수업','발표를 시작하겠습니다','我开始我的发表。','Wǒ kāishǐ wǒ de fābiǎo.',['발표','시작','하겠습니다'],{literal:'我会开始发表。',literalNote:'한국어의 “하겠습니다”를 그대로 옮기기보다 중국어에서는 간단히 “开始我的发表”처럼 말하면 자연스러워요.',hsk:{level:3,label:'HSK 3급',desc:'발표 도입에 쓰기 좋아요.'}}),
  phrase('present_002','발표/수업','제 발표 주제는 이것입니다','我发表的主题是这个。','Wǒ fābiǎo de zhǔtí shì zhège.',['주제','발표','이것']),
  phrase('present_003','발표/수업','들어주셔서 감사합니다','谢谢大家的聆听。','Xièxie dàjiā de língtīng.',['감사','들어주셔서','마무리'],{formal:'感谢大家的聆听。',formalPy:'Gǎnxiè dàjiā de língtīng.'}),
  phrase('travel_001','여행','이거 얼마예요?','这个多少钱？','Zhège duōshǎo qián?',['얼마','가격','이거']),
  phrase('travel_002','여행','화장실 어디에 있어요?','洗手间在哪里？','Xǐshǒujiān zài nǎlǐ?',['화장실','어디','여행']),
  phrase('travel_003','여행','사진 찍어도 될까요?','可以拍照吗？','Kěyǐ pāizhào ma?',['사진','찍어도','될까요']),
  phrase('cafe_001','카페/음식','아이스 아메리카노 주세요','请给我一杯冰美式。','Qǐng gěi wǒ yì bēi bīng měishì.',['아메리카노','카페','주세요']),
  phrase('cafe_002','카페/음식','포장해 주세요','请帮我打包。','Qǐng bāng wǒ dǎbāo.',['포장','주세요','음식']),
  phrase('cafe_003','카페/음식','덜 달게 해 주세요','请少放一点糖。','Qǐng shǎo fàng yìdiǎn táng.',['덜','달게','설탕']),
  phrase('sns_001','SNS','완전 예쁘다','太好看了！','Tài hǎokàn le!',['예쁘다','완전','사진']),
  phrase('sns_002','SNS','이거 진짜 웃겨','这个真的太好笑了。','Zhège zhēn de tài hǎoxiào le.',['웃겨','진짜','SNS']),
  phrase('sns_003','SNS','댓글 남겨줘','给我留言吧。','Gěi wǒ liúyán ba.',['댓글','남겨줘','SNS']),
  phrase('emotion_001','감정 표현','오늘 너무 피곤해','我今天太累了。','Wǒ jīntiān tài lèi le.',['피곤','오늘','힘들어']),
  phrase('emotion_002','감정 표현','기분이 좋아','我心情很好。','Wǒ xīnqíng hěn hǎo.',['기분','좋아','행복']),
  phrase('emotion_003','감정 표현','조금 긴장돼','我有点紧张。','Wǒ yǒudiǎn jǐnzhāng.',['긴장','떨려','조금']),
  phrase('request_001','부탁','도와줄 수 있어?','你可以帮我一下吗？','Nǐ kěyǐ bāng wǒ yíxià ma?',['도와','부탁','가능']),
  phrase('request_002','부탁','다시 한 번 말해줄래?','你可以再说一遍吗？','Nǐ kěyǐ zài shuō yí biàn ma?',['다시','한번','말해']),
  phrase('refuse_001','거절','오늘은 어려울 것 같아','今天可能不太方便。','Jīntiān kěnéng bú tài fāngbiàn.',['거절','오늘','어려워']),
  phrase('refuse_002','거절','미안하지만 못 갈 것 같아','不好意思，我可能去不了。','Bù hǎoyìsi, wǒ kěnéng qù bù liǎo.',['못가','미안','거절']),
  phrase('praise_001','칭찬','너 진짜 잘한다','你真的很厉害！','Nǐ zhēn de hěn lìhai!',['잘한다','대단','칭찬']),
  phrase('praise_002','칭찬','발음이 좋아','你的发音很好。','Nǐ de fāyīn hěn hǎo.',['발음','좋아','칭찬']),
  phrase('cheer_001','응원','힘내','加油！','Jiāyóu!',['힘내','응원','파이팅']),
  phrase('cheer_002','응원','너는 할 수 있어','你一定可以的！','Nǐ yídìng kěyǐ de!',['할수있어','응원','가능']),
  phrase('study_001','공부 표현','중국어 공부하고 있어','我在学习中文。','Wǒ zài xuéxí Zhōngwén.',['중국어','공부','학습']),
  phrase('study_002','공부 표현','이 단어 무슨 뜻이야?','这个词是什么意思？','Zhège cí shì shénme yìsi?',['단어','뜻','무슨']),
  phrase('study_003','공부 표현','문법이 조금 어려워','语法有点难。','Yǔfǎ yǒudiǎn nán.',['문법','어려워','공부']),
  phrase('slang_001','Z세대 표현','웃겨 죽겠다','笑死我了。','Xiào sǐ wǒ le.',['웃겨','ㅋㅋ','죽겠다'],{culture:'친구끼리 온라인에서 자주 쓰는 과장 표현이에요. 공식적인 상황에서는 쓰지 않는 편이 좋아요.'}),
  phrase('slang_002','Z세대 표현','멘탈 나갔어','我破防了。','Wǒ pòfáng le.',['멘탈','무너짐','감정'],{culture:'원래 게임에서 온 표현이지만 요즘은 감정이 흔들릴 때도 써요.'}),
  phrase('slang_003','Z세대 표현','완전 최고야','绝绝子！','Juéjuézi!',['최고','대박','완전'],{culture:'인터넷 유행어라 친구나 SNS에서는 자연스럽지만 발표나 공식 상황에는 어울리지 않아요.'})
];

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>document.querySelectorAll(s);
const Store = { get(k,d){try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{return d}}, set(k,v){localStorage.setItem(k,JSON.stringify(v))} };
let state = { situation:'친구', userPhrases:Store.get('moyun_user',[]), saved:Store.get('moyun_saved',[]), recent:Store.get('moyun_recent',[]), current:null };

function esc(s){return String(s??'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));}
function norm(s){return String(s||'').toLowerCase().replace(/[\s!?？。,.，~]/g,'');}
function allPhrases(){return [...PHRASE_DB, ...state.userPhrases];}
function todayPhrase(){return PHRASE_DB[new Date().getDate()%PHRASE_DB.length];}
function toast(msg){const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t.timer); t.timer=setTimeout(()=>t.classList.remove('show'),1700)}
function speak(text){if(!('speechSynthesis' in window)){toast('이 브라우저는 발음 듣기를 지원하지 않아요');return} speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='zh-CN'; u.rate=.9; speechSynthesis.speak(u)}
function copyText(text){navigator.clipboard?.writeText(text).then(()=>toast('복사했어요')).catch(()=>toast('복사 기능을 사용할 수 없어요'))}

function similarity(input, p){
  const n = norm(input); let score=0;
  const samples=[...(p.inputExamples||[]), p.natural, p.naturalPinyin].filter(Boolean);
  for(const s of samples){const ns=norm(s); if(ns===n) score=Math.max(score,100); else if(ns.includes(n)||n.includes(ns)) score=Math.max(score,82)}
  let hit=0; (p.keywords||[]).forEach(k=>{if(n.includes(norm(k))) hit++});
  if(p.keywords?.length) score=Math.max(score, Math.round((hit/p.keywords.length)*78));
  samples.forEach(s=>{const ns=norm(s); let common=0; [...new Set(n)].forEach(ch=>{if(ns.includes(ch)) common++}); score=Math.max(score, Math.round((common/Math.max(n.length,1))*70));});
  return Math.min(100,score);
}
function findBest(input){
  let best=null, bestScore=-1;
  allPhrases().forEach(p=>{const sc=similarity(input,p); if(sc>bestScore){best=p; bestScore=sc}});
  if(!best) return {phrase:todayPhrase(), score:0};
  return {phrase:best, score:Math.max(35,bestScore)};
}
function matchMessage(score){if(score>=85)return '표현 사전에서 정확히 가까운 표현을 찾았어요'; if(score>=60)return '입력한 문장과 비슷한 표현을 바탕으로 정리했어요'; return '가장 가까운 등록 표현을 참고해 정리했어요';}

function renderResult(p, score=100){
  state.current=p;
  $('#resultArea').innerHTML = `
  <article class="card result-card">
    <div class="result-main">
      <div><span class="match">${score}% · ${matchMessage(score)}</span><div class="cn-big">${esc(p.natural)}</div><div class="py">${esc(p.naturalPinyin)}</div><p class="ko">${esc(p.inputExamples?.[0]||'')}</p></div>
      <div class="result-actions"><span class="badge">${p.source==='user'?'직접 등록':'기본 표현'}</span><button class="icon-btn" data-speak="${esc(p.natural)}">🔊</button><button class="icon-btn" data-copy="${esc(p.natural)}">📋</button><button class="icon-btn" data-save="${esc(p.id)}">⭐</button></div>
    </div>
  </article>
  <section class="info-grid">
    ${infoCard('직역하면 어색한 표현', `<b>${esc(p.literal)}</b><p>${esc(p.literalNote)}</p>`)}
    ${infoCard('핵심 문법 설명', `<p>${esc(p.grammar)}</p>`)}
    ${infoCard('학습자 오류 피드백', (p.errors||[]).map(e=>`<p><b>${esc(e.type)}</b><br>${highlight(e.desc)}</p>`).join(''))}
    ${infoCard('문화적 맥락', `<p>${esc(p.culture)}</p>`)}
  </section>
  ${wideCard('상황별 표현 비교', `<div class="compare-grid">${(p.situations||[]).map(s=>`<div class="compare-item"><span class="badge">${esc(s.tag)}</span><h3>${esc(s.cn)}</h3><p class="py">${esc(s.py)}</p></div>`).join('')}</div>`)}
  ${wideCard('자주 쓰는 회화 표현', `<div class="conv-list">${(p.conversation||[]).map(c=>`<div class="conv-item"><b>${esc(c.cn)}</b><p class="py">${esc(c.py)}</p><p class="ko">${esc(c.ko)}</p></div>`).join('')}</div>`)}
  ${wideCard('HSK 난이도', `<span class="badge">${esc(p.hsk?.label||'HSK')}</span><p>${esc(p.hsk?.desc||'')}</p><div class="hsk-bar"><div class="hsk-fill" style="width:${((p.hsk?.level||1)/6)*100}%"></div></div>`)}
  ${wideCard('자연스러운 현지 표현 추천', `<div class="reco-list">${(p.recommend||[]).map(r=>`<div class="reco-item"><b>${esc(r.cn)}</b><p class="py">${esc(r.py)}</p><p class="ko">${esc(r.ko)}</p></div>`).join('')}</div>`)}
  ${score<60?`<div class="empty">찾는 표현과 완전히 같지는 않아요. 필요하면 “표현 추가”에서 내 표현으로 새로 등록해 보세요.</div>`:''}`;
  bindDynamic();
}
function infoCard(title, body){return `<article class="card"><div class="small-title">${title}</div>${body}</article>`}
function wideCard(title, body){return `<article class="card result-card"><h3>${title}</h3>${body}</article>`}
function highlight(s){return esc(s).replace(/\[(.+?)\]/g,'<span class="hl">$1</span>')}

function savePhrase(p){
  if(state.saved.some(x=>x.id===p.id)){toast('이미 저장된 표현이에요');return}
  state.saved.unshift({id:p.id,cn:p.natural,py:p.naturalPinyin,ko:p.inputExamples?.[0]||'',category:p.category});
  Store.set('moyun_saved',state.saved); renderSaved(); toast('나중에 다시 볼 표현으로 저장했어요');
}
function addRecent(p){state.recent=state.recent.filter(x=>x.id!==p.id); state.recent.unshift({id:p.id,cn:p.natural,ko:p.inputExamples?.[0]||'',category:p.category}); state.recent=state.recent.slice(0,5); Store.set('moyun_recent',state.recent); renderRecent();}
function findById(id){return allPhrases().find(p=>p.id===id)}

function renderRecent(){
  $('#recentList').innerHTML = state.recent.length? state.recent.map(r=>`<div class="simple-item" data-open-id="${r.id}"><b>${esc(r.cn)}</b><br><span class="muted">${esc(r.ko)}</span></div>`).join('') : '<div class="empty">아직 학습 기록이 없어요</div>'; bindDynamic();
}
function renderToday(){
  const p=todayPhrase();
  $('#todayMini').innerHTML=`<h3>오늘의 표현</h3><div class="cn-big" style="font-size:26px">${esc(p.natural)}</div><p class="py">${esc(p.naturalPinyin)}</p><p class="muted">${esc(p.inputExamples[0])}</p><button class="ghost-btn" data-open-id="${p.id}">자세히 보기</button>`;
  $('#todayFull').innerHTML=PHRASE_DB.slice(0,8).map(x=>phraseCard(x,true)).join(''); bindDynamic();
}
function phraseCard(p, open=false){return `<article class="card note-card"><span class="badge">${esc(p.category)}</span><h3>${esc(p.natural)}</h3><p class="py">${esc(p.naturalPinyin)}</p><p class="muted">${esc(p.inputExamples?.[0]||'')}</p><div class="result-actions"><button class="icon-btn" data-speak="${esc(p.natural)}">🔊</button><button class="icon-btn" data-copy="${esc(p.natural)}">📋</button>${open?`<button class="ghost-btn" data-open-id="${p.id}">열기</button>`:''}</div></article>`}
function renderSaved(){
  $('#savedList').innerHTML = state.saved.length? state.saved.map((n,i)=>`<article class="card note-card"><span class="badge">${esc(n.category)}</span><h3>${esc(n.cn)}</h3><p class="py">${esc(n.py)}</p><p class="muted">${esc(n.ko)}</p><div class="result-actions"><button class="icon-btn" data-speak="${esc(n.cn)}">🔊</button><button class="icon-btn" data-copy="${esc(n.cn)}">📋</button><button class="icon-btn" data-del-saved="${i}">삭제</button></div></article>`).join('') : '<div class="empty">저장한 표현이 없어요. 마음에 드는 표현을 ⭐로 저장해 보세요.</div>'; bindDynamic();
}
function renderList(){
  const sel=$('#categoryFilter'); sel.innerHTML='<option value="all">전체 카테고리</option>'+CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join('');
  drawList();
}
function drawList(){
  const q=norm($('#listSearch').value); const cat=$('#categoryFilter').value;
  const list=allPhrases().filter(p=>(cat==='all'||p.category===cat) && (!q||norm([p.category,p.natural,p.naturalPinyin,...p.inputExamples,...p.keywords].join(' ')).includes(q)));
  $('#phraseList').innerHTML=list.map(p=>phraseCard(p,true)).join('') || '<div class="empty">해당하는 표현이 없어요</div>'; bindDynamic();
}

function makeUserPhrase(){
  const ko=$('#addKo').value.trim(), cn=$('#addCn').value.trim(), py=$('#addPy').value.trim();
  if(!ko||!cn||!py){toast('필수 항목을 채워줘');return null}
  const cat=$('#addCategory').value.trim()||'직접 등록'; const tag=$('#addTag').value.trim()||'친구'; const desc=$('#addDesc').value.trim()||'직접 등록한 표현이에요.';
  return {id:'user_'+Date.now(),category:cat,keywords:ko.split(/\s+/).filter(Boolean),inputExamples:[ko],natural:cn,naturalPinyin:py,literal:'직접 등록한 표현',literalNote:desc,grammar:'이 표현은 실제 회화에서 자주 쓰이는 표현이에요. 단어를 하나씩 외우기보다 문장 덩어리로 익히면 더 자연스럽게 사용할 수 있어요.',errors:[{type:'표현 확장',desc:'직접 등록한 표현이에요. 비슷한 상황에서 [문장 전체]를 묶어서 활용해 보세요.',isGood:true}],situations:[{tag,cn,py}],conversation:[{cn,py,ko}],culture:'상황과 관계에 따라 말투가 달라질 수 있어요. 친구에게는 편하게, 공식적인 상황에서는 조금 더 정중하게 표현하는 것이 좋아요.',hsk:{level:2,label:'HSK 1~2급',desc:'직접 등록한 기초 표현이에요.'},recommend:[{cn,py,ko}],source:'user'};
}

function bindDynamic(){
  $$('[data-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
  $$('[data-copy]').forEach(b=>b.onclick=()=>copyText(b.dataset.copy));
  $$('[data-save]').forEach(b=>b.onclick=()=>{const p=findById(b.dataset.save); if(p) savePhrase(p)});
  $$('[data-open-id]').forEach(b=>b.onclick=()=>{const p=findById(b.dataset.openId); if(p){showView('searchView'); renderResult(p,100); addRecent(p)}});
  $$('[data-del-saved]').forEach(b=>b.onclick=()=>{state.saved.splice(Number(b.dataset.delSaved),1); Store.set('moyun_saved',state.saved); renderSaved(); toast('삭제했어요')});
}
function showView(id){$$('.view').forEach(v=>v.classList.remove('active')); $('#'+id).classList.add('active'); $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.viewTarget===id));}

function init(){
  $$('.nav-btn,.brand').forEach(b=>b.onclick=()=>showView(b.dataset.viewTarget||'searchView'));
  $$('.chip').forEach(b=>b.onclick=()=>{$$('.chip').forEach(x=>x.classList.remove('active')); b.classList.add('active'); state.situation=b.dataset.situation});
  $('#searchBtn').onclick=()=>{const input=$('#queryInput').value.trim(); if(!input){toast('표현을 입력해줘');return} const {phrase:p,score}=findBest(input); renderResult(p,score); addRecent(p)};
  $('#queryInput').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')$('#searchBtn').click()});
  $('#addForm').onsubmit=e=>{e.preventDefault(); const p=makeUserPhrase(); if(!p)return; state.userPhrases.unshift(p); Store.set('moyun_user',state.userPhrases); e.target.reset(); renderList(); toast('내 표현 사전에 등록했어요'); showView('searchView'); renderResult(p,100)};
  $('#listSearch').oninput=drawList; $('#categoryFilter').onchange=drawList;
  $('#themeBtn').onclick=()=>{const night=document.documentElement.dataset.theme==='night'; document.documentElement.dataset.theme=night?'':'night'; $('#themeBtn').textContent=night?'🌙 야간모드':'☀️ 기본모드'};
  renderToday(); renderRecent(); renderSaved(); renderList(); renderResult(todayPhrase(),100);
}
init();
