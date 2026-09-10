const STORAGE_KEY='adgmFormationStateV1';
let model={navigation:[],steps:[],documents:[],vaultCategories:[],compliance:[]};
let state={currentStep:0,data:{},completedDocs:{}};

async function init(){
  const res=await fetch('data/adgm.json');
  model=await res.json();
  state=loadState();
  renderNav();
  bindGlobal();
  renderAll();
  showView('dashboard');
}

function loadState(){
  try{return {...state,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return state}
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function isFilled(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function stepComplete(step){return step.fields.filter(f=>f.required).every(f=>isFilled(state.data[f.id]));}
function completedStepCount(){return model.steps.filter(stepComplete).length;}
function docCompleteCount(){return model.documents.filter((_,i)=>state.completedDocs[i]).length;}
function totalProgress(){
  const stepScore=completedStepCount()/Math.max(model.steps.length,1);
  const docScore=docCompleteCount()/Math.max(model.documents.length,1);
  return Math.round((stepScore*.75+docScore*.25)*100);
}

function renderNav(){
  const nav=document.getElementById('nav');
  nav.innerHTML=model.navigation.map(n=>`<button class="nav-btn" data-view="${n.id}">${n.label}</button>`).join('');
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)showView(b.dataset.view)});
}
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  const view=document.getElementById(`${id}View`);if(view)view.classList.add('active');
  const item=model.navigation.find(n=>n.id===id);document.getElementById('pageTitle').textContent=item?item.label:'Dashboard';
  if(id==='formation')renderWizard();
  if(id==='documents')renderDocuments();
  if(id==='review')renderReview();
  if(id==='vault')renderVault();
  if(id==='compliance')renderCompliance();
  if(id==='dashboard')renderDashboard();
}
function bindGlobal(){
  document.body.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go)showView(go.dataset.go)});
  document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Clear all locally saved demo data?')){localStorage.removeItem(STORAGE_KEY);state={currentStep:0,data:{},completedDocs:{}};renderAll();showView('dashboard')}});
  document.getElementById('prevBtn').addEventListener('click',()=>{captureForm();state.currentStep=Math.max(0,state.currentStep-1);saveState();renderWizard()});
  document.getElementById('saveNextBtn').addEventListener('click',()=>{captureForm();saveState();if(state.currentStep<model.steps.length-1){state.currentStep++;saveState();renderWizard()}else{renderAll();showView('review')}});
}
function renderAll(){renderDashboard();renderWizard();renderDocuments();renderReview();renderVault();renderCompliance();}

function renderDashboard(){
  const pct=totalProgress(), steps=completedStepCount(), docs=docCompleteCount();
  document.getElementById('stats').innerHTML=[
    ['Formation progress',`${pct}%`],['Sections complete',`${steps}/${model.steps.length}`],['Documents ready',`${docs}/${model.documents.length}`],['Storage','Local browser']
  ].map(([a,b])=>`<div class="stat"><span>${a}</span><strong>${b}</strong></div>`).join('');
  document.getElementById('progressLabel').textContent=`${pct}%`;
  document.getElementById('progressBar').style.width=`${pct}%`;
  document.getElementById('progressSteps').innerHTML=model.steps.map(s=>`<div class="progress-item"><span><i class="status-dot ${stepComplete(s)?'done':''}"></i>${s.title}</span><strong class="${stepComplete(s)?'good':''}">${stepComplete(s)?'Complete':'Pending'}</strong></div>`).join('');
  const pendingSteps=model.steps.filter(s=>!stepComplete(s)).slice(0,3);
  const actions=[];
  pendingSteps.forEach(s=>actions.push(`<div class="action-item"><span>Complete ${s.title}</span><button class="secondary" data-go="formation">Open</button></div>`));
  if(docCompleteCount()<model.documents.length)actions.push(`<div class="action-item"><span>Finish document readiness checklist</span><button class="secondary" data-go="documents">Open</button></div>`);
  if(!actions.length)actions.push(`<div class="action-item"><span>Review formation package</span><button class="secondary" data-go="review">Review</button></div>`);
  document.getElementById('nextActions').innerHTML=actions.join('');
}

