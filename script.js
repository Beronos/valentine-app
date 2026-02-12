// ═══════════════════════════════════════════
//  EmailJS Configuration — Fill in your keys
// ═══════════════════════════════════════════
const EMAILJS_PUBLIC_KEY  = "kwnDs0QTiQGCdl7O-";
const EMAILJS_SERVICE_ID  = "service_xy2sghh";
const EMAILJS_TEMPLATE_ID = "template_a0hi624";

// ═══════════════════════════════════════════
//  Floating Hearts
// ═══════════════════════════════════════════
(function createFloatingHearts() {
  const container = document.getElementById("hearts-bg");
  const heartChars = ["💕", "💖", "💗", "❤️", "💘", "💝", "♥"];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.classList.add("floating-heart");
    heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (16 + Math.random() * 20) + "px";
    heart.style.animationDuration = (6 + Math.random() * 8) + "s";
    heart.style.animationDelay = (Math.random() * 10) + "s";
    container.appendChild(heart);
  }
})();

// ═══════════════════════════════════════════
//  Screen Management
// ═══════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ═══════════════════════════════════════════
//  No Button Dodge Logic
// ═══════════════════════════════════════════
const btnNo = document.getElementById("btn-no");

function dodgeButton() {
  const padding = 20;
  const btnW = btnNo.offsetWidth;
  const btnH = btnNo.offsetHeight;
  const newX = Math.max(padding, Math.min(padding + Math.random() * (window.innerWidth - btnW - padding * 2), window.innerWidth - btnW - padding));
  const newY = Math.max(padding, Math.min(padding + Math.random() * (window.innerHeight - btnH - padding * 2), window.innerHeight - btnH - padding));

  if (!btnNo.classList.contains("dodging")) {
    btnNo.classList.add("dodging");
  }

  btnNo.style.left = newX + "px";
  btnNo.style.top = newY + "px";
}

btnNo.addEventListener("click", dodgeButton);
btnNo.addEventListener("touchstart", function (e) {
  e.preventDefault();
  dodgeButton();
}, { passive: false });

// ═══════════════════════════════════════════
//  Yes Button — Go to Celebration
// ═══════════════════════════════════════════
document.getElementById("btn-yes").addEventListener("click", function () {
  showScreen("screen-celebration");
  startConfetti();

  // Show message area after a short delay
  setTimeout(function () {
    document.getElementById("message-area").classList.add("visible");
  }, 1200);
});

// ═══════════════════════════════════════════
//  Confetti Canvas Animation
// ═══════════════════════════════════════════
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function randomColor() {
  const colors = [
    "#e91e63", "#f44336", "#ff5722", "#ff9800",
    "#ffeb3b", "#8bc34a", "#03a9f4", "#9c27b0",
    "#ff4081", "#f50057", "#e040fb", "#7c4dff",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createParticle(x, y) {
  return {
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 1) * 12 - 4,
    size: 4 + Math.random() * 6,
    color: randomColor(),
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    gravity: 0.12 + Math.random() * 0.08,
    opacity: 1,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

function startConfetti() {
  confettiRunning = true;
  particles = [];

  // Burst from multiple points
  for (let burst = 0; burst < 5; burst++) {
    const bx = canvas.width * (0.2 + Math.random() * 0.6);
    const by = canvas.height * (0.2 + Math.random() * 0.4);
    for (let i = 0; i < 60; i++) {
      particles.push(createParticle(bx, by));
    }
  }

  animateConfetti();

  // Stop after a while
  setTimeout(function () {
    confettiRunning = false;
  }, 5000);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(function (p) {
    return p.opacity > 0.01 && p.y < canvas.height + 50;
  });

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.vx *= 0.99;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.opacity -= 0.003;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    if (p.shape === "rect") {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  if (particles.length > 0 || confettiRunning) {
    requestAnimationFrame(animateConfetti);
  }
}

// ═══════════════════════════════════════════
//  Send Message via EmailJS
// ═══════════════════════════════════════════
document.getElementById("btn-send").addEventListener("click", function () {
  const message = document.getElementById("sweet-message").value.trim();
  const statusEl = document.getElementById("send-status");
  const sendBtn = document.getElementById("btn-send");

  if (!message) {
    statusEl.textContent = "Write something sweet first! 💕";
    return;
  }

  // Check if EmailJS keys are configured
  if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    // Keys not configured — skip email, go straight to thank you
    statusEl.textContent = "Sent! 💕";
    setTimeout(function () {
      showScreen("screen-thankyou");
    }, 800);
    return;
  }

  sendBtn.disabled = true;
  statusEl.textContent = "Sending your love... 💌";

  emailjs.init(EMAILJS_PUBLIC_KEY);
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    message: message,
    from_name: "Your Valentine",
  }).then(function () {
    statusEl.textContent = "Sent! 💕";
    setTimeout(function () {
      showScreen("screen-thankyou");
    }, 800);
  }).catch(function (err) {
    console.error("EmailJS error:", err);
    statusEl.textContent = "Oops, something went wrong. But I still love you! 💖";
    sendBtn.disabled = false;
  });
});
