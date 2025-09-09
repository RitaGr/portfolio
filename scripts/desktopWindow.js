// desktopWindow.js
const clickSound = new Audio('mouse-click.mp3');
clickSound.preload = 'auto';

let selectedFolder = null;
const trashSound = new Audio('trash-rustle.mp3');
trashSound.preload = 'auto';

const pixelCanvas = document.getElementById("pixelDesktop");
const pixelCtx = pixelCanvas.getContext("2d");
pixelCtx.imageSmoothingEnabled = false;

const desktopImg = new Image();
desktopImg.src = "../desktop.png";

const projectsImg = new Image();
projectsImg.src = "../projects-window.png";

const catPicsBackgroundImg = new Image();
catPicsBackgroundImg.src = "../projects-window.png"; 

const catPics = [
  new Image(),
  new Image(),
  new Image(),
];
catPics[0].src = '../catpics/cat1.jpg';
catPics[1].src = '../catpics/cat2.jpg';
catPics[2].src = '../catpics/cat3.jpg';

const offsetX = -400;
const offsetY = 350;

const folderZones = [
  { name: "Projects", x1: 1095, y1: 370, x2: 1200, y2: 455 },
  { name: "Personal", x1: 1225, y1: 370, x2: 1333, y2: 455 },
  { name: "Cat Pics", x1: 1360, y1: 370, x2: 1450, y2: 455 },
];

const closeZone = { x1: 1444, y1: 43, x2: 1492, y2: 81 };
const trashZone = { x1: 1391, y1: 609, x2: 1452, y2: 682 };

window.currentWindow = "desktop"; // глобальная переменная состояния окна

function showPixelDesktop() {
  window.currentWindow = "desktop";

  pixelCanvas.width = desktopImg.width / 2;
  pixelCanvas.height = desktopImg.height / 2;

  pixelCanvas.style.left = `${(window.innerWidth - pixelCanvas.width) / 2}px`;
  pixelCanvas.style.top = `${(window.innerHeight - pixelCanvas.height) / 2 + offsetY}px`;
  pixelCanvas.style.display = "block";

  drawDesktopWindow();
}

function drawDesktopWindow() {
  pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  pixelCtx.drawImage(desktopImg, 0, 0, pixelCanvas.width, pixelCanvas.height);
}

function showProjectsWindow() {
  window.currentWindow = "projects";

  pixelCanvas.width = desktopImg.width / 2;
  pixelCanvas.height = desktopImg.height / 2;

  pixelCanvas.style.left = `${(window.innerWidth - pixelCanvas.width) / 2}px`;
  pixelCanvas.style.top = `${(window.innerHeight - pixelCanvas.height) / 2 + offsetY}px`;
  pixelCanvas.style.display = "block";

  drawProjectsWindow();
}

function drawProjectsWindow() {
  pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  pixelCtx.drawImage(projectsImg, 0, 0, pixelCanvas.width, pixelCanvas.height);
}

// Окно с эффектом и картинками котиков
function showCatPicsWindow() {
  window.currentWindow = "catPics";

  pixelCanvas.width = desktopImg.width / 2;
  pixelCanvas.height = desktopImg.width / 2;

  pixelCanvas.style.left = `${(window.innerWidth - pixelCanvas.width) / 2 }px`;
  pixelCanvas.style.top = `${(window.innerHeight - pixelCanvas.height) / 2 + offsetY}px`;
  pixelCanvas.style.display = "block";

  drawCatPics();
}

function drawCatPics() {
  pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);

  // Рисуем фон (как в окне проектов)
  pixelCtx.drawImage(catPicsBackgroundImg, 0, 0, pixelCanvas.width, pixelCanvas.height);

  // Размер и позиции картинок котиков
  const imgWidth = 150;
  const imgHeight = 150;
  const spacing = 20;
  let x = 50;
  const y = 100;

  catPics.forEach(img => {
    if (img.complete) {
      pixelCtx.drawImage(img, x, y, imgWidth, imgHeight);
      x += imgWidth + spacing;
    } else {
      img.onload = () => drawCatPics();
    }
  });
}



pixelCanvas.addEventListener("click", (e) => {
  const rect = pixelCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // Закрыть окно или вернуть на рабочий стол
  if (mx > closeZone.x1 && mx < closeZone.x2 && my > closeZone.y1 && my < closeZone.y2) {
    clickSound.currentTime = 0;
    clickSound.play();

    if (window.currentWindow === "projects") {
      showPixelDesktop();
      selectedFolder = null;
    } else if (window.currentWindow === "catPics") {
      showPixelDesktop();
      selectedFolder = null;
    }else if (window.currentWindow === "desktop") {
      pixelCanvas.style.display = "none";
      selectedFolder = null;
      // Можно добавить showMainScreen(), если нужно
    }
    return;
  }

  if (window.currentWindow === "desktop") {
    for (const folder of folderZones) {
      if (mx > folder.x1 && mx < folder.x2 && my > folder.y1 && my < folder.y2) {
        clickSound.currentTime = 0;
        clickSound.play();

        selectedFolder = folder.name;
        drawDesktopWindow();

        if (folder.name === "Projects") {
          showProjectsWindow();
          selectedFolder = null;
        } else if (folder.name === "Cat Pics") {
          if (typeof window.showCatPicsWindow === "function") {
            window.showCatPicsWindow();
          }else {
            console.error('showCatPicsWindow функция не найдена');
            }
          selectedFolder = null;
        }
        return;
      }
    }

    if (mx > trashZone.x1 && mx < trashZone.x2 && my > trashZone.y1 && my < trashZone.y2) {
      trashSound.currentTime = 0;
      trashSound.play();
      return;
    }
  }
  // Возможна логика для проекта или других окон
});

// экспорт функции для внешнего вызова
window.showPixelDesktop = showPixelDesktop;
