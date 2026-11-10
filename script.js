const DEMO_DATA = {
  cpu: { inferenceMs: 48, throughput: 21, memoryMB: 320 },
  gpu: { inferenceMs: 9, throughput: 112, memoryMB: 780 }
};

let liveLabels = [], liveCpuData = [], liveGpuData = [];
let liveChart = null;
let history = [];
let lastCpuTime = 48, lastGpuTime = 9;

async function runInference(mode) {
  const text = document.getElementById("inputText").value.trim();
  if (!text) { alert("Please enter some text first."); return; }

  const loading = document.getElementById("loading");
  const loadingText = document.getElementById("loadingText");
  const resultBox = document.getElementById("resultBox");
  const compareBox = document.getElementById("compareBox");

  if (resultBox) resultBox.classList.add("hidden");
  if (compareBox) compareBox.classList.add("hidden");
  if (loading) loading.classList.remove("hidden");
  if (loadingText) {
    if (mode === "cpu") loadingText.textContent = "Running on CPU...";
    else if (mode === "gpu") loadingText.textContent = "Running on GPU...";
    else loadingText.textContent = "Comparing CPU & GPU...";
  }

  try {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, device: mode })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");

    if ((mode === "cpu" || mode === "gpu") && resultBox) {
      const elClass = document.getElementById("predClass");
      const elConf = document.getElementById("predConf");
      const elDev = document.getElementById("predDevice");
      if (elClass) elClass.textContent = data.label;
      if (elConf) elConf.textContent = data.confidence;
      if (elDev) elDev.textContent = (data.device_label || mode) +
        (data.inference_ms != null ? " · " + data.inference_ms + " ms" : "");
      resultBox.classList.remove("hidden");
    }

    if (mode === "both" && compareBox) {
      const cpuT = document.getElementById("cpuTime");
      const gpuT = document.getElementById("gpuTime");
      const cpuC = document.getElementById("cpuClass");
      const gpuC = document.getElementById("gpuClass");
      const spd = document.getElementById("speedupValue");
      if (cpuT) cpuT.textContent = (data.cpu_ms || "-") + " ms";
      if (gpuT) gpuT.textContent = (data.gpu_ms || "-") + " ms";
      if (cpuC) cpuC.textContent = data.label;
      if (gpuC) gpuC.textContent = data.label;
      if (spd) spd.textContent = (data.speedup || "-") + "x faster on GPU";
      compareBox.classList.remove("hidden");
    }

    updateDashboard(mode, data);
    updateLiveGraph(mode, data);
    addToHistory(mode, data);
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    if (loading) loading.classList.add("hidden");
  }
}

function updateDashboard(mode, data) {
  const cpuEl = document.getElementById("dashCpuTime");
  const gpuEl = document.getElementById("dashGpuTime");
  const cpuTh = document.getElementById("dashCpuThrough");
  const gpuTh = document.getElementById("dashGpuThrough");

  if (mode === "cpu" && data.inference_ms != null) {
    lastCpuTime = data.inference_ms;
    if (cpuEl) cpuEl.textContent = lastCpuTime + " ms";
    if (cpuTh) cpuTh.textContent = Math.max(1, Math.round(1000 / lastCpuTime)) + " /s";
  } else if (mode === "gpu" && data.inference_ms != null) {
    lastGpuTime = data.inference_ms;
    if (gpuEl) gpuEl.textContent = lastGpuTime + " ms";
    if (gpuTh) gpuTh.textContent = Math.max(1, Math.round(1000 / lastGpuTime)) + " /s";
  } else if (mode === "both") {
    if (data.cpu_ms != null) lastCpuTime = data.cpu_ms;
    if (data.gpu_ms != null) lastGpuTime = data.gpu_ms;
    if (cpuEl) cpuEl.textContent = lastCpuTime + " ms";
    if (gpuEl) gpuEl.textContent = lastGpuTime + " ms";
    if (cpuTh) cpuTh.textContent = Math.max(1, Math.round(1000 / lastCpuTime)) + " /s";
    if (gpuTh) gpuTh.textContent = Math.max(1, Math.round(1000 / lastGpuTime)) + " /s";
  }
  updateDashboardCharts();
}

function updateDashboardCharts() {
  if (window.inferenceChart) {
    window.inferenceChart.data.datasets[0].data = [lastCpuTime, lastGpuTime];
    window.inferenceChart.update();
  }
  if (window.throughputChart) {
    window.throughputChart.data.datasets[0].data = [
      Math.max(1, Math.round(1000 / lastCpuTime)),
      Math.max(1, Math.round(1000 / lastGpuTime))
    ];
    window.throughputChart.update();
  }
}

