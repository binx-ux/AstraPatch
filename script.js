// Enhanced Loading Screen
let loadingProgress = 0;
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.querySelector('.loading-progress-bar');
const loadingText = document.querySelector('.loading-text');

const loadingMessages = [
    "Initializing Space Tracking Systems...",
    "Connecting to Satellite Networks...",
    "Loading Orbital Data...",
    "Syncing with NASA APIs...",
    "Establishing ISS Link...",
    "Ready for Launch!"
];

function updateLoadingProgress(progress) {
    loadingProgress = Math.min(progress, 100);
    if (loadingBar) {
        loadingBar.style.width = loadingProgress + '%';
    }
    const messageIndex = Math.floor((loadingProgress / 100) * (loadingMessages.length - 1));
    if (loadingText) {
        loadingText.textContent = loadingMessages[messageIndex];
    }
}

function hideLoadingScreen() {
    updateLoadingProgress(100);
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 500);
}

// Animated Starfield Canvas
const starfieldCanvas = document.getElementById('starfield');
const starfieldCtx = starfieldCanvas ? starfieldCanvas.getContext('2d') : null;

class Star {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * (starfieldCanvas?.width || window.innerWidth);
        this.y = Math.random() * (starfieldCanvas?.height || window.innerHeight);
        this.z = Math.random() * 1000;
        this.speed = Math.random() * 0.5 + 0.2;
        this.size = Math.random() * 2;
    }
    
    update() {
        this.z -= this.speed;
        if (this.z <= 0) {
            this.reset();
            this.z = 1000;
        }
    }
    
    draw() {
        if (!starfieldCanvas || !starfieldCtx) return;
        
        const x = (this.x - starfieldCanvas.width / 2) * (1000 / this.z);
        const y = (this.y - starfieldCanvas.height / 2) * (1000 / this.z);
        const s = this.size * (1000 / this.z);
        
        const centerX = starfieldCanvas.width / 2;
        const centerY = starfieldCanvas.height / 2;
        
        const screenX = x + centerX;
        const screenY = y + centerY;
        
        if (screenX >= 0 && screenX <= starfieldCanvas.width && 
            screenY >= 0 && screenY <= starfieldCanvas.height) {
            const brightness = 1 - (this.z / 1000);
            starfieldCtx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
            starfieldCtx.beginPath();
            starfieldCtx.arc(screenX, screenY, Math.max(s, 0.5), 0, Math.PI * 2);
            starfieldCtx.fill();
        }
    }
}

let stars = [];
const numStars = 800;

function initStarfield() {
    if (!starfieldCanvas || !starfieldCtx) return;
    
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
    
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
    
    animateStarfield();
}

function animateStarfield() {
    if (!starfieldCanvas || !starfieldCtx) return;
    
    starfieldCtx.fillStyle = 'rgba(5, 8, 20, 0.1)';
    starfieldCtx.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animateStarfield);
}

window.addEventListener('resize', () => {
    if (starfieldCanvas) {
        starfieldCanvas.width = window.innerWidth;
        starfieldCanvas.height = window.innerHeight;
    }
});

// Initialize starfield
initStarfield();

// Sound effects
const hoverSound = document.getElementById('hoverSound');
const clickSound = document.getElementById('clickSound');

document.querySelectorAll('.nav-link, .filter-btn, .tab-btn').forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        }
    });
    element.addEventListener('click', () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    });
});

// Launch data fetching
async function fetchLaunches() {
    const launchesGrid = document.getElementById('launchesGrid');
    const launchCount = document.getElementById('launchCount');
    
    if (!launchesGrid) return;
    
    try {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?mode=detailed&limit=20');
        const data = await response.json();
        
        if (launchCount) launchCount.textContent = data.count || 0;
        
        launchesGrid.innerHTML = '';
        
        const confirmedLaunches = data.results.filter(launch => {
            return launch.status && launch.status.id !== 8;
        });
        
        confirmedLaunches.slice(0, 12).forEach((launch, index) => {
            const card = createLaunchCard(launch);
            card.style.animationDelay = `${index * 0.1}s`;
            launchesGrid.appendChild(card);
        });
        
        setInterval(updateCountdowns, 1000);
        
    } catch (error) {
        console.error('Error fetching launches:', error);
        launchesGrid.innerHTML = '<p style="text-align: center; color: var(--gray); grid-column: 1/-1;">Unable to load launch data. Please check your connection.</p>';
    }
}

