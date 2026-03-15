/**
 * AgriGrow - Intercropping App
 * Smart Intercropping Planning System
 * Pure Vanilla JavaScript Implementation
 */

// =============================================
// Application State Management
// =============================================

const AppState = {
    plans: [],
    settings: {
        unit: 'metric',
        theme: 'light'
    },
    currentPage: 'dashboard',

    // Comprehensive Crop Database
    crops: [
        {
            id: 'corn',
            name: 'Corn',
            emoji: '🌽',
            seasons: ['spring', 'summer'],
            description: 'Tall grain crop providing structure for climbing plants and nitrogen depletion.',
            nitrogen: -40,
            water: 'high',
            height: 'tall'
        },
        {
            id: 'beans',
            name: 'Beans',
            emoji: '🫘',
            seasons: ['spring', 'summer', 'fall'],
            description: 'Nitrogen-fixing legume, excellent companion plant that enriches soil.',
            nitrogen: 40,
            water: 'medium',
            height: 'medium'
        },
        {
            id: 'squash',
            name: 'Squash',
            emoji: '🎃',
            seasons: ['summer', 'fall'],
            description: 'Ground cover crop that suppresses weeds and retains soil moisture.',
            nitrogen: -10,
            water: 'high',
            height: 'low'
        },
        {
            id: 'wheat',
            name: 'Wheat',
            emoji: '🌾',
            seasons: ['winter', 'spring'],
            description: 'Grain crop with allelopathic properties affecting companion growth.',
            nitrogen: -30,
            water: 'medium',
            height: 'tall'
        },
        {
            id: 'peas',
            name: 'Peas',
            emoji: '🫛',
            seasons: ['spring', 'fall', 'winter'],
            description: 'Nitrogen-fixing legume, climbing variety works well in intercropping.',
            nitrogen: 35,
            water: 'medium',
            height: 'medium'
        },
        {
            id: 'lettuce',
            name: 'Lettuce',
            emoji: '🥬',
            seasons: ['spring', 'fall', 'winter'],
            description: 'Shade-tolerant leafy green, excellent understory crop under taller plants.',
            nitrogen: -15,
            water: 'medium',
            height: 'low'
        },
        {
            id: 'tomato',
            name: 'Tomato',
            emoji: '🍅',
            seasons: ['spring', 'summer'],
            description: 'Popular vegetable requiring support, benefits from companion crops.',
            nitrogen: -25,
            water: 'high',
            height: 'medium'
        },
        {
            id: 'carrot',
            name: 'Carrot',
            emoji: '🥕',
            seasons: ['spring', 'fall', 'winter'],
            description: 'Root vegetable, minimal nutrient requirements, useful for soil structure.',
            nitrogen: -10,
            water: 'medium',
            height: 'low'
        }
    ],

    // Compatibility Matrix (0-100 score)
    compatibility: {
        corn: { beans: 90, squash: 85, wheat: 20, peas: 88, lettuce: 60, tomato: 50, carrot: 65 },
        beans: { corn: 90, squash: 95, wheat: 70, peas: 60, lettuce: 85, tomato: 75, carrot: 80 },
        squash: { corn: 85, beans: 95, wheat: 30, peas: 70, lettuce: 80, tomato: 70, carrot: 75 },
        wheat: { corn: 20, beans: 70, squash: 30, peas: 65, lettuce: 50, tomato: 40, carrot: 55 },
        peas: { corn: 88, beans: 60, squash: 70, wheat: 65, lettuce: 85, tomato: 80, carrot: 75 },
        lettuce: { corn: 60, beans: 85, squash: 80, wheat: 50, peas: 85, tomato: 70, carrot: 80 },
        tomato: { corn: 50, beans: 75, squash: 70, wheat: 40, peas: 80, lettuce: 70, carrot: 70 },
        carrot: { corn: 65, beans: 80, squash: 75, wheat: 55, peas: 75, lettuce: 80, tomato: 70 }
    }
};

// =============================================
// Initialization
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadFromLocalStorage();
    setupEventListeners();
    renderCropsChecklist();
    renderCompatibilitySelects();
    renderCropsGrid();
    updateDashboard();
    setupPageNavigation();
}

