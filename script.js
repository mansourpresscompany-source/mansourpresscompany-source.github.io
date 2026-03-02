/* Mansour Press — animated sky
- Nebula haze (visible)
- Slowly drifting stars + twinkle
- ONE shooting star across the page about every ~30s
- Mouse star trail sparkle
*/

const sky = document.getElementById("sky");
const skyFx = document.getElementById("skyFx");
const ctx = sky.getContext("2d");
const fx = skyFx.getContext("2d");

let W = 0, H = 0, DPR = 1;

function resize(){
DPR = Math.min(2, window.devicePixelRatio || 1);
W = Math.floor(window.innerWidth);
H = Math.floor(window.innerHeight);

sky.width = Math.floor(W * DPR);
sky.height = Math.floor(H * DPR);
sky.style.width = W + "px";
sky.style.height = H + "px";

skyFx.width = Math.floor(W * DPR);
skyFx.height = Math.floor(H * DPR);
skyFx.style.width = W + "px";
skyFx.style.height = H + "px";

ctx.setTransform(DPR,0,0,DPR,0,0);
fx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener("resize", resize);
resize();

/* ---------- STARFIELD ---------- */
const stars = [];
const STAR_COUNT = Math.floor((W * H) / 9000) + 140; // responsive density

function rand(min,max){ return min + Math.random()*(max-min); }

function makeStars(){
stars.length = 0;
const count = Math.floor((W * H) / 9000) + 160;
for(let i=0;i<count;i++){
stars.push({
x: Math.random()*W,
y: Math.random()*H,
r: rand(0.6, 1.7),
a: rand(0.35, 1),
tw: rand(0.002, 0.01),
sp: rand(0.01, 0.05) // drift speed
});
}
}
makeStars();
window.addEventListener("resize", makeStars);

/* ---------- NEBULA (visible) ---------- */
const nebulaBlobs = [
{ x: 0.20, y: 0.25, c: "rgba(85, 210, 255, 0.22)", r: 420 },
{ x: 0.78, y: 0.30, c: "rgba(140, 120, 255, 0.20)", r: 520 },
{ x: 0.60, y: 0.62, c: "rgba(255, 170, 240, 0.12)", r: 560 },
{ x: 0.28, y: 0.70, c: "rgba(120, 255, 210, 0.10)", r: 520 }
];

function drawNebula(t){
// deep base
const bg = ctx.createLinearGradient(0,0,W,H);
bg.addColorStop(0, "#050818");
bg.addColorStop(0.45, "#0b1640");
bg.addColorStop(1, "#070a18");
ctx.fillStyle = bg;
ctx.fillRect(0,0,W,H);

// soft vignette
const vig = ctx.createRadialGradient(W*0.5,H*0.55, Math.min(W,H)*0.2, W*0.5,H*0.55, Math.max(W,H)*0.75);
vig.addColorStop(0, "rgba(0,0,0,0)");
vig.addColorStop(1, "rgba(0,0,0,0.55)");
ctx.fillStyle = vig;
ctx.fillRect(0,0,W,H);

// nebula blobs (move subtly)
ctx.save();
ctx.globalCompositeOperation = "screen";
for(const b of nebulaBlobs){
const driftX = Math.sin(t*0.00008 + b.x*10) * 30;
const driftY = Math.cos(t*0.00007 + b.y*12) * 22;
const cx = W*b.x + driftX;
const cy = H*b.y + driftY;

const g = ctx.createRadialGradient(cx,cy, 0, cx,cy, b.r);
g.addColorStop(0, b.c);
g.addColorStop(1, "rgba(0,0,0,0)");
ctx.fillStyle = g;
ctx.fillRect(0,0,W,H);
}
ctx.restore();

// subtle milky haze near center (makes it feel like your reference)
ctx.save();
ctx.globalCompositeOperation = "screen";
const haze = ctx.createRadialGradient(W*0.5,H*0.42, 20, W*0.5,H*0.42, Math.min(W,H)*0.65);
haze.addColorStop(0, "rgba(255,255,255,0.07)");
haze.addColorStop(1, "rgba(255,255,255,0)");
ctx.fillStyle = haze;
ctx.fillRect(0,0,W,H);
ctx.restore();
}

/* ---------- SHOOTING STAR (ONE) ---------- */
let nextMeteorAt = performance.now() + 12000; // first soon
let meteor = null;

function spawnMeteor(){
// left-to-right across the top-ish like your reference
const startX = -W*0.1;
const startY = rand(H*0.08, H*0.28);
const endX = W*1.1;
const endY = startY + rand(60, 140);

meteor = {
x: startX,
y: startY,
vx: (endX - startX) / 1400, // duration ~1.4s
vy: (endY - startY) / 1400,
life: 0,
max: 1400
};
}

function drawMeteor(dt){
if(!meteor) return;
meteor.life += dt;
meteor.x += meteor.vx * dt;
meteor.y += meteor.vy * dt;

const p = meteor.life / meteor.max;
const alpha = p < 0.2 ? p/0.2 : (p > 0.85 ? (1 - p)/0.15 : 1);

// tail
ctx.save();
ctx.globalCompositeOperation = "screen";
ctx.lineCap = "round";
ctx.lineWidth = 4;
const tailLen = 240;

const tx = meteor.x - meteor.vx * tailLen;
const ty = meteor.y - meteor.vy * tailLen;

const grad = ctx.createLinearGradient(meteor.x, meteor.y, tx, ty);
grad.addColorStop(0, `rgba(255, 228, 160, ${0.95*alpha})`);
grad.addColorStop(0.35, `rgba(255, 215, 120, ${0.55*alpha})`);
grad.addColorStop(1, `rgba(255, 215, 120, 0)`);
ctx.strokeStyle = grad;

ctx.beginPath();
ctx.moveTo(meteor.x, meteor.y);
ctx.lineTo(tx, ty);
ctx.stroke();

// “star head”
ctx.fillStyle = `rgba(255, 240, 200, ${0.95*alpha})`;
ctx.shadowColor = "rgba(255, 220, 140, 0.9)";
ctx.shadowBlur = 18;
ctx.beginPath();
ctx.arc(meteor.x, meteor.y, 5.2, 0, Math.PI*2);
ctx.fill();
ctx.restore();

if(meteor.life >= meteor.max){
meteor = null;
nextMeteorAt = performance.now() + 30000; // about every 30s
}
}

/* ---------- MOUSE STAR TRAIL ---------- */
const trail = [];
let mouse = {x: W/2, y: H/2, moved:false};

window.addEventListener("mousemove", (e)=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
mouse.moved = true;

// emit a few tiny particles
for(let i=0;i<2;i++){
trail.push({
x: mouse.x + rand(-6,6),
y: mouse.y + rand(-6,6),
vx: rand(-0.25,0.25),
vy: rand(-0.25,0.25),
a: 1,
r: rand(1.2, 2.4),
s: rand(0.006, 0.012)
});
}
while(trail.length > 140) trail.shift();
});

