const zones = ['구역1', '구역2']; // 실제 zone 이름
const baseUrl = "https://script.google.com/macros/s/AKfycbxM7C3X46cVTIKVqjaWYJqAvnqud-AAn-0BBjUSK2yh0Grb6sanbxL1VLGPRoa_KPCo/exec";

document.getElementById('zoneSelect').onchange = loadZoneData;

function loadZoneData() {
  const zone = document.getElementById('zoneSelect').value;
  fetch(`${baseUrl}?zone=${zone}`)
    .then(res => res.json())
    .then(data => renderBuildings(data, zone));
}

function renderBuildings(data, zone) {
  const container = document.getElementById('buildingList');
  container.innerHTML = "";
  const headers = data[0];
  data.slice(1).forEach((row, idx) => {
    const rowElem = document.createElement('div');
    rowElem.innerHTML = `<b>${row[1]} ${row[2]} ${row[3]} ${row[4]} ${row[5]}</b><br>`;
    ['만남', '부재', '초기화'].forEach(status => {
      const btn = document.createElement('button');
      btn.innerText = status;
      btn.className = (row[6] === status) ? "active" : "inactive";
      btn.onclick = () => updateStatus(zone, idx + 2, status === '초기화' ? '' : status);
      rowElem.appendChild(btn);
    });
    container.appendChild(rowElem);
  });
}

function updateStatus(zone, row, value) {
  fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ zone, row, col: '방문 표시', value })
  }).then(() => loadZoneData());
}

window.onload = () => {
  const sel = document.getElementById('zoneSelect');
  zones.forEach(z => {
    const opt = document.createElement('option');
    opt.value = opt.text = z;
    sel.appendChild(opt);
  });
};