// =============================================
// Event Listeners Setup
// =============================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handlePageNavigation);
    });

    // Planner form
    const planForm = document.getElementById('plan-form');
    if (planForm) {
        planForm.addEventListener('submit', handleCreatePlan);
    }

    // Crop search
    const cropSearch = document.getElementById('crop-search');
    if (cropSearch) {
        cropSearch.addEventListener('input', handleCropSearch);
    }

    // Season filter
    const seasonFilter = document.getElementById('season-filter');
    if (seasonFilter) {
        seasonFilter.addEventListener('change', handleSeasonFilter);
    }

    // Compatibility check
    const checkCompatBtn = document.getElementById('check-compat');
    if (checkCompatBtn) {
        checkCompatBtn.addEventListener('click', handleCheckCompatibility);
    }

    // Settings
    const exportBtn = document.getElementById('export-data');
    const importBtn = document.getElementById('import-data');
    const clearBtn = document.getElementById('clear-data');

    if (exportBtn) exportBtn.addEventListener('click', handleExportData);
    if (importBtn) importBtn.addEventListener('click', handleImportData);
    if (clearBtn) clearBtn.addEventListener('click', handleClearData);

    // Settings changes
    const unitSelect = document.getElementById('unit-system');
    if (unitSelect) {
        unitSelect.addEventListener('change', (e) => {
            AppState.settings.unit = e.target.value;
            saveToLocalStorage();
        });
    }
}

// =============================================
// Page Navigation
// =============================================

function setupPageNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageName = e.currentTarget.getAttribute('data-page');
            switchPage(pageName);
        });
    });
}

