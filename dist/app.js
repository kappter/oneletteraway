const $=id=>document.getElementById(id);const starter=[{a:'regime',b:'regimen',change:'Add final n',da:'A form or system of government.',db:'A prescribed course of diet, exercise, or other activity.',shift:1,familiar:true,reviewed:true,clue:'What one-letter addition takes you from a system of government to a prescribed training routine?'},{a:'untied',b:'united',change:'Move i two places right',da:'Not tied or fastened.',db:'Joined together.',shift:3,familiar:true,reviewed:true,clue:'Move one letter to go from unfastened to joined. (Opposition depends on the selected senses.)'}];let found=[];let saved=[];try{saved=JSON.parse(localStorage.getItem('wordplay-v1')||'[]')}catch{}const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const norm=s=>s.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'');const score=p=>1+(p.reviewed?Number(p.familiar)+Number(p.shift):0);function relation(a,b){if(a===b)return null;if(norm(a)===norm(b))return a.toLowerCase()===b.toLowerCase()?'Change capitalization':'Change a diacritic';a=a.toLowerCase();b=b.toLowerCase();if(a===b)return 'Change capitalization';if(Math.abs(a.length-b.length)>1)return null;if(a.length!==b.length){let x=a.length<b.length?a:b,y=a.length<b.length?b:a;for(let i=0;i<y.length;i++)if(y.slice(0,i)+y.slice(i+1)===x)return a.length<b.length?'Add '+y[i]:'Remove '+y[i];return null}let diff=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])diff++;if(diff===1)return 'Replace one letter';if([...a].sort().join('')!==[...b].sort().join(''))return null;for(let i=0;i<a.length;i++){let rest=a.slice(0,i)+a.slice(i+1);for(let j=0;j<=rest.length;j++)if(rest.slice(0,j)+a[i]+rest.slice(j)===b)return 'Move '+a[i]}return null}
function scan(){let words=[...new Set(($('text').value.match(/\p{L}[\p{L}\p{M}]*/gu)||[]))].filter(w=>w.length>1);if(words.length>1500){$('status').textContent='Please use a smaller chunk: up to 1,500 unique words.';return}if(!words.length){$('status').textContent='Paste some text or try the sample first.';return}found=[];let keys=new Set();function add(p){let k=[p.a.toLowerCase(),p.b.toLowerCase()].sort().join('|');if(keys.has(k))return;keys.add(k);found.push({...p,source:$('source').value})}let lower=new Set(words.map(w=>w.toLowerCase()));for(let p of starter)if(lower.has(p.a)||lower.has(p.b))add(p);for(let i=0;i<words.length;i++)for(let j=i+1;j<words.length;j++){let change=relation(words[i],words[j]);if(change)add({a:words[i],b:words[j],change,reviewed:false,shift:1,familiar:false,da:'',db:'',clue:''})}found.sort((a,b)=>score(b)-score(a));$('status').textContent=`Scanned ${words.length} unique words · ${found.length} candidates. Sense review comes next.`;render(true)}
function card(p,i,collection=false){return `<article class="card"><span class="score">${score(p)}/5${p.reviewed?'':' · provisional'}</span><div class="pair">${esc(p.a)} → ${esc(p.b)}</div><p class="muted">${esc(p.change)} · ${p.reviewed?'Reviewed senses':'Needs definition & sense review'}</p>${p.reviewed?`<p>${esc(p.da)} → ${esc(p.db)}</p>`:''}<p><a target="_blank" rel="noopener" href="https://www.merriam-webster.com/dictionary/${encodeURIComponent(p.a)}">Look up ${esc(p.a)} ↗</a> · <a target="_blank" rel="noopener" href="https://www.merriam-webster.com/dictionary/${encodeURIComponent(p.b)}">Look up ${esc(p.b)} ↗</a></p>${collection?`<p class="muted">${esc(p.source||'First discovery')}</p><p>${esc(p.clue||'')}</p><button class="secondary" data-remove="${i}">Remove</button>`:`<details><summary>Review senses & score</summary><label>Sense of ${esc(p.a)}</label><input data-field="da" data-i="${i}" value="${esc(p.da)}"><label>Sense of ${esc(p.b)}</label><input data-field="db" data-i="${i}" value="${esc(p.db)}"><label>Meaning relationship</label><select data-field="shift" data-i="${i}"><option value="1" ${p.shift===1?'selected':''}>Different meanings · +1</option><option value="2" ${p.shift===2?'selected':''}>Striking contrast · +2</option><option value="3" ${p.shift===3?'selected':''}>Opposing senses · +3</option></select><label><input style="width:auto" type="checkbox" data-field="familiar" data-i="${i}" ${p.familiar?'checked':''}> Familiar meanings, fair clue · +1</label><label>Puzzle clue</label><input data-field="clue" data-i="${i}" value="${esc(p.clue)}"><div class="actions"><button data-review="${i}">Confirm senses & score</button></div></details><button class="secondary" data-save="${i}">Keep connection +</button>`}</article>`}
const findingGroups = [
  ['move', 'Move a letter', 'Same letters, one relocated.'],
  ['reviewed', 'Reviewed connections', 'Selected senses and full scores.'],
  ['add', 'Add a letter', 'One extra letter opens another door.'],
  ['remove', 'Remove a letter', 'See what a word becomes when one letter leaves.'],
  ['replace', 'Replace a letter', 'A single substitution changes the word.'],
  ['accent', 'Accents & diacritics', 'A small mark can make a difference.'],
  ['capitalization', 'Capitalization', 'Includes ordinary sentence-case changes; meanings need review.'],
  ['other', 'Other adjustments', 'More connections to explore.'],
  ['plural', 'Likely pluralization only', 'Spelling-based candidates such as challenge → challenges. Some may be verb forms or have another sense; review before scoring.']
];
// Conservative spelling screen, not a dictionary/sense judgment. One-edit
// regular plurals add/remove s; -es/-ies changes are outside this scanner.
function likelyPluralOnly(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const base = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  if (base.length < 3 || longer !== base + 's') return false;
  if (/(ss|us|is|sh|ch|x|z|s)$/.test(base)) return false;
  const exceptions = new Set([
    'thi','thu','hi','ga','bia','len','new','mean','thank',
    'ask','look','take','make','give','get','put','see','say','run',
    'read','write','teach','learn','think','know','feel','keep','find',
    'seem','become','provide','include','require','want','need','love',
    'like','hate','work','play','use','move','come','leave','live',
    'help','try','let','stand','sit','walk','talk','hear','listen'
  ]);
  return !exceptions.has(base);
}
function findingType(p) {
  if (p.reviewed) return 'reviewed';
  if (likelyPluralOnly(p.a, p.b)) return 'plural';
  if (/^Add /i.test(p.change)) return 'add';
  if (/^Remove /i.test(p.change)) return 'remove';
  if (/^Replace /i.test(p.change)) return 'replace';
  if (/^Move /i.test(p.change)) return 'move';
  if (/diacritic/i.test(p.change)) return 'accent';
  if (/capitalization/i.test(p.change)) return 'capitalization';
  return 'other';
}
function render(resetGroups = false) {
  const prior = new Map(Array.from(document.querySelectorAll('.finding-group'), el => [el.dataset.group, el.open]));
  const filter = $('filter').value;
  const list = found.map((p,i)=>({p,i})).filter(({p})=>filter==='all'||(filter==='reviewed'?p.reviewed:!p.reviewed));
  const groups = findingGroups.map(([key,title,description])=>({key,title,description,items:list.filter(({p})=>findingType(p)===key)})).filter(group=>group.items.length);
  $('count').textContent=found.length?`(${found.length})`:'';
  $('results').className='';
  $('results').innerHTML=groups.length ? '<p class="muted group-help">Grouped by adjustment. Open a group to explore its connections.</p>' + groups.map((group,index)=>{
    const open = resetGroups || !prior.size ? index===0 : prior.get(group.key)===true;
    return `<details class="finding-group" data-group="${group.key}" ${open?'open':''}><summary><span>${group.title}</span><span class="group-count">${group.items.length}</span></summary><p class="group-description muted">${group.description}</p><div class="group-items">${group.items.map(({p,i})=>card(p,i)).join('')}</div></details>`;
  }).join('') : '<div class="empty">No matches here yet. Try another chunk or the sample.</div>';
  renderSaved();
}
function renderSaved(){$('collection').innerHTML=saved.length?saved.map((p,i)=>card(p,i,true)).join(''):'<p class="muted">A small written change. A satisfying leap in meaning. Keep your first discovery above.</p>'}function persist(){try{localStorage.setItem('wordplay-v1',JSON.stringify(saved))}catch{$('status').textContent='Browser storage unavailable. Export to keep your collection.'}}
document.addEventListener('change',e=>{let el=e.target;if(el.dataset.field){let p=found[+el.dataset.i];p[el.dataset.field]=el.type==='checkbox'?el.checked:el.dataset.field==='shift'?+el.value:el.value;p.reviewed=false}});document.addEventListener('click',e=>{let el=e.target;if(el.dataset.review!==undefined){let p=found[+el.dataset.review];if(!p.da.trim()||!p.db.trim()){alert('Add both selected definitions before confirming the score.');return}p.reviewed=true;render()}if(el.dataset.save!==undefined){let p=found[+el.dataset.save];if(!p.reviewed){alert('Review and confirm both senses before keeping this connection.');return}let k=[p.a.toLowerCase(),p.b.toLowerCase()].sort().join('|');if(!saved.some(x=>[x.a.toLowerCase(),x.b.toLowerCase()].sort().join('|')===k))saved.push({...p});persist();renderSaved()}if(el.dataset.remove!==undefined){saved.splice(+el.dataset.remove,1);persist();renderSaved()}});$('scan').onclick=scan;$('sample').onclick=()=>{$('text').value='A regime establishes a system of government. A regimen establishes a routine of training. The ropes were untied; the teams were united. We read, lead, and learn.';scan()};$('filter').onchange=()=>render(true);async function readFile(f){if(!f)return;if(!/\.(txt|md|csv)$/i.test(f.name)){$('status').textContent='Please drop a text file (.txt, .md, or .csv).';return}if(f.size>2000000){$('status').textContent='Please use a file smaller than 2 MB.';return}$('text').value=await f.text();$('source').value=f.name;$('status').textContent='Text loaded. Ready to find connections.'}$('file').onchange=e=>readFile(e.target.files[0]);$('text').ondragover=e=>e.preventDefault();$('text').ondrop=e=>{if(e.dataTransfer.files.length){e.preventDefault();readFile(e.dataTransfer.files[0])}};$('export').onclick=()=>{let url=URL.createObjectURL(new Blob([JSON.stringify(saved,null,2)],{type:'application/json'}));let a=document.createElement('a');a.href=url;a.download='wordplay-collection.json';a.click();URL.revokeObjectURL(url)};renderSaved();
