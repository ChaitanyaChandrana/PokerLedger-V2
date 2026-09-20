const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const raw=[...fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).find(x=>x.includes('function PokerLedger()'));
let src=raw.replace(/const \[(\w+), (\w+)\] = useState\(/g,(_,n,set)=>`const [${n}, ${set}] = useNamedState('${n}', `).replace(/const (\w+) = useRef\(/g,(_,n)=>`const ${n} = useNamedRef('${n}', `).replace(/ReactDOM.createRoot[\s\S]*$/,'globalThis.App=PokerLedger;');
src=src.replace('  const allPlayers = game ?', '  globalThis.api={listenTo,reconnectGame,handleJoin,leaveGame,resumeExistingSeat};\n  const allPlayers = game ?');
const clone=x=>JSON.parse(JSON.stringify(x));
const base={code:'TEST',name:'test',protocolVersion:26,appVersion:'2.6',phase:'active',joinLocked:false,hostId:'h',hostUid:'uh',coHostId:'c',coHostUid:'uc',buyInCents:4000,buyInAmount:40,chipsPerDollar:1,revision:1,members:{uh:'h',uc:'c'},players:{}};
for(const [id,count] of [['h',3],['c',2]])base.players[id]={id,name:id,authUid:'u'+id,buyins:Array.from({length:count},(_,i)=>({id:id+i,ts:i+1,kind:i?'rebuy':'initial',amountCents:4000,amount:40})),cashedOut:false,finalAmount:null};
let ctx,state,refs,effects,store,auth,timers,subscriptions,game,getError,writes,signins,tree,authCallback,tokenCalls,events;
function setup({who='h',phase='active',locked=false,boot=false,noAuth=false,saved=true,readError=null,url=true,guestName=null}={}){
 game=clone(base);game.phase=phase;game.joinLocked=locked;refs={};effects=[];timers=new Map();subscriptions=[];store=new Map();events={};writes=0;signins=0;tokenCalls=0;getError=readError;
 if(guestName!==null)store.set('pokerGuestName',guestName);
 if(saved)store.set('pokerRole',JSON.stringify({code:'TEST',playerId:who,authUid:'u'+who}));
 state={screen:boot?'loading':'join',game:boot?null:clone(game),role:boot?null:{code:'TEST',playerId:who},pendingRequests:[],jCode:'TEST'};
 const user={uid:'u'+who,getIdToken:async()=>{tokenCalls++;return 'token'}};
 auth={currentUser:noAuth?null:user,onAuthStateChanged:cb=>{authCallback=cb;if(!noAuth)cb(auth.currentUser);return()=>{}},setPersistence:async()=>{},signInAnonymously:async()=>{signins++;auth.currentUser={uid:'new',getIdToken:async()=>''};return{user:auth.currentUser}}};
 function ref(path){return{path,id:path.split('/').pop(),collection:n=>ref(path+'/'+n),doc:n=>ref(path+'/'+n),orderBy:()=>ref(path),limit:()=>ref(path),where:()=>ref(path),get:async options=>{assert.equal(options.source,'server');if(getError)throw getError;return{exists:!!game,data:()=>clone(game)}},onSnapshot:(options,next,error)=>{const sub={path,next,error,stopped:false};subscriptions.push(sub);return()=>sub.stopped=true}}}
 const db={collection:n=>ref(n),runTransaction:async()=>{writes++;throw Error('unexpected write')}};const fb={auth:()=>auth,firestore:()=>db};fb.auth.Auth={Persistence:{LOCAL:'local'}};fb.firestore.FieldValue={serverTimestamp:()=>1};
 const storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const React={createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)}),Fragment:'fragment',useEffect:(f,deps)=>effects.push({f,deps}),useMemo:f=>f(),useCallback:f=>f};
 let timerId=0;
 ctx=vm.createContext({console:{...console,error:()=>{}},firebase:fb,React,localStorage:storage,sessionStorage:storage,navigator:{onLine:true},document:{visibilityState:'visible',addEventListener:(n,f)=>events[n]=f,removeEventListener:n=>delete events[n]},window:{location:{href:'https://test/'+(url?'?code=TEST':''),search:url?'?code=TEST':'',pathname:'/',reload:()=>{}},history:{replaceState:()=>{}},addEventListener:(n,f)=>events[n]=f,removeEventListener:n=>delete events[n]},URL,URLSearchParams,setTimeout:(f,ms)=>{const id=++timerId;timers.set(id,{f,ms});return id},clearTimeout:id=>timers.delete(id),setInterval:()=>1,clearInterval:()=>{},useNamedState:(n,init)=>{if(!(n in state))state[n]=typeof init==='function'?init():init;return[state[n],v=>state[n]=typeof v==='function'?v(state[n]):v]},useNamedRef:(n,v)=>refs[n]||(refs[n]={current:v})});
 vm.runInContext(src,ctx);render();
}
function render(){effects=[];tree=ctx.App()}
function nodes(t=tree){return !t||typeof t!=='object'?[]:[t,...t.children.flatMap(x=>x==null?[]:nodes(x))]}
function text(t){return t==null||typeof t==='boolean'?'':typeof t==='object'?t.children.map(text).join(''):String(t)}
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve()};
function publish(sub,cache=false){sub.next(sub.path.endsWith('/TEST')?{exists:true,data:()=>clone(game),metadata:{fromCache:cache}}:{docs:[],metadata:{fromCache:cache}})}
function publishCurrent(cache=false){subscriptions.filter(s=>!s.stopped).forEach(s=>publish(s,cache))}
function startBoot(){effects.find(e=>e.f.toString().includes('Strongest recovery path')).f()}
(async()=>{
 for(const phase of ['active','settling','settled'])for(const who of ['h','c']){
  setup({who,phase,locked:true});await ctx.api.handleJoin();assert.equal(state.screen,'game');assert.equal(state.role.playerId,who);assert.equal(state.game.players[who].buyins.length,who==='h'?3:2);assert.equal(writes,0);publishCurrent();assert.equal(state.connectionError,'');
 }
 console.log('PASS: existing host/player reconnect on locked, active, settling and settled tables with no new buy-ins or writes.');
 for(const url of [true,false]){setup({boot:true,url});startBoot();await flush();assert.equal(state.screen,'game');assert.equal(state.role.playerId,'h');assert.equal(signins,0);assert.equal(writes,0)}
 setup({boot:true,noAuth:true});startBoot();await flush();assert.equal(signins,0);auth.currentUser={uid:'uh',getIdToken:async()=>''};authCallback(auth.currentUser);await flush();assert.equal(state.screen,'game');assert.equal(signins,0);
 for(const who of ['h','c'])for(const url of [true,false]){setup({who,boot:true,url});startBoot();await flush();render();const welcome=nodes().find(n=>n.props.className==='returning-player-name');assert(welcome);assert.equal(text(welcome),who);assert(text(tree).includes('Your buy-ins and records are still here.'));assert.equal(writes,0);nodes().find(n=>n.type==='button'&&text(n)==='Got it').props.onClick();render();assert(!nodes().some(n=>n.props.className==='returning-player-name'));}
 setup({who:'c'});await ctx.api.handleJoin();publishCurrent();render();assert.equal(text(nodes().find(n=>n.props.className==='returning-player-name')),'c');assert.equal(writes,0);
 console.log('PASS: refresh/reopen restores original identity through URL or saved role; delayed auth restoration cannot create a new identity.');
 setup({boot:true,readError:{code:'unavailable'}});const saved=store.get('pokerRole');startBoot();await flush();assert.equal(state.screen,'reconnect');assert.equal(store.get('pokerRole'),saved);assert.equal(writes,0);
 setup({boot:true,noAuth:true});startBoot();await flush();const timeout=[...timers.values()].find(t=>t.ms===15000);assert(timeout);timeout.f();await flush();assert.equal(state.screen,'reconnect');assert(store.has('pokerRole'));
 console.log('PASS: offline/server read error and initialization timeout retain saved seat and show Retry.');
 setup();await ctx.api.handleJoin();publishCurrent();const old=subscriptions.slice();old[0].error({code:'unavailable'});assert(state.connectionError.includes('unavailable'));const retry=[...timers.values()].find(t=>t.ms===1500);assert(retry);retry.f();await flush();assert.equal(subscriptions.length,8);assert(old.every(x=>x.stopped));assert.equal(tokenCalls,1);publishCurrent();assert.equal(state.connectionError,'');game.name='stale';publish(old[0]);assert.notEqual(state.game.name,'stale');game.name='new';publishCurrent();assert.equal(state.game.name,'new');
 subscriptions.at(-1).error({code:'permission-denied'});assert(state.connectionError.includes('permission-denied'));publish(subscriptions.at(-3));assert(state.connectionError.includes('permission-denied'));
 console.log('PASS: terminal listeners reattach; healthy server data clears status; stale listeners ignored; pending-request listener failures stay visible.');
 setup();await ctx.api.handleJoin();publishCurrent();render();const resumeEffect=effects.find(e=>e.f.toString().includes('visibilitychange'));resumeEffect.f();events.visibilitychange();await flush();assert.equal(subscriptions.length,8);publishCurrent();await ctx.api.leaveGame();const count=subscriptions.length;events.online();await flush();assert.equal(subscriptions.length,count);
 console.log('PASS: returning to foreground reconnects; leaving prevents background reconnection.');
 setup();await ctx.api.handleJoin();auth.currentUser={uid:'changed',getIdToken:async()=>''};await ctx.api.reconnectGame();assert(state.connectionError.includes('identity changed'));assert.equal(subscriptions.length,4);assert.equal(writes,0);
 setup({who:'c'});auth.currentUser={uid:'other',getIdToken:async()=>''};state.jName='c';render();await ctx.api.handleJoin();assert(state.pendingRejoin&&!state.pendingRejoin.sameIdentity);assert.notEqual(state.screen,'game');assert.equal(writes,0);
 setup({noAuth:true,saved:false});authCallback(null);const users=await Promise.all([vm.runInContext('ensureAuth()',ctx),vm.runInContext('ensureAuth()',ctx)]);assert.equal(signins,1);assert.equal(users[0].uid,users[1].uid);
 console.log('PASS: changed identity is never bound by name; concurrent anonymous sign-ins are coalesced.');
 setup();await ctx.api.handleJoin();publishCurrent();render();assert.equal(state.savedRebuyQueue.length,0);
 game.players.c.buyins.push({id:'fresh',kind:'rebuy',amountCents:4000,amount:40,ts:Date.now()});
 const live=subscriptions.find(s=>s.path.endsWith('/TEST')&&!s.stopped);
 live.next({exists:true,data:()=>clone(game),metadata:{fromCache:false,hasPendingWrites:true}});assert.equal(state.savedRebuyQueue.length,0);
 publish(live);assert.equal(state.savedRebuyQueue.length,1);publish(live);assert.equal(state.savedRebuyQueue.length,1);render();assert(text(tree).includes('saved · 3 buy-ins'));assert(nodes().some(n=>n.props.className?.includes('rebuy-saved-pulse')));
 await ctx.api.reconnectGame();publishCurrent();assert.equal(state.savedRebuyQueue.length,0);
 for(const modal of ['showTableControls','showHostTransfer','showCoHostPicker']){state[modal]=true;render();state[modal]=false;}
 state.cashingOutId='h';render();assert(text(tree).includes('Your co-host will approve'));state.cashingOutId=null;
 state.pendingRequests=[{id:'pending_c',type:'buyin',status:'pending',targetId:'c',requesterUid:'uc',amountCents:4000,approvalMode:'tap',challengeId:'abc'}];render();assert(text(tree).includes('Confirm payment received'));assert(nodes().some(n=>n.type==='button'&&text(n)==='Approve'));assert(!nodes().some(n=>n.type==='button'&&text(n)==='Scan'));
 game.players.a={...clone(game.players.c),id:'a',name:'Alex',authUid:'ua'};game.members.ua='a';state.game=clone(game);state.pendingRequests=[{id:'later',type:'buyin',status:'pending',targetId:'c',requesterUid:'uc',amountCents:4000,ts:200},{id:'earlier',type:'cashout',status:'pending',targetId:'a',requesterUid:'ua',amountCents:8500,ts:100}];render();const queue=nodes().filter(n=>n.props.className==='approval-card');assert.deepEqual(queue.map(n=>n.props.key),['earlier','later']);assert(text(queue[0]).includes('Alex'));assert(text(queue[0]).includes('$85.00'));assert(text(tree).includes('2 players are waiting'));assert.equal(nodes().filter(n=>n.type==='button'&&text(n)==='Approve').length,2);
 state.role={code:'TEST',playerId:'a'};auth.currentUser={uid:'ua'};render();assert(!nodes().some(n=>n.props.className==='approval-card'));
 console.log('PASS: saved notification waits for server, pulses once, does not replay on reconnect; approval and handover controls render.');
 setup({guestName:'Chaitanya'});assert.equal(state.jName,'Chaitanya');assert.equal(state.cHostName,'Chaitanya');assert(text(tree).includes('Welcome back, Chaitanya'));assert.equal(writes,0);assert.equal(state.screen,'join');
 const change=nodes().find(n=>n.type==='button'&&text(n)==='Not you? Change name');assert(change);change.props.onClick();render();assert.equal(state.jName,'');assert.equal(store.has('pokerGuestName'),false);assert(nodes().some(n=>n.props.id==='setup-jName'));assert.equal(auth.currentUser.uid,'uh');assert.equal(writes,0);
 setup();await ctx.api.handleJoin();publishCurrent();render();const remember=effects.find(e=>e.f.toString().includes('saveGuestName(ownGuestName)'));assert(remember);remember.f();assert.equal(store.get('pokerGuestName'),'h');assert.equal(state.cHostName,'h');assert.equal(writes,0);await ctx.api.leaveGame();assert.equal(store.get('pokerGuestName'),'h');assert.equal(store.has('pokerRole'),false);
 setup();auth.currentUser={uid:'different'};render();effects.find(e=>e.f.toString().includes('saveGuestName(ownGuestName)')).f();assert.equal(store.has('pokerGuestName'),false);
 setup({guestName:'x'.repeat(61)});assert.equal(state.jName,'');ctx.localStorage.getItem=()=>{throw Error('blocked')};ctx.localStorage.setItem=()=>{throw Error('blocked')};ctx.localStorage.removeItem=()=>{throw Error('blocked')};assert.equal(vm.runInContext('loadGuestName()',ctx),'');vm.runInContext('saveGuestName("Cha");forgetGuestName()',ctx);
 console.log('PASS: guest name prefills join/create without writes; change name preserves identity; own-seat name survives leaving; storage failures are safe.');
 setup({phase:'settling'});await ctx.api.handleJoin();publishCurrent();render();assert(text(tree).includes('Calculate payments'));assert(text(tree).includes('Resume play'));assert(!nodes().some(n=>String(n.props.className||'').includes('mint-')));
 setup({who:'c',phase:'settling'});await ctx.api.handleJoin();publishCurrent();render();assert(text(tree).includes('Enter cash-out amount'));assert(!nodes().some(n=>String(n.props.className||'').includes('fixed bottom-0')));
 console.log('PASS: neutral settlement screen renders host actions and player amount entry without duplicate footer.');
 for(const who of ['h','c']){
  setup({who,phase:'settling'});await ctx.api.handleJoin();publishCurrent();
  for(const id of ['a','d'])game.players[id]={...clone(game.players.c),id,name:id,authUid:'u'+id};
  game.phase='settled';game.settlement={nets:{h:-30,c:10,a:25,d:-5},transactions:[{from:'h',to:'c',amount:10},{from:'h',to:'a',amount:20},{from:'d',to:'a',amount:5}]};
  for(const p of Object.values(game.players)){p.cashedOut=true;p.finalAmount=p.buyins.length*40+game.settlement.nets[p.id];p.finalCents=p.finalAmount*100;}
  publishCurrent();render();assert(text(tree).includes('Who pays whom'));assert(text(tree).includes('h pays c'));assert(text(tree).includes('h pays a'));assert(text(tree).includes('d pays a'));const compact=nodes().filter(n=>String(n.props.className).startsWith('payout-result '));assert.deepEqual(compact.map(n=>n.props.key),['result-a','result-c','result-d','result-h']);assert(text(compact[0]).includes('+$25.00'));assert(text(compact[3]).includes('−$30.00'));const mine=nodes().filter(n=>n.type==='li'&&n.props.className==='settlement-transfer mine');assert.equal(mine.length,who==='h'?2:1);assert(mine.every(n=>text(n).includes(who==='h'?'You pay':'You receive')));assert.equal(nodes().filter(n=>n.type==='li'&&String(n.props.className).includes('settlement-transfer')).length,3);assert(!text(tree).includes('Final tally'));assert(!text(tree).includes('Total in'));assert(!nodes().some(n=>n.type==='textarea'));const details=nodes().find(n=>n.type==='button'&&text(n)==='View details');assert(details);details.props.onClick();render();assert.equal(nodes().filter(n=>n.type==='li'&&String(n.props.className).includes('settlement-transfer')).length,3);assert(text(tree).includes('Cash-out'));assert(text(tree).includes('Total in'));assert(text(tree).includes('Final tally'));const tallyRows=nodes().filter(n=>['a','c','d','h'].includes(n.props.key)&&String(n.props.className).includes('rounded-lg border'));assert.deepEqual(tallyRows.map(n=>n.props.key),['a','c','d','h']);assert(text(tallyRows[0]).includes('+$25.00Won'));assert(text(tallyRows[3]).includes('-$30.00Lost'));assert.equal(writes,0);
  const requests=nodes().filter(n=>n.type==='button'&&text(n)==='Request money');assert.equal(requests.length,who==='c'?1:0);
  if(who==='c'){
   requests[0].props.onClick();render();
   nodes().find(n=>n.props.id==='payment-contact').props.onChange({target:{value:'Zelle: c@example.com'}});render();
   const preview=nodes().find(n=>n.props.className==='payment-request-preview');assert(preview.props.value.includes('Hi h, please send $10.00 to c'));assert(preview.props.value.includes('Zelle: c@example.com'));
   nodes().find(n=>n.props.id==='payment-link').props.onChange({target:{value:'https://venmo.com/example'}});render();const linked=nodes().find(n=>n.props.className==='payment-request-preview');assert(linked.props.value.includes('Payment link: https://venmo.com/example'));
   let shared;ctx.navigator.share=async payload=>{shared=payload.text};await nodes().find(n=>n.type==='button'&&text(n)==='Share request').props.onClick();assert.equal(shared,linked.props.value);
   let copied;ctx.navigator.clipboard={writeText:async value=>{copied=value}};await nodes().find(n=>n.type==='button'&&text(n)==='Copy text').props.onClick();assert.equal(copied,linked.props.value);
   ctx.navigator.share=async()=>{throw {name:'AbortError'}};copied=null;await nodes().find(n=>n.type==='button'&&text(n)==='Share request').props.onClick();assert.equal(copied,null);
   ctx.navigator.clipboard.writeText=async()=>{throw Error('blocked')};await nodes().find(n=>n.type==='button'&&text(n)==='Copy text').props.onClick();render();assert(text(tree).includes('Select the message below'));assert.equal(writes,0);
  }
  await ctx.api.reconnectGame();publishCurrent();render();assert(text(tree).includes('d pays a'));assert.equal(writes,0);
 }
 setup({who:'c',phase:'settled'});game.coHostId=null;game.coHostUid=null;game.settlement={nets:{h:-10,c:10},transactions:[{from:'h',to:'c',amount:10}]};state.game=clone(game);state.screen='game';state.showSettlementDetails=true;render();assert(!text(tree).includes('Share payouts'));assert(!text(tree).includes('Share settlement'));assert(text(tree).includes('Request money'));
 game.coHostId='c';game.coHostUid='uc';state.game=clone(game);render();assert(!text(tree).includes('Share payouts'));assert(!text(tree).includes('Share settlement'));
 assert.equal(vm.runInContext('canApproveTableRequest',ctx)(game,{targetId:'h'},'c','uc'),true);game.coHostId=null;game.coHostUid=null;assert.equal(vm.runInContext('canApproveTableRequest',ctx)(game,{targetId:'h'},'c','uc'),false);
 console.log('PASS: host and player both see every final transfer, personal totals and results after live settlement and reconnect.');




})().catch(e=>{console.error(e);process.exitCode=1});
