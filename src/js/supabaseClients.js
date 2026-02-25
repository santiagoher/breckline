// supabaseClients.js

const supabaseUrl = "https://kxjbywekvusxrhoweerk.supabase.co";
const supabaseKey = "sb_publishable_N2GJ8I6jpIZElitRuR4ktQ_5bY3O_hv";

window.sb = supabase.createClient(supabaseUrl, supabaseKey);
const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const titulo = document.getElementById("titulo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const recaptchaResponse = grecaptcha.getResponse();

  if (!nombre || !titulo || !mensaje) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (!recaptchaResponse) {
    alert("Por favor verifica que no eres un robot.");
    return;
  }

  // Insertar en Supabase
  const { data, error } = await sb
    .from("clientes")
    .insert([{ nombre, titulo, mensaje }]);

  if (error) {
    console.error(error);
    alert("Ocurrió un error al enviar tu mensaje.");
  } else {
    alert("Mensaje enviado correctamente 🚀");
    form.reset();
    grecaptcha.reset(); // Resetea el reCAPTCHA
  }
});