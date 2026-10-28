/* ========================================
   COA Project – Frontend Logic
   All performance numbers are DEMONSTRATION DATA only.
   ======================================== */

// ---------- Mobile Nav Toggle ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// ---------- Highlight active nav link on scroll ----------
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  });
});

// ---------- Demonstration (Mock) Data ----------
// These values are fixed for UI demonstration only.
// They will be replaced by real measurements later.
const DEMO_DATA = {
  cpu: {
    inferenceMs: 48,
    throughput: 21,
    memoryMB: 320
  },
  gpu: {
    inferenceMs: 9,
    throughput: 112,
    memoryMB: 780
  }
};

// Simple keyword-based mock classifier (for UI only)
function mockClassify(text) {
  const lower = text.toLowerCase();
  let label = "Neutral";
  if (
    lower.includes("good") || lower.includes("great") || lower.includes("love") ||
    lower.includes("excellent") || lower.includes("amazing") || lower.includes("happy")
  ) {
    label = "Positive";
  } else if (
    lower.includes("bad") || lower.includes("hate") || lower.includes("terrible") ||
    lower.includes("awful") || lower.includes("poor") || lower.includes("worst")
  ) {
    label = "Negative";
  }
  // Fake confidence between 78% and 96%
  const confidence = (Math.random() * 18 + 78).toFixed(1) + "%";
  return { label, confidence };
}

// ---------- Main Inference Handler ----------
function runInference(mode) {
  const text = document.getElementById("inputText").value.trim();

  if (!text) {
    alert("Please enter some text first.");
    return;
  }

  // Show loading spinner
  const loading = document.getElementById("loading");
  const loadingText = document.getElementById("loadingText");
  const resultBox = document.getElementById("resultBox");

  resultBox.classList.add("hidden");
  loading.classList.remove("hidden");

  // Simulate different processing times for realism
  let delay = 600;
  if (mode === "cpu") {
    loadingText.textContent = "Running on CPU (demo)…";
    delay = 900;
  } else if (mode === "gpu") {
    loadingText.textContent = "Running on GPU (demo)…";
    delay = 350;
  } else {
    loadingText.textContent = "Comparing CPU & GPU (demo)…";
    delay = 1100;
  }

  setTimeout(() => {
    loading.classList.add("hidden");

    const { label, confidence } = mockClassify(text);
    let deviceText = "";

    if (mode === "cpu") {
      deviceText = "CPU (demonstration)";
    } else if (mode === "gpu") {
      deviceText = "GPU (demonstration)";
    } else {
      deviceText = "CPU + GPU comparison (demonstration)";
    }

    document.getElementById("predClass").textContent = label;
    document.getElementById("predConf").textContent = confidence;
    document.getElementById("predDevice").textContent = deviceText;

    resultBox.classList.remove("hidden");

    // Optionally scroll the result into view
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, delay);
}

// ---------- Charts (using Chart.js) ----------
function createCharts() {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: () => " (demonstration data)"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 } }
      },
      x: {
        ticks: { font: { size: 13, weight: "600" } }
      }
    }
  };

  // 1. Inference Time
  new Chart(document.getElementById("inferenceChart"), {
    type: "bar",
    data: {
      labels: ["CPU", "GPU"],
      datasets: [{
        label: "Inference Time (ms)",
        data: [DEMO_DATA.cpu.inferenceMs, DEMO_DATA.gpu.inferenceMs],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderRadius: 6,
        maxBarThickness: 70
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          title: { display: true, text: "Milliseconds (lower is better)" }
        }
      }
    }
  });

  // 2. Throughput
  new Chart(document.getElementById("throughputChart"), {
    type: "bar",
    data: {
      labels: ["CPU", "GPU"],
      datasets: [{
        label: "Throughput (samples/s)",
        data: [DEMO_DATA.cpu.throughput, DEMO_DATA.gpu.throughput],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderRadius: 6,
        maxBarThickness: 70
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          title: { display: true, text: "Samples per second (higher is better)" }
        }
      }
    }
  });

  // 3. Memory Usage
  new Chart(document.getElementById("memoryChart"), {
    type: "bar",
    data: {
      labels: ["CPU", "GPU"],
      datasets: [{
        label: "Memory (MB)",
        data: [DEMO_DATA.cpu.memoryMB, DEMO_DATA.gpu.memoryMB],
        backgroundColor: ["#3b82f6", "#a855f7"],
        borderRadius: 6,
        maxBarThickness: 70
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          title: { display: true, text: "Megabytes" }
        }
      }
    }
  });
}

// Initialize charts when the page is ready
document.addEventListener("DOMContentLoaded", createCharts);
