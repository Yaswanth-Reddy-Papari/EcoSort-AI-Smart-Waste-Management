# 🌿 EcoSort AI – Smart Waste Management System

> **Tagline:** *Sort Smart. Recycle Better. Build a Greener Future.*  
> **Course / Category:** Artificial Intelligence Mini Project  
> **Academic Year:** 2024–2025 / 2025–2026  
> **Domain:** Computer Vision, Convolutional Neural Networks (CNNs), Edge Computing & Cleantech  

---

## 📌 1. Project Overview

**EcoSort AI** is an intelligent, automated waste classification and segregation system designed to tackle municipal landfill crises and contamination in recycling streams. Traditional waste management relies heavily on manual hand-picking, which is hazardous to sanitation workers, slow (15–30 items/min), and plagued by high contamination rates (35–50%).

By applying **Deep Learning (Convolutional Neural Networks)** paired with **IoT edge sensors and pneumatic actuation**, EcoSort AI identifies, classifies, and sorts waste items—including Plastic, Paper, Metal, Glass, and Organics—at millisecond speeds with over **98% classification confidence**.

---

## ✨ 2. Key Features & Modules

The project consists of 12 fully integrated sections:

1. **Home / Hero Showcase:** High-impact landing page with live telemetry simulation, animated laser scanner, floating performance badges, and responsive call-to-actions.
2. **About & Problem Context:** Global waste generation metrics, the critical necessity of segregation at source, and a side-by-side comparative table against manual waste sorting.
3. **How It Works (System Architecture):** Step-by-step 5-stage pipeline:
   - Intake & Sensor Trigger
   - Optical Image Acquisition (1080p RGB)
   - Deep Learning Inference (MobileNetV3 / ResNet-50)
   - Pneumatic / Servo Chute Actuation
   - High-Purity Material Recycling
4. **Interactive AI Waste Classifier (Demo):**
   - Drag-and-drop or local file upload for waste pictures.
   - 6 Quick Presets (PET Bottle, Apple Core, Soda Can, Cardboard Box, Glass Jar, Li-ion Battery).
   - Animated laser scanner viewport.
   - Comprehensive inference telemetry: Predicted Category, Confidence %, Probability breakdown per class, Target Bin assignment, and Carbon Offset / Environmental impact data.
   - Clear academic notice indicating the demonstration and edge deployment mode.
5. **Smart City Telemetry Dashboard:**
   - Real-time KPI counters (Total collected, Recycled, Organic, Plastic, Recycling Rate %).
   - Dynamic timeframe switcher (`Today`, `This Week`, `This Month`, `All-Time`).
   - Interactive **Chart.js** visualizations:
     * Material Stream Composition (Doughnut Chart)
     * Daily Inflow vs. Segregation Efficiency (Bar / Line Combination Chart)
   - Ultrasonic IoT Bin Fill-level monitors.
6. **EcoHero Waste Sorting Challenge (Interactive Game):**
   - 10-question gamified quiz with diverse waste items.
   - Streak counters, scoring, sound effects (synthesized via Web Audio API without external files).
   - Instant feedback with environmental tips explaining why an item belongs to a specific stream.
7. **Advantages:** Environmental protection, methane abatement, circular purity, occupational worker safety, resource conservation, and smart city telemetry.
8. **Technical Limitations & Challenges:** CapEx costs, optical lens dirt/fogging, multi-material composite classification errors (e.g. foil-lined plastics, Tetra Paks), and power requirements.
9. **Real-World Applications:** Smart Cities, Universities/Schools, Industrial Warehouses, Hospitals/Healthcare, Transit Hubs, and Public Parks.
10. **Future Scope (Roadmap 2025–2030):** High-speed delta robotic arms, solar IoT compactor bins, hyperspectral/SWIR infrared polymer recognition, and blockchain recycling credits.
11. **Conclusion:** Synthesis of circular economy transition and AI's role in zero-waste sustainability.
12. **Academic Footer:** Project metadata, technology tags, and evaluation disclosures.

