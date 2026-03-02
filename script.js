// Mansour Press — Shooting star + mouse star trail

// ----- Mouse star trail -----
let lastTrailTime = 0;

function spawnTrailStar(x, y) {
const s = document.createElement("div");
s.className = "trail-star";
s.style.left = x + "px";
s.style.top = y + "px";

// Random tiny variation
const size = 10 + Math.random() * 10;
s.style.transform = `translate(-50%, -50%) scale(${size / 14}) rotate(${Math.random() * 40 - 20}deg)`;

document.body.appendChild(s);

// Fade + drift
const driftX = (Math.random() * 10 - 5);
const driftY = (Math.random() * 10 - 5);
let opacity = 0.95;
let t = 0;

const tick = () => {
t += 1;
opacity -= 0.06;
s.style.opacity = Math.max(opacity, 0).toString();
s.style.left = (x + driftX * t) + "px";
s.style.top = (y + driftY * t) + "px";
if (opacity <= 0) s.remove();
else requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
}

window.addEventListener("mousemove", (e) => {
const now = Date.now();
// throttle so it feels magical, not messy
if (now - lastTrailTime > 18) {
spawnTrailStar(e.clientX, e.clientY);
lastTrailTime = now;
}
});

// ----- Shooting star every ~30 seconds (visible + pretty) -----
function createShootingStar() {
const star = document.createElement("div");
star.className = "shooting-star";

// Randomize starting height a bit (top area like your image)
const top = 8 + Math.random() * 22; // vh
star.style.top = `${top}vh`;

// Slight random rotation, still mostly diagonal
const rot = -10 - Math.random() * 18;
star.style.transform = `rotate(${rot}deg)`;

document.body.appendChild(star);

// Trigger animation
requestAnimationFrame(() => {
star.classList.add("run");
});

// Cleanup
star.addEventListener("animationend", () => star.remove());
}

// Start with one after load, then every 30s
window.addEventListener("load", () => {
// First one quickly so you see it
setTimeout(createShootingStar, 2500);

// Then consistent timing
setInterval(createShootingStar, 30000);
});
