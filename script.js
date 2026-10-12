// State Aplikasi
let state = {
    isLoggedIn: false,
    user: {
        name: 'Nelayan Tamu',
        phone: 'Belum Login',
        boat: 'Kapal Tanpa Nama'
    },
    fuelPercent: 100,
    isSailing: false,
    startTime: null,
    timerInterval: null,
    mapDrawn: false,
    navDrawn: false,
    currentScreen: 'screen-home',
    language: 'id',
    theme: 'light',
    history: []
};

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    updateProfileUI();
});

function resizeCanvas() {
    const mapCanvas = document.getElementById('mapCanvas');
    const navCanvas = document.getElementById('navCanvas');
    if(mapCanvas) {
        mapCanvas.width = mapCanvas.parentElement.clientWidth;
        mapCanvas.height = mapCanvas.parentElement.clientHeight;
    }
    if(navCanvas) {
        navCanvas.width = navCanvas.parentElement.clientWidth;
        navCanvas.height = navCanvas.parentElement.clientHeight;
    }
    if(state.mapDrawn) drawMap('mapCanvas', false);
    if(state.navDrawn) drawMap('navCanvas', true);
}

// --- PENGATURAN & BAHASA ---
function loadSettings() {
    const savedTheme = localStorage.getItem('fishguard_theme');
    if (savedTheme === 'dark') {
        state.theme = 'dark';
        document.body.classList.add('dark-mode');
        document.getElementById('current-theme').innerText = 'Gelap';
    }
    
    const savedLang = localStorage.getItem('fishguard_lang');
    if (savedLang) {
        state.language = savedLang;
        applyLanguage();
    }
    
    const savedHistory = localStorage.getItem('fishguard_history');
    if (savedHistory) {
        state.history = JSON.parse(savedHistory);
        document.getElementById('history-count').innerText = state.history.length + ' Kali';
    }
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    if (state.theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('current-theme').innerText = 'Gelap';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('current-theme').innerText = 'Terang';
    }
    localStorage.setItem('fishguard_theme', state.theme);
    // Redraw map agar warna menyesuaikan
    if(state.mapDrawn) drawMap('mapCanvas', false);
    if(state.navDrawn) drawMap('navCanvas', true);
}

function toggleLanguage() {
    state.language = state.language === 'id' ? 'en' : 'id';
    localStorage.setItem('fishguard_lang', state.language);
    applyLanguage();
}