function renderWizard(){
  if(!model.steps.length)return;
  const step=model.steps[state.currentStep]||model.steps[0];
  document.getElementById('wizardSteps').innerHTML=model.steps.map((s,i)=>`<div class="wizard-step ${i===state.currentStep?'active':''} ${stepComplete(s)?'done':''}" data-step="${i}">${i+1}. ${s.title}</div>`).join('');
  document.querySelectorAll('[data-step]').forEach(el=>el.onclick=()=>{captureForm();state.currentStep=Number(el.dataset.step);saveState();renderWizard()});
  document.getElementById('stepEyebrow').textContent=`Step ${state.currentStep+1} of ${model.steps.length}`;
  document.getElementById('stepTitle').textContent=step.title;
  document.getElementById('stepDescription').textContent=step.description;
  document.getElementById('stepStatus').textContent=stepComplete(step)?'Complete':'In progress';
  const fields=step.fields.map(f=>fieldHtml(f)).join('');
  document.getElementById('formationForm').innerHTML=`<div class="form-grid">${fields}</div>`;
  document.getElementById('prevBtn').disabled=state.currentStep===0;
  document.getElementById('saveNextBtn').textContent=state.currentStep===model.steps.length-1?'Save & review':'Save & continue';
}
function fieldHtml(f){
  const val=state.data[f.id]??'';
  let input='';
  if(f.type==='select')input=`<select id="${f.id}"><option value="">Select</option>${f.options.map(o=>`<option ${String(val)===o?'selected':''}>${o}</option>`).join('')}</select>`;
  else if(f.type==='textarea')input=`<textarea id="${f.id}">${escapeHtml(val)}</textarea>`;
  else input=`<input id="${f.id}" type="${f.type}" value="${escapeAttr(val)}" ${f.type==='number'?'min="0"':''}/>`;
  return `<div class="field ${f.type==='textarea'?'full':''}"><label for="${f.id}">${f.label}${f.required?' *':''}</label>${input}</div>`;
}
function captureForm(){
  const step=model.steps[state.currentStep];if(!step)return;
  step.fields.forEach(f=>{const el=document.getElementById(f.id);if(el)state.data[f.id]=el.value});
  saveState();renderDashboard();
}

function renderDocuments(){
  document.getElementById('documentList').innerHTML=model.documents.map((d,i)=>`<label class="check-item"><span>${d}</span><input type="checkbox" data-doc="${i}" ${state.completedDocs[i]?'checked':''}></label>`).join('');
  document.querySelectorAll('[data-doc]').forEach(el=>el.onchange=()=>{state.completedDocs[el.dataset.doc]=el.checked;saveState();renderDocuments();renderDashboard();renderReview()});
  document.getElementById('docCount').textContent=`${docCompleteCount()} / ${model.documents.length} ready`;
}
function renderReview(){
  const items=model.steps.map(s=>({name:s.title,ok:stepComplete(s)}));
  items.push({name:'Supporting document checklist',ok:docCompleteCount()===model.documents.length});
  document.getElementById('reviewList').innerHTML=items.map(i=>`<div class="review-item"><span>${i.name}</span><strong class="${i.ok?'good':'warn'}">${i.ok?'Ready':'Needs attention'}</strong></div>`).join('');
  const ready=items.every(i=>i.ok);
  document.getElementById('reviewStatus').textContent=ready?'Ready for filing review':'Incomplete';
}
function renderVault(){
  document.getElementById('vaultList').innerHTML=model.vaultCategories.map(v=>`<div class="vault-card"><strong>${v.name}</strong><span>${v.description}</span><p class="muted">Secure upload requires a production backend.</p></div>`).join('');
}
function renderCompliance(){
  document.getElementById('complianceList').innerHTML=model.compliance.map(c=>`<div class="timeline-item"><div class="timeline-date">${c.when}</div><div><strong>${c.title}</strong><p class="muted">${c.description}</p></div></div>`).join('');
}
function escapeHtml(v){return String(v).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function escapeAttr(v){return escapeHtml(v).replace(/"/g,'&quot;')}

document.addEventListener('DOMContentLoaded',init);
