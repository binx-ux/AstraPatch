// Sound effects
const hoverSound = document.getElementById('hoverSound');
const clickSound = document.getElementById('clickSound');

// Add hover sounds to interactive elements
document.querySelectorAll('.nav-link, .filter-btn, .tab-btn').forEach(element => {
    element.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    });
    element.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    });
});

// Smooth scrolling for navigation
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

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Launch data fetching with improved accuracy
async function fetchLaunches() {
    const launchesGrid = document.getElementById('launchesGrid');
    const launchCount = document.getElementById('launchCount');
    
    try {
        // Using more accurate endpoint with window_start parameter
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?mode=detailed&limit=20');
        const data = await response.json();
        
        launchCount.textContent = data.count;
        
        launchesGrid.innerHTML = '';
        
        // Filter for more confirmed launches
        const confirmedLaunches = data.results.filter(launch => {
            return launch.status && launch.status.id !== 8; // Exclude TBC status
        });
        
        confirmedLaunches.slice(0, 12).forEach((launch, index) => {
            const card = createLaunchCard(launch);
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
            launchesGrid.appendChild(card);
        });
        
        setInterval(updateCountdowns, 1000);
        
    } catch (error) {
        console.error('Error fetching launches:', error);
        launchesGrid.innerHTML = '<p style="text-align: center; color: var(--gray);">Unable to load launch data. Please try again later.</p>';
    }
}

