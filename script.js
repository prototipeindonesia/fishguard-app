// State Aplikasi
let state = {
    isLoggedIn: false,
    fuelPercent: 100,
    isSailing: false,
    startTime: null,
    timerInterval: null,
    mapDrawn: false,
    navDrawn: false
};

// --- UTILITAS ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- NAVIGASI ANTAR SCREEN ---
function showScreen(screenId) {
    // Sembunyikan semua screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Tampilkan screen target
    document.getElementById(screenId).classList.add('active');
    
    // Update Bottom Nav Active State
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(screenId === 'screen-home') document.getElementById('nav-home').classList.add('active');
    if(screenId === 'screen-map') document.getElementById('nav-map').classList.add('active');
    if(screenId === 'screen-nav') document.getElementById('nav-nav').classList.add('active');
    if(screenId === 'screen-fuel') document.getElementById('nav-fuel').classList.add('active');

    // Gambar ulang peta jika masuk ke screen peta
    if (screenId === 'screen-map' && !state.mapDrawn) {
        drawMap('mapCanvas', false);
        state.mapDrawn = true;
    }
    if (screenId === 'screen-nav' && !state.navDrawn) {
        drawMap('navCanvas', true);
        state.navDrawn = true;
    }
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
        alert('Masukkan durasi yang valid!');
        return;
    }

    // Rumus simulasi: (HP * Durasi * 0.2) * Faktor Kondisi
    const baseFuel = power * duration * 0.2;
    const totalFuel = (baseFuel * condition).toFixed(1);

    document.getElementById('fuel-liters').innerText = totalFuel;
    document.getElementById('fuel-result').classList.remove('hidden');
    
    // Animasi scroll ke hasil
    document.getElementById('fuel-result').scrollIntoView({ behavior: 'smooth' });
}

// --- PETA & CANVAS DRAWING ---
function drawMap(canvasId, isNavMode = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background Gelap (Laut Dalam)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid Radar (Sonar)
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Lingkaran Radar
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Titik Kapal (Biru) dengan Efek Glow
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Ikon Kapal di Tengah
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px FontAwesome';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uf21a', width / 2, height / 2); // Kode unicode kapal

    if (isNavMode) {
        // Rute Pandu Pulang (Garis Putus-putus)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(60, height - 80); // Titik awal (Pelabuhan)
        ctx.stroke();
        ctx.setLineDash([]);

        // Titik Awal (Pelabuhan)
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(60, height - 80, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Label Pelabuhan
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.fillText('Titik Awal', 60, height - 60);
    } else {
        // Sebaran Ikan (Hijau) dengan Glow
        ctx.shadowColor = '#14b8a6';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#14b8a6';
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * (width - 100) + 50;
            const y = Math.random() * (height - 150) + 50;
            
            // Jangan gambar tepat di tengah (posisi kapal)
            if (Math.abs(x - width/2) < 40 && Math.abs(y - height/2) < 40) continue;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
}

function markSpot() {
    // Efek visual alert
    alert('📍 Spot berhasil ditandai!\nKoordinat disimpan ke database lokal.');
}

function toggleOffline() {
    alert('📥 Peta berhasil diunduh untuk mode offline.\nAnda dapat mengakses peta ini tanpa sinyal internet.');
}

// --- NAVIGASI RUTE ---
function startSailing() {
    if (state.isSailing) {
        alert('Anda sedang dalam pelayaran!');
        return;
    }
    
    state.isSailing = true;
    state.startTime = Date.now();
    state.navDrawn = false; // Redraw untuk memunculkan rute
    drawMap('navCanvas', true);
    
    // Efek tombol
    alert('▶️ Pelayaran dimulai.\nRadar aktif. Pantau terus sisa BBM Anda.');
    
    // Simulasi pengurangan BBM (setiap 3 detik turun 1%)
    state.timerInterval = setInterval(() => {
        if (state.fuelPercent > 0) {
            state.fuelPercent -= 1;
            document.getElementById('nav-fuel-percent').innerText = state.fuelPercent;
            
            // Peringatan BBM Kritis
            if (state.fuelPercent === 20) {
                // Mainkan suara atau getar (jika didukung)
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                alert('⚠️ PERINGATAN KERAS: Sisa BBM 20%!\nSegera arahkan kapal kembali ke pelabuhan atau spot terdekat.');
            }
            if (state.fuelPercent === 10) {
                alert('🚨 BAHAYA: Sisa BBM 10%!\nRisiko mesin mati di tengah laut sangat tinggi.');
            }
        } else {
            clearInterval(state.timerInterval);
            alert('⛔ BBM HABIS! Mesin mati. Anda dalam kondisi darurat. Gunakan tombol SOS.');
        }
    }, 3000);
}

function guideHome() {
    if (!state.isSailing) {
        alert('Mulai berlayar terlebih dahulu!');
        return;
    }
    state.navDrawn = false;
    drawMap('navCanvas', true);
    alert('🏠 Rute pandu pulang telah ditampilkan.\nIkuti garis kuning untuk kembali ke titik awal.');
}

function finishSailing() {
    if (!state.isSailing) {
        alert('Anda belum memulai pelayaran.');
        return;
    }
    
    clearInterval(state.timerInterval);
    state.isSailing = false;
    
    // Hitung durasi simulasi (berdasarkan waktu nyata)
    const durationHours = ((Date.now() - state.startTime) / (1000 * 60 * 60)).toFixed(1);
    
    document.getElementById('sum-time').innerText = durationHours + ' Jam';
    document.getElementById('sum-fuel').innerText = state.fuelPercent + '%';
    
    const statusEl = document.getElementById('sum-status');
    if (state.fuelPercent < 15) {
        statusEl.innerText = 'TERKENDALA (BBM Kritis)';
        statusEl.style.color = 'var(--danger)';
    } else {
        statusEl.innerText = 'AMAN';
        statusEl.style.color = 'var(--success)';
    }
    
    document.getElementById('trip-summary').classList.remove('hidden');
    
    // Reset state untuk pelayaran berikutnya
    setTimeout(() => {
        state.fuelPercent = 100;
        document.getElementById('nav-fuel-percent').innerText = 100;
        state.navDrawn = false;
        drawMap('navCanvas', true);
    }, 5000);
}

// --- SOS ---
function triggerSOS() {
    if (confirm('🚨 KIRIM SINYAL SOS DARURAT? \n\nLokasi Anda akan dibagikan ke Tim SAR dan Nelayan terdekat.')) {
        // Simulasi getar HP
        if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        alert('✅ SINYAL SOS TERKIRIM!\n\nKoordinat: -6.2088, 106.8456\nBantuan sedang dalam perjalanan. Tetap tenang dan nyalakan lampu isyarat.');
    }
}