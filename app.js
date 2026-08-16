const KEY="switchpilot-devices";
let page="dashboard";
let devices=JSON.parse(localStorage.getItem(KEY)||"[]");
if(!devices.length) devices=[
 {id:1,name:"Office Core Switch",brand:"TP-Link",model:"TL-SG3428XMP",ip:"192.168.1.10",protocol:"SNMP",status:"Online",ports:28,active:18,poe:"126 W"},
 {id:2,name:"Warehouse Switch",brand:"Cisco",model:"CBS350-24P",ip:"192.168.1.20",protocol:"SNMP",status:"Online",ports:24,active:12,poe:"84 W"}
];
function save(){localStorage.setItem(KEY,JSON.stringify(devices))}
function byId(id){return devices.find(x=>x.id==id)}
function deviceCard(d){
 return `<div class="card device" onclick="openDevice(${d.id})">
 <div class="deviceIcon">⇄</div><div class="grow"><div class="name">${esc(d.name)}</div>
 <div class="sub">${esc(d.brand)} · ${esc(d.model)} · ${esc(d.ip)}</div></div>
 <span class="badge ${d.status==='Online'?'':'offline'}">${d.status}</span></div>`}
function esc(s){return String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function render(){
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 const v=document.getElementById("view");
 if(page==="dashboard"){
  const online=devices.filter(x=>x.status==="Online").length;
  const active=devices.reduce((a,x)=>a+x.active,0);
  v.innerHTML=`<div class="grid">
   <div class="card"><div class="label">Switches Online</div><div class="metric">${online}/${devices.length}</div></div>
   <div class="card"><div class="label">Active Ports</div><div class="metric">${active}</div></div>
   <div class="card"><div class="label">PoE Devices</div><div class="metric">${Math.max(0,Math.round(active*.65))}</div></div>
   <div class="card"><div class="label">Alerts</div><div class="metric">${devices.length?2:0}</div></div></div>
   <div class="section"><h2>My Switches</h2><button class="secondary" onclick="page='devices';render()">View all</button></div>
   ${devices.map(deviceCard).join("")}`;
 } else if(page==="devices"){
  v.innerHTML=`<div class="section"><h2>All Switches</h2><button class="secondary" onclick="openAdd()">+ Add</button></div>${devices.map(deviceCard).join("")||'<div class="card">No switches added.</div>'}`;
 } else if(page==="alerts"){
  v.innerHTML=`<div class="section"><h2>Alerts</h2></div>
  <div class="card alert"><div class="name">PoE power usage high</div><div class="sub">Office Core Switch · 2 minutes ago</div></div>
  <div class="card alert"><div class="name">Port 18 disconnected</div><div class="sub">Warehouse Switch · 12 minutes ago</div></div>`;
 } else {
  v.innerHTML=`<div class="section"><h2>Settings</h2></div>
  <div class="card"><div class="row"><span>Theme</span><b>System</b></div><div class="row"><span>Discovery</span><b>Demo</b></div><div class="row"><span>Backend adapters</span><b>${devices.length} configured</b></div></div>
  <div class="card"><div class="name">Universal Adapter Architecture</div><p class="sub">SNMP, REST API, SSH and NETCONF adapters can connect this interface to supported switch families.</p></div>`;
 }
}
function openAdd(){document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function addSwitch(){
 const name=swName.value.trim(),brand=swBrand.value,model=swModel.value.trim(),ip=swIP.value.trim(),protocol=swProtocol.value;
 if(!name||!model||!ip){alert("Please enter Name, Model and IP Address.");return}
 devices.push({id:Date.now(),name,brand,model,ip,protocol,status:"Online",ports:24,active:Math.floor(Math.random()*15)+4,poe:"0 W"});
 save();closeModal();swName.value=swModel.value=swIP.value="";page="devices";render();
}
function openDevice(id){
 const d=byId(id); if(!d)return;
 const v=document.getElementById("view"); page="detail";
 let ports=Array.from({length:d.ports},(_,i)=>`<button class="port ${(i<d.active?'up':'')}${i===d.active+1?' warn':''}" onclick="togglePort(${d.id},${i})">${i+1}<br><small>${i<d.active?'UP':'DOWN'}</small></button>`).join("");
 v.innerHTML=`<button class="secondary" onclick="page='devices';render()">← Back</button>
 <div class="card"><div class="detailTop"><div><h2>${esc(d.name)}</h2><div class="sub">${esc(d.brand)} · ${esc(d.model)}</div></div><span class="badge">${d.status}</span></div>
 <div class="grid" style="margin-top:16px"><div><div class="label">IP Address</div><b>${esc(d.ip)}</b></div><div><div class="label">Protocol</div><b>${esc(d.protocol)}</b></div><div><div class="label">Active Ports</div><b>${d.active}/${d.ports}</b></div><div><div class="label">PoE Usage</div><b>${d.poe}</b></div></div></div>
 <div class="section"><h2>Ports</h2><span class="small">Tap to toggle demo state</span></div><div class="card"><div class="portGrid">${ports}</div></div>
 <button class="primary" onclick="alert('Demo reboot command sent. Connect a real device adapter to execute this on hardware.')">Reboot Switch</button>`;
}
function togglePort(id,i){const d=byId(id); d.active=Math.max(0,Math.min(d.ports,d.active+(i<d.active?-1:1)));save();openDevice(id)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{page=b.dataset.page;render()});
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
render();