function drawTrail(){
fx.clearRect(0,0,W,H);
fx.save();
fx.globalCompositeOperation = "screen";

for(const p of trail){
p.x += p.vx;
p.y += p.vy;
p.a -= p.s;

if(p.a <= 0) continue;

fx.fillStyle = `rgba(255, 235, 180, ${p.a})`;
fx.shadowColor = "rgba(255, 210, 120, 0.85)";
fx.shadowBlur = 12;

fx.beginPath();
fx.arc(p.x, p.y, p.r, 0, Math.PI*2);
fx.fill();
}

// remove dead
for(let i=trail.length-1;i>=0;i--){
if(trail[i].a <= 0) trail.splice(i,1);
}

fx.restore();
}

/* ---------- MAIN LOOP ---------- */
let last = performance.now();

function drawStars(t){
ctx.save();
ctx.globalCompositeOperation = "screen";
for(const s of stars){
// drift a bit
s.x += s.sp;
if(s.x > W+5) s.x = -5;

// twinkle
const tw = 0.5 + 0.5*Math.sin(t*s.tw + s.y*0.02);
const a = Math.min(1, Math.max(0.15, s.a * tw));

ctx.fillStyle = `rgba(255,255,255,${a})`;
ctx.beginPath();
ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
ctx.fill();
}
ctx.restore();
}

function loop(now){
const dt = now - last;
last = now;

drawNebula(now);
drawStars(now);

// meteor timing
if(!meteor && now >= nextMeteorAt){
spawnMeteor();
}
drawMeteor(dt);

drawTrail();

requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
