const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const html = fs.readFileSync(require('path').join(__dirname, '../index.html'), 'utf8');
const timeout = html.slice(html.indexOf('function withConnectionTimeout('), html.indexOf('async function ensureAuth('));
const helper = html.slice(html.indexOf('function resilientSnapshot('), html.indexOf('function boundPlayerId('));
let intervals = new Map(), timers = new Map(), handlers = new Map(), counter = 0;
const add = (n, f) => { if (!handlers.has(n)) handlers.set(n, new Set()); handlers.get(n).add(f); };
const remove = (n, f) => handlers.get(n)?.delete(f);
const fire = n => [...(handlers.get(n) || [])].forEach(f => f());
const document = {visibilityState: 'visible', addEventListener: add, removeEventListener: remove};
const navigator = {onLine: true};
const context = vm.createContext({document, navigator, window: {addEventListener:add, removeEventListener:remove},
  setInterval: (f, ms) => {const id = ++counter; intervals.set(id, {f, ms}); return id;}, clearInterval:id=>intervals.delete(id),
  setTimeout: (f, ms) => {const id = ++counter; timers.set(id, {f, ms}); return id;}, clearTimeout:id=>timers.delete(id)});
vm.runInContext(timeout + helper, context);
const flush = async () => {for (let i=0;i<20;i++) await Promise.resolve();};
const snap = (value, extra={}) => ({value, metadata: {fromCache:false, hasPendingWrites:false, ...extra}});
function source() {
  const r = {calls:0, pending:[], stopped:false, get: options=>{assert.equal(options.source,'server');r.calls++;return new Promise((resolve,reject)=>r.pending.push({resolve,reject}));},
    onSnapshot: (options,next,error)=>{r.next=next;r.error=error;return()=>r.stopped=true;}};
  return r;
}
(async()=>{
 const ref = source(), values=[], errors=[];
 const stop = context.resilientSnapshot(ref, {includeMetadataChanges:true}, s=>values.push(s.value), e=>errors.push(e));
 const poll = [...intervals.values()].find(t=>t.ms===5000).f;
 ref.next(snap('initial')); ref.next(snap('instant update'));
 assert.deepEqual(values,['initial','instant update']);assert.equal(ref.calls,0);
 // No stream event arrives for a remote request. Reconciliation finds it.
 poll();poll();assert.equal(ref.calls,1);ref.pending.shift().resolve(snap('remote request'));await flush();assert.equal(values.at(-1),'remote request');
 // An approval removes a pending request even when its live stream is stalled.
 poll();ref.pending.shift().resolve(snap('approved, pending queue empty'));await flush();assert.equal(values.at(-1),'approved, pending queue empty');
 poll();ref.next(snap('newer stream update'));ref.pending.shift().resolve(snap('old read'));await flush();assert.equal(values.at(-1),'newer stream update');
 for(const metadata of [{fromCache:true},{hasPendingWrites:true}]){poll();ref.pending.shift().resolve(snap('unconfirmed',metadata));await flush();assert.equal(values.at(-1),'newer stream update');}
 document.visibilityState='hidden';poll();assert.equal(ref.calls,5);document.visibilityState='visible';fire('visibilitychange');assert.equal(ref.calls,6);ref.pending.shift().resolve(snap('foreground update'));await flush();assert.equal(values.at(-1),'foreground update');
 navigator.onLine=false;poll();assert.equal(ref.calls,6);navigator.onLine=true;fire('online');ref.pending.shift().reject({code:'unavailable'});await flush();assert.equal(errors.at(-1).code,'unavailable');
 poll();ref.pending.shift().resolve(snap('recovered after network error'));await flush();assert.equal(values.at(-1),'recovered after network error');
 poll();const late=ref.pending.shift();stop();late.resolve(snap('wrong seat'));ref.next(snap('detached'));await flush();assert.equal(values.at(-1),'recovered after network error');assert(ref.stopped);assert.equal(intervals.size,0);assert.equal(timers.size,0);assert([...handlers.values()].every(s=>s.size===0));
 console.log('PASS: instant live delivery, silent-stall recovery, approval queue removal, stale-read protection, foreground/online recovery, no overlapping reads, confirmed server data only, detached listener cleanup.');
 const ancillary=source();const cancel=context.resilientSnapshot(ancillary,{},()=>{},()=>{},20000);assert.equal([...intervals.values()][0].ms,20000);cancel();
 console.log('PASS: event history and host-control use a slower reconciliation interval.');
})().catch(e=>{console.error(e);process.exitCode=1});
