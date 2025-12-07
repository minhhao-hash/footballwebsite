// js/app.js - Xử lý logic chính của website

// State management
let favorites = JSON.parse(localStorage.getItem('favoritePlayers')) || [];
let currentTab = 'players';
let searchTerm = '';
let filterPosition = 'all';
let filterNationality = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateFavoriteCount();
    renderPlayers();
    renderTeams();
    populateFilters();
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchTerm = e.target.value;
        renderPlayers();
    });

    // Filters
    document.getElementById('toggleFilter').addEventListener('click', function() {
        const filterOptions = document.getElementById('filterOptions');
        filterOptions.style.display = filterOptions.style.display === 'none' ? 'grid' : 'none';
    });

    document.getElementById('positionFilter').addEventListener('change', function(e) {
        filterPosition = e.target.value;
        renderPlayers();
    });

    document.getElementById('nationalityFilter').addEventListener('change', function(e) {
        filterNationality = e.target.value;
        renderPlayers();
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('playerModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// Tab switching
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'players') {
        document.getElementById('playersTab').classList.add('active');
    } else if (tabName === 'teams') {
        document.getElementById('teamsTab').classList.add('active');
    } else if (tabName === 'favorites') {
        document.getElementById('favoritesTab').classList.add('active');
        renderFavorites();
    }
}

// Filter players
function getFilteredPlayers() {
    return playersData.filter(player => {
        const matchesSearch =
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.club.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPosition =
            filterPosition === 'all' ||
            player.position.toLowerCase().includes(filterPosition.toLowerCase());

        const matchesNationality =
            filterNationality === 'all' ||
            player.nationality === filterNationality;

        return matchesSearch && matchesPosition && matchesNationality;
    });
}

// Render functions
function renderPlayers() {
    const grid = document.getElementById('playersGrid');
    const filteredPlayers = getFilteredPlayers();
    
    if (filteredPlayers.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>Không tìm thấy cầu thủ nào</p></div>';
        return;
    }
    
    grid.innerHTML = filteredPlayers.map(player => createPlayerCard(player)).join('');
    attachPlayerCardListeners();
}

function renderTeams() {
   const grid = document.getElementById('teamsGrid');
grid.innerHTML = teamsData.map(team => `
    <div class="team-card" onclick="openTeamModal(${team.id})">
        <div class="team-header">
            <div class="team-logo">
                <img src="${team.logo}" alt="${team.name} logo">
            </div>
            <div class="team-info">
                <h3>${team.name}</h3>
                <p>${team.country}</p>
            </div>
        </div>
        <div class="team-stats">
            <span>Số cầu thủ:</span>
            <span>${team.players}</span>
        </div>
    </div>
`).join('');

}
function openTeamModal(teamId) {
    const team = teamsData.find(t => t.id === teamId);

    document.getElementById("teamModalImg").src = team.logo;
    document.getElementById("teamModalName").innerText = team.name;
    document.getElementById("teamModalCountry").innerText = team.countryFull || team.country;

    document.getElementById("teamModalFounded").innerText = team.founded || "Chưa có dữ liệu";
    document.getElementById("teamModalStadium").innerText = team.stadium || "Chưa có dữ liệu";
    document.getElementById("teamModalCapacity").innerText = team.capacity ? team.capacity.toLocaleString() + ' chỗ' : "Chưa có dữ liệu";
    document.getElementById("teamModalCoach").innerText = team.coach || "Chưa có dữ liệu";

    document.getElementById("teamModalPlayers").innerText = team.players;
    document.getElementById("teamModalLeague").innerText = team.league || "Chưa có dữ liệu";

    document.getElementById("teamModal").classList.add("active");
}

function closeTeamModal() {
    document.getElementById("teamModal").classList.remove("active");
}


function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    const empty = document.getElementById('emptyFavorites');
    const favoritePlayers = playersData.filter(p => favorites.includes(p.id));
    
    if (favoritePlayers.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        grid.innerHTML = favoritePlayers.map(player => createPlayerCard(player)).join('');
        attachPlayerCardListeners();
    }
}