function createLaunchCard(launch) {
    const card = document.createElement('div');
    card.className = 'launch-card';
    card.dataset.provider = (launch.launch_service_provider?.name || '').toLowerCase();
    
    const statusClass = launch.status?.id === 1 ? 'status-go' : 
                       launch.status?.id === 2 ? 'status-tbd' : 'status-hold';
    
    const provider = launch.launch_service_provider?.name || 'Unknown';
    const probability = launch.probability ? `${launch.probability}%` : 'TBD';
    
    card.innerHTML = `
        <div class="launch-header">
            <div>
                <div class="launch-name">${launch.name || 'Unknown Mission'}</div>
                <div class="launch-provider">${provider}</div>
            </div>
            <div class="launch-status ${statusClass}">${launch.status?.abbrev || 'TBD'}</div>
        </div>
        <div class="launch-details">
            <div class="launch-detail">
                <span>Mission:</span>
                <span>${launch.mission?.name || 'Classified'}</span>
            </div>
            <div class="launch-detail">
                <span>Location:</span>
                <span>${launch.pad?.location?.name || 'Unknown'}</span>
            </div>
            <div class="launch-detail">
                <span>Rocket:</span>
                <span>${launch.rocket?.configuration?.name || 'Unknown'}</span>
            </div>
            <div class="launch-detail">
                <span>Success Rate:</span>
                <span>${probability}</span>
            </div>
        </div>
        <div class="countdown">
            <div class="countdown-label">T-Minus</div>
            <div class="countdown-time" data-launch-time="${launch.net || launch.window_start}">Calculating...</div>
        </div>
    `;
    
    return card;
}

function updateCountdowns() {
    document.querySelectorAll('.countdown-time').forEach(element => {
        const launchTime = new Date(element.dataset.launchTime);
        const now = new Date();
        const diff = launchTime - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            element.textContent = 'LAUNCHED';
            element.style.color = '#00ff00';
        }
    });
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        document.querySelectorAll('.launch-card').forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const provider = card.dataset.provider;
                card.style.display = provider.includes(filter) ? 'block' : 'none';
            }
        });
    });
});

// ISS Tracking
let issCanvas, issCtx;
let issLat = 0, issLon = 0;

async function initISSTracking() {
    issCanvas = document.getElementById('earthCanvas');
    if (!issCanvas) return;
    
    issCtx = issCanvas.getContext('2d');
    issCanvas.width = 500;
    issCanvas.height = 500;
    
    fetchISSPosition();
    setInterval(fetchISSPosition, 5000);
}

async function fetchISSPosition() {
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!response.ok) throw new Error('ISS API error');
        
        const data = await response.json();
        
        issLat = parseFloat(data.latitude);
        issLon = parseFloat(data.longitude);
        
        const latEl = document.getElementById('issLat');
        const lonEl = document.getElementById('issLon');
        const altEl = document.getElementById('issAlt');
        const velEl = document.getElementById('issVel');
        
        if (latEl) latEl.textContent = issLat.toFixed(4) + '°';
        if (lonEl) lonEl.textContent = issLon.toFixed(4) + '°';
        if (altEl) altEl.textContent = data.altitude.toFixed(2) + ' km';
        if (velEl) velEl.textContent = data.velocity.toFixed(2) + ' km/h';
        
        drawEarth();
        getLocationName(issLat, issLon);
        
    } catch (error) {
        console.error('Error fetching ISS position:', error);
    }
}

