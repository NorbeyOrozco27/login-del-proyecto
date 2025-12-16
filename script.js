// --- CONFIGURACIÓN SUPABASE ---
// Pon aquí tus credenciales (Project URL y Anon Key)
const SUPABASE_URL = 'https://eugeraeqrmxxbpfkifvi.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Z2VyYWVxcm14eGJwZmtpZnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODIyMDYsImV4cCI6MjA2NDc1ODIwNn0.wYQewjb611etr0NvNqs7U1njwg34lZp8jS419DVH3RU';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- REFERENCIAS DOM ---
const loginForm = document.getElementById('login-form');
const feedbackMsg = document.getElementById('feedback-msg');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');

// Elementos del dashboard para personalizar
const userNameDisplay = document.getElementById('user-name-display');
const userRoleDisplay = document.getElementById('user-role-display');

// --- EVENTO LOGIN ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackMsg.textContent = "Verificando credenciales...";
    feedbackMsg.style.color = "#06263b"; // Color neutro cargando

    // Obtenemos los valores de los inputs
    const emailIngresado = document.getElementById('email').value;
    const passwordIngresado = document.getElementById('password').value;

    try {
        // ATENCIÓN: Aquí consultamos tu tabla exacta
        // Supondré que la tabla se llama 'usuarios_permisos' o 'usuarios'
        // Cambia 'usuarios_permisos' si en supabase tiene otro nombre
        const { data, error } = await _supabase
            .from('usuarios_permisos') 
            .select('*')
            .eq('email', emailIngresado)      // Columna 'email' del CSV
            .eq('password', passwordIngresado) // Columna 'password' del CSV
            .single(); // Esperamos solo 1 resultado

        if (error || !data) {
            console.warn("Error o datos vacíos:", error);
            feedbackMsg.textContent = "Acceso denegado: Usuario o contraseña incorrectos.";
            feedbackMsg.style.color = "#e74c3c"; // Rojo error
            return;
        }

        // Login Exitoso
        ingresarAlSistema(data);

    } catch (err) {
        console.error("Error inesperado:", err);
        feedbackMsg.textContent = "Error de conexión con la base de datos.";
    }
});

function ingresarAlSistema(usuario) {
    // 1. Guardar sesión simple (opcional, para recargas)
    // localStorage.setItem('usuario_transporte', JSON.stringify(usuario));

    // 2. Actualizar UI
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');

    // 3. Mostrar datos del CSV en pantalla
    // Usamos la columna 'nombre' y 'rol' del CSV
    userNameDisplay.textContent = usuario.nombre; 
    userRoleDisplay.textContent = usuario.rol;

    // Aquí podrías ocultar botones si el rol no es 'admin'
    if (usuario.rol !== 'admin') {
        // Ejemplo: ocultar algo exclusivo de admin
        // document.getElementById('boton-secreto').style.display = 'none';
    }
}

// --- FUNCIÓN SALIR ---
window.logout = function() {
    loginForm.reset();
    feedbackMsg.textContent = "";
    dashboardView.classList.add('hidden');
    loginView.classList.remove('hidden');
    // localStorage.removeItem('usuario_transporte');
}
// --- CONTROL DEL VIDEO (REPRODUCIR CADA 30 SEGUNDOS) ---
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bg-video');

    if (video) {
        // Cuando el video termina de reproducirse...
        video.addEventListener('ended', () => {
            console.log("Video terminó. Esperando 30 segundos...");
            
            // Esperamos 30,000 milisegundos (30 segundos)
            setTimeout(() => {
                video.currentTime = 0; // Regresamos el video al inicio
                video.play();          // Le damos play de nuevo
            }, 300000); 
        });
    }
});