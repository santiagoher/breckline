import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site-url";

const contactEmail = "breckline.corporativo@gmail.com";
const privacyUrl = new URL("/politica-de-privacidad", getSiteUrl()).toString();
const description =
  "Conoce qué datos trata Breckline al recibir consultas, mostrar videos y medir el uso del sitio, así como tus opciones de privacidad.";

export const metadata: Metadata = {
  alternates: {
    canonical: privacyUrl,
  },
  description,
  openGraph: {
    description,
    locale: "es_CO",
    title: "Política de privacidad | Breckline",
    type: "article",
    url: privacyUrl,
  },
  title: "Política de privacidad",
};

const linkClass =
  "focus-ring [overflow-wrap:anywhere] font-semibold text-brand-light underline decoration-brand/60 underline-offset-4 hover:text-white";

export default function PrivacyPolicyPage() {
  return (
    <main className="grid-background min-h-screen px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="glass-panel mx-auto w-full max-w-4xl overflow-hidden rounded-3xl">
        <header className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#3d01c5_0%,#1c0b35_38%,#0d0c18_82%)] px-6 py-10 text-white sm:px-10 sm:py-14">
          <Link
            className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-brand-light"
            href="/"
          >
            <span aria-hidden="true">←</span>
            Volver a Breckline
          </Link>
          <p className="mt-9 text-xs font-black uppercase tracking-[0.25em] text-brand-light">
            Privacidad y datos personales
          </p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl">
            Política de privacidad
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Esta página explica, en lenguaje claro, qué información interviene cuando visitas el
            sitio o nos escribes y qué opciones tienes sobre ella.
          </p>
          <p className="mt-5 text-xs font-semibold text-white/55">
            Última actualización: 30 de agosto de 2026
          </p>
        </header>

        <div className="space-y-10 px-6 py-10 text-[1rem] leading-7 text-lavender sm:px-10 sm:py-14">
          <section aria-labelledby="responsable">
            <h2 className="font-display text-2xl font-black text-ink" id="responsable">
              1. Quién gestiona la información
            </h2>
            <p className="mt-4">
              Breckline gestiona la información descrita en esta política. Para consultas sobre
              privacidad o para solicitar el ejercicio de tus derechos, puedes escribir a{" "}
              <a className={linkClass} href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="datos">
            <h2 className="font-display text-2xl font-black text-ink" id="datos">
              2. Qué información tratamos
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-brand">
              <li>
                <strong className="text-ink">Formulario de contacto:</strong> el nombre, el asunto
                o tipo de necesidad y el mensaje que decides enviarnos.
              </li>
              <li>
                <strong className="text-ink">Verificación de seguridad:</strong> el token generado
                por reCAPTCHA y los datos técnicos que Google pueda procesar para distinguir una
                interacción legítima de actividad automatizada.
              </li>
              <li>
                <strong className="text-ink">Preferencia de analítica:</strong> guardamos en el
                almacenamiento local del navegador si aceptaste o rechazaste la analítica, para no
                preguntarte en cada visita.
              </li>
              <li>
                <strong className="text-ink">Datos de uso, solo con permiso:</strong> si aceptas la
                analítica, las herramientas configuradas pueden recopilar información sobre la
                navegación, el dispositivo y la interacción con el sitio.
              </li>
            </ul>
          </section>

          <section aria-labelledby="finalidades">
            <h2 className="font-display text-2xl font-black text-ink" id="finalidades">
              3. Para qué usamos la información
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-brand">
              <li>Recibir tu solicitud, entender el proyecto y responderte.</li>
              <li>Evitar spam, abuso y envíos automatizados en el formulario.</li>
              <li>Mantener el sitio seguro, disponible y técnicamente estable.</li>
              <li>
                Entender de forma agregada cómo se usa el sitio y mejorarlo, únicamente cuando
                aceptas la analítica.
              </li>
            </ul>
            <p className="mt-4">
              El envío del formulario es voluntario. Si no proporcionas los campos requeridos, no
              podremos recibir ni responder esa consulta desde el sitio.
            </p>
          </section>

          <section aria-labelledby="proveedores">
            <h2 className="font-display text-2xl font-black text-ink" id="proveedores">
              4. Servicios externos
            </h2>
            <div className="mt-5 space-y-6">
              <div>
                <h3 className="font-bold text-ink">Supabase</h3>
                <p className="mt-1">
                  Los datos enviados por el formulario se almacenan en Supabase para que Breckline
                  pueda atender la consulta. Puedes consultar la{" "}
                  <a
                    className={linkClass}
                    href="https://supabase.com/privacy"
                    rel="noreferrer"
                    target="_blank"
                  >
                    política de privacidad de Supabase
                  </a>
                  .
                </p>
              </div>

              <div>
                <h3 className="font-bold text-ink">Google reCAPTCHA</h3>
                <p className="mt-1">
                  Cuando el formulario está habilitado, usamos reCAPTCHA como medida necesaria de
                  seguridad. Google puede procesar datos técnicos conforme a su{" "}
                  <a
                    className={linkClass}
                    href="https://policies.google.com/privacy?hl=es-419"
                    rel="noreferrer"
                    target="_blank"
                  >
                    política de privacidad
                  </a>
                  . La verificación se valida en el servidor antes de guardar el mensaje.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-ink">Vimeo</h3>
                <p className="mt-1">
                  Los reproductores de Vimeo no se cargan hasta que decides reproducir un video.
                  En ese momento tu navegador se conecta con Vimeo, que puede tratar datos técnicos
                  según su{" "}
                  <a
                    className={linkClass}
                    href="https://vimeo.com/legal/terms/es/privacidad/policy"
                    rel="noreferrer"
                    target="_blank"
                  >
                    política de privacidad
                  </a>
                  . Solicitamos al reproductor su modalidad de menor seguimiento mediante el
                  parámetro DNT.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-ink">Analítica y Google Tag Manager</h3>
                <p className="mt-1">
                  El contenedor de analítica solo se carga después de que eliges “Aceptar
                  analítica”. Si rechazas, no lo cargamos. Las tecnologías concretas y los datos
                  tratados dependen de las etiquetas que Breckline tenga configuradas en ese
                  contenedor. Puedes cambiar la decisión desde el botón “Privacidad” del sitio.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-ink">Fuentes web de Adobe</h3>
                <p className="mt-1">
                  El diseño puede solicitar una fuente a Adobe Fonts. Esa petición comunica datos
                  técnicos básicos entre tu navegador y Adobe. Consulta la{" "}
                  <a
                    className={linkClass}
                    href="https://www.adobe.com/privacy/policy.html"
                    rel="noreferrer"
                    target="_blank"
                  >
                    política de privacidad de Adobe
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="cookies">
            <h2 className="font-display text-2xl font-black text-ink" id="cookies">
              5. Cookies y almacenamiento local
            </h2>
            <p className="mt-4">
              Usamos almacenamiento local para recordar tu elección de analítica. Esa preferencia
              es funcional y no mide por sí misma tu actividad. Los servicios externos pueden usar
              cookies u otras tecnologías cuando se cargan: reCAPTCHA al proteger el formulario,
              Vimeo cuando reproduces un video y la analítica únicamente después de tu aceptación.
            </p>
          </section>

          <section aria-labelledby="conservacion">
            <h2 className="font-display text-2xl font-black text-ink" id="conservacion">
              6. Conservación y destinatarios
            </h2>
            <p className="mt-4">
              Conservamos la información del formulario mientras resulte necesaria para atender la
              consulta, mantener el historial comercial pertinente o cumplir obligaciones
              aplicables. Después la eliminamos o anonimizamos cuando sea razonablemente posible.
              No vendemos los mensajes del formulario.
            </p>
            <p className="mt-4">
              Podemos compartir información con los proveedores mencionados solo para operar estas
              funciones, o cuando una obligación válida lo requiera. Algunos proveedores pueden
              procesar datos fuera de tu país conforme a su infraestructura y sus propias
              condiciones.
            </p>
          </section>

          <section aria-labelledby="derechos">
            <h2 className="font-display text-2xl font-black text-ink" id="derechos">
              7. Tus opciones y derechos
            </h2>
            <p className="mt-4">
              Puedes pedir información sobre tus datos, solicitar su actualización, corrección o
              eliminación, retirar una autorización cuando corresponda y plantear una inquietud
              sobre su uso. Escríbenos desde una cuenta que permita verificar razonablemente tu
              relación con la información solicitada. Responderemos de acuerdo con las normas que
              resulten aplicables.
            </p>
            <p className="mt-4">
              También puedes aceptar, rechazar o volver a abrir las preferencias de analítica desde
              el sitio. Retirar el permiso no modifica el tratamiento que ya se hubiera realizado
              legítimamente antes del cambio.
            </p>
          </section>

          <section aria-labelledby="seguridad">
            <h2 className="font-display text-2xl font-black text-ink" id="seguridad">
              8. Seguridad y cambios de esta política
            </h2>
            <p className="mt-4">
              Aplicamos medidas técnicas y organizativas razonables para reducir accesos, usos o
              pérdidas no autorizados. Ningún sistema conectado a internet puede garantizar
              seguridad absoluta.
            </p>
            <p className="mt-4">
              Podemos actualizar esta política cuando cambien el sitio, sus proveedores o los
              requisitos aplicables. Publicaremos aquí la versión vigente e indicaremos su fecha de
              actualización.
            </p>
          </section>

          <aside className="rounded-2xl border border-brand/30 bg-brand/10 p-6" aria-label="Contacto">
            <h2 className="font-display text-xl font-black text-ink">¿Tienes una pregunta?</h2>
            <p className="mt-2">
              Escríbenos a{" "}
              <a className={linkClass} href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              . Incluye suficiente contexto para que podamos ubicar tu solicitud, pero evita enviar
              datos sensibles que no sean necesarios.
            </p>
          </aside>
        </div>
      </article>
    </main>
  );
}