function drawEarth() {
    if (!issCtx || !issCanvas) return;
    
    const centerX = issCanvas.width / 2;
    const centerY = issCanvas.height / 2;
    const radius = 200;
    
    issCtx.clearRect(0, 0, issCanvas.width, issCanvas.height);
    
    const gradient = issCtx.createRadialGradient(centerX - 50, centerY - 50, 20, centerX, centerY, radius);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(0.7, '#2E5C8A');
    gradient.addColorStop(1, '#1A3A5C');
    
    issCtx.fillStyle = gradient;
    issCtx.beginPath();
    issCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    issCtx.fill();
    
    issCtx.strokeStyle = 'rgba(0, 247, 255, 0.3)';
    issCtx.lineWidth = 1;
    
    for (let lat = -60; lat <= 60; lat += 30) {
        const y = centerY - (lat / 90) * radius;
        issCtx.beginPath();
        issCtx.arc(centerX, centerY, Math.abs(centerY - y), 0, 2 * Math.PI);
        issCtx.stroke();
    }
    
    for (let lon = 0; lon < 360; lon += 30) {
        issCtx.beginPath();
        issCtx.moveTo(centerX, centerY - radius);
        issCtx.lineTo(centerX, centerY + radius);
        issCtx.save();
        issCtx.translate(centerX, centerY);
        issCtx.rotate((lon * Math.PI) / 180);
        issCtx.translate(-centerX, -centerY);
        issCtx.stroke();
        issCtx.restore();
    }
    
    const x = centerX + (issLon / 180) * radius;
    const y = centerY - (issLat / 90) * radius;
    
    issCtx.fillStyle = '#00ff00';
    issCtx.beginPath();
    issCtx.arc(x, y, 8, 0, 2 * Math.PI);
    issCtx.fill();
    
    issCtx.strokeStyle = '#00ff00';
    issCtx.lineWidth = 2;
    issCtx.stroke();
    
    issCtx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    issCtx.lineWidth = 3;
    issCtx.beginPath();
    issCtx.arc(x, y, 15, 0, 2 * Math.PI);
    issCtx.stroke();
}

