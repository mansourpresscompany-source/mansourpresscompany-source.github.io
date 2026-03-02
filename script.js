// year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Shooting star every ~30 seconds (with slight randomness)
function spawnShootingStar() {
const s = document.createElement("div");
s.className = "shooting-star";

// Start position near top-left but varied
const startTop = Math.random() * 25 - 20; // -20vh to 5vh
const startLeft = Math.random() * 30 - 35; // -35vw to -5vw
s.style.top = `${startTop}vh`;
s.style.left = `${startLeft}vw`;

// Duration slightly varied
const dur = 2.4 + Math.random() * 1.2; // 2.4s to 3.6s
s.style.animation = `shootAcross ${dur}s ease-in-out 0s 1`;

document.body.appendChild(s);

// Cleanup
setTimeout(() => s.remove(), (dur + 0.4) * 1000);
}

// Initial delay so it doesn’t fire immediately on load
setTimeout(() => {
spawnShootingStar();
setInterval(() => {
spawnShootingStar();
}, 28000 + Math.floor(Math.random() * 6000)); // ~28–34s
}, 3500);

// Mouse star trail
let lastTrailTime = 0;
document.addEventListener("mousemove", (e) => {
const now = performance.now();
// throttle
if (now - lastTrailTime < 22) return;
lastTrailTime = now;

const t = document.createElement("span");
t.className = "trail-star";
t.style.left = `${e.clientX}px`;
t.style.top = `${e.clientY}px`;

// random size/opacity for a magical feel
const size = 8 + Math.random() * 10;
t.style.width = `${size}px`;
t.style.height = `${size}px`;
t.style.opacity = `${0.65 + Math.random() * 0.35}`;

const fadeDur = 520 + Math.random() * 450;
t.style.animation = `trailFade ${fadeDur}ms ease-out forwards`;

document.body.appendChild(t);
setTimeout(() => t.remove(), fadeDur + 60);
});
