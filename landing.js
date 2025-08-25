// landing.js

const canvas = document.getElementById("landing");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bgMusic");
document.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.volume = 0.3;
    bgMusic.play();
  }
});

let catMouthOpen = false;
let pixelArt = {};
let mouse = { x: 0, y: 0 };

// Load landing image
const img = new Image();
img.src = "./landing-starry-sky.png";

img.onload = () => {
  resize();
  startAnimations();
};

img.onerror = () => {
  console.error("Failed to load landing-starry-sky.png. Check the file path.");
};

// Mouse tracking
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Window resize
window.addEventListener("resize", resize);

// Draw scene safely
function drawScene() {
  if (!img.complete || img.naturalWidth === 0) return;

  const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  pixelArt = { x, y, w: img.width * scale, h: img.height * scale, scale };
}

// Hotspot definitions
const hotspots = {
  computer: { x: 2180, y: 1330, w: 385, h: 290 },
  coffee:   { x: 1890, y: 1600, w: 100, h: 100 },
  cat:      { x: 1560, y: 1600, w: 200, h: 290 },
  plant:    { x: 1330, y: 1600, w: 150, h: 110 }
};

// Fill pixels for hover effects
function fillScreen(x, y, width, height, r, g, b, a=255) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let py = y; py < y + height; py++) {
    for (let px = x; px < x + width; px++) {
      const i = (py * canvas.width + px) * 4;
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
      data[i+3] = a;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Hover effect for computer screen
canvas.addEventListener("mousemove", () => {
  const { x, y, scale } = pixelArt;
  const hs = hotspots.computer;
  const hx = Math.floor(x + hs.x * scale);
  const hy = Math.floor(y + hs.y * scale);
  const hw = Math.floor(hs.w * scale);
  const hh = Math.floor(hs.h * scale);

  if (mouse.x >= hx && mouse.x <= hx + hw &&
      mouse.y >= hy && mouse.y <= hy + hh) {
    fillScreen(hx, hy, hw, hh, 139, 128, 0); // yellow pixels
  } else {
    drawScene(); // redraw original image
  }
});

// Click handling for hotspots
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const { x, y, scale } = pixelArt;

  for (let key in hotspots) {
    const hs = hotspots[key];
    const hx = x + hs.x * scale;
    const hy = y + hs.y * scale;
    const hw = hs.w * scale;
    const hh = hs.h * scale;

    if (mouseX >= hx && mouseX <= hx + hw &&
        mouseY >= hy && mouseY <= hy + hh) {
      handleClick(key);
    }
  }
});

function handleClick(key) {
  if (key === "computer") {
    document.getElementById("desktopOverlay").style.display = "block";
  } else if (key === "cat") {
    const meow = document.getElementById("meowSound");
    meow.currentTime = 0;
    meow.play();

    catMouthOpen = true;
    setTimeout(() => {
      catMouthOpen = false;
    }, 1000);
  }
}

// Computer screen flicker animation
function blinkScreen() {
  const { x, y, scale } = pixelArt;
  const hs = hotspots.computer;
  const hx = Math.floor(x + hs.x * scale);
  const hy = Math.floor(y + hs.y * scale);
  const hw = Math.floor(hs.w * scale);
  const hh = Math.floor(hs.h * scale);

  const flicker = Math.random() < 0.04 ? 200 : 30;
  fillScreen(hx, hy, hw, hh, flicker, flicker, 0);
}

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScene();
}

// --- Animations ---
function startAnimations() {
  let frame = 0;

  function animate() {
    drawScene();
    const { x, y, scale } = pixelArt;

    blinkScreen();

    // Coffee steam
    if (frame % 2 === 0) {
      ctx.fillStyle = "black";
      const steamX = x + 15 + (hotspots.coffee.x + 3) * scale;
      const steamY = y - 25 + (hotspots.coffee.y - (frame % 60)) * scale;
      const rectWidth = 25 * scale;
      const rectHeight = 25 * scale;
      ctx.fillRect(steamX - rectWidth/2, steamY - rectHeight, rectWidth, rectHeight);
    }

    // Cat blinking (eyes)
    if (Math.floor(frame / 100) % 2 === 0) {
      ctx.fillStyle = "rgb(0,0,0)";
      // Left eye
      ctx.fillRect(x + (hotspots.cat.x - 35) * scale, y + (hotspots.cat.y - 46) * scale, 27 * scale, 27 * scale);
      // Right eye
      ctx.fillRect(x + (hotspots.cat.x + 20) * scale, y + (hotspots.cat.y - 46) * scale, 27 * scale, 27 * scale);
    }

    // Cat mouth
    if (catMouthOpen) {
      ctx.fillStyle = "rgb(255, 182, 193)";
      ctx.fillRect(x + (hotspots.cat.x) * scale, y + (hotspots.cat.y) * scale, 15 * scale, 15 * scale);
    }

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}