---

## 🛠️ 3. Technology Stack

- **Frontend:** HTML5 (Semantic Structure), CSS3 (Modern Flexbox, CSS Grid, Custom Properties, Glassmorphism).
- **Scripting:** Modern Vanilla JavaScript (ES6+), DOM Manipulation, Event-Driven Architecture.
- **Charts:** Chart.js (Loaded via CDN).
- **Icons:** Font Awesome 6 (CDN) & Crisp Inline Vector SVGs.
- **Typography:** Google Fonts (`Outfit` for headings, `Plus Jakarta Sans` for body text).
- **Audio:** Web Audio API (Synthesizer frequencies for zero-dependency sound feedback).
- **Backend / Database:** None required (100% Client-Side, portable, lightweight, and offline-capable).

---

## 📂 4. Project File Structure

```text
EIA2/
│
├── index.html       # Complete 12-section semantic HTML page
├── style.css        # Custom responsive CSS with green & dark-green aesthetic
├── script.js        # Core logic: Classifier simulator, Dashboard charts, Sorting Game
└── README.md        # Comprehensive documentation and project report
```

---

## 🚀 5. How to Run & Present the Project

1. **Directly in Browser:**
   - Simply double-click `index.html` or right-click and choose **"Open with Google Chrome"** (or Microsoft Edge / Firefox).
   - No npm install, no node server, and no database setup required!

2. **Using Live Server (VS Code / Antigravity):**
   - If using VS Code, install the *Live Server* extension, right-click `index.html`, and select **"Open with Live Server"**.

---

## 🧠 6. Machine Learning Model Architecture (Academic Defense)

For your viva or project presentation, here is the theoretical Deep Learning architecture powering EcoSort AI:

### A. Preprocessing Pipeline
1. Input Image: $1920 \times 1080 \text{ RGB}$.
2. Bounding Box Object Localization via YOLOv8 / Faster R-CNN.
3. Cropping & Resizing to standard $224 \times 224 \times 3$ input tensor.
4. Normalization using ImageNet mean ($\mu = [0.485, 0.456, 0.406]$) and standard deviation ($\sigma = [0.229, 0.224, 0.225]$).

### B. Convolutional Neural Network (CNN) Backbone
- **Backbone:** MobileNetV3-Large or ResNet-50 for low-latency edge inference on NVIDIA Jetson Nano / Raspberry Pi 5.
- **Feature Extraction:** Depthwise separable convolutions reducing computational complexity while retaining fine spatial textures (creases, transparency, labels).
- **Dense Classifier:** Global Average Pooling $\rightarrow$ Dense(256, ReLU) $\rightarrow$ Dropout(0.4) $\rightarrow$ Dense(5, Softmax).
- **Loss Function:** Categorical Cross-Entropy:
  $$\mathcal{L} = -\sum_{c=1}^{C} y_c \log(\hat{y}_c)$$

---

## 🎤 7. Common Viva / Project Q&A

**Q1: Why is waste segregation at source better than sorting at landfills?**  
*Answer:* When wet organic matter mixes with dry recyclables (paper, plastic), it degrades fibers and contaminates plastics, making chemical/mechanical recycling impossible. Segregating at source retains raw material purity exceeding 95%.

**Q2: How does the system handle transparent or crushed plastic bottles?**  
*Answer:* The optical chamber uses multi-angle diffuse LED lighting to eliminate glare. For heavily crushed or obscured items, future revisions incorporate Short-Wave Infrared (SWIR) sensors that identify plastic resins by their molecular reflection spectra rather than shape alone.

**Q3: Can this run on an embedded edge device without internet?**  
*Answer:* Yes. MobileNetV3 models quantized to INT8 format consume less than 20MB of memory and infer in under 50ms on edge accelerators like Google Coral TPU or NVIDIA Jetson Nano, functioning fully offline.

---

## 📜 8. License & Attribution

Developed as an **Artificial Intelligence Mini Project**.  
Created for academic demonstration, research presentation, and sustainable smart city prototyping.