function updateLiveGraph(mode, data) {
  const card = document.getElementById("liveGraphCard");
  if (!card) return;
  card.classList.remove("hidden");
  const t = new Date().toLocaleTimeString();
  if (mode === "cpu") {
    liveLabels.push(t); liveCpuData.push(data.inference_ms || lastCpuTime); liveGpuData.push(null);
  } else if (mode === "gpu") {
    liveLabels.push(t); liveCpuData.push(null); liveGpuData.push(data.inference_ms || lastGpuTime);
  } else {
    liveLabels.push(t); liveCpuData.push(data.cpu_ms || lastCpuTime); liveGpuData.push(data.gpu_ms || lastGpuTime);
  }
  if (liveLabels.length > 8) { liveLabels.shift(); liveCpuData.shift(); liveGpuData.shift(); }
  if (liveChart) {
    liveChart.data.labels = liveLabels;
    liveChart.data.datasets[0].data = liveCpuData;
    liveChart.data.datasets[1].data = liveGpuData;
    liveChart.update();
  } else if (document.getElementById("liveChart")) createLiveChart();
}

function createLiveChart() {
  const el = document.getElementById("liveChart");
  if (!el || typeof Chart === "undefined") return;
  liveChart = new Chart(el.getContext("2d"), {
    type: "bar",
    data: {
      labels: liveLabels,
      datasets: [
        { label: "CPU (ms)", data: liveCpuData, backgroundColor: "#ef4444", borderRadius: 6 },
        { label: "GPU (ms)", data: liveGpuData, backgroundColor: "#22c55e", borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      scales: { y: { beginAtZero: true, title: { display: true, text: "ms (lower is better)" } } }
    }
  });
}

function addToHistory(mode, data) {
  const card = document.getElementById("historyCard");
  if (!card) return;
  card.classList.remove("hidden");
  const time = new Date().toLocaleTimeString();
  let device = mode.toUpperCase(), inference = "-";
  if (mode === "cpu") inference = (data.inference_ms || "-") + " ms";
  else if (mode === "gpu") inference = (data.inference_ms || "-") + " ms";
  else { device = "BOTH"; inference = "CPU " + (data.cpu_ms||"-") + " / GPU " + (data.gpu_ms||"-") + " ms"; }
  history.unshift({ time, device, label: data.label, confidence: data.confidence, inference });
  if (history.length > 8) history.pop();
  renderHistory();
}

function renderHistory() {
  const tbody = document.getElementById("historyBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  history.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `<td style="padding:0.55rem;border-bottom:1px solid #e2e8f0">${item.time}</td>
      <td style="padding:0.55rem;border-bottom:1px solid #e2e8f0">${item.device}</td>
      <td style="padding:0.55rem;border-bottom:1px solid #e2e8f0">${item.label}</td>
      <td style="padding:0.55rem;border-bottom:1px solid #e2e8f0">${item.confidence}</td>
      <td style="padding:0.55rem;border-bottom:1px solid #e2e8f0">${item.inference}</td>`;
    tbody.appendChild(row);
  });
}

function clearHistory() {
  history = []; liveLabels = []; liveCpuData = []; liveGpuData = [];
  renderHistory();
  if (liveChart) {
    liveChart.data.labels = []; liveChart.data.datasets[0].data = []; liveChart.data.datasets[1].data = [];
    liveChart.update();
  }
  const h = document.getElementById("historyCard");
  const g = document.getElementById("liveGraphCard");
  if (h) h.classList.add("hidden");
  if (g) g.classList.add("hidden");
}

function createCharts() {
  if (typeof Chart === "undefined") return;
  const common = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };
  const inf = document.getElementById("inferenceChart");
  const thr = document.getElementById("throughputChart");
  const mem = document.getElementById("memoryChart");
  if (inf) window.inferenceChart = new Chart(inf, { type: "bar", data: { labels: ["CPU","GPU"], datasets: [{ data: [48,9], backgroundColor: ["#ef4444","#22c55e"], borderRadius: 6 }] }, options: common });
  if (thr) window.throughputChart = new Chart(thr, { type: "bar", data: { labels: ["CPU","GPU"], datasets: [{ data: [21,112], backgroundColor: ["#ef4444","#22c55e"], borderRadius: 6 }] }, options: common });
  if (mem) new Chart(mem, { type: "bar", data: { labels: ["CPU","GPU"], datasets: [{ data: [320,780], backgroundColor: ["#3b82f6","#a855f7"], borderRadius: 6 }] }, options: common });
}

document.addEventListener("DOMContentLoaded", createCharts);
