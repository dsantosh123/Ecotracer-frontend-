
let currentUser = null;
let carbonData = {};
let wasteReports = [];
let challenges = [];
let userPoints = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDemoData();
});

// Initialize Application
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('ecoTraceUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Initialize smooth scrolling
    setupSmoothScrolling();
    
    // Initialize animations
    setupScrollAnimations();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Modal close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Form submissions
    setupFormHandlers();
}

// Authentication Functions
function showLogin() {
    closeAllModals();
    document.getElementById('loginModal').style.display = 'flex';
}

function showRegister() {
    closeAllModals();
    document.getElementById('registerModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login validation
    if (email && password) {
        currentUser = {
            id: generateId(),
            email: email,
            name: email.split('@')[0],
            points: Math.floor(Math.random() * 10000) + 1000,
            carbonFootprint: Math.floor(Math.random() * 200) + 100,
            wasteReduced: Math.floor(Math.random() * 50) + 10,
            communityRank: Math.floor(Math.random() * 100) + 1,
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeModal('loginModal');
        showNotification('Welcome back! Login successful.', 'success');
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const community = document.getElementById('community').value;
    
    if (firstName && lastName && email && password && community) {
        currentUser = {
            id: generateId(),
            email: email,
            name: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            community: community,
            points: 100, // Starting points
            carbonFootprint: 0,
            wasteReduced: 0,
            communityRank: 0,
            joinDate: new Date().toISOString(),
            badges: ['Welcome Warrior'],
            challenges: []
        };
        
        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeModal('registerModal');
        showNotification('Account created successfully! Welcome to EcoTrace.', 'success');
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

function updateUIForLoggedInUser() {
    if (currentUser) {
        // Update navigation
        const navAuth = document.querySelector('.nav-auth');
        navAuth.innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button class="btn-primary" onclick="showDashboard()">Dashboard</button>
            <button class="btn-secondary" onclick="logout()">Logout</button>
        `;
        
        // Update dashboard if visible
        updateDashboard();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ecoTraceUser');
    
    // Reset navigation
    const navAuth = document.querySelector('.nav-auth');
    navAuth.innerHTML = `
        <button class="btn-secondary" onclick="showLogin()">Login</button>
        <button class="btn-primary" onclick="showRegister()">Sign Up</button>
    `;
    
    // Hide dashboard
    document.getElementById('dashboard').classList.add('hidden');
    
    showNotification('Logged out successfully.', 'info');
}

// Dashboard Functions
function showDashboard() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    updateDashboard();
}

function updateDashboard() {
    if (!currentUser) return;
    
    // Update user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    // Update carbon footprint
    updateCarbonDisplay();
    
    // Update waste stats
    updateWasteStats();
    
    // Update community rank
    updateCommunityRank();
    
    // Update active challenges
    updateActiveChallenges();
}

function updateCarbonDisplay() {
    const carbonValue = document.querySelector('.carbon-value');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (carbonValue && currentUser) {
        const footprint = currentUser.carbonFootprint || Math.floor(Math.random() * 200) + 100;
        carbonValue.textContent = footprint.toFixed(1);
        
        // Calculate progress (assuming 200 is average)
        const improvement = Math.max(0, (200 - footprint) / 200 * 100);
        progressFill.style.width = `${improvement}%`;
        progressText.textContent = `${improvement.toFixed(0)}% below average`;
    }
}

function updateWasteStats() {
    const wasteStats = document.querySelector('.waste-stats');
    if (wasteStats && currentUser) {
        const recycled = currentUser.wasteReduced || Math.floor(Math.random() * 50) + 10;
        const composted = Math.floor(recycled * 0.3);
        
        wasteStats.innerHTML = `
            <div class="waste-item">
                <span class="waste-type">Recycled</span>
                <span class="waste-amount">${recycled} kg</span>
            </div>
            <div class="waste-item">
                <span class="waste-type">Composted</span>
                <span class="waste-amount">${composted} kg</span>
            </div>
        `;
    }
}

function updateCommunityRank() {
    const rankNumber = document.querySelector('.rank-number');
    const rankTotal = document.querySelector('.rank-total');
    const points = document.querySelector('.points');
    
    if (rankNumber && currentUser) {
        const rank = currentUser.communityRank || Math.floor(Math.random() * 100) + 1;
        rankNumber.textContent = `#${rank}`;
        rankTotal.textContent = 'of 342';
        points.textContent = `${currentUser.points || 0} points`;
    }
}

function updateActiveChallenges() {
    const challengeList = document.querySelector('.challenge-list');
    if (challengeList) {
        challengeList.innerHTML = `
            <div class="challenge-item">
                <span class="challenge-name">Plastic-Free Week</span>
                <div class="challenge-progress">
                    <div class="challenge-bar" style="width: ${Math.floor(Math.random() * 100)}%"></div>
                </div>
            </div>
            <div class="challenge-item">
                <span class="challenge-name">Green Commute</span>
                <div class="challenge-progress">
                    <div class="challenge-bar" style="width: ${Math.floor(Math.random() * 100)}%"></div>
                </div>
            </div>
            <div class="challenge-item">
                <span class="challenge-name">Zero Waste Day</span>
                <div class="challenge-progress">
                    <div class="challenge-bar" style="width: ${Math.floor(Math.random() * 100)}%"></div>
                </div>
            </div>
        `;
    }
}

// Feature Functions
function startTracking() {
    if (!currentUser) {
        showRegister();
        return;
    }
    showDashboard();
}

function watchDemo() {
    showNotification('Demo video would play here. Feature coming soon!', 'info');
}

function openCarbonCalculator() {
    document.getElementById('carbonCalculatorModal').style.display = 'flex';
}

function openWasteMap() {
    document.getElementById('wasteMapModal').style.display = 'flex';
    loadWasteMap();
}

function openChallenges() {
    showNotification('Challenge hub opening soon! Join competitions and earn points.', 'info');
}

function openDirectory() {
    showNotification('Eco-business directory coming soon! Discover green businesses near you.', 'info');
}

function openWasteClassifier() {
    showNotification('AI waste classifier coming soon! Upload photos to identify waste types.', 'info');
}

function openCarbonCredits() {
    showNotification('Carbon credit system launching soon! Track and trade your carbon savings.', 'info');
}

// Carbon Calculator Functions
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function calculateCarbon() {
    const transportMode = document.getElementById('transportMode')?.value || 'car';
    const transportDistance = parseFloat(document.getElementById('transportDistance')?.value || 0);
    const electricityUsage = parseFloat(document.getElementById('electricityUsage')?.value || 0);
    const gasUsage = parseFloat(document.getElementById('gasUsage')?.value || 0);
    const meatConsumption = parseFloat(document.getElementById('meatConsumption')?.value || 0);
    const shoppingFreq = parseFloat(document.getElementById('shoppingFreq')?.value || 0);
    
    // Carbon calculation factors (kg CO2 per unit)
    const factors = {
        car: 0.21,
        bus: 0.089,
        train: 0.041,
        bike: 0,
        walk: 0,
        electricity: 0.82, // per kWh
        gas: 2.04, // per cubic meter
        meat: 3.3, // per meal
        shopping: 5.2 // per trip
    };
    
    // Calculate monthly carbon footprint
    const transportCarbon = (transportDistance * factors[transportMode] * 4.33); // weekly to monthly
    const electricityCarbon = electricityUsage * factors.electricity;
    const gasCarbon = gasUsage * factors.gas;
    const meatCarbon = meatConsumption * factors.meat * 4.33; // weekly to monthly
    const shoppingCarbon = shoppingFreq * factors.shopping;
    
    const totalCarbon = transportCarbon + electricityCarbon + gasCarbon + meatCarbon + shoppingCarbon;
    
    // Display result
    document.getElementById('carbonResult').classList.remove('hidden');
    document.getElementById('carbonValue').textContent = totalCarbon.toFixed(1);
    
    // Generate comparison text
    const averageCarbon = 200; // kg CO2/month
    const difference = ((totalCarbon - averageCarbon) / averageCarbon * 100);
    const comparisonElement = document.getElementById('comparisonText');
    
    if (difference > 0) {
        comparisonElement.textContent = `${difference.toFixed(1)}% above average. Let's work on reducing it!`;
        comparisonElement.style.color = '#f44336';
    } else {
        comparisonElement.textContent = `${Math.abs(difference).toFixed(1)}% below average. Great job!`;
        comparisonElement.style.color = '#4caf50';
    }
    
    // Update user's carbon footprint if logged in
    if (currentUser) {
        currentUser.carbonFootprint = totalCarbon;
        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        updateDashboard();
    }
}

// Waste Map Functions
function loadWasteMap() {
    // Simulate loading waste reports
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.innerHTML = `
            <div class="map-simulation">
                <h3>Interactive Waste Map</h3>
                <div class="map-controls">
                    <button class="btn-primary" onclick="reportWaste()">Report New Hotspot</button>
                    <button class="btn-secondary" onclick="filterWaste('all')">All Types</button>
                    <button class="btn-secondary" onclick="filterWaste('plastic')">Plastic</button>
                    <button class="btn-secondary" onclick="filterWaste('organic')">Organic</button>
                </div>
                <div class="map-markers">
                    <div class="marker plastic" style="top: 30%; left: 25%;">📍</div>
                    <div class="marker organic" style="top: 60%; left: 70%;">📍</div>
                    <div class="marker electronic" style="top: 45%; left: 50%;">📍</div>
                </div>
            </div>
        `;
    }
}

function reportWaste() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const wasteType = prompt('What type of waste did you find?\n1. Plastic\n2. Organic\n3. Electronic\n4. Paper\n5. Other');
    const location = prompt('Where is this waste located? (Enter address or landmark)');
    
    if (wasteType && location) {
        const report = {
            id: generateId(),
            type: wasteType,
            location: location,
            reporter: currentUser.name,
            timestamp: new Date().toISOString(),
            status: 'reported'
        };
        
        wasteReports.push(report);
        
        // Award points to user
        currentUser.points += 50;
        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        
        showNotification(`Waste report submitted! You earned 50 points. Total: ${currentUser.points}`, 'success');
        updateDashboard();
    }
}

function filterWaste(type) {
    showNotification(`Filtering waste map for: ${type}`, 'info');
}

// Utility Functions
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function setupSmoothScrolling() {
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
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all feature cards and other animated elements
    document.querySelectorAll('.feature-card, .dashboard-card, .feed-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function setupFormHandlers() {
    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submit';
                }, 2000);
            }
        });
    });
}

