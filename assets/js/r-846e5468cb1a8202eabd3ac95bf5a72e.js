"use strict"
var R={};(function(n){function t(n,t){if(!n){if(t=t||"Assertion failed","undefined"!=typeof Error)throw new Error(t)
throw t}}var r=function(n,t){return Math.random()*(t-n)+n},e=function(n){if(void 0===n||isNaN(n))return[]
if("undefined"==typeof ArrayBuffer){for(var t=new Array(n),r=0;r<n;r++)t[r]=0
return t}return new Float64Array(n)},h=function(n,t){this.n=n,this.d=t,this.w=e(n*t),this.dw=e(n*t)}
h.prototype={get:function(n,r){var e=this.d*n+r
return t(e>=0&&e<this.w.length),this.w[e]},set:function(n,r,e){var h=this.d*n+r
t(h>=0&&h<this.w.length),this.w[h]=e},toJSON:function(){var n={}
return n.n=this.n,n.d=this.d,n.w=this.w,n},fromJSON:function(n){this.n=n.n,this.d=n.d,this.w=e(this.n*this.d),this.dw=e(this.n*this.d)
for(var t=0,r=this.n*this.d;t<r;t++)this.w[t]=n.w[t]}}
var i=function(n,t,r,e){var i=new h(n,t)
return a(i,-e,e),i},a=function(n,t,e){for(var h=0,i=n.w.length;h<i;h++)n.w[h]=r(t,e)},o=function(n){void 0===n&&(n=!0),this.needs_backprop=n,this.backprop=[]}
o.prototype={backward:function(){for(var n=this.backprop.length-1;n>=0;n--)this.backprop[n]()},rowPluck:function(n,r){t(r>=0&&r<n.n)
for(var e=n.d,i=new h(e,1),a=0,o=e;a<o;a++)i.w[a]=n.w[e*r+a]
if(this.needs_backprop){this.backprop.push(function(){for(var t=0,h=e;t<h;t++)n.dw[e*r+t]+=i.dw[t]})}return i},tanh:function(n){for(var t=new h(n.n,n.d),r=n.w.length,e=0;e<r;e++)t.w[e]=Math.tanh(n.w[e])
if(this.needs_backprop){this.backprop.push(function(){for(var e=0;e<r;e++){var h=t.w[e]
n.dw[e]+=(1-h*h)*t.dw[e]}})}return t},sigmoid:function(n){for(var t=new h(n.n,n.d),r=n.w.length,e=0;e<r;e++)t.w[e]=d(n.w[e])
if(this.needs_backprop){this.backprop.push(function(){for(var e=0;e<r;e++){var h=t.w[e]
n.dw[e]+=h*(1-h)*t.dw[e]}})}return t},relu:function(n){for(var t=new h(n.n,n.d),r=n.w.length,e=0;e<r;e++)t.w[e]=Math.max(0,n.w[e])
if(this.needs_backprop){this.backprop.push(function(){for(var e=0;e<r;e++)n.dw[e]+=n.w[e]>0?t.dw[e]:0})}return t},mul:function(n,r){t(n.d===r.n,"matmul dimensions misaligned")
for(var e=n.n,i=r.d,a=new h(e,i),o=0;o<n.n;o++)for(var w=0;w<r.d;w++){for(var d=0,f=0;f<n.d;f++)d+=n.w[n.d*o+f]*r.w[r.d*f+w]
a.w[i*o+w]=d}if(this.needs_backprop){this.backprop.push(function(){for(var t=0;t<n.n;t++)for(var e=0;e<r.d;e++)for(var h=0;h<n.d;h++){var o=a.dw[i*t+e]
n.dw[n.d*t+h]+=r.w[r.d*h+e]*o,r.dw[r.d*h+e]+=n.w[n.d*t+h]*o}})}return a},add:function(n,r){t(n.w.length===r.w.length)
for(var e=new h(n.n,n.d),i=0,a=n.w.length;i<a;i++)e.w[i]=n.w[i]+r.w[i]
if(this.needs_backprop){this.backprop.push(function(){for(var t=0,h=n.w.length;t<h;t++)n.dw[t]+=e.dw[t],r.dw[t]+=e.dw[t]})}return e},eltmul:function(n,r){t(n.w.length===r.w.length)
for(var e=new h(n.n,n.d),i=0,a=n.w.length;i<a;i++)e.w[i]=n.w[i]*r.w[i]
if(this.needs_backprop){this.backprop.push(function(){for(var t=0,h=n.w.length;t<h;t++)n.dw[t]+=r.w[t]*e.dw[t],r.dw[t]+=n.w[t]*e.dw[t]})}return e}}
var w=function(){this.decay_rate=.999,this.smooth_eps=1e-8,this.step_cache={}}
w.prototype={step:function(n,t,r,e){var i={},a=0,o=0
for(var w in n)if(n.hasOwnProperty(w)){var d=n[w]
w in this.step_cache||(this.step_cache[w]=new h(d.n,d.d))
for(var f=this.step_cache[w],s=0,u=d.w.length;s<u;s++){var c=d.dw[s]
f.w[s]=f.w[s]*this.decay_rate+(1-this.decay_rate)*c*c,c>e&&(c=e,a++),c<-e&&(c=-e,a++),o++,d.w[s]+=-t*c/Math.sqrt(f.w[s]+this.smooth_eps)-r*d.w[s],d.dw[s]=0}}return i.ratio_clipped=1*a/o,i}}
var d=function(n){return 1/(1+Math.exp(-n))}
n.maxi=function(n){for(var t=n[0],r=0,e=1,h=n.length;e<h;e++){var i=n[e]
i>t&&(r=e,t=i)}return r},n.samplei=function(n){for(var t=r(0,1),e=0,h=0;;){if((e+=n[h])>t)return h
h++}return n.length-1},n.randi=function(n,t){return Math.floor(Math.random()*(t-n)+n)},n.softmax=function(n){for(var t=new h(n.n,n.d),r=-999999,e=0,i=n.w.length;e<i;e++)n.w[e]>r&&(r=n.w[e])
var a=0
for(e=0,i=n.w.length;e<i;e++)t.w[e]=Math.exp(n.w[e]-r),a+=t.w[e]
for(e=0,i=n.w.length;e<i;e++)t.w[e]/=a
return t},n.assert=t,n.Mat=h,n.RandMat=i,n.forwardLSTM=function(n,t,r,e,h){if(void 0===h.h)for(var i=[],a=[],o=0;o<r.length;o++)i.push(new R.Mat(r[o],1)),a.push(new R.Mat(r[o],1))
else i=h.h,a=h.c
var w=[],d=[]
for(o=0;o<r.length;o++){var f=0===o?e:w[o-1],s=i[o],u=a[o],c=n.mul(t["Wix"+o],f),p=n.mul(t["Wih"+o],s),l=n.sigmoid(n.add(n.add(c,p),t["bi"+o])),v=n.mul(t["Wfx"+o],f),g=n.mul(t["Wfh"+o],s),m=n.sigmoid(n.add(n.add(v,g),t["bf"+o])),b=n.mul(t["Wox"+o],f),W=n.mul(t["Woh"+o],s),k=n.sigmoid(n.add(n.add(b,W),t["bo"+o])),M=n.mul(t["Wcx"+o],f),_=n.mul(t["Wch"+o],s),x=n.tanh(n.add(n.add(M,_),t["bc"+o])),y=n.eltmul(m,u),N=n.eltmul(l,x),S=n.add(y,N),A=n.eltmul(k,n.tanh(S))
w.push(A),d.push(S)}return{h:w,c:d,o:n.add(n.mul(t.Whd,w[w.length-1]),t.bd)}},n.initLSTM=function(n,t,r){for(var e={},a=0;a<t.length;a++){var o=0===a?n:t[a-1],w=t[a]
e["Wix"+a]=new i(w,o,0,.08),e["Wih"+a]=new i(w,w,0,.08),e["bi"+a]=new h(w,1),e["Wfx"+a]=new i(w,o,0,.08),e["Wfh"+a]=new i(w,w,0,.08),e["bf"+a]=new h(w,1),e["Wox"+a]=new i(w,o,0,.08),e["Woh"+a]=new i(w,w,0,.08),e["bo"+a]=new h(w,1),e["Wcx"+a]=new i(w,o,0,.08),e["Wch"+a]=new i(w,w,0,.08),e["bc"+a]=new h(w,1)}return e.Whd=new i(r,w,0,.08),e.bd=new h(r,1),e},n.forwardRNN=function(n,t,r,e,h){if(void 0===h.h)for(var i=[],a=0;a<r.length;a++)i.push(new R.Mat(r[a],1))
else i=h.h
var o=[]
for(a=0;a<r.length;a++){var w=0===a?e:o[a-1],d=i[a],f=n.mul(t["Wxh"+a],w),s=n.mul(t["Whh"+a],d),u=n.relu(n.add(n.add(f,s),t["bhh"+a]))
o.push(u)}return{h:o,o:n.add(n.mul(t.Whd,o[o.length-1]),t.bd)}},n.initRNN=function(n,t,r){for(var e={},a=0;a<t.length;a++){var o=0===a?n:t[a-1],w=t[a]
e["Wxh"+a]=new R.RandMat(w,o,0,.08),e["Whh"+a]=new R.RandMat(w,w,0,.08),e["bhh"+a]=new R.Mat(w,1)}return e.Whd=new i(r,w,0,.08),e.bd=new h(r,1),e},n.Solver=w,n.Graph=o})(R)