function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected page
    const pageElement = document.getElementById(`${pageName}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Mark nav button as active
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Update state
    AppState.currentPage = pageName;

    // Refresh page-specific content
    if (pageName === 'planner') {
        renderPlansList();
    } else if (pageName === 'crops') {
        renderCropsGrid();
    } else if (pageName === 'compatibility') {
        renderCompatibilityMatrix();
    } else if (pageName === 'dashboard') {
        updateDashboard();
    }
}

function handlePageNavigation(e) {
    const page = e.currentTarget.getAttribute('data-page');
    switchPage(page);
}

// =============================================
// Plan Management
// =============================================

function handleCreatePlan(e) {
    e.preventDefault();

    const name = document.getElementById('plan-name').value.trim();
    const area = parseFloat(document.getElementById('plan-area').value);
    const season = document.getElementById('plan-season').value;
    const selectedCrops = Array.from(document.querySelectorAll('.crops-checklist input:checked'))
        .map(checkbox => checkbox.value);

    // Validation
    if (!name) {
        showNotification('Please enter a plan name', 'error');
        return;
    }

    if (!area || area <= 0) {
        showNotification('Please enter a valid area', 'error');
        return;
    }

    if (!season) {
        showNotification('Please select a season', 'error');
        return;
    }

    if (selectedCrops.length < 2) {
        showNotification('Select at least 2 crops for intercropping', 'error');
        return;
    }

    // Create plan
    const plan = {
        id: Date.now(),
        name,
        area,
        season,
        crops: selectedCrops,
        createdDate: new Date().toLocaleDateString(),
        compatibility: calculateAverageCompatibility(selectedCrops)
    };

    // Add to state
    AppState.plans.push(plan);
    saveToLocalStorage();

    // Clear form
    e.target.reset();
    showNotification(`Plan "${name}" created successfully!`, 'success');

    // Update UI
    renderPlansList();
    updateDashboard();
}

function calculateAverageCompatibility(crops) {
    if (crops.length < 2) return 0;

    let totalScore = 0;
    let pairCount = 0;

    for (let i = 0; i < crops.length; i++) {
        for (let j = i + 1; j < crops.length; j++) {
            const score = AppState.compatibility[crops[i]]?.[crops[j]] || 0;
            totalScore += score;
            pairCount++;
        }
    }

    return Math.round(totalScore / pairCount);
}

function renderPlansList() {
    const plansList = document.getElementById('plans-list');
    if (!plansList) return;

    if (AppState.plans.length === 0) {
        plansList.innerHTML = '<p class="empty-state">No plans yet. Create one to get started!</p>';
        return;
    }

    plansList.innerHTML = AppState.plans.map(plan => createPlanCardHTML(plan)).join('');

    // Add event listeners
    document.querySelectorAll('.plan-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deletePlan(parseInt(e.target.getAttribute('data-id')));
        });
    });
}

function createPlanCardHTML(plan) {
    const cropNames = plan.crops.map(id => AppState.crops.find(c => c.id === id)?.name).join(', ');
    const cropEmojis = plan.crops.map(id => AppState.crops.find(c => c.id === id)?.emoji).join(' ');
    const estimatedYield = Math.round(plan.area * (25 + Math.random() * 20)) + ' tonnes';

    return `
        <div class="plan-card">
            <div class="plan-card-title">${escapeHtml(plan.name)}</div>
            <div class="plan-card-info">
                <div class="plan-info-item">
                    <span class="plan-label">Area:</span>
                    <span class="plan-value">${plan.area} hectares</span>
                </div>
                <div class="plan-info-item">
                    <span class="plan-label">Season:</span>
                    <span class="plan-value">${capitalize(plan.season)}</span>
                </div>
                <div class="plan-info-item">
                    <span class="plan-label">Compatibility:</span>
                    <span class="plan-value">${plan.compatibility}%</span>
                </div>
            </div>
            <div class="plan-crops">
                <span class="plan-crops-label">Crops:</span>
                <div class="plan-crops-tags">${cropEmojis}</div>
            </div>
            <div class="plan-card-info">
                <div class="plan-info-item">
                    <span class="plan-label">Est. Yield:</span>
                    <span class="plan-value">${estimatedYield}</span>
                </div>
            </div>
            <div class="plan-card-actions">
                <button class="btn btn-secondary plan-delete" data-id="${plan.id}">🗑️ Delete</button>
            </div>
        </div>
    `;
}

function deletePlan(id) {
    if (confirm('Are you sure you want to delete this plan?')) {
        AppState.plans = AppState.plans.filter(p => p.id !== id);
        saveToLocalStorage();
        renderPlansList();
        updateDashboard();
        showNotification('Plan deleted', 'success');
    }
}

// =============================================
// Crop Management
// =============================================

function renderCropsChecklist() {
    const checklist = document.getElementById('crops-checklist');
    if (!checklist) return;

    checklist.innerHTML = AppState.crops.map(crop => `
        <div class="crop-option">
            <input type="checkbox" class="crop-checkbox" value="${crop.id}" id="check-${crop.id}">
            <label for="check-${crop.id}">${crop.emoji} ${crop.name}</label>
        </div>
    `).join('');
}

function renderCropsGrid() {
    const grid = document.getElementById('crops-grid');
    if (!grid) return;

    const filtered = filterCrops();
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="empty-state">No crops found</p>';
        return;
    }

    grid.innerHTML = filtered.map(crop => `
        <div class="crop-card">
            <div class="crop-emoji">${crop.emoji}</div>
            <h3>${crop.name}</h3>
            <p class="crop-season">🌡️ ${crop.seasons.map(s => capitalize(s)).join(', ')}</p>
            <p class="crop-description">${crop.description}</p>
        </div>
    `).join('');
}

function filterCrops() {
    let filtered = AppState.crops;

    const searchTerm = document.getElementById('crop-search')?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(crop =>
            crop.name.toLowerCase().includes(searchTerm) ||
            crop.description.toLowerCase().includes(searchTerm)
        );
    }

    const season = document.getElementById('season-filter')?.value || '';
    if (season) {
        filtered = filtered.filter(crop => crop.seasons.includes(season));
    }

    return filtered;
}

function handleCropSearch() {
    renderCropsGrid();
}

function handleSeasonFilter() {
    renderCropsGrid();
}

// =============================================
// Compatibility Analysis
// =============================================

function renderCompatibilitySelects() {
    [document.getElementById('compat-crop1'), document.getElementById('compat-crop2')].forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Choose a crop...</option>' +
            AppState.crops.map(crop => `<option value="${crop.id}">${crop.emoji} ${crop.name}</option>`).join('');
    });
}

function handleCheckCompatibility() {
    const crop1 = document.getElementById('compat-crop1').value;
    const crop2 = document.getElementById('compat-crop2').value;

    if (!crop1 || !crop2) {
        showNotification('Please select two crops', 'error');
        return;
    }

    if (crop1 === crop2) {
        showNotification('Please select different crops', 'error');
        return;
    }

    const score = AppState.compatibility[crop1][crop2];
    const crop1Obj = AppState.crops.find(c => c.id === crop1);
    const crop2Obj = AppState.crops.find(c => c.id === crop2);

    let compatClass, compatText;
    if (score >= 80) {
        compatClass = 'compat-good';
        compatText = 'Excellent';
    } else if (score >= 60) {
        compatClass = 'compat-moderate';
        compatText = 'Good';
    } else {
        compatClass = 'compat-poor';
        compatText = 'Poor';
    }

    const resultHtml = `
        <div class="result-header">Compatibility Result</div>
        <div class="result-content">
            <div style="font-size: 1.5rem; text-align: center; margin: 1rem 0;">
                ${crop1Obj.emoji} + ${crop2Obj.emoji}
            </div>
            <div class="${compatClass}" style="padding: 1rem; border-radius: 0.5rem; text-align: center; font-size: 1.1rem;">
                ${compatText} Compatibility (${score}%)
            </div>
            <p style="margin-top: 1rem;">
                <strong>${crop1Obj.name}</strong> and <strong>${crop2Obj.name}</strong> have a ${compatText.toLowerCase()} 
                compatibility score of ${score}%. ${score >= 80 ? 'These crops work very well together!' : score >= 60 ? 'These crops can be grown together with proper spacing.' : 'Consider growing these crops separately for better results.'}
            </p>
        </div>
    `;

    const resultDiv = document.getElementById('compatibility-result');
    resultDiv.innerHTML = resultHtml;
    resultDiv.classList.remove('hidden');
}

function renderCompatibilityMatrix() {
    const matrixDiv = document.getElementById('compatibility-matrix');
    if (!matrixDiv) return;

    const crops = AppState.crops;
    let html = '<table class="table"><thead><tr><th>Crop 1</th><th>Crop 2</th><th>Score</th><th>Level</th></tr></thead><tbody>';

    for (let i = 0; i < crops.length; i++) {
        for (let j = i + 1; j < crops.length; j++) {
            const score = AppState.compatibility[crops[i].id][crops[j].id];
            let level = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Poor';
            let compatClass = score >= 80 ? 'compat-good' : score >= 60 ? 'compat-moderate' : 'compat-poor';

            html += `
                <tr>
                    <td>${crops[i].emoji} ${crops[i].name}</td>
                    <td>${crops[j].emoji} ${crops[j].name}</td>
                    <td>${score}%</td>
                    <td><span class="${compatClass}">${level}</span></td>
                </tr>
            `;
        }
    }

    html += '</tbody></table>';
    matrixDiv.innerHTML = html;
}

// =============================================
// Dashboard
// =============================================

function updateDashboard() {
    const totalPlans = AppState.plans.length;
    const totalCropsUsed = new Set();
    let totalCompatibility = 0;

    AppState.plans.forEach(plan => {
        plan.crops.forEach(crop => totalCropsUsed.add(crop));
        totalCompatibility += plan.compatibility;
    });

    document.getElementById('total-plans').textContent = totalPlans;
    document.getElementById('total-crops').textContent = totalCropsUsed.size;
    document.getElementById('avg-yield').textContent = '85%';
    document.getElementById('compatibility-score').textContent = totalPlans > 0 ? Math.round(totalCompatibility / totalPlans) + '%' : '0%';

    // Render recent plans
    const recentDiv = document.getElementById('dashboard-plans');
    if (recentDiv) {
        if (AppState.plans.length === 0) {
            recentDiv.innerHTML = '<p class="empty-state">No plans created yet. Create your first plan!</p>';
        } else {
            const recent = AppState.plans.slice(-3).reverse();
            recentDiv.innerHTML = recent.map(plan => createPlanCardHTML(plan)).join('');

            document.querySelectorAll('.plan-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    deletePlan(parseInt(e.target.getAttribute('data-id')));
                });
            });
        }
    }
}

// =============================================
// Data Management
// =============================================

function handleExportData() {
    const data = {
        plans: AppState.plans,
        settings: AppState.settings,
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriGrow-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully', 'success');
}

function handleImportData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                AppState.plans = data.plans || [];
                AppState.settings = data.settings || AppState.settings;
                saveToLocalStorage();
                updateDashboard();
                renderPlansList();
                showNotification('Data imported successfully', 'success');
            } catch (err) {
                showNotification('Error importing file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function handleClearData() {
    if (confirm('Are you sure? This will delete all your plans and cannot be undone.')) {
        AppState.plans = [];
        saveToLocalStorage();
        updateDashboard();
        renderPlansList();
        showNotification('All data cleared', 'success');
    }
}

// =============================================
// Local Storage
// =============================================

function saveToLocalStorage() {
    localStorage.setItem('AgriGrow_data', JSON.stringify({
        plans: AppState.plans,
        settings: AppState.settings
    }));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('AgriGrow_data');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            AppState.plans = data.plans || [];
            AppState.settings = data.settings || AppState.settings;
        } catch (err) {
            console.error('Error loading data:', err);
        }
    }
}

// =============================================
// Utilities
// =============================================

function showNotification(message, type = 'info') {
    const div = document.createElement('div');
    div.className = type === 'error' ? 'error-message' : type === 'success' ? 'success-message' : 'info-message';
    div.textContent = message;

    const main = document.querySelector('.main-content');
    main.insertBefore(div, main.firstChild);

    setTimeout(() => div.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================
// Auto-save on visibility change
// =============================================

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        saveToLocalStorage();
    }
});

window.addEventListener('beforeunload', () => {
    saveToLocalStorage();
});
