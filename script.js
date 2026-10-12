// State Aplikasi
let state = {
    isLoggedIn: false,
    fuelPercent: 100,
    isSailing: false,
    startTime: null,
    timerInterval: null,
    mapDrawn: false,
    navDrawn: false,
    currentScreen: 'screen-home'
};

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // Perbaikan tinggi canvas agar responsif
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
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
    // Gambar ulang jika sudah pernah digambar
    if(state.mapDrawn) drawMap('mapCanvas', false);
    if(state.navDrawn) drawMap('navCanvas', true);
}

// --- NAVIGASI ANTAR SCREEN ---
function showScreen(screenId) {
    state.currentScreen = screenId;
    
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    // Update Bottom Nav Active State
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
}

// --- LOGIN ---
function login() {
    const phone = document.getElementById('phone-input').value;
    if (phone) {
        state.isLoggedIn = true;
        showScreen('screen-home');
    } else {
        alert('Masukkan nomor HP terlebih dahulu!');
    }
}

function loginAsGuest() {
    state.isLoggedIn = true;
    showScreen('screen-home');
}

// --- HITUNG BBM ---
function calculateFuel() {
    const duration = parseFloat(document.getElementById('duration').value);
    const power = parseFloat(document.getElementById('engine-power').value);
    const condition = parseFloat(document.getElementById('engine-condition').value);

    if (isNaN(duration) || duration <= 0) {
        alert('Masukkan durasi yang valid (minimal 1 jam)!');
        return;
    }

    // Rumus simulasi: (HP * Durasi * 0.2) * Faktor Kondisi
    const baseFuel = power * duration * 0.2;
    const totalFuel = (baseFuel * condition).toFixed(1);

    document.getElementById('fuel-liters').innerText = totalFuel;
    const resultEl = document.getElementById('fuel-result');
    resultEl.classList.remove('hidden');
    
    // Animasi scroll ke hasil
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

    // Background Peta Laut (Biru Muda)
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, width, height);

    // Grid Peta
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Lingkaran Radar
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(width / 2, height / 2, 180, 0, Math.PI * 2); ctx.stroke();

    // Titik Kapal (Biru Tua)
    ctx.fillStyle = '#0077b6';
    ctx.beginPath(); ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2); ctx.fill();
    
    // Ikon Kapal
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Font Awesome 6 Free"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uf21a', width / 2, height / 2); // Ikon kapal

    if (isNavMode) {
        // Rute Pandu Pulang (Garis Putus-putus Oranye)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(60, height - 100); // Titik awal (Pelabuhan)
        ctx.stroke();
        ctx.setLineDash([]);

        // Titik Awal (Pelabuhan)
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(60, height - 100, 10, 0, Math.PI * 2); ctx.fill();
        
        // Label Pelabuhan
        ctx.fillStyle = '#03045e';
        ctx.font = 'bold 12px Inter';
        ctx.fillText('Titik Awal', 60, height - 80);
    } else {
        // Sebaran Ikan (Hijau)
        ctx.fillStyle = '#10b981';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * (width - 100) + 50;
            const y = Math.random() * (height - 150) + 50;
            
            // Jangan gambar tepat di tengah (posisi kapal)
            if (Math.abs(x - width/2) < 50 && Math.abs(y - height/2) < 50) continue;
            
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Efek lingkaran di sekitar ikan
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function markSpot() {
    // Simulasi penandaan spot dengan efek visual
    const fab = document.querySelector('.fab');
    fab.style.transform = 'scale(0.8)';
    setTimeout(() => fab.style.transform = 'scale(1)', 200);
    
    alert('📍 Spot berhasil ditandai!\nKoordinat lokasi ikan telah disimpan ke memori aplikasi.');
}

function toggleOffline() {
    alert('📥 Peta berhasil diunduh untuk mode offline.\nAnda dapat mengakses peta ini tanpa sinyal internet.');
}

// --- NAVIGASI RUTE ---
function startSailing() {
    if (state.isSailing) return;
    
    state.isSailing = true;
    state.startTime = Date.now();
    state.fuelPercent = 100; // Reset BBM setiap mulai
    state.navDrawn = false;
    drawMap('navCanvas', true);
    
    // Update UI Kontrol
    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-guide').disabled = false;
    document.getElementById('btn-finish').disabled = false;
    document.getElementById('trip-summary').classList.add('hidden');
    document.getElementById('nav-fuel-percent').innerText = state.fuelPercent;
    document.getElementById('fuel-indicator').classList.remove('danger');
    
    // Timer Simulasi (Setiap 3 detik turun 1%)
    state.timerInterval = setInterval(() => {
        if (state.fuelPercent > 0) {
            state.fuelPercent -= 1;
            document.getElementById('nav-fuel-percent').innerText = state.fuelPercent;
            
            // Peringatan BBM Kritis
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
    
    // Update UI Kontrol
    document.getElementById('btn-start').disabled = false;
    document.getElementById('btn-guide').disabled = true;
    document.getElementById('btn-finish').disabled = true;
    
    // Hitung durasi (simulasi berdasarkan waktu nyata)
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
    
    // Simulasi pengiriman sinyal
    setTimeout(() => {
        alert('✅ SINYAL SOS TERKIRIM!\n\nKoordinat: -6.2088, 106.8456\nBantuan sedang dalam perjalanan. Tetap tenang dan nyalakan lampu isyarat.');
    }, 300);
}