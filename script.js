
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCxc3ylytZ92OuaYLqDZ4g1U5WCo3M9xrYywh4OpsIKu8HrhSMNNzPbOwPFmKPdtDlqHw9ZlJN1W0F/pub?gid=0&single=true&output=csv";

const map = document.getElementById("map");
const filterOptions = document.getElementById("filterOptions");
const selectAll = document.getElementById("selectAll");
const selectNone = document.getElementById("selectNone");
const minimapCanvas = document.getElementById("minimapCanvas");
const ctx = minimapCanvas.getContext("2d");

const iconByType = {
  "Pirata": "https://img.icons8.com/emoji/16/pirate-flag.png",
  "Marina": "https://img.icons8.com/color/16/anchor.png",
  "Corsaro": "https://img.icons8.com/color/16/sailing-ship.png",
  "Mercante": "https://img.icons8.com/color/16/treasure-chest.png",
  "Scogli": "https://img.icons8.com/emoji/16/rock-emoji.png",
  "Nessuna Fazione": "https://img.icons8.com/ios-filled/16/help.png"
};

let dataPoints = [];
let filters = new Set();

for (let i = 0; i < 150 * 150; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  map.appendChild(cell);
}

function renderMinimap(points) {
  ctx.clearRect(0, 0, 150, 150);
  points.forEach(p => {
    ctx.fillStyle = "black";
    ctx.fillRect(p.x, p.y, 1, 1);
  });
}

function applyFilters() {
  const allCells = map.querySelectorAll(".cell");
  allCells.forEach(c => c.innerHTML = "");
  dataPoints.forEach(point => {
    if (filters.has(point.tipologia2) || filters.size === 0) {
      const idx = point.y * 150 + point.x;
      const cell = allCells[idx];
      if (cell) {
        cell.setAttribute("data-info", point.nome);
        const img = document.createElement("img");
        img.src = iconByType[point.tipologia2] || "";
        cell.appendChild(img);
      }
    }
  });
  renderMinimap(dataPoints.filter(p => filters.has(p.tipologia2) || filters.size === 0));
}

function searchMap() {
  const val = document.getElementById("searchBox").value.toLowerCase();
  const found = dataPoints.find(p => 
    p.nome.toLowerCase().includes(val) ||
    `${p.x},${p.y}` === val ||
    p.tipologia2.toLowerCase().includes(val)
  );
  if (found) {
    const container = document.getElementById("mapContainer");
    const scrollX = (found.x * 10) - (container.clientWidth / 2);
    const scrollY = (found.y * 10) - (container.clientHeight / 2);
    container.scrollTo(scrollX, scrollY);
  }
}

function initFilterPanel(types) {
  filterOptions.innerHTML = "";
  types.forEach(type => {
    const id = `filter-${type}`;
    const el = document.createElement("div");
    el.innerHTML = `<label><input type="checkbox" id="${id}" checked> ${type}</label>`;
    filterOptions.appendChild(el);
    document.getElementById(id).addEventListener("change", () => {
      if (document.getElementById(id).checked) filters.add(type);
      else filters.delete(type);
      applyFilters();
    });
    filters.add(type);
  });

  selectAll.addEventListener("click", () => {
    filters = new Set(types);
    initFilterPanel(types);
    applyFilters();
  });

  selectNone.addEventListener("click", () => {
    filters.clear();
    initFilterPanel(types);
    applyFilters();
  });
}

fetch(sheetUrl)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1);
    const typesSet = new Set();
    rows.forEach(row => {
      const cols = row.split(",");
      if (cols.length < 5) return;
      const x = parseInt(cols[0]), y = parseInt(cols[1]);
      const tipologia2 = cols[2].split(" ").pop().trim();
      const nome = cols[4];
      typesSet.add(tipologia2);
      dataPoints.push({ x, y, tipologia2, nome });
    });
    initFilterPanel([...typesSet]);
    applyFilters();
  });
