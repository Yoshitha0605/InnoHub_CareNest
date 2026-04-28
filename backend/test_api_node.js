const fetch = globalThis.fetch || require('node-fetch');
const BASE = 'http://127.0.0.1:8000';

async function req(path, opts = {}){
  const controller = new AbortController();
  const timeout = opts.timeout || 5000;
  const id = setTimeout(()=>controller.abort(), timeout);
  try{
    const res = await fetch(BASE+path, {...opts, signal: controller.signal});
    const text = await res.text();
    try{ return JSON.parse(text); } catch(e){ return text; }
  }catch(e){ return {error: String(e)}; }
  finally{ clearTimeout(id); }
}

(async ()=>{
  console.log('Testing /hospital-status');
  console.log(await req('/hospital-status'));

  console.log('Testing /predict');
  console.log(await req('/predict',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({patient_count:90,beds_available:100}), timeout:7000}));

  console.log('Testing /alerts');
  console.log(await req('/alerts'));
})();
