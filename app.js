const canvas = document.querySelector('#knowledge-globe');
const ctx = canvas.getContext('2d');
const inspector = document.querySelector('#node-inspector');
const motionButton = document.querySelector('#toggle-motion');
const clock = document.querySelector('#clock');

const nodes = [
  { name: 'KlakMath', code: 'CORE_00', lat: 6, lon: 0, size: 8, color: '#ffffff', info: 'ศูนย์กลางของชุดเครื่องมือคณิตศาสตร์สำหรับ Unity: motion, noise, random และ rotation' },
  { name: 'ExpTween', code: 'MOTION_01', lat: 34, lon: -48, size: 5, color: '#5c8dff', info: 'Exponential interpolation — เหมือน easing ที่เสถียรต่อ frame rate' },
  { name: 'CdsTween', code: 'STATE_02', lat: -22, lon: -72, size: 5, color: '#a576ff', info: 'Critically damped spring ที่ส่งต่อทั้ง value และ velocity ระหว่าง frame' },
  { name: 'Noise', code: 'SIGNAL_03', lat: 52, lon: 67, size: 6, color: '#32e6ff', info: 'สร้างสัญญาณต่อเนื่องสำหรับ motion ที่ดูเป็นธรรมชาติและทำซ้ำได้' },
  { name: 'XXHash', code: 'IDENT_04', lat: -34, lon: 44, size: 6, color: '#ff9d4d', info: 'เปลี่ยน seed + id เป็นค่าที่ดูสุ่ม แต่ให้ผลเดิมเสมอ' },
  { name: 'Rotation', code: 'VECTOR_05', lat: 14, lon: 116, size: 4, color: '#65f6b5', info: 'คำนวณ quaternion ที่หมุนจากทิศทางหนึ่งไปสู่อีกทิศทางหนึ่ง' },
  { name: 'Random', code: 'SAMPLE_06', lat: -54, lon: 145, size: 4, color: '#ffd166', info: 'ส่วนขยายสำหรับสุ่มจุดภายในวงกลมและทรงกลมอย่างสม่ำเสมอ' },
  { name: 'Unity.Mathematics', code: 'BASE_07', lat: 65, lon: 172, size: 5, color: '#64b5ff', info: 'ฐานข้อมูลชนิด vector, quaternion และ math primitives ที่ทุกโมดูลใช้ร่วมกัน' }
];

const links = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[3,4],[5,7],[6,7],[1,7],[2,7]];
let rotationX = -0.18;
let rotationY = 0.28;
let autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let dragging = false;
let lastPointer = { x: 0, y: 0 };
let selected = 0;
let hovered = -1;
let projected = [];
let lastTime = performance.now();

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function pointOnSphere(lat, lon) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return {
    x: -Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta)
  };
}

function rotatePoint(p) {
  const cy = Math.cos(rotationY), sy = Math.sin(rotationY);
  const cx = Math.cos(rotationX), sx = Math.sin(rotationX);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx };
}

function project(p, cx, cy, radius) {
  const perspective = 1 + p.z * 0.13;
  return { x: cx + p.x * radius * perspective, y: cy - p.y * radius * perspective, z: p.z };
}

