const $=s=>document.querySelector(s),money=n=>"Rs "+Number(n).toLocaleString("en-US"),ST=["Pending","Active","Expired","Cancelled"];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const PAY={easypaisa:"Easypaisa",jazzcash:"JazzCash",cash:"Cash at the gym"};
document.addEventListener("click",e=>{if(e.target.id=="th"){const d=document.documentElement,n=(d.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"))=="dark"?"light":"dark";d.dataset.theme=n;try{localStorage.setItem("ironforge-theme",n)}catch(x){}}});
let sound=localStorage.getItem("snd")!="off",ac;const snd=()=>$("#snd").textContent=sound?"Sound on":"Sound off";snd();
$("#snd").onclick=()=>{sound=!sound;localStorage.setItem("snd",sound?"on":"off");snd()};
function beep(){if(!sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;g.gain.setValueAtTime(.2,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.7);o.start();o.stop(ac.currentTime+.7)}catch(e){}}
if(!window.FIREBASE_CONFIG){$("#login").innerHTML="<h1>Setup needed</h1><p>Add your Firebase config in js/firebase-config.js, then reload.</p>"}
else{firebase.initializeApp(FIREBASE_CONFIG);const auth=firebase.auth(),db=firebase.firestore(),open=new Set();let orders=[],unsub,first=true;
$("#lf").onsubmit=async e=>{e.preventDefault();$("#le").textContent="";try{await auth.signInWithEmailAndPassword($("#em").value,$("#pw").value)}catch(x){$("#le").textContent="Sign-in failed. Check the email and password."}};
$("#out").onclick=()=>auth.signOut();
auth.onAuthStateChanged(u=>{$("#login").hidden=!!u;$("#dash").hidden=!u;$("#out").hidden=!u;if(unsub)unsub();first=true;
 if(u)unsub=db.collection("gymMembers").orderBy("createdAt","desc").onSnapshot(s=>{$("#msg").textContent="";if(!first&&s.docChanges().some(c=>c.type=="added"))beep();first=false;orders=s.docs.map(d=>({...d.data(),id:d.id}));draw()},e=>$("#msg").textContent="Cannot load memberships: "+e.message)});
function draw(){const fs=$("#fs").value,fp=$("#fp").value,q=$("#fq").value.toLowerCase(),c=s=>orders.filter(o=>o.status==s).length;
 $("#st").innerHTML=`<div><b>${orders.length}</b>Total joins</div>`+ST.slice(0,3).map(s=>`<div><b>${c(s)}</b>${s}</div>`).join("");
 const l=orders.filter(o=>(!fs||o.status==fs)&&(!fp||o.plan==fp)&&JSON.stringify([o.id,o.member]).toLowerCase().includes(q));
 $("#list").innerHTML=l.length?l.map(o=>{const m=o.member||{},t=o.createdAt?.toDate?o.createdAt.toDate().toLocaleString():"";
 return `<details class="ord${o.status=="Pending"?" new":""}" data-id="${o.id}"${open.has(o.id)?" open":""}><summary><b>${o.id}</b><span>${esc(m.name)}<br><small>${esc(m.email)}</small></span><span>${esc(o.plan)} · ${esc(o.billing)}<br><small>${t}</small></span><span>${money(o.amount)}<br><small>${esc(PAY[o.payment]||o.payment)}</small></span><span class="tag">${esc(o.status)}</span></summary><div><p><b>Name:</b> ${esc(m.name)}<br><b>Email:</b> ${esc(m.email)}<br><b>Plan:</b> ${esc(o.plan)} (${esc(o.billing)})<br><b>Amount:</b> ${money(o.amount)}<br><b>Payment:</b> ${esc(PAY[o.payment]||o.payment)}${o.trx?` · <b>Transaction ID:</b> ${esc(o.trx)}`:""}</p><label class="s">Status <select data-id="${o.id}">${ST.map(s=>`<option${s==o.status?" selected":""}>${s}</option>`).join("")}</select></label></div></details>`}).join(""):"<p>No memberships yet.</p>"}
addEventListener("toggle",e=>{const d=e.target;if(d.tagName=="DETAILS"&&d.dataset.id)d.open?open.add(d.dataset.id):open.delete(d.dataset.id)},true);
$("#fs").onchange=$("#fp").onchange=$("#fq").oninput=draw;
document.addEventListener("change",e=>{if(e.target.tagName=="SELECT"&&e.target.dataset.id)db.collection("gymMembers").doc(e.target.dataset.id).update({status:e.target.value}).catch(x=>$("#msg").textContent="Could not update: "+x.message)})}