function applyLanguage() {
    const translations = {
        id: {
            welcome: "Selamat Datang",
            tagline: "Navigasi Aman, Tangkapan Maksimal",
            login_btn: "Masuk",
            guest_btn: "Masuk sebagai Tamu",
            or: "atau",
            weather_title: "Info Cuaca & Gelombang",
            safe_badge: "LAYAK MELAUT",
            weather_cond: "Cuaca",
            weather_cond_val: "Cerah Berawan",
            weather_wave: "Tinggi Gelombang",
            weather_wind: "Kecepatan Angin",
            quick_menu: "Menu Cepat",
            menu_fuel: "Hitung BBM",
            menu_fish: "Cari Ikan",
            menu_nav: "Navigasi",
            menu_profile: "Profil",
            sos_btn: "TOMBOL SOS (DARURAT)",
            fuel_title: "Hitung Bahan Bakar",
            fuel_duration: "Durasi Berlayar (Jam)",
            fuel_power: "Daya Mesin (HP/PK)",
            fuel_condition: "Kondisi Mesin",
            fuel_calc_btn: "Hitung Estimasi",
            fuel_result_title: "Rincian Estimasi Solar",
            bd_power: "Daya Mesin",
            bd_duration: "Durasi",
            bd_condition: "Kondisi Mesin",
            bd_base: "Konsumsi Dasar",
            bd_factor: "Faktor Usia",
            bd_total: "Total Estimasi",
            fuel_note: "Harap bawa cadangan 10% lebih banyak.",
            map_offline: "Offline",
            map_legend_boat: "Kapal Anda",
            map_legend_fish: "Potensi Ikan",
            nav_start: "Mulai",
            nav_guide: "Pandu Pulang",
            nav_finish: "Selesai",
            trip_summary: "Ringkasan Pelayaran",
            trip_time: "Waktu:",
            trip_fuel: "Sisa BBM:",
            trip_status: "Status:",
            profile_lang: "Bahasa",
            profile_theme: "Mode Tampilan",
            profile_history: "Riwayat Pelayaran",
            profile_logout: "Keluar",
            edit_title: "Edit Profil",
            edit_name: "Nama Lengkap",
            edit_phone: "Nomor HP",
            edit_boat: "Nama Kapal",
            edit_save: "Simpan Perubahan",
            nav_home: "Beranda",
            nav_map: "Peta",
            nav_nav: "Navigasi",
            nav_fuel: "BBM",
            nav_profile: "Profil"
        },
        en: {
            welcome: "Welcome",
            tagline: "Safe Navigation, Maximum Catch",
            login_btn: "Login",
            guest_btn: "Login as Guest",
            or: "or",
            weather_title: "Weather & Wave Info",
            safe_badge: "SAFE TO SAIL",
            weather_cond: "Weather",
            weather_cond_val: "Partly Cloudy",
            weather_wave: "Wave Height",
            weather_wind: "Wind Speed",
            quick_menu: "Quick Menu",
            menu_fuel: "Fuel Calc",
            menu_fish: "Find Fish",
            menu_nav: "Navigation",
            menu_profile: "Profile",
            sos_btn: "SOS BUTTON (EMERGENCY)",
            fuel_title: "Fuel Calculation",
            fuel_duration: "Sailing Duration (Hours)",
            fuel_power: "Engine Power (HP/PK)",
            fuel_condition: "Engine Condition",
            fuel_calc_btn: "Calculate Estimate",
            fuel_result_title: "Fuel Estimation Details",
            bd_power: "Engine Power",
            bd_duration: "Duration",
            bd_condition: "Engine Condition",
            bd_base: "Base Consumption",
            bd_factor: "Age Factor",
            bd_total: "Total Estimate",
            fuel_note: "Please bring 10% extra reserve.",
            map_offline: "Offline",
            map_legend_boat: "Your Boat",
            map_legend_fish: "Fish Potential",
            nav_start: "Start",
            nav_guide: "Guide Home",
            nav_finish: "Finish",
            trip_summary: "Sailing Summary",
            trip_time: "Time:",
            trip_fuel: "Fuel Left:",
            trip_status: "Status:",
            profile_lang: "Language",
            profile_theme: "Theme Mode",
            profile_history: "Sailing History",
            profile_logout: "Logout",
            edit_title: "Edit Profile",
            edit_name: "Full Name",
            edit_phone: "Phone Number",
            edit_boat: "Boat Name",
            edit_save: "Save Changes",
            nav_home: "Home",
            nav_map: "Map",
            nav_nav: "Nav",
            nav_fuel: "Fuel",
            nav_profile: "Profile"
        }
    };

    const langData = translations[state.language];
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (langData[key]) {
            el.innerText = langData[key];
        }
    });
    
    document.getElementById('current-lang').innerText = state.language === 'id' ? 'Indonesia' : 'English';
}

// --- NAVIGASI ANTAR SCREEN ---
function showScreen(screenId) {
    state.currentScreen = screenId;
    
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(screenId === 'screen-home') document.getElementById('nav-home').classList.add('active');
    if(screenId === 'screen-map') {
        document.getElementById('nav-map').classList.add('active');
        if (!state.mapDrawn) { drawMap('mapCanvas', false); state.mapDrawn = true; }
    }
    if(screenId === 'screen-nav') {
        document.getElementById('nav-nav').classList.add('active');
        if (!state.navDrawn) { drawMap('navCanvas', true); state.navDrawn = true; }
    }
    if(screenId === 'screen-fuel') document.getElementById('nav-fuel').classList.add('active');
    if(screenId === 'screen-profile' || screenId === 'screen-edit-profile') document.getElementById('nav-profile').classList.add('active');
}

// --- LOGIN & PROFIL ---
function login() {
    const phone = document.getElementById('phone-input').value;
    if (phone) {
        state.isLoggedIn = true;
        state.user.name = 'Nelayan ' + phone.substring(0, 4);
        state.user.phone = phone;
        updateProfileUI();
        showScreen('screen-home');
    } else {
        alert('Masukkan nomor HP terlebih dahulu!');
    }
}