function getLocationName(lat, lon) {
    const locationEl = document.getElementById('issLocation');
    if (!locationEl) return;
    
    if (Math.abs(lat) < 60) {
        locationEl.textContent = `Currently over coordinates ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    } else {
        locationEl.textContent = `Currently over polar region at ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
}

// Satellite Tracking
async function fetchSatellites() {
    const grid = document.getElementById('satelliteGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        
        const card = document.createElement('div');
        card.className = 'satellite-card';
        card.innerHTML = `
            <div class="satellite-name">International Space Station</div>
            <div class="satellite-data">
                <div class="satellite-data-row">
                    <span>Latitude:</span>
                    <span>${data.latitude.toFixed(4)}°</span>
                </div>
                <div class="satellite-data-row">
                    <span>Longitude:</span>
                    <span>${data.longitude.toFixed(4)}°</span>
                </div>
                <div class="satellite-data-row">
                    <span>Altitude:</span>
                    <span>${data.altitude.toFixed(2)} km</span>
                </div>
                <div class="satellite-data-row">
                    <span>Velocity:</span>
                    <span>${data.velocity.toFixed(2)} km/h</span>
                </div>
                <div class="satellite-data-row">
                    <span>Visibility:</span>
                    <span>${data.visibility}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    } catch (error) {
        console.error('Error fetching satellite:', error);
    }
    
    const placeholders = [
        { name: 'Hubble Space Telescope', info: 'Orbiting at ~540 km altitude' },
        { name: 'Starlink Constellation', info: 'Thousands of satellites in LEO' },
        { name: 'James Webb Space Telescope', info: 'Located at L2 Lagrange point' }
    ];
    
    placeholders.forEach(sat => {
        const card = document.createElement('div');
        card.className = 'satellite-card';
        card.innerHTML = `
            <div class="satellite-name">${sat.name}</div>
            <div class="satellite-data">
                <p style="color: var(--gray); text-align: center; padding: 2rem;">${sat.info}<br><br>Live tracking data not available</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Crew Info
async function fetchCrewInfo() {
    const grid = document.getElementById('crewGrid');
    if (!grid) return;
    
    try {
        grid.innerHTML = '';
        
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/astronaut/?on_iss=true&limit=20');
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(astronaut => {
                const card = document.createElement('div');
                card.className = 'crew-card';
                card.innerHTML = `
                    <img src="${astronaut.profile_image || 'https://via.placeholder.com/150'}" 
                         alt="${astronaut.name}" 
                         class="crew-photo"
                         onerror="this.src='https://via.placeholder.com/150'">
                    <div class="crew-name">${astronaut.name}</div>
                    <div class="crew-agency">${astronaut.agency?.name || 'Unknown Agency'}</div>
                    <div class="crew-launch-date">Current crew member</div>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="text-align: center; color: var(--gray); grid-column: 1/-1;">No crew data available.</p>';
        }
        
    } catch (error) {
        console.error('Error fetching crew:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--gray); grid-column: 1/-1;">Unable to load crew data.</p>';
    }
}

// Spacewalks
async function fetchSpacewalks() {
    const list = document.getElementById('spacewalksList');
    if (!list) return;
    
    try {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/spacewalk/upcoming/?limit=10');
        const data = await response.json();
        
        list.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(eva => {
                const item = document.createElement('div');
                item.className = 'spacewalk-item';
                item.innerHTML = `
                    <div class="spacewalk-title">${eva.name || 'Extravehicular Activity'}</div>
                    <div class="spacewalk-date">${new Date(eva.start).toLocaleString()}</div>
                    <div class="spacewalk-astronauts">Crew: ${eva.crew?.map(c => c.astronaut.name).join(', ') || 'TBA'}</div>
                    <div class="spacewalk-duration">Duration: ${eva.duration || 'TBD'}</div>
                `;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = '<p style="text-align: center; color: var(--gray);">No upcoming spacewalks scheduled.</p>';
        }
        
    } catch (error) {
        console.error('Error fetching spacewalks:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--gray);">Unable to load spacewalk data.</p>';
    }
}

// Solar Events
async function fetchSolarEvents() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    try {
        const results = await Promise.all([
            fetchSolarFlares(formatDate(startDate), formatDate(today)),
            fetchCMEEvents(formatDate(startDate), formatDate(today)),
            fetchGeoStorms(formatDate(startDate), formatDate(today))
        ]);
        
        let totalEvents = 0;
        results.forEach(count => {
            if (typeof count === 'number') totalEvents += count;
        });
        
        const activeEl = document.getElementById('activeEvents');
        if (activeEl) activeEl.textContent = totalEvents;
    } catch (error) {
        console.error('Error fetching solar events:', error);
        const activeEl = document.getElementById('activeEvents');
        if (activeEl) activeEl.textContent = '0';
    }
}

async function fetchSolarFlares(startDate, endDate) {
    const container = document.getElementById('solarFlares');
    if (!container) return 0;
    
    try {
        const response = await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=eWHlo7GJ3vq2POhcO59dFYNmTMpI5p89P4E4WjSW`);
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">☀️</div>
                    <p style="color: var(--gray);">No recent solar flare activity detected.</p>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-top: 0.5rem;">The sun is currently calm.</p>
                </div>
            `;
            return 0;
        }
        
        // Add sun visual at top
        const sunHeader = document.createElement('div');
        sunHeader.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
        sunHeader.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.8));">☀️</div>
            <div style="color: var(--primary); font-size: 0.9rem;">${data.length} Recent Flares</div>
        `;
        container.appendChild(sunHeader);
        
        data.slice(0, 5).forEach(flare => {
            const event = document.createElement('div');
            event.className = 'solar-event';
            event.innerHTML = `
                <div class="solar-event-title">🔥 Class ${flare.classType} Flare</div>
                <div class="solar-event-time">${new Date(flare.beginTime).toLocaleString()}</div>
                <div class="solar-event-details">
                    Source: ${flare.sourceLocation || 'Unknown'}<br>
                    Peak: ${new Date(flare.peakTime).toLocaleString()}
                </div>
            `;
            container.appendChild(event);
        });
        
        return data.length;
    } catch (error) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">☀️</div>
                <p style="color: var(--gray);">Unable to load solar flare data.</p>
            </div>
        `;
        return 0;
    }
}

async function fetchCMEEvents(startDate, endDate) {
    const container = document.getElementById('cmeEvents');
    if (!container) return 0;
    
    try {
        const response = await fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=eWHlo7GJ3vq2POhcO59dFYNmTMpI5p89P4E4WjSW`);
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🌊</div>
                    <p style="color: var(--gray);">No recent CME activity detected.</p>
                </div>
            `;
            return 0;
        }
        
        // Add visual header
        const cmeHeader = document.createElement('div');
        cmeHeader.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
        cmeHeader.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.8));">💥</div>
            <div style="color: var(--secondary); font-size: 0.9rem;">${data.length} CME Events</div>
        `;
        container.appendChild(cmeHeader);
        
        data.slice(0, 5).forEach(cme => {
            const event = document.createElement('div');
            event.className = 'solar-event';
            event.innerHTML = `
                <div class="solar-event-title">⚡ Coronal Mass Ejection</div>
                <div class="solar-event-time">${new Date(cme.activityID).toLocaleString()}</div>
                <div class="solar-event-details">
                    Source: ${cme.sourceLocation || 'Unknown'}<br>
                    ${cme.note || 'CME detected'}
                </div>
            `;
            container.appendChild(event);
        });
        
        return data.length;
    } catch (error) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🌊</div>
                <p style="color: var(--gray);">Unable to load CME data.</p>
            </div>
        `;
        return 0;
    }
}

async function fetchGeoStorms(startDate, endDate) {
    const container = document.getElementById('geoStorms');
    if (!container) return 0;
    
    try {
        const response = await fetch(`https://api.nasa.gov/DONKI/GST?startDate=${startDate}&endDate=${endDate}&api_key=eWHlo7GJ3vq2POhcO59dFYNmTMpI5p89P4E4WjSW`);
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🌍</div>
                    <p style="color: var(--gray);">No recent geomagnetic storm activity.</p>
                </div>
            `;
            return 0;
        }
        
        // Add visual header
        const stormHeader = document.createElement('div');
        stormHeader.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
        stormHeader.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px rgba(0, 255, 100, 0.8));">🌍</div>
            <div style="color: var(--primary); font-size: 0.9rem;">${data.length} Storm Events</div>
        `;
        container.appendChild(stormHeader);
        
        data.slice(0, 5).forEach(storm => {
            const event = document.createElement('div');
            event.className = 'solar-event';
            event.innerHTML = `
                <div class="solar-event-title">⚠️ Geomagnetic Storm</div>
                <div class="solar-event-time">${new Date(storm.startTime).toLocaleString()}</div>
                <div class="solar-event-details">
                    ${storm.allKpIndex?.[0]?.kpIndex ? `Kp Index: ${storm.allKpIndex[0].kpIndex}` : 'Storm detected'}
                </div>
            `;
            container.appendChild(event);
        });
        
        return data.length;
    } catch (error) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🌍</div>
                <p style="color: var(--gray);">Unable to load storm data.</p>
            </div>
        `;
        return 0;
    }
}

// Asteroids
async function fetchAsteroids() {
    const container = document.getElementById('asteroidsList');
    if (!container) return;
    
    try {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        const response = await fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatDate(today)}&end_date=${formatDate(endDate)}&api_key=eWHlo7GJ3vq2POhcO59dFYNmTMpI5p89P4E4WjSW`
        );
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        container.innerHTML = '';
        
        if (!data.near_earth_objects) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">☄️</div>
                    <p style="color: var(--gray);">No asteroids detected.</p>
                </div>
            `;
            return;
        }
        
        const allAsteroids = [];
        Object.values(data.near_earth_objects).forEach(dateAsteroids => {
            if (Array.isArray(dateAsteroids)) {
                allAsteroids.push(...dateAsteroids);
            }
        });
        
        if (allAsteroids.length > 0) {
            // Add header with asteroid visual
            const asteroidHeader = document.createElement('div');
            asteroidHeader.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
            asteroidHeader.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px rgba(112, 0, 255, 0.8));">☄️</div>
                <div style="color: var(--accent); font-size: 0.9rem;">${allAsteroids.length} Asteroids Approaching</div>
            `;
            container.appendChild(asteroidHeader);
        }
        
        allAsteroids.sort((a, b) => {
            const dateA = a.close_approach_data?.[0]?.close_approach_date;
            const dateB = b.close_approach_data?.[0]?.close_approach_date;
            if (!dateA || !dateB) return 0;
            return new Date(dateA) - new Date(dateB);
        });
        
        allAsteroids.slice(0, 5).forEach(asteroid => {
            if (!asteroid.close_approach_data?.[0]) return;
            
            const approach = asteroid.close_approach_data[0];
            const item = document.createElement('div');
            item.className = 'asteroid-item';
            item.innerHTML = `
                <div class="asteroid-name">🪨 ${asteroid.name || 'Unknown'}</div>
                <div class="asteroid-date">
                    Approach: ${new Date(approach.close_approach_date).toLocaleDateString()}
                </div>
                <div class="asteroid-details">
                    Distance: ${parseFloat(approach.miss_distance?.kilometers || 0).toLocaleString()} km<br>
                    Velocity: ${parseFloat(approach.relative_velocity?.kilometers_per_hour || 0).toLocaleString()} km/h
                </div>
                ${asteroid.is_potentially_hazardous_asteroid ? '<div class="hazard-badge">⚠️ Potentially Hazardous</div>' : ''}
            `;
            container.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error fetching asteroids:', error);
        container.innerHTML = '<p style="color: var(--gray);">Unable to load asteroid data.</p>';
    }
}

