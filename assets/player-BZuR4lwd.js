import{_ as e,n as t,t as n}from"./styles-BZuilrVy.js";var r=`attached`,i=1e3,a=1001,o=1002,s=1003,c=1004,l=1005,u=1006,d=1007,f=1008,p=1009,m=1010,h=1011,g=1012,_=1013,v=1014,y=1015,b=1016,x=1017,S=1018,C=1020,w=35902,T=35899,E=1021,D=1022,O=1023,k=1026,ee=1027,te=1028,ne=1029,A=1030,re=1031,ie=1033,j=33776,ae=33777,oe=33778,se=33779,ce=35840,le=35841,ue=35842,de=35843,fe=36196,pe=37492,me=37496,he=37808,ge=37809,_e=37810,ve=37811,M=37812,ye=37813,be=37814,xe=37815,N=37816,Se=37817,P=37818,Ce=37819,we=37820,Te=37821,Ee=36492,De=36494,Oe=36495,ke=36283,Ae=36284,je=36285,Me=36286,Ne=2300,Pe=2301,Fe=2302,Ie=2400,Le=2401,Re=2402,ze=2500,Be=3200,Ve=3201,He=`srgb`,Ue=`srgb-linear`,We=`linear`,Ge=`srgb`,Ke=7680,qe=35044,Je=35048,Ye=2e3,Xe=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Ze=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Qe=1234567,$e=Math.PI/180,et=180/Math.PI;function tt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ze[e&255]+Ze[e>>8&255]+Ze[e>>16&255]+Ze[e>>24&255]+`-`+Ze[t&255]+Ze[t>>8&255]+`-`+Ze[t>>16&15|64]+Ze[t>>24&255]+`-`+Ze[n&63|128]+Ze[n>>8&255]+`-`+Ze[n>>16&255]+Ze[n>>24&255]+Ze[r&255]+Ze[r>>8&255]+Ze[r>>16&255]+Ze[r>>24&255]).toLowerCase()}function F(e,t,n){return Math.max(t,Math.min(n,e))}function nt(e,t){return(e%t+t)%t}function rt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function it(e,t,n){return e===t?0:(n-e)/(t-e)}function at(e,t,n){return(1-n)*e+n*t}function ot(e,t,n,r){return at(e,t,1-Math.exp(-n*r))}function st(e,t=1){return t-Math.abs(nt(e,t*2)-t)}function ct(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function lt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function ut(e,t){return e+Math.floor(Math.random()*(t-e+1))}function dt(e,t){return e+Math.random()*(t-e)}function ft(e){return e*(.5-Math.random())}function pt(e){e!==void 0&&(Qe=e);let t=Qe+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function mt(e){return e*$e}function ht(e){return e*et}function gt(e){return!(e&e-1)&&e!==0}function _t(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function vt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function yt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:console.warn(`THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function bt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`Invalid component type.`)}}function xt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`Invalid component type.`)}}var St={DEG2RAD:$e,RAD2DEG:et,generateUUID:tt,clamp:F,euclideanModulo:nt,mapLinear:rt,inverseLerp:it,lerp:at,damp:ot,pingpong:st,smoothstep:ct,smootherstep:lt,randInt:ut,randFloat:dt,randFloatSpread:ft,seededRandom:pt,degToRad:mt,radToDeg:ht,isPowerOfTwo:gt,ceilPowerOfTwo:_t,floorPowerOfTwo:vt,setQuaternionFromProperEuler:yt,normalize:xt,denormalize:bt},Ct=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=F(this.x,e.x,t.x),this.y=F(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=F(this.x,e,t),this.y=F(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(F(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(F(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},I=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(o===0)e[t+0]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u;else if(o===1)e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=m;else{if(u!==m||s!==d||c!==f||l!==p){let e=1-o,t=s*d+c*f+l*p+u*m,n=t>=0?1:-1,r=1-t*t;if(r>2**-52){let i=Math.sqrt(r),a=Math.atan2(i,t*n);e=Math.sin(e*a)/i,o=Math.sin(o*a)/i}let i=o*n;if(s=s*e+d*i,c=c*e+f*i,l=l*e+p*i,u=u*e+m*i,e===1-o){let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(F(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,i=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+i*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=i,this;let s=1-o*o;if(s<=2**-52){let e=1-t;return this._w=e*a+t*this._w,this._x=e*n+t*this._x,this._y=e*r+t*this._y,this._z=e*i+t*this._z,this.normalize(),this}let c=Math.sqrt(s),l=Math.atan2(c,o),u=Math.sin((1-t)*l)/c,d=Math.sin(t*l)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=i*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class e{constructor(t=0,n=0,r=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=r}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Tt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Tt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=F(this.x,e.x,t.x),this.y=F(this.y,e.y,t.y),this.z=F(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=F(this.x,e,t),this.y=F(this.y,e,t),this.z=F(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(F(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return wt.copy(this).projectOnVector(e),this.sub(wt)}reflect(e){return this.sub(wt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(F(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},wt=new L,Tt=new I,R=class e{constructor(t,n,r,i,a,o,s,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Et.makeScale(e,t)),this}rotate(e){return this.premultiply(Et.makeRotation(-e)),this}translate(e,t){return this.premultiply(Et.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Et=new R;function Dt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ot(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function kt(){let e=Ot(`canvas`);return e.style.display=`block`,e}var At={};function jt(e){e in At||(At[e]=!0,console.warn(e))}function Mt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Nt=new R().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pt=new R().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ft(){let e={enabled:!0,workingColorSpace:Ue,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Lt(e.r),e.g=Lt(e.g),e.b=Lt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Rt(e.r),e.g=Rt(e.g),e.b=Rt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?We:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return jt(`THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return jt(`THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Ue]:{primaries:t,whitePoint:r,transfer:We,toXYZ:Nt,fromXYZ:Pt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:t,whitePoint:r,transfer:Ge,toXYZ:Nt,fromXYZ:Pt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:He}}}),e}var It=Ft();function Lt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Rt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var zt,Bt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zt===void 0&&(zt=Ot(`canvas`)),zt.width=e.width,zt.height=e.height;let t=zt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=zt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Ot(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Lt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Lt(t[e]/255)*255):t[e]=Lt(t[e]);return{data:t,width:e.width,height:e.height}}return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Vt=0,Ht=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vt++}),this.uuid=tt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Ut(r[t].image)):e.push(Ut(r[t]))}else e=Ut(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Ut(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Bt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn(`THREE.Texture: Unable to serialize Texture.`),{})}var Wt=0,Gt=new L,Kt=class e extends Xe{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=a,i=a,o=u,s=f,c=O,l=p,d=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wt++}),this.uuid=tt(),this.name=``,this.source=new Ht(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=o,this.minFilter=s,this.anisotropy=d,this.format=c,this.internalFormat=null,this.type=l,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new R,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Gt).x}get height(){return this.source.getSize(Gt).y}get depth(){return this.source.getSize(Gt).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case i:e.x-=Math.floor(e.x);break;case a:e.x=e.x<0?0:1;break;case o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case i:e.y-=Math.floor(e.y);break;case a:e.y=e.y<0?0:1;break;case o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Kt.DEFAULT_IMAGE=null,Kt.DEFAULT_MAPPING=300,Kt.DEFAULT_ANISOTROPY=1;var qt=class e{constructor(t=0,n=0,r=0,i=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=r,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=F(this.x,e.x,t.x),this.y=F(this.y,e.y,t.y),this.z=F(this.z,e.z,t.z),this.w=F(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=F(this.x,e,t),this.y=F(this.y,e,t),this.z=F(this.z,e,t),this.w=F(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(F(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Jt=class extends Xe{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:u,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new qt(0,0,e,t),this.scissorTest=!1,this.viewport=new qt(0,0,e,t);let r=new Kt({width:e,height:t,depth:n.depth});this.textures=[];let i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:u,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Ht(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:`dispose`})}},Yt=class extends Jt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Xt=class extends Kt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=s,this.minFilter=s,this.wrapR=a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Zt=class extends Kt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=s,this.minFilter=s,this.wrapR=a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Qt=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(en.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(en.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=en.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,en):en.fromBufferAttribute(r,t),en.applyMatrix4(e.matrixWorld),this.expandByPoint(en);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),tn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),tn.copy(e.boundingBox)),tn.applyMatrix4(e.matrixWorld),this.union(tn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,en),en.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ln),un.subVectors(this.max,ln),nn.subVectors(e.a,ln),rn.subVectors(e.b,ln),an.subVectors(e.c,ln),on.subVectors(rn,nn),sn.subVectors(an,rn),cn.subVectors(nn,an);let t=[0,-on.z,on.y,0,-sn.z,sn.y,0,-cn.z,cn.y,on.z,0,-on.x,sn.z,0,-sn.x,cn.z,0,-cn.x,-on.y,on.x,0,-sn.y,sn.x,0,-cn.y,cn.x,0];return!pn(t,nn,rn,an,un)||(t=[1,0,0,0,1,0,0,0,1],!pn(t,nn,rn,an,un))?!1:(dn.crossVectors(on,sn),t=[dn.x,dn.y,dn.z],pn(t,nn,rn,an,un))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,en).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(en).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||($t[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$t[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$t[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$t[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$t[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$t[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$t[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$t[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($t)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},$t=[new L,new L,new L,new L,new L,new L,new L,new L],en=new L,tn=new Qt,nn=new L,rn=new L,an=new L,on=new L,sn=new L,cn=new L,ln=new L,un=new L,dn=new L,fn=new L;function pn(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){fn.fromArray(e,a);let o=i.x*Math.abs(fn.x)+i.y*Math.abs(fn.y)+i.z*Math.abs(fn.z),s=t.dot(fn),c=n.dot(fn),l=r.dot(fn);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var mn=new Qt,hn=new L,gn=new L,_n=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?mn.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;hn.subVectors(e,this.center);let t=hn.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(hn,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gn.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(hn.copy(e.center).add(gn)),this.expandByPoint(hn.copy(e.center).sub(gn))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},vn=new L,yn=new L,bn=new L,xn=new L,Sn=new L,Cn=new L,wn=new L,Tn=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vn.copy(this.origin).addScaledVector(this.direction,t),vn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){yn.copy(e).add(t).multiplyScalar(.5),bn.copy(t).sub(e).normalize(),xn.copy(this.origin).sub(yn);let i=e.distanceTo(t)*.5,a=-this.direction.dot(bn),o=xn.dot(this.direction),s=-xn.dot(bn),c=xn.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(yn).addScaledVector(bn,d),f}intersectSphere(e,t){vn.subVectors(e.center,this.origin);let n=vn.dot(this.direction),r=vn.dot(vn)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,vn)!==null}intersectTriangle(e,t,n,r,i){Sn.subVectors(t,e),Cn.subVectors(n,e),wn.crossVectors(Sn,Cn);let a=this.direction.dot(wn),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;xn.subVectors(this.origin,e);let s=o*this.direction.dot(Cn.crossVectors(xn,Cn));if(s<0)return null;let c=o*this.direction.dot(Sn.cross(xn));if(c<0||s+c>a)return null;let l=-o*xn.dot(wn);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},z=class e{constructor(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/En.setFromMatrixColumn(e,0).length(),i=1/En.setFromMatrixColumn(e,1).length(),a=1/En.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(On,e,kn)}lookAt(e,t,n){let r=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),An.crossVectors(n,Mn),An.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),An.crossVectors(n,Mn)),An.normalize(),jn.crossVectors(Mn,An),r[0]=An.x,r[4]=jn.x,r[8]=Mn.x,r[1]=An.y,r[5]=jn.y,r[9]=Mn.y,r[2]=An.z,r[6]=jn.z,r[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],ee=r[6],te=r[10],ne=r[14],A=r[3],re=r[7],ie=r[11],j=r[15];return i[0]=a*x+o*T+s*k+c*A,i[4]=a*S+o*E+s*ee+c*re,i[8]=a*C+o*D+s*te+c*ie,i[12]=a*w+o*O+s*ne+c*j,i[1]=l*x+u*T+d*k+f*A,i[5]=l*S+u*E+d*ee+f*re,i[9]=l*C+u*D+d*te+f*ie,i[13]=l*w+u*O+d*ne+f*j,i[2]=p*x+m*T+h*k+g*A,i[6]=p*S+m*E+h*ee+g*re,i[10]=p*C+m*D+h*te+g*ie,i[14]=p*w+m*O+h*ne+g*j,i[3]=_*x+v*T+y*k+b*A,i[7]=_*S+v*E+y*ee+b*re,i[11]=_*C+v*D+y*te+b*ie,i[15]=_*w+v*O+y*ne+b*j,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15];return p*(+i*s*u-r*c*u-i*o*d+n*c*d+r*o*f-n*s*f)+m*(+t*s*f-t*c*d+i*a*d-r*a*f+r*c*l-i*s*l)+h*(+t*c*u-t*o*f-i*a*u+n*a*f+i*o*l-n*c*l)+g*(-r*o*l-t*s*u+t*o*d+r*a*u-n*a*d+n*s*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=u*h*c-m*d*c+m*s*f-o*h*f-u*s*g+o*d*g,v=p*d*c-l*h*c-p*s*f+a*h*f+l*s*g-a*d*g,y=l*m*c-p*u*c+p*o*f-a*m*f-l*o*g+a*u*g,b=p*u*s-l*m*s-p*o*d+a*m*d+l*o*h-a*u*h,x=t*_+n*v+r*y+i*b;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=_*S,e[1]=(m*d*i-u*h*i-m*r*f+n*h*f+u*r*g-n*d*g)*S,e[2]=(o*h*i-m*s*i+m*r*c-n*h*c-o*r*g+n*s*g)*S,e[3]=(u*s*i-o*d*i-u*r*c+n*d*c+o*r*f-n*s*f)*S,e[4]=v*S,e[5]=(l*h*i-p*d*i+p*r*f-t*h*f-l*r*g+t*d*g)*S,e[6]=(p*s*i-a*h*i-p*r*c+t*h*c+a*r*g-t*s*g)*S,e[7]=(a*d*i-l*s*i+l*r*c-t*d*c-a*r*f+t*s*f)*S,e[8]=y*S,e[9]=(p*u*i-l*m*i-p*n*f+t*m*f+l*n*g-t*u*g)*S,e[10]=(a*m*i-p*o*i+p*n*c-t*m*c-a*n*g+t*o*g)*S,e[11]=(l*o*i-a*u*i-l*n*c+t*u*c+a*n*f-t*o*f)*S,e[12]=b*S,e[13]=(l*m*r-p*u*r+p*n*d-t*m*d-l*n*h+t*u*h)*S,e[14]=(p*o*r-a*m*r-p*n*s+t*m*s+a*n*h-t*o*h)*S,e[15]=(a*u*r-l*o*r+l*n*s-t*u*s-a*n*d+t*o*d)*S,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,i=En.set(r[0],r[1],r[2]).length(),a=En.set(r[4],r[5],r[6]).length(),o=En.set(r[8],r[9],r[10]).length();this.determinant()<0&&(i=-i),e.x=r[12],e.y=r[13],e.z=r[14],Dn.copy(this);let s=1/i,c=1/a,l=1/o;return Dn.elements[0]*=s,Dn.elements[1]*=s,Dn.elements[2]*=s,Dn.elements[4]*=c,Dn.elements[5]*=c,Dn.elements[6]*=c,Dn.elements[8]*=l,Dn.elements[9]*=l,Dn.elements[10]*=l,t.setFromRotationMatrix(Dn),n.x=i,n.y=a,n.z=o,this}makePerspective(e,t,n,r,i,a,o=Ye,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ye,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},En=new L,Dn=new z,On=new L(0,0,0),kn=new L(1,1,1),An=new L,jn=new L,Mn=new L,Nn=new z,Pn=new I,Fn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(F(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-F(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(F(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-F(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(F(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-F(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Nn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Pn.setFromEuler(this),this.setFromQuaternion(Pn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fn.DEFAULT_ORDER=`XYZ`;var In=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Ln=0,Rn=new L,zn=new I,Bn=new z,Vn=new L,Hn=new L,Un=new L,Wn=new I,Gn=new L(1,0,0),Kn=new L(0,1,0),qn=new L(0,0,1),Jn={type:`added`},Yn={type:`removed`},Xn={type:`childadded`,child:null},Zn={type:`childremoved`,child:null},Qn=class e extends Xe{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ln++}),this.uuid=tt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new L,n=new Fn,r=new I,i=new L(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new z},normalMatrix:{value:new R}}),this.matrix=new z,this.matrixWorld=new z,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new In,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zn.setFromAxisAngle(e,t),this.quaternion.multiply(zn),this}rotateOnWorldAxis(e,t){return zn.setFromAxisAngle(e,t),this.quaternion.premultiply(zn),this}rotateX(e){return this.rotateOnAxis(Gn,e)}rotateY(e){return this.rotateOnAxis(Kn,e)}rotateZ(e){return this.rotateOnAxis(qn,e)}translateOnAxis(e,t){return Rn.copy(e).applyQuaternion(this.quaternion),this.position.add(Rn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gn,e)}translateY(e){return this.translateOnAxis(Kn,e)}translateZ(e){return this.translateOnAxis(qn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Vn.copy(e):Vn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Hn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(Hn,Vn,this.up):Bn.lookAt(Vn,Hn,this.up),this.quaternion.setFromRotationMatrix(Bn),r&&(Bn.extractRotation(r.matrixWorld),zn.setFromRotationMatrix(Bn),this.quaternion.premultiply(zn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(console.error(`THREE.Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jn),Xn.child=e,this.dispatchEvent(Xn),Xn.child=null):console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Yn),Zn.child=e,this.dispatchEvent(Zn),Zn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jn),Xn.child=e,this.dispatchEvent(Xn),Xn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hn,e,Un),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hn,Wn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++)e[t].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Qn.DEFAULT_UP=new L(0,1,0),Qn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Qn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $n=new L,er=new L,tr=new L,nr=new L,rr=new L,ir=new L,ar=new L,or=new L,sr=new L,cr=new L,lr=new qt,ur=new qt,dr=new qt,fr=class e{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),$n.subVectors(e,t),r.cross($n);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){$n.subVectors(r,t),er.subVectors(n,t),tr.subVectors(e,t);let a=$n.dot($n),o=$n.dot(er),s=$n.dot(tr),c=er.dot(er),l=er.dot(tr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,nr)!==null&&nr.x>=0&&nr.y>=0&&nr.x+nr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,nr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,nr.x),s.addScaledVector(a,nr.y),s.addScaledVector(o,nr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return lr.setScalar(0),ur.setScalar(0),dr.setScalar(0),lr.fromBufferAttribute(e,t),ur.fromBufferAttribute(e,n),dr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(lr,i.x),a.addScaledVector(ur,i.y),a.addScaledVector(dr,i.z),a}static isFrontFacing(e,t,n,r){return $n.subVectors(n,t),er.subVectors(e,t),$n.cross(er).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $n.subVectors(this.c,this.b),er.subVectors(this.a,this.b),$n.cross(er).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;rr.subVectors(r,n),ir.subVectors(i,n),or.subVectors(e,n);let s=rr.dot(or),c=ir.dot(or);if(s<=0&&c<=0)return t.copy(n);sr.subVectors(e,r);let l=rr.dot(sr),u=ir.dot(sr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(rr,a);cr.subVectors(e,i);let f=rr.dot(cr),p=ir.dot(cr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ir,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ar.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ar,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(rr,a).addScaledVector(ir,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},pr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},hr={h:0,s:0,l:0};function gr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var B=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=He){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,It.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=It.workingColorSpace){return this.r=e,this.g=t,this.b=n,It.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=It.workingColorSpace){if(e=nt(e,1),t=F(t,0,1),n=F(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=gr(i,r,e+1/3),this.g=gr(i,r,e),this.b=gr(i,r,e-1/3)}return It.colorSpaceToWorking(this,r),this}setStyle(e,t=He){function n(t){t!==void 0&&parseFloat(t)<1&&console.warn(`THREE.Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:console.warn(`THREE.Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);console.warn(`THREE.Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=He){let n=pr[e.toLowerCase()];return n===void 0?console.warn(`THREE.Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Lt(e.r),this.g=Lt(e.g),this.b=Lt(e.b),this}copyLinearToSRGB(e){return this.r=Rt(e.r),this.g=Rt(e.g),this.b=Rt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=He){return It.workingToColorSpace(_r.copy(this),e),Math.round(F(_r.r*255,0,255))*65536+Math.round(F(_r.g*255,0,255))*256+Math.round(F(_r.b*255,0,255))}getHexString(e=He){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=It.workingColorSpace){It.workingToColorSpace(_r.copy(this),t);let n=_r.r,r=_r.g,i=_r.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=It.workingColorSpace){return It.workingToColorSpace(_r.copy(this),t),e.r=_r.r,e.g=_r.g,e.b=_r.b,e}getStyle(e=He){It.workingToColorSpace(_r.copy(this),e);let t=_r.r,n=_r.g,r=_r.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(hr);let n=at(mr.h,hr.h,t),r=at(mr.s,hr.s,t),i=at(mr.l,hr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},_r=new B;B.NAMES=pr;var vr=0,yr=class extends Xe{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vr++}),this.uuid=tt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new B(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ke,this.stencilZFail=Ke,this.stencilZPass=Ke,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},br=class extends yr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new B(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},xr=new L,Sr=new Ct,Cr=0,wr=class{constructor(e,t,n=!1){if(Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=qe,this.updateRanges=[],this.gpuType=y,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.applyMatrix3(e),this.setXY(t,Sr.x,Sr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)xr.fromBufferAttribute(this,t),xr.applyMatrix3(e),this.setXYZ(t,xr.x,xr.y,xr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)xr.fromBufferAttribute(this,t),xr.applyMatrix4(e),this.setXYZ(t,xr.x,xr.y,xr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xr.fromBufferAttribute(this,t),xr.applyNormalMatrix(e),this.setXYZ(t,xr.x,xr.y,xr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xr.fromBufferAttribute(this,t),xr.transformDirection(e),this.setXYZ(t,xr.x,xr.y,xr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=bt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=bt(t,this.array)),t}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=bt(t,this.array)),t}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=bt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=bt(t,this.array)),t}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),r=xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),r=xt(r,this.array),i=xt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}},Tr=class extends wr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Er=class extends wr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Dr=class extends wr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Or=0,kr=new z,Ar=new Qn,jr=new L,Mr=new Qt,Nr=new Qt,Pr=new L,Fr=class e extends Xe{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Or++}),this.uuid=tt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Dt(e)?Er:Tr)(e,1):e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new R().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return kr.makeRotationFromQuaternion(e),this.applyMatrix4(kr),this}rotateX(e){return kr.makeRotationX(e),this.applyMatrix4(kr),this}rotateY(e){return kr.makeRotationY(e),this.applyMatrix4(kr),this}rotateZ(e){return kr.makeRotationZ(e),this.applyMatrix4(kr),this}translate(e,t,n){return kr.makeTranslation(e,t,n),this.applyMatrix4(kr),this}scale(e,t,n){return kr.makeScale(e,t,n),this.applyMatrix4(kr),this}lookAt(e){return Ar.lookAt(e),Ar.updateMatrix(),this.applyMatrix4(Ar.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(jr).negate(),this.translate(jr.x,jr.y,jr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Dr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&console.warn(`THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mr.setFromBufferAttribute(n),this.morphTargetsRelative?(Pr.addVectors(this.boundingBox.min,Mr.min),this.boundingBox.expandByPoint(Pr),Pr.addVectors(this.boundingBox.max,Mr.max),this.boundingBox.expandByPoint(Pr)):(this.boundingBox.expandByPoint(Mr.min),this.boundingBox.expandByPoint(Mr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _n);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new L,1/0);else if(e){let n=this.boundingSphere.center;if(Mr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Nr.setFromBufferAttribute(n),this.morphTargetsRelative?(Pr.addVectors(Mr.min,Nr.min),Mr.expandByPoint(Pr),Pr.addVectors(Mr.max,Nr.max),Mr.expandByPoint(Pr)):(Mr.expandByPoint(Nr.min),Mr.expandByPoint(Nr.max))}Mr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Pr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Pr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Pr.fromBufferAttribute(a,t),o&&(jr.fromBufferAttribute(e,t),Pr.add(jr)),r=Math.max(r,n.distanceToSquared(Pr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv;this.hasAttribute(`tangent`)===!1&&this.setAttribute(`tangent`,new wr(new Float32Array(4*n.count),4));let a=this.getAttribute(`tangent`),o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new L,s[e]=new L;let c=new L,l=new L,u=new L,d=new Ct,f=new Ct,p=new Ct,m=new L,h=new L;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new L,y=new L,b=new L,x=new L;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new wr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new L,i=new L,a=new L,o=new L,s=new L,c=new L,l=new L,u=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pr.fromBufferAttribute(e,t),Pr.normalize(),e.setXYZ(t,Pr.x,Pr.y,Pr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new wr(a,r,i)}if(this.index===null)return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}},Ir=new z,Lr=new Tn,Rr=new _n,zr=new L,Br=new L,Vr=new L,Hr=new L,Ur=new L,Wr=new L,Gr=new L,Kr=new L,qr=class extends Qn{constructor(e=new Fr,t=new br){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Wr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Ur.fromBufferAttribute(s,e),a?Wr.addScaledVector(Ur,r):Wr.addScaledVector(Ur.sub(t),r))}t.add(Wr)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(i),Lr.copy(e.ray).recast(e.near),Rr.containsPoint(Lr.origin)===!1&&(Lr.intersectSphere(Rr,zr)===null||Lr.origin.distanceToSquared(zr)>(e.far-e.near)**2)||(Ir.copy(i).invert(),Lr.copy(e.ray).applyMatrix4(Ir),(n.boundingBox===null||Lr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Lr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Yr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Yr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Yr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Yr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Jr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Kr.copy(s),Kr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Kr);return l<n.near||l>n.far?null:{distance:l,point:Kr.clone(),object:e}}function Yr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Br),e.getVertexPosition(c,Vr),e.getVertexPosition(l,Hr);let u=Jr(e,t,n,r,Br,Vr,Hr,Gr);if(u){let e=new L;fr.getBarycoord(Gr,Br,Vr,Hr,e),i&&(u.uv=fr.getInterpolatedAttribute(i,s,c,l,e,new Ct)),a&&(u.uv1=fr.getInterpolatedAttribute(a,s,c,l,e,new Ct)),o&&(u.normal=fr.getInterpolatedAttribute(o,s,c,l,e,new L),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new L,materialIndex:0};fr.getNormal(Br,Vr,Hr,t.normal),u.face=t,u.barycoord=e}return u}var Xr=class e extends Fr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Dr(c,3)),this.setAttribute(`normal`,new Dr(l,3)),this.setAttribute(`uv`,new Dr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new L;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Zr(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone():Array.isArray(i)?t[n][r]=i.slice():t[n][r]=i}}return t}function Qr(e){let t={};for(let n=0;n<e.length;n++){let r=Zr(e[n]);for(let e in r)t[e]=r[e]}return t}function $r(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ei(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:It.workingColorSpace}var ti={clone:Zr,merge:Qr},ni=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ri=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ii=class extends yr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ni,this.fragmentShader=ri,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zr(e.uniforms),this.uniformsGroups=$r(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ai=class extends Qn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new z,this.projectionMatrix=new z,this.projectionMatrixInverse=new z,this.coordinateSystem=Ye,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},oi=new L,si=new Ct,ci=new Ct,li=class extends ai{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=et*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan($e*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return et*2*Math.atan(Math.tan($e*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(oi.x,oi.y).multiplyScalar(-e/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(oi.x,oi.y).multiplyScalar(-e/oi.z)}getViewSize(e,t){return this.getViewBounds(e,si,ci),t.subVectors(ci,si)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan($e*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ui=-90,di=1,fi=class extends Qn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new li(ui,di,e,t);r.layers=this.layers,this.add(r);let i=new li(ui,di,e,t);i.layers=this.layers,this.add(i);let a=new li(ui,di,e,t);a.layers=this.layers,this.add(a);let o=new li(ui,di,e,t);o.layers=this.layers,this.add(o);let s=new li(ui,di,e,t);s.layers=this.layers,this.add(s);let c=new li(ui,di,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,i),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,s),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},pi=class extends Kt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},mi=class extends Yt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new pi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Xr(5,5,5),i=new ii({name:`CubemapFromEquirect`,uniforms:Zr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new qr(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=u),new fi(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},hi=class extends Qn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},gi={type:`move`},_i=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gi)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new hi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},vi=class extends Qn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},yi=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=qe,this.updateRanges=[],this.version=0,this.uuid=tt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=tt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=tt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},bi=new L,xi=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)bi.fromBufferAttribute(this,t),bi.applyMatrix4(e),this.setXYZ(t,bi.x,bi.y,bi.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bi.fromBufferAttribute(this,t),bi.applyNormalMatrix(e),this.setXYZ(t,bi.x,bi.y,bi.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bi.fromBufferAttribute(this,t),bi.transformDirection(e),this.setXYZ(t,bi.x,bi.y,bi.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=bt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=bt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=bt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=bt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=bt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),r=xt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),r=xt(r,this.array),i=xt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){console.log(`THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new wr(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log(`THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Si=new L,Ci=new qt,wi=new qt,Ti=new L,Ei=new z,Di=new L,Oi=new _n,ki=new z,Ai=new Tn,ji=class extends qr{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=r,this.bindMatrix=new z,this.bindMatrixInverse=new z,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Qt),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Di),this.boundingBox.expandByPoint(Di)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new _n),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Di),this.boundingSphere.expandByPoint(Di)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Oi.copy(this.boundingSphere),Oi.applyMatrix4(r),e.ray.intersectsSphere(Oi)!==!1&&(ki.copy(r).invert(),Ai.copy(e.ray).applyMatrix4(ki),(this.boundingBox===null||Ai.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,Ai)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new qt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn(`THREE.SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Ci.fromBufferAttribute(r.attributes.skinIndex,e),wi.fromBufferAttribute(r.attributes.skinWeight,e),Si.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let e=0;e<4;e++){let r=wi.getComponent(e);if(r!==0){let i=Ci.getComponent(e);Ei.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Ti.copy(Si).applyMatrix4(Ei),r)}}return t.applyMatrix4(this.bindMatrixInverse)}},Mi=class extends Qn{constructor(){super(),this.isBone=!0,this.type=`Bone`}},Ni=class extends Kt{constructor(e=null,t=1,n=1,r,i,a,o,c,l=s,u=s,d,f){super(null,a,o,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Pi=new z,Fi=new z,Ii=class e{constructor(e=[],t=[]){this.uuid=tt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn(`THREE.Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new z)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new z;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:Fi;Pi.multiplyMatrices(i,t[r]),Pi.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ni(t,e,e,O,y);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(console.warn(`THREE.Skeleton: No bone found with UUID:`,r),i=new Mi),this.bones.push(i),this.boneInverses.push(new z().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},Li=class extends wr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ri=new z,zi=new z,Bi=[],Vi=new Qt,Hi=new z,Ui=new qr,Wi=new _n,Gi=class extends qr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Li(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Hi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Qt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ri),Vi.copy(e.boundingBox).applyMatrix4(Ri),this.boundingBox.union(Vi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new _n),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ri),Wi.copy(e.boundingSphere).applyMatrix4(Ri),this.boundingSphere.union(Wi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ui.geometry=this.geometry,Ui.material=this.material,Ui.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wi.copy(this.boundingSphere),Wi.applyMatrix4(n),e.ray.intersectsSphere(Wi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ri),zi.multiplyMatrices(n,Ri),Ui.matrixWorld=zi,Ui.raycast(e,Bi);for(let e=0,n=Bi.length;e<n;e++){let n=Bi[e];n.instanceId=i,n.object=this,t.push(n)}Bi.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Li(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ni(new Float32Array(r*this.count),r,this.count,te,y));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;i[s]=o,i.set(n,s+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ki=new L,qi=new L,Ji=new R,Yi=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ki.subVectors(n,t).cross(qi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Ki),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let i=-(e.start.dot(this.normal)+this.constant)/r;return i<0||i>1?null:t.copy(e.start).addScaledVector(n,i)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ji.getNormalMatrix(e),r=this.coplanarPoint(Ki).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Xi=new _n,Zi=new Ct(.5,.5),Qi=new L,$i=class{constructor(e=new Yi,t=new Yi,n=new Yi,r=new Yi,i=new Yi,a=new Yi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ye,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(e){return Xi.center.set(0,0,0),Xi.radius=.7071067811865476+Zi.distanceTo(e.center),Xi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Qi.x=r.normal.x>0?e.max.x:e.min.x,Qi.y=r.normal.y>0?e.max.y:e.min.y,Qi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Qi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ea=class extends yr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new B(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ta=new L,na=new L,ra=new z,ia=new Tn,aa=new _n,oa=new L,sa=new L,ca=class extends Qn{constructor(e=new Fr,t=new ea){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)ta.fromBufferAttribute(t,e-1),na.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=ta.distanceTo(na);e.setAttribute(`lineDistance`,new Dr(n,1))}else console.warn(`THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),aa.copy(n.boundingSphere),aa.applyMatrix4(r),aa.radius+=i,e.ray.intersectsSphere(aa)===!1)return;ra.copy(r).invert(),ia.copy(e.ray).applyMatrix4(ra);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=la(this,e,ia,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=la(this,e,ia,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=la(this,e,ia,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=la(this,e,ia,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function la(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(ta.fromBufferAttribute(s,i),na.fromBufferAttribute(s,a),n.distanceSqToSegment(ta,na,oa,sa)>r)return;oa.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(oa);if(!(c<t.near||c>t.far))return{distance:c,point:sa.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var ua=new L,da=new L,fa=class extends ca{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)ua.fromBufferAttribute(t,e),da.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+ua.distanceTo(da);e.setAttribute(`lineDistance`,new Dr(n,1))}else console.warn(`THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},pa=class extends ca{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},ma=class extends yr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new B(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ha=new z,ga=new Tn,_a=new _n,va=new L,ya=class extends Qn{constructor(e=new Fr,t=new ma){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_a.copy(n.boundingSphere),_a.applyMatrix4(r),_a.radius+=i,e.ray.intersectsSphere(_a)===!1)return;ha.copy(r).invert(),ga.copy(e.ray).applyMatrix4(ha);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);va.fromBufferAttribute(l,n),ba(va,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)va.fromBufferAttribute(l,a),ba(va,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ba(e,t,n,r,i,a,o){let s=ga.distanceSqToPoint(e);if(s<n){let n=new L;ga.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var xa=class extends Kt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Sa=class extends Kt{constructor(e,t,n=v,r,i,a,o=s,c=s,l,u=k,d=1){if(u!==1026&&u!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ht(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ca=class extends Kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},wa=class e extends Fr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new L,l=new Ct;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Dr(a,3)),this.setAttribute(`normal`,new Dr(o,3)),this.setAttribute(`uv`,new Dr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ta=class e extends Fr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Dr(u,3)),this.setAttribute(`normal`,new Dr(d,3)),this.setAttribute(`uv`,new Dr(f,2));function _(){let a=new L,_=new L,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new Ct,m=new L,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ea=class e extends Fr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Dr(p,3)),this.setAttribute(`normal`,new Dr(m,3)),this.setAttribute(`uv`,new Dr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Da=class e extends Fr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i},n=Math.floor(n),r=Math.floor(r);let a=[],o=[],s=[],c=[],l=new L,u=new L,d=new L;for(let a=0;a<=n;a++)for(let f=0;f<=r;f++){let p=f/r*i,m=a/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(p),u.y=(e+t*Math.cos(m))*Math.sin(p),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(p),l.y=e*Math.sin(p),d.subVectors(u,l).normalize(),s.push(d.x,d.y,d.z),c.push(f/r),c.push(a/n)}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,o=(r+1)*(e-1)+t,s=(r+1)*e+t;a.push(n,i,s),a.push(i,o,s)}this.setIndex(a),this.setAttribute(`position`,new Dr(o,3)),this.setAttribute(`normal`,new Dr(s,3)),this.setAttribute(`uv`,new Dr(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},Oa=class extends yr{constructor(e){super(),this.isShadowMaterial=!0,this.type=`ShadowMaterial`,this.color=new B(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}},ka=class extends yr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new B(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new B(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Aa=class extends ka{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ct(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return F(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new B(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new B(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new B(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},ja=class extends yr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new B(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new B(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ma=class extends yr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Be,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Na=class extends yr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Pa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Fa(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ia(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function La(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function Ra(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push(...o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}}var za=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}},Ba=class extends za{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ie,endingEnd:Ie}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Le:i=e,o=2*t-n;break;case Re:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Le:a=e,s=2*n-t;break;case Re:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Va=class extends za{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ha=class extends za{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ua=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Pa(t,this.TimeBufferType),this.values=Pa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Pa(e.times,Array),values:Pa(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ba(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ne:t=this.InterpolantFactoryMethodDiscrete;break;case Pe:t=this.InterpolantFactoryMethodLinear;break;case Fe:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return console.warn(`THREE.KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ne;case this.InterpolantFactoryMethodLinear:return Pe;case this.InterpolantFactoryMethodSmooth:return Fe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error(`THREE.KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(console.error(`THREE.KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){console.error(`THREE.KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){console.error(`THREE.KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Fa(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){console.error(`THREE.KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Fe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Ua.prototype.ValueTypeName=``,Ua.prototype.TimeBufferType=Float32Array,Ua.prototype.ValueBufferType=Float32Array,Ua.prototype.DefaultInterpolation=Pe;var Wa=class extends Ua{constructor(e,t,n){super(e,t,n)}};Wa.prototype.ValueTypeName=`bool`,Wa.prototype.ValueBufferType=Array,Wa.prototype.DefaultInterpolation=Ne,Wa.prototype.InterpolantFactoryMethodLinear=void 0,Wa.prototype.InterpolantFactoryMethodSmooth=void 0;var Ga=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}};Ga.prototype.ValueTypeName=`color`;var Ka=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}};Ka.prototype.ValueTypeName=`number`;var qa=class extends za{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)I.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ja=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new qa(this.times,this.values,this.getValueSize(),e)}};Ja.prototype.ValueTypeName=`quaternion`,Ja.prototype.InterpolantFactoryMethodSmooth=void 0;var Ya=class extends Ua{constructor(e,t,n){super(e,t,n)}};Ya.prototype.ValueTypeName=`string`,Ya.prototype.ValueBufferType=Array,Ya.prototype.DefaultInterpolation=Ne,Ya.prototype.InterpolantFactoryMethodLinear=void 0,Ya.prototype.InterpolantFactoryMethodSmooth=void 0;var Xa=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}};Xa.prototype.ValueTypeName=`vector`;var Za=class{constructor(e=``,t=-1,n=[],r=ze){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=tt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push($a(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i.userData=JSON.parse(e.userData||`{}`),i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let e=0,r=n.length;e!==r;++e)t.push(Ua.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=Ia(o);o=La(o,1,c),s=La(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Ka(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}static parseAnimation(e,t){if(console.warn(`THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185`),!e)return console.error(`THREE.AnimationClip: No animation in JSONLoader data.`),null;let n=function(e,t,n,r,i){if(n.length!==0){let a=[],o=[];Ra(n,a,o,r),a.length!==0&&i.push(new e(t,a,o))}},r=[],i=e.name||`default`,a=e.fps||30,o=e.blendMode,s=e.length||-1,c=e.hierarchy||[];for(let e=0;e<c.length;e++){let i=c[e].keys;if(i&&i.length!==0){if(i[0].morphTargets){let e={},t=0;for(;t<i.length;t++)if(i[t].morphTargets)for(let n=0;n<i[t].morphTargets.length;n++)e[i[t].morphTargets[n]]=-1;for(let n in e){let e=[],a=[];for(let r=0;r!==i[t].morphTargets.length;++r){let r=i[t];e.push(r.time),a.push(+(r.morphTarget===n))}r.push(new Ka(`.morphTargetInfluence[`+n+`]`,e,a))}s=e.length*a}else{let a=`.bones[`+t[e].name+`]`;n(Xa,a+`.position`,i,`pos`,r),n(Ja,a+`.quaternion`,i,`rot`,r),n(Xa,a+`.scale`,i,`scl`,r)}}}return r.length===0?null:new this(i,s,r,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Qa(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Ka;case`vector`:case`vector2`:case`vector3`:case`vector4`:return Xa;case`color`:return Ga;case`quaternion`:return Ja;case`bool`:case`boolean`:return Wa;case`string`:return Ya}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function $a(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=Qa(e.type);if(e.times===void 0){let t=[],n=[];Ra(e.keys,t,n,`value`),e.times=t,e.values=n}return t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e)}var eo={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(this.files[e]=t)},get:function(e){if(this.enabled!==!1)return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},to=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},no=class{constructor(e){this.manager=e===void 0?to:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};no.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var ro={},io=class extends Error{constructor(e,t){super(e),this.response=t}},ao=class extends no{constructor(e){super(e),this.mimeType=``,this.responseType=``,this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=eo.get(`file:${e}`);if(i!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0),i;if(ro[e]!==void 0){ro[e].push({onLoad:t,onProgress:n,onError:r});return}ro[e]=[],ro[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`,signal:typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&console.warn(`THREE.FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=ro[e],r=t.body.getReader(),i=t.headers.get(`X-File-Size`)||t.headers.get(`Content-Length`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}},t=>{e.error(t)})}}});return new Response(c)}throw new io(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===``)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{eo.add(`file:${e}`,t);let n=ro[e];delete ro[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=ro[e];if(n===void 0)throw this.manager.itemError(e),t;delete ro[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},oo=new WeakMap,so=class extends no{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=eo.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=oo.get(a);e===void 0&&(e=[],oo.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Ot(`img`);function s(){l(),t&&t(this);let n=oo.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}oo.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),eo.remove(`image:${e}`);let n=oo.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}oo.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),eo.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},co=class extends no{constructor(e){super(e)}load(e,t,n,r){let i=new Kt,a=new so(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},lo=class extends Qn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new B(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},uo=class extends lo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Qn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new B(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},fo=new z,po=new L,mo=new L,ho=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.mapType=p,this.map=null,this.mapPass=null,this.matrix=new z,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $i,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;po.setFromMatrixPosition(e.matrixWorld),t.position.copy(po),mo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mo),t.updateMatrixWorld(),fo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(fo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},go=class extends ho{constructor(){super(new li(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=et*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},_o=class extends lo{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(Qn.DEFAULT_UP),this.updateMatrix(),this.target=new Qn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new go}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},vo=new z,yo=new L,bo=new L,xo=class extends ho{constructor(){super(new li(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ct(4,2),this._viewportCount=6,this._viewports=[new qt(2,1,1,1),new qt(0,1,1,1),new qt(3,1,1,1),new qt(1,1,1,1),new qt(3,0,1,1),new qt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,i=e.distance||n.far;i!==n.far&&(n.far=i,n.updateProjectionMatrix()),yo.setFromMatrixPosition(e.matrixWorld),n.position.copy(yo),bo.copy(n.position),bo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(bo),n.updateMatrixWorld(),r.makeTranslation(-yo.x,-yo.y,-yo.z),vo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vo,n.coordinateSystem,n.reversedDepth)}},So=class extends lo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new xo}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Co=class extends ai{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},wo=class extends ho{constructor(){super(new Co(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},To=class extends lo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Qn.DEFAULT_UP),this.updateMatrix(),this.target=new Qn,this.shadow=new wo}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Eo=class{static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Do=new WeakMap,Oo=class extends no{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&console.warn(`THREE.ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&console.warn(`THREE.ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=eo.get(`image-bitmap:${e}`);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{if(Do.has(a)===!0)r&&r(Do.get(a)),i.manager.itemError(e),i.manager.itemEnd(e);else return t&&t(n),i.manager.itemEnd(e),n});return}return setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader,o.signal=typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign(i.options,{colorSpaceConversion:`none`}))}).then(function(n){return eo.add(`image-bitmap:${e}`,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),Do.set(s,t),eo.remove(`image-bitmap:${e}`),i.manager.itemError(e),i.manager.itemEnd(e)});eo.add(`image-bitmap:${e}`,s),i.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},ko=class extends li{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ao=`\\[\\]\\.:\\/`,jo=RegExp(`[\\[\\]\\.:\\/]`,`g`),Mo=`[^\\[\\]\\.:\\/]`,No=`[^`+Ao.replace(`\\.`,``)+`]`,Po=`((?:WC+[\\/:])*)`.replace(`WC`,Mo),Fo=`(WCOD+)?`.replace(`WCOD`,No),Io=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Mo),Lo=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Mo),Ro=RegExp(`^`+Po+Fo+Io+Lo+`$`),zo=[`material`,`materials`,`bones`,`map`],Bo=class{constructor(e,t,n){let r=n||Vo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Vo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(jo,``)}static parseTrackName(e){let t=Ro.exec(e);if(t===null)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);zo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn(`THREE.PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;console.error(`THREE.PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Vo.Composite=Bo,Vo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Vo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Vo.prototype.GetterByBindingType=[Vo.prototype._getValue_direct,Vo.prototype._getValue_array,Vo.prototype._getValue_arrayElement,Vo.prototype._getValue_toArray],Vo.prototype.SetterByBindingTypeAndVersioning=[[Vo.prototype._setValue_direct,Vo.prototype._setValue_direct_setNeedsUpdate,Vo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Vo.prototype._setValue_array,Vo.prototype._setValue_array_setNeedsUpdate,Vo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Vo.prototype._setValue_arrayElement,Vo.prototype._setValue_arrayElement_setNeedsUpdate,Vo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Vo.prototype._setValue_fromArray,Vo.prototype._setValue_fromArray_setNeedsUpdate,Vo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];function Ho(e,t,n,r){let i=Uo(r);switch(n){case E:return e*t;case te:return e*t/i.components*i.byteLength;case ne:return e*t/i.components*i.byteLength;case A:return e*t*2/i.components*i.byteLength;case re:return e*t*2/i.components*i.byteLength;case D:return e*t*3/i.components*i.byteLength;case O:return e*t*4/i.components*i.byteLength;case ie:return e*t*4/i.components*i.byteLength;case j:case ae:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case oe:case se:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case le:case de:return Math.max(e,16)*Math.max(t,8)/4;case ce:case ue:return Math.max(e,8)*Math.max(t,8)/2;case fe:case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case he:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ge:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case _e:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case M:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case N:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case P:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case we:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Te:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ee:case De:case Oe:return Math.ceil(e/4)*Math.ceil(t/4)*16;case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*8;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Uo(e){switch(e){case p:case m:return{byteLength:1,components:1};case g:case h:case b:return{byteLength:2,components:1};case x:case S:return{byteLength:2,components:4};case v:case _:case y:return{byteLength:4,components:1};case w:case T:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`180`}})),typeof window<`u`&&(window.__THREE__?console.warn(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`180`);function Wo(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Go(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var V={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},H={common:{diffuse:{value:new B(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new R},alphaMap:{value:null},alphaMapTransform:{value:new R},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new R}},envmap:{envMap:{value:null},envMapRotation:{value:new R},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new R}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new R}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new R},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new R},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new R},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new R}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new R}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new R}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new B(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new B(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new R},alphaTest:{value:0},uvTransform:{value:new R}},sprite:{diffuse:{value:new B(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new R},alphaMap:{value:null},alphaMapTransform:{value:new R},alphaTest:{value:0}}},Ko={basic:{uniforms:Qr([H.common,H.specularmap,H.envmap,H.aomap,H.lightmap,H.fog]),vertexShader:V.meshbasic_vert,fragmentShader:V.meshbasic_frag},lambert:{uniforms:Qr([H.common,H.specularmap,H.envmap,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.fog,H.lights,{emissive:{value:new B(0)}}]),vertexShader:V.meshlambert_vert,fragmentShader:V.meshlambert_frag},phong:{uniforms:Qr([H.common,H.specularmap,H.envmap,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.fog,H.lights,{emissive:{value:new B(0)},specular:{value:new B(1118481)},shininess:{value:30}}]),vertexShader:V.meshphong_vert,fragmentShader:V.meshphong_frag},standard:{uniforms:Qr([H.common,H.envmap,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.roughnessmap,H.metalnessmap,H.fog,H.lights,{emissive:{value:new B(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:V.meshphysical_vert,fragmentShader:V.meshphysical_frag},toon:{uniforms:Qr([H.common,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.gradientmap,H.fog,H.lights,{emissive:{value:new B(0)}}]),vertexShader:V.meshtoon_vert,fragmentShader:V.meshtoon_frag},matcap:{uniforms:Qr([H.common,H.bumpmap,H.normalmap,H.displacementmap,H.fog,{matcap:{value:null}}]),vertexShader:V.meshmatcap_vert,fragmentShader:V.meshmatcap_frag},points:{uniforms:Qr([H.points,H.fog]),vertexShader:V.points_vert,fragmentShader:V.points_frag},dashed:{uniforms:Qr([H.common,H.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:V.linedashed_vert,fragmentShader:V.linedashed_frag},depth:{uniforms:Qr([H.common,H.displacementmap]),vertexShader:V.depth_vert,fragmentShader:V.depth_frag},normal:{uniforms:Qr([H.common,H.bumpmap,H.normalmap,H.displacementmap,{opacity:{value:1}}]),vertexShader:V.meshnormal_vert,fragmentShader:V.meshnormal_frag},sprite:{uniforms:Qr([H.sprite,H.fog]),vertexShader:V.sprite_vert,fragmentShader:V.sprite_frag},background:{uniforms:{uvTransform:{value:new R},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:V.background_vert,fragmentShader:V.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new R}},vertexShader:V.backgroundCube_vert,fragmentShader:V.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:V.cube_vert,fragmentShader:V.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:V.equirect_vert,fragmentShader:V.equirect_frag},distanceRGBA:{uniforms:Qr([H.common,H.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:V.distanceRGBA_vert,fragmentShader:V.distanceRGBA_frag},shadow:{uniforms:Qr([H.lights,H.fog,{color:{value:new B(0)},opacity:{value:1}}]),vertexShader:V.shadow_vert,fragmentShader:V.shadow_frag}};Ko.physical={uniforms:Qr([Ko.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new R},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new R},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new R},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new R},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new R},sheen:{value:0},sheenColor:{value:new B(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new R},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new R},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new R},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new R},attenuationDistance:{value:0},attenuationColor:{value:new B(0)},specularColor:{value:new B(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new R},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new R},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new R}}]),vertexShader:V.meshphysical_vert,fragmentShader:V.meshphysical_frag};var qo={r:0,b:0,g:0},Jo=new Fn,Yo=new z;function Xo(e,t,n,r,i,a,o){let s=new B(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(e){let r=e.isScene===!0?e.background:null;return r&&r.isTexture&&(r=(e.backgroundBlurriness>0?n:t).get(r)),r}function h(t){let n=!1,i=m(t);i===null?_(s,c):i&&i.isColor&&(_(i,1),n=!0);let a=e.xr.getEnvironmentBlendMode();a===`additive`?r.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||n)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let r=m(n);r&&(r.isCubeTexture||r.mapping===306)?(u===void 0&&(u=new qr(new Xr(1,1,1),new ii({name:`BackgroundCubeMaterial`,uniforms:Zr(Ko.backgroundCube.uniforms),vertexShader:Ko.backgroundCube.vertexShader,fragmentShader:Ko.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Jo.copy(n.backgroundRotation),Jo.x*=-1,Jo.y*=-1,Jo.z*=-1,r.isCubeTexture&&r.isRenderTargetTexture===!1&&(Jo.y*=-1,Jo.z*=-1),u.material.uniforms.envMap.value=r,u.material.uniforms.flipEnvMap.value=r.isCubeTexture&&r.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Yo.makeRotationFromEuler(Jo)),u.material.toneMapped=It.getTransfer(r.colorSpace)!==Ge,(d!==r||f!==r.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):r&&r.isTexture&&(l===void 0&&(l=new qr(new Ea(2,2),new ii({name:`BackgroundMaterial`,uniforms:Zr(Ko.background.uniforms),vertexShader:Ko.background.vertexShader,fragmentShader:Ko.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=r,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.toneMapped=It.getTransfer(r.colorSpace)!==Ge,r.matrixAutoUpdate===!0&&r.updateMatrix(),l.material.uniforms.uvTransform.value.copy(r.matrix),(d!==r||f!==r.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))}function _(t,n){t.getRGB(qo,ei(e)),r.buffers.color.setClear(qo.r,qo.g,qo.b,n,o)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,_(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,_(s,c)},render:h,addToRenderList:g,dispose:v}}function Zo(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n){let i=n.wireframe===!0,a=r[e.id];a===void 0&&(a={},r[e.id]=a);let o=a[t.id];o===void 0&&(o={},a[t.id]=o);let s=o[i];return s===void 0&&(s=f(c()),o[i]=s),s}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){w();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e.id]}function C(e){for(let t in r){let n=r[t];if(n[e.id]===void 0)continue;let i=n[e.id];for(let e in i)u(i[e].object),delete i[e];delete n[e.id]}}function w(){T(),o=!0,a!==i&&(a=i,l(a.object))}function T(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:w,resetDefaultState:T,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Qo(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}function c(e,i,a,s){if(a===0)return;let c=t.get(`WEBGL_multi_draw`);if(c===null)for(let t=0;t<e.length;t++)o(e[t],i[t],s[t]);else{c.multiDrawArraysInstancedWEBGL(r,e,0,i,0,s,0,a);let t=0;for(let e=0;e<a;e++)t+=i[e]*s[e];n.update(t,r,1)}}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=c}function $o(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(console.warn(`THREE.WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=m>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:x,maxSamples:S}}function es(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Yi,s=new R,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function ts(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304){if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}{let a=r.image;if(a&&a.height>0){let o=new mi(a.height);return o.fromEquirectangularTexture(e,r),t.set(r,o),r.addEventListener(`dispose`,i),n(o.texture,r.mapping)}return null}}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}var ns=4,rs=[.125,.215,.35,.446,.526,.582],is=20,as=new Co,os=new B,ss=null,cs=0,ls=0,us=!1,ds=(1+Math.sqrt(5))/2,fs=1/ds,ps=[new L(-ds,fs,0),new L(ds,fs,0),new L(-fs,0,ds),new L(fs,0,ds),new L(0,ds,-fs),new L(0,ds,fs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],ms=new L,hs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ms}=i;ss=this._renderer.getRenderTarget(),cs=this._renderer.getActiveCubeFace(),ls=this._renderer.getActiveMipmapLevel(),us=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ss,cs,ls),this._renderer.xr.enabled=us,e.scissorTest=!1,vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ss=this._renderer.getRenderTarget(),cs=this._renderer.getActiveCubeFace(),ls=this._renderer.getActiveMipmapLevel(),us=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:u,minFilter:u,generateMipmaps:!1,type:b,format:O,colorSpace:Ue,depthBuffer:!1},r=_s(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_s(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=gs(r)),this._blurMaterial=ys(r,e,t)}return r}_compileMaterial(e){let t=new qr(this._lodPlanes[0],e);this._renderer.compile(t,as)}_sceneToCubeUV(e,t,n,r,i){let a=new li(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(os),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null));let d=new br({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1}),f=new qr(new Xr,d),p=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,p=!0):(d.color.copy(os),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;vs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(f,a),c.render(e,a)}f.geometry.dispose(),f.material.dispose(),c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=xs()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bs());let i=r?this._cubemapMaterial:this._equirectMaterial,a=new qr(this._lodPlanes[0],i),o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;vs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,as)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let t=1;t<r;t++){let n=Math.sqrt(this._sigmas[t]*this._sigmas[t]-this._sigmas[t-1]*this._sigmas[t-1]),i=ps[(r-t-1)%ps.length];this._blur(e,t-1,t,n,i)}t.autoClear=n}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&console.error(`blur direction must be either latitudinal or longitudinal!`);let l=new qr(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):is;m>is&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${is}`);let h=[],g=0;for(let e=0;e<is;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];vs(t,3*v*(r>_-ns?r-_+ns:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,as)}};function gs(e){let t=[],n=[],r=[],i=e,a=e-ns+1+rs.length;for(let o=0;o<a;o++){let a=2**i;n.push(a);let s=1/a;o>e-ns?s=rs[o-e+ns-1]:o===0&&(s=0),r.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Fr;h.setAttribute(`position`,new wr(f,3)),h.setAttribute(`uv`,new wr(p,2)),h.setAttribute(`faceIndex`,new wr(m,1)),t.push(h),i>ns&&i--}return{lodPlanes:t,sizeLods:n,sigmas:r}}function _s(e,t,n){let r=new Yt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function vs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ys(e,t,n){let r=new Float32Array(is),i=new L(0,1,0);return new ii({name:`SphericalGaussianBlur`,defines:{n:is,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ss(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function bs(){return new ii({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Ss(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xs(){return new ii({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ss(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ss(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Cs(e){let t=new WeakMap,n=null;function r(r){if(r&&r.isTexture){let o=r.mapping,s=o===303||o===304,c=o===301||o===302;if(s||c){let o=t.get(r),l=o===void 0?0:o.texture.pmremVersion;if(r.isRenderTargetTexture&&r.pmremVersion!==l)return n===null&&(n=new hs(e)),o=s?n.fromEquirectangular(r,o):n.fromCubemap(r,o),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),o.texture;if(o!==void 0)return o.texture;{let l=r.image;return s&&l&&l.height>0||c&&l&&i(l)?(n===null&&(n=new hs(e)),o=s?n.fromEquirectangular(r):n.fromCubemap(r),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),r.addEventListener(`dispose`,a),o.texture):null}}}return r}function i(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function a(e){let n=e.target;n.removeEventListener(`dispose`,a);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function o(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:o}}function ws(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&jt(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function Ts(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else if(i!==void 0){let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}else return;let s=new(Dt(n)?Er:Tr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Es(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}function d(e,i,s,c){if(s===0)return;let u=t.get(`WEBGL_multi_draw`);if(u===null)for(let t=0;t<e.length;t++)l(e[t]/o,i[t],c[t]);else{u.multiDrawElementsInstancedWEBGL(r,i,0,a,e,0,c,0,s);let t=0;for(let e=0;e<s;e++)t+=i[e]*c[e];n.update(t,r,1)}}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Ds(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Os(e,t,n){let r=new WeakMap,i=new qt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Xt(h,p,m,u);g.type=y,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new Ct(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function ks(e,t,n,r){let i=new WeakMap;function a(a){let o=r.render.frame,c=a.geometry,l=t.get(a,c);if(i.get(l)!==o&&(t.update(l),i.set(l,o)),a.isInstancedMesh&&(a.hasEventListener(`dispose`,s)===!1&&a.addEventListener(`dispose`,s),i.get(a)!==o&&(n.update(a.instanceMatrix,e.ARRAY_BUFFER),a.instanceColor!==null&&n.update(a.instanceColor,e.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let e=a.skeleton;i.get(e)!==o&&(e.update(),i.set(e,o))}return l}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var As=new Kt,js=new Sa(1,1),Ms=new Xt,Ns=new Zt,Ps=new pi,Fs=[],Is=[],Ls=new Float32Array(16),Rs=new Float32Array(9),zs=new Float32Array(4);function Bs(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Fs[i];if(a===void 0&&(a=new Float32Array(i),Fs[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Vs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Hs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Us(e,t){let n=Is[t];n===void 0&&(n=new Int32Array(t),Is[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Ws(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Gs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Vs(n,t))return;e.uniform2fv(this.addr,t),Hs(n,t)}}function Ks(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Vs(n,t))return;e.uniform3fv(this.addr,t),Hs(n,t)}}function qs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Vs(n,t))return;e.uniform4fv(this.addr,t),Hs(n,t)}}function Js(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Vs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Hs(n,t)}else{if(Vs(n,r))return;zs.set(r),e.uniformMatrix2fv(this.addr,!1,zs),Hs(n,r)}}function Ys(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Vs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Hs(n,t)}else{if(Vs(n,r))return;Rs.set(r),e.uniformMatrix3fv(this.addr,!1,Rs),Hs(n,r)}}function Xs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Vs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Hs(n,t)}else{if(Vs(n,r))return;Ls.set(r),e.uniformMatrix4fv(this.addr,!1,Ls),Hs(n,r)}}function Zs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Qs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Vs(n,t))return;e.uniform2iv(this.addr,t),Hs(n,t)}}function $s(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Vs(n,t))return;e.uniform3iv(this.addr,t),Hs(n,t)}}function ec(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Vs(n,t))return;e.uniform4iv(this.addr,t),Hs(n,t)}}function tc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Vs(n,t))return;e.uniform2uiv(this.addr,t),Hs(n,t)}}function rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Vs(n,t))return;e.uniform3uiv(this.addr,t),Hs(n,t)}}function ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Vs(n,t))return;e.uniform4uiv(this.addr,t),Hs(n,t)}}function ac(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(js.compareFunction=515,a=js):a=As,n.setTexture2D(t||a,i)}function oc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ns,i)}function sc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Ps,i)}function cc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Ms,i)}function lc(e){switch(e){case 5126:return Ws;case 35664:return Gs;case 35665:return Ks;case 35666:return qs;case 35674:return Js;case 35675:return Ys;case 35676:return Xs;case 5124:case 35670:return Zs;case 35667:case 35671:return Qs;case 35668:case 35672:return $s;case 35669:case 35673:return ec;case 5125:return tc;case 36294:return nc;case 36295:return rc;case 36296:return ic;case 35678:case 36198:case 36298:case 36306:case 35682:return ac;case 35679:case 36299:case 36307:return oc;case 35680:case 36300:case 36308:case 36293:return sc;case 36289:case 36303:case 36311:case 36292:return cc}}function uc(e,t){e.uniform1fv(this.addr,t)}function dc(e,t){let n=Bs(t,this.size,2);e.uniform2fv(this.addr,n)}function fc(e,t){let n=Bs(t,this.size,3);e.uniform3fv(this.addr,n)}function pc(e,t){let n=Bs(t,this.size,4);e.uniform4fv(this.addr,n)}function mc(e,t){let n=Bs(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function hc(e,t){let n=Bs(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function gc(e,t){let n=Bs(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function _c(e,t){e.uniform1iv(this.addr,t)}function vc(e,t){e.uniform2iv(this.addr,t)}function yc(e,t){e.uniform3iv(this.addr,t)}function bc(e,t){e.uniform4iv(this.addr,t)}function xc(e,t){e.uniform1uiv(this.addr,t)}function Sc(e,t){e.uniform2uiv(this.addr,t)}function Cc(e,t){e.uniform3uiv(this.addr,t)}function wc(e,t){e.uniform4uiv(this.addr,t)}function Tc(e,t,n){let r=this.cache,i=t.length,a=Us(n,i);Vs(r,a)||(e.uniform1iv(this.addr,a),Hs(r,a));for(let e=0;e!==i;++e)n.setTexture2D(t[e]||As,a[e])}function Ec(e,t,n){let r=this.cache,i=t.length,a=Us(n,i);Vs(r,a)||(e.uniform1iv(this.addr,a),Hs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ns,a[e])}function Dc(e,t,n){let r=this.cache,i=t.length,a=Us(n,i);Vs(r,a)||(e.uniform1iv(this.addr,a),Hs(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Ps,a[e])}function Oc(e,t,n){let r=this.cache,i=t.length,a=Us(n,i);Vs(r,a)||(e.uniform1iv(this.addr,a),Hs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Ms,a[e])}function kc(e){switch(e){case 5126:return uc;case 35664:return dc;case 35665:return fc;case 35666:return pc;case 35674:return mc;case 35675:return hc;case 35676:return gc;case 5124:case 35670:return _c;case 35667:case 35671:return vc;case 35668:case 35672:return yc;case 35669:case 35673:return bc;case 5125:return xc;case 36294:return Sc;case 36295:return Cc;case 36296:return wc;case 35678:case 36198:case 36298:case 36306:case 35682:return Tc;case 35679:case 36299:case 36307:return Ec;case 35680:case 36300:case 36308:case 36293:return Dc;case 36289:case 36303:case 36311:case 36292:return Oc}}var Ac=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=lc(t.type)}},jc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=kc(t.type)}},Mc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Nc=/(\w+)(\])?(\[|\.)?/g;function Pc(e,t){e.seq.push(t),e.map[t.id]=t}function Fc(e,t,n){let r=e.name,i=r.length;for(Nc.lastIndex=0;;){let a=Nc.exec(r),o=Nc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Pc(n,l===void 0?new Ac(s,e,t):new jc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Mc(s),Pc(n,e)),n=e}}}var Ic=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Fc(n,e.getUniformLocation(t,n.name),this)}}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Lc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Rc=37297,zc=0;function Bc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Vc=new R;function Hc(e){It._getMatrix(Vc,It.workingColorSpace,e);let t=`mat3( ${Vc.elements.map(e=>e.toFixed(4))} )`;switch(It.getTransfer(e)){case We:return[t,`LinearTransferOETF`];case Ge:return[t,`sRGBTransferOETF`];default:return console.warn(`THREE.WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Uc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Bc(e.getShaderSource(t),r)}return i}function Wc(e,t){let n=Hc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}function Gc(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`Cineon`;break;case 4:n=`ACESFilmic`;break;case 6:n=`AgX`;break;case 7:n=`Neutral`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Kc=new L;function qc(){return It.getLuminanceCoefficients(Kc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Kc.x.toFixed(4)}, ${Kc.y.toFixed(4)}, ${Kc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Jc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Zc).join(`
`)}function Yc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Xc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Zc(e){return e!==``}function Qc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $c(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var el=/^[ \t]*#include +<([\w\d./]+)>/gm;function tl(e){return e.replace(el,rl)}var nl=new Map;function rl(e,t){let n=V[t];if(n===void 0){let e=nl.get(t);if(e!==void 0)n=V[e],console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return tl(n)}var il=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function al(e){return e.replace(il,ol)}function ol(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function sl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function cl(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function ll(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:t=`ENVMAP_TYPE_CUBE_UV`}return t}function ul(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:t=`ENVMAP_MODE_REFRACTION`}return t}function dl(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`}return t}function fl(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function pl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=cl(n),l=ll(n),u=ul(n),d=dl(n),f=fl(n),p=Jc(n),m=Yc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Zc).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Zc).join(`
`),_.length>0&&(_+=`
`)):(g=[sl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Zc).join(`
`),_=[sl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor||n.batchingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:V.tonemapping_pars_fragment,n.toneMapping===0?``:Gc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,V.colorspace_pars_fragment,Wc(`linearToOutputTexel`,n.outputColorSpace),qc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Zc).join(`
`)),o=tl(o),o=Qc(o,n),o=$c(o,n),s=tl(s),s=Qc(s,n),s=$c(s,n),o=al(o),s=al(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Lc(i,i.VERTEX_SHADER,y),S=Lc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Uc(i,x,`vertex`),n=Uc(i,S,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Ic(i,h),T=Xc(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Rc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=zc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var ml=0,hl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new gl(e),t.set(e,n)),n}},gl=class{constructor(e){this.id=ml++,this.code=e,this.usedTimes=0}};function _l(e,t,n,r,i,a,o){let s=new In,c=new hl,l=new Set,u=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function h(e){return l.add(e),e===0?`uv`:`uv${e}`}function g(a,s,u,g,_){let v=g.fog,y=_.geometry,b=a.isMeshStandardMaterial?g.environment:null,x=(a.isMeshStandardMaterial?n:t).get(a.envMap||b),S=x&&x.mapping===306?x.image.height:null,C=m[a.type];a.precision!==null&&(p=i.getMaxPrecision(a.precision),p!==a.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,a.precision,`not supported, using`,p,`instead.`));let w=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,T=w===void 0?0:w.length,E=0;y.morphAttributes.position!==void 0&&(E=1),y.morphAttributes.normal!==void 0&&(E=2),y.morphAttributes.color!==void 0&&(E=3);let D,O,k,ee;if(C){let e=Ko[C];D=e.vertexShader,O=e.fragmentShader}else D=a.vertexShader,O=a.fragmentShader,c.update(a),k=c.getVertexShaderID(a),ee=c.getFragmentShaderID(a);let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),A=_.isInstancedMesh===!0,re=_.isBatchedMesh===!0,ie=!!a.map,j=!!a.matcap,ae=!!x,oe=!!a.aoMap,se=!!a.lightMap,ce=!!a.bumpMap,le=!!a.normalMap,ue=!!a.displacementMap,de=!!a.emissiveMap,fe=!!a.metalnessMap,pe=!!a.roughnessMap,me=a.anisotropy>0,he=a.clearcoat>0,ge=a.dispersion>0,_e=a.iridescence>0,ve=a.sheen>0,M=a.transmission>0,ye=me&&!!a.anisotropyMap,be=he&&!!a.clearcoatMap,xe=he&&!!a.clearcoatNormalMap,N=he&&!!a.clearcoatRoughnessMap,Se=_e&&!!a.iridescenceMap,P=_e&&!!a.iridescenceThicknessMap,Ce=ve&&!!a.sheenColorMap,we=ve&&!!a.sheenRoughnessMap,Te=!!a.specularMap,Ee=!!a.specularColorMap,De=!!a.specularIntensityMap,Oe=M&&!!a.transmissionMap,ke=M&&!!a.thicknessMap,Ae=!!a.gradientMap,je=!!a.alphaMap,Me=a.alphaTest>0,Ne=!!a.alphaHash,Pe=!!a.extensions,Fe=0;a.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Fe=e.toneMapping);let Ie={shaderID:C,shaderType:a.type,shaderName:a.name,vertexShader:D,fragmentShader:O,defines:a.defines,customVertexShaderID:k,customFragmentShaderID:ee,isRawShaderMaterial:a.isRawShaderMaterial===!0,glslVersion:a.glslVersion,precision:p,batching:re,batchingColor:re&&_._colorsTexture!==null,instancing:A,instancingColor:A&&_.instanceColor!==null,instancingMorph:A&&_.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ue,alphaToCoverage:!!a.alphaToCoverage,map:ie,matcap:j,envMap:ae,envMapMode:ae&&x.mapping,envMapCubeUVHeight:S,aoMap:oe,lightMap:se,bumpMap:ce,normalMap:le,displacementMap:f&&ue,emissiveMap:de,normalMapObjectSpace:le&&a.normalMapType===1,normalMapTangentSpace:le&&a.normalMapType===0,metalnessMap:fe,roughnessMap:pe,anisotropy:me,anisotropyMap:ye,clearcoat:he,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:N,dispersion:ge,iridescence:_e,iridescenceMap:Se,iridescenceThicknessMap:P,sheen:ve,sheenColorMap:Ce,sheenRoughnessMap:we,specularMap:Te,specularColorMap:Ee,specularIntensityMap:De,transmission:M,transmissionMap:Oe,thicknessMap:ke,gradientMap:Ae,opaque:a.transparent===!1&&a.blending===1&&a.alphaToCoverage===!1,alphaMap:je,alphaTest:Me,alphaHash:Ne,combine:a.combine,mapUv:ie&&h(a.map.channel),aoMapUv:oe&&h(a.aoMap.channel),lightMapUv:se&&h(a.lightMap.channel),bumpMapUv:ce&&h(a.bumpMap.channel),normalMapUv:le&&h(a.normalMap.channel),displacementMapUv:ue&&h(a.displacementMap.channel),emissiveMapUv:de&&h(a.emissiveMap.channel),metalnessMapUv:fe&&h(a.metalnessMap.channel),roughnessMapUv:pe&&h(a.roughnessMap.channel),anisotropyMapUv:ye&&h(a.anisotropyMap.channel),clearcoatMapUv:be&&h(a.clearcoatMap.channel),clearcoatNormalMapUv:xe&&h(a.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:N&&h(a.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&h(a.iridescenceMap.channel),iridescenceThicknessMapUv:P&&h(a.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&h(a.sheenColorMap.channel),sheenRoughnessMapUv:we&&h(a.sheenRoughnessMap.channel),specularMapUv:Te&&h(a.specularMap.channel),specularColorMapUv:Ee&&h(a.specularColorMap.channel),specularIntensityMapUv:De&&h(a.specularIntensityMap.channel),transmissionMapUv:Oe&&h(a.transmissionMap.channel),thicknessMapUv:ke&&h(a.thicknessMap.channel),alphaMapUv:je&&h(a.alphaMap.channel),vertexTangents:!!y.attributes.tangent&&(le||me),vertexColors:a.vertexColors,vertexAlphas:a.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,pointsUvs:_.isPoints===!0&&!!y.attributes.uv&&(ie||je),fog:!!v,useFog:a.fog===!0,fogExp2:!!v&&v.isFogExp2,flatShading:a.flatShading===!0&&a.wireframe===!1,sizeAttenuation:a.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:_.isSkinnedMesh===!0,morphTargets:y.morphAttributes.position!==void 0,morphNormals:y.morphAttributes.normal!==void 0,morphColors:y.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:s.directional.length,numPointLights:s.point.length,numSpotLights:s.spot.length,numSpotLightMaps:s.spotLightMap.length,numRectAreaLights:s.rectArea.length,numHemiLights:s.hemi.length,numDirLightShadows:s.directionalShadowMap.length,numPointLightShadows:s.pointShadowMap.length,numSpotLightShadows:s.spotShadowMap.length,numSpotLightShadowsWithMaps:s.numSpotLightShadowsWithMaps,numLightProbes:s.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:a.dithering,shadowMapEnabled:e.shadowMap.enabled&&u.length>0,shadowMapType:e.shadowMap.type,toneMapping:Fe,decodeVideoTexture:ie&&a.map.isVideoTexture===!0&&It.getTransfer(a.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:de&&a.emissiveMap.isVideoTexture===!0&&It.getTransfer(a.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:a.premultipliedAlpha,doubleSided:a.side===2,flipSided:a.side===1,useDepthPacking:a.depthPacking>=0,depthPacking:a.depthPacking||0,index0AttributeName:a.index0AttributeName,extensionClipCullDistance:Pe&&a.extensions.clipCullDistance===!0&&r.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Pe&&a.extensions.multiDraw===!0||re)&&r.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:r.has(`KHR_parallel_shader_compile`),customProgramCacheKey:a.customProgramCacheKey()};return Ie.vertexUv1s=l.has(1),Ie.vertexUv2s=l.has(2),Ie.vertexUv3s=l.has(3),l.clear(),Ie}function _(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(v(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function v(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){s.disableAll(),t.supportsVertexTextures&&s.enable(0),t.instancing&&s.enable(1),t.instancingColor&&s.enable(2),t.instancingMorph&&s.enable(3),t.matcap&&s.enable(4),t.envMap&&s.enable(5),t.normalMapObjectSpace&&s.enable(6),t.normalMapTangentSpace&&s.enable(7),t.clearcoat&&s.enable(8),t.iridescence&&s.enable(9),t.alphaTest&&s.enable(10),t.vertexColors&&s.enable(11),t.vertexAlphas&&s.enable(12),t.vertexUv1s&&s.enable(13),t.vertexUv2s&&s.enable(14),t.vertexUv3s&&s.enable(15),t.vertexTangents&&s.enable(16),t.anisotropy&&s.enable(17),t.alphaHash&&s.enable(18),t.batching&&s.enable(19),t.dispersion&&s.enable(20),t.batchingColor&&s.enable(21),t.gradientMap&&s.enable(22),e.push(s.mask),s.disableAll(),t.fog&&s.enable(0),t.useFog&&s.enable(1),t.flatShading&&s.enable(2),t.logarithmicDepthBuffer&&s.enable(3),t.reversedDepthBuffer&&s.enable(4),t.skinning&&s.enable(5),t.morphTargets&&s.enable(6),t.morphNormals&&s.enable(7),t.morphColors&&s.enable(8),t.premultipliedAlpha&&s.enable(9),t.shadowMapEnabled&&s.enable(10),t.doubleSided&&s.enable(11),t.flipSided&&s.enable(12),t.useDepthPacking&&s.enable(13),t.dithering&&s.enable(14),t.transmission&&s.enable(15),t.sheen&&s.enable(16),t.opaque&&s.enable(17),t.pointsUvs&&s.enable(18),t.decodeVideoTexture&&s.enable(19),t.decodeVideoTextureEmissive&&s.enable(20),t.alphaToCoverage&&s.enable(21),e.push(s.mask)}function b(e){let t=m[e.type],n;if(t){let e=Ko[t];n=ti.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r;for(let e=0,t=u.length;e<t;e++){let t=u[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new pl(e,n,t,a),u.push(r)),r}function S(e){if(--e.usedTimes===0){let t=u.indexOf(e);u[t]=u[u.length-1],u.pop(),e.destroy()}}function C(e){c.remove(e)}function w(){c.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:u,dispose:w}}function vl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function yl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function bl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function xl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(n,r,i,a,o,s){let c=e[t];return c===void 0?(c={id:n.id,object:n,geometry:r,material:i,groupOrder:a,renderOrder:n.renderOrder,z:o,group:s},e[t]=c):(c.id=n.id,c.object=n,c.geometry=r,c.material=i,c.groupOrder=a,c.renderOrder=n.renderOrder,c.z=o,c.group=s),t++,c}function s(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function c(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function l(e,t){n.length>1&&n.sort(e||yl),r.length>1&&r.sort(t||bl),i.length>1&&i.sort(t||bl)}function u(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:s,unshift:c,finish:u,sort:l}}function Sl(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new xl,e.set(t,[i])):n>=r.length?(i=new xl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Cl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new L,color:new B};break;case`SpotLight`:n={position:new L,direction:new L,color:new B,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new L,color:new B,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new L,skyColor:new B,groundColor:new B};break;case`RectAreaLight`:n={color:new B,position:new L,halfWidth:new L,halfHeight:new L}}return e[t.id]=n,n}}}function wl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Tl=0;function El(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Dl(e){let t=new Cl,n=wl(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new L);let i=new L,a=new z,o=new z;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(El);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=H.LTC_FLOAT_1,r.rectAreaLTC2=H.LTC_FLOAT_2):(r.rectAreaLTC1=H.LTC_HALF_1,r.rectAreaLTC2=H.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Tl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Ol(e){let t=new Dl(e),n=[],r=[];function i(e){l.camera=e,n.length=0,r.length=0}function a(e){n.push(e)}function o(e){r.push(e)}function s(){t.setup(n)}function c(e){t.setupView(n,e)}let l={lightsArray:n,shadowsArray:r,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:s,setupLightsView:c,pushLight:a,pushShadow:o}}function kl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ol(e),t.set(n,[a])):r>=i.length?(a=new Ol(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Al=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Ml(e,t,n){let r=new $i,i=new Ct,a=new Ct,o=new qt,c=new Ma({depthPacking:Ve}),l=new Na,u={},d=n.maxTextureSize,f={0:1,1:0,2:2},p=new ii({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:Al,fragmentShader:jl}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new Fr;h.setAttribute(`position`,new wr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new qr(h,p),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,c){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;let l=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=v!==3&&this.type===3,h=v===3&&this.type!==3;for(let l=0,u=t.length;l<u;l++){let u=t[l],f=u.shadow;if(f===void 0){console.warn(`THREE.WebGLShadowMap:`,u,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;i.copy(f.mapSize);let g=f.getFrameExtents();if(i.multiply(g),a.copy(f.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(a.x=Math.floor(d/g.x),i.x=a.x*g.x,f.mapSize.x=a.x),i.y>d&&(a.y=Math.floor(d/g.y),i.y=a.y*g.y,f.mapSize.y=a.y)),f.map===null||m===!0||h===!0){let e=this.type===3?{}:{minFilter:s,magFilter:s};f.map!==null&&f.map.dispose(),f.map=new Yt(i.x,i.y,e),f.map.texture.name=u.name+`.shadowMap`,f.camera.updateProjectionMatrix()}e.setRenderTarget(f.map),e.clear();let _=f.getViewportCount();for(let e=0;e<_;e++){let t=f.getViewport(e);o.set(a.x*t.x,a.y*t.y,a.x*t.z,a.y*t.w),p.viewport(o),f.updateMatrices(u,e),r=f.getFrustum(),x(n,c,f.camera,u,this.type)}f.isPointLightShadow!==!0&&this.type===3&&y(f,c),f.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(l,u,f)};function y(n,r){let a=t.update(g);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Yt(i.x,i.y)),p.uniforms.shadow_pass.value=n.map.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],i,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}var Nl={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function Pl(e,t){function n(){let t=!1,n=new qt,r=null,i=new qt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?de(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Nl[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(r&&(t=1-t),e.clearDepth(t),o=t)},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?de(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new B(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,ee=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ne=!1,A=0,re=e.getParameter(e.VERSION);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(A=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),ne=A>=2):(A=parseFloat(/^WebGL (\d)/.exec(re)[1]),ne=A>=1);let ie=null,j={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new qt().fromArray(ae),ce=new qt().fromArray(oe);function le(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ue={};ue[e.TEXTURE_2D]=le(e.TEXTURE_2D,e.TEXTURE_2D,1),ue[e.TEXTURE_CUBE_MAP]=le(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[e.TEXTURE_2D_ARRAY]=le(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ue[e.TEXTURE_3D]=le(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),de(e.DEPTH_TEST),o.setFunc(3),ye(!1),be(1),de(e.CULL_FACE),ve(0);function de(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function fe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function pe(t,n){return d[t]!==n&&(e.bindFramebuffer(t,n),d[t]=n,t===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=n),!0)}function me(t,n){let r=p,i=!1;if(t){r=f.get(n),r===void 0&&(r=[],f.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function he(t){return m!==t&&(e.useProgram(t),m=t,!0)}let ge={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ge[103]=e.MIN,ge[104]=e.MAX;let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ve(t,n,r,i,a,o,s,c,l,u){if(t===0)h===!0&&(fe(e.BLEND),h=!1);else if(h===!1&&(de(e.BLEND),h=!0),t!==5){if(t!==g||u!==T){if((_!==100||b!==100)&&(e.blendEquation(e.FUNC_ADD),_=100,b=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:console.error(`THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:console.error(`THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}v=null,y=null,x=null,S=null,C.set(0,0,0),w=0,g=t,T=u}}else a||=n,o||=r,s||=i,(n!==_||a!==b)&&(e.blendEquationSeparate(ge[n],ge[a]),_=n,b=a),(r!==v||i!==y||o!==x||s!==S)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),v=r,y=i,x=o,S=s),(c.equals(C)===!1||l!==w)&&(e.blendColor(c.r,c.g,c.b,l),C.copy(c),w=l),g=t,T=!1}function M(t,n){t.side===2?fe(e.CULL_FACE):de(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ye(r),t.blending===1&&t.transparent===!1?ve(0):ve(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),N(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?de(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function ye(t){E!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),E=t)}function be(t){t===0?fe(e.CULL_FACE):(de(e.CULL_FACE),t!==D&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),D=t}function xe(t){t!==O&&(ne&&e.lineWidth(t),O=t)}function N(t,n,r){t?(de(e.POLYGON_OFFSET_FILL),(k!==n||ee!==r)&&(e.polygonOffset(n,r),k=n,ee=r)):fe(e.POLYGON_OFFSET_FILL)}function Se(t){t?de(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function P(t){t===void 0&&(t=e.TEXTURE0+te-1),ie!==t&&(e.activeTexture(t),ie=t)}function Ce(t,n,r){r===void 0&&(r=ie===null?e.TEXTURE0+te-1:ie);let i=j[r];i===void 0&&(i={type:void 0,texture:void 0},j[r]=i),(i.type!==t||i.texture!==n)&&(ie!==r&&(e.activeTexture(r),ie=r),e.bindTexture(t,n||ue[t]),i.type=t,i.texture=n)}function we(){let t=j[ie];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Oe(){try{e.texSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function je(){try{e.texStorage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Me(){try{e.texStorage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ne(){try{e.texImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Fe(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Ie(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function Le(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Re(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function ze(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},ie=null,j={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new B(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,ee=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:de,disable:fe,bindFramebuffer:pe,drawBuffers:me,useProgram:he,setBlending:ve,setMaterial:M,setFlipSided:ye,setCullFace:be,setLineWidth:xe,setPolygonOffset:N,setScissorTest:Se,activeTexture:P,bindTexture:Ce,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:Ne,texImage3D:Pe,updateUBOMapping:Le,uniformBlockBinding:Re,texStorage2D:je,texStorage3D:Me,texSubImage2D:De,texSubImage3D:Oe,compressedTexSubImage2D:ke,compressedTexSubImage3D:Ae,scissor:Fe,viewport:Ie,reset:ze}}function Fl(e,t,n,r,p,m,h){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new Ct,y=new WeakMap,b,x=new WeakMap,S=!1;try{S=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function C(e,t){return S?new OffscreenCanvas(e,t):Ot(`canvas`)}function w(e,t,n){let r=1,i=Ne(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);b===void 0&&(b=C(n,a));let o=t?C(n,a):b;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function T(e){return e.generateMipmaps}function E(t){e.generateMipmap(t)}function D(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function O(n,r,i,a,o=!1){if(n!==null){if(e[n]!==void 0)return e[n];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let s=r;if(r===e.RED&&(i===e.FLOAT&&(s=e.R32F),i===e.HALF_FLOAT&&(s=e.R16F),i===e.UNSIGNED_BYTE&&(s=e.R8)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.R8UI),i===e.UNSIGNED_SHORT&&(s=e.R16UI),i===e.UNSIGNED_INT&&(s=e.R32UI),i===e.BYTE&&(s=e.R8I),i===e.SHORT&&(s=e.R16I),i===e.INT&&(s=e.R32I)),r===e.RG&&(i===e.FLOAT&&(s=e.RG32F),i===e.HALF_FLOAT&&(s=e.RG16F),i===e.UNSIGNED_BYTE&&(s=e.RG8)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RG8UI),i===e.UNSIGNED_SHORT&&(s=e.RG16UI),i===e.UNSIGNED_INT&&(s=e.RG32UI),i===e.BYTE&&(s=e.RG8I),i===e.SHORT&&(s=e.RG16I),i===e.INT&&(s=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RGB8UI),i===e.UNSIGNED_SHORT&&(s=e.RGB16UI),i===e.UNSIGNED_INT&&(s=e.RGB32UI),i===e.BYTE&&(s=e.RGB8I),i===e.SHORT&&(s=e.RGB16I),i===e.INT&&(s=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(s=e.RGBA16UI),i===e.UNSIGNED_INT&&(s=e.RGBA32UI),i===e.BYTE&&(s=e.RGBA8I),i===e.SHORT&&(s=e.RGBA16I),i===e.INT&&(s=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_INT_5_9_9_9_REV&&(s=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(s=e.R11F_G11F_B10F)),r===e.RGBA){let t=o?We:It.getTransfer(a);i===e.FLOAT&&(s=e.RGBA32F),i===e.HALF_FLOAT&&(s=e.RGBA16F),i===e.UNSIGNED_BYTE&&(s=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT_4_4_4_4&&(s=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(s=e.RGB5_A1)}return(s===e.R16F||s===e.R32F||s===e.RG16F||s===e.RG32F||s===e.RGBA16F||s===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),s}function k(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,console.warn(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function te(e,t){return T(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function ne(e){let t=e.target;t.removeEventListener(`dispose`,ne),re(t),t.isVideoTexture&&y.delete(t)}function A(e){let t=e.target;t.removeEventListener(`dispose`,A),j(t)}function re(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=x.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&ie(e),Object.keys(i).length===0&&x.delete(n)}r.remove(e)}function ie(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=x.get(i);delete a[n.__cacheKey],h.memory.textures--}function j(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),r.remove(i[t])}r.remove(t)}let ae=0;function oe(){ae=0}function se(){let e=ae;return e>=p.maxTextures&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),ae+=1,e}function ce(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function le(t,i){let a=r.get(t);if(t.isVideoTexture&&je(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{ye(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ue(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ye(a,t,i):n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function de(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ye(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function fe(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?be(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let pe={[i]:e.REPEAT,[a]:e.CLAMP_TO_EDGE,[o]:e.MIRRORED_REPEAT},me={[s]:e.NEAREST,[c]:e.NEAREST_MIPMAP_NEAREST,[l]:e.NEAREST_MIPMAP_LINEAR,[u]:e.LINEAR,[d]:e.LINEAR_MIPMAP_NEAREST,[f]:e.LINEAR_MIPMAP_LINEAR},he={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ge(n,i){if(i.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(i.magFilter===1006||i.magFilter===1007||i.magFilter===1005||i.magFilter===1008||i.minFilter===1006||i.minFilter===1007||i.minFilter===1005||i.minFilter===1008)&&console.warn(`THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,pe[i.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,pe[i.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,pe[i.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,me[i.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,me[i.minFilter]),i.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,he[i.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(i.magFilter===1003||i.minFilter!==1005&&i.minFilter!==1008||i.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(i.anisotropy>1||r.get(i).__currentAnisotropy){let a=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,a.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(i.anisotropy,p.getMaxAnisotropy())),r.get(i).__currentAnisotropy=i.anisotropy}}}function _e(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,ne));let i=n.source,a=x.get(i);a===void 0&&(a={},x.set(i,a));let o=ce(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&ie(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function ve(e,t,n){return Math.floor(Math.floor(e/n)/t)}function M(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ve(n.start,r.width,4),c=ve(t.start,r.width,4);n.start<=i+1&&a===c&&ve(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=e.getParameter(e.UNPACK_ROW_LENGTH),l=e.getParameter(e.UNPACK_SKIP_PIXELS),u=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;e.pixelStorei(e.UNPACK_SKIP_PIXELS,u),e.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,c),e.pixelStorei(e.UNPACK_SKIP_PIXELS,l),e.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ye(t,i,a){let o=e.TEXTURE_2D;(i.isDataArrayTexture||i.isCompressedArrayTexture)&&(o=e.TEXTURE_2D_ARRAY),i.isData3DTexture&&(o=e.TEXTURE_3D);let s=_e(t,i),c=i.source;n.bindTexture(o,t.__webglTexture,e.TEXTURE0+a);let l=r.get(c);if(c.version!==l.__version||s===!0){n.activeTexture(e.TEXTURE0+a);let t=It.getPrimaries(It.workingColorSpace),r=i.colorSpace===``?null:It.getPrimaries(i.colorSpace),u=i.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,i.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,u);let d=w(i.image,!1,p.maxTextureSize);d=Me(i,d);let f=m.convert(i.format,i.colorSpace),h=m.convert(i.type),g=O(i.internalFormat,f,h,i.colorSpace,i.isVideoTexture);ge(o,i);let _,v=i.mipmaps,y=i.isVideoTexture!==!0,b=l.__version===void 0||s===!0,x=c.dataReady,S=te(i,d);if(i.isDepthTexture)g=k(i.format===ee,i.type),b&&(y?n.texStorage2D(e.TEXTURE_2D,1,g,d.width,d.height):n.texImage2D(e.TEXTURE_2D,0,g,d.width,d.height,0,f,h,null));else if(i.isDataTexture){if(v.length>0){y&&b&&n.texStorage2D(e.TEXTURE_2D,S,g,v[0].width,v[0].height);for(let t=0,r=v.length;t<r;t++)_=v[t],y?x&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,_.width,_.height,f,h,_.data):n.texImage2D(e.TEXTURE_2D,t,g,_.width,_.height,0,f,h,_.data);i.generateMipmaps=!1}else y?(b&&n.texStorage2D(e.TEXTURE_2D,S,g,d.width,d.height),x&&M(i,d,f,h)):n.texImage2D(e.TEXTURE_2D,0,g,d.width,d.height,0,f,h,d.data)}else if(i.isCompressedTexture){if(i.isCompressedArrayTexture){y&&b&&n.texStorage3D(e.TEXTURE_2D_ARRAY,S,g,v[0].width,v[0].height,d.depth);for(let t=0,r=v.length;t<r;t++)if(_=v[t],i.format!==1023){if(f!==null){if(y){if(x){if(i.layerUpdates.size>0){let r=Ho(_.width,_.height,i.format,i.type);for(let a of i.layerUpdates){let i=_.data.subarray(a*r/_.data.BYTES_PER_ELEMENT,(a+1)*r/_.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,a,_.width,_.height,1,f,i)}i.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,_.width,_.height,d.depth,f,_.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,t,g,_.width,_.height,d.depth,0,_.data,0,0)}else console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else y?x&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,_.width,_.height,d.depth,f,h,_.data):n.texImage3D(e.TEXTURE_2D_ARRAY,t,g,_.width,_.height,d.depth,0,f,h,_.data)}else{y&&b&&n.texStorage2D(e.TEXTURE_2D,S,g,v[0].width,v[0].height);for(let t=0,r=v.length;t<r;t++)_=v[t],i.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,_.width,_.height,f,h,_.data):n.texImage2D(e.TEXTURE_2D,t,g,_.width,_.height,0,f,h,_.data):f===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,_.width,_.height,f,_.data):n.compressedTexImage2D(e.TEXTURE_2D,t,g,_.width,_.height,0,_.data)}}else if(i.isDataArrayTexture){if(y){if(b&&n.texStorage3D(e.TEXTURE_2D_ARRAY,S,g,d.width,d.height,d.depth),x){if(i.layerUpdates.size>0){let t=Ho(d.width,d.height,i.format,i.type);for(let r of i.layerUpdates){let i=d.data.subarray(r*t/d.data.BYTES_PER_ELEMENT,(r+1)*t/d.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,r,d.width,d.height,1,f,h,i)}i.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,d.width,d.height,d.depth,f,h,d.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,g,d.width,d.height,d.depth,0,f,h,d.data)}else if(i.isData3DTexture)y?(b&&n.texStorage3D(e.TEXTURE_3D,S,g,d.width,d.height,d.depth),x&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,d.width,d.height,d.depth,f,h,d.data)):n.texImage3D(e.TEXTURE_3D,0,g,d.width,d.height,d.depth,0,f,h,d.data);else if(i.isFramebufferTexture){if(b){if(y)n.texStorage2D(e.TEXTURE_2D,S,g,d.width,d.height);else{let t=d.width,r=d.height;for(let i=0;i<S;i++)n.texImage2D(e.TEXTURE_2D,i,g,t,r,0,f,h,null),t>>=1,r>>=1}}}else if(v.length>0){if(y&&b){let t=Ne(v[0]);n.texStorage2D(e.TEXTURE_2D,S,g,t.width,t.height)}for(let t=0,r=v.length;t<r;t++)_=v[t],y?x&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f,h,_):n.texImage2D(e.TEXTURE_2D,t,g,f,h,_);i.generateMipmaps=!1}else if(y){if(b){let t=Ne(d);n.texStorage2D(e.TEXTURE_2D,S,g,t.width,t.height)}x&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,f,h,d)}else n.texImage2D(e.TEXTURE_2D,0,g,f,h,d);T(i)&&E(o),l.__version=c.version,i.onUpdate&&i.onUpdate(i)}t.__version=i.version}function be(t,i,a){if(i.image.length!==6)return;let o=_e(t,i),s=i.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+a);let c=r.get(s);if(s.version!==c.__version||o===!0){n.activeTexture(e.TEXTURE0+a);let t=It.getPrimaries(It.workingColorSpace),r=i.colorSpace===``?null:It.getPrimaries(i.colorSpace),l=i.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,i.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,l);let u=i.isCompressedTexture||i.image[0].isCompressedTexture,d=i.image[0]&&i.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!u&&!d?f[e]=w(i.image[e],!0,p.maxCubemapSize):f[e]=d?i.image[e].image:i.image[e],f[e]=Me(i,f[e]);let h=f[0],g=m.convert(i.format,i.colorSpace),_=m.convert(i.type),v=O(i.internalFormat,g,_,i.colorSpace),y=i.isVideoTexture!==!0,b=c.__version===void 0||o===!0,x=s.dataReady,S=te(i,h);ge(e.TEXTURE_CUBE_MAP,i);let C;if(u){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let r=0;r<C.length;r++){let a=C[r];i.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,a.width,a.height,g,_,a.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,a.width,a.height,0,g,_,a.data):g===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,a.width,a.height,g,a.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,a.width,a.height,0,a.data)}}}else{if(C=i.mipmaps,y&&b){C.length>0&&S++;let t=Ne(f[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(d){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}T(i)&&E(e.TEXTURE_CUBE_MAP),c.__version=s.version,i.onUpdate&&i.onUpdate(i)}t.__version=i.version}function xe(t,i,a,o,s,c){let l=m.convert(a.format,a.colorSpace),u=m.convert(a.type),d=O(a.internalFormat,l,u,a.colorSpace),f=r.get(i),p=r.get(a);if(p.__renderTarget=i,!f.__hasExternalTextures){let t=Math.max(1,i.width>>c),r=Math.max(1,i.height>>c);s===e.TEXTURE_3D||s===e.TEXTURE_2D_ARRAY?n.texImage3D(s,c,d,t,r,i.depth,0,l,u,null):n.texImage2D(s,c,d,t,r,0,l,u,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Ae(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,o,s,p.__webglTexture,0,ke(i)):(s===e.TEXTURE_2D||s>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&s<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,o,s,p.__webglTexture,c),n.bindFramebuffer(e.FRAMEBUFFER,null)}function N(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=k(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,c=ke(n);Ae(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,c,o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,c,o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=O(a.internalFormat,o,s,a.colorSpace),l=ke(n);r&&Ae(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,n.width,n.height):Ae(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,l,c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Se(t,i){if(i&&i.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let a=r.get(i.depthTexture);a.__renderTarget=i,a.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),le(i.depthTexture,0);let o=a.__webglTexture,s=ke(i);if(i.depthTexture.format===1026)Ae(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0);else if(i.depthTexture.format===1027)Ae(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,o,0);else throw Error(`Unknown depthTexture format`)}function P(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)throw Error(`target.depthTexture not supported in Cube render targets`);let e=t.texture.mipmaps;e&&e.length>0?Se(i.__webglFramebuffer[0],t):Se(i.__webglFramebuffer,t)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),N(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),N(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,i){let a=r.get(t);n!==void 0&&xe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&P(t)}function we(t){let i=t.texture,a=r.get(t),o=r.get(i);t.addEventListener(`dispose`,A);let s=t.textures,c=t.isWebGLCubeRenderTarget===!0,l=s.length>1;if(l||(o.__webglTexture===void 0&&(o.__webglTexture=e.createTexture()),o.__version=i.version,h.memory.textures++),c){a.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){a.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)a.__webglFramebuffer[t][n]=e.createFramebuffer()}else a.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){a.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)a.__webglFramebuffer[t]=e.createFramebuffer()}else a.__webglFramebuffer=e.createFramebuffer();if(l)for(let t=0,n=s.length;t<n;t++){let n=r.get(s[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&Ae(t)===!1){a.__webglMultisampledFramebuffer=e.createFramebuffer(),a.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,a.__webglMultisampledFramebuffer);for(let n=0;n<s.length;n++){let r=s[n];a.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,a.__webglColorRenderbuffer[n]);let i=m.convert(r.format,r.colorSpace),o=m.convert(r.type),c=O(r.internalFormat,i,o,r.colorSpace,t.isXRRenderTarget===!0),l=ke(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,a.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(a.__webglDepthRenderbuffer=e.createRenderbuffer(),N(a.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(c){n.bindTexture(e.TEXTURE_CUBE_MAP,o.__webglTexture),ge(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)xe(a.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else xe(a.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);T(i)&&E(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(l){for(let i=0,o=s.length;i<o;i++){let o=s[i],c=r.get(o),l=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(l=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(l,c.__webglTexture),ge(l,o),xe(a.__webglFramebuffer,t,o,e.COLOR_ATTACHMENT0+i,l,0),T(o)&&E(l)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,o.__webglTexture),ge(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)xe(a.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else xe(a.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);T(i)&&E(r),n.unbindTexture()}t.depthBuffer&&P(t)}function Te(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(T(a)){let t=D(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),E(t),n.unbindTexture()}}}let Ee=[],De=[];function Oe(t){if(t.samples>0){if(Ae(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,l=r.get(t),u=i.length>1;if(u)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,l.__webglMultisampledFramebuffer);let d=t.texture.mipmaps;d&&d.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),u){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,l.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),_===!0&&(Ee.length=0,De.length=0,Ee.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(Ee.push(c),De.push(c),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,De)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ee))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),u)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,l.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function ke(e){return Math.min(p.maxSamples,e.samples)}function Ae(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function je(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Me(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(It.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):console.error(`THREE.WebGLTextures: Unsupported texture color space:`,n)),t}function Ne(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=se,this.resetTextureUnits=oe,this.setTexture2D=le,this.setTexture2DArray=ue,this.setTexture3D=de,this.setTextureCube=fe,this.rebindTextures=Ce,this.setupRenderTarget=we,this.updateRenderTargetMipmap=Te,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=P,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=Ae}function Il(e,t){function n(n,r=``){let i,a=It.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Ll=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Rl=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,zl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ca(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ii({vertexShader:Ll,fragmentShader:Rl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new qr(new Ea(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bl=class extends Xe{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,m=null,h=typeof XRWebGLBinding<`u`,g=new zl,_={},y=t.getContextAttributes(),b=null,x=null,S=[],w=[],T=new Ct,E=null,D=new li;D.viewport=new qt;let te=new li;te.viewport=new qt;let ne=[D,te],A=new ko,re=null,ie=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=S[e];return t===void 0&&(t=new _i,S[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=S[e];return t===void 0&&(t=new _i,S[e]=t),t.getGripSpace()},this.getHand=function(e){let t=S[e];return t===void 0&&(t=new _i,S[e]=t),t.getHandSpace()};function j(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=S[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ae(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ae),r.removeEventListener(`inputsourceschange`,oe);for(let e=0;e<S.length;e++){let t=w[e];t!==null&&(w[e]=null,S[e].disconnect(t))}re=null,ie=null,g.reset();for(let e in _)delete _[e];e.setRenderTarget(b),f=null,d=null,u=null,r=null,x=null,me.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ae),r.addEventListener(`inputsourceschange`,oe),y.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?ee:k,a=y.stencil?C:v);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Yt(d.textureWidth,d.textureHeight,{format:O,type:p,depthTexture:new Sa(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Yt(f.framebufferWidth,f.framebufferHeight,{format:O,type:p,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),me.setContext(r),me.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function oe(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,S[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<S.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=S[r];i&&i.connect(n)}}let se=new L,ce=new L;function le(e,t,n){se.setFromMatrixPosition(t.matrixWorld),ce.setFromMatrixPosition(n.matrixWorld);let r=se.distanceTo(ce),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ue(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),A.near=te.near=D.near=t,A.far=te.far=D.far=n,(re!==A.near||ie!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),re=A.near,ie=A.far),A.layers.mask=e.layers.mask|6,D.layers.mask=A.layers.mask&3,te.layers.mask=A.layers.mask&5;let i=e.parent,a=A.cameras;ue(A,i);for(let e=0;e<a.length;e++)ue(a[e],i);a.length===2?le(A,D,te):A.projectionMatrix.copy(D.projectionMatrix),de(e,A,i)};function de(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=et*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(A)},this.getCameraTexture=function(e){return _[e]};let fe=null;function pe(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=ne[n];o===void 0&&(o=new li,o.layers.enable(n),o.viewport=new qt,ne[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=_[n];e||(e=new Ca,_[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<S.length;e++){let t=w[e],n=S[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}fe&&fe(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let me=new Wo;me.setAnimationLoop(pe),this.setAnimationLoop=function(e){fe=e},this.dispose=function(){}}},Vl=new Fn,Hl=new z;function Ul(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ei(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isMeshBasicMaterial||t.isMeshLambertMaterial?a(e,t):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,Vl.copy(o),Vl.x*=-1,Vl.y*=-1,Vl.z*=-1,a.isCubeTexture&&a.isRenderTargetTexture===!1&&(Vl.y*=-1,Vl.z*=-1),e.envMapRotation.value.setFromMatrix4(Hl.makeRotationFromEuler(Vl)),e.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Wl(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`):console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var Gl=class{constructor(e={}){let{canvas:t=kt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);m=n.getContextAttributes().alpha}else m=a;let h=new Uint32Array(4),g=new Int32Array(4),_=null,v=null,y=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let S=this,C=!1;this._outputColorSpace=He;let w=0,T=0,E=null,D=-1,O=null,k=new qt,ee=new qt,te=null,ne=new B(0),A=0,re=t.width,ie=t.height,j=1,ae=null,oe=null,se=new qt(0,0,re,ie),ce=new qt(0,0,re,ie),le=!1,ue=new $i,de=!1,fe=!1,pe=new z,me=new L,he=new qt,ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},_e=!1;function ve(){return E===null?j:1}let M=n;function ye(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r180`),t.addEventListener(`webglcontextlost`,Ke,!1),t.addEventListener(`webglcontextrestored`,qe,!1),t.addEventListener(`webglcontextcreationerror`,Je,!1),M===null){let t=`webgl2`;if(M=ye(t,e),M===null)throw ye(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let be,xe,N,Se,P,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve;function We(){be=new ws(M),be.init(),ze=new Il(M,be),xe=new $o(M,be,e,ze),N=new Pl(M,be),xe.reversedDepthBuffer&&d&&N.buffers.depth.setReversed(!0),Se=new Ds(M),P=new vl,Ce=new Fl(M,be,N,P,xe,ze,Se),we=new ts(S),Te=new Cs(S),Ee=new Go(M),Be=new Zo(M,Ee),De=new Ts(M,Ee,Se,Be),Oe=new ks(M,De,Ee,Se),Ie=new Os(M,xe,Ce),Ne=new es(P),ke=new _l(S,we,Te,be,xe,Be,Ne),Ae=new Ul(S,P),je=new Sl,Me=new kl(be),Fe=new Xo(S,we,Te,N,Oe,m,s),Pe=new Ml(S,Oe,xe),Ve=new Wl(M,Se,xe,N),Le=new Qo(M,be,Se),Re=new Es(M,be,Se),Se.programs=ke.programs,S.capabilities=xe,S.extensions=be,S.properties=P,S.renderLists=je,S.shadowMap=Pe,S.state=N,S.info=Se}We();let Ge=new Bl(S,M);this.xr=Ge,this.getContext=function(){return M},this.getContextAttributes=function(){return M.getContextAttributes()},this.forceContextLoss=function(){let e=be.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=be.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(e){e!==void 0&&(j=e,this.setSize(re,ie,!1))},this.getSize=function(e){return e.set(re,ie)},this.setSize=function(e,n,r=!0){Ge.isPresenting?console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`):(re=e,ie=n,t.width=Math.floor(e*j),t.height=Math.floor(n*j),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(re*j,ie*j).floor()},this.setDrawingBufferSize=function(e,n,r){re=e,ie=n,j=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.getCurrentViewport=function(e){return e.copy(k)},this.getViewport=function(e){return e.copy(se)},this.setViewport=function(e,t,n,r){e.isVector4?se.set(e.x,e.y,e.z,e.w):se.set(e,t,n,r),N.viewport(k.copy(se).multiplyScalar(j).round())},this.getScissor=function(e){return e.copy(ce)},this.setScissor=function(e,t,n,r){e.isVector4?ce.set(e.x,e.y,e.z,e.w):ce.set(e,t,n,r),N.scissor(ee.copy(ce).multiplyScalar(j).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(e){N.setScissorTest(le=e)},this.setOpaqueSort=function(e){ae=e},this.setTransparentSort=function(e){oe=e},this.getClearColor=function(e){return e.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor(...arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(E!==null){let t=E.texture.format;e=t===1033||t===1031||t===1029}if(e){let e=E.texture.type,t=e===1009||e===1014||e===1012||e===1020||e===1017||e===1018,n=Fe.getClearColor(),r=Fe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(h[0]=i,h[1]=a,h[2]=o,h[3]=r,M.clearBufferuiv(M.COLOR,0,h)):(g[0]=i,g[1]=a,g[2]=o,g[3]=r,M.clearBufferiv(M.COLOR,0,g))}else r|=M.COLOR_BUFFER_BIT}t&&(r|=M.DEPTH_BUFFER_BIT),n&&(r|=M.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),M.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ke,!1),t.removeEventListener(`webglcontextrestored`,qe,!1),t.removeEventListener(`webglcontextcreationerror`,Je,!1),Fe.dispose(),je.dispose(),Me.dispose(),P.dispose(),we.dispose(),Te.dispose(),Oe.dispose(),Be.dispose(),Ve.dispose(),ke.dispose(),Ge.dispose(),Ge.removeEventListener(`sessionstart`,F),Ge.removeEventListener(`sessionend`,nt),rt.stop()};function Ke(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),C=!0}function qe(){console.log(`THREE.WebGLRenderer: Context Restored.`),C=!1;let e=Se.autoReset,t=Pe.enabled,n=Pe.autoUpdate,r=Pe.needsUpdate,i=Pe.type;We(),Se.autoReset=e,Pe.enabled=t,Pe.autoUpdate=n,Pe.needsUpdate=r,Pe.type=i}function Je(e){console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Xe(e){let t=e.target;t.removeEventListener(`dispose`,Xe),Ze(t)}function Ze(e){Qe(e),P.remove(e)}function Qe(e){let t=P.get(e).programs;t!==void 0&&(t.forEach(function(e){ke.releaseProgram(e)}),e.isShaderMaterial&&ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ge);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=ft(e,t,n,r,i);N.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=De.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Be.setup(i,r,s,n,c);let h,g=Le;if(c!==null&&(h=Ee.get(c),g=Re,g.setIndex(h)),i.isMesh)r.wireframe===!0?(N.setLineWidth(r.wireframeLinewidth*ve()),g.setMode(M.LINES)):g.setMode(M.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),N.setLineWidth(e*ve()),i.isLineSegments?g.setMode(M.LINES):i.isLineLoop?g.setMode(M.LINE_LOOP):g.setMode(M.LINE_STRIP)}else i.isPoints?g.setMode(M.POINTS):i.isSprite&&g.setMode(M.TRIANGLES);if(i.isBatchedMesh){if(i._multiDrawInstances!==null)jt(`THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection.`),g.renderMultiDrawInstances(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount,i._multiDrawInstances);else if(be.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ee.get(c).bytesPerElement:1,o=P.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(M,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function $e(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,lt(e,t,n),e.side=0,e.needsUpdate=!0,lt(e,t,n),e.side=2):lt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),v=Me.get(n),v.init(t),x.push(v),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(v.pushLight(e),e.castShadow&&v.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(v.pushLight(e),e.castShadow&&v.pushShadow(e))}),v.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];$e(a,n,e),r.add(a)}else $e(t,n,e),r.add(t)}}),v=x.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){P.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}be.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let et=null;function tt(e){et&&et(e)}function F(){rt.stop()}function nt(){rt.start()}let rt=new Wo;rt.setAnimationLoop(tt),typeof self<`u`&&rt.setContext(self),this.setAnimationLoop=function(e){et=e,Ge.setAnimationLoop(e),e===null?rt.stop():rt.start()},Ge.addEventListener(`sessionstart`,F),Ge.addEventListener(`sessionend`,nt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(C===!0)return;if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ge.enabled===!0&&Ge.isPresenting===!0&&(Ge.cameraAutoUpdate===!0&&Ge.updateCamera(t),t=Ge.getCamera()),e.isScene===!0&&e.onBeforeRender(S,e,t,E),v=Me.get(e,x.length),v.init(t),x.push(v),pe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ue.setFromProjectionMatrix(pe,Ye,t.reversedDepth),fe=this.localClippingEnabled,de=Ne.init(this.clippingPlanes,fe),_=je.get(e,y.length),_.init(),y.push(_),Ge.enabled===!0&&Ge.isPresenting===!0){let e=S.xr.getDepthSensingMesh();e!==null&&it(e,t,-1/0,S.sortObjects)}it(e,t,0,S.sortObjects),_.finish(),S.sortObjects===!0&&_.sort(ae,oe),_e=Ge.enabled===!1||Ge.isPresenting===!1||Ge.hasDepthSensing()===!1,_e&&Fe.addToRenderList(_,e),this.info.render.frame++,de===!0&&Ne.beginShadows();let n=v.state.shadowsArray;Pe.render(n,e,t),de===!0&&Ne.endShadows(),this.info.autoReset===!0&&this.info.reset();let r=_.opaque,i=_.transmissive;if(v.setupLights(),t.isArrayCamera){let n=t.cameras;if(i.length>0)for(let t=0,a=n.length;t<a;t++){let a=n[t];ot(r,i,e,a)}_e&&Fe.render(e);for(let t=0,r=n.length;t<r;t++){let r=n[t];at(_,e,r,r.viewport)}}else i.length>0&&ot(r,i,e,t),_e&&Fe.render(e),at(_,e,t);E!==null&&T===0&&(Ce.updateMultisampleRenderTarget(E),Ce.updateRenderTargetMipmap(E)),e.isScene===!0&&e.onAfterRender(S,e,t),Be.resetDefaultState(),D=-1,O=null,x.pop(),x.length>0?(v=x[x.length-1],de===!0&&Ne.setGlobalState(S.clippingPlanes,v.state.camera)):v=null,y.pop(),_=y.length>0?y[y.length-1]:null};function it(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)v.pushLight(e),e.castShadow&&v.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||ue.intersectsSprite(e)){r&&he.setFromMatrixPosition(e.matrixWorld).applyMatrix4(pe);let t=Oe.update(e),i=e.material;i.visible&&_.push(e,t,i,n,he.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||ue.intersectsObject(e))){let t=Oe.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),he.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),he.copy(e.boundingSphere.center)),he.applyMatrix4(e.matrixWorld).applyMatrix4(pe)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&_.push(e,t,s,n,he.z,o)}}else i.visible&&_.push(e,t,i,n,he.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)it(i[e],t,n,r)}function at(e,t,n,r){let i=e.opaque,a=e.transmissive,o=e.transparent;v.setupLightsView(n),de===!0&&Ne.setGlobalState(S.clippingPlanes,n),r&&N.viewport(k.copy(r)),i.length>0&&st(i,t,n),a.length>0&&st(a,t,n),o.length>0&&st(o,t,n),N.buffers.depth.setTest(!0),N.buffers.depth.setMask(!0),N.buffers.color.setMask(!0),N.setPolygonOffset(!1)}function ot(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[r.id]===void 0&&(v.state.transmissionRenderTarget[r.id]=new Yt(1,1,{generateMipmaps:!0,type:be.has(`EXT_color_buffer_half_float`)||be.has(`EXT_color_buffer_float`)?b:p,minFilter:f,samples:4,stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:It.workingColorSpace}));let a=v.state.transmissionRenderTarget[r.id],o=r.viewport||k;a.setSize(o.z*S.transmissionResolutionScale,o.w*S.transmissionResolutionScale);let s=S.getRenderTarget(),c=S.getActiveCubeFace(),l=S.getActiveMipmapLevel();S.setRenderTarget(a),S.getClearColor(ne),A=S.getClearAlpha(),A<1&&S.setClearColor(16777215,.5),S.clear(),_e&&Fe.render(n);let u=S.toneMapping;S.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),v.setupLightsView(r),de===!0&&Ne.setGlobalState(S.clippingPlanes,r),st(e,n,r),Ce.updateMultisampleRenderTarget(a),Ce.updateRenderTargetMipmap(a),be.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let a=t[i],o=a.object,s=a.geometry,c=a.material,l=a.group;if(c.side===2&&o.layers.test(r.layers)){let t=c.side;c.side=1,c.needsUpdate=!0,ct(o,n,r,s,c,l),c.side=t,c.needsUpdate=!0,e=!0}}e===!0&&(Ce.updateMultisampleRenderTarget(a),Ce.updateRenderTargetMipmap(a))}S.setRenderTarget(s,c,l),S.setClearColor(ne,A),d!==void 0&&(r.viewport=d),S.toneMapping=u}function st(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=a.group,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ct(o,t,n,s,l,c)}}function ct(e,t,n,r,i,a){e.onBeforeRender(S,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(S,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,S.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,S.renderBufferDirect(n,t,r,i,e,a),i.side=2):S.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(S,t,n,r,i,a)}function lt(e,t,n){t.isScene!==!0&&(t=ge);let r=P.get(e),i=v.state.lights,a=v.state.shadowsArray,o=i.state.version,s=ke.getParameters(e,i.state,a,t,n),c=ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=(e.isMeshStandardMaterial?Te:we).get(e.envMap||r.environment),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Xe),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return dt(e,s),u}else s.uniforms=ke.getUniforms(e),e.onBeforeCompile(s,S),u=ke.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=Ne.uniform),dt(e,s),r.needsLights=mt(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotLightMatrix.value=i.state.spotLightMatrix,d.spotLightMap.value=i.state.spotLightMap,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix),r.currentProgram=u,r.uniformsList=null,u}function ut(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Ic.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function dt(e,t){let n=P.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ft(e,t,n,r,i){t.isScene!==!0&&(t=ge),Ce.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial?t.environment:null,s=E===null?S.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Ue,c=(r.isMeshStandardMaterial?Te:we).get(r.envMap||o),l=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,u=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),d=!!n.morphAttributes.position,f=!!n.morphAttributes.normal,p=!!n.morphAttributes.color,m=0;r.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(m=S.toneMapping);let h=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,g=h===void 0?0:h.length,_=P.get(r),y=v.state.lights;if(de===!0&&(fe===!0||e!==O)){let t=e===O&&r.id===D;Ne.setState(r,e,t)}let b=!1;r.version===_.__version?_.needsLights&&_.lightsStateVersion!==y.state.version?b=!0:_.outputColorSpace===s?i.isBatchedMesh&&_.batching===!1||!i.isBatchedMesh&&_.batching===!0||i.isBatchedMesh&&_.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&_.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&_.instancing===!1||!i.isInstancedMesh&&_.instancing===!0||i.isSkinnedMesh&&_.skinning===!1||!i.isSkinnedMesh&&_.skinning===!0||i.isInstancedMesh&&_.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&_.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&_.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&_.instancingMorph===!1&&i.morphTexture!==null?b=!0:_.envMap===c?r.fog===!0&&_.fog!==a||_.numClippingPlanes!==void 0&&(_.numClippingPlanes!==Ne.numPlanes||_.numIntersection!==Ne.numIntersection)?b=!0:_.vertexAlphas===l&&_.vertexTangents===u&&_.morphTargets===d&&_.morphNormals===f&&_.morphColors===p&&_.toneMapping===m?_.morphTargetsCount!==g&&(b=!0):b=!0:b=!0:b=!0:(b=!0,_.__version=r.version);let x=_.currentProgram;b===!0&&(x=lt(r,t,i));let C=!1,w=!1,T=!1,k=x.getUniforms(),ee=_.uniforms;if(N.useProgram(x.program)&&(C=!0,w=!0,T=!0),r.id!==D&&(D=r.id,w=!0),C||O!==e){N.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),k.setValue(M,`projectionMatrix`,e.projectionMatrix),k.setValue(M,`viewMatrix`,e.matrixWorldInverse);let t=k.map.cameraPosition;t!==void 0&&t.setValue(M,me.setFromMatrixPosition(e.matrixWorld)),xe.logarithmicDepthBuffer&&k.setValue(M,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&k.setValue(M,`isOrthographic`,e.isOrthographicCamera===!0),O!==e&&(O=e,w=!0,T=!0)}if(i.isSkinnedMesh){k.setOptional(M,i,`bindMatrix`),k.setOptional(M,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),k.setValue(M,`boneTexture`,e.boneTexture,Ce))}i.isBatchedMesh&&(k.setOptional(M,i,`batchingTexture`),k.setValue(M,`batchingTexture`,i._matricesTexture,Ce),k.setOptional(M,i,`batchingIdTexture`),k.setValue(M,`batchingIdTexture`,i._indirectTexture,Ce),k.setOptional(M,i,`batchingColorTexture`),i._colorsTexture!==null&&k.setValue(M,`batchingColorTexture`,i._colorsTexture,Ce));let te=n.morphAttributes;if((te.position!==void 0||te.normal!==void 0||te.color!==void 0)&&Ie.update(i,n,x),(w||_.receiveShadow!==i.receiveShadow)&&(_.receiveShadow=i.receiveShadow,k.setValue(M,`receiveShadow`,i.receiveShadow)),r.isMeshGouraudMaterial&&r.envMap!==null&&(ee.envMap.value=c,ee.flipEnvMap.value=c.isCubeTexture&&c.isRenderTargetTexture===!1?-1:1),r.isMeshStandardMaterial&&r.envMap===null&&t.environment!==null&&(ee.envMapIntensity.value=t.environmentIntensity),w&&(k.setValue(M,`toneMappingExposure`,S.toneMappingExposure),_.needsLights&&pt(ee,T),a&&r.fog===!0&&Ae.refreshFogUniforms(ee,a),Ae.refreshMaterialUniforms(ee,r,j,ie,v.state.transmissionRenderTarget[e.id]),Ic.upload(M,ut(_),ee,Ce)),r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Ic.upload(M,ut(_),ee,Ce),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&k.setValue(M,`center`,i.center),k.setValue(M,`modelViewMatrix`,i.modelViewMatrix),k.setValue(M,`normalMatrix`,i.normalMatrix),k.setValue(M,`modelMatrix`,i.matrixWorld),r.isShaderMaterial||r.isRawShaderMaterial){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ve.update(n,x),Ve.bind(n,x)}}return x}function pt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function mt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(e,t,n){let r=P.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),P.get(e.texture).__webglTexture=t,P.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=P.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let ht=M.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){E=e,w=t,T=n;let r=!0,i=null,a=!1,o=!1;if(e){let s=P.get(e);if(s.__useDefaultFramebuffer!==void 0)N.bindFramebuffer(M.FRAMEBUFFER,null),r=!1;else if(s.__webglFramebuffer===void 0)Ce.setupRenderTarget(e);else if(s.__hasExternalTextures)Ce.rebindTextures(e,P.get(e.texture).__webglTexture,P.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(s.__boundDepthTexture!==t){if(t!==null&&P.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);Ce.setupDepthRenderbuffer(e)}}let c=e.texture;(c.isData3DTexture||c.isDataArrayTexture||c.isCompressedArrayTexture)&&(o=!0);let l=P.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(i=Array.isArray(l[t])?l[t][n]:l[t],a=!0):i=e.samples>0&&Ce.useMultisampledRTT(e)===!1?P.get(e).__webglMultisampledFramebuffer:Array.isArray(l)?l[n]:l,k.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest}else k.copy(se).multiplyScalar(j).floor(),ee.copy(ce).multiplyScalar(j).floor(),te=le;if(n!==0&&(i=ht),N.bindFramebuffer(M.FRAMEBUFFER,i)&&r&&N.drawBuffers(e,i),N.viewport(k),N.scissor(ee),N.setScissorTest(te),a){let r=P.get(e.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(o){let r=t;for(let t=0;t<e.textures.length;t++){let i=P.get(e.textures[t]);M.framebufferTextureLayer(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=P.get(e.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,t.__webglTexture,n)}D=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=P.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){N.bindFramebuffer(M.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(!xe.textureFormatReadable(c)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!xe.textureTypeReadable(l)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&(e.textures.length>1&&M.readBuffer(M.COLOR_ATTACHMENT0+s),M.readPixels(t,n,r,i,ze.convert(c),ze.convert(l),a))}finally{let e=E===null?null:P.get(E).__webglFramebuffer;N.bindFramebuffer(M.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=P.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){N.bindFramebuffer(M.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(!xe.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!xe.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=M.createBuffer();M.bindBuffer(M.PIXEL_PACK_BUFFER,d),M.bufferData(M.PIXEL_PACK_BUFFER,a.byteLength,M.STREAM_READ),e.textures.length>1&&M.readBuffer(M.COLOR_ATTACHMENT0+s),M.readPixels(t,n,r,i,ze.convert(l),ze.convert(u),0);let f=E===null?null:P.get(E).__webglFramebuffer;N.bindFramebuffer(M.FRAMEBUFFER,f);let p=M.fenceSync(M.SYNC_GPU_COMMANDS_COMPLETE,0);return M.flush(),await Mt(M,p,4),M.bindBuffer(M.PIXEL_PACK_BUFFER,d),M.getBufferSubData(M.PIXEL_PACK_BUFFER,0,a),M.deleteBuffer(d),M.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Ce.setTexture2D(e,0),M.copyTexSubImage2D(M.TEXTURE_2D,n,0,0,o,s,i,a),N.unbindTexture()};let gt=M.createFramebuffer(),_t=M.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=null){a===null&&(i===0?a=0:(jt(`WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels.`),a=i,i=0));let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=ze.convert(t.format),_=ze.convert(t.type),v;t.isData3DTexture?(Ce.setTexture3D(t,0),v=M.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Ce.setTexture2DArray(t,0),v=M.TEXTURE_2D_ARRAY):(Ce.setTexture2D(t,0),v=M.TEXTURE_2D),M.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,t.flipY),M.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),M.pixelStorei(M.UNPACK_ALIGNMENT,t.unpackAlignment);let y=M.getParameter(M.UNPACK_ROW_LENGTH),b=M.getParameter(M.UNPACK_IMAGE_HEIGHT),x=M.getParameter(M.UNPACK_SKIP_PIXELS),S=M.getParameter(M.UNPACK_SKIP_ROWS),C=M.getParameter(M.UNPACK_SKIP_IMAGES);M.pixelStorei(M.UNPACK_ROW_LENGTH,h.width),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,h.height),M.pixelStorei(M.UNPACK_SKIP_PIXELS,l),M.pixelStorei(M.UNPACK_SKIP_ROWS,u),M.pixelStorei(M.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=P.get(e),r=P.get(t),h=P.get(n.__renderTarget),g=P.get(r.__renderTarget);N.bindFramebuffer(M.READ_FRAMEBUFFER,h.__webglFramebuffer),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(M.framebufferTextureLayer(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,P.get(e).__webglTexture,i,d+n),M.framebufferTextureLayer(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,P.get(t).__webglTexture,a,m+n)),M.blitFramebuffer(l,u,o,s,f,p,o,s,M.DEPTH_BUFFER_BIT,M.NEAREST);N.bindFramebuffer(M.READ_FRAMEBUFFER,null),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||P.has(e)){let n=P.get(e),r=P.get(t);N.bindFramebuffer(M.READ_FRAMEBUFFER,gt),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,_t);for(let e=0;e<c;e++)w?M.framebufferTextureLayer(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):M.framebufferTexture2D(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,n.__webglTexture,i),T?M.framebufferTextureLayer(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):M.framebufferTexture2D(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,r.__webglTexture,a),i===0?T?M.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):M.copyTexSubImage2D(v,a,f,p,l,u,o,s):M.blitFramebuffer(l,u,o,s,f,p,o,s,M.COLOR_BUFFER_BIT,M.NEAREST);N.bindFramebuffer(M.READ_FRAMEBUFFER,null),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?M.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?M.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):M.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?M.texSubImage2D(M.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?M.compressedTexSubImage2D(M.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):M.texSubImage2D(M.TEXTURE_2D,a,f,p,o,s,g,_,h);M.pixelStorei(M.UNPACK_ROW_LENGTH,y),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,b),M.pixelStorei(M.UNPACK_SKIP_PIXELS,x),M.pixelStorei(M.UNPACK_SKIP_ROWS,S),M.pixelStorei(M.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&M.generateMipmap(v),N.unbindTexture()},this.initRenderTarget=function(e){P.get(e).__webglFramebuffer===void 0&&Ce.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Ce.setTextureCube(e,0):e.isData3DTexture?Ce.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Ce.setTexture2DArray(e,0):Ce.setTexture2D(e,0),N.unbindTexture()},this.resetState=function(){w=0,T=0,E=null,N.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ye}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=It._getDrawingBufferColorSpace(e),t.unpackColorSpace=It._getUnpackColorSpace()}},Kl=`
#ifdef USE_SKINNING
  vec4 auraQuat(mat3 m) {
    float t = m[0][0] + m[1][1] + m[2][2];
    if (t > 0.0) { float s = sqrt(t + 1.0) * 2.0; return vec4((m[1][2] - m[2][1]) / s, (m[2][0] - m[0][2]) / s, (m[0][1] - m[1][0]) / s, 0.25 * s); }
    if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) { float s = sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]) * 2.0; return vec4(0.25 * s, (m[1][0] + m[0][1]) / s, (m[2][0] + m[0][2]) / s, (m[1][2] - m[2][1]) / s); }
    if (m[1][1] > m[2][2]) { float s = sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]) * 2.0; return vec4((m[1][0] + m[0][1]) / s, 0.25 * s, (m[2][1] + m[1][2]) / s, (m[2][0] - m[0][2]) / s); }
    float s = sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]) * 2.0;
    return vec4((m[2][0] + m[0][2]) / s, (m[2][1] + m[1][2]) / s, 0.25 * s, (m[0][1] - m[1][0]) / s);
  }
  vec4 auraMul(vec4 a, vec4 b) { return vec4(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz)); }
  // One bone's movement, as a turn and (in the second half) where it carries things to.
  void auraDual(mat4 m, float w, vec4 like, inout vec4 turn, inout vec4 carry, inout float size) {
    if (w <= 0.0) return;
    float s = length(m[0].xyz);
    vec4 q = auraQuat(mat3(m[0].xyz / s, m[1].xyz / s, m[2].xyz / s));
    // The same turn can be written two ways; take the one on the side of the first bone, or the blend goes the long way round.
    if (dot(q, like) < 0.0) q = -q;
    turn += w * q;
    carry += w * 0.5 * auraMul(vec4(m[3].xyz, 0.0), q);
    size += w * s;
  }
  mat4 auraBlend(mat4 a, mat4 b, mat4 c, mat4 d, vec4 w) {
    float sa = length(a[0].xyz);
    vec4 like = auraQuat(mat3(a[0].xyz / sa, a[1].xyz / sa, a[2].xyz / sa));
    vec4 turn = vec4(0.0), carry = vec4(0.0);
    float size = 0.0;
    auraDual(a, w.x, like, turn, carry, size);
    auraDual(b, w.y, like, turn, carry, size);
    auraDual(c, w.z, like, turn, carry, size);
    auraDual(d, w.w, like, turn, carry, size);
    float n = length(turn);
    if (n < 1e-6) return a;
    turn /= n; carry /= n;
    float total = w.x + w.y + w.z + w.w;
    size /= max(total, 1e-6);
    float x = turn.x, y = turn.y, z = turn.z, r = turn.w;
    vec3 at = 2.0 * auraMul(carry, vec4(-turn.xyz, turn.w)).xyz;
    return mat4(
      vec4(1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + z * r), 2.0 * (x * z - y * r), 0.0) * size,
      vec4(2.0 * (x * y - z * r), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + x * r), 0.0) * size,
      vec4(2.0 * (x * z + y * r), 2.0 * (y * z - x * r), 1.0 - 2.0 * (x * x + y * y), 0.0) * size,
      vec4(at, 1.0));
  }
#endif
`,ql=`
#ifdef USE_SKINNING
  {
    mat4 auraSkin = auraBlend(boneMatX, boneMatY, boneMatZ, boneMatW, skinWeight);
    boneMatX = auraSkin; boneMatY = auraSkin; boneMatZ = auraSkin; boneMatW = auraSkin;
  }
#endif
`,Jl=e=>e.replace(`#include <skinning_pars_vertex>`,`#include <skinning_pars_vertex>\n${Kl}`).replace(`#include <skinbase_vertex>`,`#include <skinbase_vertex>\n${ql}`),Yl=[`none`,`galaxy`,`bolt`,`sun`,`aurora`,`pillar`,`wheel`,`eclipse`,`nimbus`,`sphere`,`pulse`,`ripple`,`steam`,`strike`,`blaze`],Xl={breath:.22,flow:1,body:.7,shell:{level:1,from:.03,reach:1,flame:.25},halo:{level:1,from:.05,size:1},rays:{level:.6,from:.55,count:9,sharp:3},ribbons:{level:1,from:.2,count:9,turns:.75,spread:1,width:.15,speed:1,ripple:.5},motes:{level:1,from:.08,count:150,rise:.22,size:1,swirl:1,twinkle:.5},streams:{level:.8,from:.4,count:16,height:1},rings:{level:1,from:.25,dashes:36,spin:.25},sparks:{level:1,from:.7,count:90,speed:1,crackle:0},arcs:{level:0,from:1,count:0},act:{sign:`none`,manner:0,with:[`rays`,`motes`,`rings`,`sparks`]}};function Zl(e,t,n,r,i={}){let a={id:e,name:t,blurb:n,palette:r,...structuredClone(Xl)};for(let[e,t]of Object.entries(i)){let n=e;t&&typeof t==`object`?Object.assign(a[n],structuredClone(t)):a[n]=t}return a}var Ql=[Zl(`cosmic`,`Cosmic`,`Flowing violet, blue, pink and orange. Expansive and atmospheric.`,[`#9a6bff`,`#3f9dff`,`#ff5fcf`,`#ff9a45`,`#6a5cff`],{act:{sign:`galaxy`,manner:0,with:[`motes`]}}),Zl(`electric`,`Electric`,`Sharp arcs, sparks and fast pulses.`,[`#c9f6ff`,`#49c6ff`,`#6f7dff`,`#ffffff`],{act:{sign:`bolt`,manner:0,with:[`arcs`,`sparks`,`rings`]},breath:.55,flow:2.2,body:.85,shell:{level:1,reach:.7,flame:.05},halo:{level:.55,size:.8},rays:{level:.35,from:.7,count:14,sharp:7},ribbons:{level:.7,count:5,turns:1.7,width:.028,speed:2.6,spread:.8,ripple:1.6},motes:{level:.6,count:90,rise:.6,size:.55,swirl:2.4,twinkle:1},streams:{level:.4,count:10,height:.7},rings:{dashes:64,spin:1.4},sparks:{count:130,speed:1.6,crackle:1},arcs:{level:1,from:.12,count:8}}),Zl(`solar`,`Solar`,`Warm gold and orange. Radiant, bright, powerful.`,[`#ffd66b`,`#ff9b2f`,`#fff1c2`,`#ff6a21`],{act:{sign:`sun`,manner:0,with:[`rays`,`motes`]},breath:.18,flow:.85,body:.9,shell:{level:1,reach:1.5,flame:.75},halo:{level:1.25,size:1.2},rays:{level:1.15,from:.18,count:12,sharp:2.2},ribbons:{level:.5,count:4,turns:.45,width:.16,speed:.6,ripple:.3},motes:{level:1,count:170,rise:.5,size:.9,swirl:.4,twinkle:.9},streams:{level:.5,count:10},rings:{dashes:0,spin:.1}}),Zl(`ethereal`,`Ethereal`,`Soft flowing light and slow, elegant particles.`,[`#c8f4ec`,`#d9c9ff`,`#ffffff`,`#93d6ff`],{act:{sign:`aurora`,manner:0,with:[`motes`]},breath:.12,flow:.4,body:.5,shell:{level:.7,reach:1.2,flame:.1},halo:{level:.9,size:1.25},rays:{level:0,from:1},ribbons:{level:.75,count:5,turns:.5,width:.22,speed:.4,spread:1.15,ripple:.25},motes:{level:1.1,count:240,rise:.1,size:1.25,swirl:.5,twinkle:.7},streams:{level:0,from:1},rings:{level:.5,dashes:0,spin:.05},sparks:{level:.35,count:50,speed:.5}}),Zl(`primal`,`Primal`,`Raw, organic energy with heavy pulses.`,[`#ff3d4f`,`#ff7b2b`,`#b5122f`,`#ffc56c`],{act:{sign:`pillar`,manner:1,with:[`streams`,`sparks`,`rings`]},breath:.32,flow:1.4,body:.8,shell:{level:1.3,reach:2.1,flame:1},halo:{level:1,size:.95},rays:{level:0,from:1},ribbons:{level:.75,count:7,turns:.6,width:.07,speed:1.6,spread:.85,ripple:1.4},motes:{level:1,count:160,rise:.65,size:.8,swirl:.6,twinkle:1},streams:{level:1.1,count:22,height:1.3},rings:{level:1.2,dashes:0,spin:.2},sparks:{count:120,speed:1.2,crackle:.25}}),Zl(`signature`,`Signature`,`Aura's own six colours, one for each discipline.`,[`#f2c46b`,`#78aeff`,`#ff8463`,`#b79dff`,`#b5db68`,`#56d6bc`],{act:{sign:`wheel`,manner:0,with:[`motes`,`rings`]},body:.6,ribbons:{count:6,turns:.9,width:.085},rays:{level:.4},rings:{dashes:6,spin:.35}}),Zl(`lunar`,`Lunar`,`Silver and white: a quiet, precise light.`,[`#ffffff`,`#cfd8ec`,`#8f9ab5`,`#e9eeff`],{act:{sign:`eclipse`,manner:0,with:[`motes`,`rings`]},breath:.16,flow:.7,body:.65,shell:{level:1.1,reach:.6,flame:0},halo:{level:.6,size:.9},rays:{level:.3,from:.7,count:16,sharp:8},ribbons:{level:.7,count:6,turns:1.1,width:.022,speed:.8,ripple:.2},motes:{level:.9,count:200,rise:.12,size:.5,swirl:.8,twinkle:.9},streams:{level:.3,count:8},rings:{dashes:90,spin:.15},sparks:{count:60,speed:.8}}),{...Zl(`ignition`,`Ignition`,`Gold fire, close to the body.`,[`#ffd23a`,`#ff9a1f`,`#fff0a8`,`#ff5a1f`],{act:{sign:`blaze`,manner:0,with:[`arcs`,`streams`,`sparks`,`rings`]},breath:.4,flow:1.6,body:.7,shell:{level:1.2,reach:1.1,flame:1},halo:{level:.7,size:.9},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:.8,count:120,rise:.8,size:.7,swirl:.3,twinkle:1},streams:{level:1,from:.15,count:18,height:1.1},rings:{level:.8,dashes:0,spin:.2},sparks:{count:130,speed:1.6,crackle:.6},arcs:{level:1,from:.1,count:9}}),universe:`power`},{...Zl(`awakened`,`Awakened`,`Jade fire that climbs well above the head.`,[`#7dffcf`,`#1fe0a0`,`#eafff6`,`#16b3d6`],{act:{sign:`nimbus`,manner:0,with:[`streams`,`motes`]},breath:.42,flow:1.8,body:.8,shell:{level:1.3,reach:1.3,flame:1},halo:{level:.8,size:1},rays:{level:.5,from:.5,count:10,sharp:4},ribbons:{level:0,from:1},motes:{level:.9,count:150,rise:.9,size:.7,swirl:.3,twinkle:1},streams:{level:1.2,from:.1,count:24,height:1.5},rings:{level:1,dashes:0,spin:.25},sparks:{count:110,speed:1.4}}),universe:`power`},{...Zl(`ascended`,`Ascended`,`Violet and magenta, with the first lightning.`,[`#d07bff`,`#8a4dff`,`#ff6be6`,`#f3e1ff`],{act:{sign:`sphere`,manner:0,with:[`arcs`,`sparks`]},breath:.46,flow:2,body:.85,shell:{level:1.3,reach:1.4,flame:1},halo:{level:.9,size:1.05},rays:{level:.4,from:.6,count:12,sharp:5},ribbons:{level:.5,count:4,turns:1.2,width:.05,speed:2.2,ripple:1.4},motes:{level:.9,count:150,rise:.9,size:.7,swirl:.6,twinkle:1},streams:{level:1.1,from:.1,count:22,height:1.5},rings:{level:1,dashes:24,spin:.8},sparks:{count:120,speed:1.5,crackle:.5},arcs:{level:.6,from:.3,count:5}}),universe:`power`},{...Zl(`overdrive`,`Overdrive`,`Crimson fire and white lightning, at full speed.`,[`#ff3355`,`#ff8a5c`,`#ffffff`,`#ff2bd6`],{act:{sign:`pulse`,manner:0,with:[`arcs`,`sparks`,`streams`]},breath:.6,flow:2.4,body:.9,shell:{level:1.4,reach:1.5,flame:1},halo:{level:.9,size:1.05},rays:{level:.5,from:.5,count:14,sharp:6},ribbons:{level:.4,count:4,turns:1.6,width:.03,speed:2.8,ripple:1.8},motes:{level:.9,count:150,rise:1,size:.65,swirl:1.2,twinkle:1},streams:{level:1.2,from:.1,count:26,height:1.6},rings:{level:1.1,dashes:48,spin:1.6},sparks:{count:140,speed:1.8,crackle:1},arcs:{level:1,from:.1,count:10}}),universe:`power`},{...Zl(`transcendent`,`Transcendent`,`Silver and blue-white, and quiet: power that no longer needs to shout.`,[`#dfe8ff`,`#8fb0ff`,`#ffffff`,`#5f86ea`,`#c3cfe8`],{act:{sign:`ripple`,manner:0,with:[`motes`]},breath:.14,flow:.8,body:1,shell:{level:1.2,reach:1.2,flame:.5},halo:{level:1.4,size:1.4},rays:{level:1.2,from:.15,count:16,sharp:3},ribbons:{level:.7,count:5,turns:.6,width:.12,speed:.6,ripple:.3},motes:{level:1.1,count:260,rise:.2,size:1,swirl:.5,twinkle:.8},streams:{level:.8,count:18,height:1.3},rings:{level:1,dashes:48,spin:.2},sparks:{count:90,speed:.8}}),universe:`power`},{...Zl(`zeno`,`Zeno`,`A galaxy in the shape of a body: violet cloud, stars, and a white edge.`,[`#efe6ff`,`#7a4dff`,`#ffffff`,`#ff6fd0`,`#5f8cff`],{act:{sign:`galaxy`,manner:1,with:[`motes`]},breath:.1,flow:.6,body:.3,shell:{level:.55,reach:1.5,flame:.15},halo:{level:.8,size:1.5},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:1.6,count:260,rise:.12,size:1.25,swirl:.35,twinkle:1.6},streams:{level:0,from:1},rings:{level:.7,dashes:64,spin:.1},sparks:{count:60,speed:.4}}),universe:`power`,cosmos:1},{...Zl(`pressure`,`Pressure`,`Heat coming off a body at work. Pale steam, close to the skin.`,[`#e9e2d6`,`#b8ada0`,`#8a8078`,`#ffffff`],{act:{sign:`steam`,manner:0,with:[`streams`]},breath:.26,flow:.9,body:.35,shell:{level:.8,reach:.5,flame:.35},halo:{level:.25,size:.7},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:.4,count:60,rise:.5,size:.6,swirl:.2,twinkle:.2},streams:{level:1,from:.1,count:14,height:1.2},rings:{level:.6,dashes:0,spin:0},sparks:{level:0,from:1}}),universe:`iron`},{...Zl(`tempered`,`Tempered`,`Ember red under the skin. The floor answers each rep.`,[`#ff5a3c`,`#c2281c`,`#ffb08a`,`#7a1410`],{act:{sign:`steam`,manner:1,with:[`rings`,`sparks`]},breath:.28,flow:1,body:.5,shell:{level:.9,reach:.8,flame:.6},halo:{level:.3,size:.75},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:.5,count:70,rise:.6,size:.6,swirl:.2,twinkle:.4},streams:{level:1.1,from:.1,count:16,height:1.2},rings:{level:1,dashes:0,spin:0},sparks:{level:.5,count:50,speed:1}}),universe:`iron`},{...Zl(`forged`,`Forged`,`Molten orange and flying sparks.`,[`#ff8a2b`,`#ff3d1f`,`#ffd9a0`,`#a31a0c`],{act:{sign:`strike`,manner:0,with:[`sparks`,`rings`]},breath:.3,flow:1.2,body:.6,shell:{level:1,reach:1.1,flame:.8},halo:{level:.35,size:.8},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:.7,count:100,rise:.9,size:.55,swirl:.3,twinkle:.8},streams:{level:1.1,from:.1,count:18,height:1.3},rings:{level:1.1,dashes:0,spin:0},sparks:{level:1,from:.3,count:110,speed:1.4,crackle:.2}}),universe:`iron`},{...Zl(`unbroken`,`Unbroken`,`White-hot and still. A hard edge of light.`,[`#ffffff`,`#ffe9dc`,`#ff6b4a`,`#c9c2ba`],{act:{sign:`ripple`,manner:1,with:[`rings`]},breath:.2,flow:.8,body:.75,shell:{level:1.3,reach:.7,flame:.2},halo:{level:.4,size:.8},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:.5,count:80,rise:.4,size:.5,swirl:.2,twinkle:.5},streams:{level:.9,from:.1,count:14,height:1.1},rings:{level:1.3,dashes:0,spin:0},sparks:{level:.6,count:60,speed:1}}),universe:`iron`},{...Zl(`apex`,`Apex`,`Red and white, in heavy beats. Nothing held back.`,[`#ff1f2e`,`#ffffff`,`#8f0a14`,`#ff7a66`],{act:{sign:`pulse`,manner:1,with:[`streams`,`sparks`,`rings`]},breath:.34,flow:1.5,body:.8,shell:{level:1.4,reach:1.5,flame:1},halo:{level:.45,size:.85},rays:{level:0,from:1},ribbons:{level:0,from:1},motes:{level:.7,count:110,rise:.9,size:.6,swirl:.3,twinkle:.8},streams:{level:1.2,from:.1,count:24,height:1.4},rings:{level:1.4,dashes:0,spin:0},sparks:{level:1,from:.3,count:120,speed:1.4,crackle:.3},arcs:{level:.4,from:.6,count:3}}),universe:`iron`}],$l=Object.fromEntries(Ql.map(e=>[e.id,e])),eu=`
uniform vec3 uPal[6];
uniform float uPalN, uTime, uIntensity, uPulse, uBurst, uSurge, uBase, uFloor, uPaint;
uniform vec3 uSize;
vec3 pal(float x) {
  float f = fract(x) * uPalN;
  int i = int(floor(f));
  int j = int(mod(float(i + 1), uPalN));
  return mix(uPal[i], uPal[j], smoothstep(0.0, 1.0, fract(f)));
}
float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
`;function tu(e,t,n,r,i={}){let a={...e};for(let[e,n]of Object.entries(t))a[e]={value:n};let o=`${r.replace(`void main()`,`void lit()`)}
    void main() {
      lit();
      if (uPaint > 0.5) {
        vec3 c = gl_FragColor.rgb;
        float pale = min(c.r, min(c.g, c.b));
        // What was a white-hot core has no white to be on paper: it takes the colour, deepened.
        c = mix(c, c * c * 0.9, 0.55) * (1.0 - 0.35 * pale);
        gl_FragColor = vec4(c, min(1.0, gl_FragColor.a * 1.1));
      }
    }`;return new ii({uniforms:a,vertexShader:`${eu}\n${n}`,fragmentShader:`${eu}\n${o}`,transparent:!0,depthWrite:!1,blending:2,side:2,...i})}var nu=(e,t)=>{let n=new Float32Array(e*t);for(let e=0;e<n.length;e++)n[e]=Math.random();return n},ru=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)},iu=1.2,au=[`rays`,`ribbons`,`motes`,`streams`,`rings`,`arcs`,`sparks`],ou=2.8,su=.75,cu=12,lu=56,uu=260,du=140,fu=4,pu=24,mu=10,hu=14,gu=class{group=new hi;world=new hi;actor;shared;parts={};waves=[-99,-99,-99,-99];theme;tuning={};time=0;clock=0;level=0;pulse=0;burstAge=99;chargeAge=-1;arcClock=0;centre=new L;size=new L(.45,1.9,.45);heading=0;base=0;measured=!1;shells=[];sign;arcs;constructor(e){this.actor=e;let t=this.shared={uPal:{value:Array.from({length:6},()=>new B(1,1,1))},uPalN:{value:4},uTime:{value:0},uIntensity:{value:0},uPulse:{value:0},uBurst:{value:99},uSurge:{value:0},uBase:{value:0},uFloor:{value:.004},uSize:{value:this.size},uPaint:{value:0}},n=(e,...t)=>{let n={value:0};for(let e of t)e.material.uniforms.uGain=n,e.frustumCulled=!1,e.visible=!1;this.parts[e]={objects:t,gain:n}},r=e=>tu(t,{uReach:.01,uFlame:0,uPower:e?2.2:1.4,uInner:+!!e},`
      #include <common>
      #include <skinning_pars_vertex>
      ${Kl}
      uniform float uReach, uFlame, uInner;
      varying float vEdge, vY, vLick;
      void main() {
        vec3 objectNormal = normal;
        #include <skinbase_vertex>
        ${ql}
        #include <skinnormal_vertex>
        vec3 transformed = position;
        #include <skinning_vertex>
        vec3 n = normalize(objectNormal);
        vec4 w = modelMatrix * vec4(transformed, 1.0);
        float lick = noise(vec3(w.xz * 6.0, w.y * 3.4 - uTime * 1.9));
        float reach = uReach * mix(2.6, 1.0, uInner) * (1.0 + uFlame * (lick * 2.6 - 0.6) * (1.0 - uInner));
        transformed += n * reach + vec3(0.0, uFlame * uReach * lick * 2.2 * (1.0 - uInner), 0.0);
        vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
        vEdge = 1.0 - abs(dot(normalize(normalMatrix * n), normalize(-mv.xyz)));
        vY = w.y; vLick = lick;
        gl_Position = projectionMatrix * mv;
      }`,`
      uniform float uGain, uPower, uFlame, uInner;
      varying float vEdge, vY, vLick;
      void main() {
        float a = pow(vEdge, uPower) * uGain * mix(0.55 + 0.75 * mix(1.0, vLick, uFlame), 1.0, uInner);
        vec3 c = mix(pal(vY * 0.3 + uTime * 0.04 + vLick * 0.25), uPal[0], uInner * 0.6);
        gl_FragColor = vec4(c, a);
      }`),i=[];for(let t of e.meshes)for(let e of[!0,!1]){let n=new ji(t.geometry,r(e));n.bind(t.skeleton,t.bindMatrix),t.parent.add(n),this.shells.push(n),i.push(n)}n(`shell`,...i);let a=(e,n)=>new qr(new Ea(1,1),tu(t,n,`varying vec2 vP; void main() { vP = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,e)),o=a(`
      uniform float uGain; varying vec2 vP;
      void main() {
        float r = length(vP * vec2(1.0, 0.86));
        float n = noise(vec3(vP * 2.4 + vec2(0.0, -uTime * 0.32), uTime * 0.11));
        float a = exp(-r * r * 4.2) * (0.5 + 0.7 * n) * uGain * (0.75 + 0.25 * uPulse) * smoothstep(1.0, 0.72, max(abs(vP.x), abs(vP.y)));
        gl_FragColor = vec4(mix(uPal[0], pal(0.28 + 0.3 * n + r * 0.3), smoothstep(0.05, 0.75, r)), a * 0.42);
      }`,{}),s=a(`
      uniform float uGain, uCount, uSharp; varying vec2 vP;
      void main() {
        float r = length(vP), ang = atan(vP.y, vP.x);
        float ray = pow(0.5 + 0.5 * sin(ang * uCount + uTime * 0.22) * sin(ang * (uCount * 0.618 + 2.0) - uTime * 0.16 + 1.3), uSharp);
        float fall = exp(-r * (3.8 - 2.0 * uSurge)) * smoothstep(0.03, 0.22, r) * smoothstep(1.0, 0.7, r);
        gl_FragColor = vec4(mix(pal(ang * 0.159 + 0.1), vec3(1.0), 0.35), ray * fall * uGain * 0.9);
      }`,{uCount:9,uSharp:3});o.renderOrder=-3,s.renderOrder=-3,n(`halo`,o),n(`rays`,s),this.world.add(o,s);let c=a(`
      uniform float uGain, uKind, uManner; varying vec2 vP;
      float band(float r, float R, float w) { float d = (r - R) / w; return exp(-d * d); }
      void main() {
        if (uKind < 0.5) discard;
        vec2 q = vP * 1.6;
        float b = uBurst;
        float inn = smoothstep(0.0, 0.12, b);
        float fade = 1.0 - smoothstep(1.5, 2.7, b);
        float grow = 1.0 - exp(-b * 2.4);
        float r = length(q), ang = atan(q.y, q.x);
        vec3 col = vec3(1.0); float a = 0.0;

        if (uKind < 1.5) {
          // Galaxy: a spiral disc seen at a slant opens behind the body, and its stars come out. (Manner 1: wider, slower, more stars.)
          vec2 g = vec2(q.x, (q.y - 0.05) * mix(2.1, 1.7, uManner));
          float gr = length(g) / ((0.4 + 0.8 * grow) * mix(1.0, 1.3, uManner)), ga = atan(g.y, g.x);
          float arms = pow(0.5 + 0.5 * cos(2.0 * (ga + log(gr + 0.06) * 2.6) - uTime * 0.9 - b * 2.0), 2.5);
          float dust = 0.55 + 0.45 * noise(vec3(g * 6.0, uTime * 0.2));
          float disc = exp(-gr * gr * 2.6) * arms * dust;
          float core = exp(-gr * gr * 26.0);
          float cells = mix(40.0, 54.0, uManner);
          float h = hash(vec3(floor(q * cells), 7.0));
          float star = step(mix(0.975, 0.955, uManner), h) * (0.5 + 0.5 * sin(uTime * (2.0 + 6.0 * h) + h * 90.0)) * smoothstep(0.4, 0.0, length(fract(q * cells) - 0.5)) * exp(-gr * 0.8);
          col = mix(pal(gr * 0.5 + ga * 0.159), vec3(1.0), min(1.0, core * 0.8 + star));
          a = (disc * 1.5 + core * 0.9 + star) * inn * fade;
        } else if (uKind < 2.5) {
          // Bolt: the body is where the lightning comes from. Forked arcs leap out of the chest in every direction, never the same twice, with a flash.
          vec2 d2 = q - vec2(0.0, 0.1);
          float er = length(d2), eth = atan(d2.y, d2.x);
          float flick = floor(b * 13.0);
          float sum = 0.0;
          for (int i = 0; i < 8; i++) {
            float fi = float(i);
            float seed = fi * 5.17 + flick * 2.3;
            float h1 = hash(vec3(seed, 1.0, 2.0)), h2 = hash(vec3(seed, 4.0, 9.0));
            float reach = (0.5 + 0.85 * h2) * (0.55 + 0.45 * grow);
            // Each arc wanders off its line more the further out it gets, in large kinks and small ones.
            float wander = ((noise(vec3(er * 4.5, seed, 0.0)) - 0.5) * 1.1 + (noise(vec3(er * 15.0, seed, 3.0)) - 0.5) * 0.3) * smoothstep(0.0, 0.35, er);
            float at = (fi + h1) / 8.0 * 6.2832 + wander;
            float da = abs(mod(eth - at + 3.1416, 6.2832) - 3.1416);
            float d = da * er;
            float taper = smoothstep(reach, reach * 0.55, er) * smoothstep(0.03, 0.12, er);
            sum += step(0.22, h1) * (0.0075 / (d + 0.005)) * exp(-d * 6.0) * taper;
            // A fork leaves it part of the way out.
            float fat = at + (h2 - 0.5) * 1.3 * smoothstep(reach * 0.4, reach, er);
            float fd = abs(mod(eth - fat + 3.1416, 6.2832) - 3.1416) * er;
            sum += step(0.5, h2) * (0.0035 / (fd + 0.004)) * exp(-fd * 9.0) * taper * smoothstep(reach * 0.4, reach * 0.5, er);
          }
          float flash = exp(-b * 7.0) * exp(-er * er * 2.4);
          float charge = exp(-er * er * 9.0) * 0.25 * (0.6 + 0.4 * sin(uTime * 40.0));
          col = mix(uPal[1], vec3(1.0), 0.72);
          a = (min(sum, 2.5) * 0.9 * (1.0 - smoothstep(1.2, 1.9, b)) + flash + charge * fade) * inn;
        } else if (uKind < 3.5) {
          // Sun: it rises behind the shoulders, a bright disc with a turning corona, and the body stands against it.
          vec2 d2 = q - vec2(0.0, mix(-0.3, 0.2, grow));
          float R = 0.46, sr = length(d2), sa = atan(d2.y, d2.x);
          float disc = smoothstep(R + 0.012, R - 0.012, sr);
          float limb = 0.5 + 0.5 * sqrt(max(0.0, 1.0 - (sr / R) * (sr / R)));
          float boil = 0.8 + 0.2 * noise(vec3(d2 * 9.0, uTime * 0.6));
          float beams = pow(0.5 + 0.5 * sin(sa * 12.0 + uTime * 0.35) * sin(sa * 7.0 - uTime * 0.22 + 1.0), 2.0);
          float corona = step(R, sr) * exp(-(sr - R) * (5.5 - 3.0 * beams)) * (0.4 + 0.6 * beams);
          col = mix(uPal[1], uPal[2], disc * limb);
          a = (disc * limb * boil * 0.8 + corona * 0.85) * inn * fade;
        } else if (uKind < 4.5) {
          // Aurora: curtains of light hang in an arch behind the shoulders, like wings, and sway.
          float arch = q.y + 0.22 * q.x * q.x;
          float sway = q.x * 2.2 + 0.35 * sin(q.y * 2.4 + uTime * 0.7) + uTime * 0.12;
          float fold = noise(vec3(sway * 1.3, uTime * 0.18, 0.0));
          float streak = 0.5 + 0.5 * noise(vec3(sway * 9.0, q.y * 0.6, uTime * 0.3));
          float top = 0.5 + 0.9 * fold * grow;
          float curtain = smoothstep(-0.3, 0.35, arch) * smoothstep(top, top - 0.8, arch) * pow(fold, 1.3) * streak;
          col = pal(fold * 0.9 + q.x * 0.15 + 0.1);
          a = curtain * (0.3 + 0.7 * smoothstep(0.08, 0.3, abs(q.x))) * 1.7 * smoothstep(1.6, 1.1, abs(q.x)) * inn * fade;
        } else if (uKind < 5.5) {
          // Pillar: fire goes up from the floor through the body, far above the head. (Manner 1: an eruption, wider and rougher.)
          float y0 = q.y + 0.5;
          float H = (0.8 + 1.3 * grow) * (1.0 - 0.6 * smoothstep(1.3, 2.6, b));
          float n = noise(vec3(q.x * 5.0, q.y * 2.6 - uTime * 3.4, uTime * 0.5));
          float n2 = noise(vec3(q.x * 14.0, q.y * 6.0 - uTime * 6.5, 2.0));
          float w = mix(0.3, 0.52, uManner) * (1.0 - 0.6 * smoothstep(0.0, H + 0.5, y0));
          float edge = abs(q.x) + (n - 0.5) * mix(0.2, 0.5, uManner) + (n2 - 0.5) * 0.08;
          float column = smoothstep(w, w * 0.2, edge) * (1.0 - smoothstep(H * 0.5, H + 0.45, y0 + (n - 0.5) * 0.7));
          col = mix(pal(0.08 + y0 * 0.3), vec3(1.0), pow(column, 3.0) * 0.6);
          a = min(1.0, column * 1.25) * inn * fade;
        } else if (uKind < 6.5) {
          // Wheel: the six discipline colours light one after another round a ring, each with its beam.
          vec2 d2 = q - vec2(0.0, 0.22);
          float wr = length(d2);
          float t = fract(0.25 - atan(d2.y, d2.x) / 6.2832);
          float seg = floor(t * 6.0), sc = fract(t * 6.0) - 0.5;
          float lit = smoothstep(seg / 6.0, seg / 6.0 + 0.1, b * 1.9);
          float R = 0.44 + 0.2 * grow;
          float rim = (band(wr, R, 0.013) + 0.35 * band(wr, R, 0.05)) * smoothstep(0.5, 0.44, abs(sc));
          float beam = exp(-sc * sc * 70.0) * smoothstep(R, R + 0.04, wr) * exp(-(wr - R) * 2.4);
          float wedge = step(wr, R) * exp(-(R - wr) * 5.0) * 0.16;
          col = mix(uPal[int(seg)], vec3(1.0), 0.25 * rim);
          a = lit * (rim + beam * 0.85 + wedge) * inn * fade;
        } else if (uKind < 7.5) {
          // Eclipse: a full moon rises, a shadow crosses it, and what is left is a ring of white fire.
          vec2 d2 = q - vec2(0.0, mix(-0.05, 0.3, grow));
          float R = 0.44, mr = length(d2);
          float slide = mix(0.8, 0.0, smoothstep(0.15, 1.15, b));
          float moon = smoothstep(R + 0.01, R - 0.01, mr);
          float shadow = smoothstep(R * 0.97 + 0.01, R * 0.97 - 0.01, length(d2 - vec2(slide, slide * 0.25)));
          float face = moon * (1.0 - shadow) * (0.7 + 0.3 * noise(vec3(d2 * 7.0, 3.0)));
          float total = smoothstep(0.9, 1.2, b);
          float rim = band(mr, R, 0.012) * (0.6 + 2.2 * total);
          float glow = step(R, mr) * exp(-(mr - R) * 5.0) * 0.4 * total;
          col = mix(uPal[1], vec3(1.0), 0.65);
          a = (face * 0.7 + rim * 0.8 + glow) * inn * fade;
        } else if (uKind < 8.5) {
          // Nimbus: a ring of fine light opens behind the head, ring within ring, turning slowly.
          vec2 d2 = q - vec2(0.0, 0.3);
          float nr = length(d2) / (0.3 + 0.7 * grow), na = atan(d2.y, d2.x) + uTime * 0.12;
          float circles = band(nr, 0.42, 0.012) + band(nr, 0.6, 0.008) + 0.7 * band(nr, 0.86, 0.006);
          float fine = pow(abs(cos(na * 12.0)), 40.0) * smoothstep(0.42, 0.46, nr) * smoothstep(0.86, 0.8, nr);
          float points = pow(abs(cos(na * 6.0 + 0.26)), 14.0) * smoothstep(0.86, 0.9, nr) * exp(-(nr - 0.86) * 4.0);
          col = mix(uPal[0], vec3(1.0), 0.45);
          a = (circles + fine * 0.8 + points * 0.6 + exp(-nr * nr * 5.0) * 0.3) * inn * fade;
        } else if (uKind < 9.5) {
          // Sphere: a ball of force grows out of the chest until it is past the edge of sight, cracked through with light.
          vec2 d2 = q - vec2(0.0, 0.08);
          float sr = length(d2), R = 0.12 + 1.05 * (1.0 - exp(-b * 1.7));
          float rim = band(sr, R, 0.016 + 0.02 * R);
          float cracks = pow(1.0 - abs(noise(vec3(d2 * 4.0, uTime * 0.8)) * 2.0 - 1.0), 14.0);
          float inside = smoothstep(R, R - 0.05, sr) * (0.08 + 0.55 * cracks) * (0.35 + 0.65 * sr / R);
          col = mix(uPal[1], uPal[3], rim);
          a = (rim * 1.1 + inside) * inn * (1.0 - smoothstep(1.3, 2.4, b));
        } else if (uKind < 10.5) {
          // Pulse: ring after ring races out of the body, faster than they can be counted. (Manner 1: three heavy beats.)
          float pr = length(q * vec2(1.0, 0.85));
          float freq = mix(22.0, 8.0, uManner), speed = mix(2.6, 1.25, uManner);
          float waves = pow(0.5 + 0.5 * cos((pr - b * speed) * freq), mix(7.0, 3.5, uManner));
          float front = smoothstep(b * speed + 0.05, b * speed - 0.1, pr);
          float rush = pow(noise(vec3(q.x * 26.0, q.y * 1.5 - uTime * 7.0, 1.0)), 5.0) * exp(-abs(q.x) * 2.4) * (1.0 - uManner);
          col = mix(uPal[0], vec3(1.0), 0.2 + 0.5 * waves * uManner);
          a = (waves * front * exp(-pr * mix(1.5, 1.0, uManner)) * mix(0.9, 1.5, uManner) + rush * 1.2) * inn * fade;
        } else if (uKind < 11.5) {
          // Ripple: one ring leaves the body, quietly, and a veil of silver shimmers where it stood. (Manner 1: a hard white edge and nothing else.)
          float R = 0.2 + 1.2 * (1.0 - exp(-b * 1.5));
          float line = mix(band(r, R, 0.03), smoothstep(R - 0.04, R - 0.034, r) * smoothstep(R + 0.006, R, r) + 0.7 * smoothstep(R * 0.72 - 0.014, R * 0.72 - 0.01, r) * smoothstep(R * 0.72 + 0.004, R * 0.72, r), uManner);
          float haze = noise(vec3(q.x * 5.0, q.y * 2.0 - uTime * 1.1, uTime * 0.25));
          float veil = exp(-q.x * q.x * 9.0) * smoothstep(-0.5, 0.0, q.y) * smoothstep(1.5, 0.4, q.y) * haze * 0.5 * (1.0 - uManner);
          float glint = step(0.975, hash(vec3(floor(q * 30.0), floor(uTime * 4.0)))) * pow(max(0.0, 1.0 - 2.4 * length(fract(q * 30.0) - 0.5)), 2.0) * exp(-r * 1.2) * (1.0 - uManner);
          col = mix(uPal[0], vec3(1.0), 0.5);
          a = (line * (1.0 - smoothstep(0.9, 1.4, R)) + veil + glint * 0.8) * inn * fade;
        } else if (uKind < 12.5) {
          // Steam: it comes off the body in a rush and climbs, widening, the way it does off hot iron. (Manner 1: lit red from below, as at a quench.)
          float y0 = q.y + 0.5;
          float rise = uTime * 1.5 + b * 0.8;
          float n1 = noise(vec3(q.x * 3.4, q.y * 1.1 - rise, uTime * 0.3));
          float n2 = noise(vec3(q.x * 6.5 + n1 * 1.5, q.y * 2.2 - rise * 1.8, 4.0));
          float n3 = noise(vec3(q.x * 5.5 - n1, q.y * 1.6 - rise * 1.3, 9.0));
          float billow = smoothstep(0.2, 0.62, n1 * 0.5 + n2 * 0.2 + n3 * 0.4);
          float spread = 0.28 + 0.5 * smoothstep(0.0, 1.6, y0);
          float mask = smoothstep(spread, spread * 0.3, abs(q.x)) * smoothstep(0.0, 0.25, y0) * (1.0 - smoothstep(0.5 + 1.3 * grow, 0.9 + 1.4 * grow, y0));
          col = mix(mix(uPal[0], uPal[1], n2), mix(uPal[0], vec3(1.0), 0.7), uManner * smoothstep(0.2, 1.2, y0));
          a = billow * mask * 0.85 * inn * fade;
        } else if (uKind > 13.5) {
          // Blaze: a wall of fire stands round the body in spikes, beating, far above the head, with white lightning through it and down the sky behind.
          float y0 = q.y + 0.5;
          float beat = 0.5 + 0.5 * sin(uTime * 17.0);
          float swell = (0.72 + 0.28 * grow) * (1.0 + 0.07 * beat);
          // Its outline: widest at the hips and shoulders, drawn up to a point well above the head.
          float H = 1.95 * swell;
          float body = 0.46 * swell * pow(max(0.0, 1.0 - y0 / H), 0.62) * smoothstep(-0.03, 0.2, y0);
          // Spikes: teeth that lean up and out, large ones and small ones, climbing all the time.
          // The two sides are out of step and never quite regular, so it reads as fire and not as a pattern.
          float side = step(0.0, q.x);
          float lean = y0 * 3.1 - abs(q.x) * 2.3 + side * 0.41 + (noise(vec3(y0 * 1.7, side * 5.0, uTime * 0.6)) - 0.5) * 0.9;
          float big = abs(fract(lean - uTime * 1.7) - 0.5) * 2.0;
          float small = abs(fract(lean * 2.7 + 0.3 - uTime * 2.9) - 0.5) * 2.0;
          float teeth = (pow(big, 1.6) * 0.17 + pow(small, 1.4) * 0.06) * (0.55 + y0 * 0.6) * smoothstep(H * 1.02, H * 0.6, y0);
          float d = body + teeth - abs(q.x);
          float flame = smoothstep(0.0, 0.035, d);
          float core = smoothstep(0.05, 0.3, d);
          float edge = flame * (1.0 - smoothstep(0.0, 0.07, d));
          // White lightning: short forks that jump about inside the fire, and two great bolts behind it.
          float flick = floor(uTime * 15.0);
          float forks = 0.0;
          for (int i = 0; i < 6; i++) {
            float fi = float(i), seed = fi * 3.7 + flick * 1.3;
            float h1 = hash(vec3(seed, 2.0, 5.0)), h2 = hash(vec3(seed, 7.0, 1.0));
            vec2 c = vec2((h1 - 0.5) * 1.1, -0.4 + h2 * 1.6);
            vec2 e = q - c;
            float tilt = (hash(vec3(seed, 9.0, 4.0)) - 0.5) * 1.6;
            float along = e.x * sin(tilt) + e.y * cos(tilt), across = e.x * cos(tilt) - e.y * sin(tilt) + (noise(vec3(along * 13.0, seed, 0.0)) - 0.5) * 0.16;
            forks += step(0.3, h1) * (0.007 / (abs(across) + 0.005)) * exp(-abs(across) * 9.0) * smoothstep(0.27, 0.16, abs(along));
          }
          float sky = 0.0;
          for (int i = 0; i < 2; i++) {
            float fi = float(i), seed = fi * 9.1 + floor(uTime * 7.0) * 2.1;
            float px = (fi * 2.0 - 1.0) * (0.72 + 0.22 * hash(vec3(seed, 3.0, 3.0))) + (noise(vec3(q.y * 3.0, seed, 0.0)) - 0.5) * 0.4 + (noise(vec3(q.y * 12.0, seed, 4.0)) - 0.5) * 0.08;
            float bd = abs(q.x - px);
            sky += step(0.4, hash(vec3(seed, 5.0, 8.0))) * (0.009 / (bd + 0.007)) * exp(-bd * 4.0);
          }
          // Gold through and through: a darker rim, and near white where it is deepest.
          vec3 fire = mix(uPal[1], uPal[0], smoothstep(0.0, 0.07, d));
          fire = mix(fire, uPal[2], core * (0.5 + 0.3 * beat));
          col = mix(fire, vec3(1.0), min(1.0, forks * 0.9 + sky));
          a = (flame * (0.66 + 0.26 * core + 0.12 * beat) + min(forks, 2.0) * (0.35 + 0.65 * flame) + min(sky, 2.0) * 0.85 * (1.0 - flame)) * inn * fade;
        } else {
          // Strike: one blow at the floor, as a hammer on an anvil: a white line, spikes of light, and the red of struck metal left behind.
          vec2 d2 = q - vec2(0.0, -0.46);
          float life = exp(-b * 1.9);
          float sa = atan(d2.y, d2.x), sl = length(d2);
          float streak = exp(-abs(d2.y) * 40.0) * exp(-abs(d2.x) * 1.0);
          float up = exp(-abs(d2.x) * 26.0) * exp(-max(0.0, d2.y) * 1.6) * step(0.0, d2.y);
          float spikes = pow(0.5 + 0.5 * cos(sa * 9.0), 30.0) * exp(-sl * 2.4) * step(0.0, d2.y);
          // Sparks leave along their own lines and fall short one after another.
          float lane = floor(sa * 14.0), far = 0.5 + 1.1 * hash(vec3(lane, 3.0, 1.0));
          spikes += pow(0.5 + 0.5 * cos(sa * 14.0 * 6.2832), 8.0) * band(sl, far * (1.0 - exp(-b * 2.6)), 0.05) * step(0.02, d2.y) * 1.6;
          float heat = exp(-length(d2 * vec2(0.6, 2.2)) * 2.6) * 0.5 * (1.0 - smoothstep(1.0, 2.4, b));
          col = mix(uPal[0], uPal[2], life);
          a = ((streak + up * 0.8 + spikes) * life * 2.0 + heat) * inn;
        }
        // Nothing of it shows below the floor the body stands on.
        a *= smoothstep(-0.6, -0.5, q.y);
        gl_FragColor = vec4(col, a * uGain);
      }`,{uKind:0,uManner:0,uGain:0});c.renderOrder=-4,c.frustumCulled=!1,c.visible=!1,this.sign=c,this.world.add(c);{let e=1368,r=new Float32Array(e),i=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e*4),s=[],c=nu(cu,4);for(let e=0,t=0;e<cu;e++){c[e*4]=(e+.3*c[e*4])/cu,c[e*4+3]=e%2;for(let n=0;n<=lu;n++)for(let l of[-1,1])r[t]=n/lu,i[t]=l,a[t]=e,o.set(c.subarray(e*4,e*4+4),t*4),n<lu&&l===-1&&s.push(t,t+1,t+2,t+1,t+3,t+2),t++}let l=new Fr;l.setAttribute(`position`,new wr(new Float32Array(e*3),3)),l.setAttribute(`aU`,new wr(r,1)),l.setAttribute(`aV`,new wr(i,1)),l.setAttribute(`aIdx`,new wr(a,1)),l.setAttribute(`aSeed`,new wr(o,4)),l.setIndex(s);let u=new qr(l,tu(t,{uTurns:.75,uSpread:1,uWidth:.1,uSpeed:1,uRipple:.5,uCount:0},`
        attribute float aU, aV, aIdx; attribute vec4 aSeed;
        uniform float uTurns, uSpread, uWidth, uSpeed, uRipple, uCount;
        varying float vU, vV, vShow; varying vec4 vSeed;
        vec3 path(float u, vec4 s) {
          float dir = s.w > 0.5 ? 1.0 : -1.0;
          float th = s.x * 6.2832 + dir * (uTurns * u * 6.2832 + uTime * uSpeed * (0.18 + 0.3 * s.y));
          float flare = pow(sin(3.14159 * clamp(u, 0.0, 1.0)), 0.7);
          float r = (0.32 + uSpread * (0.4 + 0.8 * s.z) * flare) * (1.0 + 0.4 * uSurge) * (0.72 + 0.28 * uIntensity);
          float y = mix(-0.02, 1.1 + 0.22 * s.y, pow(u, 0.85)) + uRipple * 0.07 * sin(u * 9.0 + s.y * 20.0 + uTime * 1.3 * uSpeed) * flare;
          return vec3(cos(th) * r * uSize.x, uBase + y * uSize.y, sin(th) * r * uSize.z);
        }
        void main() {
          vec4 a = modelMatrix * vec4(path(aU, aSeed), 1.0), b = modelMatrix * vec4(path(aU + 0.012, aSeed), 1.0);
          vec3 side = normalize(cross(normalize(b.xyz - a.xyz), normalize(cameraPosition - a.xyz)));
          a.xyz += side * aV * uWidth * (0.45 + 0.9 * aSeed.z) * pow(sin(3.14159 * aU), 0.6);
          vU = aU; vV = aV; vSeed = aSeed; vShow = clamp(uCount - aIdx, 0.0, 1.0);
          gl_Position = projectionMatrix * viewMatrix * a;
        }`,`
        uniform float uGain, uSpeed; varying float vU, vV, vShow; varying vec4 vSeed;
        void main() {
          float across = 1.0 - abs(vV);
          float core = pow(across, 9.0);
          float flow = 0.55 + 0.45 * sin(vU * 14.0 - uTime * 3.0 * uSpeed + vSeed.x * 30.0);
          float ends = smoothstep(0.0, 0.14, vU) * smoothstep(1.0, 0.78, vU);
          float a = (pow(across, 1.5) * 0.62 * flow + core * 0.8) * ends * uGain * vShow;
          gl_FragColor = vec4(mix(pal(vSeed.x + vU * 0.3), vec3(1.0), core * 0.55), a);
        }`));n(`ribbons`,u),this.group.add(u)}{let e=new Fr;e.setAttribute(`position`,new wr(new Float32Array(uu*3),3)),e.setAttribute(`aSeed`,new wr(nu(uu,4),4)),e.setAttribute(`aIdx`,new wr(Float32Array.from({length:uu},(e,t)=>t/uu),1));let r=new ya(e,tu(t,{uRise:.22,uSwirl:1,uTwinkle:.5,uDot:1,uShow:1,uPx:800},`
        attribute vec4 aSeed; attribute float aIdx;
        uniform float uRise, uSwirl, uTwinkle, uDot, uShow, uPx;
        varying float vA, vHue;
        void main() {
          vec4 s = aSeed;
          float life = fract(uTime * uRise * (0.4 + 0.9 * s.y) + s.x);
          float th = s.z * 6.2832 + life * uSwirl * 2.5 + uTime * 0.12 * uSwirl;
          float r = (0.25 + 0.95 * sqrt(s.w)) * (0.85 + 0.5 * life) * (1.0 + 0.3 * uSurge);
          vec3 p = vec3(cos(th) * r * uSize.x, uBase + (life * 1.3 - 0.03) * uSize.y, sin(th) * r * uSize.z);
          p.x += 0.04 * sin(uTime * 1.7 + s.x * 40.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float fade = sin(3.14159 * life);
          float tw = 1.0 - uTwinkle * 0.7 * (0.5 + 0.5 * sin(uTime * (3.0 + 5.0 * s.y) + s.z * 50.0));
          vA = fade * tw * step(aIdx, uShow);
          vHue = s.z + s.x * 0.3;
          gl_PointSize = uPx * 0.04 * uDot * (0.45 + s.y) * fade / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,`
        uniform float uGain; varying float vA, vHue;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = pow(max(0.0, 1.0 - d), 2.2) * vA * uGain;
          gl_FragColor = vec4(mix(pal(vHue), vec3(1.0), 0.5 * pow(max(0.0, 1.0 - d), 4.0)), a);
        }`));n(`motes`,r),this.group.add(r)}{let e=new Float32Array(2240),r=new Float32Array(1680),i=new Float32Array(560),a=nu(du,4);for(let t=0;t<du;t++){let n=Math.random()*1.5-.5,o=Math.random()*Math.PI*2,s=Math.sqrt(Math.max(0,1-Math.min(1,n*n)));for(let c=0;c<fu;c++){let l=t*fu+c;e.set(a.subarray(t*4,t*4+4),l*4),r.set([Math.cos(o)*s,n,Math.sin(o)*s],l*3),i[l]=c/fu}}let o=new Fr;o.setAttribute(`position`,new wr(new Float32Array(1680),3)),o.setAttribute(`aSeed`,new wr(e,4)),o.setAttribute(`aDir`,new wr(r,3)),o.setAttribute(`aLag`,new wr(i,1));let s=new ya(o,tu(t,{uSpeed:1,uCrackle:0,uPx:800},`
        attribute vec4 aSeed; attribute vec3 aDir; attribute float aLag;
        uniform float uSpeed, uCrackle, uPx;
        varying float vA, vHue;
        void main() {
          vec4 s = aSeed;
          float life = 0.8 + 0.9 * s.y;
          // Either the time since the last release, or a loop of its own.
          float loop = fract(uTime * (0.5 + 0.9 * s.x) + s.z) * life * 0.55;
          float loopy = step(s.w, uCrackle * 0.6);
          float t = mix(uBurst, loop, loopy) - aLag * 0.07;
          float u = t / life;
          float reach = uSpeed * (0.7 + 1.9 * s.x) * mix(1.0, 0.32, loopy);
          vec3 from = vec3((s.z - 0.5) * 0.3 * uSize.x, uBase + uSize.y * (0.3 + 0.4 * s.w), (s.x - 0.5) * 0.3 * uSize.z);
          vec3 p = from + aDir * reach * (1.0 - exp(-t * 2.4)) * 0.62 * vec3(uSize.x * 2.0, 1.0, uSize.z * 2.0) + vec3(0.0, -0.55 * t * t, 0.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vA = step(0.0, t) * step(u, 1.0) * pow(max(0.0, 1.0 - u), 1.4) * (1.0 - aLag * 0.8);
          vHue = s.z;
          gl_PointSize = uPx * 0.02 * (0.5 + s.y) * (1.0 - aLag * 0.6) / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,`
        uniform float uGain; varying float vA, vHue;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          gl_FragColor = vec4(mix(pal(vHue), vec3(1.0), 0.65), pow(max(0.0, 1.0 - d), 2.0) * vA * uGain);
        }`));n(`sparks`,s),this.group.add(s)}{let e=new Float32Array(192),r=new Float32Array(384),i=new Float32Array(96),a=[],o=nu(pu,4);for(let t=0;t<pu;t++)[[-1,0],[1,0],[-1,1],[1,1]].forEach(([n,a],s)=>{let c=t*4+s;e.set([n,a],c*2),r.set(o.subarray(t*4,t*4+4),c*4),i[c]=t}),a.push(t*4,t*4+1,t*4+2,t*4+1,t*4+3,t*4+2);let s=new Fr;s.setAttribute(`position`,new wr(new Float32Array(288),3)),s.setAttribute(`aCorner`,new wr(e,2)),s.setAttribute(`aSeed`,new wr(r,4)),s.setAttribute(`aIdx`,new wr(i,1)),s.setIndex(a);let c=new qr(s,tu(t,{uHeight:1,uCount:0},`
        attribute vec2 aCorner; attribute vec4 aSeed; attribute float aIdx;
        uniform float uHeight, uCount;
        varying vec2 vC; varying vec4 vSeed; varying float vShow;
        void main() {
          vec4 s = aSeed;
          float th = s.x * 6.2832, r = 0.14 + 0.62 * s.y;
          vec4 w = modelMatrix * vec4(cos(th) * r * uSize.x, uFloor, sin(th) * r * uSize.z, 1.0);
          vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), cameraPosition - w.xyz));
          float h = uHeight * (0.45 + 0.9 * s.z) * (0.35 + 0.65 * uIntensity + 0.5 * uSurge) * max(uSize.y, 1.0);
          w.xyz += right * aCorner.x * (0.014 + 0.03 * s.w) + vec3(0.0, aCorner.y * h, 0.0);
          vC = aCorner; vSeed = s; vShow = clamp(uCount - aIdx, 0.0, 1.0);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,`
        uniform float uGain; varying vec2 vC; varying vec4 vSeed; varying float vShow;
        void main() {
          float flick = 0.5 + 0.5 * sin(uTime * (2.0 + 4.0 * vSeed.y) + vSeed.x * 40.0 - vC.y * 6.0);
          float a = pow(1.0 - abs(vC.x), 2.0) * pow(1.0 - vC.y, 1.3) * smoothstep(0.0, 0.03, vC.y) * (0.45 + 0.75 * flick) * uGain * vShow;
          gl_FragColor = vec4(mix(pal(vSeed.z), vec3(1.0), 0.3 * (1.0 - vC.y)), a);
        }`));n(`streams`,c),this.group.add(c)}{let e=new qr(new Ea(1,1),tu(t,{uDashes:36,uSpin:.25,uWave:this.waves,uClock:0},`
        varying vec2 vP; void main() { vP = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,`
        uniform float uGain, uDashes, uSpin, uClock; uniform float uWave[4];
        varying vec2 vP;
        float ring(float r, float at, float w) { float d = (r - at) / w; return exp(-d * d); }
        void main() {
          float r = length(vP) * 1.7, ang = atan(vP.y, vP.x);
          float breath = 0.5 + 0.5 * sin(uTime * 1.4);
          float dash = uDashes > 0.5 ? smoothstep(0.1, 0.4, 0.5 + 0.5 * sin(ang * uDashes + uTime * uSpin * 6.0)) : 1.0;
          float a = exp(-r * r * 2.2) * 0.75 + ring(r, 0.62 + 0.03 * breath, 0.014) * 1.3 + ring(r, 0.86, 0.008) * 1.0 * dash + ring(r, 0.4, 0.022) * 0.5 + ring(r, 1.05, 0.004) * 0.5;
          for (int i = 0; i < 4; i++) {
            float age = uClock - uWave[i];
            a += ring(r, 0.3 + age * 1.25, 0.03 + age * 0.03) * max(0.0, 1.0 - age / 1.5) * 1.3;
          }
          a *= uGain * smoothstep(1.7, 1.35, r);
          gl_FragColor = vec4(mix(pal(ang * 0.159 + uTime * 0.02 * uSpin), vec3(1.0), 0.2), a);
        }`));e.rotation.x=-Math.PI/2,e.renderOrder=-1,n(`rings`,e),this.group.add(e)}{let e=new Float32Array(840),r=new Float32Array(560),i=[];for(let e=0,t=0;e<mu;e++)for(let e=0;e<hu;e++)for(let n of[-1,1])r.set([n,e/13],t*2),e<13&&n===-1&&i.push(t,t+1,t+2,t+1,t+3,t+2),t++;let a=new Fr,o=new wr(e,3);o.setUsage(Je),a.setAttribute(`position`,o),a.setAttribute(`aSide`,new wr(r,2)),a.setIndex(i);let s=new qr(a,tu(t,{},`
        attribute vec2 aSide; varying vec2 vS;
        void main() { vS = aSide; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,`
        uniform float uGain; varying vec2 vS;
        void main() {
          float across = 1.0 - abs(vS.x);
          float a = (pow(across, 6.0) + 0.25 * pow(across, 1.5)) * sin(3.14159 * vS.y) * uGain;
          gl_FragColor = vec4(mix(uPal[1], vec3(1.0), pow(across, 5.0)), a);
        }`));n(`arcs`,s),this.world.add(s),this.arcs={geometry:a,position:e,side:r}}}setPaint(e){this.shared.uPaint.value=+!!e;for(let t of Object.values(this.parts))for(let n of t.objects)n.material.blending=e?1:2;this.sign.material.blending=e?1:2;for(let t of this.shells){let n=t.material;n.side=e?1:2,n.needsUpdate=!0}}setTheme(e,t={}){this.theme=e,this.tuning=t,this.shared.uPal.value.forEach((t,n)=>t.set(e.palette[n%e.palette.length])),this.shared.uPalN.value=Math.min(6,e.palette.length);let n=(e,t)=>{for(let n of this.parts[e].objects)for(let[e,r]of Object.entries(t))n.material.uniforms[e].value=r};n(`shell`,{uFlame:Math.max(e.shell.flame,su)}),n(`rays`,{uCount:e.rays.count,uSharp:e.rays.sharp}),n(`ribbons`,{uTurns:e.ribbons.turns,uSpread:e.ribbons.spread,uWidth:e.ribbons.width,uSpeed:e.ribbons.speed,uRipple:e.ribbons.ripple}),n(`motes`,{uRise:e.motes.rise,uSwirl:e.motes.swirl,uTwinkle:e.motes.twinkle,uDot:e.motes.size}),n(`sparks`,{uSpeed:e.sparks.speed,uCrackle:e.sparks.crackle}),n(`streams`,{uHeight:e.streams.height}),n(`rings`,{uDashes:e.rings.dashes,uSpin:e.rings.spin});let r=this.sign.material.uniforms;r.uKind.value=Yl.indexOf(e.act.sign),r.uManner.value=e.act.manner,this.actor.look.chargeColor.value.set(e.palette[0])}beat(e=.6){this.pulse=Math.max(this.pulse,e),this.waves.shift(),this.waves.push(this.clock)}release(){this.chargeAge=-1,this.burstAge=0,this.beat(1)}charge(){this.chargeAge>=0||this.burstAge<1.4||(this.chargeAge=0)}get busy(){return this.chargeAge>=0||this.burstAge<2.2}measure(e){let t=this.actor.rig,n=t.pos,r=n.head.clone().add(new L(0,.2*t.body.scale,0).applyQuaternion(t.rot.head)),i=[r,n.handL,n.handR,n.footL,n.footR,n.hips,n.upperChest],a=1/0,o=-1/0,s=new L;for(let e of i)a=Math.min(a,e.y),o=Math.max(o,e.y),s.add(e);s.multiplyScalar(1/i.length);let c=n.footL.clone().add(n.footR).multiplyScalar(.5),l=new L(r.x-c.x,0,r.z-c.z),u=l.length(),d=t.body.scale,f=ru(.5*d,1.1*d,u),p=new L(.46*d+f*(u*.5-.1*d),Math.max(o-a+.12*d,.6*d),.46*d),m=f>.01?Math.atan2(-l.z,l.x):0,h=this.measured?1-Math.exp(-e*7):1;this.measured=!0,this.centre.lerp(new L(s.x,0,s.z),h),this.size.lerp(p,h),this.heading+=(m*f-this.heading)*h,this.base+=(Math.max(0,a-.05*d)-this.base)*h}update(e,t,n,r){let i=this.theme,a=this.tuning,o=a.off??[];this.clock+=e,this.time+=e*i.flow*(a.pulse??1),this.pulse*=Math.exp(-e*2.6),this.burstAge+=e;let s=0;this.chargeAge>=0&&(this.chargeAge+=e,s=Math.min(1,this.chargeAge/iu),this.pulse=Math.max(this.pulse,.5*s*(.5+.5*Math.sin(this.clock*(16+34*s)))),s>=1&&this.release());let c=Math.exp(-this.burstAge*1.3),l=c,u=Math.max(c,.8*s),d=e=>i.act.with.includes(e),f=Math.min(1,Math.max(t*(a.intensity??1),c,this.chargeAge>=0?.55+.45*s:0));this.level+=(f-this.level)*(1-Math.exp(-e*(f>this.level?9:2.2)));let p=.5+.5*Math.sin(this.clock*Math.PI*2*i.breath*(a.pulse??1)),m=Math.min(1,this.level*(.86+.14*p)+this.pulse*.18);this.measure(e),this.group.position.copy(this.actor.group.localToWorld(this.centre.clone())),this.group.rotation.y=this.heading+this.actor.group.rotation.y;let h=this.shared;h.uTime.value=this.time,h.uIntensity.value=m,h.uPulse.value=this.pulse,h.uBurst.value=this.burstAge,h.uSurge.value=c,h.uBase.value=this.base;let g=r/(2*Math.tan(n.fov*Math.PI/360)),_=a.density??1,v=(e,t,n,r=.3)=>{let i=o.includes(e)?0:t*ru(n,Math.min(1,n+r),m)*(au.includes(e)?d(e)?e===`streams`||e===`motes`?u:l:0:1),a=this.parts[e];a.gain.value=i;for(let e of a.objects)e.visible=i>.002;return i},y=this.actor.rig.body.scale*.006*Math.min(1.35,Math.max(i.shell.reach,.8))*(.6+.8*m+.2*this.pulse)*(1.45-.55*s-.3*c);v(`shell`,Math.max(i.shell.level,.9)*(.7+.8*m)*(.85+.15*p),i.shell.from,.2);for(let e of this.shells)e.material.uniforms.uReach.value=y;v(`halo`,i.halo.level*(.25+.75*m),i.halo.from,.35),v(`rays`,i.rays.level*(.5+.5*m+.6*c),i.rays.from,.3),v(`ribbons`,i.ribbons.level,i.ribbons.from,.25),this.parts.ribbons.objects[0].material.uniforms.uCount.value=Math.min(cu,i.ribbons.count*_*ru(i.ribbons.from,.9,m)+1),v(`motes`,i.motes.level,i.motes.from,.25);let b=this.parts.motes.objects[0].material.uniforms;b.uShow.value=Math.min(1,i.motes.count/uu*_*(.25+.75*m)),b.uPx.value=g,v(`streams`,i.streams.level,i.streams.from,.3),this.parts.streams.objects[0].material.uniforms.uCount.value=Math.min(pu,i.streams.count*_*ru(i.streams.from,1,m)+1),v(`rings`,i.rings.level*(.4+.6*m),i.rings.from,.3);let x=this.parts.rings.objects[0];x.material.uniforms.uClock.value=this.clock,x.scale.set(this.size.x*4.6,this.size.z*4.6,1);let S=o.includes(`sparks`)||!d(`sparks`)?0:i.sparks.level*Math.max(+(this.burstAge<2),i.sparks.crackle*l*ru(i.sparks.from-.5,i.sparks.from,m));this.parts.sparks.gain.value=S,this.parts.sparks.objects[0].visible=S>.002,this.parts.sparks.objects[0].material.uniforms.uPx.value=g;let C=v(`arcs`,i.arcs.level,i.arcs.from,.3),w=new L(this.group.position.x,this.base+this.size.y*.5,this.group.position.z),T=w.clone().sub(n.position).normalize(),E=Math.max(this.size.y,this.size.x*2)*i.halo.size;for(let[e,t]of[[this.parts.halo.objects[0],2.3],[this.parts.rays.objects[0],3.4+1.2*c]])e.position.copy(w).addScaledVector(T,.5),e.quaternion.copy(n.quaternion),e.scale.set(E*t,E*t,1);let D=this.burstAge<ou&&i.act.sign!==`none`;if(this.sign.visible=D,D){this.sign.material.uniforms.uGain.value=Math.min(1,.55+.6*(a.intensity??1)*Math.max(t,.5));let e=Math.max(this.size.y,this.actor.rig.body.scale*1.2)*3.2;this.sign.position.copy(w).addScaledVector(T,.6),this.sign.quaternion.copy(n.quaternion),this.sign.scale.set(e,e,1)}C>.002&&(this.arcClock-=e,this.arcClock<=0&&(this.arcClock=.045+Math.random()*.07,this.strike(Math.round(Math.min(mu,i.arcs.count*_*(.35+.65*m))),n)));let O=this.actor.look;O.charge.value=i.body*ru(.18,.95,m)*(.88+.12*p)+this.pulse*.12+.45*s,O.rim.value=.22+.55*m}strike(e,t){let{position:n}=this.arcs,r=this.actor.rig.pos,i=[r.head,r.handL,r.handR,r.lowerArmL,r.lowerArmR,r.upperArmL,r.upperArmR,r.hips,r.upperChest,r.lowerLegL,r.lowerLegR,r.footL,r.footR].map(e=>this.actor.group.localToWorld(e.clone())),a=new L,o=new L,s=new L,c=new L,l=new L,u=new L,d=this.actor.rig.body.scale,f=0;for(let r=0;r<mu;r++){let p=r<e;a.copy(i[Math.floor(Math.random()*i.length)]),Math.random()<.5?o.copy(i[Math.floor(Math.random()*i.length)]):o.copy(a).add(u.set(Math.random()-.5,Math.random()-.3,Math.random()-.5).multiplyScalar(.9*d));let m=a.distanceTo(o),h=p?(.006+.01*Math.random())*d:0;for(let e=0;e<hu;e++){let r=e/13;s.copy(a).lerp(o,r).add(u.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(m*.16*Math.sin(Math.PI*r))),c.copy(o).sub(a).normalize(),l.crossVectors(c,u.copy(t.position).sub(s).normalize()).normalize().multiplyScalar(h),n.set([s.x-l.x,s.y-l.y,s.z-l.z,s.x+l.x,s.y+l.y,s.z+l.z],f),f+=6}}this.arcs.geometry.getAttribute(`position`).needsUpdate=!0}dispose(){for(let e of Object.values(this.parts))for(let t of e.objects)t.removeFromParent(),t.material.dispose(),t.isSkinnedMesh||t.geometry.dispose();this.group.removeFromParent(),this.world.removeFromParent()}};function _u(e,t){switch(e){case`reps`:return .1+.12*t.progress+.16*t.effort;case`hold`:return .08+.4*t.progress*t.progress+.03*t.progress*Math.sin(t.time*23)*Math.sin(t.time*7.3);case`balance`:return .16+.1*t.effort+.05*Math.sin(t.time*1.7);case`mobility`:return .12+.2*(.5-.5*Math.cos(t.phase*Math.PI*2))}}function vu(e,t,n,r){return r===void 0?e===`off`?0:e===`full`?.82+.18*n.effort:_u(t,n):r}var yu=[`traps`,`mid_back`,`rear_cuff`,`delt_ant`,`delt_lat`,`delt_post`,`pec`,`pec_upper`,`biceps`,`triceps`,`forearm_flex`,`forearm_ext`,`lats`,`lower_back`,`serratus`,`abs`,`obliques`,`hip_flexors`,`glutes`,`glute_med`,`quads`,`hamstrings`,`adductors`,`calves`],bu=yu.length*2,xu=(e,t)=>yu.indexOf(e)*2+ +(t===`R`),Su={delts:{delt_ant:1,delt_lat:1},rear_delts:{delt_post:1},chest:{pec:1,pec_upper:1},triceps:{triceps:1},biceps:{biceps:1},forearms:{forearm_flex:1,forearm_ext:.85},lats:{lats:1},traps:{traps:1},mid_back:{mid_back:1,rear_cuff:.85},lower_back:{lower_back:1},abs:{abs:1},obliques:{obliques:1},serratus:{serratus:1},hip_flexors:{hip_flexors:1},glutes:{glutes:1,glute_med:.7},quads:{quads:1},hamstrings:{hamstrings:1},adductors:{adductors:1},calves:{calves:1}},Cu={primary:1,secondary:.55,stabilizer:.24};function wu(e,t={}){let n=new Float32Array(bu),r=(e,t)=>{for(let[r,i]of Object.entries(Su[e])){let e=t*i;for(let t of[`L`,`R`]){let i=xu(r,t);e>n[i]&&(n[i]=e)}}};e.stabilizers.forEach(e=>r(e,Cu.stabilizer)),e.secondary.forEach(e=>r(e,Cu.secondary)),e.primary.forEach(e=>r(e,Cu.primary));for(let[e,r]of Object.entries(t)){let[t,i]=e.split(`.`);for(let e of i?[i]:[`L`,`R`])n[xu(t,e)]=r}return n}function Tu(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}var Eu=class extends no{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new ju(e)}),this.register(function(e){return new Mu(e)}),this.register(function(e){return new Vu(e)}),this.register(function(e){return new Hu(e)}),this.register(function(e){return new Uu(e)}),this.register(function(e){return new Pu(e)}),this.register(function(e){return new Fu(e)}),this.register(function(e){return new Iu(e)}),this.register(function(e){return new Lu(e)}),this.register(function(e){return new Au(e)}),this.register(function(e){return new Ru(e)}),this.register(function(e){return new Nu(e)}),this.register(function(e){return new Bu(e)}),this.register(function(e){return new zu(e)}),this.register(function(e){return new Ou(e)}),this.register(function(e){return new Wu(e)}),this.register(function(e){return new Gu(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=Eo.extractUrlBase(e);a=Eo.resolveURL(t,this.path)}else a=Eo.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new ao(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===Ku){try{a[U.KHR_BINARY_GLTF]=new Yu(e)}catch(e){r&&r(e);return}i=JSON.parse(a[U.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new xd(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case U.KHR_MATERIALS_UNLIT:a[t]=new ku;break;case U.KHR_DRACO_MESH_COMPRESSION:a[t]=new Xu(i,this.dracoLoader);break;case U.KHR_TEXTURE_TRANSFORM:a[t]=new Zu;break;case U.KHR_MESH_QUANTIZATION:a[t]=new Qu;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function Du(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}var U={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},Ou=class{constructor(e){this.parser=e,this.name=U.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new B(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],Ue);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new To(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new So(s),o.distance=c;break;case`spot`:o=new _o(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),pd(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},ku=class{constructor(){this.name=U.KHR_MATERIALS_UNLIT}getMaterialType(){return br}extendParams(e,t,n){let r=[];e.color=new B(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],Ue),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,He))}return Promise.all(r)}},Au=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},ju=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatMap`,a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatRoughnessMap`,a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(i.push(n.assignTexture(t,`clearcoatNormalMap`,a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){let e=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ct(e,e)}return Promise.all(i)}},Mu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_DISPERSION}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name];return t.dispersion=r.dispersion===void 0?0:r.dispersion,Promise.resolve()}},Nu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceMap`,a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceThicknessMap`,a.iridescenceThicknessTexture)),Promise.all(i)}},Pu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_SHEEN}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[];t.sheenColor=new B(0,0,0),t.sheenRoughness=0,t.sheen=1;let a=r.extensions[this.name];if(a.sheenColorFactor!==void 0){let e=a.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],Ue)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&i.push(n.assignTexture(t,`sheenColorMap`,a.sheenColorTexture,He)),a.sheenRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`sheenRoughnessMap`,a.sheenRoughnessTexture)),Promise.all(i)}},Fu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&i.push(n.assignTexture(t,`transmissionMap`,a.transmissionTexture)),Promise.all(i)}},Iu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_VOLUME}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.thickness=a.thicknessFactor===void 0?0:a.thicknessFactor,a.thicknessTexture!==void 0&&i.push(n.assignTexture(t,`thicknessMap`,a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;let o=a.attenuationColor||[1,1,1];return t.attenuationColor=new B().setRGB(o[0],o[1],o[2],Ue),Promise.all(i)}},Lu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_IOR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name];return t.ior=r.ior===void 0?1.5:r.ior,Promise.resolve()}},Ru=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_SPECULAR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.specularIntensity=a.specularFactor===void 0?1:a.specularFactor,a.specularTexture!==void 0&&i.push(n.assignTexture(t,`specularIntensityMap`,a.specularTexture));let o=a.specularColorFactor||[1,1,1];return t.specularColor=new B().setRGB(o[0],o[1],o[2],Ue),a.specularColorTexture!==void 0&&i.push(n.assignTexture(t,`specularColorMap`,a.specularColorTexture,He)),Promise.all(i)}},zu=class{constructor(e){this.parser=e,this.name=U.EXT_MATERIALS_BUMP}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return t.bumpScale=a.bumpFactor===void 0?1:a.bumpFactor,a.bumpTexture!==void 0&&i.push(n.assignTexture(t,`bumpMap`,a.bumpTexture)),Promise.all(i)}},Bu=class{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:Aa}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&i.push(n.assignTexture(t,`anisotropyMap`,a.anisotropyTexture)),Promise.all(i)}},Vu=class{constructor(e){this.parser=e,this.name=U.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},Hu=class{constructor(e){this.parser=e,this.name=U.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Uu=class{constructor(e){this.parser=e,this.name=U.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Wu=class{constructor(e){this.name=U.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},Gu=class{constructor(e){this.name=U.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==nd.TRIANGLES&&e.mode!==nd.TRIANGLE_STRIP&&e.mode!==nd.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new z,n=new L,a=new I,s=new L(1,1,1),c=new Gi(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));for(let t in o)if(t===`_COLOR_0`){let e=o[t];c.instanceColor=new Li(e.array,e.itemSize,e.normalized)}else t!==`TRANSLATION`&&t!==`ROTATION`&&t!==`SCALE`&&e.geometry.setAttribute(t,o[t]);Qn.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},Ku=`glTF`,qu=12,Ju={JSON:1313821514,BIN:5130562},Yu=class{constructor(e){this.name=U.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,qu),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Ku)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-qu,i=new DataView(e,qu),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Ju.JSON){let r=new Uint8Array(e,qu+a,t);this.content=n.decode(r)}else if(r===Ju.BIN){let n=qu+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},Xu=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=U.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=sd[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=sd[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=rd[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,Ue,n)})})}},Zu=class{constructor(){this.name=U.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Qu=class{constructor(){this.name=U.KHR_MESH_QUANTIZATION}},$u=class extends za{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},ed=new I,td=class extends $u{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return ed.fromArray(i).normalize().toArray(i),i}},nd={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},rd={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},id={9728:s,9729:u,9984:c,9985:d,9986:l,9987:f},ad={33071:a,33648:o,10497:i},od={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},sd={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},cd={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},ld={CUBICSPLINE:void 0,LINEAR:Pe,STEP:Ne},ud={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function dd(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new ka({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function fd(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function pd(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function md(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function hd(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function gd(e){let t,n=e.extensions&&e.extensions[U.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+_d(n.attributes):e.indices+`:`+_d(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+_d(e.targets[n]);return t}function _d(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function vd(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function yd(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var bd=new z,xd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Du,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new co(this.options.manager):new Oo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ao(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return fd(i,a,r),pd(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[U.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(Eo.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=od[r.type],t=rd[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new wr(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=od[r.type],o=rd[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new yi(f,u/s),t.cache.add(n,c)),p=new xi(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new wr(f,a,d);if(r.sparse!==void 0){let t=od.SCALAR,n=rd[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new wr(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=id[n.magFilter]||1006,t.minFilter=id[n.minFilter]||1008,t.wrapS=ad[n.wrapS]||1e3,t.wrapT=ad[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new Kt(e);t.needsUpdate=!0,n(t)}),t.load(Eo.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),pd(e,a),e.userData.mimeType=a.mimeType||yd(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[U.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[U.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[U.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new ma,yr.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new ea,yr.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return ka}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[U.KHR_MATERIALS_UNLIT]){let e=r[U.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new B(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],Ue),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,He)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||ud.OPAQUE;if(l===ud.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===ud.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==br&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new Ct(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==br&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==br){let e=i.emissiveFactor;o.emissive=new B().setRGB(e[0],e[1],e[2],Ue)}return i.emissiveTexture!==void 0&&a!==br&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,He)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),pd(n,i),t.associations.set(n,{materials:e}),i.extensions&&fd(r,n,i),n})}createUniqueName(e){let t=Vo.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[U.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return Cd(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=gd(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[U.KHR_DRACO_MESH_COMPRESSION]?i(o):Cd(new Fr,o,t),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?dd(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===nd.TRIANGLES||u.mode===nd.TRIANGLE_STRIP||u.mode===nd.TRIANGLE_FAN||u.mode===void 0)d=i.isSkinnedMesh===!0?new ji(l,f):new qr(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),u.mode===nd.TRIANGLE_STRIP?d.geometry=Tu(d.geometry,1):u.mode===nd.TRIANGLE_FAN&&(d.geometry=Tu(d.geometry,2));else if(u.mode===nd.LINES)d=new fa(l,f);else if(u.mode===nd.LINE_STRIP)d=new ca(l,f);else if(u.mode===nd.LINE_LOOP)d=new pa(l,f);else if(u.mode===nd.POINTS)d=new ya(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&hd(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),pd(d,i),u.extensions&&fd(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&fd(r,c[0],i),c[0];let l=new hi;i.extensions&&fd(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r)console.warn(`THREE.GLTFLoader: Missing camera parameters.`);else return n.type===`perspective`?t=new li(St.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new Co(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),pd(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new z;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new Ii(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new Za(i,void 0,l);return pd(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,bd)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new Mi:t.length>1?new hi:t.length===1?t[0]:new Qn,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),pd(o,i),i.extensions&&fd(n,o,i),i.matrix!==void 0){let e=new z;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new hi;n.name&&(i.name=r.createUniqueName(n.name)),pd(i,n),n.extensions&&fd(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++)i.add(e[t]);return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof yr||e instanceof Kt)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];cd[i.path]===cd.weights?e.traverse(function(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}):s.push(o);let c;switch(cd[i.path]){case cd.weights:c=Ka;break;case cd.rotation:c=Ja;break;case cd.translation:case cd.scale:c=Xa;break;default:switch(n.itemSize){case 1:c=Ka;break;default:c=Xa}}let l=r.interpolation===void 0?Pe:ld[r.interpolation],u=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new c(s[e]+`.`+cd[i.path],t.array,u,l);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=vd(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof Ja?td:$u)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Sd(e,t,n){let r=t.attributes,i=new Qt;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new L(t[0],t[1],t[2]),new L(a[0],a[1],a[2])),e.normalized){let t=vd(rd[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new L,t=new L;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=vd(rd[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new _n;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function Cd(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=sd[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return It.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${It.workingColorSpace}" not supported.`),pd(e,t),Sd(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:md(e,t.targets,n)})}function wd(e){let t=new Map,n=new Map,r=e.clone();return Td(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function Td(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)Td(e.children[r],t.children[r],n)}var Ed=[`hips`,`spine`,`chest`,`upperChest`,`neck`,`head`],Dd=[`shoulder`,`upperArm`,`lowerArm`,`foreTwist`,`hand`,`fingers1`,`fingers2`,`fingers3`,`thumb1`,`thumb2`,`upperLeg`,`lowerLeg`,`foot`,`toes`],Od=[...Ed,...Dd.map(e=>`${e}L`),...Dd.map(e=>`${e}R`)],kd={shoulder:`upperChest`,upperArm:`shoulder`,lowerArm:`upperArm`,foreTwist:`lowerArm`,hand:`lowerArm`,fingers1:`hand`,fingers2:`fingers1`,fingers3:`fingers2`,thumb1:`hand`,thumb2:`thumb1`,upperLeg:`hips`,lowerLeg:`upperLeg`,foot:`lowerLeg`,toes:`foot`},Ad={hips:null,spine:`hips`,chest:`spine`,upperChest:`chest`,neck:`upperChest`,head:`neck`},jd=e=>Ed.includes(e),Md=Object.fromEntries(Od.map(e=>{if(jd(e))return[e,Ad[e]];let t=e.slice(-1),n=kd[e.slice(0,-1)];return[e,jd(n)?n:`${n}${t}`]})),Nd=e=>[-e[0],e[1],e[2]];function Pd(e){let t=e===`female`,n=t?.932:1,r=e=>e*n,i=t?.158:.188,a=t?.915:1,o=t?.088:.092,s=r(1.462),c=-.012*n,l=e=>[i+e*a,s,c],u={shoulder:[.025*n,r(1.465),.02*n],upperArm:l(0),lowerArm:l(.3),foreTwist:l(.3+.264*.55),hand:l(.3+.264),fingers1:l(.658),fingers2:l(.7040000000000001),fingers3:l(.7320000000000001),thumb1:[i+.5940000000000001*a,s-.008*a,c+.03*a],thumb2:[i+.6300000000000001*a,s-.011*a,c+.056*a],upperLeg:[o,r(.935),0],lowerLeg:[o+.026*n,r(.505),.005*n],foot:[o+.05*n,r(.082),-.012*n],toes:[o+.058*n,r(.022),.112*n]},d={hips:[0,r(.985),-.005*n],spine:[0,r(1.065),-.01*n],chest:[0,r(1.19),-.012*n],upperChest:[0,r(1.32),-.014*n],neck:[0,r(1.505),-.014*n],head:[0,r(1.598),-.002*n]};for(let e of Dd)d[`${e}L`]=u[e],d[`${e}R`]=Nd(u[e]);return{joints:d,tips:{headTop:[0,r(1.8),.01*n],fingertipL:l(.756),thumbTipL:[i+.658*a,s-.012*a,c+.072*a],toeTipL:[o+.062*n,r(.014),.192*n],heelL:[o+.048*n,r(0),-.062*n]},height:r(1.8),scale:n}}var Fd=e=>new L(e[0],e[1],e[2]),Id=new L(1,0,0),Ld=new L(0,1,0),Rd=new L(0,0,1),zd=Math.PI/180,W=e=>new I().setFromAxisAngle(Id,e*zd),Bd=e=>new I().setFromAxisAngle(Ld,e*zd),Vd=e=>new I().setFromAxisAngle(Rd,e*zd),Hd=20;function Ud(e){let t=Pd(e),n=Object.fromEntries(Od.map(e=>[e,Fd(t.joints[e])])),r=(e,t)=>n[e].distanceTo(n[t]);return{id:e,rest:n,upperArm:r(`upperArmL`,`lowerArmL`),lowerArm:r(`lowerArmL`,`handL`),upperLeg:r(`upperLegL`,`lowerLegL`),lowerLeg:r(`lowerLegL`,`footL`),palm:r(`handL`,`fingers1L`)*.6,knuckle:r(`handL`,`fingers1L`),ankle:n.footL.y,ball:n.toesL.clone().sub(n.footL).setX(0),heel:Fd(t.tips.heelL).sub(n.footL).setX(0),trunk:n.upperArmL.y-n.upperLegL.y,height:t.height,scale:t.scale}}var Wd=new z,Gd=new L,Kd=new L,qd=new L;function Jd(e,t,n=new I){return Gd.copy(e).normalize(),Kd.copy(t).addScaledVector(Gd,-t.dot(Gd)),Kd.lengthSq()<1e-10&&Kd.set(-Gd.y,Gd.x,0),Kd.lengthSq()<1e-10&&Kd.set(0,-Gd.z,Gd.y),Kd.normalize(),qd.crossVectors(Gd,Kd),n.setFromRotationMatrix(Wd.makeBasis(Gd,Kd,qd))}function G(e,t,n){let r=Jd(e===`L`?Id:Id.clone().negate(),Ld.clone().negate());return Jd(t,n).multiply(r.invert())}function Yd(e,t){return Jd(e,t).multiply(Jd(Rd,Ld).invert())}var Xd=[`L`,`R`],Zd=class{body;rot={};pos={};restFrame={};armAim;legAim;constructor(e){this.body=Ud(e);let t=this.body.rest;for(let e of Od)this.rot[e]=new I,this.pos[e]=t[e].clone();this.armAim={L:Id.clone(),R:Id.clone().negate()},this.legAim={L:{upper:t.lowerLegL.clone().sub(t.upperLegL).normalize(),lower:t.footL.clone().sub(t.lowerLegL).normalize()},R:{upper:t.lowerLegR.clone().sub(t.upperLegR).normalize(),lower:t.footR.clone().sub(t.lowerLegR).normalize()}};let n=Rd.clone().negate();for(let e of Xd)this.restFrame[`arm${e}`]=Jd(this.armAim[e],n).invert(),this.restFrame[`thigh${e}`]=Jd(this.legAim[e].upper,Rd).invert(),this.restFrame[`shin${e}`]=Jd(this.legAim[e].lower,Rd).invert()}child(e){let t=Md[e];this.pos[e].copy(this.body.rest[e]).sub(this.body.rest[t]).applyQuaternion(this.rot[t]).add(this.pos[t])}joints(e,t,n){this.trunk(e,t,n,n);let r=this.body.rest,i=(e,t)=>r[e].clone().sub(r[t]).applyQuaternion(this.rot[t]).add(this.pos[t]);return this.rot.shoulderL.copy(n),this.rot.shoulderR.copy(n),this.child(`shoulderL`),this.child(`shoulderR`),{shoulderL:i(`upperArmL`,`shoulderL`),shoulderR:i(`upperArmR`,`shoulderR`),hipL:i(`upperLegL`,`hips`),hipR:i(`upperLegR`,`hips`),neck:this.pos.neck.clone(),head:this.pos.head.clone()}}trunk(e,t,n,r){let{rot:i,pos:a}=this;a.hips.copy(e),i.hips.copy(t),i.spine.copy(t).slerp(n,.3),i.chest.copy(t).slerp(n,.68),i.upperChest.copy(n),i.neck.copy(n).slerp(r,.45),i.head.copy(r);for(let e of[`spine`,`chest`,`upperChest`,`neck`,`head`])this.child(e)}solve(e){let{rot:t,pos:n,body:r}=this,i=r.rest;this.trunk(e.hips,e.pelvis,e.chest,e.head);for(let a of Xd){let o=a===`L`?1:-1,s=e=>`${e}${a}`,c=e.arm[a];t[s(`shoulder`)].copy(t.upperChest),this.child(s(`shoulder`));let l=i[s(`upperArm`)].clone().sub(i[s(`shoulder`)]).applyQuaternion(t.upperChest).add(n[s(`shoulder`)]),u=c.hand.clone().sub(l).normalize().applyQuaternion(t.upperChest.clone().invert()),d=Qd(-.25,1,u.y),f=Qd(.15,1,u.z),p=Qd(.15,1,-u.z),m=(-5+34*d+14*c.shrug)*zd,h=(15*f-8*p+Hd*(c.protract??0))*zd,g=new I().setFromAxisAngle(Rd,o*m).multiply(new I().setFromAxisAngle(Ld,-o*h));t[s(`shoulder`)].copy(t.upperChest).multiply(g),this.child(s(`upperArm`));let _=n[s(`upperArm`)],v=ef(_,c.hand,r.upperArm,r.lowerArm,c.elbow),y=v.clone().add(c.hand.clone().sub(v).setLength(r.lowerArm)),b=v.clone().sub(_).cross(y.clone().sub(v)).lengthSq()>1e-9?$d(v.clone().sub(_).add(v.clone().sub(y)),y.clone().sub(_)):$d(c.elbow,y.clone().sub(_));Jd(v.clone().sub(_),b,t[s(`upperArm`)]).multiply(this.restFrame[`arm${a}`]),Jd(y.clone().sub(v),b,t[s(`lowerArm`)]).multiply(this.restFrame[`arm${a}`]),n[s(`lowerArm`)].copy(v),n[s(`hand`)].copy(y),t[s(`hand`)].copy(c.rot);let x=t[s(`lowerArm`)].clone().invert().multiply(c.rot),S=new I(x.x,0,0,x.w);S.lengthSq()<1e-8?S.identity():S.normalize(),t[s(`foreTwist`)].copy(t[s(`lowerArm`)]).multiply(S),this.child(s(`foreTwist`));let C=c.grip,w=e=>new I().setFromAxisAngle(Rd,-o*e*zd);t[s(`fingers1`)].copy(c.rot).multiply(w(8+62*C)),t[s(`fingers2`)].copy(t[s(`fingers1`)]).multiply(w(10+78*C)),t[s(`fingers3`)].copy(t[s(`fingers2`)]).multiply(w(6+50*C)),t[s(`thumb1`)].copy(c.rot).multiply(new I().setFromAxisAngle(Id,o*(10+55*C)*zd)).multiply(new I().setFromAxisAngle(Ld,o*20*C*zd)),t[s(`thumb2`)].copy(t[s(`thumb1`)]).multiply(new I().setFromAxisAngle(Ld,o*30*C*zd));for(let e of[`fingers1`,`fingers2`,`fingers3`,`thumb1`,`thumb2`])this.child(s(e));let T=e.leg[a];this.child(s(`upperLeg`));let E=n[s(`upperLeg`)],D=ef(E,T.foot,r.upperLeg,r.lowerLeg,T.knee),O=D.clone().add(T.foot.clone().sub(D).setLength(r.lowerLeg)),k=D.clone().sub(E).cross(O.clone().sub(D)).lengthSq()>1e-9?$d(D.clone().sub(E).add(D.clone().sub(O)),O.clone().sub(E)):$d(T.knee,O.clone().sub(E));Jd(D.clone().sub(E),k,t[s(`upperLeg`)]).multiply(this.restFrame[`thigh${a}`]),Jd(O.clone().sub(D),k,t[s(`lowerLeg`)]).multiply(this.restFrame[`shin${a}`]),n[s(`lowerLeg`)].copy(D),n[s(`foot`)].copy(O),t[s(`foot`)].copy(T.rot),t[s(`toes`)].copy(T.rot).multiply(new I().setFromAxisAngle(Id,-T.toes*zd)),this.child(s(`toes`))}}local(e,t){let n=Md[e];return n?t.copy(this.rot[n]).invert().multiply(this.rot[e]):t.copy(this.rot[e])}},Qd=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function $d(e,t){let n=t.clone().normalize(),r=e.clone().addScaledVector(n,-e.dot(n));return r.lengthSq()<1e-10&&r.set(n.z,0,-n.x),r.lengthSq()<1e-10&&r.set(0,n.z,-n.y),r.normalize()}function ef(e,t,n,r,i){let a=t.clone().sub(e),o=Math.min(Math.max(a.length(),Math.abs(n-r)+1e-4),n+r-1e-4),s=a.normalize(),c=(n*n-r*r+o*o)/(2*o),l=Math.sqrt(Math.max(n*n-c*c,0));return e.clone().addScaledVector(s,c).addScaledVector($d(i,s),l)}var tf=()=>({hips:new L,pelvis:new I,chest:new I,head:new I,arm:{L:nf(),R:nf()},leg:{L:rf(),R:rf()}}),nf=()=>({hand:new L,rot:new I,elbow:new L(0,0,-1),grip:0,shrug:0}),rf=()=>({foot:new L,rot:new I,knee:new L(0,0,1),toes:0}),af=new Map;function of(e,t=`aura`){let n=`${t}-${e}`,r=af.get(n);return r||(r=new Eu().loadAsync(`/aura-calisthenics/characters/${n}.glb`),r.catch(()=>af.delete(n)),af.set(n,r)),r}var sf=null;function cf(){if(sf)return sf;let e=document.createElement(`canvas`);e.width=512,e.height=174;let t=e.getContext(`2d`),n=()=>{t.clearRect(0,0,e.width,e.height),t.font=`400 150px 'Instrument Serif', Georgia, serif`,t.textBaseline=`alphabetic`,t.fillStyle=`#f4f2ec`;let n=t.measureText(`Aura`).width,r=(e.width-n-40)/2;t.fillText(`Aura`,r,138),t.fillStyle=`#ecc77f`,t.beginPath(),t.arc(r+n+22,125,13.5,0,Math.PI*2),t.fill()};n();let r=new xa(e);return r.colorSpace=He,r.anisotropy=4,document.fonts?.load(`150px 'Instrument Serif'`).then(()=>{n(),r.needsUpdate=!0}),sf=r,r}var lf=`
attribute vec4 _muscle;
uniform float uAct[${bu}];
varying vec2 vMus;
varying vec3 vRest;
varying float vFront;
`,uf=`
{
  float a0 = uAct[int(_muscle.x + 0.5)], a1 = uAct[int(_muscle.z + 0.5)];
  float m0 = _muscle.y / 255.0, m1 = _muscle.w / 255.0;
  vMus = a0 * m0 >= a1 * m1 ? vec2(a0, m0) : vec2(a1, m1);
  vRest = position;
  vFront = normal.z;
}
`,df=`
varying vec2 vMus;
varying vec3 vRest;
varying float vFront;
uniform float uMuscle, uCharge, uRim, uCloth, uShade, uHair, uHairCharge;
uniform vec3 uGlowA, uGlowB, uChargeColor, uHairGlow, uRimColor, uShadeTint, uCosmosA, uCosmosB;
uniform float uDeep, uCosmos, uClock;
float skyHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float skyNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(skyHash(i), skyHash(i + vec3(1, 0, 0)), f.x), mix(skyHash(i + vec3(0, 1, 0)), skyHash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(skyHash(i + vec3(0, 0, 1)), skyHash(i + vec3(1, 0, 1)), f.x), mix(skyHash(i + vec3(0, 1, 1)), skyHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
// Stars that stay where they are on the body: one, perhaps, in each cell of a grid laid through it.
float skyStars(vec3 p, float cells, float share, float size) {
  vec3 g = p * cells, id = floor(g);
  float h = skyHash(id);
  vec3 at = vec3(skyHash(id + 3.1), skyHash(id + 7.7), skyHash(id + 5.3)) * 0.6 + 0.2;
  float d = length(fract(g) - at);
  float twinkle = 0.65 + 0.35 * sin(uClock * (1.0 + 3.0 * h) + h * 40.0);
  return step(1.0 - share, h) * pow(max(0.0, 1.0 - d / size), 2.5) * twinkle;
}
uniform sampler2D uLogo;
uniform vec4 uLogoRect;
`,ff=`
{
  float fres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.4);
  // Muscle layer: the working muscle takes on the colour and gives off light, with a brighter contour.
  // Through clothing only the middle of a muscle shows: the cloth is a coarser surface than the skin.
  float fill = smoothstep(mix(0.08, 0.3, uCloth), mix(0.5, 0.8, uCloth), vMus.y);
  float line = smoothstep(0.03, 0.22, vMus.y) * (1.0 - smoothstep(0.26, 0.6, vMus.y));
  // Clamped: at the very edge of a triangle the interpolated value can dip below zero.
  float level = pow(max(vMus.x, 0.0), 0.8) * uMuscle * mix(1.0, 0.5, uCloth);
  float lit = level * fill;
  float edge = level * line * (1.0 - uCloth);
  // The lit skin takes the colour and stops mirroring the room, so it stays a colour; the studio light still models it.
  diffuseColor.rgb = mix(diffuseColor.rgb, uGlowA * 0.62, saturate(lit * 0.95 + edge * 0.5));
  roughnessFactor = mix(roughnessFactor, 0.8, saturate(lit));
  metalnessFactor *= 1.0 - saturate(lit);
  totalEmissiveRadiance += uGlowA * lit * (0.3 + 0.5 * fres) + uGlowB * (edge * 0.7 + lit * fres * 0.5);
  // Base: a quiet rim of light. Charge: the body itself glows.
  totalEmissiveRadiance += uRimColor * fres * min(uRim, 0.6) * mix(1.0, 0.35, uCloth);
  // A drawn body keeps its colours: the charge shows at its edge only.
  float drawnBody = step(0.5, uShade);
  totalEmissiveRadiance += uChargeColor * uCharge * mix(0.1 + 1.5 * fres, 0.9 * pow(fres, 1.6), drawnBody) * mix(1.0, 0.5, uCloth);
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb, vec3(1.0), 0.35) , uCharge * (1.0 - uCloth) * (1.0 - drawnBody));
  // Hair that turns the colour of the Aura.
  float turned = uHair * uHairCharge;
  diffuseColor.rgb = mix(diffuseColor.rgb, uHairGlow, turned * 0.9);
  totalEmissiveRadiance += uHairGlow * turned * (0.35 + 0.9 * fres);
  if (uCloth > 0.5 && vFront > 0.35) {
    vec2 uv = (vRest.xy - uLogoRect.xy) / uLogoRect.zw + 0.5;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
      vec4 mark = texture2D(uLogo, uv);
      diffuseColor.rgb = mix(diffuseColor.rgb, mark.rgb, mark.a * smoothstep(0.35, 0.6, vFront));
    }
  }
}
`,pf=`
if (uShade > 0.5) {
  #if NUM_DIR_LIGHTS > 0
    float ndl = dot(normal, directionalLights[0].direction);
  #else
    float ndl = normal.y;
  #endif
  float open = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow keyShadow = directionalLightShadows[0];
    open = receiveShadow ? getShadow(directionalShadowMap[0], keyShadow.shadowMapSize, keyShadow.shadowIntensity, keyShadow.shadowBias, keyShadow.shadowRadius, vDirectionalShadowCoord[0]) : 1.0;
  #endif
  float lightv = (ndl * 0.5 + 0.5) * mix(0.62, 1.0, open);
  float edge = 1.0 - saturate(dot(normal, normalize(vViewPosition)));
  vec3 base = diffuseColor.rgb;
  vec3 drawn;
  if (uShade < 1.5) {
    // Cel: light and shade, a small highlight, and a cool tint in the shade.
    float lit = smoothstep(0.6, 0.62, lightv);
    float hot = smoothstep(0.9, 0.925, lightv);
    drawn = mix(base * uShadeTint, base, lit) + base * 0.14 * hot;
    // A third tone where the light does not reach at all: black, as a brush would leave it.
    drawn = mix(drawn, base * 0.06, uDeep * (1.0 - smoothstep(0.3, 0.32, lightv)));
    // Light from behind catches the edge that is turned away from the key.
    drawn += uRimColor * smoothstep(0.62, 0.66, edge) * (1.0 - lit) * uRim * 0.5;
  } else {
    // Ink: black, a hatched middle tone, and bare paper where the light lands.
    float mid = smoothstep(0.36, 0.375, lightv);
    float lit = smoothstep(0.6, 0.615, lightv);
    float hatch = step(0.5, fract((gl_FragCoord.x + gl_FragCoord.y) * 0.16));
    float tone = mix(0.05, mix(0.34 + 0.2 * hatch, 1.0, lit), mid);
    // The lines between muscles: wherever the surface folds inward.
    vec3 px = -dFdx(vViewPosition), py = -dFdy(vViewPosition);
    float bend = (dot(dFdx(normal), px) + dot(dFdy(normal), py)) / max(dot(px, px) + dot(py, py), 1e-9);
    float groove = smoothstep(7.0, 22.0, -bend) * (1.0 - uCloth);
    drawn = base * tone * (1.0 - 0.8 * groove);
    drawn += vec3(1.0, 0.36, 0.24) * smoothstep(0.7, 0.74, edge) * (1.0 - mid) * 0.22;
  }
  outgoingLight = drawn + totalEmissiveRadiance;
}
// A body that has become a piece of night sky: cloud in two colours, stars near and far, and light at its edge.
if (uCosmos > 0.001) {
  vec3 p = vRest;
  float cloud = skyNoise(p * 3.2 + vec3(0.0, uClock * 0.05, 0.0)) * 0.6 + skyNoise(p * 8.5 - vec3(uClock * 0.03)) * 0.4;
  vec3 sky = mix(uCosmosA, uCosmosB, smoothstep(0.42, 0.8, cloud)) * (0.2 + 0.5 * cloud);
  float stars = skyStars(p, 30.0, 0.34, 0.24) + skyStars(p + 4.7, 13.0, 0.26, 0.3) * 1.3 + skyStars(p + 9.1, 64.0, 0.45, 0.34) * 0.7;
  float rim = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 3.2);
  vec3 night = sky + vec3(1.0, 0.97, 1.0) * stars * 2.4 + mix(uCosmosA, vec3(1.0), 0.8) * rim * 1.1;
  outgoingLight = mix(outgoingLight, night, uCosmos);
}
`,mf=null;function hf(){return mf||(mf=new Ma({depthPacking:Ve}),mf.onBeforeCompile=e=>{e.vertexShader=Jl(e.vertexShader)},mf.customProgramCacheKey=()=>`aura-shadow`,mf)}function gf(e,t,n){let r=new ka(e===`cloth`?{color:1184278,roughness:.78,metalness:0}:e===`hair`?{color:12171714,roughness:.5,metalness:.3}:e===`accent`?{color:15517567,roughness:.7,metalness:0}:{color:13027022,roughness:.4,metalness:.32});return r.onBeforeCompile=r=>{Object.assign(r.uniforms,{uAct:{value:t.act},uMuscle:t.muscle,uGlowA:t.glowA,uGlowB:t.glowB,uCharge:t.charge,uChargeColor:t.chargeColor,uRim:t.rim,uRimColor:t.rimColor,uShadeTint:t.shadeTint,uDeep:t.deep,uCosmos:t.cosmos,uClock:t.clock,uCosmosA:t.cosmosA,uCosmosB:t.cosmosB,uCloth:{value:+(e===`cloth`||e===`accent`)},uShade:t.shade,uHair:{value:+(e===`hair`)},uHairGlow:t.hairGlow,uHairCharge:t.hairCharge,uLogo:{value:cf()},uLogoRect:{value:[n.x,n.y,n.width,n.height]}}),r.vertexShader=Jl(r.vertexShader).replace(`#include <common>`,`#include <common>\n${lf}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>\n${uf}`),r.fragmentShader=r.fragmentShader.replace(`#include <common>`,`#include <common>\n${df}`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>\n${ff}`).replace(`#include <opaque_fragment>`,`${pf}\n#include <opaque_fragment>`)},r.customProgramCacheKey=()=>`aura-${e}`,r}var _f=class{id;group=new hi;rig;look={act:new Float32Array(bu),muscle:{value:1},glowA:{value:new B(16723855)},glowB:{value:new B(14268671)},charge:{value:0},chargeColor:{value:new B(10980351)},rim:{value:.22},shade:{value:0},rimColor:{value:new B(`#cfdaff`)},shadeTint:{value:new L(.5,.48,.66)},deep:{value:0},cosmos:{value:0},cosmosA:{value:new B(`#7a4dff`)},cosmosB:{value:new B(`#ff7ad9`)},clock:{value:0},hairGlow:{value:new B(16777215)},hairCharge:{value:0}};style=n.aura;meshes=[];bones={};materials=[];kinds=new Map;outlines=[];constructor(e,t){this.id=e,this.rig=new Zd(e);let n=wd(t.scene),r=t.scene.userData.logo??t.scenes[0]?.userData.logo??{x:0,y:0,width:.001,height:.001};n.traverse(e=>{e.isBone&&Od.includes(e.name)&&(this.bones[e.name]=e);let t=e;if(!t.isMesh)return;let n=t.material.name,i=n===`cloth`||n===`hair`||n===`accent`?n:`skin`,a=gf(i,this.look,r);this.kinds.set(a,i),t.geometry.getAttribute(`_muscle`)||(t.geometry=t.geometry.clone(),t.geometry.setAttribute(`_muscle`,t.geometry.getAttribute(`skinIndex`).clone()),t.geometry.getAttribute(`_muscle`).array.fill(0)),t.material=a,t.frustumCulled=!1,t.castShadow=!0,t.customDepthMaterial=hf(),this.materials.push(a),this.meshes.push(t)}),this.group.add(n)}setStyle(e){let n=t(e);this.style=n,this.look.rimColor.value.set(n.rimColour),this.look.shadeTint.value.set(...n.shadeTint??[.5,.48,.66]),this.look.deep.value=n.deep??0;let r=n.shading!==`studio`;this.look.shade.value=n.shading===`cel`?1:n.shading===`ink`?2:0,this.look.rim.value=n.rim,n.hairGlow||(this.look.hairCharge.value=0);for(let t of this.materials){let i=this.kinds.get(t);i===`skin`?(t.color.set(e?.skin??`#c6c6ce`),n.skinWash&&t.color.lerp(new B(n.skinWash.colour),n.skinWash.amount),t.roughness=n.roughness,t.metalness=n.metalness):i===`hair`?(t.color.set(e?.hair??`#b9b9c2`),t.roughness=r?1:.5,t.metalness=r?0:.3):i===`accent`?t.color.set(e?.accent??`#ecc77f`):t.color.set(n.cloth),t.envMapIntensity=+!r}for(let e of this.meshes)e.receiveShadow=r;for(let e of this.outlines)e.removeFromParent(),e.material.dispose();if(this.outlines.length=0,n.outline>0)for(let e of this.meshes){let t=new ji(e.geometry,new ii({side:1,uniforms:{uWidth:{value:n.outline*this.rig.body.scale},uColour:{value:new B(n.outlineColour)},uCosmos:this.look.cosmos},vertexShader:`
            #include <common>
            #include <skinning_pars_vertex>
            ${Kl}
            uniform float uWidth;
            void main() {
              vec3 objectNormal = normal;
              #include <skinbase_vertex>
              ${ql}
              #include <skinnormal_vertex>
              vec3 transformed = position;
              #include <skinning_vertex>
              transformed += normalize(objectNormal) * uWidth;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
            }`,fragmentShader:`uniform vec3 uColour; uniform float uCosmos; void main() { gl_FragColor = vec4(mix(uColour, vec3(1.0), uCosmos), 1.0); }`}));t.bind(e.skeleton,e.bindMatrix),t.frustumCulled=!1,e.parent.add(t),this.outlines.push(t)}}pose(e){let t=this.rig;t.solve(e);for(let e of Od)t.local(e,this.bones[e].quaternion);this.bones.hips.position.copy(t.pos.hips)}dispose(){for(let e of this.outlines)e.removeFromParent(),e.material.dispose();this.materials.forEach(e=>e.dispose()),this.group.removeFromParent()}};async function vf(e,t=`aura`){return new _f(e,await of(e,t))}var K=[[`L`,1],[`R`,-1]],q=Math.PI/180,J=(e,t,n=0)=>new L(n,t,e);function yf(e,t,n,r){let i=new L(0,e.rest.upperLegL.y-e.rest.hips.y,e.rest.upperLegL.z-e.rest.hips.z).applyQuaternion(t);return r.copy(n).sub(i)}function Y(e,t,n){for(let r=0;r<3;r++){e.solve(t);let r=e.pos.upperArmL.clone().add(e.pos.upperArmR).multiplyScalar(.5);t.hips.add(n.clone().sub(r))}e.solve(t)}function bf(e,t,n,r){let i=(Math.atan2(e.ball.y,e.ball.z)-Math.atan2(n.y-t.y,n.z-t.z))/q;r.foot.copy(t),r.rot.copy(W(i)),r.toes=Math.max(0,Math.min(85,i))}function xf(e,t,n,r,i){bf(e,ef(t,n,(e.upperLeg+e.lowerLeg)*.998,e.ball.length(),r),n,i)}function Sf(e,t,n,r=.014){let i=e.ball.length(),a=(e.upperLeg+e.lowerLeg)*.998,o=a+e.trunk,s=.2;for(let e=0;e<12;e++)s=Math.asin(Math.max(-.5,Math.min(.95,(n-r-i*Math.cos(s))/o)));let c=J(Math.cos(s),Math.sin(s)),l=J(t-i*Math.sin(s),r+i*Math.cos(s));return{angle:s/q,pad:r,ankle:l,hip:l.clone().addScaledVector(c,a),shoulder:l.clone().addScaledVector(c,o)}}function Cf(e,t,n,r=3){let i=90-t.angle;n.pelvis.copy(W(i-r)),n.chest.copy(W(i+r*.6)),yf(e,n.pelvis,t.hip,n.hips);for(let[r,i]of K){let a=i*e.rest.upperLegL.x;bf(e,t.ankle.clone().setX(a),J(t.ankle.z+e.ball.length()*Math.sin(t.angle*q),t.pad,a),n.leg[r]),n.leg[r].knee.set(0,-1,.2)}}function wf(e,t,n,r,i,a=3,o=.014){let s=new L,c=r;for(let l=0;l<4;l++){let u=Sf(e.body,n,c,o);Cf(e.body,u,t,a),i(l?s:u.shoulder),e.solve(t),s.copy(e.pos.upperArmL).add(e.pos.upperArmR).multiplyScalar(.5),c+=r-s.y}return s}function Tf(e,t,n,r=50,i=0){let a=e.body;for(let[o,s]of K){let c=e.pos[`upperLeg${o}`],l=t.pelvis.clone().multiply(W(-n)).multiply(new I().setFromAxisAngle(new L(0,0,1),s*i*q)),u=new L(0,-1,0).applyQuaternion(l),d=t.leg[o];d.foot.copy(c).addScaledVector(u,(a.upperLeg+a.lowerLeg)*.999),d.rot.copy(l).multiply(W(r)),d.knee.copy(new L(0,0,1).applyQuaternion(l)),d.toes=-18}}var X=e=>.024*e.scale;function Ef(e,t,n,r,i,a=8,o=0){for(let[s,c]of K){let l=t.arm[s];l.hand.set(c*r,o+X(e),n),l.rot.copy(G(s,new L(c*Math.sin(a*q),0,Math.cos(a*q)),new L(0,-1,0))),l.elbow.set(c*i.x,i.y,i.z),l.grip=.04,l.shrug=0}}function Df(e,t,n,r,i,a,o,s=1){let c=a.clone().normalize(),l=o.clone().normalize();t.hand.copy(r).addScaledVector(c,i*.35-e.knuckle).addScaledVector(l,-(i+.012*e.scale)),t.rot.copy(G(n,c,l)),t.grip=s}function Of(e,t,n,r,i=`over`){for(let[a,o]of K)Df(e,t.arm[a],a,new L(o*r,n.height,n.z??0),n.radius,new L(0,1,0),new L(0,0,i===`over`?1:-1))}var kf={low:1.5,square:1.05,tall:.82},Z=e=>e*e*(3-2*e);function Q(e,t=.42,n=.08){if(e<t)return Z(e/t);if(e<t+n)return 1;let r=1-t-n;return 1-Z(Math.min(1,(e-t-n)/(r*.86)))}var $=(e,t,n)=>e+(t-e)*n,Af=e=>({height:2.32*e.scale,width:1.3*e.scale,radius:.0165*e.scale});function jf(e,t,n,r,i=0){let a=e.body,o=a.scale,s=Af(a),c=a.rest.upperArmL.x+.125*o;Of(a,t,s,c);let l=t.arm.L.hand,u=a.upperArm+a.lowerArm,d=e=>new L(0,l.y-Math.sqrt(Math.max(0,(u*.9985)**2-e**2)),l.z+.004*o),f=new L(0,l.y-.04*o,l.z-.08*o),p=e=>{let t=e.clone().lerp(f,n);return t.z+=Math.sin(n*Math.PI)*-.02*o+i*.03*o,t},m=p(d(c-a.rest.upperArmL.x));t.chest.copy(W($(1,-13,n)+i*2)),t.pelvis.copy(W($(5,0,n)+i*3)),t.head.copy(W($(-4,-16,Z(n))));for(let[e,i]of K){let a=t.arm[e];a.elbow.set(i*1,-.5,$(.5,-.15,n)),a.shrug=$(1-1.2*r,-.9,n)}t.hips.set(0,m.y-a.trunk,m.z),Y(e,t,m),Y(e,t,p(d(Math.hypot(l.x-e.pos.upperArmL.x,l.z-e.pos.upperArmL.z)))),Tf(e,t,$(9,14,n),46)}var Mf={id:`pull-up`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.4,camera:`back`,azimuth:152,elevation:2,beat:.5,props:e=>[{kind:`bar`,...Af(e)}],detail:{forearm_flex:.5,forearm_ext:.3,rear_cuff:.6},standard:`Starts from a dead hang with straight arms; chin clearly over the bar; no swing or kick; lowered under control to straight arms.`,effort:e=>.3+.7*Q(e,.4,.1),pose(e,t,n){let r=Q(e,.4,.1);jf(t,n,Math.max(0,(r-.08)/.92),Math.min(1,r/.08))}},Nf={id:`dead-hang`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`front`,azimuth:28,elevation:2,props:e=>[{kind:`bar`,...Af(e)}],standard:`Full grip, arms straight, shoulders relaxed up by the ears, body still, feet clear of the floor.`,effort:()=>.6,pose(e,t,n){jf(t,n,0,.12+.05*Math.sin(e*Math.PI*2),Math.sin(e*Math.PI*2)*.35)}},Pf=Math.PI/180,Ff=e=>[{kind:`bar`,...Af(e)}],If=e=>new L(0,-Math.cos(e*Pf),Math.sin(e*Pf)),Lf=e=>new L(0,Math.sin(e*Pf),Math.cos(e*Pf));function Rf(e,t,n,r=0,i=46){let a=e.body,o=n-r;for(let[s]of K){let c=t.leg[s],l=e.pos[`upperLeg${s}`];r<1?c.foot.copy(l).addScaledVector(If(n),(a.upperLeg+a.lowerLeg)*.999):c.foot.copy(l).addScaledVector(If(n),a.upperLeg).addScaledVector(If(o),a.lowerLeg),c.knee.copy(Lf(n)),c.rot.copy(W(-o+i)),c.toes=-18}}function zf(e,t,n){let r=e.body,i=r.scale,a=r.rest.upperArmL.x+(n.wide??.125)*i;Of(r,t,Af(r),a,n.grip);let o=t.arm.L.hand,s=(r.upperArm+r.lowerArm)*.9985,c=(n.back??0)*i-.004*i,[l,u]=n.top??[.04,.08],d=new L(0,o.y-l*i,o.z-u*i),f=n.u,p=e=>{let t=new L(0,o.y-Math.sqrt(Math.max(0,s**2-e**2-c**2)),o.z-c).lerp(d,f);return t.z-=Math.sin(f*Math.PI)*(n.arc??.02)*i,t},[m,h,g,_]=[n.lean??[1,-13],n.tilt??[5,0],n.look??[-4,-16],n.elbow??[1,-.5,.5,-.15]];t.chest.copy(W($(m[0],m[1],f))),t.pelvis.copy(W($(h[0],h[1],f))),t.head.copy(W($(g[0],g[1],Z(f))));for(let[e,r]of K){let i=t.arm[e];i.elbow.set(r*_[0],_[1],$(_[2],_[3],f)),i.shrug=$(1-1.2*n.active,-.9,f)}let v=p(a-r.rest.upperArmL.x);t.hips.set(0,v.y-r.trunk,v.z),Y(e,t,v),Y(e,t,p(Math.abs(o.x-e.pos.upperArmL.x)))}var Bf={forearm_flex:.5,forearm_ext:.3},Vf={id:`scap-pull`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.6,camera:`back`,azimuth:160,elevation:2,beat:.34,props:Ff,standard:`Arms straight the whole time; the shoulders pull down away from the ears and the body visibly rises; a one-second pause at the top; lowered slowly, no bounce.`,effort:e=>.3+.7*Q(e,.28,.28),pose(e,t,n){let r=Q(e,.28,.28);zf(t,n,{u:0,active:.05+1.5*r,lean:[1-4*r,0],tilt:[5-2*r,0],look:[-4-4*r,0]}),Rf(t,n,9+3*r)}},Hf={id:`negative-pullup`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:7.4,camera:`back`,azimuth:152,elevation:2,beat:.74,props:Ff,detail:{...Bf,rear_cuff:.6},standard:`Starts with the chin over the bar; lowered evenly for at least five seconds, no drop through the middle; finishes in a full hang with straight arms.`,effort:e=>e<.72?.75+.25*Math.sin(e/.72*Math.PI):.2,pose(e,t,n){let r=Math.min(1,e/.72),i=e<.82?0:Z((e-.82)/.18),a=e<.72?1-(.85*r+.15*Z(r)):i;zf(t,n,{u:Math.max(0,(a-.08)/.92),active:e<.72?Math.min(1,a/.08):i});let o=Math.sin(i*Math.PI);Rf(t,n,$(9,14,a)+10*o,34*o)}},Uf={id:`chin-up`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.4,camera:`three-quarter`,azimuth:30,elevation:2,beat:.5,props:Ff,detail:Bf,standard:`Underhand grip at shoulder width; starts from a dead hang with straight arms; chin clearly over the bar; no kip or leg swing; lowered to straight arms.`,effort:e=>.3+.7*Q(e,.4,.1),pose(e,t,n){let r=Q(e,.4,.1),i=Math.max(0,(r-.08)/.92);zf(t,n,{u:i,active:Math.min(1,r/.08),grip:`under`,wide:.012,top:[.045,.15],elbow:[.32,-1,.6,.45],lean:[1,-11],look:[-4,-14],arc:.1}),Rf(t,n,$(9,14,i))}},Wf={id:`chest-to-bar`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.6,camera:`back`,azimuth:148,elevation:2,beat:.5,props:Ff,detail:{...Bf,rear_cuff:.8},standard:`From a dead hang with straight arms; the chest, not the chin, comes to the bar; elbows finish behind the body; no kip or kick; lowered to straight arms.`,effort:e=>.3+.7*Q(e,.4,.1),pose(e,t,n){let r=Q(e,.4,.1),i=Math.max(0,(r-.08)/.92);zf(t,n,{u:i,active:Math.min(1,r/.08),top:[-.115,.12],lean:[1,-27],tilt:[5,-9],look:[-4,-30],elbow:[1,-.55,.5,-.75],arc:.035}),Rf(t,n,$(9,18,i))}},Gf={id:`hanging-knee-raise`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.4,camera:`side`,azimuth:62,elevation:3,beat:.42,props:Ff,standard:`Shoulders set, arms straight; knees above hip height with the pelvis curled up, not only the thighs lifted; lowered slowly; the body does not swing.`,effort:e=>.25+.75*Q(e,.36,.1),pose(e,t,n){let r=Q(e,.36,.1);zf(t,n,{u:0,active:.85,back:.035*r,lean:[1-5*r,0],tilt:[5-31*r,0],look:[-4+6*r,0]}),Rf(t,n,$(8,116,r),$(4,108,r),$(46,30,r))}},Kf={id:`hanging-leg-raise`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:5.4,camera:`side`,azimuth:62,elevation:3,beat:.3,props:Ff,standard:`Legs straight and together, toes pointed; raised to horizontal; no swing to start it; about three seconds down to a still hang.`,effort:e=>.25+.75*Q(e,.26,.06),pose(e,t,n){let r=Q(e,.26,.06);zf(t,n,{u:0,active:.9,back:.06*r,lean:[1-8*r,0],tilt:[5-23*r,0],look:[-4+5*r,0]}),Rf(t,n,$(8,92,r))}},qf=e=>[.2*e.scale,.079*e.scale],Jf=new Map;function Yf(e){let t=e.body,n=Jf.get(t.id);if(n)return n;let r=Af(t),[i,a]=qf(t),o=Math.hypot((t.upperLeg+t.lowerLeg)*.999+i,a),s=new L(0,r.height-r.radius-.012*t.scale,0),c=ip(),l=t=>(Qf(e,c,1,t),Xf(e).distanceTo(s)-o),u=-20,d=l(u),f=-45,p=l(f);for(let e=0;e<12&&Math.abs(p)>2e-4&&p!==d;e++){let e=Math.max(-80,Math.min(0,f-p*(f-u)/(p-d)));u=f,d=p,f=e,p=l(f)}let m=s.sub(Xf(e)),h={lean:f,legs:(Math.atan2(m.z,-m.y)/Pf+360)%360-Math.atan2(a,o)/Pf};return Jf.set(t.id,h),h}var Xf=e=>e.pos.upperLegL.clone().add(e.pos.upperLegR).multiplyScalar(.5),Zf=22;function Qf(e,t,n,r){let i=(e.body.upperArm+e.body.lowerArm)/e.body.scale;zf(e,t,{u:0,active:.9+.3*n,back:i*Math.sin(Zf*n*Pf),lean:[$(1,r,n),0],tilt:[$(5,r-44,n),0],look:[$(-4,r+18,n),0]})}var $f={id:`toes-to-bar`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:4.6,camera:`side`,azimuth:64,elevation:3,beat:.4,props:Ff,standard:`From a still hang; legs straight throughout; the toes touch the bar; arms straight; no kip; lowered under control to a still hang.`,effort:e=>.25+.75*Q(e,.34,.07),pose(e,t,n){let r=Z(Q(e,.34,.07)),i=Yf(t);Qf(t,n,r,i.lean),Rf(t,n,$(8,i.legs,r),0,$(46,50,r))}};function ep(e,t,n){let r=e.body,i=r.scale,a=Af(r),o=r.rest.upperArmL.x+.1*i,s=16*Pf;for(let[e,n]of K)Df(r,t.arm[e],e,new L(n*o,a.height,0),a.radius,new L(0,Math.cos(s),Math.sin(s)),new L(0,-Math.sin(s),Math.cos(s))),t.arm[e].elbow.set(n,-.2,-.4),t.arm[e].shrug=-.7;let c=t.arm.L.hand,l=(r.upperArm+r.lowerArm)*.9985,u=n.off*i,d=e=>new L(0,c.y-Math.sqrt(Math.max(0,l**2-e**2-u**2)),c.z-u);t.chest.copy(W(n.chest)),t.pelvis.copy(W(n.pelvis)),t.head.copy(W(n.head));let f=d(o-r.rest.upperArmL.x);t.hips.set(0,f.y,f.z+r.trunk),Y(e,t,f),Y(e,t,d(Math.abs(c.x-e.pos.upperArmL.x))),Rf(e,t,n.hip,n.knee,40)}var tp=e=>.7*Math.sin(e*Math.PI*2)+.3*Math.sin(e*Math.PI*6+1),np={id:`tuck-fl`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:72,elevation:2,props:Ff,standard:`Arms locked; the back level with the floor and the hips at shoulder height, not hanging below; knees tight to the chest.`,effort:e=>.75+.1*tp(e),pose(e,t,n){let r=tp(e);ep(t,n,{off:.2,chest:-74.5+r,pelvis:-110.5+r,head:-58,hip:250-r,knee:150})}},rp={id:`adv-tuck-fl`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:72,elevation:2,props:Ff,standard:`Arms locked; back flat and level with the floor; hips opened to 90° with the thighs upright; shoulders pulled down and back, not rolling forward.`,effort:e=>.8+.1*tp(e),pose(e,t,n){let r=tp(e);ep(t,n,{off:.275,chest:-90+r,pelvis:-93+r,head:-78,hip:180-r,knee:96})}},ip=()=>({hips:new L,pelvis:W(0),chest:W(0),head:W(0),arm:{L:{hand:new L,rot:W(0),elbow:new L,grip:0,shrug:0},R:{hand:new L,rot:W(0),elbow:new L,grip:0,shrug:0}},leg:{L:{foot:new L,rot:W(0),knee:new L,toes:0},R:{foot:new L,rot:W(0),knee:new L,toes:0}}});function ap(e,t,n,r,i,a){let o=Af(e),s=100*a*Pf,c=new L(0,Math.cos(s),Math.sin(s)),l=new L(0,-Math.sin(s),Math.cos(s)),u=t.arm[n];u.hand.set(r*i,o.height,0).addScaledVector(c,o.radius*.35-e.knuckle*$(1,.45,a)).addScaledVector(l,-(o.radius+.012*e.scale)),u.rot.copy(G(n,c,l)),u.grip=$(1,.8,a)}var op=[Vf,Hf,Uf,Gf,Wf,Kf,$f,np,rp,{id:`muscle-up`,revision:1,stage:`tall`,kind:`reps`,period:5,camera:`side`,azimuth:58,elevation:4,beat:.66,props:Ff,detail:Bf,standard:`From a hang; pulled high enough that both elbows come over the bar together; the chest comes forward over the bar; finished with the arms locked out on top; minimal swing.`,effort:e=>e<.62?.5+.5*Math.sin(e/.62*Math.PI):.35,pose(e,t,n){let r=t.body,i=r.scale,a=Af(r),o=r.rest.upperArmL.x+.125*i,s=(r.upperArm+r.lowerArm)*.9985,c=e<.05?0:e<.27?Z((e-.05)/.22):e<.43?1+Z((e-.27)/.16):e<.62?2+Z((e-.43)/.19):e<.72?3:3*(1-Z((e-.72)/.26)),l=Math.min(3,Math.max(0,c)),u=Math.min(2,Math.floor(l)),d=l-u,f=e=>{let t=Math.sqrt(Math.max(0,s**2-e**2)),c=.035*i,l=[{y:-(r.knuckle-a.radius*.35)-t,z:-.03*i,chest:1,pelvis:5,head:-4,turn:0,legs:9,shrug:.4,elbow:[1,-.5,.5]},{y:.05*i,z:-.19*i,chest:-16,pelvis:-14,head:-14,turn:.12,legs:30,shrug:-.9,elbow:[.9,-.5,-.8]},{y:.135*i,z:.015*i,chest:40,pelvis:30,head:14,turn:1,legs:-8,shrug:.2,elbow:[.55,.35,-1]},{y:c+Math.sqrt(Math.max(0,(s*.999)**2-e**2-(.05*i)**2)),z:.016*i,chest:9,pelvis:6,head:2,turn:1,legs:4,shrug:-.6,elbow:[.6,.1,-1]}],f=l[u],m=l[u+1],h=e=>$(f[e],m[e],d);n.chest.copy(W(h(`chest`))),n.pelvis.copy(W(h(`pelvis`))),n.head.copy(W(h(`head`)));for(let[e,t]of K)ap(r,n,e,t,o,h(`turn`)),n.arm[e].elbow.set(t*$(f.elbow[0],m.elbow[0],d),$(f.elbow[1],m.elbow[1],d),$(f.elbow[2],m.elbow[2],d)),n.arm[e].shrug=h(`shrug`);p=h(`legs`);let g=u===1?Math.sin(d*Math.PI)*.03*i:u===0?Math.sin(d*Math.PI)*.025*i:0;return new L(0,a.height+h(`y`),h(`z`)-g)},p=0,m=f(o-r.rest.upperArmL.x);n.hips.set(0,m.y-r.trunk,m.z),Y(t,n,m),Y(t,n,f(Math.abs(n.arm.L.hand.x-t.pos.upperArmL.x))),Rf(t,n,p,0,44)}}],sp=e=>Math.sin(e*Math.PI*2),cp={id:`plank`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`hold`,period:4.6,camera:`side`,azimuth:64,elevation:8,detail:{delt_lat:.2,delt_ant:.5},standard:`Elbows under the shoulders; heels, hips and shoulders in one line; no sag in the lower back and no hips in the air; breathing.`,effort:()=>.7,pose(e,t,n){let r=t.body,i=r.scale,a=.04*i,o=wf(t,n,0,a+r.upperArm+.002*i*sp(e),e=>{for(let[t,o]of K){let s=n.arm[t];s.hand.set(o*r.rest.upperArmL.x*.97,a-.004*i,e.z+r.lowerArm),s.rot.copy(G(t,new L(-o*.1,0,1).normalize(),new L(0,-1,0))),s.elbow.set(o*.05,-1,-.05),s.grip=.1,s.shrug=-.1}},4),s=Math.asin(Math.min(1,(o.y-t.pos.upperLegL.y)/r.trunk))*(180/Math.PI);n.head.copy(W(90-s-6))}},lp={id:`hollow-hold`,revision:1,stage:`low`,kind:`hold`,period:4.6,camera:`side`,azimuth:62,elevation:9,standard:`Lower back stays on the floor; legs straight and low; shoulder blades off the floor; arms by the ears; no arch.`,effort:()=>.8,pose(e,t,n){let r=t.body,i=r.scale,a=1+.05*sp(e);n.pelvis.copy(W(-99)),n.chest.copy(W(-90+15*a)),n.head.copy(W(-90+24*a)),n.hips.set(0,.112*i,0),t.solve(n);for(let[e,i]of K){let o=n.arm[e],s=new L(i*.1,Math.sin(15*a*Math.PI/180),-Math.cos(15*a*Math.PI/180)).normalize();o.hand.copy(t.pos[`upperArm${e}`]).addScaledVector(s,(r.upperArm+r.lowerArm)*.99),o.elbow.set(i*1,.2,.2),o.rot.copy(G(e,s,new L(-i*.3,1,0).normalize())),o.grip=.08,o.shrug=.7}t.solve(n),Tf(t,n,23*a-9,48)}},up=(e,t,n)=>({id:`freestanding-hs`,revision:e,stage:`tall`,planted:[`handL`,`handR`],kind:`balance`,period:5.2,camera:`side`,azimuth:70,elevation:2,detail:{delt_post:.35,forearm_flex:.6,forearm_ext:.5},standard:n,effort:e=>.55+.2*Math.abs(Math.sin(e*Math.PI*2)),pose(e,n,r){let i=n.body,a=1.1*Math.sin(e*Math.PI*2)+.45*Math.sin(e*Math.PI*6+1),o=i.upperArm+i.lowerArm;Ef(i,r,0,i.rest.upperArmL.x*1.02,new L(1,0,.6),4);for(let[t]of K)r.arm[t].shrug=1,r.arm[t].grip=.12-.05*Math.sin(e*Math.PI*2);r.chest.copy(W(180+a*.6)),r.pelvis.copy(W(180-a*.9+1.5)),r.head.copy(W(180-t));let s=Math.PI/180*a,c=J(Math.sin(s)*o,X(i)+Math.cos(s)*o*.9975);r.hips.set(0,c.y+i.trunk,c.z),Y(n,r,c),Tf(n,r,-a*.7,52)}}),dp=up(2,46,`Arms locked; shoulders fully open and pushed tall; wrists, shoulders, hips and ankles on one line; no arch; legs together, toes pointed; the head lifted so the eyes are on the floor between the hands.`),fp=up(1,18,`Arms locked; shoulders fully open and pushed tall; wrists, shoulders, hips and ankles on one line; no arch; legs together, toes pointed.`),pp={id:`cat-cow`,revision:1,stage:`low`,planted:[`handL`,`handR`,`footL`,`footR`],kind:`mobility`,period:6.4,camera:`side`,azimuth:66,elevation:8,beat:.5,standard:`Hands under shoulders, knees under hips, arms straight; the movement comes from the whole spine, pelvis to neck, in both directions; no rocking back and forth.`,effort:e=>.35+.3*Math.abs(Math.cos(e*Math.PI*2)),shift:e=>{let t=.5+.5*Math.cos(e*Math.PI*2);return{abs:.25+.75*t,lower_back:1-.75*t,mid_back:1-.75*t}},pose(e,t,n){let r=t.body,i=r.scale,a=Math.cos(e*Math.PI*2),o=J(0,.052*i+r.upperLeg*.995),s=Math.asin((X(r)+(r.upperArm+r.lowerArm)*.975-o.y)/r.trunk)*(180/Math.PI),c=90-s;Ef(r,n,o.z+Math.cos(s*Math.PI/180)*r.trunk,r.rest.upperArmL.x,new L(.5,0,-1),4);for(let[e]of K)n.arm[e].shrug=.5*a;let l=(r.upperArm+r.lowerArm)*.996,u=e=>(n.pelvis.copy(W(c+e-21*a)),n.chest.copy(W(c+e+(a>0?24:17)*a)),n.head.copy(W(c+e+(a>0?58:46)*a)),yf(r,n.pelvis,o,n.hips),t.solve(n),t.pos.upperArmL.distanceTo(n.arm.L.hand)-l),d=0,f=u(d),p=f>0?4:-4,m=u(p);for(let e=0;e<6&&Math.abs(m)>2e-4&&m!==f;e++){let e=p-m*(p-d)/(m-f);d=p,f=m,p=Math.max(-25,Math.min(25,e)),m=u(p)}for(let[e,t]of K){let a=n.leg[e],s=t*r.rest.upperLegL.x;a.foot.set(s,.046*i,o.z-r.lowerLeg*.9995),a.rot.copy(W(176)),a.knee.set(0,-1,.35),a.toes=0}}},mp=new L(0,1,0),hp=e=>Math.sin(e*Math.PI*2),gp=(e,t,n)=>Z(Math.min(1,Math.max(0,(n-e)/(t-e)))),_p=e=>J(Math.cos(e),Math.sin(e)),vp=e=>.112*e.scale;function yp(e,t,n,r,i=.997){let a=e.body;for(let o=0;o<3;o++)e.solve(t),t.arm[n].hand.copy(e.pos[`upperArm${n}`]).addScaledVector(r,(a.upperArm+a.lowerArm)*i)}function bp(e,t,n,r,i,a=0){let o=e.body,s=t.leg[n];s.foot.copy(e.pos[`upperLeg${n}`]).addScaledVector(_p(r),o.upperLeg).addScaledVector(_p(i),o.lowerLeg*.999),s.rot.copy(W(-90-i/q+a)),s.knee.copy(_p(r+90*q)),s.toes=0}function xp(e,t,n,r){let i=e=>e.sub(n).applyQuaternion(t).add(n).add(r);i(e.hips);for(let n of[e.pelvis,e.chest,e.head])n.premultiply(t);for(let[n]of K)i(e.arm[n].hand),e.arm[n].rot.premultiply(t),e.arm[n].elbow.applyQuaternion(t),i(e.leg[n].foot),e.leg[n].rot.premultiply(t),e.leg[n].knee.applyQuaternion(t)}function Sp(e,t,n,r,i,a){t.hand.set(i.x-r*.034*e.scale,i.y+a+.03*e.scale,i.z),t.rot.copy(G(n,new L(r*.86,-.5,0),new L(-r*.5,-.86,0))),t.grip=.8}var Cp={id:`dead-bug`,revision:1,stage:`low`,planted:[`hips`],kind:`reps`,period:5.6,camera:`side`,azimuth:62,elevation:12,beat:.97,standard:`Lower back stays on the floor throughout; the opposite arm and leg reach long and low, slowly, without touching down; the other knee stays over the hip.`,effort:e=>.35+.65*Q(e*2%1,.42,.1),pose(e,t,n){let r=t.body,i=r.scale,a=e<.5,o=Q(e*2%1,.42,.1);n.hips.set(0,vp(r),0),n.pelvis.copy(W(-96)),n.chest.copy(W(-90)),n.head.copy(W(-95));for(let[e,t]of K){let a=n.arm[e];a.hand.copy(r.rest[`upperArm${e}`]).setY(.6*i),a.elbow.set(t*.6,0,1),a.grip=.15,a.shrug=0}t.solve(n);for(let[e,s]of K){let c=e===`L`===a?o:0,l=t.pos[`upperLeg${e}`],u=Math.asin((.105*i-l.y)/(r.upperLeg+r.lowerLeg)),d=$(90*q,u,c);bp(t,n,e,d,d-$(90,0,c)*q,12*c),n.leg[e].knee.set(s*.04,1,-.3);let f=(e===`R`===a?o:0)*78*q,p=new L(0,Math.cos(f),-Math.sin(f));n.arm[e].rot.copy(G(e,p,new L(-s,0,0))),yp(t,n,e,p)}}};function wp(e,t,n,r){let i=e.body,a=i.scale,o=i.upperArm+i.lowerArm,s=J(-i.trunk,.108*a),c=i.ankle+i.lowerLeg,l=i.trunk+i.upperLeg,u=Math.asin((c-s.y)/l),d=s.z+Math.sqrt(l*l-(c-s.y)**2),f=$(1*q,u,Z(n)),p=-90-f/q;t.pelvis.copy(W(p-4*n)),t.chest.copy(W(-90-f/q*.85)),t.head.copy(W(-93));for(let[e,n]of K){let c=t.arm[e],l=.13*a,u=s.y-X(i);c.hand.set(n*(i.rest.upperArmL.x+l),X(i),s.z+Math.sqrt((o*.985)**2-l*l-u*u)),c.rot.copy(G(e,new L(0,0,1),new L(0,-1,0))),c.elbow.set(n,.4,0),c.grip=.05,c.shrug=0;let f=t.leg[e];f.foot.set(n*i.rest.upperLegL.x*(r?.55:1.1),i.ankle,d),f.rot.copy(Yd(new L(0,0,1),mp)),f.knee.set(n*.05,1,.1),f.toes=0}yf(i,t.pelvis,s.clone().addScaledVector(_p(f),i.trunk),t.hips),Y(e,t,s),r&&bp(e,t,`R`,f+100*q,f-25*q,10)}var Tp={id:`glute-bridge`,revision:1,stage:`low`,planted:[`footL`,`footR`,`handL`,`handR`],kind:`reps`,period:3.6,camera:`side`,azimuth:62,elevation:10,beat:.6,standard:`Hips rise until knees, hips and shoulders are in one line, with a one-second pause; heels stay down; the height comes from the hips, not from arching the lower back.`,effort:e=>.3+.7*Q(e,.32,.3),pose(e,t,n){wp(t,n,Q(e,.32,.3),!1)}},Ep={id:`single-leg-bridge`,revision:1,stage:`low`,planted:[`footL`,`handL`,`handR`],kind:`reps`,period:3.6,camera:`side`,azimuth:62,elevation:10,beat:.6,detail:{"glutes.R":.2,"glute_med.R":.3,"hamstrings.R":.15},standard:`On one foot the hips rise level until knee, hips and shoulders are in one line, and pause; the free knee stays towards the chest; no hip drops.`,effort:e=>.3+.7*Q(e,.32,.3),pose(e,t,n){wp(t,n,Q(e,.32,.3),!0)}},Dp={id:`hollow-rock`,revision:1,stage:`low`,kind:`reps`,period:2.1,camera:`side`,azimuth:62,elevation:9,beat:.5,standard:`The hollow shape does not change: no bending at the hips for momentum, lower back in contact; small, even rocks.`,effort:e=>.75+.2*Math.abs(Math.sin(e*Math.PI*2)),pose(e,t,n){for(let e=0;e<3;e++)lp.pose(0,t,n);let r=1.7*t.body.scale,i=8*q*Math.sin(e*Math.PI*2);xp(n,W(i/q),new L(0,r,0),J(r*i,0))}},Op={id:`side-plank`,revision:1,stage:`low`,planted:[`handL`,`lowerArmL`,`footL`],kind:`hold`,period:4.6,camera:`front`,azimuth:-62,elevation:9,detail:{"obliques.R":.35,"glute_med.L":.8,"glute_med.R":.2,"glutes.R":.15,"delt_ant.R":0,"delt_lat.R":0,"adductors.R":.15},standard:`Elbow under the shoulder; ankles, hips and head in one straight line; hips high and forward; top shoulder stacked over the bottom one, chest not rolling to the floor.`,effort:()=>.7,pose(e,t,n){let r=t.body,i=r.scale,a=(r.upperLeg+r.lowerLeg)*.998,o=.05*i,s=J(0,.04*i),c=J(0,s.y+r.upperArm),l=e=>W(90-e/q).multiply(Bd(-90)),u=e=>{let u=l(e);n.pelvis.copy(u),n.chest.copy(u),n.head.copy(u);let d=n.arm.L;d.hand.set(-r.lowerArm,s.y-.004*i,0),d.rot.copy(G(`L`,new L(-1,0,0),new L(0,-1,0))),d.elbow.set(0,-1,0),d.grip=.1,d.shrug=-.2;for(let e=0;e<3;e++)t.solve(n),n.hips.add(c.clone().sub(t.pos.upperArmL));return t.solve(n),t.pos.upperLegL.y-a*Math.sin(e)-o};n.hips.set(0,.4*i,-.5*i);let d=14*q,f=u(d),p=20*q,m=u(p);for(let e=0;e<6&&Math.abs(m)>1e-4&&m!==f;e++){let e=p-m*(p-d)/(m-f);d=p,f=m,p=e,m=u(p)}let h=l(p),g=J(-Math.cos(p),-Math.sin(p)),_=t.pos.upperLegL.clone().addScaledVector(g,a);for(let[e]of K){let r=n.leg[e];e===`L`?r.foot.copy(_):r.foot.copy(t.pos.upperLegR).add(_.clone().setY(_.y+.092*i).sub(t.pos.upperLegR).setLength(a)),r.rot.copy(h),r.knee.set(-1,0,0),r.toes=0}n.arm.R.rot.copy(G(`R`,mp,new L(-1,0,0))),n.arm.R.elbow.set(0,0,-1),n.arm.R.grip=.1,n.arm.R.shrug=0,n.head.copy(l(p).multiply(W(.8*hp(e)))),yp(t,n,`R`,mp)}},kp={id:`reverse-plank`,revision:1,stage:`low`,planted:[`handL`,`handR`,`footL`,`footR`],kind:`hold`,period:4.6,camera:`side`,azimuth:62,elevation:8,standard:`Straight line from heels to shoulders, hips lifted, arms locked with the hands under the shoulders, chest open and shoulders not rolling forward.`,effort:()=>.7,pose(e,t,n){let r=t.body,i=r.scale,a=r.upperArm+r.lowerArm,o=(r.upperLeg+r.lowerLeg)*.998,s=.02*i,c=X(r)+Math.sqrt((a*.9975)**2-s*s),l=new L,u=c,d=.35;for(let a=0;a<4;a++){let f=.09*i;for(let e=0;e<6;e++)f=-r.heel.clone().applyQuaternion(W(d/q-42)).y+.004*i,d=Math.asin((u-f)/(o+r.trunk));let p=J(-Math.cos(d),Math.sin(d)),m=W(d/q-90);n.pelvis.copy(m),n.chest.copy(W(d/q-92)),n.head.copy(W(d/q-96+1.2*hp(e)));let h=J(0,f).addScaledVector(p,o);yf(r,n.pelvis,h,n.hips);let g=a?l.z:h.z-Math.cos(d)*r.trunk;for(let[e,t]of K){let i=n.leg[e];i.foot.set(t*r.rest.upperLegL.x,f,0),i.rot.copy(W(d/q-42)),i.knee.set(0,1,0),i.toes=-10;let a=n.arm[e];a.hand.set(t*(r.rest.upperArmL.x+s),X(r),g),a.rot.copy(G(e,new L(t*.15,0,1).normalize(),new L(0,-1,0))),a.elbow.set(t*.3,0,-1),a.grip=.04,a.shrug=-.4}t.solve(n),l.copy(t.pos.upperArmL).add(t.pos.upperArmR).multiplyScalar(.5),u+=c-l.y}}},Ap=e=>({height:.2*e.scale,gap:2*(e.rest.upperArmL.x+.04*e.scale),length:.42*e.scale,radius:.016*e.scale});function jp(e,t,n,r,i){let a=e.body,o=a.scale,s=Ap(a);t.pelvis.copy(W(r)),t.chest.copy(W(i+.6*hp(n))),t.head.copy(W(3));for(let[e,n]of K){let r=t.arm[e];Sp(a,r,e,n,new L(n*s.gap/2,s.height,0),s.radius),r.elbow.set(n*.2,0,-1),r.shrug=-1}let c=t.arm.L.hand,l=(a.upperArm+a.lowerArm)*.9975,u=e=>new L(0,c.y+Math.sqrt(Math.max(0,l*l-e*e)),c.z+.03*o);t.hips.set(0,c.y+l-a.trunk,0),Y(e,t,u(c.x-a.rest.upperArmL.x)),Y(e,t,u(c.x-e.pos.upperArmL.x))}var Mp={id:`tuck-l-sit`,revision:1,stage:`square`,planted:[`handL`,`handR`],props:e=>[{kind:`rails`,...Ap(e)}],kind:`hold`,period:4.6,camera:`side`,azimuth:58,elevation:6,standard:`Arms locked and shoulders pushed down away from the ears; knees lifted towards the chest; feet clear of the floor; no leaning back to lift them.`,effort:()=>.75,pose(e,t,n){jp(t,n,e,2,9);let r=(50+1.5*hp(e))*q;for(let[e]of K)bp(t,n,e,r,r-135*q,15)}},Np={id:`l-sit`,revision:1,stage:`square`,planted:[`handL`,`handR`],props:e=>[{kind:`rails`,...Ap(e)}],kind:`hold`,period:4.6,camera:`side`,azimuth:58,elevation:6,standard:`Arms locked, shoulders pushed down; legs straight and held level with the hips, knees locked and toes pointed; hips between or just behind the hands.`,effort:()=>.85,pose(e,t,n){jp(t,n,e,2,8),Tf(t,n,92+.5*hp(e),48)}};function Pp(e,t){let n=e.scale;for(let[r,i]of K){let a=t.leg[r];a.foot.set(i*e.rest.upperLegL.x,.046*n,-e.lowerLeg*.9995),a.rot.copy(W(176)),a.knee.set(0,-1,.4),a.toes=0}return .052*n}var Fp=e=>.09*e.scale,Ip={id:`ab-wheel-knee`,revision:1,stage:`low`,planted:[`lowerLegL`,`lowerLegR`,`footL`,`footR`],props:e=>[{kind:`wheel`,radius:Fp(e)}],kind:`reps`,period:4.6,camera:`side`,azimuth:64,elevation:8,beat:.97,detail:{triceps:.3,delt_ant:.35},standard:`Knees stay down; hips and shoulders travel forward together; arms straight; chest to within a fist of the floor with the pelvis tucked and no sag in the lower back.`,effort:e=>.3+.7*Q(e,.44,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Z(Q(e,.44,.06)),o=Pp(r,n),s=(r.upperArm+r.lowerArm)*.997,c=Fp(r)+.034*i,l=Math.asin((.2*i-o)/(r.upperLeg+r.trunk)),u=$(90*q,l,a),d=$(17*q,l,a),f=J(0,o).addScaledVector(_p(u),r.upperLeg);n.pelvis.copy(W(90-d/q-5)),n.chest.copy(W(90-d/q+2)),n.head.copy(W(90-d/q-10)),yf(r,n.pelvis,f,n.hips);for(let[e,t]of K){let a=n.arm[e];a.rot.copy(G(e,new L(0,-.5,.86),new L(0,-.86,-.5))),a.elbow.set(t*.5,.3,-1),a.grip=.85,a.shrug=.3,a.hand.set(t*.15*i,c,f.z+r.trunk)}for(let e=0;e<3;e++){t.solve(n);for(let[e]of K){let r=t.pos[`upperArm${e}`],i=n.arm[e],a=i.hand.x-r.x;i.hand.z=r.z+Math.sqrt(Math.max(0,s*s-(r.y-c)**2-a*a))}}}};function Lp(e,t){return e<.72?t*(e/.72)**1.3:e<.79?t+6*Z((e-.72)/.07):e<.84?t+6:(t+6)*(1-Z((e-.84)/.16))}var Rp=[Cp,Tp,Ep,Op,Dp,kp,Mp,Np,Ip,{id:`nordic-negative`,revision:1,stage:`square`,planted:[`lowerLegL`,`lowerLegR`,`footL`,`footR`],props:e=>[{kind:`bar`,height:.108*e.scale,width:.46*e.scale,radius:.018*e.scale,z:-e.lowerLeg*.97}],kind:`reps`,period:8.6,camera:`side`,azimuth:66,elevation:6,beat:.74,detail:{calves:.3,glutes:.5},standard:`Knees to shoulders stay in one line, hips extended, never breaking at the hips; the descent is fought all the way and takes at least five seconds; the hands catch at the bottom and push back.`,effort:e=>e<.72?.4+.6*(e/.72)**1.3:e<.84?.6:.3,pose(e,t,n){let r=t.body,i=r.scale,a=Pp(r,n),o=r.upperLeg+r.trunk,s=new L(0,-.1*i,.3*i),c=r.rest.upperArmL.x+.03*i,l=(e,t)=>t.clone().add(s.clone().applyQuaternion(W(e))),u=e=>J(Math.sin(e*q),Math.cos(e*q)),d=40,f=89;for(let e=0;e<20;e++){let e=(d+f)/2;l(e,J(0,a).addScaledVector(u(e),o)).y>X(r)?d=e:f=e}let p=d,m=l(p,J(0,a).addScaledVector(u(p),o)).setY(X(r)),h=Lp(e,p);n.pelvis.copy(W(h-2)),n.chest.copy(W(h)),n.head.copy(W(h-22*gp(25,p,h))),yf(r,n.pelvis,J(0,a).addScaledVector(u(h),r.upperLeg),n.hips);let g=gp(p-14,p-1,h);for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*c,.9*i,.3*i),r.elbow.copy(new L(t*.9,-.5,-.6).applyQuaternion(W(h))),r.grip=.1,r.shrug=0;let a=G(e,mp.clone().applyQuaternion(W(h)),new L(0,0,1).applyQuaternion(W(h)));r.rot.copy(a.slerp(G(e,new L(0,0,1),new L(0,-1,0)),g))}for(let e=0;e<2;e++){t.solve(n);for(let[e,i]of K){let a=l(h,t.pos[`upperArm${e}`]).setX(i*c);a.y=Math.max(a.y,X(r)),n.arm[e].hand.copy(a.lerp(m.clone().setX(i*c),g))}}}}],zp=new L(0,0,1),Bp=(e,t,n)=>Z(Math.min(1,Math.max(0,(e-t)/(n-t)))),Vp=e=>e===`L`?`R`:`L`,Hp=(e,t)=>e.pos[`toes${t}`].clone().add(new L(0,-.008,.075).multiplyScalar(e.body.scale).applyQuaternion(e.rot[`toes${t}`])),Up=(e,t)=>e.pos[`foot${t}`].clone().add(new L(0,-.045,-.075).multiplyScalar(e.body.scale).applyQuaternion(e.rot[`foot${t}`]));function Wp(e,t,n){let r=e.body,i=r.upperArm+r.lowerArm,a=n.drift??0;Ef(r,t,0,r.rest.upperArmL.x*1.02,new L(1,0,.6),4);for(let[e]of K)t.arm[e].shrug=1,t.arm[e].grip=.12;t.chest.copy(W(180+n.tilt+a*.6)),t.pelvis.copy(W(180+n.tilt-a*.9+1.5)),t.head.copy(W(180+n.tilt-n.head));let o=(n.tilt+a)*q,s=J(Math.sin(o)*i,X(r)+Math.cos(o)*i*.9975);t.hips.set(0,s.y+r.trunk,s.z),Y(e,t,s),Tf(e,t,(n.flex??0)-a*.7,n.point,n.spread??0)}var Gp={tilt:-.6,head:6,point:8},Kp={tilt:6.5,head:16,point:38},qp=new Map;function Jp(e){let t=qp.get(e.id);if(!t){let n=new Zd(e.id),r=tf();Wp(n,r,Gp),n.solve(r);let i=Math.min(Hp(n,`L`).z,Hp(n,`R`).z)-.004*e.scale;Wp(n,r,Kp),n.solve(r),t={chest:i,back:Math.max(Up(n,`L`).z,Up(n,`R`).z)+.004*e.scale},qp.set(e.id,t)}return t}var Yp=e=>Math.sin(e*Math.PI*2),Xp={id:`chest-to-wall-hs`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:72,elevation:2,props:e=>[{kind:`wall`,z:Jp(e).chest}],detail:{delt_post:.3,forearm_flex:.45,forearm_ext:.35},standard:`Wrists within a hand's length of the wall; only the toes touch it; arms locked and shoulders pushed tall; ribs in, no banana back; head between the arms.`,effort:e=>.6+.1*Yp(e),pose(e,t,n){Wp(t,n,Gp);for(let[t]of K)n.arm[t].grip=.12+.03*Yp(e)}},Zp={id:`back-to-wall-hs`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:112,elevation:2,props:e=>[{kind:`wall`,z:Jp(e).back}],detail:{delt_post:.3,forearm_flex:.45,forearm_ext:.35},standard:`Arms locked; hands about a hand's length from the wall; only the heels on the wall; shoulders pushed tall; a straight line, not a deep arch.`,effort:e=>.6+.1*Yp(e),pose(e,t,n){Wp(t,n,Kp);for(let[t]of K)n.arm[t].grip=.12+.03*Yp(e)}};function Qp(e,t,n){e.hips.sub(t).applyQuaternion(n).add(t),e.pelvis.premultiply(n),e.chest.premultiply(n),e.head.premultiply(n)}var $p=[-.028,.025,.085],em=[-.085,.01,.07];function tm(e,t,n,r,i){let{lean:a,elbowFront:o}=i,s=e.body,c=s.scale,l=n<.5?`L`:`R`,u=Vp(l),d=l===`L`?1:-1,f=n%.5*2,p=Bp(f,.04,.32)*(1-Bp(f,.7,.96)),m=Bp(f,.2,.46)*(1-Bp(f,.56,.82));Wp(e,t,r);let h=new I().setFromAxisAngle(zp,-d*a*p*q);Qp(t,t.arm[l].hand,h),e.solve(t);let g=t.arm[u],_=(s.upperArm+s.lowerArm)*.995,v=e.pos[`upperArm${u}`],y=g.hand.clone();y.distanceTo(v)>_&&y.sub(v).setLength(_).add(v);let b=(e,n,r)=>new L(e*c,n*c,r*c).applyQuaternion(t.chest),x=e.pos[`upperArm${l}`].clone().add(b(d*i.touch[0],i.touch[1],i.touch[2])),S=Z(m);g.hand.copy(y).lerp(x,S).add(b(0,0,.03*Math.sin(Math.PI*S)));let C=G(u,b(d,.25,0).normalize(),b(0,0,-1).normalize());g.rot.slerp(C,S),g.elbow.set(-d*1,0,$(.6,-o,S)),g.grip=$(.12,.3,S),e.solve(t),Tf(e,t,(r.flex??0)-(r.drift??0)*.7,r.point,r.spread??0)}var nm=e=>{let t=e%.5*2;return .55+.4*Bp(t,.04,.32)*(1-Bp(t,.7,.96))},rm={id:`wall-shoulder-taps`,stage:`tall`,kind:`reps`,period:5.6,beat:.26,camera:`side`,azimuth:40,elevation:2,props:e=>[{kind:`wall`,z:Jp(e).chest}],detail:{delt_post:.3,forearm_flex:.5,forearm_ext:.4},effort:nm},im={...rm,revision:2,standard:`Chest to the wall, toes staying on it; the hips travel most of the way over the supporting hand before the other hand lifts; supporting arm locked and shoulder pushed tall; the palm lands on the opposite shoulder itself, not inside it by the armpit, and returns to the same spot; hips do not twist.`,pose:(e,t,n)=>tm(t,n,e,Gp,{lean:8.2,elbowFront:-.25,touch:$p})},am={...rm,revision:1,standard:`Chest to the wall, toes staying on it; the weight shifts over the supporting hand before the other lifts; supporting arm locked and shoulder pushed tall; the hand touches the opposite shoulder and returns to the same spot; hips do not twist.`,pose:(e,t,n)=>tm(t,n,e,Gp,{lean:3.4,elbowFront:-.25,touch:em})},om={id:`hs-shoulder-taps`,revision:1,stage:`tall`,kind:`reps`,period:5.6,beat:.26,camera:`front`,azimuth:140,elevation:2,detail:{delt_post:.3,forearm_flex:.6,forearm_ext:.5},standard:`A held handstand, legs slightly apart; the whole line shifts over one hand before the other lifts; supporting arm locked; the hand touches the opposite shoulder and returns to the same spot, no hopping or walking.`,effort:nm,pose(e,t,n){tm(t,n,e,{tilt:0,drift:.8*Math.sin(e*Math.PI*4)+.35*Math.sin(e*Math.PI*10+1),head:18,point:50,spread:8},{lean:3.6,elbowFront:.9,touch:em})}},sm=e=>X(e)+(e.upperArm+e.lowerArm)*.9975+e.trunk-.108*e.scale;function cm(e){let t=X(e)+(e.upperArm+e.lowerArm)*.9975+e.trunk,n=(e.upperLeg+e.lowerLeg)*.998,r=Math.hypot(n+Math.abs(e.ball.y),e.ball.z),i=sm(e)+.014*e.scale;return{y:i,z:-Math.sqrt(r*r-(t-i)**2)}}var lm={id:`pike-hold`,revision:1,stage:`square`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`hold`,period:5,camera:`side`,azimuth:68,elevation:4,props:e=>{let t=cm(e);return[{kind:`box`,width:.62*e.scale,height:sm(e),depth:.44*e.scale,z:t.z-.1*e.scale}]},detail:{delt_post:.25},standard:`Hips over the shoulders and the shoulders over the wrists; arms locked; shoulders pushed up towards the ears; legs straight on the box; eyes on the floor between the thumbs.`,effort:e=>.6+.1*Yp(e),pose(e,t,n){let r=t.body,i=r.upperArm+r.lowerArm;Ef(r,n,0,r.rest.upperArmL.x*1.02,new L(1,0,.6),4);for(let[t]of K)n.arm[t].shrug=.9+.1*Yp(e),n.arm[t].grip=.1;n.chest.copy(W(180)),n.pelvis.copy(W(186)),n.head.copy(W(156));let a=J(0,X(r)+i*.9975);n.hips.set(0,a.y+r.trunk,0),Y(t,n,a);let o=cm(r);for(let[e,i]of K)xf(r,t.pos[`upperLeg${e}`],J(o.z,o.y,i*r.rest.upperLegL.x),new L(0,1,-.3),n.leg[e]),n.leg[e].knee.set(0,-1,0)}};function um(e,t,n){let r=e.body,i=r.scale,a=.012*i*Math.sin(n*Math.PI*2)+.004*i*Math.sin(n*Math.PI*6+1);Ef(r,t,0,r.rest.upperArmL.x*.98,new L(.45,.1,-1),6);for(let[e]of K)t.arm[e].grip=.18,t.arm[e].shrug=.3;t.chest.copy(W(104)),t.pelvis.copy(W(70)),t.head.copy(W(58));let o=J(.215*i+a,.415*i);t.hips.set(0,o.y+.08*i,o.z-r.trunk),Y(e,t,o)}var dm={stage:`square`,planted:[`handL`,`handR`],kind:`balance`,period:4.6,camera:`side`,azimuth:62,elevation:6,detail:{delt_post:.2,delt_lat:.5,pec:.35,pec_upper:.35},effort:e=>.6+.15*Math.abs(Yp(e))},fm={arm:.046,shin:.044},pm={...dm,id:`crow-pose`,revision:2,standard:`The shins rest across the backs of the upper arms just below the knees, and no part of a leg passes through an arm; knees outside the elbows; shoulders well ahead of the hands; upper back rounded; both feet off the floor and together; eyes forward of the hands, head off the floor.`,pose(e,t,n){let r=t.body,i=r.scale;um(t,n,e);for(let[e,a]of K){let o=t.pos[`upperLeg${e}`],s=t.pos[`upperArm${e}`],c=t.pos[`lowerArm${e}`],l=c.clone().sub(s).normalize(),u=new L(0,1,-.35),d=u.addScaledVector(l,-u.dot(l)).normalize(),f=s.clone().lerp(c,.5).addScaledVector(d,(fm.arm+fm.shin+.004)*i),p=new L(a*.04*i,o.y-.3*i,o.z-.085*i),m=f.clone().sub(p).normalize(),h=f.clone().addScaledVector(m,.085*i).sub(o).setLength(r.upperLeg).add(o),g=n.leg[e];g.foot.copy(p).sub(h).setLength(r.lowerLeg).add(h),g.knee.copy(h).sub(o.clone().add(g.foot).multiplyScalar(.5)),g.rot.copy(W(150)).premultiply(new I().setFromAxisAngle(new L(0,1,0),-a*.25)),g.toes=-15}}},mm={...dm,id:`crow-pose`,revision:1,standard:`Knees high on the backs of the upper arms; shoulders well ahead of the hands; upper back rounded; both feet off the floor; eyes forward of the hands, head off the floor.`,pose(e,t,n){let r=t.body,i=r.scale;um(t,n,e);for(let[e,a]of K){let o=t.pos[`upperLeg${e}`],s=t.pos[`upperArm${e}`],c=t.pos[`lowerArm${e}`],l=s.clone().lerp(c,.62).add(new L(a*.055*i,.062*i,-.01*i)).sub(o).setLength(r.upperLeg).add(o),u=new L(a*.035*i,o.y-.3*i,o.z-.02*i),d=n.leg[e];d.foot.copy(u).sub(l).setLength(r.lowerLeg).add(l),d.knee.copy(l).sub(o.clone().add(d.foot).multiplyScalar(.5)),d.rot.copy(W(150)).premultiply(new I().setFromAxisAngle(new L(0,1,0),-a*.25)),d.toes=-15}}},hm={id:`elbow-lever`,revision:1,stage:`low`,planted:[`handL`,`handR`],kind:`balance`,period:4.8,camera:`side`,azimuth:64,elevation:7,detail:{delt_post:.3,delt_lat:.5,forearm_ext:.6},standard:`Elbows close together, pressed into the lower belly; forearms upright; body level from shoulders to toes, legs straight and not sagging; feet off the floor; head up.`,effort:e=>.65+.15*Math.abs(Yp(e)),pose(e,t,n){let r=t.body,i=r.scale,a=1.2*Math.sin(e*Math.PI*2)+.4*Math.sin(e*Math.PI*6+1),o=.085*i;for(let[e,t]of K){let i=n.arm[e];i.hand.set(t*o,X(r),0),i.rot.copy(G(e,new L(t*.7,0,-.7).normalize(),new L(0,-1,0))),i.elbow.set(-t*.35,.75,-1),i.grip=.1,i.shrug=-.4}n.chest.copy(W(86)),n.pelvis.copy(W(93)),n.head.copy(W(56));let s=J(.262*i,.37*i);n.hips.set(0,s.y,s.z-r.trunk),Y(t,n,s),Qp(n,J(0,X(r)+r.lowerArm),W(a)),t.solve(n),Tf(t,n,0,42)}},gm=10,_m=.44,vm=new Map;function ym(e){let t=vm.get(e.id);if(t)return t;let n=e.scale,r=-.17*n,i=r+.016*n,a=.014*n,o=X(e)+(e.upperArm+e.lowerArm)*.9975,s=(e.upperLeg+e.lowerLeg)*.998,c=Math.hypot(e.trunk+s+Math.abs(e.ball.y),e.ball.z),l=J(r+.11*n,a),u=Math.asin((.17*n-o)/c),d=Math.acos((0-i)/c),f=[0];for(let e=1;e<=400;e++){let t=u+(d-u)*(e-.5)/400;f.push(f[e-1]+Math.max(Math.abs(Math.sin(t)),Math.cos(t)))}let p=e=>{let t=e*f[400],n=1;for(;n<400&&f[n]<t;)n++;return u+(d-u)*(n-(f[n]-t)/(f[n]-f[n-1]))/400},m=[l.z+Math.sqrt(c*c-(o-a)**2)],h=[l];for(let e=1;e<=gm;e++){let t=p((e-1)/9),r=c-.03*n*Math.max(0,Math.sin(2*t));m.push(i+r*Math.cos(t)),h.push(J(i,o+r*Math.sin(t)))}return t={wall:r,hands:m,balls:h,shoulder:o},vm.set(e.id,t),t}function bm(e,t){let n=e*gm-t;if(n<=0)return{at:0,air:0};let r=Math.floor(n),i=n-r;if(r>=gm)return{at:gm,air:0};let a=Math.min(1,i/_m);return{at:r+Z(a),air:a<1?Math.sin(Math.PI*a):0}}var xm=(e,t,n)=>{let r=Math.min(e.length-2,Math.floor(t));return n(e[r],e[r+1],t-r)};function Sm(e,t){let n=new L(0,1,0).applyQuaternion(e.rot),r=new L(0,0,1).applyQuaternion(e.rot);e.toes=Math.max(0,Math.min(85,Math.atan2(t.dot(n),t.dot(r))/q))}var Cm=[lm,pm,{id:`wall-walk`,revision:1,stage:`square`,kind:`reps`,period:13,beat:.5,camera:`side`,azimuth:66,elevation:4,props:e=>[{kind:`wall`,z:ym(e).wall}],detail:{delt_post:.25,forearm_flex:.3},standard:`Small steps, a hand and a foot together; arms straight and the body tight, no arch in the lower back; hands finish within a hand's length of the wall, chest close to it; walked back down the same way, not dropped.`,effort:e=>.4+.5*Bp(e,.03,.45)*(1-Bp(e,.55,.97)),pose(e,t,n){let r=t.body,i=r.scale,a=ym(r),o=Math.min(1,Math.max(0,(e-.03)/.42)),s=Math.min(1,Math.max(0,(e-.55)/.42)),c=e<.5?o:1-s,l={handR:bm(c,0),footL:bm(c,0),handL:bm(c,.5),footR:bm(c,.5)},u=r.upperArm+r.lowerArm,d=r.rest.upperArmL.x*1.02,f=(e,t,n)=>e+(t-e)*n,p=(e,t,n)=>e.clone().lerp(t,n),m={L:xm(a.hands,l.handL.at,f),R:xm(a.hands,l.handR.at,f)},h={L:l.handL.air,R:l.handR.air};Ef(r,n,0,d,new L(1,.2,-.4),4);for(let[e]of K)n.arm[e].hand.z=m[e],n.arm[e].hand.y+=.018*i*h[e],n.arm[e].shrug=.3+.7*c,n.arm[e].grip=.08;let g={L:xm(a.balls,l.footL.at,p),R:xm(a.balls,l.footR.at,p)},_={L:l.footL.air,R:l.footR.air},v=(m.L+m.R)/2,y=(m.L-m.R)/2,b=J(v,X(r)+Math.sqrt(Math.max(.01,(u*.9975)**2-y**2))),x=g.L.clone().add(g.R).multiplyScalar(.5).setX(0),S=(r.upperLeg+r.lowerLeg)*.998,C=ef(b,x,r.trunk,Math.hypot(S+Math.abs(r.ball.y),r.ball.z),new L(0,1,1)),w=b.clone().sub(C),T=Math.atan2(w.z,w.y)/q;n.chest.copy(W(T+2)),n.pelvis.copy(W(T-2)),n.head.copy(W(T-16*(1-c))),n.hips.copy(C),Y(t,n,b);for(let e=0;e<2;e++){let e=0;for(let[r]of K)h[r]===0&&(e=Math.max(e,t.pos[`upperArm${r}`].distanceTo(n.arm[r].hand)));if(e===0)break;b.y+=(u*.9975-e)*(u/Math.max(.2,b.y-X(r))),Y(t,n,b)}for(let[e]of K){let r=n.arm[e],i=t.pos[`upperArm${e}`];h[e]>0&&r.hand.distanceTo(i)>u*.99&&r.hand.sub(i).setLength(u*.99).add(i)}let E=new L(0,0,-1).applyQuaternion(n.pelvis),D=new L(0,0,1).applyQuaternion(n.pelvis),O=r.ball.length();for(let[e,a]of K){let o=n.leg[e],s=t.pos[`upperLeg${e}`],c=g[e].y>.05*i,l=g[e].clone().setX(a*r.rest.upperLegL.x);l.add(new L(0,.03*i,.07*i).multiplyScalar(_[e]));let u=s.distanceTo(l),d=92*q;bf(r,ef(s,l,u>=Math.sqrt(S*S+O*O-2*S*O*Math.cos(d))?S:O*Math.cos(d)+Math.sqrt(Math.max(0,u*u-(O*Math.sin(d))**2)),O,E),l,o),o.knee.copy(D),c&&Sm(o,new L(0,-1,0))}}},Xp,Zp,im,om,hm],wm=Math.PI/180,Tm=new L(0,1,0),Em=e=>e.upperLeg+e.lowerLeg;function Dm(e,t,n,r,i,a=0){let o=new L(i*Math.sin(a*wm),0,Math.cos(a*wm));e.foot.set(n,t.ankle,r),e.rot.copy(Yd(o,Tm)),e.knee.copy(o),e.toes=0}function Om(e,t,n,r,i,a){t.pelvis.copy(W(r)),t.chest.copy(W(i)),t.head.copy(W(a)),yf(e.body,t.pelvis,n,t.hips),e.solve(t)}function km(e,t,n,r=0){let i=e.body;for(let[a,o]of K){let s=t.arm[a],c=new L(o*$(.16,.05,n),$(-1,.04-r,n),$(.05,1,n)).normalize();s.hand.copy(e.pos[`upperArm${a}`]).addScaledVector(c,(i.upperArm+i.lowerArm)*$(.985,.96,n)),s.elbow.set(o*.6,$(0,-1,n),$(-1,-.2,n)),s.rot.copy(G(a,c.clone().add(new L(0,0,.12)).normalize(),new L(-o,$(0,-.5,n),-.2).normalize())),s.grip=.15,s.shrug=-.2}}function Am(e,t){let n=e.body,r=n.scale,i=e.pos.upperLegL.clone().add(e.pos.upperLegR).multiplyScalar(.5);for(let[e,a]of K){let o=t.arm[e];o.hand.copy(new L(a*(n.rest.upperLegL.x+.085*r),.085*r,.045*r).applyQuaternion(t.pelvis).add(i)),o.elbow.set(a*1,.1,-.75),o.rot.copy(G(e,new L(-a*.45,-.6,.66).normalize(),new L(-a,.15,-.3).normalize()).premultiply(t.pelvis)),o.grip=.35,o.shrug=0}}var jm=e=>({width:.5*e.scale,height:e.ankle+e.lowerLeg*.9,depth:.42*e.scale,z:-.385*e.scale}),Mm=.092,Nm={id:`box-squat`,revision:1,stage:`square`,planted:[`footL`,`footR`],kind:`reps`,period:3.4,camera:`side`,azimuth:64,elevation:5,beat:.97,props:e=>[{kind:`box`,...jm(e)}],standard:`Hips reach back to touch the box lightly, not drop onto it; heels down and shins close to vertical; knees over the toes; a full stand at the top.`,effort:e=>.3+.7*Q(e,.42,.1),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.42,.1),o=.19*i,s=r.ankle+Math.sqrt((Em(r)*.9992)**2-(o-r.rest.upperLegL.x)**2);Om(t,n,J($(.005,-.335,Z(a))*i,$(s,jm(r).height+Mm*i,a)),$(0,48,a),$(-1,44,a),$(1,15,a));for(let[e,t]of K)Dm(n.leg[e],r,t*o,0,t,14);km(t,n,a)}},Pm=e=>-(e.upperLeg+.128*e.scale),Fm={id:`wall-sit`,revision:1,stage:`square`,planted:[`footL`,`footR`],kind:`hold`,period:4.8,camera:`side`,azimuth:62,elevation:5,props:e=>[{kind:`wall`,z:Pm(e)}],standard:`Whole back flat on the wall; thighs parallel to the floor; knees at 90° directly over the ankles; hands off the thighs.`,effort:()=>.75,pose(e,t,n){let r=t.body,i=r.scale,a=Math.sin(e*Math.PI*2),o=r.rest.upperLegL.x;Om(t,n,J(-r.upperLeg,r.ankle+r.lowerLeg),0,-.8*a,0);for(let[e,a]of K){Dm(n.leg[e],r,a*(o+.01*i),0,a,4),n.leg[e].knee.set(0,.4,1);let s=n.arm[e],c=new L(a*.1,-1,.06).normalize();s.hand.copy(t.pos[`upperArm${e}`]).addScaledVector(c,(r.upperArm+r.lowerArm)*.99),s.elbow.set(a*1,0,-.2),s.rot.copy(G(e,c,new L(-a,0,0))),s.grip=.2,s.shrug=-.2}}},Im=e=>({width:.6*e.scale,height:.16*e.scale,depth:.4*e.scale,z:.165*e.scale}),Lm=e=>.43*e.scale,Rm={id:`calf-raise`,revision:1,stage:`tall`,planted:[`toesL`,`handL`,`handR`],kind:`reps`,period:2.8,camera:`side`,azimuth:72,elevation:4,beat:.5,detail:{"calves.R":.06},props:e=>[{kind:`box`,...Im(e)},{kind:`wall`,z:Lm(e)}],standard:`Heel drops below the edge of the step for a full stretch, then rises as high as possible; the knee stays straight; no bounce; the hands only steady.`,effort:e=>.3+.7*Q(e,.4,.14),pose(e,t,n){let r=t.body,i=r.scale,a=$(-13,38,Q(e,.4,.14)),o=.035*i,s=r.ball.length(),c=J(0,Im(r).height+.014*i,o),l=(a-Math.atan2(r.ball.y,r.ball.z)/wm)*wm,u=J(c.z-s*Math.cos(l),c.y+s*Math.sin(l),o);bf(r,u,c,n.leg.L),n.leg.L.toes=a,n.leg.L.knee.set(0,0,1);let d=o*.55,f=d+r.rest.upperLegL.x-o,p=(c.z-u.z)*.6;Om(t,n,J(u.z+p,u.y+Math.sqrt((Em(r)*.998)**2-f*f-p*p),d),1,0,0);let m=t.pos.upperLegR,h=m.clone().addScaledVector(new L(0,-Math.cos(10*wm),Math.sin(10*wm)),r.upperLeg),g=n.leg.R;g.foot.copy(h).addScaledVector(new L(0,-.24,-.97).normalize(),r.lowerLeg),g.knee.copy(h).sub(m.clone().add(g.foot).multiplyScalar(.5)),g.rot.copy(W(64)),g.toes=0;for(let[e,t]of K){let a=n.arm[e];a.hand.set(t*.2*i,Im(r).height+r.rest.upperArmL.y-.1*i,Lm(r)-X(r)),a.rot.copy(G(e,new L(t*.1,1,0).normalize(),new L(0,0,1))),a.elbow.set(t*.7,-1,-.1),a.grip=.05,a.shrug=0}}},zm=e=>e.ankle+e.lowerLeg*.86,Bm=e=>-.725*Em(e),Vm=e=>({width:.5*e.scale,height:zm(e),depth:.34*e.scale,z:Bm(e)-.17*e.scale}),Hm={id:`bulgarian-split-squat`,revision:1,stage:`square`,planted:[`footL`,`footR`],kind:`reps`,period:3.3,camera:`side`,azimuth:62,elevation:5,beat:.97,detail:{"quads.R":.45,"glutes.R":.3,"glute_med.L":.75,"hamstrings.R":.2,"adductors.R":.25,"hip_flexors.R":.3,"calves.R":.08},props:e=>[{kind:`box`,...Vm(e)}],standard:`Rear foot only rests on the bench; front heel down and front knee over the toes; straight down until the front thigh is parallel or below; trunk tall; no bounce.`,effort:e=>.3+.7*Q(e,.44,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.44,.06),o=r.rest.upperLegL.x,s=r.upperLeg*.93;Om(t,n,J(0,$(r.ankle+Math.sqrt((Em(r)*.975)**2-s**2),r.ankle+r.lowerLeg*.965,a)),$(4,13,a),$(3,11,a),2),Dm(n.leg.L,r,o+.01*i,s,1),n.leg.L.knee.set(.05,0,1);let c=n.leg.R;c.foot.set(-o-.01*i,zm(r)+.032*i,Bm(r)),c.rot.copy(W(160)),c.knee.set(-.05,-1,.4),c.toes=0,Am(t,n)}},Um={id:`cossack-squat`,revision:1,stage:`square`,planted:[`footL`],kind:`reps`,period:3.6,camera:`front`,azimuth:14,elevation:6,beat:.97,detail:{"quads.R":.25,"glutes.R":.2,"glute_med.R":.2,"adductors.R":.5,"hamstrings.R":.3,"calves.R":.08},standard:`Hip below the knee on the working side with that heel down; the other leg straight, toes to the ceiling; chest up rather than folded over.`,effort:e=>.3+.7*Q(e,.44,.08),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.44,.08),o=r.rest.upperLegL.x,s=Em(r),c=s*.9985,l=.665*s,u=Z(a),d=Yd(new L(-.26,0,.97).normalize(),Tm),f=Yd(new L(-.12,1,.12).normalize(),new L(1,.25,0).normalize()),p=n.leg.R;p.foot.set(-l+.07*i*u,$(r.ankle,.058*i,u),0),p.rot.copy(d).slerp(f,u),p.knee.set(-.2*(1-u),u,1-.6*u),p.toes=0;let m=$(r.ankle+Math.sqrt(c**2-(l-o)**2),r.ankle+.3*s,a),h=-.14*s*Z(a);Om(t,n,new L(p.foot.x+Math.sqrt(c**2-(m-p.foot.y)**2-h**2)+o,m,h),$(0,30,a),$(0,26,a),$(0,8,a)),Dm(n.leg.L,r,l,0,1,34),km(t,n,a)}},Wm={id:`deep-squat-hold`,revision:1,stage:`square`,planted:[`footL`,`footR`],kind:`hold`,period:5.2,camera:`three-quarter`,azimuth:46,elevation:7,standard:`Heels flat; hips below the knees; knees out over the toes; chest lifted; no hands on the floor; relaxed and breathing.`,effort:()=>.4,pose(e,t,n){let r=t.body,i=r.scale,a=Em(r),o=Math.sin(e*Math.PI*2);Om(t,n,J(-.175*a,r.ankle+.2*a+.004*i*o),42,26-1.5*o,4);for(let[e,t]of K)Dm(n.leg[e],r,t*.185*i,0,t,26);let s=t.pos.upperArmL.clone().add(t.pos.upperArmR).multiplyScalar(.5);for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*.016*i,s.y-.17*i,s.z+.21*i),r.elbow.set(t*.25,-1,.5),r.rot.copy(G(e,new L(0,.72,.69),new L(-t,0,0))),r.grip=.04,r.shrug=-.1}}};function Gm(e,t,n,r,i){let a=e.body,o=a.scale,s=Em(a),c=.05*o,l=.02*o,u=a.ankle+Math.sqrt((s*.998)**2-(l+a.rest.upperLegL.x-c)**2);Om(e,t,J($(.03*o,-r*s,Z(n)),$(u,a.ankle+.21*s,n),l),$(2,i[0],n),$(0,i[1],n),$(0,18,n)),Dm(t.leg.L,a,c,0,1,4),t.leg.L.knee.set(-.2,0,1);let d=$(27,84,n**.6)*wm,f=new L(0,-Math.cos(d),Math.sin(d)),p=new L(0,Math.sin(d),Math.cos(d)),m=t.leg.R;m.foot.copy(e.pos.upperLegR).addScaledVector(f,s*.9985),m.rot.copy(Yd(p,f.clone().negate())),m.knee.copy(p),m.toes=0}var Km={id:`pistol-squat`,revision:1,stage:`square`,planted:[`footL`],kind:`reps`,period:4,camera:`three-quarter`,azimuth:58,elevation:5,beat:.97,detail:{"quads.R":.4,"glutes.R":.08,"glute_med.R":.1,"hamstrings.R":.08,"hip_flexors.R":.9,"hip_flexors.L":.25,"adductors.R":.15,"calves.R":.06},standard:`Hip below the knee; standing heel stays planted and the knee over the foot; free leg straight and off the floor throughout; controlled down, stood up without a push from the other foot.`,effort:e=>.3+.7*Q(e,.45,.07),pose(e,t,n){let r=Q(e,.45,.07);Gm(t,n,r,.15,[54,50]),km(t,n,r,.12)}},qm=e=>({height:1.03*e.scale,width:.9*e.scale,radius:.0165*e.scale,z:.5*e.scale}),Jm={id:`assisted-pistol`,revision:1,stage:`square`,planted:[`footL`],kind:`reps`,period:4,camera:`three-quarter`,azimuth:58,elevation:5,beat:.97,detail:{"quads.R":.4,"glutes.R":.08,"glute_med.R":.1,"hamstrings.R":.08,"hip_flexors.R":.9,"hip_flexors.L":.25,"adductors.R":.15,"calves.R":.06},props:e=>[{kind:`bar`,...qm(e)}],standard:`Full depth on one leg with the heel flat; free leg straight out in front; the hands hold the support for balance, not to haul the body up.`,effort:e=>.25+.65*Q(e,.45,.07),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.45,.07);Gm(t,n,a,.21,[38,30]);let o=qm(r),s=new L(0,.75*a,1-.3*a).normalize(),c=new L(0,-1+.3*a,.75*a).normalize();for(let[e,t]of K)Df(r,n.arm[e],e,new L(t*.17*i,o.height,o.z),o.radius,s,c,.9),n.arm[e].elbow.set(t*.5,-1,-.2),n.arm[e].shrug=0}},Ym=.052,Xm=[Nm,Fm,Rm,Hm,Um,Wm,Jm,Km,{id:`shrimp-squat`,revision:1,stage:`square`,planted:[`footL`],kind:`reps`,period:3.8,camera:`side`,azimuth:64,elevation:5,beat:.97,detail:{"quads.R":.2,"glutes.R":.2,"glute_med.R":.15,"hamstrings.R":.6,"calves.R":.08},standard:`Rear knee touches the floor softly behind the standing heel; the rear foot never touches; standing heel down; trunk leans forward as the knee travels down; stood up without a push.`,effort:e=>.3+.7*Q(e,.45,.07),pose(e,t,n){let r=t.body,i=r.scale,a=Em(r),o=Q(e,.45,.07),s=.05*i,c=.02*i,l=r.ankle+Math.sqrt((a*.998)**2-(c+r.rest.upperLegL.x-s)**2),u=r.ankle+.395*a;Om(t,n,J($(.02,0,o)*i,$(l,u,o),c),$(2,45,o),$(0,50,o),$(0,22,o)),Dm(n.leg.L,r,s,0,1,4),n.leg.L.knee.set(-.15,0,1);let d=t.pos.upperLegR,f=Math.acos(Math.min(1,(u-Ym*i)/r.upperLeg)),p=$(8*wm,f,o),m=d.clone().addScaledVector(new L(0,-Math.cos(p),-Math.sin(p)),r.upperLeg),h=$(2,36,o)*wm,g=new L(0,Math.sin(h),-Math.cos(h)),_=n.leg.R;_.foot.copy(m).addScaledVector(g,r.lowerLeg),_.knee.copy(m).sub(d.clone().add(_.foot).multiplyScalar(.5)),_.rot.copy(Yd(g.clone().applyQuaternion(new I().setFromAxisAngle(new L(1,0,0),12*wm)),new L(0,-Math.cos(h),-Math.sin(h)))),_.toes=0,km(t,n,o,.42)}}],Zm=e=>e<.38?Z(e/.38):e<.72?1:1-Z((e-.72)/.28),Qm=(e,t)=>t+(1-t)*Zm(e),$m=e=>.4+.5*Zm(e),eh=e=>e.knuckle*(.192/.094),th=e=>e.knuckle*(.072/.094),nh=new L(0,1,0),rh=new L(0,0,1);function ih(e,t,n,r,i){let a=t,o=e(a),s=t+n,c=e(s);for(let t=0;t<9&&Math.abs(c)>1e-4&&c!==o;t++){let t=s-c*(s-a)/(c-o);a=s,o=c,s=Math.max(r,Math.min(i,t)),c=e(s)}return s}var ah=e=>e.pos.upperArmL.clone().add(e.pos.upperArmR).multiplyScalar(.5);function oh(e,t,n,r,i=new L(0,0,1)){for(let[a,o]of K){let s=t.leg[a];s.foot.set(o*r,e.ankle,n),s.rot.copy(Yd(rh,nh)),s.knee.set(o*i.x,i.y,i.z),s.toes=0}}var sh={id:`toe-touch`,revision:1,stage:`square`,planted:[`footL`,`footR`],kind:`mobility`,period:6,camera:`side`,azimuth:74,elevation:5,beat:.38,standard:`Knees locked the whole time; the fold starts at the hips; fingertips rest on the floor; no bouncing.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=.11*i,s=(r.upperLeg+r.lowerLeg)*.9995,c=J(-o,r.ankle+Math.sqrt(s*s-o*o));oh(r,n,0,r.rest.upperLegL.x);let l=(r.upperArm+r.lowerArm)*.996,u=eh(r)*.965+(1-a)*.09*i,d=.1*i,f=e=>{for(let[t,r]of K){let i=n.arm[t];i.hand.set(e[t].x,u,e[t].z-d),i.rot.copy(G(t,new L(0,-1,-.12).normalize(),new L(0,-.12,-1).normalize())),i.elbow.set(r*.7,0,-.7),i.grip=.05,i.shrug=.25}};ih(e=>{n.pelvis.copy(W(64+e)),n.chest.copy(W(132+e)),n.head.copy(W(150+e)),yf(r,n.pelvis,c,n.hips);let i=t.joints(n.hips,n.pelvis,n.chest);f({L:i.shoulderL,R:i.shoulderR});for(let e=0;e<2;e++)t.solve(n),f({L:t.pos.upperArmL,R:t.pos.upperArmR});return t.solve(n),ah(t).y-u-Math.sqrt(l*l-d*d)},0,4,-40,40)}},ch={id:`deep-lunge`,revision:1,stage:`square`,planted:[`footL`,`footR`,`lowerLegL`],kind:`mobility`,period:6.4,camera:`side`,azimuth:66,elevation:5,beat:.38,detail:{"hip_flexors.R":.12,"quads.R":.24,"glutes.R":.24,"glute_med.R":.2},standard:`Back knee on the floor; hips square and sinking forward, not the lower back arching; pelvis tucked under; trunk upright; front knee over the foot, not far past the toes.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=r.rest.upperLegL.x,s=.052*i,c=e=>J(r.upperLeg*Math.sin(e*q),s+r.upperLeg*Math.cos(e*q)),l=c(33),u=c($(22,33,a));n.pelvis.copy(W(-6-3*a)),n.chest.copy(W(-1.5)),n.head.copy(W(1)),yf(r,n.pelvis,u,n.hips);let d=n.leg.L,f=.046*i;d.foot.set(o,f,-Math.sqrt(r.lowerLeg**2-(s-f)**2)),d.rot.copy(W(176)),d.knee.set(0,-1,.2),d.toes=0;let p=n.leg.R,m=r.ankle+r.lowerLeg-l.y;p.foot.set(-o,r.ankle,l.z+Math.sqrt(Math.max(0,r.upperLeg**2-m**2))),p.rot.copy(Yd(rh,nh)),p.knee.set(0,.4,1),p.toes=0;for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*(o+.085*i),u.y+.085*i,u.z+.045*i),r.elbow.set(t,.1,-.75),r.rot.copy(G(e,new L(-t*.45,-.6,.66).normalize(),new L(-t,.15,-.3).normalize())),r.grip=.35,r.shrug=0}}},lh=e=>-.128*e.scale,uh={id:`overhead-wall-reach`,revision:1,stage:`tall`,planted:[`footL`,`footR`],props:e=>[{kind:`wall`,z:lh(e),height:2.5*e.scale}],kind:`mobility`,period:6,camera:`side`,azimuth:72,elevation:3,beat:.38,detail:{delt_post:.3},standard:`Heels, hips, ribs and head stay on the wall; lower back flat, ribs not lifting; arms straight and shoulder-width; thumbs touch the wall.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Qm(e,0),o=lh(r),s=-.066*i,c=(r.upperLeg+r.lowerLeg)*.9995;oh(r,n,s,r.rest.upperLegL.x),n.pelvis.copy(W(-3)),n.chest.copy(W(-.5)),n.head.copy(W(-1)),yf(r,n.pelvis,J(0,r.ankle+Math.sqrt(c*c-s*s)),n.hips);let l=(r.upperArm+r.lowerArm)*.9965,u=o+th(r)+.006*i,d=t.joints(n.hips,n.pelvis,n.chest),f=e=>{for(let[t,r]of K){let i=e[t],o=Math.asin(Math.max(-.5,Math.min(.5,(u-i.z)/l)))/q,s=$(o+34,o,a)*q,c=new L(0,Math.cos(s),Math.sin(s)),d=n.arm[t];d.hand.copy(i).addScaledVector(c,l),d.rot.copy(G(t,c,new L(-r,0,0))),d.elbow.set(r*.4,0,1),d.grip=0,d.shrug=.35}};f({L:d.shoulderL,R:d.shoulderR});for(let e=0;e<5;e++)t.solve(n),f({L:t.pos.upperArmL,R:t.pos.upperArmR})}},dh=52,fh={id:`pancake-elbows`,revision:1,stage:`low`,planted:[`footL`,`footR`],kind:`mobility`,period:6.6,camera:`three-quarter`,azimuth:38,elevation:17,beat:.38,standard:`Legs straight and wide, kneecaps and toes pointing up; the pelvis rolls forward and the back stays long; both elbows rest on the floor.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=J(0,.088*i),s=.056*i,c=(r.upperLeg+r.lowerLeg)*.9995,l=Math.sqrt(c*c-(o.y-s)**2);for(let[e,t]of K){let i=n.leg[e],a=new L(t*Math.sin(dh*q),0,Math.cos(dh*q));i.foot.set(t*r.rest.upperLegL.x,s,0).addScaledVector(a,l),i.rot.copy(Yd(new L(0,1,.12).normalize(),a.clone().negate())),i.knee.set(0,1,0),i.toes=0}let u=.04*i,d=u+r.upperArm*Math.cos($(8,26,a)*q),f=e=>{for(let[t,a]of K){let o=n.arm[t],s=Math.min(r.upperArm*.999,Math.max(0,e[t].y-u)),c=new L(e[t].x,u,e[t].z+Math.sqrt(r.upperArm**2-s**2)),l=.03*i;o.hand.set(c.x-a*l,u-.004*i,c.z+Math.sqrt(r.lowerArm**2-l**2-(.004*i)**2)),o.rot.copy(G(t,new L(-a*.1,0,1).normalize(),new L(0,-1,0))),o.elbow.set(a*.05,-1,.1),o.grip=.05,o.shrug=0}};ih(e=>{n.pelvis.copy(W(52+e)),n.chest.copy(W(66+e)),n.head.copy(W(50+e)),yf(r,n.pelvis,o,n.hips);let i=t.joints(n.hips,n.pelvis,n.chest);f({L:i.shoulderL,R:i.shoulderR});for(let e=0;e<3;e++)t.solve(n),f({L:t.pos.upperArmL,R:t.pos.upperArmR});return t.solve(n),ah(t).y-d},0,4,-45,30)}},ph=new Map,mh=[sh,ch,uh,fh,{id:`bridge`,revision:1,stage:`low`,planted:[`handL`,`handR`,`footL`,`footR`],kind:`mobility`,period:6.4,camera:`side`,azimuth:70,elevation:6,beat:.38,detail:{delt_post:.3,forearm_ext:.3},standard:`Arms locked; chest pushed through until the shoulders are over the hands; hips high with the glutes working, so the bend is shared along the whole spine; feet flat; head off the floor.`,effort:e=>.6+.35*Zm(e),pose(e,t,n){let r=t.body,i=r.scale,a=r.rest.upperArmL.x+.02*i,o=(r.upperArm+r.lowerArm)*.9965,s=X(r),c=e=>{Ef(r,n,0,a,new L(.45,0,-1),10);for(let[e]of K)n.arm[e].shrug=.6,n.arm[e].grip=.08;n.pelvis.copy(W(-70+6*(1-e))),n.chest.copy(W(-142+12*(1-e))),n.head.copy(W(-166+12*(1-e)));let c=$(13,0,e)*q,l=e=>{let t=Math.sqrt(Math.max(0,o*o-e*e));return new L(0,s+t*Math.cos(c),t*Math.sin(c))},u=l(a-r.rest.upperArmL.x);n.hips.set(0,u.y+.12*i,u.z+.4*i),Y(t,n,u),Y(t,n,l(Math.abs(n.arm.L.hand.x-t.pos.upperArmL.x)))},l=ph.get(r.id);if(l===void 0){c(1);let e=t.pos.upperLegL,n=e.y-(r.ankle+r.lowerLeg);l=e.z+Math.sqrt(Math.max(0,r.upperLeg**2-n**2)),ph.set(r.id,l)}oh(r,n,l,r.rest.upperLegL.x+.03*i,new L(.1,1,.3)),c(Qm(e,.45))}}],hh={id:`pike-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3.1,camera:`side`,azimuth:66,elevation:6,beat:.97,detail:{pec_upper:.3,delt_post:.2},standard:`Hips stay high; the head goes to the floor in front of the hands, not between them; elbows about 45° back, not flared; arms fully straight at the top.`,effort:e=>.35+.65*Q(e,.42,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.42,.06),o=r.upperArm+r.lowerArm,s=(r.upperLeg+r.lowerLeg)*.998,c=X(r),l=r.height-r.rest.upperArmL.y,u=Math.PI/180*50.5,d=J(-Math.cos(u)*o*.985,c+Math.sin(u)*o*.985),f=d.clone().add(J(-Math.cos(u),Math.sin(u)).multiplyScalar(r.trunk)),p=r.ball.length(),m=f.z-Math.sqrt(Math.max(0,(s+p*.55)**2-(f.y-.014*i)**2)),h=Math.PI/180*47,g=J(.085*i-Math.cos(h)*l,.022*i+Math.sin(h)*l),_=Z(a),v=$(u,h,_),y=d.clone().lerp(g,_);y.z+=Math.sin(a*Math.PI)*.02*i;let b=90+180/Math.PI*v;n.chest.copy(W(b)),n.pelvis.copy(W(b+4)),n.head.copy(W(b-$(8,2,a))),yf(r,n.pelvis,y.clone().add(J(-Math.cos(v),Math.sin(v)).multiplyScalar(r.trunk)),n.hips),Ef(r,n,0,r.rest.upperArmL.x+.03*i,new L(.78,.1,-1),6);for(let[e]of K)n.arm[e].shrug=$(.9,.2,a);Y(t,n,y);for(let[e,a]of K){let o=a*r.rest.upperLegL.x;xf(r,t.pos[`upperLeg${e}`],J(m,.014*i,o),new L(0,.6,-1),n.leg[e]),n.leg[e].knee.set(0,.2,1)}}},gh=new Map;function _h(e,t,n){let r=`${t}:${e.body.id}`;return gh.has(r)||gh.set(r,n()),gh.get(r)}var vh=new Map,yh=e=>vh.get(e.id)??vh.set(e.id,new Zd(e.id)).get(e.id),bh=e=>e.pos.upperArmL.clone().add(e.pos.upperArmR).multiplyScalar(.5),xh=e=>Q(e,.42,.06),Sh=e=>.35+.65*xh(e);function Ch(e,t,n,r){let i=Math.asin(Math.max(-1,Math.min(1,(n.y-(e.pos.upperLegL.y+e.pos.upperLegR.y)/2)/e.body.trunk)))/q;t.head.copy(W(90-i-14+6*r))}var wh=(e,t,n,r,i,a)=>wf(e,t,0,n,r,i,a),Th=(e,t,n,r,i=3)=>{let a=e.body,o=a.scale,s=J(0,.052*o),c=a.upperLeg+a.trunk,l=new L,u=n;for(let d=0;d<4;d++){let f=Math.asin(Math.max(-.2,Math.min(.98,(u-s.y)/c))),p=J(Math.cos(f),Math.sin(f)),m=90-f/q;t.pelvis.copy(W(m-i)),t.chest.copy(W(m+i*.6)),yf(a,t.pelvis,s.clone().addScaledVector(p,a.upperLeg),t.hips);for(let[e,n]of K){let r=t.leg[e];r.foot.set(n*a.rest.upperLegL.x,.046*o,-Math.sqrt(a.lowerLeg**2-(.006*o)**2)),r.rot.copy(W(176)),r.knee.set(0,-1,.35),r.toes=0}r(d?l:s.clone().addScaledVector(p,c)),e.solve(t),l.copy(bh(e)),u+=n-l.y}return l};function Eh(e,t){return _h(e,t.key,()=>{let n=e.body,r=n.scale,i=tf(),a=t.body??wh,o=t.surface?.(n)??0,s=(t.feet?.(n)??0)+.014,c=o+X(n),l=(n.upperArm+n.lowerArm)*.997,u=t.reach*q,d=t.half(n),f=d-n.rest.upperArmL.x,p=0,m=0;for(let r=0;r<3;r++){let r=Math.sqrt(Math.max(1e-6,l*l-f*f));p=c+r*Math.cos(u),m=a(e,i,p,e=>Ef(n,i,e.z+r*Math.sin(u),d,t.elbow,t.turnOut,o),t.tuck,s).z+r*Math.sin(u),f=d-e.pos.upperArmL.x}let h=()=>Ef(n,i,m,d,t.elbow,t.turnOut,o);for(let n=0;n<3;n++)a(e,i,p,h,t.tuck,s),p+=(l-e.pos.upperArmL.distanceTo(i.arm.L.hand))*.9/Math.max(.35,Math.cos(u));let g=new L(0,c,m),_=n=>a(e,i,n,h,t.tuck,s).distanceTo(g),v=c+.08*r,y=p;if(_(v)<t.depth*r)for(let e=0;e<16;e++){let e=(v+y)/2;_(e)<t.depth*r?v=e:y=e}else y=v;return{top:p,low:y,hands:m,h:o,pad:s}})}function Dh(e,t,n,r){let i=t.body,{top:a,low:o,hands:s,h:c,pad:l}=Eh(t,e);Ch(t,n,(e.body??wh)(t,n,$(a,o,r),()=>Ef(i,n,s,e.half(i),e.elbow,e.turnOut,c),e.tuck,l),r)}var Oh=e=>t=>{let{hands:n,h:r}=Eh(yh(t),e);return[{kind:`box`,width:1.1*t.scale,height:r,depth:.46,z:n-.04*t.scale+.23}]},kh=e=>t=>t.rest.upperArmL.x+e*t.scale,Ah=new L(.72,.25,-1);function jh(e,t,n){let r=e.body,i=J(Math.cos(n),Math.sin(n));t.pelvis.copy(W(90-n/q)),t.chest.copy(t.pelvis),t.head.copy(t.pelvis),yf(r,t.pelvis,J(0,r.ankle).addScaledVector(i,(r.upperLeg+r.lowerLeg)*.998),t.hips);for(let[e,n]of K){let i=t.leg[e];i.foot.set(n*r.rest.upperLegL.x,r.ankle,0),i.rot.copy(Yd(new L(0,0,1),new L(0,1,0))),i.knee.set(0,0,1),i.toes=0}}function Mh(e){return _h(e,`wall-pushup`,()=>{let t=e.body,n=t.scale,r=tf(),i=t.rest.upperArmL.x+.08*n,a=(t.upperArm+t.lowerArm)*.997,o=81*q,s=(e,t)=>{for(let[n,a]of K){let o=r.arm[n];o.hand.set(a*i,e,t),o.rot.copy(G(n,new L(a*.1,1,0).normalize(),new L(0,0,1))),o.elbow.set(a*.65,-1,-.3),o.grip=.04,o.shrug=0}},c=.14*n,l=t.rest.upperArmL.y-c,u=a;jh(e,r,o);for(let t=0;t<4;t++){s(l,u),e.solve(r);let t=e.pos.upperArmL;l=t.y-c,u=t.z+Math.sqrt(Math.max(1e-6,a*a-(i-t.x)**2-c**2))}let d=u+X(t),f=t=>(jh(e,r,t),s(l,u),e.solve(r),d-bh(e).z),p=55*q,m=o;for(let e=0;e<16;e++){let e=(p+m)/2;f(e)<.165*n?p=e:m=e}return{top:o,low:m,y:l,z:u,wall:d,half:i}})}var Nh={id:`wall-pushup`,revision:1,stage:`tall`,planted:[`handL`,`handR`,`footL`,`footR`],kind:`reps`,period:2.8,camera:`side`,azimuth:112,elevation:4,beat:.97,props:e=>[{kind:`wall`,z:Mh(yh(e)).wall}],detail:{delt_lat:.14,delt_ant:.5},standard:`Hands on the wall at chest height; the body stays one straight line from heels to head; nose to the wall; arms fully straight at the top; elbows about 45° from the ribs.`,effort:Sh,pose(e,t,n){let r=xh(e),i=Mh(t);jh(t,n,$(i.top,i.low,r));for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*i.half,i.y,i.z),r.rot.copy(G(e,new L(t*.1,1,0).normalize(),new L(0,0,1))),r.elbow.set(t*.65,-1,-.3),r.grip=.04,r.shrug=0}}},Ph={key:`incline-pushup`,surface:e=>e.rest.upperLegL.y*.93,reach:44,half:kh(.035),elbow:Ah,turnOut:8,depth:.22},Fh={key:`low-incline-pushup`,surface:e=>e.rest.lowerLegL.y*.95,reach:22,half:kh(.035),elbow:Ah,turnOut:8,depth:.21},Ih={key:`knee-pushup`,body:Th,reach:0,half:kh(.035),elbow:Ah,turnOut:8,depth:.19},Lh={key:`diamond-pushup`,reach:-5,half:e=>.07*e.scale,elbow:new L(.28,.25,-1),turnOut:-40,depth:.19},Rh={key:`decline-pushup`,feet:e=>e.rest.lowerLegL.y*.92,reach:0,half:kh(.035),elbow:Ah,turnOut:8,depth:.19,tuck:4},zh={key:`pseudo-planche-pushup`,reach:-33,half:kh(.025),elbow:new L(.3,.3,-1),turnOut:72,depth:.37,tuck:5},Bh={id:`incline-pushup`,revision:1,stage:`square`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:2.8,camera:`side`,azimuth:72,elevation:5,beat:.97,props:Oh(Ph),detail:{delt_lat:.14,delt_ant:.5},standard:`Hands on a surface at about hip height; a rigid plank from heels to head; chest to the edge; arms fully straight at the top.`,effort:Sh,pose:(e,t,n)=>Dh(Ph,t,n,xh(e))},Vh={id:`low-incline-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:2.9,camera:`side`,azimuth:70,elevation:6,beat:.97,props:Oh(Fh),detail:{delt_lat:.14,delt_ant:.55},standard:`Hands on a surface at about knee height; the same straight line as a floor push-up; chest to the edge; arms fully straight at the top.`,effort:Sh,pose:(e,t,n)=>Dh(Fh,t,n,xh(e))},Hh={id:`knee-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`lowerLegL`,`lowerLegR`,`footL`,`footR`],kind:`reps`,period:2.8,camera:`side`,azimuth:68,elevation:7,beat:.97,detail:{delt_lat:.14,delt_ant:.6,pec_upper:.85},standard:`Knees on the floor; one straight line from knees to head, hips neither left behind nor sagging; chest to the floor between the hands; arms fully straight at the top.`,effort:Sh,pose:(e,t,n)=>Dh(Ih,t,n,xh(e))},Uh={id:`diamond-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3,camera:`side`,azimuth:62,elevation:9,beat:.97,detail:{delt_lat:.12,delt_ant:.55},standard:`Hands together under the chest; elbows track back close to the ribs, not out to the sides; chest lowers onto the hands; arms fully straight at the top; body straight.`,effort:Sh,pose:(e,t,n)=>Dh(Lh,t,n,xh(e))},Wh={id:`decline-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3,camera:`side`,azimuth:68,elevation:6,beat:.97,props:e=>[{kind:`box`,width:.6*e.scale,height:e.rest.lowerLegL.y*.92,depth:.42,z:-.12}],detail:{delt_lat:.3,pec_upper:1},standard:`Feet on a box at about knee height; ribs down and no sag in the lower back; chest to the floor between the hands; arms fully straight at the top.`,effort:Sh,pose:(e,t,n)=>Dh(Rh,t,n,xh(e))},Gh={id:`pseudo-planche-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3.2,camera:`side`,azimuth:68,elevation:7,beat:.97,detail:{delt_lat:.3,delt_ant:1,pec_upper:1,forearm_ext:.2},standard:`Hands by the waist, fingers turned out; shoulders well in front of the wrists at the top and the lean held through the whole repetition; hips in line, not rising; arms fully straight at the top.`,effort:Sh,pose:(e,t,n)=>Dh(zh,t,n,xh(e))};function Kh(e,t,n,r){let i=ef(t,n,(e.upperLeg+e.lowerLeg)*.998,e.ball.length(),new L(0,1,-.2)),a=n.clone().sub(i).normalize();r.foot.copy(i),r.rot.copy(new I().setFromUnitVectors(e.ball.clone().normalize(),a)),r.toes=Math.max(0,Math.min(85,(Math.atan2(e.ball.y,e.ball.z)-Math.atan2(a.y,Math.hypot(a.x,a.z)))/q)),r.knee.set(0,-1,.2)}function qh(e,t,n,r,i){let a=e.body,o=Bd(r),s=new L,c=n;for(let r=0;r<4;r++){let r=Sf(a,0,c);Cf(a,r,t,3),t.pelvis.premultiply(o),t.chest.premultiply(o),t.hips.applyQuaternion(o),i(),e.solve(t);for(let[n,i]of K)Kh(a,e.pos[`upperLeg${n}`],J(0,r.pad,i*a.rest.upperLegL.x),t.leg[n]);e.solve(t),s.copy(bh(e)),c+=n-s.y}return s}function Jh(e,t,n,r){let i=X(e);t.arm.L.hand.set(n,i,r),t.arm.L.rot.copy(G(`L`,new L(.26,0,1).normalize(),new L(0,-1,0))),t.arm.L.elbow.set(.5,.25,-1),t.arm.R.hand.set(-n,i,r),t.arm.R.rot.copy(G(`R`,new L(-1,0,.45).normalize(),new L(0,-1,0))),t.arm.R.elbow.set(0,.5,-1);for(let[e]of K)t.arm[e].grip=.04,t.arm[e].shrug=0}function Yh(e){return _h(e,`archer-pushup`,()=>{let t=e.body,n=t.scale,r=tf(),i=(t.upperArm+t.lowerArm)*.997,a=t.rest.upperArmL.x+.56*i,o=Sf(t,0,X(t)+.83*i).shoulder.z,s=(n,s)=>{let c=s;for(let s=0;s<6;s++){qh(e,r,c,n,()=>Jh(t,r,a,o));let s=e.pos.upperArmR.distanceTo(r.arm.R.hand)-i,l=Math.max(.12,(e.pos.upperArmR.y-r.arm.R.hand.y)/i);c-=s/l}return c},c=s(0,X(t)+.83*i);for(let t=0;t<2;t++)o=bh(e).z,c=s(0,c);let l=0,u=16,d=c;for(let e=0;e<12;e++){let e=(l+u)/2;d=s(e,d),d>X(t)+.2*n?l=e:u=e}return{half:a,z:o,top:c,turn:u}})}var Xh={id:`archer-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3.4,camera:`front`,azimuth:28,elevation:16,beat:.97,detail:{delt_lat:.14,delt_ant:.55,"pec.R":.5,"pec_upper.R":.5,"triceps.R":.3,"delt_ant.R":.35},standard:`Wide hands; the chest shifts over the working hand as that arm bends; the assisting arm stays straight the whole way; hips square to the floor; body straight.`,effort:Sh,pose(e,t,n){let r=t.body,i=xh(e),a=Yh(t),o=(r.upperArm+r.lowerArm)*.997,s=a.turn*i,c=$(a.top,X(r)+.2*r.scale,i),l=new L;for(let e=0;e<4;e++){l=qh(t,n,c,s,()=>Jh(r,n,a.half,a.z));let e=t.pos.upperArmR.distanceTo(n.arm.R.hand)-o;c-=e/Math.max(.12,(t.pos.upperArmR.y-n.arm.R.hand.y)/o)}l=qh(t,n,c,s,()=>Jh(r,n,a.half,a.z)),Ch(t,n,l,i),n.head.premultiply(Bd(s))}},Zh=e=>e.rest.upperLegL.y*.95;function Qh(e){return _h(e,`elevated-pike-pushup`,()=>{let t=e.body,n=t.scale,r=t.upperArm+t.lowerArm,i=t.height-t.rest.upperArmL.y,a=X(t),o=72*q,s=J(-Math.cos(o)*r*.99,a+Math.sin(o)*r*.99),c=s.clone().add(J(-Math.cos(o),Math.sin(o)).multiplyScalar(t.trunk)),l=Zh(t)+.014*n,u=c.z-Math.sqrt(Math.max(0,((t.upperLeg+t.lowerLeg)*.998+t.ball.length()*.25)**2-(c.y-l)**2)),d=67*q;return{a0:o,a1:d,top:s,low:J(.085*n-Math.cos(d)*i,.008*n+Math.sin(d)*i),ballY:l,ballZ:u}})}var $h={id:`elevated-pike-pushup`,revision:1,stage:`square`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3.2,camera:`side`,azimuth:68,elevation:5,beat:.97,props:e=>{let t=Qh(yh(e));return[{kind:`box`,width:.6*e.scale,height:Zh(e),depth:.5,z:t.ballZ-.13}]},detail:{pec_upper:.25,delt_post:.2},standard:`Feet on a box at hip height; hips stay stacked over the shoulders; the head goes to the floor in front of the hands; elbows back, not flared; arms fully straight at the top.`,effort:Sh,pose(e,t,n){let r=t.body,i=r.scale,a=xh(e),o=Qh(t),s=Z(a),c=$(o.a0,o.a1,s),l=o.top.clone().lerp(o.low,s);l.z+=Math.sin(a*Math.PI)*.015*i;let u=90+c/q;n.chest.copy(W(u)),n.pelvis.copy(W(u+4)),n.head.copy(W(u-$(8,2,a))),yf(r,n.pelvis,l.clone().add(J(-Math.cos(c),Math.sin(c)).multiplyScalar(r.trunk)),n.hips),Ef(r,n,0,r.rest.upperArmL.x+.03*i,new L(.78,.1,-1),6);for(let[e]of K)n.arm[e].shrug=$(.9,.2,a);Y(t,n,l);for(let[e,i]of K)xf(r,t.pos[`upperLeg${e}`],J(o.ballZ,o.ballY,i*r.rest.upperLegL.x),new L(0,.6,-1),n.leg[e]),n.leg[e].knee.set(0,-.3,1)}};function eg(e,t,n,r,i,a){let o=e.body,s=o.scale,c=Math.asin(Math.max(-.3,Math.min(.3,(r-.095*s-n.z)/(o.trunk+o.upperLeg+o.lowerLeg))))/q;t.chest.copy(W(180+c)),t.pelvis.copy(W(180+c)),t.head.copy(W(180+c-a)),Ef(o,t,0,o.rest.upperArmL.x+.035*s,new L(.8,0,-1),4);for(let[e]of K)t.arm[e].shrug=i;t.hips.set(0,n.y+o.trunk,n.z),Y(e,t,n),Tf(e,t,0,20)}var tg=e=>e.pos.head.clone().add(new L(0,e.body.height-e.body.rest.head.y,0).applyQuaternion(e.rot.head));function ng(e){return _h(e,`wall-hspu`,()=>{let t=e.body,n=t.scale,r=tf(),i=.4*n,a=(t.upperArm+t.lowerArm)*.9985,o=J(.03*n,X(t)+a);for(let t=0;t<4;t++)eg(e,r,o,i,1,16),o.y+=a-e.pos.upperArmL.distanceTo(r.arm.L.hand);let s=J(.2*n,.03*n),c=J(.16*n,.37*n);for(let t=0;t<5;t++)eg(e,r,c,i,.2,8),c.add(s.clone().sub(tg(e)).setX(0));return{wall:i,top:o,low:c}})}var rg=[Nh,Bh,Vh,Hh,Uh,Wh,Xh,Gh,$h,{id:`wall-hspu`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.6,camera:`side`,azimuth:114,elevation:3,beat:.97,props:e=>[{kind:`wall`,z:ng(yh(e)).wall}],detail:{pec_upper:.25,delt_post:.25,forearm_flex:.5,forearm_ext:.4},standard:`Back to the wall, heels resting on it; the head touches the floor in front of the hands, making a triangle with them; pressed to fully locked, shrugged arms; body straight, no kick from the legs.`,effort:Sh,pose(e,t,n){let r=xh(e),i=ng(t),a=Z(r);eg(t,n,i.top.clone().lerp(i.low,a),i.wall,$(1,.2,a),$(16,8,a))}}],ig=e=>e.body.rest.upperArmL.x+.035*e.body.scale,ag=new L(.72,.25,-1),og=new Map;function sg(e){let t=og.get(e.body.id);if(!t){let n=e.body,r=X(n)+(n.upperArm+n.lowerArm)*.995,i={hips:new L,pelvis:W(0),chest:W(0),head:W(0),arm:{L:cg(),R:cg()},leg:{L:lg(),R:lg()}};t={top:r,hands:wf(e,i,0,r,t=>Ef(n,i,t.z-.004*n.scale,ig(e),ag)).z-.004*n.scale},og.set(n.id,t)}return t}var cg=()=>({hand:new L,rot:W(0),elbow:new L,grip:0,shrug:0}),lg=()=>({foot:new L,rot:W(0),knee:new L,toes:0}),ug={id:`pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:2.9,camera:`side`,azimuth:68,elevation:7,beat:.97,detail:{delt_lat:.14,delt_ant:.6,pec_upper:.85},standard:`Body straight from heels to head throughout; chest to within a fist of the floor; elbows fully straight at the top; elbows about 45° from the ribs.`,effort:e=>.35+.65*Q(e,.42,.06),pose(e,t,n){let r=t.body,i=Q(e,.42,.06),{top:a,hands:o}=sg(t),s=wf(t,n,0,$(a,.2*r.scale,i),()=>Ef(r,n,o,ig(t),ag)),c=Math.asin(Math.min(1,(s.y-t.pos.upperLegL.y)/r.trunk))*(180/Math.PI);n.head.copy(W(90-c-14+6*i))}},dg=e=>(e.upperLeg+e.lowerLeg)*.998,fg=e=>e.upperArm+e.lowerArm;function pg(e,t,n,r=26){let i=e(t)>0;for(let a=0;a<r;a++){let r=(t+n)/2;e(r)>0===i?t=r:n=r}return(t+n)/2}var mg=new Map;function hg(e,t){return mg.has(e)||mg.set(e,t()),mg.get(e)}var gg=e=>hg(`rig:${e.id}`,()=>new Zd(e.id)),_g=.0165,vg=.17;function yg(e,t){let n=Math.cos(t*q),r=Math.sin(t*q);return(.045*n+.035*r+Math.hypot(.034*n,.04*r))*e.scale}var bg=(e,t)=>J(0,t.surface(e)+yg(e,t.toes)),xg=e=>J(-Math.cos(e*q),Math.sin(e*q));function Sg(e,t){let n=e.rest,r=bg(e,t).addScaledVector(xg(t.top),dg(e)),i=new L(0,n.upperArmL.y-vg*e.scale-n.upperLegL.y,.1245*e.scale-n.upperLegL.z).applyQuaternion(W(t.top-90));return{height:r.y+i.y,z:r.z+i.z,width:1.3*e.scale,radius:_g*e.scale}}function Cg(e,t,n,r,i){let a=e.body,o=a.scale,s=W(r-90),c=bg(a,n);t.pelvis.copy(s),t.chest.copy(s),t.head.copy(W(r-90+8)),yf(a,s,c.clone().addScaledVector(xg(r),dg(a)),t.hips);let l=Sg(a,n),u=(n.top-30)*q,d=new L(0,Math.cos(u),Math.sin(u)),f=new L(0,-Math.sin(u),Math.cos(u));for(let[e,u]of K){let p=t.leg[e];p.foot.set(u*a.rest.upperLegL.x,c.y,c.z),p.rot.copy(W(-n.toes)),p.knee.set(0,Math.cos(r*q),Math.sin(r*q)),p.toes=0;let m=t.arm[e];Df(a,m,e,new L(u*(a.rest.upperArmL.x+.09*o),l.height,l.z),l.radius,d,f),m.elbow.copy(new L(u*.75,-.55,-1).applyQuaternion(s)),m.shrug=$(.3,-.7,i)}}var wg=(e,t,n)=>hg(`${n}:${e.body.id}`,()=>{let n=tf();return pg(r=>(Cg(e,n,t,r,0),e.solve(n),e.pos.upperArmL.distanceTo(n.arm.L.hand)-fg(e.body)*.997),t.top-45,t.top)});function Tg(e,t,n,r){return{id:e,revision:1,kind:`reps`,camera:`side`,azimuth:108,elevation:7,stage:`low`,props:e=>[{kind:`bar`,...Sg(e,t)},...r?[r(e)]:[]],planted:[`handL`,`handR`,`footL`,`footR`],beat:.47,detail:{forearm_flex:.4,forearm_ext:.25,delt_post:.7},effort:e=>.3+.7*Q(e,.38,.1),pose(n,r,i){let a=Q(n,.38,.1);Cg(r,i,t,$(wg(r,t,e),t.top,a),a)},...n}}var Eg=Tg(`incline-row`,{top:52,surface:()=>0,toes:25},{period:3,standard:`Body straight from heels to head at an incline of about 40°; arms fully straight at the bottom; the chest comes to the bar; elbows about 45° from the ribs.`}),Dg=Tg(`horizontal-row`,{top:30,surface:()=>0,toes:62},{period:3.1,standard:`Heels on the floor, body rigid; full arm extension at the bottom with the body near horizontal and the hips off the floor; chest to the bar at the top.`}),Og=e=>.8*e.scale,kg=Tg(`feet-elevated-row`,{top:0,surface:Og,toes:76},{period:3.3,detail:{forearm_flex:.4,forearm_ext:.25,delt_post:.7,glutes:.4},standard:`Feet level with the hands; the body is horizontal when the chest reaches the bar, with no pike at the hips; arms fully straight at the bottom; a beat held at the top.`},e=>({kind:`box`,width:.62*e.scale,height:Og(e),depth:.36*e.scale,z:.05*e.scale})),Ag=.019,jg=e=>1.36*e.scale,Mg=e=>e.rest.upperArmL.x+.075*e.scale,Ng=e=>({kind:`rails`,height:jg(e),gap:Mg(e)*2,length:.9*e.scale,radius:Ag*e.scale,z:0}),Pg={straight:{out:.3,down:-.954},draped:{out:.77,down:-.64}};function Fg(e,t,n,r=`straight`){let i=Pg[r],a=e.body,o=a.scale;for(let[e,s]of K){let c=t.arm[e];Df(a,c,e,new L(s*Mg(a),jg(a),0),Ag*o,new L(s*i.out,i.down,0),new L(s*i.down,-i.out,0),r===`straight`?1:.9),c.elbow.set(s*.22,.1,-1),c.shrug=$(-1,-.4,n)}let s=t.arm.L.hand;t.chest.copy(W($(6,27,n))),t.pelvis.copy(W($(4,21,n))),t.head.copy(W($(4,15,n)));let c=.03*o,l=new L(0,s.y+.2*o,.17*o),u=e=>new L(0,s.y+Math.sqrt(Math.max(0,(fg(a)*.9985)**2-e**2-c**2)),c),d=e=>e.lerp(l,n),f=d(u(s.x-a.rest.upperArmL.x));t.hips.set(0,f.y-a.trunk,f.z),Y(e,t,f),Y(e,t,d(u(Math.abs(s.x-e.pos.upperArmL.x))))}var Ig=e=>$(4,21,e)+$(8,13,e),Lg=(e,t,n)=>({id:`dip`,revision:e,kind:`reps`,period:3.2,camera:`three-quarter`,azimuth:58,elevation:3,stage:`tall`,props:e=>[Ng(e)],planted:[`handL`,`handR`],beat:.97,detail:{delt_lat:.15,delt_ant:.6,pec_upper:.55},standard:n,effort:e=>.35+.65*Q(e,.42,.06),pose(e,n,r){let i=Q(e,.42,.06);Fg(n,r,i,t),Tf(n,r,Ig(i),46)}}),Rg=Lg(2,`straight`,`Starts and ends with the arms locked and the shoulders pressed down; shoulders pass below the elbows at the bottom; chest slightly forward, elbows tracking back; the legs do not swing; the wrists straight over the rails, the hands closed round them.`),zg=Lg(1,`draped`,`Starts and ends with the arms locked and the shoulders pressed down; shoulders pass below the elbows at the bottom; chest slightly forward, elbows tracking back; the legs do not swing.`),Bg=e=>hg(`step:${e.id}`,()=>{let t=gg(e);Fg(t,tf(),0);let n=t.pos.upperLegL;return{top:n.y-dg(e)*.985-e.ankle,z:n.z+.02*e.scale}}),Vg=.05,Hg=.8,Ug=.86,Wg=.97,Gg=e=>.85*e+.15*Z(e),Kg=e=>e<Vg?0:e<Hg?Gg((e-Vg)/.75):e<Ug?1:e<Wg?1-Z((e-Ug)/.10999999999999999):0,qg=e=>e<Vg?1-Z(e/Vg):e<Hg?0:e<Ug?Z((e-Hg)/.05999999999999994):1,Jg=(e,t,n)=>({id:`negative-dip`,revision:e,kind:`reps`,period:7,camera:`three-quarter`,azimuth:58,elevation:3,stage:`tall`,props:e=>[Ng(e),{kind:`box`,width:.34*e.scale,height:Bg(e).top,depth:.4*e.scale,z:Bg(e).z+.04*e.scale}],planted:[`handL`,`handR`],beat:Hg,detail:{delt_lat:.15,delt_ant:.6,pec_upper:.55},standard:n,effort:e=>e<Vg||e>=Ug?.15:e<Hg?.45+.55*Kg(e):.6,pose(e,n,r){let i=n.body;Fg(n,r,Kg(e),t);let a=qg(e),o=Bg(i),s=e=>new L(0,-Math.cos(e*q),Math.sin(e*q));for(let[e,t]of K){let c=r.leg[e],l=n.pos[`upperLeg${e}`].clone().addScaledVector(s(20),i.upperLeg).addScaledVector(s(-88),i.lowerLeg*.995);c.foot.copy(l).lerp(new L(t*i.rest.upperLegL.x,o.top+i.ankle,o.z),a),c.rot.copy(W(132)).slerp(new I,a),c.knee.set(0,0,1),c.toes=0}}}),Yg=Jg(2,`straight`,`Starts locked out with the shoulders pressed down; lowers evenly for at least five seconds, without dropping through the bottom, until the shoulders are below the elbows; the way back up is a step, not a press; the wrists straight over the rails throughout.`),Xg=Jg(1,`draped`,`Starts locked out with the shoulders pressed down; lowers evenly for at least five seconds, without dropping through the bottom, until the shoulders are below the elbows; the way back up is a step, not a press.`),Zg=e=>.45*e.scale,Qg=64;function $g(e,t,n,r,i){let a=e.body,o=a.scale,s=W(r);t.pelvis.copy(s),t.chest.copy(s),t.head.copy(W(r+4));let c=yg(a,Qg);for(let[e,n]of K){let r=t.arm[e];r.hand.set(n*(a.rest.upperArmL.x+.025*o),Zg(a)+X(a),-.04*o),r.rot.copy(G(e,new L(n*.1,-.12,1).normalize(),new L(0,-1,-.12).normalize())),r.elbow.set(n*.12,.1,-1),r.grip=.55,r.shrug=-.5;let s=t.leg[e];s.foot.set(n*a.rest.upperLegL.x,c,i),s.rot.copy(W(-64)),s.knee.set(0,1,.3),s.toes=0}let l=J(0,n-a.trunk);for(let r=0;r<5;r++)l.z=i-Math.sqrt(Math.max(0,dg(a)**2-(l.y-c)**2)),yf(a,s,l,t.hips),e.solve(t),l.y+=n-(e.pos.upperArmL.y+e.pos.upperArmR.y)/2}var e_=e=>hg(`bench:${e.body.id}`,()=>{let t=e.body,n=tf(),r=Zg(t)+X(t),i={top:-7,low:-2},a=(t,r,i)=>a=>($g(e,n,a,r,i),e.pos.upperArmL.distanceTo(n.arm.L.hand)-t),o=Math.hypot(t.upperArm,t.lowerArm),s=.95*t.scale,c=0;for(let l=0;l<4;l++)c=pg(a(o,i.low,s),r+.15*t.scale,r+fg(t)),$g(e,n,c,i.low,s),s+=.15*t.scale-e.pos.upperLegL.z;return{ankleZ:s,low:c,top:pg(a(fg(t)*.997,i.top,s),c,r+fg(t)*1.02),leans:i}}),t_=[Eg,Dg,kg,{id:`bench-dip`,revision:1,kind:`reps`,period:3,camera:`side`,azimuth:68,elevation:6,stage:`square`,props:e=>[{kind:`box`,width:1.1*e.scale,height:Zg(e),depth:.4*e.scale,z:-.2*e.scale}],planted:[`handL`,`handR`,`footL`,`footR`],beat:.97,detail:{delt_lat:.15,delt_ant:.55,pec_upper:.3},standard:`Hips stay close to the bench; elbows point straight back and bend to a right angle, no deeper; shoulders stay down, not rolled forward; full lockout at the top; heels planted.`,effort:e=>.3+.7*Q(e,.42,.06),pose(e,t,n){let r=Q(e,.42,.06),i=e_(t);$g(t,n,$(i.top,i.low,r),$(i.leans.top,i.leans.low,r),i.ankleZ)}},Yg,Rg],n_={id:`squat`,revision:1,stage:`square`,planted:[`footL`,`footR`],kind:`reps`,period:3.2,camera:`three-quarter`,azimuth:52,elevation:5,beat:.97,standard:`Heels stay down; hip crease below the top of the knee; knees over the toes, not caving in; back keeps its shape; full stand at the top.`,effort:e=>.3+.7*Q(e,.44,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.44,.06),o=.19*i,s=r.upperLeg+r.lowerLeg,c=r.ankle+Math.sqrt((s*.9992)**2-(o-r.rest.upperLegL.x)**2),l=J($(.005,-.245,Z(a))*i,$(c,r.ankle+r.lowerLeg*.84,a));n.pelvis.copy(W($(0,39,a))),n.chest.copy(W($(-1,35,a))),n.head.copy(W($(1,12,a))),yf(r,n.pelvis,l,n.hips);let u=n.chest;for(let[e,t]of K){let i=n.leg[e],s=new L(t*.3,0,1).normalize();i.foot.set(t*o,r.ankle,0),i.rot.copy(Yd(s,new L(0,1,0))),i.knee.copy(s),i.toes=0;let c=n.arm[e],l=r.rest[`upperArm${e}`].clone().sub(r.rest.hips).applyQuaternion(u).add(n.hips),d=new L(t*$(.16,.06,a),$(-1,.04,a),$(.05,1,a)).normalize();c.hand.copy(l).addScaledVector(d,(r.upperArm+r.lowerArm)*$(.985,.96,a)),c.elbow.set(t*.6,$(0,-1,a),$(-1,-.2,a)),c.rot.copy(G(e,d.clone().add(new L(0,0,.12)).normalize(),new L(-t,$(0,-.5,a),-.2).normalize())),c.grip=.15,c.shrug=-.2}}},r_={id:`split-squat`,revision:1,stage:`square`,planted:[`footL`,`toesR`],kind:`reps`,period:3.2,camera:`side`,azimuth:62,elevation:5,beat:.97,detail:{"quads.R":.6,"glutes.R":.45,"glute_med.L":.75,"hamstrings.R":.3,"adductors.R":.3,"hip_flexors.R":.3},standard:`Trunk upright; front heel down and front knee over the foot; back knee to just above the floor; straight up and down, no forward lunge of the trunk.`,effort:e=>.3+.7*Q(e,.44,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.44,.06),o=r.rest.upperLegL.x,s=J(r.upperLeg*.98,r.ankle,o+.01*i),c=J(-(r.lowerLeg+.02*i),.014*i,-o-.01*i),l=r.ankle+Math.sqrt(((r.upperLeg+r.lowerLeg)*.975)**2-s.z**2),u=r.ankle+r.lowerLeg*.99,d=J($(.02,0,a)*i,$(l,u,a));n.pelvis.copy(W($(2,5,a))),n.chest.copy(W($(1,5,a))),n.head.copy(W(2)),yf(r,n.pelvis,d,n.hips),n.leg.L.foot.copy(s),n.leg.L.rot.copy(Yd(new L(0,0,1),new L(0,1,0))),n.leg.L.knee.set(.05,0,1),n.leg.L.toes=0;let f=($(52,74,a)-Math.atan2(r.ball.y,r.ball.z)*(180/Math.PI))*(Math.PI/180),p=r.ball.length();bf(r,J(c.z-p*Math.cos(f),c.y+p*Math.sin(f),c.x),c,n.leg.R),n.leg.R.knee.set(-.05,-.55,1);for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*(o+.085*i),d.y+.085*i,d.z+.045*i),r.elbow.set(t*1,.1,-.75),r.rot.copy(G(e,new L(-t*.45,-.6,.66).normalize(),new L(-t,.15,-.3).normalize())),r.grip=.35,r.shrug=0}}},i_=Math.PI/180,a_=new L(0,1,0),o_=new L(0,0,1),s_=e=>[{kind:`bar`,...Af(e)}],c_=e=>(e.upperArm+e.lowerArm)*.9985,l_={forearm_flex:.5,forearm_ext:.3},u_=e=>({u:Math.max(0,(e-.08)/.92),active:Math.min(1,e/.08)});function d_(e,t,n,r){for(let i=0;i<4;i++)e.solve(t),t.hips.add(r.clone().sub(e.pos[n]));e.solve(t)}var f_=(e,t,n)=>n.clone().sub(e.pos[`lowerArm${t}`]);function p_(e,t,n,r,i,a,o,s,c=20){let l=a.clone().normalize(),u=l.angleTo(s.clone().normalize())/i_,d=u-c*Math.tanh(u/c),f=new I;u>.001&&f.slerp(new I().setFromUnitVectors(l,s.clone().normalize()),d/u),Df(e,t,n,r,i,l.applyQuaternion(f),o.clone().normalize().applyQuaternion(f))}function m_(e,t,n){let r=e=>Math.sin(e*i_);return(r($(t,n,e))-r(t))/(r(n)-r(t))}function h_(e,t,n,r,i=46,a){let o=e.body,s=t.leg[n],c=e.pos[`upperLeg${n}`],l=(o.upperLeg+o.lowerLeg)*.999,u=a===void 0?0:a-c.x,d=Math.sqrt(Math.max(0,l**2-u**2));s.foot.set(c.x+u,c.y-Math.cos(r*i_)*d,c.z+Math.sin(r*i_)*d),s.knee.set(0,Math.sin(r*i_),Math.cos(r*i_)),s.rot.copy(W(-r+i)),s.toes=i>20?-18:0}var g_={top:30,surface:()=>0,toes:62},__=.37;function v_(e,t,n,r,i){let a=e.body,o=Sg(a,g_),s=a.rest.upperArmL.x+__*a.scale;Cg(e,t,g_,n,i);let c=Bd(-r);t.hips.applyQuaternion(c),t.pelvis.premultiply(c),t.chest.premultiply(c),t.head.premultiply(c);let l=e=>new L(e*s,o.height,o.z??0);for(let[e,n]of K){let r=t.leg[e];r.foot.applyQuaternion(c),r.rot.premultiply(c),r.knee.applyQuaternion(c),t.arm[e].elbow.applyQuaternion(c),Df(a,t.arm[e],e,l(n),o.radius,a_,o_)}t.arm.R.shrug=$(.3,0,i),e.solve(t);for(let[n,r]of K)p_(a,t.arm[n],n,l(r),o.radius,a_,o_,f_(e,n,l(r)));e.solve(t)}var y_=(e,t)=>e.pos.upperArmR.distanceTo(t.arm.R.hand)-c_(e.body),b_=24,x_=e=>hg(`pulls:archer-row:${e.body.id}`,()=>{let t=tf(),n=(n,r)=>pg(i=>(v_(e,t,i,n,r),y_(e,t)),g_.top-48,g_.top+8,20),r=pg(e=>n(e,1)-g_.top,0,26,16),i=e=>r*m_(e,36,72);return{turn:i,angles:Array.from({length:25},(e,t)=>n(i(t/b_),t/b_))}});function S_(e,t,n){let r=x_(e),i=r.turn(n),a=Math.min(23,Math.floor(n*b_)),o=n*b_-a,s=r=>(v_(e,t,r,i,n),y_(e,t)),c=$(r.angles[a],r.angles[a+1],o)-.3,l=s(c),u=c+.3,d=s(u);for(let e=0;e<4&&Math.abs(d)>1e-6&&d!==l;e++){let e=u-d*(u-c)/(d-l);c=u,l=d,u=e,d=s(u)}}var C_={id:`archer-row`,revision:1,kind:`reps`,period:3.6,camera:`three-quarter`,azimuth:32,elevation:22,stage:`low`,props:e=>[{kind:`bar`,...Sg(e,g_)}],beat:.47,detail:{delt_post:.7,"lats.R":.5,"mid_back.R":.5,"rear_cuff.R":.4,"biceps.R":.12,"delt_post.R":.3},standard:`Wide grip, body straight from heels to head; the chest is rowed to the working hand while the assisting arm stays straight the whole way; hips and shoulders stay level, not rolled towards the working side; both arms straight at the bottom.`,effort:e=>.3+.7*Q(e,.4,.1),pose(e,t,n){S_(t,n,Q(e,.4,.1))}},w_=[21,25],T_={id:`band-pullup`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:3.6,camera:`three-quarter`,azimuth:42,elevation:2,beat:.5,props:e=>[...s_(e),{kind:`band`,x:0,height:Af(e).height,z:Af(e).radius,to:`toesR`}],detail:{...l_,rear_cuff:.6},standard:`A full pull-up in the band: from a dead hang with straight arms, shoulders set first, to the chin over the bar, and lowered all the way under control. The banded leg stays straight and still; no bounce out of the band at the bottom.`,effort:e=>.2+.65*Q(e,.4,.1),pose(e,t,n){let{u:r,active:i}=u_(Q(e,.4,.1));jf(t,n,r,i),h_(t,n,`L`,$(5,9,r)),h_(t,n,`R`,$(w_[0],w_[1],r),8,0)}},E_=.365;function D_(e,t,n,r,i,a){let o=e.body,s=o.scale,c=Af(o),l=o.rest.upperArmL.x+E_*s,u=e=>new L(e*l,c.height,0);for(let[e,n]of K)Df(o,t.arm[e],e,u(n),c.radius,a_,o_);let d=-8*n;t.chest.copy(Vd(d).multiply(W($(1,-13,n)))),t.pelvis.copy(Vd(d*.5).multiply(W($(5,0,n)))),t.head.copy(W($(-4,-16,Z(n)))),t.arm.L.elbow.set(1,$(-.5,-.9,n),$(.5,-.15,n)),t.arm.L.shrug=$(1-1.2*r,-.9,n),t.arm.R.elbow.set(-1,-.5,.5),t.arm.R.shrug=$(1-1.2*r,-.5,n);let f=new L(i,a,-(c.radius+.012*s)+$(.004,-.08,n)*s-Math.sin(n*Math.PI)*.02*s);t.hips.set(i,a-o.trunk,f.z),e.solve(t);for(let[n,r]of K)p_(o,t.arm[n],n,u(r),c.radius,a_,o_,f_(e,n,u(r)));Y(e,t,f)}function O_(e,t,n,r,i){let a=e.body,o=c_(a),s=Math.min(.99*o,.33499999999999996*a.scale+i),c=Af(a).height-.06*a.scale-Math.sqrt(o**2-s**2);for(let a=0;a<6;a++){D_(e,t,n,r,i,c);let a=e.pos.upperArmR,s=t.arm.R.hand,l=s.y-a.y,u=a.distanceToSquared(s)-l**2,d=l-Math.sqrt(Math.max(0,o**2-u));if(Math.abs(d)<1e-5)break;c+=d}}var k_=e=>hg(`pulls:archer:${e.body.id}`,()=>{let t=e.body,n=tf(),r=c_(t),i=Af(t).height+Af(t).radius*.35-t.knuckle-.022*t.scale,a=.2*t.scale;for(let t=0;t<12;t++){D_(e,n,1,1,a,i);let t=e.pos.upperArmR,o=n.arm.R.hand,s=t.x-o.x,c=t.distanceToSquared(o)-s**2;a+=Math.sqrt(Math.max(0,r**2-c))-s}return a}),A_={id:`archer-pullup`,revision:1,stage:`tall`,kind:`reps`,period:4.2,camera:`back`,azimuth:168,elevation:2,beat:.5,props:s_,detail:{...l_,rear_cuff:.6,"lats.R":.45,"biceps.R":.1,"mid_back.R":.3,"rear_cuff.R":.3},standard:`Wide grip, from a dead hang in the middle with both arms straight; pulled across to the working hand until the chin is over the bar beside it, the assisting arm straight along the bar; the body does not twist; lowered under control back to the middle.`,effort:e=>.3+.7*Q(e,.42,.1),pose(e,t,n){let{u:r,active:i}=u_(Q(e,.42,.1));O_(t,n,r,i,k_(t)*m_(r,37,80)),Tf(t,n,$(9,14,r),46)}},j_=e=>({...Af(e),height:Af(e).height+.1*e.scale}),M_=e=>[{kind:`bar`,...j_(e)}],N_=e=>new L(.1*e.scale,j_(e).height,0);function P_(e,t,n){let r=e.body,i=r.scale,a=n.u;Df(r,t.arm.L,`L`,N_(r),j_(r).radius,a_,o_);let o=t.arm.L.hand,s=$(n.turn[0],n.turn[1],a),c=$(n.tilt[0],n.tilt[1],a),[l,u]=[n.lean??[1,-10],n.look??[-4,-14]];t.chest.copy(Bd(s).multiply(Vd(c)).multiply(W($(l[0],l[1],a)))),t.pelvis.copy(Bd(s*.85).multiply(Vd(c*.55)).multiply(W($(5,0,a)))),t.head.copy(Bd(s).multiply(Vd(c*.3)).multiply(W($(u[0],u[1],Z(a))))),t.arm.L.elbow.copy(new L(.45,-1,$(.5,.25,a)).applyQuaternion(Bd(s))),t.arm.L.shrug=$(1-1.2*n.active,-.9,a);let[d,f,p]=n.top,m=new L(o.x,o.y-c_(r),o.z+.004*i).lerp(new L(o.x+p*i,o.y-d*i,o.z-f*i),a);m.z-=Math.sin(a*Math.PI)*(n.arc??.03)*i,t.hips.set(m.x-r.rest.upperArmL.x,m.y-r.trunk,m.z),d_(e,t,`upperArmL`,m)}function F_(e,t,n){let r=e.body,i=r.scale,a=t.arm.R,o=Bd(n);a.elbow.copy(new L(-1,0,-.6).applyQuaternion(o)),a.rot.copy(G(`R`,new L(-.12,-1,.15).normalize().applyQuaternion(o),new L(1,0,.1).normalize().applyQuaternion(o))),a.grip=.3,a.shrug=-.2;let s=new L(-.07,-.545,.07).setLength((r.upperArm+r.lowerArm)*.98).applyQuaternion(o);a.hand.copy(e.pos.upperChest).add(new L(-r.rest.upperArmL.x,.14*i,0).applyQuaternion(t.chest)).add(s);for(let n=0;n<3;n++)e.solve(t),a.hand.copy(e.pos.upperArmR).add(s);e.solve(t)}var I_=[6,32],L_={id:`one-arm-pullup`,revision:1,stage:`tall`,planted:[`handL`],kind:`reps`,period:5.2,camera:`back`,azimuth:158,elevation:2,beat:.5,props:M_,detail:{"lats.R":.12,"biceps.R":.04,"forearm_flex.R":.04,"forearm_ext.R":.04,"mid_back.R":.12,"rear_cuff.R":.1},standard:`One hand on the bar and nothing else: from a dead hang with the arm straight, the shoulder set before the elbow bends, to the chin over the bar; the body turns only slightly towards the working arm and does not swing or kick; lowered to a straight arm.`,effort:e=>.4+.6*Q(e,.44,.08),pose(e,t,n){let{u:r,active:i}=u_(Q(e,.44,.08));P_(t,n,{u:r,active:i,turn:I_,tilt:[9,11],top:[-.02,.172,.03]}),F_(t,n,$(I_[0],I_[1],r)),Tf(t,n,$(8,13,r),46)}},R_={drop:.34,beside:.09,ahead:.12},z_=e=>N_(e).add(new L(-R_.beside,-R_.drop,R_.ahead).multiplyScalar(e.scale)),B_={id:`assisted-oap`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:4.6,camera:`three-quarter`,azimuth:28,elevation:2,beat:.5,props:e=>[...M_(e),{kind:`band`,x:N_(e).x-R_.beside*e.scale,height:j_(e).height,z:j_(e).radius,to:`fingers1R`}],detail:{"lats.R":.4,"biceps.R":.3,"forearm_flex.R":.3,"forearm_ext.R":.25,"mid_back.R":.15,"rear_cuff.R":.12},standard:`The working hand on the bar, the other holding the band at least a forearm's length below it and never climbing; from a straight arm with the shoulder set to the chin over the bar; the chest stays facing the bar; lowered to a straight arm.`,effort:e=>.35+.65*Q(e,.42,.1),pose(e,t,n){let r=t.body,{u:i,active:a}=u_(Q(e,.42,.1)),o=n.arm.R;Df(r,o,`R`,z_(r),.012*r.scale,new L(.72,.68,.1),new L(.1,0,-1)),o.elbow.set(-1,$(-.2,-.8,i),$(.5,-.1,i)),o.shrug=$(.4,-.6,i),P_(t,n,{u:i,active:.5+.5*a,turn:[0,12],tilt:[6,8],top:[.01,.16,-.03]}),Tf(t,n,$(9,14,i),46)}},V_=.1,H_=.27,U_=.32,W_=.64,G_=e=>e<V_?0:e<H_?Z((e-V_)/.17)**.6:e<U_?1:e<W_?1-Z((e-U_)/.32):0,K_=e=>e<.03?0:e<V_?Z((e-.03)/.07):e<W_?1:1-Z(Math.min(1,(e-W_)/.12)),q_=[T_,C_,{id:`explosive-pullup`,revision:1,stage:`tall`,kind:`reps`,period:3.6,camera:`side`,azimuth:62,elevation:3,beat:H_,props:s_,detail:{...l_,rear_cuff:.7},standard:`From a still dead hang; pulled fast and high enough that the bar reaches the lower chest, the body hollow and leaning back round the bar; the hands stay on the bar; lowered under control to straight arms and reset before the next repetition.`,effort:e=>e<V_?$(.2,1,K_(e)):e<H_?1:e<U_?$(1,.55,Z((e-H_)/.04999999999999999)):$(.2,.55,K_(e)),pose(e,t,n){let r=t.body,i=r.scale,a=Af(r),o=r.rest.upperArmL.x+.125*i,s=G_(e),c=K_(e);n.chest.copy(W($(1,-22,s))),n.pelvis.copy(W($(5,-16,s))),n.head.copy(W($(-4,-20,Z(s))));for(let[e,t]of K)ap(r,n,e,t,o,.34*s),n.arm[e].elbow.set(t*$(1,.4,s),$(-.5,-.3,s),$(.5,-1,s)),n.arm[e].shrug=$(1-1.2*c,-.9,s);let l=e=>{let t=new L(0,a.height-(r.knuckle-a.radius*.35)-Math.sqrt(Math.max(0,c_(r)**2-e**2)),-.025*i),n=new L(0,a.height+.17*i,-.2*i);return t.lerp(n,s).add(new L(0,0,-Math.sin(s*Math.PI)*.035*i))},u=l(o-r.rest.upperArmL.x);n.hips.set(0,u.y-r.trunk,u.z),Y(t,n,u),Y(t,n,l(Math.hypot(n.arm.L.hand.x-t.pos.upperArmL.x,n.arm.L.hand.z-t.pos.upperArmL.z)));for(let[e]of K)h_(t,n,e,$(9,24,s),46)}},A_,B_,L_],J_=Math.PI/180,Y_=e=>[{kind:`bar`,...Af(e)}],X_=new L(0,0,1),Z_=e=>new L(0,-Math.cos(e*J_),Math.sin(e*J_)),Q_=e=>new L(0,Math.sin(e*J_),Math.cos(e*J_));function $_(e,t,n){let r=e.body,i=r.scale,a=Af(r),o=r.rest.upperArmL.x+(n.wide??.1)*i,s=(n.roll??0)*J_;t.chest.copy(W(n.chest)),t.pelvis.copy(W(n.pelvis)),n.turn&&t.pelvis.premultiply(new I().setFromAxisAngle(X_,n.turn*J_)),t.head.copy(W(n.head));let c=new L(0,-Math.sin(n.arm*J_),Math.cos(n.arm*J_)).multiplyScalar(n.elbow??0);for(let[e,i]of K){let l=t.arm[e];Df(r,l,e,new L(i*o,a.height,0),a.radius,new L(0,Math.cos(s),Math.sin(s)),new L(0,-Math.sin(s),Math.cos(s))),l.elbow.set(i,0,0).add(c),l.shrug=n.shrug??-.7}let l=t.arm.L.hand,u=(r.upperArm+r.lowerArm)*.9985,d=e=>{let t=Math.sqrt(Math.max(0,u**2-e**2));return new L(0,l.y-t*Math.cos(n.arm*J_),l.z-t*Math.sin(n.arm*J_))},f=d(o-r.rest.upperArmL.x);t.hips.copy(f).addScaledVector(new L(0,-1,0).applyQuaternion(t.chest),r.trunk),Y(e,t,f),Y(e,t,d(Math.abs(l.x-e.pos.upperArmL.x)))}function ev(e,t,n,r,i=0,a=46){let o=e.body,s=r-n,c=s-i;for(let[n]of K){let r=t.leg[n],l=e.pos[`upperLeg${n}`];i<1?r.foot.copy(l).addScaledVector(Z_(s),(o.upperLeg+o.lowerLeg)*.999):r.foot.copy(l).addScaledVector(Z_(s),o.upperLeg).addScaledVector(Z_(c),o.lowerLeg),r.knee.copy(Q_(s)),r.rot.copy(W(-c+a)),r.toes=-18}}var tv=(e,t)=>e.pos[`${t}L`].clone().add(e.pos[`${t}R`]).multiplyScalar(.5),nv=new Map;function rv(e,t,n,r){let i=`${n} ${e.body.id}`,a=nv.get(i);if(a===void 0){a=0;for(let n=0;n<4;n++){r(a),e.solve(t);let n=tv(e,`upperArm`),i=tv(e,`upperLeg`);a+=Math.atan2(i.y-n.y,Math.abs(i.z-n.z))/J_*(i.z>n.z?1:-1)}nv.set(i,a)}return a}var iv=e=>.7*Math.sin(e*Math.PI*2)+.3*Math.sin(e*Math.PI*6+1);function av(e,t,n,r,i,a){let o=(i,a=i)=>{$_(e,t,{arm:n,chest:-90+i,pelvis:-90+i,head:-76+i,roll:n*.55,shrug:-.8,elbow:-.3}),Tf(e,t,a,48,r)},s=rv(e,t,a,o);o(s+i,s)}var ov={id:`straddle-fl`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`three-quarter`,azimuth:36,elevation:16,props:Y_,standard:`Arms locked; shoulders, hips and feet in one level line with the hips fully open, no pike; legs straight and opened wide, toes pointed.`,effort:e=>.86+.1*iv(e),pose(e,t,n){av(t,n,37,42,iv(e)*.8,`straddle-fl`)}},sv={id:`front-lever`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:114,elevation:3,props:Y_,standard:`Arms locked; shoulders, hips and ankles in one straight, level line, no sag and no pike; legs together, toes pointed; shoulders pulled down.`,effort:e=>.9+.1*iv(e),pose(e,t,n){av(t,n,42,0,iv(e)*.8,`front-lever`)}},cv=1.67,lv={delt_lat:.3},uv={id:`tuck-back-lever`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:62,elevation:3,props:Y_,detail:lv,standard:`Face down under the bar on locked arms, hands behind the back; the back level, hips as high as the shoulders; knees tucked under the chest.`,effort:e=>.72+.1*iv(e),pose(e,t,n){let r=e=>{$_(t,n,{arm:-21,chest:94+e,pelvis:84+e,head:78+e,roll:-12,shrug:-.5,elbow:cv}),ev(t,n,84+e,132,142,40)};r(rv(t,n,`tuck-back-lever`,r)+iv(e))}},dv={id:`back-lever`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:5,camera:`side`,azimuth:66,elevation:3,props:Y_,detail:lv,standard:`Face down under the bar on locked arms; shoulders, hips and ankles in one straight, level line, with no arch to hold the legs up; legs together, toes pointed.`,effort:e=>.86+.1*iv(e),pose(e,t,n){let r=(e,r=e)=>{$_(t,n,{arm:-42,chest:90+e,pelvis:90+e,head:78+e,roll:-24,shrug:-.5,elbow:cv}),ev(t,n,90+e,r,0,48)},i=rv(t,n,`back-lever`,r);r(i+iv(e)*.8,i)}},fv={id:`german-hang`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`hold`,period:6,camera:`side`,azimuth:64,elevation:3,props:Y_,detail:lv,standard:`Hanging on locked arms that are behind the body, shoulders opened as far as they allow and still active; hips sunk below the bar; legs straight and together, feet clear of the floor.`,effort:e=>.5+.08*Math.sin(e*Math.PI*2),pose(e,t,n){let r=.5-.5*Math.cos(e*Math.PI*2),i=54-4*r;$_(t,n,{arm:-24+1.5*r,chest:i,pelvis:i-5,head:i-22,roll:-14,shrug:-.3-.2*r,elbow:cv}),ev(t,n,i-5,30+2*r,0,50)}};function pv(e,t){let n=e.length,r=0;for(;r<n-2&&t>e[r+1][0];)r++;let i=e[r],a=e[r+1],o=a[0]-i[0],s=Math.min(1,Math.max(0,(t-i[0])/o)),c=(t,r)=>t<=0||t>=n-1?0:(e[t+1][r]-e[t-1][r])/(e[t+1][0]-e[t-1][0]),l=s*s,u=l*s;return i.map((e,t)=>(2*u-3*l+1)*i[t]+(u-2*l+s)*o*c(r,t)+(3*l-2*u)*a[t]+(u-l)*o*c(r+1,t))}var mv=[[0,0,1,5,14,0,46,-5,-.1,.5],[.12,5,-8,-30,96,112,40,4,-.5,.4],[.3,19,-76,-100,152,150,-6,14,-.8,0],[.46,10,-140,-160,160,156,-24,12,-1,0],[.62,-6,-205,-223,160,156,-20,8,-1,.3],[.74,-18,-252,-274,140,150,20,-4,-.7,1.2],[.87,-23,-285,-298,86,96,40,-14,-.4,cv],[1,-24,-306,-311,30,0,50,-22,-.3,cv]];function hv(e,t,n){let[,r,i,a,o,s,c,l,u,d]=pv(mv,n);$_(e,t,{arm:r,chest:i,pelvis:a,head:i+l,shrug:u,elbow:d}),ev(e,t,a,o,Math.max(0,s),c)}function gv(e,t=.22){let n=1/(1-t);return e<=0?0:e>=1?1:e<t?n*e*e/(2*t):e>1-t?1-n*(1-e)*(1-e)/(2*t):n*(e-t/2)}var _v=e=>e<.03?0:e<.44?gv((e-.03)/.41):e<.55?1:e<.96?1-gv((e-.55)/.41):0,vv={id:`skin-the-cat`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:11,camera:`side`,azimuth:66,elevation:3,beat:.96,props:Y_,detail:lv,shift:e=>{let t=Math.min(1,Math.max(0,(_v(e)-.55)/.3));return{lats:1-.5*t,delt_ant:.45+.55*t}},standard:`From a hang, tucked tight; the legs pass between the arms and under the bar; lowered under control into the German hang, hips below the bar and feet off the floor; back the same way to the hang; arms straight throughout.`,effort:e=>{let t=_v(e);return $(.35,.6,t)+.35*Math.sin(t*Math.PI)},pose(e,t,n){hv(t,n,_v(e))}},yv=62,bv=.15,xv=new Map;function Sv(e,t){let n=e.body,r=xv.get(n.id);if(r!==void 0)return r;let i=Af(n),a=(n.upperLeg+n.lowerLeg)*.999+.05*n.scale,o=new L(0,i.height,bv*n.scale),s=n=>(Cv(e,t,n,0),tv(e,`upperLeg`).distanceTo(o)-a),c=-50,l=s(c),u=-65,d=s(u);for(let e=0;e<14&&Math.abs(d)>1e-4&&d!==l;e++){let e=Math.max(-95,Math.min(-20,u-d*(u-c)/(d-l)));c=u,l=d,u=e,d=s(u)}return xv.set(n.id,u),u}function Cv(e,t,n,r){$_(e,t,{arm:18,chest:n,pelvis:n-38,head:n+16,roll:8,shrug:-.9,elbow:-.3,turn:r*.85})}var wv=[fv,vv,uv,{id:`windshield-wipers`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:5,camera:`front`,azimuth:24,elevation:6,beat:.75,props:Y_,standard:`Arms straight, hips held high with the feet up at the bar; legs straight and together; they turn from the waist well past 45° to each side and are stopped there, not dropped; the hips do not sink and the shoulders stay square.`,effort:e=>.62+.33*Math.abs(Math.sin(e*Math.PI*2)),pose(e,t,n){let r=t.body,i=yv*Math.sin(Math.PI/2*Math.sin(e*Math.PI*2));Cv(t,n,Sv(t,n),i);let a=Af(r),o=tv(t,`upperLeg`),s=new I().setFromAxisAngle(X_,i*J_),c=new L(0,a.height-o.y,bv*r.scale-o.z).normalize(),l=Math.atan2(c.z,-c.y)/J_,u=c.applyQuaternion(s);for(let[e]of K){let i=n.leg[e];i.foot.copy(t.pos[`upperLeg${e}`]).addScaledVector(u,(r.upperLeg+r.lowerLeg)*.999),i.knee.copy(Q_(l)).applyQuaternion(s),i.rot.copy(s).multiply(W(-l+48)),i.toes=-18}}},dv,ov,sv],Tv=new Map;function Ev(e,t,n){let r=`${t}:${e.body.id}`;return Tv.has(r)||Tv.set(r,n()),Tv.get(r)}var Dv=new Map,Ov=e=>Dv.get(e.id)??Dv.set(e.id,new Zd(e.id)).get(e.id),kv=e=>e.upperArm+e.lowerArm,Av=.999,jv=e=>e.pos.upperArmL.clone().add(e.pos.upperArmR).multiplyScalar(.5),Mv=e=>e.pos.upperLegL.clone().add(e.pos.upperLegR).multiplyScalar(.5),Nv=e=>Math.sin(e*Math.PI*2),Pv=e=>Q(e,.42,.06),Fv=e=>J(Math.cos(e*q),Math.sin(e*q));function Iv(e){let t=new L,n=0,r=(e,r,i,a)=>{t.addScaledVector(e.clone().lerp(r,i),a),n+=a},i=t=>e(`${t}L`).clone().add(e(`${t}R`)).multiplyScalar(.5);r(i(`upperArm`),i(`upperLeg`),.47,.46),r(e(`neck`),e(`head`),1.5,.07);for(let[t]of K){let n=n=>e(`${n}${t}`);r(n(`upperArm`),n(`lowerArm`),.45,.031),r(n(`lowerArm`),n(`hand`),.65,.024),r(n(`upperLeg`),n(`lowerLeg`),.42,.125),r(n(`lowerLeg`),n(`foot`),.62,.052)}return t.multiplyScalar(1/n)}function Lv(e,t,n,r,i={}){let a=e.body,o=.014,s=a.ball.length(),c=i.wide??0,l=i.tuck??3,u=i.round??l*.6,d=Math.sqrt(((a.upperLeg+a.lowerLeg)*.998)**2-c**2),f=new L,p=n,m=0,h=d+a.trunk;for(let g=0;g<6;g++){let _=.2;for(let e=0;e<12;e++)_=Math.asin(Math.max(-.5,Math.min(.95,(p-o-s*Math.cos(_))/h)));let v=J(Math.cos(_),Math.sin(_)),y=J(-s*Math.sin(_),o+s*Math.cos(_)),b=90-_/q;t.pelvis.copy(W(b-l+m)),t.chest.copy(W(b+u+m));let x=y.clone().addScaledVector(v,d);yf(a,t.pelvis,x,t.hips);for(let[e,n]of K){let r=n*(a.rest.upperLegL.x+c);bf(a,y.clone().setX(r),J(0,o,r),t.leg[e]),t.leg[e].knee.set(0,-1,.2)}r(g?f:y.clone().addScaledVector(v,h)),e.solve(t);let S=jv(e);i.by?f.copy(e.pos[`upperArm${i.by}`]):f.copy(S);let C=S.sub(x);m+=(Math.atan2(C.y,C.z)-_)/q,h=d+C.length(),p+=n-f.y}return f}function Rv(e,t,n=14){let r=jv(e).y-Mv(e).y,i=Math.asin(Math.max(-1,Math.min(1,r/e.body.trunk)))/q;t.head.copy(W(90-i-n))}function zv(e,t,n,r,i,a=0,o=0){let s=e.body,c=t.leg[n],l=e.pos[`upperLeg${n}`],u=l.clone().addScaledVector(Fv(r).setX(n===`L`?-o:o).normalize(),s.upperLeg);c.foot.copy(u).addScaledVector(Fv(i),s.lowerLeg*.999),c.rot.copy(W(-90-i+a)),c.knee.copy(u).sub(l.clone().add(c.foot).multiplyScalar(.5)),c.toes=-12}var Bv=e=>e.rest.upperArmL.x+.035*e.scale,Vv=new L(.18,.45,-1),Hv={top:{blade:.55,round:6},low:{blade:-.85,round:-3},tuck:3,look:9};function Uv(e,t,n,r,i=.3){let a=e.body,o=.014,s=a.ball.length(),c=(a.upperLeg+a.lowerLeg)*.998,l=kv(a)*Av,u=$(Hv.top.blade,Hv.low.blade,r),d=$(Hv.top.round,Hv.low.round,r),f=i;for(let r=0;r<9;r++){let i=J(Math.cos(f),Math.sin(f)),p=J(-s*Math.sin(f),o+s*Math.cos(f)),m=90-f/q;t.pelvis.copy(W(m-Hv.tuck)),t.chest.copy(W(m+d)),t.head.copy(W(m-Hv.look)),yf(a,t.pelvis,p.clone().addScaledVector(i,c),t.hips);for(let[e,n]of K){let r=n*a.rest.upperLegL.x;bf(a,p.clone().setX(r),J(0,o,r),t.leg[e]),t.leg[e].knee.set(0,-1,.2),t.arm[e].protract=u}if(Ef(a,t,n,Bv(a),Vv,6),e.solve(t),r===8)break;f+=(l-e.pos.upperArmL.distanceTo(t.arm.L.hand))/((c+a.trunk)*Math.cos(f))}return f}function Wv(e){return Ev(e,`scap-pushup`,()=>{let t=tf(),n=1.15*e.body.scale,r=.3;for(let i=0;i<4;i++)r=Uv(e,t,n,0,r),n=jv(e).z;return{hands:n,top:r}})}var Gv={id:`scap-pushup`,revision:2,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:3.4,camera:`side`,azimuth:62,elevation:8,beat:.97,shift:e=>{let t=Pv(e);return{serratus:1-.4*t,traps:.6+.4*t}},standard:`A plank on locked arms: the elbows stay straight throughout and the body one line. The shoulder blades come together and the chest sinks clearly between the arms, a hand's width; then the floor is pushed away until the upper back is broad and round. The shoulders stay over the hands; hips and head go with the chest, they do not sag or nod.`,effort:e=>.4+.5*(1-Pv(e)),pose(e,t,n){let r=Wv(t);Uv(t,n,r.hands,Pv(e),r.top)}},Kv={top:13,low:-12};function qv(e,t,n,r,i){let a=e.body,o=kv(a)*Av,s=r;for(let r=0;r<4;r++)Lv(e,t,s,()=>Ef(a,t,n,Bv(a),Vv,6),{tuck:4,round:i}),s+=o-e.pos.upperArmL.distanceTo(t.arm.L.hand);return Lv(e,t,s,()=>Ef(a,t,n,Bv(a),Vv,6),{tuck:4,round:i}),s}function Jv(e){return Ev(e,`scap-pushup-1`,()=>{let t=e.body,n=tf(),r=X(t)+kv(t)*Av,i=Lv(e,n,r,e=>Ef(t,n,e.z,Bv(t),Vv,6),{tuck:4,round:Kv.top}).z;for(let a=0;a<3;a++)r=qv(e,n,i,r,Kv.top),i=jv(e).z-.004*t.scale;return{hands:i,top:qv(e,n,i,r,Kv.top)}})}var Yv={id:`scap-pushup`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`reps`,period:2.8,camera:`side`,azimuth:68,elevation:7,beat:.97,shift:e=>{let t=Pv(e);return{serratus:1-.4*t,traps:.6+.4*t}},standard:`A plank on locked arms: the elbows stay straight throughout. The chest sinks between the shoulder blades and is pushed back up until the upper back is round; the hips stay level and the head does not nod.`,effort:e=>.4+.5*(1-Pv(e)),pose(e,t,n){let r=Pv(e),i=Jv(t);qv(t,n,i.hands,i.top,$(Kv.top,Kv.low,r)),Rv(t,n,12-10*r)}},Xv=1.6,Zv=e=>e.rest.upperArmL.x*Xv-e.rest.upperLegL.x;function Qv(e,t,n){let r=e.scale,i=t.arm.L;i.hand.copy(n),i.rot.copy(G(`L`,new L(-.1,0,1).normalize(),new L(0,-1,0))),i.elbow.set(.2,.25,-1),i.grip=.04,i.shrug=0;let a=t.arm.R,o=(e,n,i)=>new L(e*r,n*r,i*r).applyQuaternion(t.pelvis);a.hand.copy(t.hips).add(o(-.075,.1,-.112)),a.rot.copy(G(`R`,o(1,.25,0).normalize(),o(0,0,-1).normalize())),a.elbow.copy(o(-1,-.2,-.5)),a.grip=.15,a.shrug=0}var $v=(e,t,n,r)=>Lv(e,t,n,()=>Qv(e.body,t,r),{wide:Zv(e.body),tuck:3,by:`L`});function ey(e,t){return Ev(e,t.key,()=>{let n=e.body,r=n.scale,i=tf(),a=t.surface(n),o=kv(n)*.998,s=t.reach*q,c=new L(n.rest.upperArmL.x-.045*r,a+X(n),0),l=c.y+o*Math.cos(s);for(let t=0;t<4;t++){let t=$v(e,i,l,c);c.x=t.x-.045*r;let n=Math.sqrt(o*o-(t.x-c.x)**2);l=c.y+n*Math.cos(s),c.z=t.z+n*Math.sin(s)}for(let t=0;t<4;t++){let t=$v(e,i,l,c);l+=(o-t.distanceTo(c))*.9/Math.max(.35,Math.cos(s))}return{hand:c,top:l,low:c.y+t.depth*r,h:a}})}var ty=(e,t)=>({id:e.key,revision:1,planted:[`handL`,`toesL`,`toesR`],kind:`reps`,camera:`three-quarter`,beat:.97,detail:{delt_lat:.14,delt_ant:.55,"pec.R":.08,"pec_upper.R":.08,"triceps.R":0,"delt_ant.R":0,"delt_lat.R":0},effort:e=>.4+.6*Pv(e),pose(t,n,r){let i=Pv(t),a=ey(n,e);$v(n,r,$(a.top,a.low,i),a.hand),Rv(n,r,14-6*i)},...t}),ny={key:`assisted-oa-pushup`,surface:e=>e.rest.lowerLegL.y*.95,reach:12,depth:.185},ry={key:`one-arm-pushup`,surface:()=>0,reach:-8,depth:.176},iy=ty(ny,{stage:`low`,period:3.2,azimuth:52,elevation:10,props:e=>{let{hand:t,h:n}=ey(Ov(e),ny);return[{kind:`box`,width:1.1*e.scale,height:n,depth:.46,z:t.z-.04*e.scale+.23}]},standard:`One hand on a surface at knee height, under its shoulder, the other off it; feet wider than the shoulders; shoulders and hips stay level and square, the body straight; the elbow stays close to the ribs; chest to the edge; the arm fully straight at the top.`}),ay=ty(ry,{stage:`low`,period:3.4,azimuth:52,elevation:12,standard:`One hand on the floor under its shoulder, the other on the back; feet wider than the shoulders and no wider than double; shoulders and hips stay level and square to the floor, the body straight; the elbow stays near the ribs; chest to within a fist of the floor; the arm fully straight at the top.`}),oy=72,sy=30;function cy(e,t,n,r,i){let a=e.body,o=kv(a)*Av,s=()=>{Ef(a,t,n,Bv(a),Vv,oy);for(let[e]of K)t.arm[e].shrug=-.3,t.arm[e].grip=.1},c=r;for(let n=0;n<4;n++)Lv(e,t,c,s,{tuck:6,round:i}),c+=(o-e.pos.upperArmL.distanceTo(t.arm.L.hand))/Math.cos(sy*q);return Lv(e,t,c,s,{tuck:6,round:i}),c}function ly(e){return Ev(e,`planche-lean`,()=>{let t=e.body,n=tf(),r=kv(t)*Av,i=0,a=X(t)+r*Math.cos(sy*q);for(let o=0;o<4;o++){a=cy(e,n,i,a,9);let o=e.pos.upperArmL,s=Math.sqrt(r*r-(n.arm.L.hand.x-o.x)**2);i=jv(e).z-s*Math.sin(sy*q),a=X(t)+s*Math.cos(sy*q)}return{hands:i,y:a}})}var uy={id:`planche-lean`,revision:1,stage:`low`,planted:[`handL`,`handR`,`toesL`,`toesR`],kind:`hold`,period:4.6,camera:`side`,azimuth:68,elevation:7,detail:{delt_lat:.3},standard:`Arms locked, elbow pits forward; the shoulders held clearly in front of the fingertips; shoulder blades pushed apart, the upper back round; the body one straight line on the toes, hips neither piked nor sagging.`,effort:()=>.75,pose(e,t,n){let r=ly(t);cy(t,n,r.hands,r.y,9+.8*Nv(e)),Rv(t,n,10)}},dy=(e,t)=>{let n=new L(0,1,0).applyQuaternion(e.rot[t]);return Math.atan2(n.z,n.y)/q},fy=e=>({height:.2*e.scale,gap:2*(e.rest.upperArmL.x+.04*e.scale),length:.42*e.scale,radius:.016*e.scale,z:.02*e.scale}),py=.5;function my(e,t,n,r,i,a){let o=e.body,s=o.scale,c=0;if(n.on===`floor`)Ef(o,t,0,o.rest.upperArmL.x+.03*s,Vv,oy),c=.035*s;else{let e=fy(o),n=W(r*py);for(let[r,i]of K){let a=t.arm[r];Df(o,a,r,new L(i*e.gap/2,e.height,0),e.radius,new L(i*.3,-.954,0).applyQuaternion(n),new L(-i*.954,-.3,0).applyQuaternion(n),1),a.elbow.set(i*Vv.x,Vv.y,Vv.z)}}for(let[e]of K)t.arm[e].shrug=-.4,n.on===`floor`&&(t.arm[e].grip=.14);t.chest.copy(W(n.chest+i)),t.pelvis.copy(W(n.pelvis+i)),t.head.copy(W(n.chest+i-n.look));let l=t.arm.L.hand,u=kv(o)*Av,d=e=>{let t=Math.sqrt(Math.max(1e-6,u*u-e*e));return J(l.z+t*Math.sin(r*q),l.y+t*Math.cos(r*q))},f=d(l.x-o.rest.upperArmL.x);return t.hips.set(0,f.y,f.z-o.trunk),Y(e,t,f),Y(e,t,d(l.x-e.pos.upperArmL.x)),n.legs(e,t,a),e.solve(t),c}function hy(e,t){return Ev(e,t.key,()=>{let n=e.body,r=tf(),i=30,a=0;for(let o=0;o<30;o++){let o=my(e,r,t,i,a,.5),s=jv(e),c=Mv(e);a-=Math.asin(Math.max(-1,Math.min(1,(c.y-s.y)/s.distanceTo(c))))/q*.9;let l=Iv(t=>e.pos[t]).z-o;i-=l/(kv(n)*Math.cos(i*q))/q*.8,i=Math.max(5,Math.min(70,i))}return{lean:i,tilt:a}})}var gy=(e,t)=>({id:e.key,revision:1,stage:`low`,planted:[`handL`,`handR`],kind:`hold`,period:4.6,camera:`side`,...e.on===`parallettes`?{props:e=>[{kind:`rails`,...fy(e)}]}:{},pose(t,n,r){let i=hy(n,e);my(n,r,e,i.lean+.35*Nv(t),i.tilt,t)},...t}),_y={delt_lat:.3,pec:.4},vy={key:`tuck-planche`,on:`parallettes`,chest:114,pelvis:62,look:26,legs(e,t,n){for(let[r]of K)zv(e,t,r,-33+.6*Nv(n),-172,38,.085)}},yy={key:`adv-tuck-planche`,on:`parallettes`,chest:93,pelvis:87,look:20,legs(e,t,n){for(let[r]of K)zv(e,t,r,-86+.5*Nv(n),162,30)}},by=e=>(t,n)=>Tf(t,n,dy(t,`hips`)-90,50,e),xy={key:`straddle-planche`,on:`floor`,chest:95,pelvis:86,look:22,legs:by(40)},Sy={key:`full-planche`,on:`floor`,chest:95,pelvis:86,look:22,legs:by(0)},Cy=gy(vy,{stage:`square`,azimuth:64,elevation:6,detail:_y,effort:e=>.85+.05*Math.abs(Nv(e)),standard:`Arms locked; feet off the floor; knees tucked to the chest and clear of the arms; the hips at the height of the shoulders; the upper back round; the shoulders in front of the hands so the weight is over them.`}),wy=gy(yy,{stage:`square`,azimuth:64,elevation:6,detail:_y,effort:e=>.9+.05*Math.abs(Nv(e)),standard:`Arms locked; the back flat and level, hips at the height of the shoulders; the hips opened to a right angle so the thighs are upright; knees and feet off the floor; the shoulders further in front of the hands than in the tuck.`}),Ty=gy(xy,{camera:`three-quarter`,azimuth:42,elevation:22,detail:_y,effort:e=>.95+.05*Math.abs(Nv(e)),standard:`Arms locked; shoulders, hips and feet at one height, the body level; hips fully open, not piked and not arched; legs straight and spread wide, toes pointed; nothing touches the floor but the hands.`}),Ey=gy(Sy,{azimuth:66,elevation:6,detail:_y,effort:()=>1,standard:`Arms locked; one straight level line from shoulders through hips to toes, the hips neither above the shoulders nor sagging; legs straight and together, toes pointed; nothing touches the floor but the hands.`}),Dy=.014,Oy=e=>.104*e.scale,ky=e=>1.36*e.scale,Ay=e=>e.rest.upperArmL.x+.075*e.scale,jy=e=>({kind:`rings`,height:ky(e)+Oy(e),top:2.9*e.scale,gap:Ay(e)*2,radius:Oy(e),z:0}),My={out:.45,down:-.893};function Ny(e,t,n){let r=e.body,i=r.scale;for(let[e,i]of K){let a=t.arm[e];Df(r,a,e,new L(i*Ay(r),ky(r),0),Dy,new L(i*My.out,My.down,0),new L(i*My.down,-My.out,0),1),a.elbow.set(i*.12,.1,-1),a.shrug=$(-1,-.4,n)}let a=t.arm.L.hand;t.chest.copy(W($(5,26,n))),t.pelvis.copy(W($(3,19,n))),t.head.copy(W($(4,14,n)));let o=.025*i,s=new L(0,a.y+.2*i,.17*i),c=e=>new L(0,a.y+Math.sqrt(Math.max(0,(kv(r)*Av)**2-e**2-o**2)),o),l=e=>e.lerp(s,n),u=l(c(a.x-r.rest.upperArmL.x));t.hips.set(0,u.y-r.trunk,u.z),Y(e,t,u),Y(e,t,l(c(Math.abs(a.x-e.pos.upperArmL.x))))}var Py=[Gv,iy,ay,uy,Cy,wy,Ty,Ey,{id:`ring-dip`,revision:1,kind:`reps`,period:3.4,camera:`three-quarter`,azimuth:58,elevation:3,stage:`tall`,props:e=>[jy(e)],planted:[`handL`,`handR`],beat:.97,detail:{delt_lat:.15,delt_ant:.6,pec_upper:.55},standard:`Starts and ends in support with the arms locked and the shoulders pressed down; the shoulders pass below the elbows at the bottom; the elbows track back and the rings stay close to the body, not flaring wide; the wrists straight over the rings; the legs do not swing.`,effort:e=>.35+.65*Pv(e),pose(e,t,n){let r=Pv(e);Ny(t,n,r),Tf(t,n,$(3,19,r)+$(8,13,r),46)}}],Fy=(e,t,n)=>Z(Math.min(1,Math.max(0,(e-t)/(n-t)))),Iy=(e,t,n)=>e<=t||e>=n?0:Math.sin(Math.PI*(e-t)/(n-t))**2,Ly=e=>Math.sin(e*Math.PI*2),Ry=e=>1.1*Math.sin(e*Math.PI*2)+.45*Math.sin(e*Math.PI*6+1),zy=(e,t)=>e.clone().add(t).multiplyScalar(.5),By=new Map,Vy=new Map;function Hy(e,t,n){let r=`${t}:${e.id}`;if(!By.has(r)){let t=Vy.get(e.id)??Vy.set(e.id,new Zd(e.id)).get(e.id);By.set(r,n(t,tf()))}return By.get(r)}function Uy(e,t,n,r=8){let i=e(t),a=e(n);for(let o=0;o<r&&Math.abs(a)>2e-5&&a!==i;o++){let r=n-a*(n-t)/(a-i);t=n,i=a,n=r,a=e(n)}return n}var Wy=e=>e.pos.head.clone().add(new L(0,e.body.height-e.body.rest.head.y,0).applyQuaternion(e.rot.head));function Gy(e){let t=e.pos,n=new L,r=(e,t,r,i)=>n.addScaledVector(t.clone().lerp(r,i),e);r(.0694,t.neck,Wy(e),.5),r(.1596,t.neck,t.chest,.55),r(.1633,t.chest,t.spine,.5),r(.1117,t.spine,zy(t.upperLegL,t.upperLegR),.6);for(let[e]of K)r(.0271,t[`upperArm${e}`],t[`lowerArm${e}`],.45),r(.0162,t[`lowerArm${e}`],t[`hand${e}`],.43),r(.0061,t[`hand${e}`],t[`fingers1${e}`],.7),r(.1416,t[`upperLeg${e}`],t[`lowerLeg${e}`],.41),r(.0433,t[`lowerLeg${e}`],t[`foot${e}`],.44),r(.0137,t[`foot${e}`],t[`toes${e}`],.5);return n}var Ky=46;function qy(e,t,n){let r=e.body,i=r.upperArm+r.lowerArm;Ef(r,t,0,r.rest.upperArmL.x*1.02,new L(1,0,.6),4);for(let[e]of K)t.arm[e].shrug=1,t.arm[e].grip=n.grip??.12;t.chest.copy(W(180+n.chest)),t.pelvis.copy(W(180+n.chest-(n.round??-1.5))),t.head.copy(W(180-(n.look??Ky)));let a=n.lean*q,o=J(Math.sin(a)*i,X(r)+Math.cos(a)*i*.9975);t.hips.set(0,o.y+r.trunk,o.z),Y(e,t,o)}var Jy=e=>new L(0,-Math.cos(e*q),-Math.sin(e*q));function Yy(e,t,n,r,i=50){let a=e.body;for(let[o,s]of K){let c=e.pos[`upperLeg${o}`],l=c.clone().addScaledVector(Jy(n),a.upperLeg),u=t.leg[o];u.foot.copy(l).addScaledVector(Jy(n+r),a.lowerLeg),u.foot.x=c.x-s*.02*a.scale,u.knee.copy(l).sub(zy(c,u.foot)),u.rot.copy(W(n+r+i)),u.toes=-18}}var Xy=e=>Hy(e,`stacked`,(e,t)=>(Wp(e,t,{tilt:0,head:Ky,point:52}),e.solve(t),Gy(e).z)),Zy={forward:14,back:8,aside:.1},Qy={id:`wrist-prep`,revision:1,stage:`low`,planted:[`handL`,`handR`,`lowerLegL`,`lowerLegR`,`footL`,`footR`],kind:`mobility`,period:9.6,camera:`side`,azimuth:58,elevation:9,beat:.14,standard:`On hands and knees, hands flat under the shoulders with the fingers forward; arms straight throughout; the shoulders rock slowly forward until they are over the fingers, back behind the wrists, then to each side; the hands do not move and the heel of the hand stays on the floor.`,effort:e=>.25+.5*Iy(e,0,.28)+.25*Iy(e,.28,.5)+.35*(Iy(e,.5,.75)+Iy(e,.75,1)),pose(e,t,n){let r=t.body,i=r.scale,a=Zy.forward*Iy(e,0,.28)-Zy.back*Iy(e,.28,.5),o=Zy.aside*i*(Iy(e,.5,.75)-Iy(e,.75,1)),s=(r.upperArm+r.lowerArm)*.998,c=r.upperLeg,l=J(0,.052*i),u=.046*i,d=X(r)+s-(l.y+c),f=Math.sqrt(r.trunk**2-d**2);Ef(r,n,f,r.rest.upperArmL.x,new L(.5,0,-1),4);for(let[e]of K)n.arm[e].shrug=.25,n.arm[e].grip=.02;let p=a*q,m=new L(o,X(r)+Math.sqrt(Math.max(0,(s*Math.cos(p))**2-o**2)),f+s*Math.sin(p)),h=e=>new L(o,l.y+Math.sqrt(c**2-e**2-o**2),e),g=h(Uy(e=>h(e).distanceTo(m)-r.trunk,0,.02*i,6)),_=90-Math.asin((m.y-g.y)/r.trunk)/q;Uy(e=>{n.pelvis.copy(W(_+e-2)),n.chest.copy(W(_+e+2)),n.head.copy(W(_+e-5));let i=new L(0,r.rest.upperLegL.y-r.rest.hips.y,r.rest.upperLegL.z-r.rest.hips.z).applyQuaternion(n.pelvis);return n.hips.copy(g).sub(i),t.solve(n),t.pos.upperArmL.distanceTo(n.arm.L.hand)-s},0,3,6);for(let[e,i]of K){let a=n.leg[e],o=i*r.rest.upperLegL.x;a.foot.set(o,u,-Math.sqrt(r.lowerLeg**2-(l.y-u)**2)),a.rot.copy(W(176)),a.knee.set(o,l.y,0).sub(zy(t.pos[`upperLeg${e}`],a.foot)),a.toes=0}}},$y=e=>Fy(e,.08,.34)*(1-Fy(e,.72,.95)),eb={id:`heel-pulls`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:6.6,beat:.34,camera:`side`,azimuth:112,elevation:2,props:e=>[{kind:`wall`,z:Jp(e).back}],detail:{delt_post:.3},standard:`Back to the wall, only the heels on it; the fingers press and the body comes off the wall as one straight line, arms locked, until wrists, shoulders, hips and ankles are stacked; no push from the feet and no bend at the hips; it returns to the wall softly.`,effort:e=>.5+.45*$y(e),shift:e=>({forearm_flex:.55+.45*$y(e),forearm_ext:.55+.45*$y(e)}),pose(e,t,n){let r=$y(e),i=r*(.8*Math.sin(e*Math.PI*6)+.3*Math.sin(e*Math.PI*14+1));Wp(t,n,{tilt:Kp.tilt*(1-r),drift:i,head:Ky,point:Kp.point+12*r});let a=Math.max(Iy(e,.04,.3),.5*r);for(let[e]of K)n.arm[e].grip=.1+.16*a}},tb=e=>Hy(e,`headstand`,(t,n)=>{let r=e.scale,i=J(.27*r,.33*r);for(let e=0;e<8;e++)nb(t,n,i,0,0),t.solve(n),i.y+=.012*r-Wy(t).y,i.z-=(t.pos.lowerArmL.z+t.pos.lowerArmR.z)/2;return i});function nb(e,t,n,r,i){let a=e.body;Ef(a,t,0,a.rest.upperArmL.x+.015*a.scale,new L(.12,0,-1),2);for(let[e]of K)t.arm[e].shrug=.5+.2*i,t.arm[e].grip=.08+.05*i;t.head.copy(W(180)),t.chest.copy(W(177)),t.pelvis.copy(W(178.5-r)),t.hips.set(0,n.y+a.trunk,n.z),Y(e,t,n),Tf(e,t,-r*.6,50)}var rb={id:`headstand`,revision:1,stage:`tall`,planted:[`handL`,`handR`,`head`],kind:`balance`,period:5,camera:`side`,azimuth:62,elevation:4,detail:{delt_post:.25},standard:`The crown of the head and both hands form an even triangle, the head ahead of the hands; elbows at a right angle over the wrists, not flared; hips over the shoulders and the legs straight and vertical, toes pointed; the weight sits between head and hands, not on the neck alone.`,effort:e=>.5+.12*Math.abs(Ly(e)),pose(e,t,n){nb(t,n,tb(t.body),.8*Math.sin(e*Math.PI*2)+.3*Math.sin(e*Math.PI*6+1),.5+.5*Ly(e))}},ib={chest:3,round:24,thigh:30,knee:146};function ab(e,t,n,r){qy(e,t,{lean:n,chest:ib.chest+r*.5,round:ib.round,look:52}),Yy(e,t,ib.thigh-r*.6,ib.knee)}var ob=e=>Hy(e,`tuck-hs`,(t,n)=>Uy(r=>(ab(t,n,r,0),t.solve(n),Gy(t).z-Xy(e)),4,8)),sb={id:`tuck-hs`,revision:1,stage:`square`,planted:[`handL`,`handR`],kind:`balance`,period:5.2,camera:`side`,azimuth:68,elevation:3,detail:{delt_post:.3,forearm_flex:.6,forearm_ext:.5},standard:`Arms locked and shoulders pushed tall; knees drawn to the chest, thighs below horizontal, lower back slightly rounded; the shoulders lean in front of the wrists just far enough that the weight stays over the hands; hands still, eyes on the floor between them.`,effort:e=>.65+.2*Math.abs(Ly(e)),pose(e,t,n){let r=Ry(e);ab(t,n,ob(t.body)+r*.5,r);for(let[t]of K)n.arm[t].grip=.14-.05*Ly(e)}},cb={spread:58,flex:4},lb={id:`straddle-hs`,revision:1,stage:`square`,planted:[`handL`,`handR`],kind:`balance`,period:5.2,camera:`front`,azimuth:150,elevation:2,detail:{delt_post:.3,forearm_flex:.6,forearm_ext:.5},standard:`Arms locked, shoulders pushed tall; wrists, shoulders and hips on one vertical line, the hips not piking forward; legs straight and opened evenly, each more than 45° from vertical, toes pointed out to the sides; hands still.`,effort:e=>.55+.2*Math.abs(Ly(e)),pose(e,t,n){Wp(t,n,{tilt:0,drift:Ry(e),head:Ky,point:50,spread:cb.spread,flex:cb.flex});for(let[t]of K)n.arm[t].grip=.12-.05*Ly(e)}},ub={stance:28,slant:22,round:20,lean:2,tiptoe:72,compress:62,wide:64,floor:8,air:28,palm:0},db=(e,t)=>Xy(e)+ub.palm*e.scale*(1-Fy(t,.7,1));function fb(e,t,n,r){qy(e,t,{lean:n.lean,chest:n.chest,round:n.round,look:$(8,Ky,r)-n.chest*.82})}function pb(e,t,n,r){let i=Math.atan2(e.ball.y,e.ball.z)-n*q,a=e.ball.length();bf(e,new L(t.x,t.y-a*Math.sin(i),t.z-a*Math.cos(i)),t,r),r.knee.set(0,0,1)}var mb=e=>Hy(e,`press-hs`,(t,n)=>{let r=(e.upperLeg+e.lowerLeg)*.999,i=()=>(t.solve(n),t.pos.upperLegL.clone()),a={lean:ub.lean,chest:-60,round:ub.round,flex:0,spread:0},o=new L(Math.sin(ub.stance*q),-Math.cos(ub.stance*q)*Math.cos(ub.slant*q),Math.cos(ub.stance*q)*Math.sin(ub.slant*q)),s=e.ankle-r*o.y;a.chest=Uy(e=>(a.chest=e,fb(t,n,a,0),i().y-s),-62,-55);let c=i().clone().addScaledVector(o,r).add(e.ball),l=t=>{let n=Math.atan2(e.ball.y,e.ball.z)-t*q;return new L(c.x,c.y-e.ball.length()*Math.sin(n),c.z-e.ball.length()*Math.cos(n))},u=(e,o)=>{let s={lean:$(ub.lean,o,e),chest:a.chest,round:$(ub.round,ub.compress,e),flex:0,spread:0},c=l(ub.tiptoe*Z(e));s.chest=Uy(e=>(s.chest=e,fb(t,n,s,0),i().distanceTo(c)-r),a.chest,a.chest+4);let u=c.sub(i()).normalize().applyQuaternion(n.pelvis.clone().invert());return s.spread=Math.asin(Math.min(1,u.x))/q,s.flex=Math.atan2(u.z,-u.y)/q,s},d=()=>(t.solve(n),Gy(t).z),f=e=>{t.solve(n),Tf(t,n,e.flex,50,e.spread)},p=Uy(r=>{let i=u(1,r);return fb(t,n,i,0),f(i),d()-db(e,0)},14,18),m=Array.from({length:ub.floor+1},(e,t)=>u(t/ub.floor,p)),h=m[ub.floor],g=e=>({lean:0,chest:$(h.chest,0,Fy(e,0,.6)),round:$(h.round,-1.5,Fy(e,.3,.95)),flex:$(h.flex,0,Fy(e,.08,.92)),spread:$($(h.spread,ub.wide,Fy(e,0,.45)),0,Fy(e,.55,1))}),_=p;return{ball:c,floor:m,air:Array.from({length:ub.air+1},(r,i)=>{let a=i/ub.air,o=g(a);return o.lean=i===ub.air?0:Uy(r=>(o.lean=r,fb(t,n,o,a),f(o),d()-db(e,a)),_,_-1),_=o.lean,o})}}),hb=(e,t)=>{let n=Math.min(e.length-1-1e-9,Math.max(0,t*(e.length-1))),r=Math.floor(n),i=n-r,a=e[r],o=e[r+1];return{lean:$(a.lean,o.lean,i),chest:$(a.chest,o.chest,i),round:$(a.round,o.round,i),flex:$(a.flex,o.flex,i),spread:$(a.spread,o.spread,i)}},gb=.25,_b=e=>Fy(e,.04,.47)*(1-Fy(e,.57,.97)),vb={id:`press-hs`,revision:1,stage:`square`,planted:[`handL`,`handR`],kind:`reps`,period:9.4,beat:.48,camera:`three-quarter`,azimuth:56,elevation:5,detail:{delt_post:.25},standard:`Arms locked from start to finish; the shoulders lean forward over the fingers until the weight is on the hands, so the feet leave the floor without a jump; the hips rise over the shoulders before the legs come up; legs straight, opening round the sides and closing in a stacked handstand; lowered the same way, under control.`,effort:e=>{let t=_b(e);return t<.3?.3+.7*Fy(t,0,.3):1-.42*Fy(t,.45,1)},shift:e=>{let t=_b(e);return{hip_flexors:1-.8*Fy(t,.6,1),abs:1-.5*Fy(t,.7,1),adductors:.4+.6*Iy(t,.2,1)}},pose(e,t,n){let r=t.body,i=mb(r),a=_b(e),o=Math.min(1,a/gb),s=Math.max(0,(a-gb)/.75),c=s>0?hb(i.air,s):hb(i.floor,o),l=Fy(a,.97,1)*.7*Math.sin(e*Math.PI*2*9);c.lean+=l*.5,fb(t,n,c,s);for(let[e]of K)n.arm[e].grip=.12+.1*Math.sin(Math.PI*Math.min(1,a/.9));if(t.solve(n),Tf(t,n,c.flex-l*.6,50,c.spread),s<.25){let e=Fy(s,0,.25);for(let[t,a]of K){let c=n.leg[t],l={foot:c.foot.clone(),rot:c.rot.clone(),knee:c.knee.clone()};pb(r,i.ball.clone().setX(a*i.ball.x),ub.tiptoe*Z(o),c),s>0&&(c.foot.copy(l.foot),c.knee.lerp(l.knee,e)),c.rot.slerp(l.rot,e),c.toes=$(c.toes,-18,e)}}}},yb=new L(0,0,1),bb=e=>new I().setFromAxisAngle(yb,-e*q),xb={spread:50,flex:3,level:.85,drop:5,front:6};function Sb(e,t,n,r,i){let a=e.body,o=a.upperArm+a.lowerArm;Ef(a,t,0,a.rest.upperArmL.x*1.02,new L(1,0,.6),4),t.arm.L.shrug=1,t.arm.L.grip=.2,t.chest.copy(W(180+r*.6)).premultiply(bb(n+i)),t.pelvis.copy(W(181.5-r*.9)).premultiply(bb((n+i)*xb.level)),t.head.copy(W(134)).premultiply(bb(n*.35));let s=r*q,c=i*.6*q,l=t.arm.L.hand.clone().add(new L(Math.sin(c),Math.cos(s)*Math.cos(c),Math.sin(s)).multiplyScalar(o*.9985));t.hips.copy(l).add(new L(-a.rest.upperArmL.x*.6,a.trunk,0));let u=t.arm.R;for(let n=0;n<5;n++){e.solve(t),t.hips.add(l.clone().sub(e.pos.upperArmL));let n=xb.drop*q,r=xb.front*q,a=new L(-Math.cos(n)*Math.cos(r),-Math.sin(n),-Math.sin(r)).applyQuaternion(bb(i*2));u.hand.copy(e.pos.upperArmR).addScaledVector(a,o*.992),u.rot.copy(G(`R`,a,new L(0,-1,0))),u.elbow.set(0,.4,1),u.grip=.14,u.shrug=.2}e.solve(t),Tf(e,t,xb.flex-r*.7,50,xb.spread)}var Cb=e=>Hy(e,`one-arm-hs`,(e,t)=>Uy(n=>(Sb(e,t,n,0,0),e.solve(t),Gy(e).x-t.arm.L.hand.x),16,20)),wb={id:`one-arm-hs`,revision:1,stage:`square`,planted:[`handL`],kind:`balance`,period:5.6,camera:`front`,azimuth:160,elevation:2,detail:{"delt_post.L":.3,"delt_ant.R":.25,"delt_lat.R":.45,"traps.R":.4,"forearm_flex.L":.85,"forearm_ext.L":.7,"forearm_flex.R":.1,"forearm_ext.R":.15},standard:`The supporting arm locked and upright, its shoulder pushed tall and over its hand; the body tipped over that arm until the hips and the weight are over the one hand; hips square, not twisted open; legs straight and straddled; the free hand fully off the floor, arm out to the side; the supporting hand does not move.`,effort:e=>.8+.15*Math.abs(Ly(e)),pose(e,t,n){let r=.8*Math.sin(e*Math.PI*2)+.3*Math.sin(e*Math.PI*6+1),i=.5*Math.sin(e*Math.PI*4+.6)+.2*Math.sin(e*Math.PI*10);Sb(t,n,Cb(t.body),r,i),n.arm.L.grip=.2-.06*Ly(e)}},Tb={ahead:.3,height:.014,palm:.07};function Eb(e,t,n,r,i){let a=e.body;t.chest.copy(W(180-r)),t.pelvis.copy(W(180-r+1.5)),t.head.copy(W(180-r*$(.5,.15,i)-$(Ky,0,i))),Ef(a,t,0,a.rest.upperArmL.x+.035*a.scale,new L(.4,.25,-1),4);for(let[e]of K)t.arm[e].shrug=$(1,.25,i),t.arm[e].grip=.12+.1*i;t.hips.set(0,n.y+a.trunk,n.z),Y(e,t,n),Tf(e,t,0,50)}var Db=e=>Hy(e,`freestanding-hspu`,(t,n)=>{let r=e.scale,i=(e.upperArm+e.lowerArm)*.9985,a=J(0,X(e)+i);for(let e=0;e<4;e++)Eb(t,n,a,0,0),t.solve(n),a.y+=i-t.pos.upperArmL.distanceTo(n.arm.L.hand);let o=(i,a,o)=>(Eb(t,n,i,a,o),t.solve(n),Gy(t).z-Xy(e)-Tb.palm*r*o),s=J(Tb.ahead*r,Tb.height*r),c=J(.17*r,.36*r),l=14;for(let e=0;e<6;e++)l=Uy(e=>o(c,e,1),l,l+1,5),Eb(t,n,c,l,1),t.solve(n),c.add(s.clone().sub(Wy(t)).setX(0));let u=0;return{top:a,low:c,tilts:Array.from({length:17},(e,t)=>{let n=t/16;return u=t===16?l:Uy(e=>o(a.clone().lerp(c,n),e,n),u,u+1,5),u})}}),Ob=e=>Q(e,.44,.05),kb={id:`freestanding-hspu`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:4.6,beat:.97,camera:`side`,azimuth:66,elevation:3,detail:{pec_upper:.25,delt_post:.25,forearm_flex:.6,forearm_ext:.45},standard:`No wall; from locked arms in a stacked handstand the head is lowered to touch the floor ahead of the hands in a tripod, forearms close to upright and elbows back, not flared; the body stays one straight line, leaning back as the shoulders go forward so that the weight stays over the hands, never arching; pressed back to a full lockout over the wrists.`,effort:e=>.45+.55*Ob(e),pose(e,t,n){let r=Db(t.body),i=Z(Ob(e)),a=i*(r.tilts.length-1),o=Math.min(r.tilts.length-2,Math.floor(a)),s=(1-i)*.6*Math.sin(e*Math.PI*2*5),c=r.top.clone().lerp(r.low,i);c.z+=(t.body.upperArm+t.body.lowerArm)*Math.sin(s*q),Eb(t,n,c,$(r.tilts[o],r.tilts[o+1],a-o)-s*.4,i)}},Ab={start:.03,down:.47,touch:.51,feet:.75,kick:.79,up:.95},jb=e=>.85*e+.15*Z(e),Mb=e=>e<Ab.start?0:e<Ab.down?jb((e-Ab.start)/(Ab.down-Ab.start)):+(e<Ab.touch),Nb={chest:120,front:-.28,look:30};function Pb(e,t,n,r,i){let a=e.body,o=a.scale,s=ng(e),c=(a.upperLeg+a.lowerLeg)*.999,l=J(.005*o,s.top.y-.003*o),u=l.clone().lerp(s.top,Z(n)),d=u.clone(),f=()=>{let n=Math.asin(Math.max(-.3,Math.min(.3,(s.wall-.095*o-d.z)/(a.trunk+a.upperLeg+a.lowerLeg))))/q,c=$(Nb.chest,180+n,r);t.chest.copy(W(c)),t.pelvis.copy(W(c-8*(1-r))),t.head.copy(W($(c-$(Nb.look,Ky,r),180+n-8,i))),Ef(a,t,0,a.rest.upperArmL.x+.035*o,new L(.8,0,-1),4);for(let[e]of K)t.arm[e].shrug=$(1,.2,i);return t.hips.set(0,d.y+a.trunk,d.z),Y(e,t,d),180+n},p=(a.upperArm+a.lowerArm)*.9985;if(i<1)for(let n=0;n<2;n++)f(),u.y+=(p-e.pos.upperArmL.distanceTo(t.arm.L.hand))*(p/Math.max(.2,u.y-X(a))),d.copy(u);d.lerp(s.low,i);let m=f(),h=.028*o-Wy(e).y;h>0&&(d.y+=h,m=f());let g=l.y+a.trunk*-Math.cos(Nb.chest*q),_=Math.acos(Math.min(1,(g-.105*o)/c))/q,v=Math.hypot(c+Math.abs(a.ball.y),a.ball.z)*.95,y=J(l.z-a.trunk*Math.sin(Nb.chest*q)-Math.sqrt(Math.max(0,v**2-(g-.014*o)**2)),.014*o,-a.rest.upperLegL.x),b=1-Fy(n,0,.14),x=new L(a.rest.upperLegL.x,a.ankle,Nb.front*o),S=Fy(n,.2,.46);for(let[r]of K){let i=t.leg[r],s=e.pos[`upperLeg${r}`],l=r===`R`,u=l?$(_,m,Fy(n,0,.78)):$(24,m,Fy(n,.26,1));l&&(u=Math.max(u,Math.acos(Math.max(-1,Math.min(1,(s.y-.105*o)/c)))/q)),i.foot.copy(s).addScaledVector(Jy(u),c);let d=W(u+20);if(l){if(i.rot.copy(d),i.toes=-18,b>0){let e={foot:new L,rot:new I,knee:new L,toes:0};xf(a,s,y,new L(0,1,-.3),e),i.foot.lerp(e.foot,b),i.foot.distanceTo(s)>c&&i.foot.sub(s).setLength(c).add(s),i.rot.slerp(e.rot,b),i.toes=$(-18,e.toes,b)}}else i.foot.lerpVectors(x,i.foot,S),i.foot.distanceTo(s)>c&&i.foot.sub(s).setLength(c).add(s),i.rot.copy(new I).slerp(d,S),i.toes=$(0,-18,S);let f=.014*o-(i.foot.y+a.ball.clone().applyQuaternion(i.rot).y);f>0&&(i.foot.y+=f);let p=i.foot.clone().sub(s);i.knee.set(0,0,1).applyQuaternion(W(Math.atan2(-p.z,-p.y)/q))}}var Fb=[Qy,eb,rb,{id:`wall-hspu-negative`,revision:1,stage:`tall`,planted:[`handL`,`handR`],kind:`reps`,period:13,beat:Ab.down,camera:`side`,azimuth:114,elevation:3,props:e=>[{kind:`wall`,z:Hy(e,`wall-hspu-negative`,e=>ng(e).wall)}],detail:{pec_upper:.25,delt_post:.25,forearm_flex:.5,forearm_ext:.4},standard:`Back to the wall, heels on it, arms locked at the top; lowered evenly for at least five seconds, without dropping through the last third, until the head touches the floor softly ahead of the hands; elbows back at about 45°, not flared; body straight. The way back up is not a press: the feet come down as out of a headstand, the head staying on its crown until a foot is on the floor, and the handstand is kicked up to again on straight arms.`,effort:e=>e<Ab.start?.4:e<Ab.down?.5+.5*Mb(e):e<Ab.touch?.7:e<Ab.kick?.2:e<Ab.up?.3:.4,pose(e,t,n){if(e<Ab.touch){let r=ng(t),i=Mb(e);eg(t,n,r.top.clone().lerp(r.low,i),r.wall,$(1,.2,i),$(Ky,8,i))}else if(e<Ab.kick){let r=Math.min(1,(e-Ab.touch)/(Ab.feet-Ab.touch)),i=Fy(r,.5,1);Pb(t,n,1-Math.min(1,r/.72),$(1,.66,Fy(r,.12,.5))*(1-i),1-i)}else{let r=Fy(e,Ab.kick,Ab.up);Pb(t,n,r,Fy(r,.04,.86),0)}}},sb,lb,vb,kb,wb],Ib=new L(0,1,0),Lb=e=>Math.sin(e*Math.PI*2),Rb=(e,t,n)=>Z(Math.min(1,Math.max(0,(n-e)/(t-e)))),zb=e=>J(Math.cos(e),Math.sin(e)),Bb=(e,t)=>e.pos[`${t}L`].clone().add(e.pos[`${t}R`]).multiplyScalar(.5),Vb=.104,Hb={id:`arch-hold`,revision:1,stage:`low`,planted:[`hips`],kind:`hold`,period:4.6,camera:`side`,azimuth:62,elevation:9,standard:`Chest and thighs clear of the floor, lifted from the upper back and the glutes; arms long by the ears; legs straight and together; the head in line with the spine, not cranked back.`,effort:()=>.75,pose(e,t,n){let r=t.body.scale,i=1+.05*Lb(e),a=24*i;n.pelvis.copy(W(96)),n.chest.copy(W(90-a)),n.head.copy(W(90-a+3)),n.hips.set(0,Vb*r,0);for(let[e,r]of K){let i=n.arm[e],o=(a-9)*q,s=new L(r*.06,Math.sin(o),Math.cos(o)).normalize();i.elbow.set(r,.3,0),i.rot.copy(G(e,s,new L(-r*.25,-1,0).normalize())),i.grip=.08,i.shrug=.6,yp(t,n,e,s,.997)}t.solve(n),Tf(t,n,96-(90+14*i),50)}},Ub={id:`ab-wheel-standing`,revision:1,stage:`low`,planted:[`toesL`,`toesR`],props:e=>[{kind:`wheel`,radius:Fp(e)}],kind:`reps`,period:6.2,camera:`side`,azimuth:64,elevation:8,beat:.97,detail:{triceps:.3,delt_ant:.35},standard:`From the feet, legs straight: the wheel rolls out on locked arms until shoulders, hips and ankles are one hollow line just above the floor, and is pulled back to standing. The knees never touch and the hips never sag below the line.`,effort:e=>.3+.7*Q(e,.44,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Z(Q(e,.44,.06)),o=(r.upperArm+r.lowerArm)*.997,s=(r.upperLeg+r.lowerLeg)*.998,c=r.ball.length(),l=Fp(r)+.034*i,u=r.rest.toesL.y,d=Math.atan2(-r.ball.y,r.ball.z),f=.2*i,p=Sf(r,0,f,u).angle*q,m=$(97*q,p,a),h=$(d,90*q-p,a**.8),g=J(-c*Math.cos(h),u+c*Math.sin(h)),_=g.clone().addScaledVector(zb(m),s),v=$(52,30,a)*q;for(let[e,t]of K){let a=t*r.rest.upperLegL.x;bf(r,g.clone().setX(a),J(0,u,a),n.leg[e]),n.leg[e].knee.set(0,-Math.cos(m),Math.sin(m));let o=n.arm[e];o.rot.copy(G(e,new L(0,-Math.sin(v),Math.cos(v)),new L(0,-Math.cos(v),-Math.sin(v)))),o.elbow.set(t*.5,.3,-1),o.grip=.85,o.shrug=.3,o.hand.set(t*.15*i,l,_.z+r.trunk)}let y=$(-9*q,Math.acos((f-l)/o),a),b=e=>{let i=90-e/q;n.pelvis.copy(W(i-$(10,6,a))),n.chest.copy(W(i+$(14,4,a))),n.head.copy(W(i+$(8,-8,a))),yf(r,n.pelvis,_,n.hips);let s=0;for(let e=0;e<3;e++){t.solve(n);for(let[e]of K){let r=t.pos[`upperArm${e}`],i=n.arm[e],a=Math.sqrt(o*o-(i.hand.x-r.x)**2);i.hand.z=r.z+a*Math.sin(y),s=l+a*Math.cos(y)-r.y}}return s},x=$(-30*q,p,a);for(let e=0;e<5;e++)x+=b(x)/(r.trunk*Math.cos(x));b(x)}},Wb=e=>({width:.3*e.scale,height:.42*e.scale,depth:1.42*e.scale,z:.19*e.scale});function Gb(e,t,n,r=0){let i=e.body,a=i.scale,o=Wb(i),s=o.height,c=o.z-o.depth/2,l=Rb(15,85,n),u=J($(0,-.02,l)*a,s+$(.105,.09,l)*a);for(let[e,n]of K){let r=t.arm[e];r.hand.set(n*.09*a,s+X(i),c+i.knuckle*.9),r.rot.copy(G(e,new L(-n*.12,0,-1).normalize(),new L(0,-1,0))),r.elbow.set(n*.8,.8,.15),r.grip=.6,r.shrug=$(.5,1,l)}t.head.copy(W(-90+$(-5,10,l)));let d=16+26*r,f=-90-n;for(let r=0;r<3;r++){t.pelvis.copy(W(f-d*.5)),t.chest.copy(W(f+d*.5)),yf(i,t.pelvis,u.clone().addScaledVector(zb(n*q),i.trunk),t.hips),Y(e,t,u);let r=Bb(e,`upperLeg`).sub(Bb(e,`upperArm`));f+=Math.atan2(r.y,r.z)/q-n}let p=(n+105*r)*q;for(let[n]of K)bp(e,t,n,p,p-122*r*q,$(50,25,r)),t.leg[n].toes=-18*(1-r)}var Kb=84,qb=8,Jb={id:`dragon-flag-negative`,revision:1,stage:`square`,planted:[`handL`,`handR`],props:e=>[{kind:`box`,...Wb(e)}],kind:`reps`,period:9.4,camera:`side`,azimuth:104,elevation:10,beat:.66,standard:`Shoulders, hips and ankles stay in one line from vertical to just above the bench, with no pike at the hips; only the upper back and shoulders rest on the bench; the lowering takes at least five seconds, evenly, and the reset is tucked.`,effort:e=>e<.04?.5:e<.69?.5+.5*Math.min(1,(e-.04)/.6):.4,pose(e,t,n){if(e<.69){let r=Math.min(1,Math.max(0,(e-.04)/.6));Gb(t,n,$(Kb,qb,.7*r+.3*Z(r)))}else{let r=Math.min(1,(e-.69)/.28);Gb(t,n,$(qb,Kb,Rb(.1,.72,r)),Rb(0,.3,r)-Rb(.62,1,r))}}},Yb={id:`dragon-flag`,revision:1,stage:`square`,planted:[`handL`,`handR`],props:e=>[{kind:`box`,...Wb(e)}],kind:`reps`,period:7.2,camera:`side`,azimuth:104,elevation:10,beat:.97,standard:`Shoulders, hips and ankles stay in one line both ways, down to a pause just above the bench and back to vertical; the hips never pike and the body never rests on the bench; only the upper back and shoulders touch it.`,effort:e=>.45+.55*Q(e,.44,.08),pose(e,t,n){Gb(t,n,$(Kb,qb,Q(e,.44,.08)))}},Xb={id:`v-sit`,revision:1,stage:`square`,planted:[`handL`,`handR`],props:e=>[{kind:`rails`,...Ap(e)}],kind:`hold`,period:4.6,camera:`side`,azimuth:58,elevation:6,standard:`Arms locked and shoulders pushed down; hips forward between the hands; legs straight, together and at least 45° above level, toes pointed; the trunk leans back only a little.`,effort:()=>.9,pose(e,t,n){let r=t.body,i=Ap(r);n.pelvis.copy(W(-34)),n.chest.copy(W(-13+.6*Lb(e))),n.head.copy(W(-2));for(let[e,t]of K){let a=n.arm[e];Sp(r,a,e,t,new L(t*i.gap/2,i.height,0),i.radius),a.elbow.set(t*.2,0,-1),a.shrug=-1}let a=n.arm.L.hand,o=(r.upperArm+r.lowerArm)*.9975,s=13*q,c=e=>{let t=Math.sqrt(Math.max(0,o*o-e*e));return new L(0,a.y+t*Math.cos(s),a.z-t*Math.sin(s))};n.hips.set(0,a.y+o-r.trunk,0),Y(t,n,c(a.x-r.rest.upperArmL.x)),Y(t,n,c(a.x-t.pos.upperArmL.x)),Tf(t,n,112+.6*Lb(e),48)}},Zb={id:`manna`,revision:1,stage:`square`,planted:[`handL`,`handR`],kind:`hold`,period:4.6,camera:`side`,azimuth:58,elevation:6,standard:`Arms locked, hands on the floor behind the hips; hips pressed forward and up, above the shoulders and past the hands; legs straight, together and level or higher, the feet behind the head.`,effort:()=>.95,pose(e,t,n){let r=t.body,i=r.scale,a=17*q;n.pelvis.copy(W(-126)),n.chest.copy(W(-110+.5*Lb(e))),n.head.copy(W(-88));for(let[e,t]of K){let a=n.arm[e];a.hand.set(t*(r.rest.upperArmL.x+.02*i),X(r),0),a.rot.copy(G(e,new L(t*.2,0,-1).normalize(),new L(0,-1,0))),a.elbow.set(t,0,-.4),a.grip=.04,a.shrug=-.6}let o=n.arm.L.hand,s=(r.upperArm+r.lowerArm)*.9975,c=e=>{let t=Math.sqrt(Math.max(0,s*s-e*e));return new L(0,o.y+t*Math.cos(a),o.z-t*Math.sin(a))};n.hips.set(0,o.y+s,0),Y(t,n,c(o.x-r.rest.upperArmL.x)),Y(t,n,c(o.x-t.pos.upperArmL.x)),Tf(t,n,144+.5*Lb(e),48)}},Qb={id:`box-pistol`,revision:1,stage:`square`,planted:[`footL`],kind:`reps`,period:3.8,camera:`three-quarter`,azimuth:58,elevation:5,beat:.97,detail:{"quads.R":.4,"glutes.R":.08,"glute_med.R":.1,"hamstrings.R":.08,"hip_flexors.R":.9,"hip_flexors.L":.25,"calves.R":.06},props:e=>[{kind:`box`,...jm(e)}],standard:`On one leg the hips reach back to touch a knee-height box lightly, without sitting on it; standing heel down and the knee over the foot; the free leg straight in front and off the floor; stood up without the hands or the other foot.`,effort:e=>.3+.7*Q(e,.44,.08),pose(e,t,n){let r=t.body,i=r.scale,a=r.upperLeg+r.lowerLeg,o=Q(e,.44,.08),s=.05*i,c=.02*i,l=r.ankle+Math.sqrt((a*.998)**2-(c+r.rest.upperLegL.x-s)**2);Om(t,n,J($(.03,-.3,Z(o))*i,$(l,jm(r).height+Mm*i,o),c),$(2,50,o),$(0,46,o),$(0,16,o)),Dm(n.leg.L,r,s,0,1,4),n.leg.L.knee.set(-.2,0,1);let u=$(27,76,o**.6)*q,d=new L(0,-Math.cos(u),Math.sin(u)),f=new L(0,Math.sin(u),Math.cos(u)),p=n.leg.R;p.foot.copy(t.pos.upperLegR).addScaledVector(d,a*.9985),p.rot.copy(Yd(f,d.clone().negate())),p.knee.copy(f),p.toes=0,km(t,n,o,.12)}},$b={pelvis:34,chest:28,extend:6,knee:[25,46],hips:-.1},ex={id:`adv-shrimp-squat`,revision:1,stage:`square`,planted:[`footL`],kind:`reps`,period:4.2,camera:`side`,azimuth:64,elevation:5,beat:.97,detail:{"quads.R":.2,"glutes.R":.2,"glute_med.R":.15,"hamstrings.R":.2,"calves.R":.08},standard:`Both hands hold the rear foot behind the back throughout; the rear knee touches the floor softly behind the standing heel and nothing else touches; standing heel down, knee over the foot; the trunk stays as tall as the hold allows.`,effort:e=>.3+.7*Q(e,.45,.07),pose(e,t,n){let r=t.body,i=r.scale,a=r.upperLeg+r.lowerLeg,o=Q(e,.45,.07),s=.05*i,c=.02*i,l=r.ankle+Math.sqrt((a*.998)**2-(c+r.rest.upperLegL.x-s)**2),u=$(3,$b.pelvis,o),d=(u+$(10,$b.extend,o))*q,f=Ym*i+r.upperLeg*Math.cos(($b.pelvis+$b.extend)*q);Om(t,n,J($(.02,$b.hips,Z(o))*i,$(l,f,o),c),u,$(-4,$b.chest,o),$(0,6,o)),Dm(n.leg.L,r,s,0,1,4),n.leg.L.knee.set(-.15,0,1);let p=t.pos.upperLegR.clone(),m=p.clone().addScaledVector(new L(0,-Math.cos(d),-Math.sin(d)),r.upperLeg),h=r.upperArm+r.lowerArm,g=n.leg.R,_=e=>{let a=90*q-d+e*q,o=zb(a),s=zb(a+90*q);g.foot.copy(m).addScaledVector(o,r.lowerLeg),g.foot.x=$(g.foot.x,0,.6),g.knee.copy(m).sub(p.clone().add(g.foot).multiplyScalar(.5)),g.rot.copy(Yd(o,s)),g.toes=0;for(let[e,t]of K){let r=n.arm[e];r.hand.copy(g.foot).addScaledVector(o,(e===`L`?.125:.075)*i).addScaledVector(s,.034*i),r.hand.x+=t*.03*i,r.rot.copy(G(e,o.clone().negate().add(new L(-t*.5,0,0)).normalize(),s.clone().negate())),r.elbow.set(t,.2,-.6),r.grip=.55,r.shrug=-.3}return t.solve(n),Math.max(t.pos.upperArmL.distanceTo(n.arm.L.hand),t.pos.upperArmR.distanceTo(n.arm.R.hand))/h},v=$b.knee[0],y=$b.knee[1];for(let e=0;e<7;e++){let e=(v+y)/2;_(e)>.985?y=e:v=e}_(v)}},tx=83,nx=[Hb,Qb,Jb,Yb,Ub,ex,{id:`nordic-curl`,revision:1,stage:`square`,planted:[`lowerLegL`,`lowerLegR`,`footL`,`footR`],props:e=>[{kind:`bar`,height:.108*e.scale,width:.46*e.scale,radius:.018*e.scale,z:-e.lowerLeg*.97}],kind:`reps`,period:7.6,camera:`side`,azimuth:66,elevation:6,beat:.97,detail:{calves:.3,glutes:.5},standard:`Knees, hips and shoulders stay in one line both ways, never breaking at the hips; lowered until the chest brushes the floor and pulled back up by the hamstrings; the hands stay off the floor and do not push.`,effort:e=>.4+.6*Q(e,.5,.06),pose(e,t,n){let r=t.body,i=r.scale,a=Pp(r,n),o=tx*Q(e,.5,.06);n.pelvis.copy(W(o-2)),n.chest.copy(W(o)),n.head.copy(W(o-24*Rb(25,tx,o))),yf(r,n.pelvis,J(0,a).addScaledVector(J(Math.sin(o*q),Math.cos(o*q)),r.upperLeg),n.hips);let s=Rb(40,tx,o),c=W(o);for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*.2*i,.9*i,.3*i),r.elbow.copy(new L(t*.9,-.5,-.6).applyQuaternion(c)),r.grip=.1,r.shrug=0,r.rot.copy(G(e,Ib.clone().applyQuaternion(c),new L(0,0,1).applyQuaternion(c)))}for(let e=0;e<2;e++){t.solve(n);for(let[e,a]of K){let o=new L(a*$(.03,.09,s),$(-.1,-.14,s),$(.3,.115,s)).multiplyScalar(i),l=n.arm[e].hand.copy(t.pos[`upperArm${e}`]).add(o.applyQuaternion(c));l.y=Math.max(l.y,X(r)+.045*i)}}}},Xb,Zb],rx=new L(0,1,0),ix=e=>e.upperLeg+e.lowerLeg,ax=.088,ox=[[.03,-.082,-.05],[-.03,-.082,-.05],[.045,-.078,.124],[-.045,-.078,.124],[0,-.07,.2],[0,.044,.03],[.04,0,0],[-.04,0,0]],sx=new L;function cx(e,t){let n=0;for(let[e,r,i]of ox)n=Math.min(n,sx.set(e,r,i).applyQuaternion(t).y);return-n*e.scale}function lx(e,t,n,r){let i=e.pos[`lowerLeg${n}`],a=e.pos[`foot${n}`].clone().sub(i).normalize(),o=i.clone().sub(e.pos[`upperLeg${n}`]).normalize(),s=o.addScaledVector(a,-o.dot(a)).normalize(),c=Math.cos(r*q),l=Math.sin(r*q);t.rot.copy(Yd(s.clone().multiplyScalar(c).addScaledVector(a,l),a.clone().multiplyScalar(-c).addScaledVector(s,l)))}var ux=e=>{let t=e<.5?e:1-e;return 1-2*Z(Math.min(1,Math.max(0,(t-.06)/.38)))},dx=72,fx={id:`hip-90-90`,revision:1,stage:`low`,kind:`reps`,period:5.6,camera:`front`,azimuth:16,elevation:17,beat:.94,standard:`Sitting tall with both knees bent to 90°; the heels stay where they are and both knees roll over until the legs lie on the floor, one turned out in front and one turned in to the side, then over to the other side; chest lifted, hands off the floor.`,effort:e=>.35+.35*Math.abs(ux(e)),pose(e,t,n){let r=t.body,i=r.scale,a=ux(e),o=Math.abs(a),s=a*90*q,c=Math.hypot(r.upperLeg,r.lowerLeg),l=.5*ix(r),u=Bd(dx*a);n.pelvis.copy(u).multiply(W($(-5,3,o))),n.chest.copy(u).multiply(W($(2,4,o))),n.head.copy(u).multiply(W(2));let d=J(0,ax*i);yf(r,n.pelvis,d,n.hips);let f=t.joints(n.hips,n.pelvis,n.chest),p={L:f.hipL.sub(d),R:f.hipR.sub(d)},m={L:new L(l,.09*i,0),R:new L(-l,.09*i,0)};for(let e=0;e<4;e++){let[e,i]=K.map(([e])=>({x:m[e].x-p[e].x,z:m[e].z-p[e].z,r:Math.sqrt(c**2-(d.y+p[e].y-m[e].y)**2)})),a=i.x-e.x,l=i.z-e.z,u=Math.hypot(a,l),f=(e.r**2-i.r**2+u*u)/(2*u),h=Math.sqrt(Math.max(0,e.r**2-f**2));d.set(e.x+(f*a-h*l)/u,d.y,e.z+(f*l+h*a)/u),yf(r,n.pelvis,d,n.hips);for(let[e]of K){let t=n.leg[e];t.foot.copy(m[e]);let r=m[e].clone().sub(d).sub(p[e]).setY(0).normalize();t.knee.crossVectors(rx,r).multiplyScalar(Math.sin(s)).addScaledVector(rx,Math.cos(s)),t.toes=0}t.solve(n);for(let[e]of K)lx(t,n.leg[e],e,$(24,18,o)),m[e].y=cx(r,n.leg[e].rot)}let h=ah(t);for(let[e,t]of K){let r=n.arm[e];r.hand.set(t*.016*i,-.15*i,.23*i).applyQuaternion(u).add(h),r.elbow.set(t*.7,-1,.1).applyQuaternion(u),r.rot.copy(u).multiply(G(e,new L(0,.72,.69),new L(-t,0,0))),r.grip=.04,r.shrug=-.1}}},px={id:`worlds-greatest-stretch`,revision:1,stage:`square`,planted:[`footL`,`toesR`,`handR`],kind:`reps`,period:5.2,camera:`three-quarter`,azimuth:48,elevation:8,beat:.42,detail:{"hip_flexors.L":.12,"adductors.R":.3,"hamstrings.R":.15},standard:`Long lunge with the back leg straight and the hips low and square; front knee over the foot, not falling inwards; the supporting arm straight; the elbow goes down to the instep, then the turn comes from the upper back until the arm points at the ceiling, the eyes following the hand.`,effort:e=>.4+.5*Q(e,.42,.1),pose(e,t,n){let r=t.body,i=r.scale,a=Q(e,.42,.1),o=r.rest.upperLegL.x,s=J(0,r.ankle+r.lowerLeg*.9),c=n.leg.L,l=o+.19*i,u=r.ankle+r.lowerLeg-s.y,d=Math.sqrt(r.upperLeg**2-u**2-(l-o)**2),f=new L(Math.sin(14*q),0,Math.cos(14*q));c.foot.set(l,r.ankle,d),c.rot.copy(Yd(f,rx)),c.knee.set(l,r.ankle+r.lowerLeg,d).sub(new L(o,s.y,0).add(c.foot).multiplyScalar(.5)),c.toes=0;let p=.014*i,m=.915*(ix(r)+r.ball.length());xf(r,new L(-o,s.y,0),J(-Math.sqrt(m**2-(s.y-p)**2),p,-o-.01*i),new L(0,1,-.4),n.leg.R),n.leg.R.knee.set(0,-1,.3);let h=(r.upperArm+r.lowerArm)*.9965,g=n.arm.R;g.hand.set(-.12*i,X(r),.9*r.trunk),g.rot.copy(G(`R`,new L(-.1,0,1).normalize(),new L(0,-1,0))),g.elbow.set(-1,0,-.6),g.grip=.04,g.shrug=.3;let _=$(-30,66,a),v=n.arm.L,y=new L;ih(e=>{n.pelvis.copy(W(66-.25*e)),n.chest.copy(W(90-e)).multiply(Bd(_)),n.head.copy(n.chest).multiply(Bd($(0,62,a))).multiply(W($(-14,-6,a))),yf(r,n.pelvis,s,n.hips);for(let e=0;e<3;e++){t.solve(n);let e=t.pos.upperArmL,o=e.clone().addScaledVector(new L(.1,-1,-.08).normalize(),r.upperArm).clone().addScaledVector(new L(-.12,-.3,1).normalize(),r.lowerArm);o.y=Math.max(o.y,X(r)+.008*i);let s=o.sub(e),c=$(s.length(),h,Z(Math.min(1,a/.6)));y.copy(s.normalize()).multiplyScalar((1-a)**2).addScaledVector(new L(.85,.25,.5),2*a*(1-a)).addScaledVector(rx,a*a).normalize(),v.hand.copy(e).addScaledVector(y,c),v.elbow.set($(.1,.4,a),$(-1,-.3,a),$(-.4,-1,a));let l=new L(0,-1,0).lerp(new L(1,0,.3),a).normalize();v.rot.copy(G(`L`,new L(-.12,0,1).lerp(y,Math.min(1,2.5*a)).normalize(),l)),v.grip=.05,v.shrug=.4*a}return t.solve(n),t.pos.upperArmR.distanceTo(g.hand)-h},$(0,30,a),4,-30,70)}},mx={id:`palms-floor-fold`,revision:1,stage:`square`,planted:[`footL`,`footR`,`handL`,`handR`],kind:`mobility`,period:6.2,camera:`side`,azimuth:74,elevation:5,beat:.38,standard:`Knees locked the whole time; hips over the feet, not drifting back; both whole palms flat on the floor beside the feet; the chest is drawn towards the shins and the neck hangs relaxed; no bouncing.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=r.rest.upperLegL.x,s=.03*i,c=ix(r)*.9995;oh(r,n,0,o),Ef(r,n,.04*i,o+.13*i,new L(.3,0,-1),4);for(let[e]of K)n.arm[e].shrug=.2;let l=J(-s,r.ankle+Math.sqrt(c*c-s*s));n.pelvis.copy(W($(135,142,a))),n.chest.copy(W($(160,167,a))),n.head.copy(W($(168,176,a))),yf(r,n.pelvis,l,n.hips)}},hx={id:`seated-pike`,revision:1,stage:`low`,planted:[`footL`,`footR`,`handL`,`handR`],kind:`mobility`,period:6.4,camera:`side`,azimuth:68,elevation:8,beat:.38,standard:`Knees locked with the kneecaps up and the toes pulled back; the fold comes from the pelvis tipping forward and the back stays long; the chest rests on the thighs, reaching for the shins rather than the head for the knees.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=r.rest.upperLegL.x,s=J(0,ax*i),c=ix(r)*.9995,l=Yd(new L(0,1,-.2).normalize(),new L(0,0,-1)),u=cx(r,l),d=.055*i,f=Math.sqrt(c**2-(s.y-u)**2-(o-d)**2);n.pelvis.copy(W($(50,62,a))),n.chest.copy(W($(62,78,a))),n.head.copy(W($(56,73,a))),yf(r,n.pelvis,s,n.hips);for(let[e,t]of K){let r=n.leg[e];r.foot.set(t*d,u,f),r.rot.copy(l),r.knee.set(0,1,0),r.toes=12;let a=n.arm[e];a.hand.set(t*(d+.062*i),u+.1*i,f+.02*i),a.rot.copy(G(e,new L(-t*.35,.2,.9).normalize(),new L(-t,0,-.25).normalize())),a.elbow.set(t,-.5,-.2),a.grip=.5,a.shrug=.2}}},gx=60,_x={id:`pancake`,revision:1,stage:`low`,planted:[`footL`,`footR`],kind:`mobility`,period:6.6,camera:`three-quarter`,azimuth:38,elevation:17,beat:.38,standard:`Legs straight and wide, kneecaps and toes pointing up; the pelvis rolls forward first and the back stays long; the chest rests on the floor between the legs.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=J(0,ax*i),s=ix(r)*.9995;for(let[e,t]of K){let i=n.leg[e],a=new L(t*Math.sin(gx*q),0,Math.cos(gx*q));i.rot.copy(Yd(new L(0,1,.12).normalize(),a.clone().negate()));let c=cx(r,i.rot);i.foot.set(t*r.rest.upperLegL.x,c,0).addScaledVector(a,Math.sqrt(s*s-(o.y-c)**2)),i.knee.set(0,1,0),i.toes=0}let c=(r.upperArm+r.lowerArm)*.985,l=X(r),u=.07*i,d=e=>{for(let[t,r]of K){let i=n.arm[t],a=e[t].y-l;i.hand.set(e[t].x+r*u,l,e[t].z+Math.sqrt(Math.max(0,c**2-a**2-u**2))),i.rot.copy(G(t,new L(r*.08,0,1).normalize(),new L(0,-1,0))),i.elbow.set(r*.8,.6,0),i.grip=.03,i.shrug=.5}},f=$(.235,.13,a)*i;ih(e=>{n.pelvis.copy(W(62+e)),n.chest.copy(W(76+e)),n.head.copy(W(50+e)),yf(r,n.pelvis,o,n.hips);let i=t.joints(n.hips,n.pelvis,n.chest);d({L:i.shoulderL,R:i.shoulderR});for(let e=0;e<3;e++)t.solve(n),d({L:t.pos.upperArmL,R:t.pos.upperArmR});return t.solve(n),ah(t).y-f},8,4,-30,40)}},vx=.03,yx=new Map,bx={id:`front-split`,revision:1,stage:`low`,planted:[`footL`,`footR`,`handL`,`handR`],kind:`mobility`,period:6.6,camera:`side`,azimuth:62,elevation:9,beat:.38,detail:{"hamstrings.R":.15,"glutes.R":.12,"glute_med.R":.1,"hip_flexors.L":.12,"quads.L":.12},standard:`Front leg straight with the kneecap up; back leg straight with the kneecap and the top of the foot down; hips square to the front and resting on the floor; trunk upright, the hands only steadying.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=r.rest.upperLegL.x,s=ix(r)*.9995,c=J(0,(ax+vx*(1-a))*i);n.pelvis.copy(W(16)),n.chest.copy(W(-3)),n.head.copy(W(0)),yf(r,n.pelvis,c,n.hips);let l=n.leg.L;l.rot.copy(Yd(new L(0,1,.3).normalize(),new L(0,0,-1))),l.foot.set(o,cx(r,l.rot),0),l.foot.z=Math.sqrt(s**2-(c.y-l.foot.y)**2),l.knee.set(0,1,0),l.toes=0;let u=n.leg.R;u.rot.copy(W(176)),u.foot.set(-o,.046*i,0),u.foot.z=-Math.sqrt(s**2-(c.y-u.foot.y)**2),u.knee.set(0,-1,0),u.toes=0;let d=eh(r)*.56,f=e=>{for(let[t,r]of K){let a=n.arm[t];a.hand.set(r*e,d,.06*i),a.rot.copy(G(t,new L(r*.4,-.5,.77).normalize(),new L(0,-.85,-.5).normalize())),a.elbow.set(r*.3,0,-1),a.grip=.06,a.shrug=-.2}},p=yx.get(r.id);if(p===void 0){let e=n.hips.clone();yf(r,n.pelvis,J(0,.118*i),n.hips),p=o+.3*i;let a=(r.upperArm+r.lowerArm)*.985;for(let e=0;e<4;e++){f(p),t.solve(n);let e=t.pos.upperArmL,r=a**2-(e.y-d)**2-(e.z-.06*i)**2;p=Math.min(o+.3*i,e.x+Math.sqrt(Math.max(0,r)))}yx.set(r.id,p),n.hips.copy(e)}f(p)}},xx={id:`middle-split`,revision:1,stage:`low`,planted:[`footL`,`footR`,`handL`,`handR`],kind:`mobility`,period:6.6,camera:`front`,azimuth:20,elevation:15,beat:.38,standard:`Both legs straight and in one line with the hips, which are between the heels, not behind them; kneecaps and toes pointing up; pelvis resting on the floor; the hands on the floor in front only support.`,effort:$m,pose(e,t,n){let r=t.body,i=r.scale,a=Zm(e),o=ix(r)*.9995,s=J(0,(ax+vx*(1-a))*i);for(let[e,t]of K){let i=n.leg[e];i.rot.copy(Yd(new L(t*.12,1,0).normalize(),new L(-t,0,0)));let a=cx(r,i.rot);i.foot.set(t*(r.rest.upperLegL.x+Math.sqrt(o**2-(s.y-a)**2)),a,0),i.knee.set(0,1,0),i.toes=0}let c=(r.upperArm+r.lowerArm)*.9965;Ef(r,n,.3*i,r.rest.upperArmL.x*.95,new L(.6,0,-1),6);for(let[e]of K)n.arm[e].shrug=.1;ih(e=>(n.pelvis.copy(W(4+.7*e)),n.chest.copy(W(6+e)),n.head.copy(W(.4*e)),yf(r,n.pelvis,s,n.hips),t.solve(n),t.pos.upperArmL.distanceTo(n.arm.L.hand)-c),22,3,-10,60)}},Sx=new Map,Cx=[fx,px,mx,hx,_x,bx,xx,{id:`straight-bridge`,revision:1,stage:`low`,planted:[`handL`,`handR`,`footL`,`footR`],kind:`mobility`,period:6.4,camera:`side`,azimuth:70,elevation:6,beat:.38,detail:{delt_post:.3,forearm_ext:.3},standard:`Arms locked and legs locked; feet together and flat; the chest pushed through until the shoulders are over the wrists, not behind them; hips high; head off the floor.`,effort:e=>.65+.3*Zm(e),pose(e,t,n){let r=t.body,i=r.scale,a=r.rest.upperArmL.x+.02*i,o=(r.upperArm+r.lowerArm)*.9965,s=ix(r)*.9992,c=X(r),l=.05*i,u=(e,s)=>{Ef(r,n,0,a,new L(.45,0,-1),10);for(let[e]of K)n.arm[e].shrug=.7,n.arm[e].grip=.08;n.pelvis.copy(W(-58+5*(1-e)+s)),n.chest.copy(W(-140+10*(1-e)+s)),n.head.copy(W(-164+10*(1-e)+s));let l=$(11,0,e)*q,u=e=>{let t=Math.sqrt(Math.max(0,o*o-e*e));return new L(0,c+t*Math.cos(l),t*Math.sin(l))},d=u(a-r.rest.upperArmL.x);n.hips.set(0,d.y+.12*i,d.z+.4*i),Y(t,n,d),Y(t,n,u(Math.abs(n.arm.L.hand.x-t.pos.upperArmL.x)))},d=e=>Math.sqrt(Math.max(0,s**2-(e.y-r.ankle)**2-(e.x-l)**2)),f=Sx.get(r.id);f===void 0&&(u(1,0),f=t.pos.upperLegL.z+d(t.pos.upperLegL),Sx.set(r.id,f)),oh(r,n,f,l,new L(.05,1,.3));let p=Qm(e,.4);ih(e=>(u(p,e),t.pos.upperLegL.distanceTo(n.leg.L.foot)-s),0,2,-30,30)}}],wx=[ug,Mf,n_,cp,hh,lp,r_,Nf,dp,pp],Tx=[...rg,...t_,...op,...Rp,...Xm,...Cm,...mh],Ex=[fp,mm,am,zg,Xg,Yv],Dx=[...q_,...wv,...Py,...Fb,...nx,...Cx],Ox=[...wx,...Tx,...Dx,...Ex],kx={};for(let e of Ox)(!kx[e.id]||kx[e.id].revision<e.revision)&&(kx[e.id]=e);var Ax=(e,t)=>t===void 0?kx[e]:Ox.find(n=>n.id===e&&n.revision===t);function jx(e,t,n=0){let r=e.scale,i=Math.sin(n*Math.PI*2),a=.155*r,o=.004*r;t.hips.set(0,e.rest.hips.y-o,0),t.pelvis.identity(),t.chest.copy(W(-1.2-.9*i)),t.head.copy(W(1.5));for(let n of[`L`,`R`]){let s=n===`L`?1:-1,c=t.leg[n];c.foot.set(s*a,e.ankle,-.012*r),c.rot.copy(Yd(new L(s*.14,0,1).normalize(),new L(0,1,0))),c.knee.set(s*.12,0,1),c.toes=0;let l=t.arm[n],u=e.rest[`upperArm${n}`],d=new L(s*(.2+.012*i),-1,.05).normalize();l.hand.copy(u).setY(u.y-o-.012*r).addScaledVector(d,(e.upperArm+e.lowerArm)*.985),l.elbow.set(s*.45,0,-1),l.rot.copy(G(n,new L(s*.12,-1,.14).normalize(),new L(-s,0,-.25).normalize())),l.grip=.22,l.shrug=-.2}}var Mx=new ka({color:2763571,roughness:.35,metalness:.85}),Nx=new ka({color:1776674,roughness:.85,metalness:.05}),Px=new ka({color:1316123,roughness:.95,metalness:0}),Fx=(e,t,n=18)=>{let r=new qr(new Ta(e,e,t,n),Mx);return r.castShadow=!0,r};function Ix(e){let t=new hi;for(let n of e)if(n.kind===`bar`){let e=Fx(n.radius,n.width+.3);e.rotation.z=Math.PI/2,e.position.set(0,n.height,n.z??0),t.add(e);for(let e of[-1,1]){let r=Fx(.028,n.height+.1,14);r.position.set(e*(n.width/2+.15),(n.height+.1)/2,n.z??0),t.add(r)}}else if(n.kind===`rails`)for(let e of[-1,1]){let r=Fx(n.radius,n.length);r.rotation.x=Math.PI/2,r.position.set(e*n.gap/2,n.height,n.z??0),t.add(r);for(let r of[-1,1]){let i=Fx(n.height>.5?.024:.014,n.height,12);i.position.set(e*n.gap/2,n.height/2,(n.z??0)+r*(n.length/2-.04)),t.add(i)}}else if(n.kind===`box`){let e=new qr(new Xr(n.width,n.height,n.depth),Nx);e.position.set(n.x??0,n.height/2,n.z),e.castShadow=!0,e.receiveShadow=!0,t.add(e)}else if(n.kind===`wall`){let e=new qr(new Ea(3.2,n.height??2.7),Px);e.position.set(0,(n.height??2.7)/2,n.z),n.z>0&&(e.rotation.y=Math.PI),e.receiveShadow=!0,t.add(e)}else if(n.kind===`rings`)for(let e of[-1,1]){let r=new qr(new Da(n.radius,.014,10,32),Nx);r.position.set(e*n.gap/2,n.height,n.z??0),r.rotation.y=Math.PI/2,r.castShadow=!0;let i=new qr(new Xr(.004,Math.max(.01,n.top-n.height-n.radius),.03),Nx);i.position.set(e*n.gap/2,(n.top+n.height+n.radius)/2,n.z??0),t.add(r,i)}else if(n.kind===`band`){let e=new qr(new Xr(.03,1,.006),new ka({color:9056042,roughness:.7,metalness:0}));e.name=`band`,e.userData={x:n.x,height:n.height,z:n.z??0,to:n.to},t.add(e)}else{let e=new hi,r=new qr(new Da(n.radius-.012,.012,10,28),Nx);r.rotation.y=Math.PI/2;let i=Fx(.014,.42,12);i.rotation.z=Math.PI/2,e.add(r,i),e.name=`wheel`,e.userData.radius=n.radius,t.add(e)}return t}var Lx=class extends vi{constructor(){super();let e=new Xr;e.deleteAttribute(`uv`);let t=new ka({side:1}),n=new ka,r=new So(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new qr(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new Gi(e,n,6),o=new Qn;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new qr(e,Rx(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new qr(e,Rx(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new qr(e,Rx(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new qr(e,Rx(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new qr(e,Rx(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new qr(e,Rx(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Rx(e){return new ja({color:0,emissive:16777215,emissiveIntensity:e})}var zx={front:0,"three-quarter":38,side:90,back:180},Bx=526605,Vx=class{renderer;scene=new vi;camera=new li(26,1,.05,60);view={azimuth:0,elevation:6,distance:5,target:new L(0,.95,0)};key;rims;fill;shadow;sheen;sun;back=new L;look=n.aura.stage;size={width:1,height:1};cover={top:0,bottom:0};coverTo={top:0,bottom:0};constructor(e,t={}){let n=new Gl({canvas:e,antialias:!0,powerPreference:`high-performance`});n.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),n.toneMapping=4,n.toneMappingExposure=1.05,n.outputColorSpace=He,n.shadowMap.enabled=t.shadows??!0,n.shadowMap.type=2,this.renderer=n;let r=this.scene;r.background=new B(Bx);let i=new hs(n);r.environment=i.fromScene(new Lx,.04).texture,r.environmentIntensity=.42,i.dispose();let a=new To(16777215,2.1);a.position.set(1.6,4.2,3.2),a.castShadow=!0,a.shadow.mapSize.set(1024,1024),a.shadow.camera.left=-2.8,a.shadow.camera.right=2.8,a.shadow.camera.top=3,a.shadow.camera.bottom=-2.4,a.shadow.camera.near=.5,a.shadow.camera.far=14,a.shadow.bias=-6e-4,a.shadow.normalBias=.02,a.shadow.radius=5,this.key=a,r.add(a,a.target);let o=new To(12175615,1.5);o.position.set(-3,2.4,-3);let s=new To(14273791,1.2);s.position.set(3,2,-2.6),this.rims=[o,s],this.fill=new uo(14673663,1315868,.35),r.add(o,s,this.fill),this.shadow=new Oa({opacity:.42});let c=new qr(new wa(7,48),this.shadow);c.rotation.x=-Math.PI/2,c.receiveShadow=!0,this.sheen=new ii({transparent:!0,depthWrite:!1,uniforms:{uColour:{value:new B(10397913)},uWash:{value:1}},vertexShader:`varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform vec3 uColour; uniform float uWash; varying vec2 vP; void main(){ float r = length(vP); gl_FragColor = vec4(uColour, 0.085 * uWash * exp(-r * r * 0.42)); }`});let l=new qr(new wa(7,48),this.sheen);l.rotation.x=-Math.PI/2,l.position.y=-.001,l.renderOrder=-2,c.renderOrder=-1,r.add(l,c),this.sun=new qr(new wa(1,72),new ii({transparent:!0,depthWrite:!1,uniforms:{uColour:{value:new B(14962734)},uBlaze:{value:0},uTime:{value:0}},vertexShader:`varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
        uniform vec3 uColour; uniform float uBlaze, uTime; varying vec2 vP;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
        float fbm(vec2 p){ return noise(p) * 0.5 + noise(p * 2.03 + 7.1) * 0.3 + noise(p * 4.1 + 3.3) * 0.2; }
        void main(){
          float r = length(vP);
          if (uBlaze > 0.5) {
            // Flames that climb: the noise travels upward, and the glow reaches higher than it reaches down.
            vec2 q = vec2(vP.x * 2.6, vP.y * 1.7 - uTime * 0.55);
            float f = fbm(q + fbm(q * 1.7 + uTime * 0.2) * 0.9);
            float reach = r * mix(1.5, 0.86, smoothstep(-0.5, 0.8, vP.y));
            float body = exp(-reach * reach * 5.2);
            float tongues = smoothstep(0.5, 0.86, f) * exp(-reach * reach * 2.3);
            // A ring of white heat, as round a sun that is covered.
            float ring = exp(-pow((r - 0.2) * 11.0, 2.0));
            float core = exp(-r * r * 26.0);
            float a = (body * (0.3 + 0.8 * f) + tongues * 0.9 + ring * 0.42 + core * 0.35) * (1.0 - smoothstep(0.8, 1.0, r));
            vec3 hot = mix(uColour, vec3(1.0, 0.93, 0.78), saturate(ring * 0.75 + core * 0.8 + tongues * 0.22));
            // Laid on as light, like the Aura itself: undo the conversion below so the colour stays as deep as it was chosen.
            gl_FragColor = vec4(pow(hot, vec3(2.2)), a);
          } else {
            vec2 q = mat2(0.8, -0.6, 0.6, 0.8) * vP;
            float cloud = noise(q * 2.3) * 0.55 + noise(q * 5.1 + 3.7) * 0.3 + noise(q * 11.0 + 9.1) * 0.15;
            float streak = noise(vec2(vP.x * 2.4 + 4.0, vP.y * 38.0));
            // Solid to the edge above; washed away by a wet brush towards the bottom.
            float edge = 1.0 - smoothstep(0.962, 0.978, r + (cloud - 0.5) * 0.035);
            float worn = smoothstep(-1.0, 0.05, vP.y + (cloud - 0.5) * 0.9);
            gl_FragColor = vec4(uColour, edge * worn * (0.94 + 0.06 * streak));
          }
          #include <colorspace_fragment>
        }`})),this.sun.renderOrder=-3,this.sun.visible=!1,r.add(this.sun)}add(...e){this.scene.add(...e)}setLook(e){if(this.look=e,this.scene.background.set(e.backdrop),this.key.color.set(e.key.colour),this.key.intensity=e.key.power,e.rims.forEach((e,t)=>{this.rims[t].color.set(e.colour),this.rims[t].intensity=e.power}),this.fill.color.set(e.fill.sky),this.fill.groundColor.set(e.fill.ground),this.fill.intensity=e.fill.power,this.scene.environmentIntensity=e.room,this.renderer.toneMappingExposure=e.exposure,this.shadow.opacity=e.floor.shadow,this.sheen.uniforms.uColour.value.set(e.floor.colour),this.sheen.uniforms.uWash.value=e.floor.wash??1,this.sun.visible=!!e.sun,e.sun){let t=this.sun.material;t.uniforms.uColour.value.set(e.sun.colour),t.uniforms.uBlaze.value=+!!e.sun.blaze,t.blending=e.sun.blaze?2:1,this.sun.scale.setScalar(e.sun.radius)}}setAccent(e){let t=this.look.sun;t&&(this.sun.material.uniforms.uColour.value.set(e??t.colour),this.rims[0].color.set(e??this.look.rims[0].colour),this.sheen.uniforms.uColour.value.set(e??this.look.floor.colour))}resize(e,t){this.renderer.setSize(e,t,!1),this.size.width=e,this.size.height=Math.max(1,t),this.project()}setCover(e,t,n=!1){this.coverTo.top=Math.max(0,e),this.coverTo.bottom=Math.max(0,t),n&&(this.cover.top=this.coverTo.top,this.cover.bottom=this.coverTo.bottom,this.project())}settleCover(e){let t=this.coverTo.top-this.cover.top,n=this.coverTo.bottom-this.cover.bottom;if(t===0&&n===0)return!1;let r=e>0?1-Math.exp(-e*9):1,i=Math.abs(t)<.5&&Math.abs(n)<.5;return this.cover.top=i?this.coverTo.top:this.cover.top+t*r,this.cover.bottom=i?this.coverTo.bottom:this.cover.bottom+n*r,this.project(),!0}project(){let{width:e,height:t}=this.size,n=Math.max(t*.22,t-this.cover.top-this.cover.bottom);this.camera.aspect=e/n,this.cover.top>0||this.cover.bottom>0?this.camera.setViewOffset(e,n,0,-Math.min(this.cover.top,t-n),e,t):this.camera.clearViewOffset(),this.camera.updateProjectionMatrix()}fit(e,t,n=1.18){let r=this.camera.fov*Math.PI/360,i=Math.atan(Math.tan(r)*this.camera.aspect);return Math.max(e/2/Math.tan(r),t/2/Math.tan(i))*n}render(){let{azimuth:e,elevation:t,distance:n,target:r}=this.view,i=e*Math.PI/180,a=t*Math.PI/180;this.camera.position.set(r.x+Math.sin(i)*Math.cos(a)*n,r.y+Math.sin(a)*n,r.z+Math.cos(i)*Math.cos(a)*n),this.camera.lookAt(r),this.key.target.position.set(r.x,0,r.z);let[o,s,c]=this.look.key.from;this.key.position.set(r.x+o,s,r.z+c),this.look.sun&&(this.sun.material.uniforms.uTime.value=performance.now()/1e3,this.back.set(-Math.sin(i),0,-Math.cos(i)),this.sun.position.set(r.x+this.back.x*2.6,r.y+this.look.sun.lift,r.z+this.back.z*2.6),this.sun.lookAt(this.camera.position.x,this.sun.position.y,this.camera.position.z)),this.renderer.render(this.scene,this.camera)}dispose(){this.scene.traverse(e=>{let t=e;t.isMesh&&(t.geometry.dispose(),(Array.isArray(t.material)?t.material:[t.material]).forEach(e=>e.dispose()))}),this.scene.environment?.dispose(),this.renderer.dispose()}},Hx=`#ff2f8f`,Ux=2.8;function Wx(e){return e?e.kind===`reps`?e.period*4:e.kind===`mobility`?e.period*2:9:9}var Gx=class{stage;onState;cast=[];raf=0;last=0;playing=!0;active=!0;time=0;settle=-1;speed=1;generation=0;frames=0;fpsClock=0;fps=0;disposed=!1;sets=!1;constructor(e){this.stage=new Vx(e),this.raf=requestAnimationFrame(this.frame)}async setCast(e,n={}){let r=++this.generation,i=await Promise.all(e.map(e=>vf(e.character,t(e.style).build)));if(r!==this.generation||this.disposed){i.forEach(e=>e.dispose());return}for(let e of this.cast)e.field.dispose(),e.actor.dispose(),e.props?.removeFromParent();this.cast=e.map((e,t)=>{let n=i[t];n.group.position.x=e.x??0,n.group.rotation.y=(e.facing??0)*Math.PI/180,this.stage.add(n.group);let r=new gu(n);this.stage.add(r.group,r.world);let a={spec:e,actor:n,field:r,motion:null,pose:tf(),base:new Float32Array(bu),target:new Float32Array(bu),lastPhase:0,cosmos:0,props:null};this.apply(a,e);let o=a.motion?.props?.(n.rig.body);return o?.length&&(a.props=Ix(o),a.props.position.copy(n.group.position),a.props.rotation.y=n.group.rotation.y,this.stage.add(a.props)),a});let a=t(e[0]?.style).stage;this.stage.setLook(a);for(let e of this.cast)e.field.setPaint(!!a.paint);this.tint(),this.sets=e.some(e=>e.aura.mode===`living`),this.time=0,this.settle=-1,n.keepView||this.reframe(),this.pose(0)}update(e){if(e.length!==this.cast.length||e.some((e,t)=>e.character!==this.cast[t].spec.character||(e.style?.universe??`aura`)!==(this.cast[t].spec.style?.universe??`aura`)||e.style?.variant!==this.cast[t].spec.style?.variant||e.motion!==this.cast[t].spec.motion||e.revision!==this.cast[t].spec.revision||(e.x??0)!==(this.cast[t].spec.x??0)||(e.facing??0)!==(this.cast[t].spec.facing??0)))return void this.setCast(e,{keepView:e.length===this.cast.length});e.forEach((e,t)=>this.apply(this.cast[t],e)),this.tint();let t=e.some(e=>e.aura.mode===`living`);t!==this.sets&&(this.sets=t,this.settle=-1)}apply(n,r){n.spec=r,n.motion=r.motion?Ax(r.motion,r.revision)??null:null;let i=r.motion?e[r.motion]:void 0;n.base.fill(0),r.muscles===`exercise`&&i?n.base.set(wu(i,n.motion?.detail)):r.muscles&&r.muscles!==`exercise`&&n.base.set(wu(r.muscles)),n.actor.setStyle(r.style);let a=new B(r.glow??`#ff2f8f`);n.actor.look.glowA.value.copy(a),n.actor.look.glowB.value.copy(a).lerp(new B(16777215),.72);let o=$l[r.aura.theme]??Ql[0];n.field.setTheme(o,r.aura.tuning),n.actor.look.hairGlow.value.set(o.palette[0]),n.cosmos=o.cosmos??0,n.actor.look.cosmosA.value.set(o.palette[1]??o.palette[0]),n.actor.look.cosmosB.value.set(o.palette[3]??o.palette[0]);let s=t(r.style);s.stage.sun?.follows&&n.actor.look.rimColor.value.set(r.aura.mode===`off`?s.rimColour:o.palette[0])}tint(){let e=this.cast[0]?.spec;if(!e||!t(e.style).stage.sun?.follows)return;let n=$l[e.aura.theme]??Ql[0];this.stage.setAccent(e.aura.mode===`off`?null:n.palette[1]??n.palette[0])}reframe(e){let t=new L(1/0,1/0,1/0),n=new L(-1/0,-1/0,-1/0),r=new L;for(let e of this.cast){for(let i=0;i<(e.motion?8:1);i++){e.motion?e.motion.pose(i/8,e.actor.rig,e.pose):jx(e.actor.rig.body,e.pose,0),e.actor.rig.solve(e.pose);let a=e.actor.rig.pos,o=a.head.clone().add(new L(0,e.actor.style.headroom*e.actor.rig.body.scale,0).applyQuaternion(e.actor.rig.rot.head));for(let i of[o,a.handL,a.handR,a.footL,a.footR,a.hips,a.toesL,a.toesR])r.copy(i).applyAxisAngle(new L(0,1,0),e.actor.group.rotation.y).add(e.actor.group.position),t.min(r),n.max(r)}if(e.spec.aura.mode!==`off`){let i=e.actor.rig.body.scale*(e.spec.aura.mode===`full`?.8:.4),a=e.actor.group.position;t.min(r.set(a.x-i,0,a.z-i)),n.max(r.set(a.x+i,0,a.z+i)),n.y+=i*.5}}if(!this.cast.length)return;let i=this.cast.find(e=>e.motion)?.motion,a=this.stage.view;e===void 0?(a.azimuth=i?i.azimuth??zx[i.camera]:0,a.elevation=i?.elevation??4):a.azimuth=typeof e==`number`?e:zx[e],t.y=Math.min(t.y,0);let o=a.azimuth*Math.PI/180,s=Math.abs(Math.cos(o))*(n.x-t.x)+Math.abs(Math.sin(o))*(n.z-t.z);a.target.set((t.x+n.x)/2,(t.y+n.y)/2,(t.z+n.z)/2),this.room={height:n.y-t.y+.28,width:s+.34},a.distance=this.stage.fit(this.room.height,this.room.width,this.margin)}room={height:2,width:1};margin=1.12;resize(e,t){this.stage.resize(e,t),this.stage.view.distance=this.stage.fit(this.room.height,this.room.width,this.margin),this.stage.render()}orbit(e,t){let n=this.stage.view;n.azimuth-=e*.4,n.elevation=Math.max(-8,Math.min(70,n.elevation+t*.3))}setSafeArea(e,t,n=!1){this.stage.setCover(e,t,n),n&&(this.stage.view.distance=this.stage.fit(this.room.height,this.room.width,this.margin))}turn(e){this.stage.view.azimuth+=e}zoom(e){this.stage.view.distance=Math.max(1.2,Math.min(14,this.stage.view.distance*e))}play(){this.playing=!0}pause(){this.playing=!1}get isPlaying(){return this.playing}setSpeed(e){this.speed=e}setActive(e){this.active=e,this.last=0}seek(e){this.time=Math.max(0,e),this.settle=-1,this.pose(0),this.stage.render()}restart(){this.seek(0),this.playing=!0}release(e){this.cast.forEach((t,n)=>{(e===void 0||e===n)&&t.field.release()})}charge(e){this.cast.forEach((t,n)=>{(e===void 0||e===n)&&t.field.charge()})}get charging(){return this.cast.some(e=>e.field.busy)}get length(){return Wx(this.cast.find(e=>e.motion)?.motion??null)}pose(e){let t=this.length;for(let n of this.cast){let r=n.motion,i=r?this.time/r.period:this.time/5,a=this.settle>=0&&r?.kind===`reps`,o=a?0:i%1;r?r.pose(o,n.actor.rig,n.pose):jx(n.actor.rig.body,n.pose,o),n.actor.pose(n.pose);let s=n.props?.getObjectByName(`band`);if(s){let e=new L(s.userData.x,s.userData.height,s.userData.z),t=n.actor.rig.pos[s.userData.to];s.position.copy(e).add(t).multiplyScalar(.5),s.scale.y=Math.max(.01,e.distanceTo(t)),s.quaternion.setFromUnitVectors(new L(0,1,0),t.clone().sub(e).normalize())}let c=n.props?.getObjectByName(`wheel`);if(c){let e=n.actor.rig.pos;c.position.set((e.handL.x+e.handR.x)/2,c.userData.radius,(e.handL.z+e.handR.z)/2),c.rotation.x=c.position.z/c.userData.radius}let l=r?a?.3:r.effort(o):.5+.5*Math.sin(i*Math.PI*2),u=r?.shift?.(o);for(let e=0;e<bu;e++)n.target[e]=n.base[e]*(r?.68+.32*l:.9+.1*l);if(u){for(let[e,t]of Object.entries(u))if(yu.includes(e))for(let r of[`L`,`R`])n.target[xu(e,r)]*=t}let d=n.actor.look.act,f=e>0?1-Math.exp(-e*9):1;for(let e=0;e<bu;e++)d[e]+=(n.target[e]-d[e])*f;let p=n.spec.aura.mode;r?.beat!==void 0&&!a&&p!==`off`&&n.lastPhase<r.beat&&o>=r.beat&&n.field.beat(r.kind===`mobility`?.3:.55),n.lastPhase=o;let m=this.settle>=0&&p===`living`?.1:vu(p,r?.kind??`hold`,{progress:Math.min(1,this.time/t),effort:l,phase:o,time:this.time},n.spec.aura.level);n.field.update(e,m,this.stage.camera,this.stage.renderer.domElement.height);let h=n.actor.look.cosmos;if(h.value+=(n.cosmos*Math.min(1,m*1.6)-h.value)*(e>0?1-Math.exp(-e*4):1),n.actor.look.clock.value+=e,n.actor.style.hairGlow){let t=n.actor.look.hairCharge;t.value+=(Math.min(1,m*1.6)-t.value)*(e>0?1-Math.exp(-e*5):1)}}}frame=e=>{if(this.disposed)return;if(this.raf=requestAnimationFrame(this.frame),!this.active||!this.cast.length){this.last=0;return}let t=this.last?Math.min(.05,(e-this.last)/1e3):0;this.last=e;let n=this.playing?t*this.speed:0;if(this.settle>=0?(this.settle+=n,this.settle>Ux&&(this.settle=-1,this.time=0)):(this.time+=n,this.sets&&this.time>=this.length&&(this.settle=0)),this.pose(this.playing?n:t*.35),this.stage.settleCover(t)&&(this.stage.view.distance=this.stage.fit(this.room.height,this.room.width,this.margin)),this.stage.render(),this.frames++,this.fpsClock+=t,this.fpsClock>=.5){this.fps=this.frames/this.fpsClock,this.frames=0,this.fpsClock=0;let e=this.cast.find(e=>e.motion)?.motion;this.onState?.({playing:this.playing,time:this.time,length:this.length,phase:this.settle>=0?`settle`:`work`,fps:this.fps,count:e?Math.floor(e.kind===`reps`||e.kind===`mobility`?this.time/e.period+.03:this.time):0})}};dispose(){this.disposed=!0,cancelAnimationFrame(this.raf);for(let e of this.cast)e.field.dispose(),e.actor.dispose(),e.props?.removeFromParent();this.cast=[],this.stage.dispose()}};export{kf as a,Ax as i,Gx as n,kx as r,Hx as t};