function createLaunchCard(launch) {
    const card = document.createElement('div');
    card.className = 'launch-card';
    card.dataset.provider = launch.launch_service_provider?.name?.toLowerCase() || 'other';
    
    const statusClass = launch.status?.id === 1 ? 'status-go' : 
                       launch.status?.id === 2 ? 'status-tbd' : 'status-hold';
    
    const launchTime = new Date(launch.net || launch.window_start);
    const provider = launch.launch_service_provider?.name || 'Unknown';
    const probability = launch.probability ? `${launch.probability}%` : 'TBD';
    
    card.innerHTML = `
        <div class="launch-header">
            <div>
                <div class="launch-name">${launch.name}</div>
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
                <span>Success Probability:</span>
                <span>${probability}</span>
            </div>
            <div class="launch-detail">
                <span>Window:</span>
                <span>${launch.window_end ? 'Opens ' + new Date(launch.window_start).toLocaleTimeString() : 'Instantaneous'}</span>
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
    setInterval(fetchISSPosition, 5000); // Update every 5 seconds
}

async function fetchISSPosition() {
    try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        
        issLat = parseFloat(data.iss_position.latitude);
        issLon = parseFloat(data.iss_position.longitude);
        
        document.getElementById('issLat').textContent = issLat.toFixed(4) + '°';
        document.getElementById('issLon').textContent = issLon.toFixed(4) + '°';
        
        // Fetch altitude and velocity
        fetchISSDetails();
        drawEarth();
        getLocationName(issLat, issLon);
        
    } catch (error) {
        console.error('Error fetching ISS position:', error);
    }
}

async function fetchISSDetails() {
    try {
        // Using TLE data for more accurate info
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        
        document.getElementById('issAlt').textContent = data.altitude.toFixed(2) + ' km';
        document.getElementById('issVel').textContent = data.velocity.toFixed(2) + ' km/h';
        
    } catch (error) {
        document.getElementById('issAlt').textContent = '~408 km';
        document.getElementById('issVel').textContent = '~27,600 km/h';
    }
}

function drawEarth() {
    if (!issCtx) return;
    
    const centerX = issCanvas.width / 2;
    const centerY = issCanvas.height / 2;
    const radius = 200;
    
    // Clear canvas
    issCtx.clearRect(0, 0, issCanvas.width, issCanvas.height);
    
    // Draw Earth
    const gradient = issCtx.createRadialGradient(centerX - 50, centerY - 50, 20, centerX, centerY, radius);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(0.7, '#2E5C8A');
    gradient.addColorStop(1, '#1A3A5C');
    
    issCtx.fillStyle = gradient;
    issCtx.beginPath();
    issCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    issCtx.fill();
    
    // Draw grid lines
    issCtx.strokeStyle = 'rgba(0, 247, 255, 0.3)';
    issCtx.lineWidth = 1;
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
        const y = centerY - (lat / 90) * radius;
        issCtx.beginPath();
        issCtx.arc(centerX, centerY, Math.abs(centerY - y), 0, 2 * Math.PI);
        issCtx.stroke();
    }
    
    // Longitude lines
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
    
    // Draw ISS position
    const x = centerX + (issLon / 180) * radius;
    const y = centerY - (issLat / 90) * radius;
    
    // ISS marker
    issCtx.fillStyle = '#00ff00';
    issCtx.beginPath();
    issCtx.arc(x, y, 8, 0, 2 * Math.PI);
    issCtx.fill();
    
    issCtx.strokeStyle = '#00ff00';
    issCtx.lineWidth = 2;
    issCtx.stroke();
    
    // Pulsing effect
    issCtx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    issCtx.lineWidth = 3;
    issCtx.beginPath();
    issCtx.arc(x, y, 15, 0, 2 * Math.PI);
    issCtx.stroke();
}

async function getLocationName(lat, lon) {
    const locationEl = document.getElementById('issLocation');
    
    // Determine ocean or continent
    if (Math.abs(lat) < 60) {
        locationEl.textContent = `Currently over coordinates ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    } else {
        locationEl.textContent = `Currently over polar region at ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
}

// Satellite Tracking
async function fetchSatellites() {
    const grid = document.getElementById('satelliteGrid');
    
    const satellites = [
        { name: 'Hubble Space Telescope', norad: 20580 },
        { name: 'Starlink-1007', norad: 44713 },
        { name: 'Tiangong Space Station', norad: 48274 },
        { name: 'James Webb Space Telescope', norad: 50463 }
    ];
    
    grid.innerHTML = '';
    
    for (const sat of satellites) {
        try {
            const response = await fetch(`https://api.wheretheiss.at/v1/satellites/${sat.norad}`);
            const data = await response.json();
            
            const card = document.createElement('div');
            card.className = 'satellite-card fade-in';
            card.innerHTML = `
                <div class="satellite-name">${sat.name}</div>
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
            console.error(`Error fetching ${sat.name}:`, error);
        }
    }
}

// Station Crew
async function fetchCrewInfo() {
    const grid = document.getElementById('crewGrid');
    
    try {
        const response = await fetch('http://api.open-notify.org/astros.json');
        const data = await response.json();
        
        grid.innerHTML = '';
        
        const issCrewResponse = await fetch('https://ll.thespacedevs.com/2.2.0/astronaut/?on_iss=true&limit=20');
        const issCrewData = await issCrewResponse.json();
        
        issCrewData.results.forEach(astronaut => {
            const card = document.createElement('div');
            card.className = 'crew-card fade-in';
            card.innerHTML = `
                <img src="${astronaut.profile_image || 'https://via.placeholder.com/150'}" 
                     alt="${astronaut.name}" 
                     class="crew-photo"
                     onerror="this.src='https://via.placeholder.com/150'">
                <div class="crew-name">${astronaut.name}</div>
                <div class="crew-agency">${astronaut.agency?.name || 'Unknown Agency'}</div>
                <div class="crew-launch-date">
                    ${astronaut.last_flight ? 'Aboard since ' + new Date(astronaut.last_flight).toLocaleDateString() : 'Current crew member'}
                </div>
            `;
            grid.appendChild(card);
        });
        
        if (issCrewData.results.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--gray);">No crew data available.</p>';
        }
        
    } catch (error) {
        console.error('Error fetching crew:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--gray);">Unable to load crew data.</p>';
    }
}

// Spacewalks
async function fetchSpacewalks() {
    const list = document.getElementById('spacewalksList');
    
    try {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/spacewalk/upcoming/?limit=10');
        const data = await response.json();
        
        list.innerHTML = '';
        
        if (data.results.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--gray);">No upcoming spacewalks scheduled.</p>';
            return;
        }
        
        data.results.forEach(eva => {
            const item = document.createElement('div');
            item.className = 'spacewalk-item fade-in';
            item.innerHTML = `
                <div class="spacewalk-title">${eva.name || 'Extravehicular Activity'}</div>
                <div class="spacewalk-date">${new Date(eva.start).toLocaleString()}</div>
                <div class="spacewalk-astronauts">
                    Crew: ${eva.crew?.map(c => c.astronaut.name).join(', ') || 'To be announced'}
                </div>
                <div class="spacewalk-duration">
                    Duration: ${eva.duration || 'TBD'}
                </div>
            `;
            list.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error fetching spacewalks:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--gray);">Unable to load spacewalk data.</p>';
    }
}

// Near-Earth Asteroids
async function fetchAsteroids() {
    const container = document.getElementById('asteroidsList');
    
    try {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        const response = await fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatDate(today)}&end_date=${formatDate(endDate)}&api_key=DEMO_KEY`
        );
        const data = await response.json();
        
        container.innerHTML = '';
        
        const allAsteroids = [];
        Object.values(data.near_earth_objects).forEach(dateAsteroids => {
            allAsteroids.push(...dateAsteroids);
        });
        
        allAsteroids.sort((a, b) => 
            new Date(a.close_approach_data[0].close_approach_date) - 
            new Date(b.close_approach_data[0].close_approach_date)
        );
        
        allAsteroids.slice(0, 5).forEach(asteroid => {
            const approach = asteroid.close_approach_data[0];
            const item = document.createElement('div');
            item.className = 'asteroid-item fade-in';
            item.innerHTML = `
                <div class="asteroid-name">${asteroid.name}</div>
                <div class="asteroid-date">
                    Close Approach: ${new Date(approach.close_approach_date).toLocaleDateString()}
                </div>
                <div class="asteroid-details">
                    Distance: ${parseFloat(approach.miss_distance.kilometers).toLocaleString()} km<br>
                    Velocity: ${parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h<br>
                    Est. Diameter: ${asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)} - 
                    ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} meters
                </div>
                ${asteroid.is_potentially_hazardous_asteroid ? '<div class="hazard-badge">Potentially Hazardous</div>' : ''}
            `;
            container.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error fetching asteroids:', error);
        container.innerHTML = '<p style="color: var(--gray);">Unable to load asteroid data.</p>';
    }
}