// Mars Weather - Static display since mission ended
function fetchMarsWeather() {
    const container = document.getElementById('marsWeather');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem; filter: drop-shadow(0 0 20px rgba(255, 100, 50, 0.8));">🔴</div>
            <p style="color: var(--gray); margin-bottom: 1rem;">
                InSight Mission Concluded (2022)
            </p>
            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(112, 0, 255, 0.1); border: 1px solid rgba(112, 0, 255, 0.3);">
                <div style="font-size: 1.2rem; color: var(--accent); margin-bottom: 0.5rem;">Typical Mars Conditions</div>
                <div style="color: var(--light); font-size: 0.9rem; line-height: 1.8;">
                    🌡️ Temperature: -20°C to -80°C<br>
                    📊 Pressure: ~600-700 Pa<br>
                    💨 Atmosphere: 95% CO₂<br>
                    🏜️ Dust Storms: Seasonal
                </div>
            </div>
        </div>
    `;
}

// Meteor Showers
function fetchMeteorShowers() {
    const container = document.getElementById('meteorShowers');
    if (!container) return;
    
    const showers = [
        { name: 'Quadrantids', peak: 'January 3-4', rate: '80-120/hr', emoji: '⭐' },
        { name: 'Lyrids', peak: 'April 22-23', rate: '10-20/hr', emoji: '💫' },
        { name: 'Perseids', peak: 'August 12-13', rate: '60-100/hr', emoji: '🌠' },
        { name: 'Geminids', peak: 'December 13-14', rate: '120+/hr', emoji: '✨' }
    ];
    
    container.innerHTML = '';
    
    // Add header
    const header = document.createElement('div');
    header.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
    header.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));">🌠</div>
        <div style="color: var(--primary); font-size: 0.9rem;">Annual Meteor Showers</div>
    `;
    container.appendChild(header);
    
    showers.forEach(shower => {
        const item = document.createElement('div');
        item.className = 'meteor-item';
        item.innerHTML = `
            <div class="meteor-name">${shower.emoji} ${shower.name}</div>
            <div class="meteor-peak">Peak: ${shower.peak}</div>
            <div class="meteor-rate">Rate: ${shower.rate}</div>
        `;
        container.appendChild(item);
    });
}