function loadDemoData() {
    // Load sample challenges
    challenges = [
        {
            id: 1,
            name: 'Plastic-Free Week',
            description: 'Avoid single-use plastics for a week',
            points: 200,
            participants: 1250,
            timeLeft: '3 days'
        },
        {
            id: 2,
            name: 'Green Commute Challenge',
            description: 'Use eco-friendly transport for work',
            points: 150,
            participants: 890,
            timeLeft: '1 week'
        },
        {
            id: 3,
            name: 'Zero Waste Day',
            description: 'Produce no waste for 24 hours',
            points: 100,
            participants: 2100,
            timeLeft: '2 days'
        }
    ];
    
    // Load sample waste reports
    wasteReports = [
        {
            id: 1,
            type: 'Plastic',
            location: 'Sector 18, Noida',
            reporter: 'Anonymous',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'reported'
        },
        {
            id: 2,
            type: 'Organic',
            location: 'MG Road, Bangalore',
            reporter: 'EcoWarrior123',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress'
        }
    ];
}

// Initialize impact chart (placeholder for Chart.js)
function initializeImpactChart() {
    const canvas = document.getElementById('impactChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        // This would integrate with Chart.js in a real implementation
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Impact Chart', canvas.width/2, canvas.height/2);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    .floating-card {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .map-simulation {
        position: relative;
        height: 300px;
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        border-radius: 10px;
        padding: 20px;
        text-align: center;
    }
    
    .map-markers {
        position: relative;
        height: 200px;
        margin-top: 20px;
    }
    
    .marker {
        position: absolute;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .marker:hover {
        transform: scale(1.2);
    }
    
    .challenge-bar {
        height: 8px;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .challenge-progress {
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);

// Initialize chart when page loads
setTimeout(initializeImpactChart, 1000);