// Mars Weather
async function fetchMarsWeather() {
    const container = document.getElementById('marsWeather');
    
    try {
        const response = await fetch('https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0');
        const data = await response.json();
        
        container.innerHTML = '';
        
        const sols = data.sol_keys.slice(-1);
        
        if (sols.length === 0) {
            container.innerHTML = '<p style="color: var(--gray);">Mars weather data temporarily unavailable. InSight mission has concluded.</p>';
            return;
        }
        
        sols.forEach(sol => {
            const solData = data[sol];
            const div = document.createElement('div');
            div.className = 'mars-sol fade-in';
            div.innerHTML = `
                <div class="mars-sol-number">Sol ${sol}</div>
                <div class="mars-data-grid">
                    <div class="mars-data-item">
                        <div class="mars-data-label">Avg Temperature</div>
                        <div class="mars-data-value">${solData.AT?.av?.toFixed(1) || 'N/A'}°C</div>
                    </div>
                    <div class="mars-data-item">
                        <div class="mars-data-label">Pressure</div>
                        <div class="mars-data-value">${solData.PRE?.av?.toFixed(0) || 'N/A'} Pa</div>
                    </div>
                    <div class="mars-data-item">
                        <div class="mars-data-label">Wind Speed</div>
                        <div class="mars-data-value">${solData.HWS?.av?.toFixed(1) || 'N/A'} m/s</div>
                    </div>
                    <div class="mars-data-item">
                        <div class="mars-data-label">Season</div>
                        <div class="mars-data-value">${solData.Season || 'N/A'}</div>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        
    } catch (error) {
        console.error('Error fetching Mars weather:', error);
        container.innerHTML = `
            <p style="color: var(--gray); text-align: center; padding: 2rem;">
                Mars weather data from InSight lander is no longer available as the mission has concluded.
                NASA's Perseverance rover provides limited weather data through different APIs.
            </p>
        `;
    }
}

// Meteor Showers
async function fetchMeteorShowers() {
    const container = document.getElementById('meteorShowers');
    
    const showers = [
        { name: 'Quadrantids', peak: 'January 3-4', rate: '80-120 per hour', active: 'Dec 28 - Jan 12' },
        { name: 'Lyrids', peak: 'April 22-23', rate: '10-20 per hour', active: 'Apr 16 - Apr 25' },
        { name: 'Eta Aquarids', peak: 'May 6-7', rate: '40-85 per hour', active: 'Apr 19 - May 28' },
        { name: 'Perseids', peak: 'August 12-13', rate: '60-100 per hour', active: 'Jul 17 - Aug 24' },
        { name: 'Orionids', peak: 'October 21-22', rate: '10-20 per hour', active: 'Oct 2 - Nov 7' },
        { name: 'Leonids', peak: 'November 17-18', rate: '10-15 per hour', active: 'Nov 6 - Nov 30' },
        { name: 'Geminids', peak: 'December 13-14', rate: '120+ per hour', active: 'Dec 4 - Dec 17' }
    ];
    
    container.innerHTML = '';
    
    const now = new Date();
    const currentMonth = now.getMonth();
    
    const upcomingShowers = showers.filter((shower, index) => {
        const showerMonth = [0, 3, 4, 7, 9, 10, 11][index];
        return showerMonth >= currentMonth || showerMonth < (currentMonth + 3) % 12;
    }).slice(0, 5);
    
    upcomingShowers.forEach(shower => {
        const item = document.createElement('div');
        item.className = 'meteor-item fade-in';
        item.innerHTML = `
            <div class="meteor-name">${shower.name}</div>
            <div class="meteor-peak">Peak: ${shower.peak}</div>
            <div class="meteor-rate">
                Expected Rate: ${shower.rate}<br>
                Active Period: ${shower.active}
            </div>
        `;
        container.appendChild(item);
    });
}

// Moon Phase
async function fetchMoonPhase() {
    const container = document.getElementById('moonPhase');
    
    // Calculate moon phase
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    const c = e = jd = b = 0;
    
    if (month < 3) {
        const y = year - 1;
        const m = month + 12;
    } else {
        const y = year;
        const m = month;
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
        <div class="moon-display fade-in">
            <div class="moon-emoji">${phaseEmoji}</div>
            <div class="moon-phase-name">${phaseName}</div>
            <div class="moon-illumination">${Math.abs(illumination)}% Illuminated</div>
            <div class="moon-times">
                <div class="moon-time">
                    <div class="moon-time-label">Moonrise</div>
                    <div class="moon-time-value">--:--</div>
                </div>
                <div class="moon-time">
                    <div class="moon-time-label">Moonset</div>
                    <div class="moon-time-value">--:--</div>
                </div>
            </div>
            <p style="color: var(--gray); margin-top: 1rem; font-size: 0.9rem;">
                Next Full Moon: ${getNextFullMoon().toLocaleDateString()}
            </p>
        </div>
    `;
}

function getNextFullMoon() {
    const now = new Date();
    const knownFullMoon = new Date('2024-01-25');
    const lunarCycle = 29.53059;
    
    let nextFull = new Date(knownFullMoon);
    while (nextFull < now) {
        nextFull.setDate(nextFull.getDate() + lunarCycle);
    }
    
    return nextFull;
}

// Solar Events (keeping existing functionality)
async function fetchSolarEvents() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(today);
    
    try {
        fetchSolarFlares(startDateStr, endDateStr);
        fetchCMEEvents(startDateStr, endDateStr);
        fetchGeoStorms(startDateStr, endDateStr);
    } catch (error) {
        console.error('Error fetching solar events:', error);
    }
}

async function fetchSolarFlares(startDate, endDate) {
    const container = document.getElementById('solarFlares');
    try {
        const response = await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=DEMO_KEY`);
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--gray);">No recent solar flare activity detected.</p>';
            return;
        }
        
        const activeEvents = document.getElementById('activeEvents');
        activeEvents.textContent = parseInt(activeEvents.textContent) + data.length;
        
        data.slice(0, 5).forEach(flare => {
            const event = document.createElement('div');
            event.className = 'solar-event fade-in';
            event.innerHTML = `
                <div class="solar-event-title">Class ${flare.classType} Flare</div>
                <div class="solar-event-time">${new Date(flare.beginTime).toLocaleString()}</div>
                <div class="solar-event-details">
                    Source: ${flare.sourceLocation || 'Unknown'}<br>
                    Peak Time: ${new Date(flare.peakTime).toLocaleString()}
                </div>
            `;
            container.appendChild(event);
        });
    } catch (error) {
        container.innerHTML = '<p style="color: var(--gray);">Unable to load solar flare data.</p>';
    }
}

async function fetchCMEEvents(startDate, endDate) {
    const container = document.getElementById('cmeEvents');
    try {
        const response = await fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=DEMO_KEY`);
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--gray);">No recent CME activity detected.</p>';
            return;
        }
        
        const activeEvents = document.getElementById('activeEvents');
        activeEvents.textContent = parseInt(activeEvents.textContent) + data.length;
        
        data.slice(0, 5).forEach(cme => {
            const event = document.createElement('div');
            event.className = 'solar-event fade-in';
            event.innerHTML = `
                <div class="solar-event-title">Coronal Mass Ejection</div>
                <div class="solar-event-time">${new Date(cme.activityID).toLocaleString()}</div>
                <div class="solar-event-details">
                    Source: ${cme.sourceLocation || 'Unknown'}<br>
                    ${cme.note || 'CME event detected'}
                </div>
            `;
            container.appendChild(event);
        });
    } catch (error) {
        container.innerHTML = '<p style="color: var(--gray);">Unable to load CME data.</p>';
    }
}