// Moon Phase
function fetchMoonPhase() {
    const container = document.getElementById('moonPhase');
    if (!container) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    let y, m;
    if (month < 3) {
        y = year - 1;
        m = month + 12;
    } else {
        y = year;
        m = month;
    }
    
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
    
    const daysSinceNew = (jd - 2451549.5) / 29.53;
    const phase = daysSinceNew - Math.floor(daysSinceNew);
    
    let phaseName, phaseEmoji;
    const illumination = Math.round(phase >= 0.5 ? (1 - phase) * 200 : phase * 200);
    
    if (phase < 0.0625 || phase >= 0.9375) {
        phaseName = 'New Moon';
        phaseEmoji = '🌑';
    } else if (phase < 0.1875) {
        phaseName = 'Waxing Crescent';
        phaseEmoji = '🌒';
    } else if (phase < 0.3125) {
        phaseName = 'First Quarter';
        phaseEmoji = '🌓';
    } else if (phase < 0.4375) {
        phaseName = 'Waxing Gibbous';
        phaseEmoji = '🌔';
    } else if (phase < 0.5625) {
        phaseName = 'Full Moon';
        phaseEmoji = '🌕';
    } else if (phase < 0.6875) {
        phaseName = 'Waning Gibbous';
        phaseEmoji = '🌖';
    } else if (phase < 0.8125) {
        phaseName = 'Last Quarter';
        phaseEmoji = '🌗';
    } else {
        phaseName = 'Waning Crescent';
        phaseEmoji = '🌘';
    }
    
    container.innerHTML = `
        <div class="moon-display">
            <div class="moon-emoji" style="font-size: 8rem; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8)); margin: 2rem 0;">${phaseEmoji}</div>
            <div class="moon-phase-name" style="font-size: 2rem; color: var(--light); margin-bottom: 1rem;">${phaseName}</div>
            <div class="moon-illumination" style="font-size: 1.5rem; color: var(--primary);">${Math.abs(illumination)}% Illuminated</div>
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                <div style="color: var(--gray); font-size: 0.9rem;">
                    🌙 Lunar Cycle: 29.5 days<br>
                    🌕 Next Full Moon: Soon<br>
                    🌑 Next New Moon: Calculating...
                </div>
            </div>
        </div>
    `;
}

