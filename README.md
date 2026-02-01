# 🚀 AstraPatch

> **Real-Time Space Exploration Monitoring System**

[![Deploy Status](https://github.com/yourusername/astrapatch/workflows/Deploy%20AstraPatch%20to%20GitHub%20Pages/badge.svg)](https://github.com/yourusername/astrapatch/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://yourusername.github.io/astrapatch)

AstraPatch is a comprehensive real-time space exploration monitoring system featuring animated starfield canvas, live satellite tracking, rocket launch countdowns, solar activity monitoring, and stunning cyberpunk aesthetics.

## ✨ Features

### 🛰️ Live Tracking
- **ISS Position** - Real-time International Space Station tracking with 2D Earth visualization
- **Satellite Monitoring** - Track multiple satellites with live orbital data
- **Station Crew** - Current ISS crew members with photos and mission details
- **Spacewalks** - Upcoming EVA schedules and crew assignments

### 🚀 Launch Tracking
- **Live Countdowns** - Real-time countdowns for upcoming rocket launches
- **Success Probability** - Launch success rates and mission details
- **Provider Filtering** - Filter by SpaceX, NASA, or other providers
- **Launch Windows** - Instantaneous and windowed launch times

### ☀️ Solar Activity
- **Solar Flares** - Real-time X-ray emissions monitoring
- **CME Tracking** - Coronal Mass Ejection detection
- **Geomagnetic Storms** - Earth's magnetic field disturbances with Kp index
- **30-Day History** - Complete month of solar activity data

### 🌌 Celestial Events
- **Near-Earth Asteroids** - 7-day approach predictions with hazard ratings
- **Mars Weather** - Historical Martian atmospheric conditions
- **Meteor Showers** - Annual meteor shower calendar with peak dates
- **Moon Phases** - Current lunar phase with illumination percentage

### 🎨 Visual Experience
- **Animated Starfield** - 800 parallax stars with depth simulation
- **Floating Planets** - Three animated planets with orbital mechanics
- **Shooting Stars** - Periodic meteor streaks across the sky
- **Pulsing Nebulas** - Atmospheric background effects
- **Cyberpunk Theme** - Neon colors with glitch effects
- **Loading Screen** - Professional progress tracking

### ⚡ Performance
- **Progressive Loading** - Components load incrementally
- **Skeleton Loaders** - Visual feedback during data fetch
- **60fps Canvas** - Optimized starfield rendering
- **Error Boundaries** - Graceful API failure handling
- **Responsive Design** - Mobile, tablet, and desktop support

## 🎮 Interactive Features

### Keyboard Shortcuts
- `L` - Jump to Launches section
- `I` - Jump to ISS Tracker
- `S` - Jump to Solar Events
- `↑↑↓↓←→←→BA` - Secret Konami Code! 🎯

### Live Elements
- **Mission Control Clock** - Real-time UTC display
- **Scroll to Top** - Rocket button for quick navigation
- **Quick Access** - Jump to any section instantly
- **Live Stats** - Dynamic counters for launches and events

## 🛠️ Tech Stack

- **Vanilla JavaScript** (ES6+) - No frameworks, pure performance
- **Canvas API** - Animated starfield and ISS tracker
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Custom Properties** - Dynamic theming
- **NASA APIs** - DONKI, NEO, APOD integration
- **The Space Devs** - Launch and crew data
- **Where The ISS At** - Real-time satellite positions

## 🚀 Quick Start

### Option 1: Direct Download
```bash
# Clone the repository
git clone https://github.com/yourusername/astrapatch.git

# Open in browser
cd astrapatch
open index.html
```

### Option 2: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / root
5. Save and wait for deployment
6. Visit `https://yourusername.github.io/astrapatch`

### Option 3: Local Development
```bash
# Serve with Python
python -m http.server 8000

# Or with Node.js
npx http-server
```

## 📡 API Setup

### Get Your NASA API Key (Free!)
1. Visit [api.nasa.gov](https://api.nasa.gov)
2. Generate your API key
3. Replace `DEMO_KEY` in `script.js` with your key:

```javascript
// Find and replace all instances:
api_key=DEMO_KEY
// With:
api_key=YOUR_API_KEY_HERE
```

### API Sources
- **NASA DONKI** - Solar activity data
- **NASA NEO** - Near-Earth asteroid tracking
- **NASA APOD** - Astronomy picture of the day
- **The Space Devs** - Launch and crew information
- **Where The ISS At** - Satellite position tracking

## 🎨 Customization

### Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #00f7ff;    /* Cyan */
    --secondary: #ff00ff;  /* Magenta */
    --accent: #7000ff;     /* Purple */
    --dark: #0a0e27;       /* Dark blue */
}
```

### Starfield Density
Adjust in `script.js`:
```javascript
const numStars = 800; // Increase for more stars
```

## 📦 GitHub Actions Workflow

This project includes automated deployment to GitHub Pages:

```yaml
# .github/workflows/deploy.yml
name: Deploy AstraPatch to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:
```

The workflow automatically deploys on every push to main branch!

## 🌟 Cool Features to Try

1. **Konami Code** - Type ↑↑↓↓←→←→BA for a surprise
2. **Keyboard Navigation** - Use L, I, S shortcuts
3. **Scroll to Top** - Click the rocket in bottom-right
4. **Live Clock** - Watch Mission Control Time
5. **Filter Launches** - Click SpaceX, NASA, or Other
6. **Tab Switching** - Switch between ISS, Satellites, Crew, Spacewalks

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Add more satellite tracking
- [ ] Implement launch notifications
- [ ] Create 3D Earth visualization with Three.js
- [ ] Add historical launch database
- [ ] Integrate live ISS camera feeds
- [ ] Add aurora forecast
- [ ] Implement user favorites system
- [ ] Add data export functionality

### Development
```bash
# Fork and clone
git clone https://github.com/yourusername/astrapatch.git

# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 📜 License

MIT License - feel free to use for any project!

## 🙏 Credits

- **Built by**: Binxix
- **APIs**: NASA, The Space Devs, Where The ISS At
- **Inspired by**: Space exploration and cyberpunk aesthetics
- **For**: Space enthusiasts worldwide 🌍🚀

## 📬 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Issues**: [Report a bug](https://github.com/yourusername/astrapatch/issues)
- **Discussions**: [Join the conversation](https://github.com/yourusername/astrapatch/discussions)

---

<div align="center">

**⭐ Star this repo if you like it! ⭐**

Made with 💙 and ☕ for space exploration

[Live Demo](https://yourusername.github.io/astrapatch) | [Report Bug](https://github.com/yourusername/astrapatch/issues) | [Request Feature](https://github.com/yourusername/astrapatch/issues)

</div>