async function fetchGeoStorms(startDate, endDate) {
    const container = document.getElementById('geoStorms');
    try {
        const response = await fetch(`https://api.nasa.gov/DONKI/GST?startDate=${startDate}&endDate=${endDate}&api_key=DEMO_KEY`);
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--gray);">No recent geomagnetic storm activity.</p>';
            return;
        }
        
        const activeEvents = document.getElementById('activeEvents');
        activeEvents.textContent = parseInt(activeEvents.textContent) + data.length;
        
        data.slice(0, 5).forEach(storm => {
            const event = document.createElement('div');
            event.className = 'solar-event fade-in';
            event.innerHTML = `
                <div class="solar-event-title">Geomagnetic Storm</div>
                <div class="solar-event-time">${new Date(storm.startTime).toLocaleString()}</div>
                <div class="solar-event-details">
                    ${storm.allKpIndex && storm.allKpIndex.length > 0 ? 
                      `Kp Index: ${storm.allKpIndex[0].kpIndex}` : 
                      'Storm activity detected'}
                </div>
            `;
            container.appendChild(event);
        });
    } catch (error) {
        container.innerHTML = '<p style="color: var(--gray);">Unable to load geomagnetic storm data.</p>';
    }
}

// APOD
async function fetchAPOD() {
    const container = document.getElementById('apodContainer');
    
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();
        
        container.innerHTML = '';
        
        const card = document.createElement('div');
        card.className = 'apod-card fade-in';
        
        const mediaElement = data.media_type === 'video' 
            ? `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 500px;"></iframe>`
            : `<img src="${data.url}" alt="${data.title}" class="apod-image">`;
        
        card.innerHTML = `
            ${mediaElement}
            <div class="apod-content">
                <h3 class="apod-title">${data.title}</h3>
                <p class="apod-date">${data.date}</p>
                <p class="apod-explanation">${data.explanation}</p>
                ${data.copyright ? `<p style="margin-top: 1rem; color: var(--gray); font-size: 0.9rem;">Copyright: ${data.copyright}</p>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    } catch (error) {
        console.error('Error fetching APOD:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--gray);">Unable to load Astronomy Picture of the Day.</p>';
    }
}

// Initialize all data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchLaunches();
    initISSTracking();
    fetchSatellites();
    fetchCrewInfo();
    fetchSpacewalks();
    fetchSolarEvents();
    fetchAsteroids();
    fetchMarsWeather();
    fetchMeteorShowers();
    fetchMoonPhase();
    fetchAPOD();
    
    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.launch-card, .solar-card, .apod-card').forEach(el => {
        observer.observe(el);
    });
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});