function createPlayerCard(player) {
    const isFavorite = favorites.includes(player.id);
    return `
        <div class="player-card">
            <div class="player-image">
                <img src="${player.image}" alt="${player.name}">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${player.id}">
                    <svg viewBox="0 0 24 24" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
                <div class="player-overlay">
                    <h3>${player.name}</h3>
                    <p>${player.club}</p>
                </div>
            </div>
            <div class="player-info">
                <div class="player-stats-row">
                    <div class="stat-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>${player.age} tuổi</span>
                    </div>
                    <div class="stat-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>${player.nationality}</span>
                    </div>
                    <div class="stat-item" style="grid-column: 1 / -1;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                            <polyline points="17 6 23 6 23 12"/>
                        </svg>
                        <span><strong>${player.position}</strong></span>
                    </div>
                </div>
                <div class="player-numbers">
                    <div>
                        <div class="stat-number goals">${player.goals}</div>
                        <div class="stat-label">Bàn thắng</div>
                    </div>
                    <div>
                        <div class="stat-number assists">${player.assists}</div>
                        <div class="stat-label">Kiến tạo</div>
                    </div>
                    <div>
                        <div class="stat-number rating">${player.rating}</div>
                        <div class="stat-label">Đánh giá</div>
                    </div>
                </div>
                <button class="detail-btn" data-id="${player.id}">Xem chi tiết</button>
            </div>
        </div>
    `;
}

function attachPlayerCardListeners() {
    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(parseInt(this.dataset.id));
        });
    });

    // Detail buttons
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showPlayerDetail(parseInt(this.dataset.id));
        });
    });
}

// Favorites management
function toggleFavorite(playerId) {
    if (favorites.includes(playerId)) {
        favorites = favorites.filter(id => id !== playerId);
    } else {
        favorites.push(playerId);
    }
    
    localStorage.setItem('favoritePlayers', JSON.stringify(favorites));
    updateFavoriteCount();
    
    // Re-render current view
    if (currentTab === 'players') {
        renderPlayers();
    } else if (currentTab === 'favorites') {
        renderFavorites();
    }
}

function updateFavoriteCount() {
    document.getElementById('favoriteCount').textContent = favorites.length;
}

// Modal
function showPlayerDetail(playerId) {
    const player = playersData.find(p => p.id === playerId);
    if (!player) return;
    
    const isFavorite = favorites.includes(playerId);
    
    document.getElementById('modalBody').innerHTML = `
        <img src="${player.image}" alt="${player.name}" class="modal-header-img">
        <div style="padding: 1.5rem;">
            <div class="modal-title-section">
                <div class="modal-title">
                    <h2>${player.name}</h2>
                    <p>${player.club}</p>
                </div>
                <button class="modal-favorite-btn ${isFavorite ? 'active' : ''}" data-id="${player.id}">
                    <svg viewBox="0 0 24 24" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <div class="modal-info-text">
                        <div class="label">Tuổi</div>
                        <div class="value">${player.age}</div>
                    </div>
                </div>
                <div class="modal-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div class="modal-info-text">
                        <div class="label">Quốc tịch</div>
                        <div class="value">${player.nationality}</div>
                    </div>
                </div>
                <div class="modal-info-item" style="grid-column: 1 / -1;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                    </svg>
                    <div class="modal-info-text">
                        <div class="label">Vị trí</div>
                        <div class="value">${player.position}</div>
                    </div>
                </div>
            </div>
            
            <div class="modal-stats-section">
                <h3>Thống kê sự nghiệp</h3>
                <div class="modal-stats-grid">
                    <div class="modal-stat-card">
                        <div class="number" style="color: #2563eb;">${player.goals}</div>
                        <div class="label">Bàn thắng</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="number" style="color: #10b981;">${player.assists}</div>
                        <div class="label">Kiến tạo</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="number" style="color: #9333ea;">${player.matches}</div>
                        <div class="label">Trận đấu</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="number" style="color: #f97316;">${player.rating}</div>
                        <div class="label">Đánh giá</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Attach favorite button listener in modal
    document.querySelector('.modal-favorite-btn').addEventListener('click', function() {
        toggleFavorite(parseInt(this.dataset.id));
        showPlayerDetail(playerId); // Refresh modal
    });
    
    document.getElementById('playerModal').classList.add('active');
}

function closeModal() {
    document.getElementById('playerModal').classList.remove('active');
}

// Populate filter options
function populateFilters() {
    const nationalities = [...new Set(playersData.map(p => p.nationality))];
    const nationalitySelect = document.getElementById('nationalityFilter');
    
    nationalities.forEach(nat => {
        const option = document.createElement('option');
        option.value = nat;
        option.textContent = nat;
        nationalitySelect.appendChild(option);
    });
}