// APOD
async function fetchAPOD() {
    const container = document.getElementById('apodContainer');
    if (!container) return;
    
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=eWHlo7GJ3vq2POhcO59dFYNmTMpI5p89P4E4WjSW');
        
        if (!response.ok) {
            throw new Error('APOD API unavailable');
        }
        
        const data = await response.json();
        
        container.innerHTML = '';
        
        const card = document.createElement('div');
        card.className = 'apod-card';
        
        const mediaElement = data.media_type === 'video' 
            ? `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 500px;"></iframe>`
            : `<img src="${data.url}" alt="${data.title || 'APOD'}" class="apod-image" onerror="this.style.display='none'">`;
        
        card.innerHTML = `
            ${mediaElement}
            <div class="apod-content">
                <h3 class="apod-title">${data.title || 'Astronomy Picture'}</h3>
                <p class="apod-date">${data.date || ''}</p>
                <p class="apod-explanation">${data.explanation || ''}</p>
                ${data.copyright ? `<p style="margin-top: 1rem; color: var(--gray); font-size: 0.9rem;">© ${data.copyright}</p>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    } catch (error) {
        console.error('Error fetching APOD:', error);
        // Show placeholder with space image
        container.innerHTML = `
            <div class="apod-card">
                <div style="width: 100%; height: 400px; background: linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%); display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: var(--primary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🌌</div>
                        <div style="font-size: 1.2rem;">APOD Service Temporarily Unavailable</div>
                    </div>
                </div>
                <div class="apod-content">
                    <h3 class="apod-title">Astronomy Picture of the Day</h3>
                    <p class="apod-date">${new Date().toLocaleDateString()}</p>
                    <p class="apod-explanation">The Astronomy Picture of the Day service is currently unavailable. Please check back later for stunning space imagery and scientific explanations.</p>
                </div>
            </div>
        `;
    }
}

