// CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://eugeraeqrmxxbpfkifvi.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Z2VyYWVxcm14eGJwZmtpZnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODIyMDYsImV4cCI6MjA2NDc1ODIwNn0.wYQewjb611etr0NvNqs7U1njwg34lZp8jS419DVH3RU';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let urlDestinoGps = "";

// NAVEGACIÓN
function switchTab(tabName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${tabName}`).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`nav-${tabName}`).classList.add('active');
}

// LOGIN PRINCIPAL
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    const { data, error } = await _supabase.from('usuarios_permisos').select('*').eq('email', email).eq('password', pass).single();

    if (data) {
        sessionStorage.setItem('tu_user', JSON.stringify(data));
        iniciarDashboard(data);
    } else {
        document.getElementById('feedback-msg').textContent = "Credenciales Incorrectas";
    }
});

function iniciarDashboard(user) {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('user-name-display').textContent = user.nombre;
    document.getElementById('user-role-display').textContent = user.rol;
}

// SEGURIDAD GPS
function abrirModalGps(url) {
    urlDestinoGps = url;
    document.getElementById('gps-lock-modal').classList.remove('hidden');
}

function cerrarModalGps() {
    document.getElementById('gps-lock-modal').classList.add('hidden');
    document.getElementById('gps-pass').value = "";
    document.getElementById('gps-err').textContent = "";
}

async function validarGps() {
    const passInput = document.getElementById('gps-pass').value;
    const user = JSON.parse(sessionStorage.getItem('tu_user'));

    if (passInput === user.password) {
        window.open(urlDestinoGps, '_blank');
        cerrarModalGps();
    } else {
        document.getElementById('gps-err').textContent = "Contraseña Incorrecta";
    }
}

// CARRUSEL (5 SLIDES)
let slideIdx = 0;
function iniciarCarrusel() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    setInterval(() => {
        slides[slideIdx].classList.remove('active');
        dots[slideIdx].classList.remove('active');
        slideIdx = (slideIdx + 1) % slides.length;
        slides[slideIdx].classList.add('active');
        dots[slideIdx].classList.add('active');
    }, 6000);
}

document.addEventListener('DOMContentLoaded', () => {
    const user = sessionStorage.getItem('tu_user');
    if (user) iniciarDashboard(JSON.parse(user));
    iniciarCarrusel();
});

function logout() { sessionStorage.clear(); location.reload(); }