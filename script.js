/**
 * EcoSort AI - Smart Waste Management System
 * Core JavaScript Application (script.js)
 * Clean, Modular, Functional Vanilla ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Navigation & Header Interactivity
  // =========================================================================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearSpan = document.getElementById('currentYear');

  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Header background blur & shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.classList.toggle('active', !isOpen);
      navMenu.classList.toggle('open', !isOpen);
    });

    // Close mobile menu when clicking outside or clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }

  // =========================================================================
  // 2. Sound Effects System (Web Audio API - Zero External Audio Files)
  // =========================================================================
  const audioCtx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playTone(freq = 440, type = 'sine', duration = 0.15, gainVal = 0.08) {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playSuccessTone() {
    playTone(523.25, 'sine', 0.1, 0.06); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.06), 100); // E5
  }

  function playWrongTone() {
    playTone(220, 'triangle', 0.15, 0.08); // A3
    setTimeout(() => playTone(196, 'triangle', 0.25, 0.08), 120); // G3
  }

  function playScanTone() {
    playTone(880, 'sine', 0.08, 0.04);
  }

  // =========================================================================
  // 3. Toast Notifications
  // =========================================================================
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  let toastTimer = null;

  function showToast(message, iconClass = 'fa-circle-check', isSuccess = true) {
    if (!toast || !toastMsg) return;
    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    if (toastIcon) {
      toastIcon.className = `fa-solid ${iconClass} toast-icon`;
      toastIcon.style.color = isSuccess ? '#52b788' : '#e65100';
    }
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // =========================================================================
  // 4. AI Waste Classifier (Interactive Demo Module)
  // =========================================================================

  // Pre-configured Dataset of Waste Classes
  const wasteKnowledgeBase = {
    'plastic-bottle': {
      category: 'PLASTIC WASTE',
      name: 'Clear Beverage Bottle (PET-1 Polyethylene)',
      confidence: 98.4,
      icon: 'fa-bottle-water',
      graphicName: 'PET Plastic Water Bottle',
      probabilities: { plastic: 98.4, metal: 1.1, paper: 0.3, organic: 0.2 },
      binName: 'Designated: Blue Bin (Dry Recyclables - Plastics)',
      binIcon: 'fa-bottle-water',
      instructions: 'Empty and rinse thoroughly. Flatten the bottle to reduce volume. Dispose of cap per local guidelines.',
      ecoImpact: 'Recycling this bottle saves ~1.5kg CO₂ emissions and enough energy to power a 60W lightbulb for 3 hours.'
    },
    'apple-core': {
      category: 'ORGANIC WASTE',
      name: 'Fruit Core & Biodegradable Food Residue',
      confidence: 99.1,
      icon: 'fa-apple-whole',
      graphicName: 'Organic Apple Core Scraps',
      probabilities: { plastic: 0.1, metal: 0.1, paper: 0.7, organic: 99.1 },
      binName: 'Designated: Green Bin (Compostable Organics)',
      binIcon: 'fa-apple-whole',
      instructions: 'Deposit directly into wet/organic stream. Do not wrap in non-biodegradable plastic packaging.',
      ecoImpact: 'Composting this organic matter prevents anaerobic methane emissions and yields nutrient-rich humus soil.'
    },
    'soda-can': {
      category: 'METAL WASTE',
      name: 'Aluminum Carbonated Beverage Can',
      confidence: 97.6,
      icon: 'fa-can-food',
      graphicName: 'Recyclable Aluminum Can',
      probabilities: { plastic: 1.2, metal: 97.6, paper: 0.6, organic: 0.6 },
      binName: 'Designated: Yellow / Grey Bin (Metals & Scrap)',
      binIcon: 'fa-can-food',
      instructions: 'Rinse out residual syrup. Crush carefully to preserve bin capacity. Metals can be remelted infinitely.',
      ecoImpact: 'Recycling aluminum consumes 95% less energy than mining virgin bauxite ore from the earth.'
    },
    'cardboard-box': {
      category: 'PAPER WASTE',
      name: 'Corrugated Cardboard Packaging Box',
      confidence: 96.9,
      icon: 'fa-box',
      graphicName: 'Corrugated Paper Cardboard',
      probabilities: { plastic: 1.8, metal: 0.4, paper: 96.9, organic: 0.9 },
      binName: 'Designated: Blue Bin (Dry Paper & Cardboard)',
      binIcon: 'fa-newspaper',
      instructions: 'Remove excessive packing tape and shipping labels. Flatten flat to keep moisture-free and dry.',
      ecoImpact: '1 ton of recycled cardboard saves 17 mature trees, 7,000 gallons of water, and 4,000 kWh of electricity.'
    },
    'glass-jar': {
      category: 'GLASS WASTE',
      name: 'Flint Glass Preserve Container & Bottle',
      confidence: 98.2,
      icon: 'fa-wine-bottle',
      graphicName: 'Glass Pickle Jar / Bottle',
      probabilities: { plastic: 0.5, metal: 1.1, paper: 0.2, organic: 98.2 }, // We customize prob for glass
      binName: 'Designated: Cyan / Blue Bin (Glass Containers)',
      binIcon: 'fa-wine-bottle',
      instructions: 'Rinse residual contents. Separate metal lid for metal bin. Handle carefully to prevent shard hazards.',
      ecoImpact: 'Glass is 100% recyclable with no loss in purity or quality, melting at lower temperatures than raw silica.'
    },
    'battery': {
      category: 'E-WASTE / HAZARDOUS',
      name: 'Lithium-Ion Rechargeable Cell Battery',
      confidence: 99.4,
      icon: 'fa-battery-half',
      graphicName: 'Lithium Rechargeable Battery',
      probabilities: { plastic: 0.3, metal: 0.3, paper: 0.0, organic: 0.0 },
      binName: 'Designated: Red Bin (Hazardous E-Waste Drop-off)',
      binIcon: 'fa-battery-half',
      instructions: 'DO NOT place in general waste. Tape terminal contacts with electrical tape to prevent short circuits and fires.',
      ecoImpact: 'Prevents heavy metals like cobalt, nickel, and lithium from leaching into groundwater aquifers.'
    }
  };

  // State
  let currentPresetKey = 'plastic-bottle';
  let uploadedCustomImageSrc = null;

  // DOM Elements for Classifier
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('wasteImageInput');
  const browseFileBtn = document.getElementById('browseFileBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const runClassifierBtn = document.getElementById('runClassifierBtn');
  const resetClassifierBtn = document.getElementById('resetClassifierBtn');

  const scannerOverlay = document.getElementById('scannerOverlay');
  const previewImage = document.getElementById('previewImage');
  const previewFallbackGraphic = document.getElementById('previewFallbackGraphic');
  const previewIcon = document.getElementById('previewIcon');
  const previewFallbackName = document.getElementById('previewFallbackName');

  const resultCard = document.getElementById('resultCard');
  const resultCategoryBadge = document.getElementById('resultCategoryBadge');
  const resultItemName = document.getElementById('resultItemName');
  const resultConfidence = document.getElementById('resultConfidence');
  const confidenceBar = document.getElementById('confidenceBar');

  const probPlastic = document.getElementById('probPlastic');
  const valPlastic = document.getElementById('valPlastic');
  const probMetal = document.getElementById('probMetal');
  const valMetal = document.getElementById('valMetal');
  const probPaper = document.getElementById('probPaper');
  const valPaper = document.getElementById('valPaper');
  const probOrganic = document.getElementById('probOrganic');
  const valOrganic = document.getElementById('valOrganic');

  const binName = document.getElementById('binName');
  const binIcon = document.getElementById('binIcon');
  const binInstructions = document.getElementById('binInstructions');
  const ecoImpactText = document.getElementById('ecoImpactText');

  // Trigger file browse
  if (browseFileBtn && fileInput) {
    browseFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleImageUpload(files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleImageUpload(fileInput.files[0]);
      }
    });
  }

  function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'fa-triangle-exclamation', false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedCustomImageSrc = e.target.result;
      previewImage.src = uploadedCustomImageSrc;
      previewImage.classList.remove('hidden');
      previewFallbackGraphic.classList.add('hidden');

      // Clear preset active states
      presetBtns.forEach(btn => btn.classList.remove('active'));

      showToast(`Uploaded: ${file.name.substring(0, 24)}... Ready to scan!`);
      playScanTone();

      // Automatically run classification for smooth UX
      runClassificationSimulation(true, file.name);
    };
    reader.readAsDataURL(file);
  }

  // Handle preset clicks
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (!preset || !wasteKnowledgeBase[preset]) return;

      currentPresetKey = preset;
      uploadedCustomImageSrc = null;

      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update preview to preset graphic
      const item = wasteKnowledgeBase[preset];
      previewImage.classList.add('hidden');
      previewFallbackGraphic.classList.remove('hidden');
      previewIcon.className = `fa-solid ${item.icon}`;
      previewFallbackName.textContent = item.graphicName;

      playScanTone();
      runClassificationSimulation(false);
    });
  });

  // Run Classifier Button
  if (runClassifierBtn) {
    runClassifierBtn.addEventListener('click', () => {
      runClassificationSimulation(uploadedCustomImageSrc !== null);
    });
  }

  // Reset Scanner Button
  if (resetClassifierBtn) {
    resetClassifierBtn.addEventListener('click', () => {
      uploadedCustomImageSrc = null;
      if (fileInput) fileInput.value = '';
      currentPresetKey = 'plastic-bottle';

      presetBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-preset') === 'plastic-bottle');
      });

      previewImage.classList.add('hidden');
      previewFallbackGraphic.classList.remove('hidden');
      previewIcon.className = 'fa-solid fa-bottle-water';
      previewFallbackName.textContent = 'Plastic Water Bottle (PET-1)';

      updateClassificationResults(wasteKnowledgeBase['plastic-bottle']);
      showToast('Scanner reset to default baseline.');
    });
  }

  function runClassificationSimulation(isCustomUpload = false, filename = '') {
    // Show scanning laser overlay
    if (scannerOverlay) {
      scannerOverlay.classList.add('scanning');
      playScanTone();
    }

    // Disable run button temporarily
    if (runClassifierBtn) runClassifierBtn.disabled = true;

    setTimeout(() => {
      if (scannerOverlay) {
        scannerOverlay.classList.remove('scanning');
      }
      if (runClassifierBtn) runClassifierBtn.disabled = false;

      let resultData;
      if (isCustomUpload) {
        // Smart heuristic simulation based on filename or randomized realistic CNN inference
        resultData = generateCustomImageInference(filename);
      } else {
        resultData = wasteKnowledgeBase[currentPresetKey];
      }

      updateClassificationResults(resultData);
      playSuccessTone();
      showToast('AI Inference Complete: Category Identified!');
    }, 1100);
  }

  function generateCustomImageInference(filename) {
    const fn = (filename || '').toLowerCase();
    if (fn.includes('can') || fn.includes('metal') || fn.includes('tin') || fn.includes('alu')) {
      return wasteKnowledgeBase['soda-can'];
    } else if (fn.includes('apple') || fn.includes('food') || fn.includes('banana') || fn.includes('organic') || fn.includes('fruit')) {
      return wasteKnowledgeBase['apple-core'];
    } else if (fn.includes('cardboard') || fn.includes('paper') || fn.includes('box') || fn.includes('carton')) {
      return wasteKnowledgeBase['cardboard-box'];
    } else if (fn.includes('glass') || fn.includes('jar') || fn.includes('cup')) {
      return wasteKnowledgeBase['glass-jar'];
    } else if (fn.includes('battery') || fn.includes('circuit') || fn.includes('cell')) {
      return wasteKnowledgeBase['battery'];
    }
    // Default fallback realistic plastic inference
    return {
      category: 'PLASTIC WASTE',
      name: 'Polymer Synthetic Item (Detected from Uploaded Frame)',
      confidence: 96.8,
      icon: 'fa-bottle-water',
      graphicName: 'Uploaded Waste Specimen',
      probabilities: { plastic: 96.8, metal: 2.1, paper: 0.8, organic: 0.3 },
      binName: 'Designated: Blue Bin (Plastics & Dry Packaging)',
      binIcon: 'fa-recycle',
      instructions: 'Check for recycling resin number (1-7). Rinse to avoid contamination with organic residues.',
      ecoImpact: 'Segregation diverts polymer waste from marine ecosystems and cuts fossil fuel usage.'
    };
  }

  function updateClassificationResults(data) {
    if (!data) return;

    if (resultCategoryBadge) resultCategoryBadge.textContent = data.category;
    if (resultItemName) resultItemName.textContent = data.name;
    if (resultConfidence) resultConfidence.textContent = `${data.confidence}%`;
    if (confidenceBar) confidenceBar.style.width = `${data.confidence}%`;

    // Probabilities
    if (probPlastic && valPlastic) {
      const p = data.probabilities.plastic || 1.2;
      probPlastic.style.width = `${p}%`;
      valPlastic.textContent = `${p}%`;
    }
    if (probMetal && valMetal) {
      const m = data.probabilities.metal || 0.8;
      probMetal.style.width = `${m}%`;
      valMetal.textContent = `${m}%`;
    }
    if (probPaper && valPaper) {
      const pa = data.probabilities.paper || 0.5;
      probPaper.style.width = `${pa}%`;
      valPaper.textContent = `${pa}%`;
    }
    if (probOrganic && valOrganic) {
      const o = data.probabilities.organic || 0.3;
      probOrganic.style.width = `${o}%`;
      valOrganic.textContent = `${o}%`;
    }

    if (binName) binName.textContent = data.binName;
    if (binIcon) binIcon.className = `fa-solid ${data.binIcon || 'fa-trash-can'}`;
    if (binInstructions) binInstructions.textContent = data.instructions;
    if (ecoImpactText) ecoImpactText.textContent = data.ecoImpact;
  }

  // Initial update
  updateClassificationResults(wasteKnowledgeBase['plastic-bottle']);

  // =========================================================================
  // 5. Smart Dashboard (Chart.js & Dynamic Timeframes)
  // =========================================================================

  // Dashboard Data Models for Timeframes
  const dashboardData = {
    today: {
      total: '1,480',
      recycled: '1,160',
      organic: '520',
      plastic: '440',
      rate: '78.4%',
      trendNote: '+12.4% vs yesterday',
      composition: [32, 28, 20, 12, 8],
      trendLabels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      trendTotal: [180, 420, 750, 1120, 1340, 1480],
      trendRecycled: [140, 330, 590, 890, 1050, 1160]
    },
    week: {
      total: '9,840',
      recycled: '7,870',
      organic: '3,450',
      plastic: '2,920',
      rate: '80.0%',
      trendNote: '+8.1% vs last week',
      composition: [34, 26, 21, 11, 8],
      trendLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      trendTotal: [1250, 1420, 1380, 1510, 1480, 1620, 1180],
      trendRecycled: [990, 1140, 1100, 1210, 1190, 1310, 930]
    },
    month: {
      total: '42,650',
      recycled: '33,270',
      organic: '15,300',
      plastic: '12,800',
      rate: '78.0%',
      trendNote: '+15.3% vs prior month',
      composition: [31, 30, 19, 13, 7],
      trendLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      trendTotal: [9800, 10600, 11150, 11100],
      trendRecycled: [7650, 8270, 8700, 8650]
    },
    all: {
      total: '248,500',
      recycled: '196,300',
      organic: '88,200',
      plastic: '76,400',
      rate: '79.0%',
      trendNote: 'Annual Municipal Total',
      composition: [33, 27, 20, 12, 8],
      trendLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
      trendTotal: [58000, 62400, 64100, 64000],
      trendRecycled: [45800, 49300, 50600, 50600]
    }
  };

  let compositionChartInstance = null;
  let trendChartInstance = null;

  function initDashboardCharts() {
    const ctxComp = document.getElementById('compositionChart');
    const ctxTrend = document.getElementById('trendChart');

    if (ctxComp && window.Chart) {
      compositionChartInstance = new Chart(ctxComp, {
        type: 'doughnut',
        data: {
          labels: ['Plastic', 'Organic', 'Paper', 'Metal', 'Glass'],
          datasets: [{
            data: dashboardData.today.composition,
            backgroundColor: [
              '#2d6a4f', // Forest green (Plastic)
              '#52b788', // Emerald mint (Organic)
              '#74c69d', // Soft mint (Paper)
              '#b7e4c7', // Pale mint (Metal)
              '#40916c'  // Teal green (Glass)
            ],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // We use our custom legend chips
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.label}: ${context.raw}% by weight`;
                }
              }
            }
          },
          cutout: '68%'
        }
      });
    }

    if (ctxTrend && window.Chart) {
      trendChartInstance = new Chart(ctxTrend, {
        type: 'bar',
        data: {
          labels: dashboardData.today.trendLabels,
          datasets: [
            {
              label: 'Total Collected (kg)',
              data: dashboardData.today.trendTotal,
              backgroundColor: 'rgba(82, 183, 136, 0.4)',
              borderColor: '#52b788',
              borderWidth: 1.5,
              borderRadius: 6
            },
            {
              label: 'Cleanly Recycled (kg)',
              data: dashboardData.today.trendRecycled,
              backgroundColor: '#1b4332',
              borderColor: '#1b4332',
              borderWidth: 1.5,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 14,
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
                color: '#283618'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(225, 239, 231, 0.6)' },
              ticks: { color: '#586f61', font: { family: "'Plus Jakarta Sans', sans-serif" } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#586f61', font: { family: "'Plus Jakarta Sans', sans-serif" } }
            }
          }
        }
      });
    }
  }

  // Timeframe selector buttons
  const timeTabs = document.querySelectorAll('.time-tab');
  timeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const timeframe = tab.getAttribute('data-timeframe');
      if (!timeframe || !dashboardData[timeframe]) return;

      timeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      updateDashboard(timeframe);
      playTone(600, 'sine', 0.05, 0.03);
    });
  });

  function updateDashboard(timeframeKey) {
    const data = dashboardData[timeframeKey];
    if (!data) return;

    // Update KPIs
    const metricTotal = document.getElementById('metricTotal');
    const metricRecycled = document.getElementById('metricRecycled');
    const metricOrganic = document.getElementById('metricOrganic');
    const metricPlastic = document.getElementById('metricPlastic');
    const metricRate = document.getElementById('metricRate');
    const dashTimestamp = document.getElementById('dashTimestamp');

    if (metricTotal) metricTotal.innerHTML = `${data.total} <small>kg</small>`;
    if (metricRecycled) metricRecycled.innerHTML = `${data.recycled} <small>kg</small>`;
    if (metricOrganic) metricOrganic.innerHTML = `${data.organic} <small>kg</small>`;
    if (metricPlastic) metricPlastic.innerHTML = `${data.plastic} <small>kg</small>`;
    if (metricRate) metricRate.textContent = data.rate;
    if (dashTimestamp) dashTimestamp.textContent = `Updated: ${timeframeKey.toUpperCase()}`;

    // Update Chart.js instances
    if (compositionChartInstance) {
      compositionChartInstance.data.datasets[0].data = data.composition;
      compositionChartInstance.update();
    }

    if (trendChartInstance) {
      trendChartInstance.data.labels = data.trendLabels;
      trendChartInstance.data.datasets[0].data = data.trendTotal;
      trendChartInstance.data.datasets[1].data = data.trendRecycled;
      trendChartInstance.update();
    }
  }

  // Initialize charts after load
  initDashboardCharts();

  // =========================================================================
  // 6. Waste Sorting Game ("EcoHero Challenge")
  // =========================================================================
  const gameQuestions = [
    {
      title: 'Banana Peel & Fruit Residue',
      hint: 'Organic kitchen waste rich in potassium and organic matter.',
      icon: 'fa-apple-whole',
      correctCategory: 'organic',
      categoryName: 'Organic / Wet Waste',
      explanation: 'Fruit peels and food scraps decompose naturally into rich compost, diverting dangerous methane gases from landfills.'
    },
    {
      title: 'Crushed Aluminum Soda Can',
      hint: 'Lightweight metal container used for soft drinks.',
      icon: 'fa-can-food',
      correctCategory: 'metal',
      categoryName: 'Metal & Cans',
      explanation: 'Aluminum can be melted and re-engineered infinitely with zero loss in tensile strength, saving 95% virgin mining energy.'
    },
    {
      title: 'Corrugated Shipping Box',
      hint: 'Brown fibrous packaging box used for postal shipping.',
      icon: 'fa-box',
      correctCategory: 'paper',
      categoryName: 'Paper & Cardboard',
      explanation: 'Clean cardboard is repulped into paper products. Keep it dry and clean from grease to enable high-grade recycling.'
    },
    {
      title: 'Clear Plastic Beverage Bottle',
      hint: 'PET-1 polymer bottle widely used for bottled water.',
      icon: 'fa-bottle-water',
      correctCategory: 'plastic',
      categoryName: 'Plastic Waste',
      explanation: 'PET bottles are shredded into plastic flakes, spun into recycled polyester yarn, or reformed into food-grade bottles.'
    },
    {
      title: 'Glass Jam & Pickle Jar',
      hint: 'Transparent vitreous food container with sealable rim.',
      icon: 'fa-wine-bottle',
      correctCategory: 'glass',
      categoryName: 'Glass Bottles',
      explanation: 'Glass is made of silica sand and does not degrade over time. Rinse the jar and place it in the designated glass bin.'
    },
    {
      title: 'Lithium-Ion Smartphone Battery',
      hint: 'Rechargeable chemical energy storage cell with electrodes.',
      icon: 'fa-battery-half',
      correctCategory: 'hazardous',
      categoryName: 'E-Waste / Hazardous',
      explanation: 'Batteries contain volatile heavy metals that can burst into flames or leach toxins if tossed into standard compactors.'
    },
    {
      title: 'Greasy Delivery Pizza Box',
      hint: 'Cardboard box soaked with cheese oils and food grease.',
      icon: 'fa-pizza-slice',
      correctCategory: 'organic', // In municipal systems, food-grease-soaked boxes cannot be recycled with clean paper; they go to compost/organic
      categoryName: 'Organic / Compostable',
      explanation: 'Heavy food oils ruin the paper pulping process! Greasy food boxes belong in municipal composting or commercial organics.'
    },
    {
      title: 'Single-Use Plastic Cutlery (Fork/Spoon)',
      hint: 'Disposable polystyrene or polypropylene picnic utensils.',
      icon: 'fa-utensils',
      correctCategory: 'plastic',
      categoryName: 'Plastic Waste',
      explanation: 'Plastic utensils should be collected and washed for polymer recycling or replaced with reusable bamboo alternatives.'
    },
    {
      title: 'Old Newspaper & Magazine Stack',
      hint: 'Printed cellulose newsprint and educational magazines.',
      icon: 'fa-newspaper',
      correctCategory: 'paper',
      categoryName: 'Paper & Cardboard',
      explanation: 'Newspapers are de-inked and recycled into recycled cardboard, paper towels, and egg cartons.'
    },
    {
      title: 'Steel Soup & Pet Food Tin',
      hint: 'Ferrous metal tin with protective food-grade interior coating.',
      icon: 'fa-drum',
      correctCategory: 'metal',
      categoryName: 'Metal & Cans',
      explanation: 'Steel cans are easily recovered using giant industrial electromagnets at Materials Recovery Facilities.'
    }
  ];

  let currentQuestionIndex = 0;
  let gameScore = 0;
  let gameStreak = 0;
  let hasAnsweredCurrentQuestion = false;

  const gameScoreEl = document.getElementById('gameScore');
  const gameStreakEl = document.getElementById('gameStreak');
  const gameQuestionCountEl = document.getElementById('gameQuestionCount');
  const gameItemIcon = document.getElementById('gameItemIcon');
  const gameItemTitle = document.getElementById('gameItemTitle');
  const gameItemHint = document.getElementById('gameItemHint');
  const gameChoicesGrid = document.getElementById('gameChoices');
  const gameFeedbackBanner = document.getElementById('gameFeedback');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackExplanation = document.getElementById('feedbackExplanation');
  const gameNextBtn = document.getElementById('gameNextBtn');
  const gameRestartBtn = document.getElementById('gameRestartBtn');

  const gameCard = document.getElementById('gameCard');
  const gameOverPanel = document.getElementById('gameOverPanel');
  const finalScoreEl = document.getElementById('finalScore');
  const finalFeedbackMsg = document.getElementById('finalFeedbackMsg');
  const playAgainBtn = document.getElementById('playAgainBtn');

  function loadGameQuestion(index) {
    hasAnsweredCurrentQuestion = false;
    const q = gameQuestions[index];
    if (!q) return;

    if (gameItemIcon) gameItemIcon.className = `fa-solid ${q.icon}`;
    if (gameItemTitle) gameItemTitle.textContent = q.title;
    if (gameItemHint) gameItemHint.textContent = q.hint;
    if (gameQuestionCountEl) gameQuestionCountEl.textContent = `${index + 1} / ${gameQuestions.length}`;

    // Reset button states
    const choiceBtns = gameChoicesGrid.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
      btn.className = 'choice-btn';
      btn.disabled = false;
    });

    // Hide feedback banner
    if (gameFeedbackBanner) gameFeedbackBanner.classList.add('hidden');
  }

  // Handle user clicking category choices
  if (gameChoicesGrid) {
    gameChoicesGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-btn');
      if (!btn || hasAnsweredCurrentQuestion) return;

      const chosenCategory = btn.getAttribute('data-category');
      const q = gameQuestions[currentQuestionIndex];
      hasAnsweredCurrentQuestion = true;

      const isCorrect = chosenCategory === q.correctCategory;

      if (isCorrect) {
        btn.classList.add('correct-choice');
        gameScore += 10 + (gameStreak * 2);
        gameStreak++;
        playSuccessTone();

        if (feedbackIcon) feedbackIcon.className = 'feedback-icon';
        if (feedbackTitle) feedbackTitle.innerHTML = '<span class="text-success"><i class="fa-solid fa-circle-check"></i> Correct Choice!</span>';
      } else {
        btn.classList.add('wrong-choice');
        // Also highlight the correct answer
        const correctBtn = gameChoicesGrid.querySelector(`.choice-btn[data-category="${q.correctCategory}"]`);
        if (correctBtn) correctBtn.classList.add('correct-choice');
        gameStreak = 0;
        playWrongTone();

        if (feedbackIcon) feedbackIcon.className = 'feedback-icon wrong';
        if (feedbackTitle) feedbackTitle.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-xmark"></i> Not Quite!</span> Belongs in: <strong>${q.categoryName}</strong>`;
      }

      // Update score display
      if (gameScoreEl) gameScoreEl.textContent = gameScore;
      if (gameStreakEl) gameStreakEl.textContent = `${gameStreak} 🔥`;

      // Update explanation
      if (feedbackExplanation) feedbackExplanation.textContent = q.explanation;
      if (gameFeedbackBanner) gameFeedbackBanner.classList.remove('hidden');

      // Disable all choices
      const allBtns = gameChoicesGrid.querySelectorAll('.choice-btn');
      allBtns.forEach(b => b.disabled = true);
    });
  }

  // Next Question Button
  if (gameNextBtn) {
    gameNextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < gameQuestions.length - 1) {
        currentQuestionIndex++;
        loadGameQuestion(currentQuestionIndex);
      } else {
        // Game Over!
        showGameOver();
      }
    });
  }

  function showGameOver() {
    if (gameCard) gameCard.classList.add('hidden');
    if (gameOverPanel) gameOverPanel.classList.remove('hidden');
    if (finalScoreEl) finalScoreEl.textContent = gameScore;

    if (finalFeedbackMsg) {
      if (gameScore >= 90) {
        finalFeedbackMsg.textContent = '🌟 Master Eco-Warrior! Your sorting accuracy matches an industrial deep-learning CNN!';
      } else if (gameScore >= 60) {
        finalFeedbackMsg.textContent = '🌿 Great job! You have solid waste segregation skills. A little more practice and you will achieve zero-landfill status!';
      } else {
        finalFeedbackMsg.textContent = '🌱 Good attempt! Explore the How It Works and Classifier sections above to sharpen your sorting knowledge!';
      }
    }
    playSuccessTone();
  }

  function resetGame() {
    currentQuestionIndex = 0;
    gameScore = 0;
    gameStreak = 0;
    if (gameScoreEl) gameScoreEl.textContent = '0';
    if (gameStreakEl) gameStreakEl.textContent = '0 🔥';
    if (gameCard) gameCard.classList.remove('hidden');
    if (gameOverPanel) gameOverPanel.classList.add('hidden');
    loadGameQuestion(0);
    showToast('Game restarted. Good luck!');
  }

  if (gameRestartBtn) gameRestartBtn.addEventListener('click', resetGame);
  if (playAgainBtn) playAgainBtn.addEventListener('click', resetGame);

  // Initialize first game question
  loadGameQuestion(0);

  // =========================================================================
  // 7. Interactive How-It-Works Step Highlighter
  // =========================================================================
  const pipelineSteps = document.querySelectorAll('.pipeline-step');
  pipelineSteps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      pipelineSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });

  // =========================================================================
  // 8. Animated Counter Trigger on Scroll (Intersection Observer)
  // =========================================================================
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersectObserver || entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-counter'));
          animateCounter(el, targetNum);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, target) {
    let current = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    const isFloat = target % 1 !== 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isFloat ? `${current.toFixed(1)}%` : `${Math.floor(current)}+`;
    }, stepTime);
  }

  console.log('✅ EcoSort AI Smart Waste Management System successfully initialized.');
});
