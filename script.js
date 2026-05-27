// Lightweight UI interactions and decorative rolling balls background animation.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let balls = [];
let snowflakes = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createBalls(count = 20) {
  balls = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 14 + 8,
    vx: (Math.random() - 0.5) * 1.3,
    vy: (Math.random() - 0.5) * 1.3,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.12,
    color: Math.random() > 0.5 ? 'rgba(255,102,0,0.28)' : 'rgba(255,183,3,0.24)',
  }));
}


function createSnowflakes(count = 90) {
  snowflakes = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.6 + 0.8,
    vy: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.35,
    drift: Math.random() * Math.PI * 2,
  }));
}

function drawSnowflake(flake) {
  ctx.beginPath();
  ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fill();
}

function drawBall(ball) {
  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.rotate(ball.spin);

  ctx.beginPath();
  ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-ball.r, 0);
  ctx.lineTo(ball.r, 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snowflakes.forEach((flake) => {
    flake.y += flake.vy;
    flake.x += Math.sin(flake.drift) * 0.25 + flake.vx;
    flake.drift += 0.02;

    if (flake.y > canvas.height + flake.r) {
      flake.y = -flake.r;
      flake.x = Math.random() * canvas.width;
    }
    if (flake.x < -flake.r) flake.x = canvas.width + flake.r;
    if (flake.x > canvas.width + flake.r) flake.x = -flake.r;

    drawSnowflake(flake);
  });

  balls.forEach((ball) => {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.spin += ball.spinSpeed;

    if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1;
    if (ball.y < ball.r || ball.y > canvas.height - ball.r) ball.vy *= -1;

    drawBall(ball);
  });

  requestAnimationFrame(animate);
}

resizeCanvas();
createBalls();
createSnowflakes();
animate();
window.addEventListener('resize', () => {
  resizeCanvas();
  createBalls();
  createSnowflakes();
});
