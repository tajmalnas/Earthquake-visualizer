# 🌍 Earthquake Visualizer & AI Assistant

A real-time earthquake monitoring web application with AI-powered insights, built with **React** and **Gemini AI**.
Visualize seismic activity worldwide and get intelligent analysis of earthquake patterns.

---

## 🚀 Live Demo

[👉 Click here to view the live demo](https://earthquake-visualizer-eight-coral.vercel.app/)

---

## ✨ Features

### 🗺️ Real-time Visualization

* **Interactive Map:** Leaflet-powered world map with real-time earthquake plotting
* **Custom Markers:** Size and color-coded markers based on earthquake magnitude
* **Live Data:** Automatic updates from USGS Earthquake API every 5 minutes
* **Popup Details:** Click markers for detailed earthquake information

### 🤖 AI-Powered Insights

* **Chat Interface:** Conversational AI assistant for earthquake analysis
* **Smart Questions:** Pre-built quick questions for common analyses
* **JSON Data Panel:** Toggleable raw data view with formatted statistics
* **Pattern Recognition:** AI identifies seismic trends and regional activity

### 📊 Advanced Analytics

* **Real-time Statistics:** Total earthquakes, magnitude range, significant events
* **Filtering System:** Filter by magnitude and time range
* **Mobile Responsive:** Optimized for all device sizes
* **Activity Indicators:** Visual activity level indicators

### 🎨 Beautiful UI/UX

* **Modern Design:** Clean, professional interface with gradient accents
* **Smooth Animations:** Loading states and interactive transitions
* **Responsive Layout:** Adaptive design for desktop and mobile
* **Color-coded System:** Intuitive magnitude-based color scheme

---

## 🛠️ Technology Stack

| Technology                  | Purpose                       |
| --------------------------- | ----------------------------- |
| **React 18**                | Frontend framework            |
| **Tailwind CSS**            | Styling and responsive design |
| **Leaflet / React-Leaflet** | Interactive maps              |
| **Google Gemini AI**        | AI-powered insights           |
| **USGS Earthquake API**     | Real-time earthquake data     |
| **Vite**                    | Build tool and dev server     |

---

## 📦 Installation

### Prerequisites

* Node.js 16+
* npm or yarn
* Google Gemini API key

### Setup Instructions

**1. Clone the repository**

```bash
git clone https://github.com/tajmalnas/Earthquake-visualizer.git
cd earthquake-visualizer
```

**2. Install dependencies**

```bash
npm install
```

**3. Environment Configuration**
Create a `.env` file in the root directory:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**4. Get Gemini API Key**

* Visit [Google AI Studio](https://aistudio.google.com/)
* Sign in with your Google account
* Create a new API key
* Add it to your `.env` file

**5. Run the development server**

```bash
npm run dev
```

**6. Build for production**

```bash
npm run build
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── MapView.jsx
│   ├── GeminiInsights.jsx
│   ├── FilterBar.jsx
│   ├── StatsPanel.jsx
│   └── EarthquakePopup.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🎯 Component Overview

### **MapView.jsx**

* Renders interactive Leaflet map
* Plots earthquakes with custom markers
* Handles map interactions and popups
* Responsive design for all screen sizes

### **GeminiInsights.jsx**

* AI chat interface with message history
* Quick question buttons for common queries
* JSON data panel toggle
* Real-time earthquake data analysis

### **FilterBar.jsx**

* Magnitude slider (M0 to M7+)
* Time range filters (1h, 6h, 24h, All)
* Clear filters functionality
* Visual magnitude legend

### **StatsPanel.jsx**

* Real-time earthquake statistics
* Activity level indicators
* Significant event tracking
* Mobile-optimized layout

---

## 🔧 API Integration

### **USGS Earthquake API**

Endpoint for last 24 hours of data:
[https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson)

**Data includes:**

* Magnitude, location, depth, time
* Geographic coordinates
* Significance scores
* Tsunami alerts

### **Gemini AI Integration**

* Uses **Gemini 2.0 Flash** for fast responses
* Processes earthquake data for insights
* Provides conversational analysis
* Error handling for API failures

---

## 🎨 Customization

### **Color Scheme**

```css
/* Magnitude Colors */
M0–2.9: Green (minor activity)
M3–4.9: Orange (light activity)
M5+: Red (moderate to major activity)

/* UI Colors */
Primary: Blue gradient (#3B82F6 → #1D4ED8)
Secondary: Purple accents (#8B5CF6)
Background: Gray gradients for depth
```

### **Adding New Features**

* **New Map Layers:** Extend `MapView.jsx` with additional Leaflet layers
* **Additional Filters:** Modify `FilterBar.jsx` for new filter types
* **Custom AI Prompts:** Update prompts in `GeminiInsights.jsx`
* **New Visualizations:** Add chart components to `StatsPanel.jsx`

---

## 📱 Mobile Optimization

* Touch-friendly interface elements
* Responsive grid layout adapts to screen size
* Optimized markers for mobile viewing
* Collapsible panels for better space usage
* Mobile-first CSS approach

---

## 🚀 Deployment

### **Netlify (Recommended)**

```bash
npm run build
```

Drag the `dist` folder to Netlify and add your environment variable:

```
VITE_GEMINI_API_KEY
```

### **Vercel**

```bash
npm install -g vercel
vercel --prod
```

### **GitHub Pages**

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

---

## 🔍 Usage Examples

### **For Geography Students**

* Pattern Analysis: *“Which regions show clustered activity?”*
* Trend Identification: *“Is seismic activity increasing today?”*
* Impact Assessment: *“Are there any significant tsunami threats?”*

### **For Researchers**

* Data Export: Use JSON panel to export current statistics
* Comparative Analysis: Filter by time and magnitude ranges
* Regional Studies: Focus on specific geographic areas

**Quick Questions Available:**

* “Where was the strongest earthquake?”
* “Show me recent significant activity”
* “What regions are most active?”
* “Analyze today's seismic trends”
* “Any tsunami threats?”

---

## 🐛 Troubleshooting

| Issue                        | Possible Fix                                                          |
| ---------------------------- | --------------------------------------------------------------------- |
| **Map not loading?**         | Check Leaflet CSS import, verify internet connection, inspect console |
| **AI insights not working?** | Verify `VITE_GEMINI_API_KEY`, check API quota, inspect console        |
| **Data not updating?**       | USGS API may be down, check network connectivity or CORS settings     |

---

## 🤝 Contributing

We welcome contributions!

1. **Fork** the repository
2. **Create a branch:**

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes:**

   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push branch:**

   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* [US Geological Survey](https://earthquake.usgs.gov/) for real-time earthquake data
* [Google Gemini AI](https://aistudio.google.com/) for natural language insights
* [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/) for mapping
* [Tailwind CSS](https://tailwindcss.com/) for utility-first design


<div align="center">

**Built with ❤️ for the geography community**
*Making seismic data accessible and understandable for everyone.*

</div>
