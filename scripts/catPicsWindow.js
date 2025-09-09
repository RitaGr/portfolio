// catPicsWindow.js
const catPicsCanvas = document.getElementById("catPics");
const catPicsCtx = catPicsCanvas.getContext("2d");
catPicsCtx.imageSmoothingEnabled = false;

const offsetX = -400;
const offsetY = 350;

const desktopImg = new Image();
desktopImg.src = "../projects-window.png";

const catPics = [
  new Image(),
  new Image(),
  new Image(),
];
catPics[0].src = '../catpics/cat1.jpg';
catPics[1].src = '../catpics/cat2.jpg';
catPics[2].src = '../catpics/cat3.jpg';

// не определяем здесь currentWindow, используем глобальную

function showCatPicsWindow() {
  window.currentWindow = "catPics";

  catPicsCanvas.width = desktopImg.width / 2;
  catPicsCanvas.height = desktopImg.height / 2;

  catPicsCanvas.style.position = 'absolute';
  catPicsCanvas.style.left = `${(window.innerWidth - catPicsCanvas.width) / 2 + offsetX}px`;
  catPicsCanvas.style.top = `${(window.innerHeight - catPicsCanvas.height) / 2 + offsetY}px`;
  catPicsCanvas.style.display = "block";

  drawCatPics();
}

function drawCatPics() {
  catPicsCtx.clearRect(0, 0, catPicsCanvas.width, catPicsCanvas.height);

  catPicsCtx.drawImage(desktopImg, 0, 0, catPicsCanvas.width, catPicsCanvas.height);

  const imgWidth = 150;
  const imgHeight = 150;
  const spacing = 20;
  let x = 50;
  const y = 100;

  catPics.forEach(img => {
    if (img.complete) {
      catPicsCtx.drawImage(img, x, y, imgWidth, imgHeight);
      x += imgWidth + spacing;
    } else {
      img.onload = () => drawCatPics();
    }
  });

  const closeSize = 40;
  catPicsCtx.fillStyle = '#fff';
  catPicsCtx.font = 'bold 30px Arial';
  catPicsCtx.fillText('×', catPicsCanvas.width - closeSize, closeSize);
}

function isClickOnClose(mx, my) {
  const size = 40;
  return mx > catPicsCanvas.width - size && mx < catPicsCanvas.width && my > 0 && my < size;
}

catPicsCanvas.addEventListener('click', (e) => {
  if (window.currentWindow !== "catPics") return;

  const rect = catPicsCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (isClickOnClose(mx, my)) {
    catPicsCanvas.style.display = "none";
    window.currentWindow = "desktop";

    if (typeof window.showPixelDesktop === 'function') {
      window.showPixelDesktop();
    }
  }
});

window.showCatPicsWindow = showCatPicsWindow;