function loginAsGuest() {
    state.isLoggedIn = true;
    state.user.name = 'Nelayan Tamu';
    state.user.phone = 'Belum Login';
    updateProfileUI();
    showScreen('screen-home');
}

function updateProfileUI() {
    document.getElementById('profile-name').innerText = state.user.name;
    document.getElementById('profile-phone').innerText = state.user.phone;
    document.getElementById('edit-name').value = state.user.name;
    document.getElementById('edit-phone').value = state.user.phone;
    document.getElementById('edit-boat').value = state.user.boat;
}

function saveProfile() {
    state.user.name = document.getElementById('edit-name').value || 'Nelayan';
    state.user.phone = document.getElementById('edit-phone').value || 'Belum Login';
    state.user.boat = document.getElementById('edit-boat').value || 'Kapal Tanpa Nama';
    updateProfileUI();
    alert('Profil berhasil disimpan!');
    showScreen('screen-profile');
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        state.isLoggedIn = false;
        state.user = { name: 'Nelayan Tamu', phone: 'Belum Login', boat: 'Kapal Tanpa Nama' };
        updateProfileUI();
        showScreen('screen-login');
    }
}

function showHistory() {
    if (state.history.length === 0) {
        alert('Belum ada riwayat pelayaran.');
        return;
    }
    let historyText = 'Riwayat Pelayaran:\n\n';
    state.history.forEach((h, i) => {
        historyText += `${i+1}. ${h.date} | ${h.duration} Jam | Sisa BBM: ${h.fuel}%\n`;
    });
    alert(historyText);
}

