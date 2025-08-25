// desktopWindow.js

// Create overlay div
const desktopOverlay = document.createElement('div');
desktopOverlay.id = 'desktopOverlay';
document.body.appendChild(desktopOverlay);

// Close button
const closeBtn = document.createElement('button');
closeBtn.innerText = '×';
closeBtn.style.position = 'absolute';
closeBtn.style.top = '10px';
closeBtn.style.right = '50px';
closeBtn.style.fontSize = '24px';
closeBtn.style.background = 'transparent';
closeBtn.style.color = 'white';
closeBtn.style.border = 'none';
closeBtn.style.cursor = 'pointer';
closeBtn.addEventListener('click', () => {
    desktopOverlay.style.display = 'none';
});
desktopOverlay.appendChild(closeBtn);

// Sections to showcase
const sections = {
    "Projects": [
        { name: "City Bloxx Solver", description: "Algorithm to maximize 5x5 grid points." },
        { name: "Physics Solver", description: "Python tool to solve mechanics problems." },
        { name: "Pixel Desk", description: "Interactive pixel landing page project." }
    ],
    "Education": [
        { name: "B.Sc. Mathematics", description: "Ongoing degree." }
    ],
    "Work Experience": [
        { name: "Retail Assistant", description: "Worked in store for 2 years." },
        { name: "Freelance Developer", description: "Small web projects." }
    ],
    "Personal Projects": [
        { name: "Cat Animation", description: "Interactive cat animation." }
    ]
};

// Function to create folder icons
function createFolders() {
    desktopOverlay.innerHTML = ''; // clear overlay
    desktopOverlay.appendChild(closeBtn); // keep close button

    const folderContainer = document.createElement('div');
    folderContainer.style.display = 'flex';
    folderContainer.style.flexWrap = 'wrap';
    folderContainer.style.marginTop = '50px';
    
    for (const section in sections) {
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.innerText = section;
        folder.addEventListener('click', () => openFolder(section));
        folderContainer.appendChild(folder);
    }
    
    desktopOverlay.appendChild(folderContainer);
}

// Open folder view
function openFolder(section) {
    desktopOverlay.innerHTML = ''; // clear overlay
    desktopOverlay.appendChild(closeBtn); // keep close button

    const backBtn = document.createElement('button');
    backBtn.innerText = '← Back';
    backBtn.style.position = 'absolute';
    backBtn.style.top = '10px';
    backBtn.style.left = '20px';
    backBtn.style.fontSize = '18px';
    backBtn.style.background = 'transparent';
    backBtn.style.color = 'white';
    backBtn.style.border = 'none';
    backBtn.style.cursor = 'pointer';
    backBtn.addEventListener('click', createFolders);
    desktopOverlay.appendChild(backBtn);

    const itemsContainer = document.createElement('div');
    itemsContainer.style.marginTop = '50px';
    itemsContainer.style.display = 'flex';
    itemsContainer.style.flexDirection = 'column';
    itemsContainer.style.gap = '15px';

    sections[section].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.padding = '15px';
        itemDiv.style.background = 'rgba(255,255,255,0.1)';
        itemDiv.style.borderRadius = '5px';
        itemDiv.style.cursor = 'pointer';
        itemDiv.innerHTML = `<strong>${item.name}</strong><br><small>${item.description}</small>`;
        itemDiv.addEventListener('click', () => {
            alert(`You clicked "${item.name}"! More details could go here.`);
        });
        itemsContainer.appendChild(itemDiv);
    });

    desktopOverlay.appendChild(itemsContainer);
}

// Initialize folders
createFolders();
