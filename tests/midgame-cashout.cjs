const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const s=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');const a=s.indexOf('  async function recordDepartedCashOut('),b=s.indexOf('  async function confirmCashOut()',a);const code=s.slice(a,b);
async function check({actor='h',target='p',pending=false,phase='active',cashedOut=false,cents=7500}={}){
 const g={hostUid:'uh',hostId:'h',phase,revision:1,players:{h:{name:'Host'},p:{name:'Player',cashedOut,buyins:[{amountCents:4000}]}}};let written=[],errors=[],resultGame;
 const ref={collection:n=>({doc:id=>({id,kind:n})})};const c={Number,Date,JSON,APP_VERSION:'2.6',uid:()=> 'event',fromCents:n=>n/100,role:{code:'TEST',playerId:actor},ensureAuth:async()=>({uid:'u'+actor}),gamesCol:()=>({doc:()=>ref}),firebase:{firestore:{FieldValue:{serverTimestamp:()=>1}}},setGame:g=>resultGame=g,setError:e=>errors.push(e),db:{runTransaction:async f=>f({get:async r=>r===ref?{exists:true,data:()=>g}:{exists:pending,data:()=>({status:'pending'})},set:(r,v)=>written.push([r,v])})}};
 vm.createContext(c);vm.runInContext(code,c);const r=await c.recordDepartedCashOut(target,cents);return {r,written,errors,resultGame};
}
(async()=>{for(const cents of [0,7500]){const r=await check({cents});assert(r.r.ok);assert.equal(r.resultGame.phase,'active');assert.equal(r.resultGame.players.p.finalCents,cents);assert.equal(r.written.length,2);assert.equal(r.written[1][1].type,'host_cashout_recorded');}
for(const args of [{actor:'p'},{target:'h'},{pending:true},{phase:'settled'},{cashedOut:true},{cents:-1}]){const r=await check(args);assert(!r.r.ok);assert.equal(r.written.length,0);}
console.log('PASS: midgame host cash-out saves amount and audit event; blocks self, non-host, pending requests, duplicate and settled changes.');})().catch(e=>{console.error(e);process.exitCode=1});