// --- HITUNG BBM ---
function calculateFuel() {
    const duration = parseFloat(document.getElementById('duration').value);
    const power = parseFloat(document.getElementById('engine-power').value);
    const condition = parseFloat(document.getElementById('engine-condition').value);
    const conditionText = document.getElementById('engine-condition').options[document.getElementById('engine-condition').selectedIndex].text;

    if (isNaN(duration) || duration <= 0) {
        alert('Masukkan durasi yang valid (minimal 1 jam)!');
        return;
    }

    // Rumus simulasi: (HP * Durasi * 0.2) * Faktor Kondisi
    const baseFuel = power * duration * 0.2;
    const totalFuel = (baseFuel * condition).toFixed(1);

    // Update Breakdown
    document.getElementById('bd-power').innerText = power + ' HP';
    document.getElementById('bd-duration').innerText = duration + ' Jam';
    document.getElementById('bd-condition').innerText = conditionText.split('(')[0];
    document.getElementById('bd-base').innerText = baseFuel.toFixed(1) + ' Liter';
    document.getElementById('bd-factor').innerText = 'x ' + condition;
    document.getElementById('bd-total').innerText = totalFuel + ' Liter';

    const resultEl = document.getElementById('fuel-result');
    resultEl.classList.remove('hidden');
    
    setTimeout(() => {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
}

// --- PETA & CANVAS DRAWING ---
function drawMap(canvasId, isNavMode = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const isDark = document.body.classList.contains('dark-mode');

    // Background Peta
    ctx.fillStyle = isDark ? '#0f172a' : '#e0f2fe';
    ctx.fillRect(0, 0, width, height);

    // Grid Peta
    ctx.strokeStyle = isDark ? '#1e293b' : '#bae6fd';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Lingkaran Radar
    ctx.strokeStyle = isDark ? '#334155' : '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(width / 2, height / 2, 180, 0, Math.PI * 2); ctx.stroke();

    // Titik Kapal
    ctx.fillStyle = '#0077b6';
    ctx.beginPath(); ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2); ctx.fill();
    
    // Ikon Kapal
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Font Awesome 6 Free"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uf21a', width / 2, height / 2);

    if (isNavMode) {
        // Rute Pandu Pulang
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(60, height - 100);
        ctx.stroke();
        ctx.setLineDash([]);

        // Titik Awal
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(60, height - 100, 10, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = isDark ? '#f8fafc' : '#03045e';
        ctx.font = 'bold 12px Inter';
        ctx.fillText('Titik Awal', 60, height - 80);
    } else {
        // Sebaran Ikan
        ctx.fillStyle = '#10b981';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * (width - 100) + 50;
            const y = Math.random() * (height - 150) + 50;
            if (Math.abs(x - width/2) < 50 && Math.abs(y - height/2) < 50) continue;
            
            ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
            
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
        }
    }
}

function markSpot() {
    const fab = document.querySelector('.fab');
    fab.style.transform = 'scale(0.8)';
    setTimeout(() => fab.style.transform = 'scale(1)', 200);
    alert('📍 Spot berhasil ditandai!\nKoordinat lokasi ikan telah disimpan.');
}

function toggleOffline() {
    alert('📥 Peta berhasil diunduh untuk mode offline.\nAnda dapat mengakses peta ini tanpa sinyal internet.');
}

// --- NAVIGASI RUTE ---
function startSailing() {
    if (state.isSailing) return;
    
    state.isSailing = true;
    state.startTime = Date.now();
    state.fuelPercent = 100;
    state.navDrawn = false;
    drawMap('navCanvas', true);
    
    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-guide').disabled = false;
    document.getElementById('btn-finish').disabled = false;
    document.getElementById('trip-summary').classList.add('hidden');
    document.getElementById('nav-fuel-percent').innerText = state.fuelPercent;
    document.getElementById('fuel-indicator').classList.remove('danger');
    
    state.timerInterval = setInterval(() => {
        if (state.fuelPercent > 0) {
            state.fuelPercent -= 1;
            document.getElementById('nav-fuel-percent').innerText = state.fuelPercent;
            
            if (state.fuelPercent === 20) {
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                document.getElementById('fuel-indicator').classList.add('danger');
            }
            if (state.fuelPercent === 10) {
                alert('🚨 BAHAYA: Sisa BBM 10%!\nSegera kembali ke pelabuhan.');
            }
        } else {
            clearInterval(state.timerInterval);
            alert('⛔ BBM HABIS! Mesin mati. Gunakan tombol SOS.');
            finishSailing();
        }
    }, 3000);
}

function guideHome() {
    if (!state.isSailing) return;
    state.navDrawn = false;
    drawMap('navCanvas', true);
    alert('🏠 Rute pandu pulang telah ditampilkan.\nIkuti garis putus-putus oranye untuk kembali.');
}

function finishSailing() {
    if (!state.isSailing) return;
    
    clearInterval(state.timerInterval);
    state.isSailing = false;
    
    document.getElementById('btn-start').disabled = false;
    document.getElementById('btn-guide').disabled = true;
    document.getElementById('btn-finish').disabled = true;
    
    const durationHours = ((Date.now() - state.startTime) / (1000 * 60 * 60)).toFixed(1);
    
    document.getElementById('sum-time').innerText = durationHours + ' Jam';
    document.getElementById('sum-fuel').innerText = state.fuelPercent + '%';
    
    const statusEl = document.getElementById('sum-status');
    if (state.fuelPercent < 15) {
        statusEl.innerText = 'TERKENDALA (BBM Kritis)';
        statusEl.style.color = 'var(--danger)';
    } else {
        statusEl.innerText = 'AMAN';
        statusEl.style.color = 'var(--accent)';
    }
    
    // Simpan ke Riwayat
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    state.history.push({
        date: dateStr,
        duration: durationHours,
        fuel: state.fuelPercent
    });
    localStorage.setItem('fishguard_history', JSON.stringify(state.history));
    document.getElementById('history-count').innerText = state.history.length + ' Kali';
    
    document.getElementById('trip-summary').classList.remove('hidden');
    document.getElementById('trip-summary').scrollIntoView({ behavior: 'smooth' });
}

// --- SOS MODAL ---
function openSOSModal() {
    document.getElementById('sos-modal').classList.add('show');
}

function closeSOSModal() {
    document.getElementById('sos-modal').classList.remove('show');
}

function sendSOS() {
    closeSOSModal();
    if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
    
    setTimeout(() => {
        alert('✅ SINYAL SOS TERKIRIM!\n\nKoordinat: -6.2088, 106.8456\nBantuan sedang dalam perjalanan. Tetap tenang.');
    }, 300);
}