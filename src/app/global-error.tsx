"use client";

import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body
        style={{
          alignItems: "center",
          background: "radial-gradient(circle at 50% 0%, #1c0b35, #080811 64%)",
          color: "#f9f9fd",
          display: "flex",
          fontFamily: "Montserrat, Arial, sans-serif",
          justifyContent: "center",
          margin: 0,
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: "42rem" }}>
          <p
            style={{
              color: "#b3a9fd",
              fontSize: "0.875rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Error inesperado
          </p>
          <h1 style={{ fontSize: "clamp(2.25rem, 8vw, 4.5rem)", lineHeight: 1, margin: "1rem 0" }}>
            Volvamos a intentarlo
          </h1>
          <p style={{ color: "#b2b3c9", lineHeight: 1.7 }}>
            Ocurrió un problema al cargar Breckline. Puedes reintentar ahora o regresar al inicio.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={retry}
              style={{
                background: "#f9f9fd",
                border: 0,
                borderRadius: "999px",
                color: "#080811",
                cursor: "pointer",
                font: "inherit",
                fontWeight: 700,
                minHeight: "3rem",
                padding: "0.75rem 1.5rem",
              }}
              type="button"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              style={{
                alignItems: "center",
                border: "1px solid #595a66",
                borderRadius: "999px",
                color: "#f9f9fd",
                display: "inline-flex",
                fontWeight: 700,
                minHeight: "3rem",
                padding: "0.75rem 1.5rem",
                textDecoration: "none",
              }}
            >
              Ir al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