function drawGrid(cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = 'rgba(67, 213, 255, 0.11)';
  ctx.lineWidth = 0.75;
  for (let lat = -60; lat <= 60; lat += 20) {
    ctx.beginPath();
    for (let lon = 0; lon <= 360; lon += 4) {
      const p = project(rotatePoint(pointOnSphere(lat, lon)), cx, cy, radius);
      if (lon === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  for (let lon = 0; lon < 360; lon += 20) {
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 3) {
      const p = project(rotatePoint(pointOnSphere(lat, lon)), cx, cy, radius);
      if (lat === -90) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  const glow = ctx.createRadialGradient(cx - radius * .25, cy - radius * .25, radius * .05, cx, cy, radius * 1.05);
  glow.addColorStop(0, 'rgba(65, 236, 255, 0.10)');
  glow.addColorStop(.68, 'rgba(10, 95, 120, 0.025)');
  glow.addColorStop(1, 'rgba(50, 230, 255, 0.13)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(91, 235, 255, 0.33)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function drawLink(a, b, active) {
  const alpha = Math.min(a.z, b.z) > -0.2 ? (active ? 0.72 : 0.24) : 0.055;
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2 - Math.hypot(a.x - b.x, a.y - b.y) * 0.13;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(midX, midY, b.x, b.y);
  ctx.strokeStyle = active ? `rgba(50,230,255,${alpha})` : `rgba(92,173,205,${alpha})`;
  ctx.lineWidth = active ? 1.4 : 0.8;
  ctx.stroke();
}

function drawNode(p, node, index, time) {
  const frontAlpha = p.z > -0.22 ? 1 : 0.18;
  const isActive = index === selected || index === hovered;
  const pulse = isActive ? Math.sin(time * 0.004 + index) * 2 + 5 : 0;
  ctx.globalAlpha = frontAlpha;
  if (isActive) {
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p.x, p.y, node.size + 10 + pulse, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.shadowColor = node.color;
  ctx.shadowBlur = isActive ? 24 : 13;
  ctx.fillStyle = node.color;
  ctx.beginPath(); ctx.arc(p.x, p.y, node.size * (0.75 + (p.z + 1) * 0.18), 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  if (p.z > -0.12) {
    ctx.fillStyle = isActive ? '#e9fbff' : 'rgba(190, 228, 238, .68)';
    ctx.font = `${isActive ? 11 : 9}px ui-monospace, monospace`;
    ctx.letterSpacing = '1px';
    ctx.fillText(node.name.toUpperCase(), p.x + node.size + 8, p.y - 8);
  }
  ctx.globalAlpha = 1;
}

function render(time) {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  const dt = Math.min(time - lastTime, 32);
  lastTime = time;
  if (autoRotate && !dragging) rotationY += dt * 0.00008;
  const radius = Math.min(rect.width, rect.height) * 0.35;
  const cx = rect.width * 0.5;
  const cy = rect.height * 0.47;
  drawGrid(cx, cy, radius);
  projected = nodes.map(node => project(rotatePoint(pointOnSphere(node.lat, node.lon)), cx, cy, radius));
  links.forEach(([a, b]) => drawLink(projected[a], projected[b], a === selected || b === selected));
  projected.map((p, i) => ({ p, i })).sort((a, b) => a.p.z - b.p.z).forEach(({ p, i }) => drawNode(p, nodes[i], i, time));
  requestAnimationFrame(render);
}

function pickNode(x, y) {
  let closest = -1;
  let distance = 26;
  projected.forEach((p, i) => {
    if (p.z < -0.25) return;
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < distance) { closest = i; distance = d; }
  });
  return closest;
}

function showNode(index) {
  const node = nodes[index];
  inspector.style.opacity = '0';
  inspector.style.transform = 'translateY(5px)';
  window.setTimeout(() => {
    inspector.querySelector('.node-code').textContent = node.code;
    inspector.querySelector('h2').textContent = node.name;
    inspector.querySelector('p').textContent = node.info;
    inspector.style.opacity = '1';
    inspector.style.transform = 'translateY(0)';
  }, 120);
}

canvas.addEventListener('pointerdown', event => {
  dragging = true;
  lastPointer = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', event => {
  const rect = canvas.getBoundingClientRect();
  if (dragging) {
    rotationY += (event.clientX - lastPointer.x) * 0.006;
    rotationX = Math.max(-1.1, Math.min(1.1, rotationX + (event.clientY - lastPointer.y) * 0.005));
    lastPointer = { x: event.clientX, y: event.clientY };
  } else {
    hovered = pickNode(event.clientX - rect.left, event.clientY - rect.top);
    canvas.style.cursor = hovered >= 0 ? 'pointer' : 'grab';
  }
});
canvas.addEventListener('pointerup', event => {
  const moved = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
  dragging = false;
  const rect = canvas.getBoundingClientRect();
  const picked = pickNode(event.clientX - rect.left, event.clientY - rect.top);
  if (picked >= 0 && moved < 8) { selected = picked; showNode(selected); }
});
canvas.addEventListener('pointerleave', () => { hovered = -1; dragging = false; });

motionButton.addEventListener('click', () => {
  autoRotate = !autoRotate;
  motionButton.textContent = autoRotate ? 'หยุดการหมุน' : 'เริ่มการหมุน';
});

function updateClock() {
  clock.textContent = `${new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())} BKK`;
}

window.addEventListener('resize', resize);
resize();
updateClock();
window.setInterval(updateClock, 1000);
requestAnimationFrame(render);