// Progressive Loading System
let loadedComponents = 0;
const totalComponents = 11;

function componentLoaded() {
    loadedComponents++;
    const progress = (loadedComponents / totalComponents) * 100;
    updateLoadingProgress(progress);
    
    if (loadedComponents >= totalComponents) {
        hideLoadingScreen();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    updateLoadingProgress(10);
    
    const components = [
        fetchLaunches,
        initISSTracking,
        fetchSatellites,
        fetchCrewInfo,
        fetchSpacewalks,
        fetchSolarEvents,
        fetchAsteroids,
        fetchMarsWeather,
        fetchMeteorShowers,
        fetchMoonPhase,
        fetchAPOD
    ];
    
    for (const component of components) {
        try {
            await component();
        } catch (err) {
            console.error('Component failed:', err);
        }
        componentLoaded();
    }
    
    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(el => {
        observer.observe(el);
    });
});

// Optimized parallax
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-content');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                hero.style.opacity = Math.max(0, 1 - (scrolled / 500));
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Live Clock
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('currentTime');
    const dateEl = document.getElementById('currentDate');
    
    if (timeEl) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock();

// Scroll to top button
const scrollBtn = document.createElement('div');
scrollBtn.innerHTML = '🚀';
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 1.5rem;
    box-shadow: 0 0 20px var(--primary);
`;

document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollBtn.style.opacity = '1';
    } else {
        scrollBtn.style.opacity = '0';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Easter egg - Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateSpaceMode();
    }
});

function activateSpaceMode() {
    // Create temporary visual effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0,247,255,0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        animation: pulse 2s ease-out;
    `;
    document.body.appendChild(overlay);
    
    // Add temporary stars explosion
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: ${Math.random() * 30 + 20}px;
                pointer-events: none;
                z-index: 9999;
                animation: starExplode 2s ease-out forwards;
            `;
            document.body.appendChild(star);
            
            setTimeout(() => star.remove(), 2000);
        }, i * 20);
    }
    
    setTimeout(() => overlay.remove(), 2000);
    
    // Show secret message
    alert('🚀 SPACE MODE ACTIVATED! 🌌\nYou found the secret! Keep exploring the cosmos!');
}

// Add CSS animation for star explosion
const style = document.createElement('style');
style.textContent = `
    @keyframes starExplode {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1.5) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Quick stats update
function updateQuickStats() {
    const trackedEl = document.getElementById('trackedSatellites');
    if (trackedEl) {
        // Update with actual count if needed
        trackedEl.textContent = '4';
    }
}

updateQuickStats();

// Notification permission request (for future launch alerts)
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        // Could add a button to request this
        console.log('Notification API available');
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'L' to jump to launches
    if (e.key === 'l' || e.key === 'L') {
        const launchSection = document.getElementById('launches');
        if (launchSection) {
            launchSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Press 'I' to jump to ISS tracker
    if (e.key === 'i' || e.key === 'I') {
        const issSection = document.getElementById('tracking');
        if (issSection) {
            issSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Press 'S' to jump to solar events
    if (e.key === 's' || e.key === 'S') {
        const solarSection = document.getElementById('solar');
        if (solarSection) {
            solarSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Performance monitoring
console.log('%c🚀 AstraPatch Loaded Successfully!', 'color: #00f7ff; font-size: 20px; font-weight: bold;');
console.log('%c📡 Space Tracking Systems Online', 'color: #00ff00; font-size: 14px;');
console.log('%c🎮 Keyboard Shortcuts: L (Launches), I (ISS), S (Solar)', 'color: #ff00ff; font-size: 12px;');
console.log('%c🎯 Try the Konami Code!', 'color: #ffff00; font-size: 12px;');

