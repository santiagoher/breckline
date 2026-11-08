import { ImageResponse } from "next/og";

export const alt = "Breckline — Desarrollo web y estrategia digital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "radial-gradient(circle at 50% 0%, #3d01c5 0%, #120c2d 38%, #080811 76%)",
        color: "#f9f9fd",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ color: "#b3a9fd", display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: 3 }}>
          BRECKLINE
        </div>
        <div style={{ display: "flex", fontSize: 74, fontWeight: 900, lineHeight: 1.05, marginTop: 32, maxWidth: 980 }}>
          Experiencias digitales que convierten audiencia en clientes.
        </div>
        <div style={{ background: "linear-gradient(90deg, #5625f7, #9585fa, #67d8ee)", borderRadius: 99, display: "flex", height: 12, marginTop: 42, width: 220 }} />
        <div style={{ color: "#b2b3c9", display: "flex", fontSize: 28, marginTop: 34 }}>
          Desarrollo web · SEO · Producción audiovisual
        </div>
      </div>
    </div>,
    size,
  );
}
