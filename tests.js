const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
const expr = {
  lower2: x=>-Math.sqrt(4-x*x), upper2: x=>Math.sqrt(4-x*x),
  lower8: x=>-Math.sqrt(8-x*x), upper8: x=>Math.sqrt(8-x*x),
  lower9: x=>-Math.sqrt(9-x*x), upper9: x=>Math.sqrt(9-x*x),
  bad: ()=>NaN, zero: ()=>0, one: ()=>1
};
const ctx = vm.createContext({console, window:{addEventListener(){}}, math:{compile:name=>({evaluate:({x})=>expr[name](x)})}});
vm.runInContext(script, ctx);
const f = fn=>({evaluate:fn});
const cases = [
  ['paraboloides', ({x,y})=>8-x*x-y*y,({x,y})=>x*x+y*y,2,'lower2','upper2',16*Math.PI],
  ['esfera-cono',({x,y})=>Math.sqrt(Math.max(0,16-x*x-y*y)),({x,y})=>Math.hypot(x,y),Math.sqrt(8),'lower8','upper8',64*Math.PI/3*(2-Math.sqrt(2))],
  ['cilindro-plano',({y})=>4-y,()=>0,2,'lower2','upper2',16*Math.PI],
  ['hemisferio',({x,y})=>Math.sqrt(Math.max(0,9-x*x-y*y)),()=>0,3,'lower9','upper9',18*Math.PI]
];
for(const [name,s,i,r,lo,hi,exact] of cases){
  const actual=ctx.integrarMejorado(f(s),f(i),-r,r,lo,hi);
  assert.ok(Math.abs(actual/exact-1)<0.002, name + ': error de integración');
  ctx.expected=exact; ctx.presetName=name;
  assert.ok(vm.runInContext('Math.abs(presets[presetName].exacto / expected - 1) < 1e-12',ctx));
  console.log(name+': error relativo '+(100*Math.abs(actual/exact-1)).toFixed(5)+'%');
}
assert.throws(()=>ctx.integrarMejorado(f(()=>0),f(()=>1),0,1,'zero','one'));
assert.throws(()=>ctx.integrarMejorado(f(()=>1),f(()=>0),0,1,'bad','one'));
assert.throws(()=>ctx.integrarMejorado(f(()=>NaN),f(()=>0),0,1,'zero','one'));
assert.equal(ctx.evaluar(f(()=>Infinity),{}),null);
assert.ok(!/AIza[\w-]{20,}/.test(html), 'No debe contener claves de Google');
assert.ok(!html.includes('MathJax.Hub'), 'No debe invocar la API de MathJax 2');
console.log('Validaciones y revisión de credenciales: OK');
