import Image from "next/image";

import type { ProjectGalleryItem } from "@/data/projects";

// Code-native placeholders: no customer data and no claim to reproduce the real UI.
export function ProjectVisual({ item, hero = false }: { item: ProjectGalleryItem; hero?: boolean }) {
  if (!item.placeholder) return <Image alt={item.alt} src={item.src} width={item.width} height={item.height} preload={hero} sizes={hero ? "(min-width: 1650px) 900px, (min-width: 1024px) 60vw, 92vw" : "(min-width: 1650px) 1450px, 90vw"} className="h-auto w-full rounded-xl object-contain" />;

  const view = item.id;
  return <div className="overflow-hidden rounded-xl border border-white/10 bg-[#11111e] shadow-2xl shadow-black/25">
    <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2 sm:px-4 sm:py-3"><span className="size-1.5 rounded-full bg-white/30" /><span className="size-1.5 rounded-full bg-white/20" /><span className="size-1.5 rounded-full bg-white/10" /><span className="ml-auto text-[7px] tracking-[0.12em] text-lavender sm:text-[9px]">LANDIMOTOS / WORKSPACE</span></div>
    <svg viewBox="0 0 800 500" role="img" aria-label={`Ilustración conceptual de ${item.caption}; no es una captura de la aplicación real.`} className="block h-auto w-full">
      <rect width="800" height="500" fill="#10101c" />
      <rect width="145" height="500" fill="#151422" />
      <rect x="25" y="30" width="28" height="28" rx="8" fill="#7358fa" />
      <path d="M34 37v13h12" fill="none" stroke="#fff" strokeWidth="3" />
      <text x="64" y="43" fill="#e1dced" fontSize="9" fontFamily="sans-serif" fontWeight="700">LANDIMOTOS</text><text x="64" y="56" fill="#8d849f" fontSize="7" fontFamily="sans-serif">PORTAL LOGÍSTICO</text>
      {[105, 153, 201, 249, 297].map((y, index) => <g key={y}><rect x="14" y={y - 12} width="117" height="36" rx="8" fill={index === (view === "dashboard" ? 0 : view === "invoices" ? 1 : view === "messengers" ? 2 : 3) ? "#30264f" : "#151422"} /><rect x="26" y={y} width="10" height="10" rx="3" fill={index === 0 ? "#b3a9fd" : "#67627f"} /><text x="46" y={y + 9} fill="#b9b0cd" fontSize="9" fontFamily="sans-serif">{["Vista general", "Operación", "Logística", "Personal", "Atención"][index]}</text></g>)}
      <circle cx="33" cy="453" r="13" fill="#302b45" /><text x="33" y="457" textAnchor="middle" fill="#b3a9fd" fontSize="9" fontFamily="sans-serif">LM</text><text x="56" y="451" fill="#c5bdd5" fontSize="8" fontFamily="sans-serif">Workspace</text><text x="56" y="465" fill="#8d849f" fontSize="7" fontFamily="sans-serif">Vista ilustrativa</text>
      <text x="177" y="48" fill="#f5f3ff" fontSize="18" fontFamily="sans-serif" fontWeight="600">{item.caption}</text>
      <text x="177" y="70" fill="#968ca9" fontSize="10" fontFamily="sans-serif">{view === "dashboard" ? "Operación conectada / Vista general" : view === "messengers" ? "Equipo / Disponibilidad / Asignación" : "Operación / Registro y seguimiento"}</text>
      <rect x="685" y="30" width="79" height="27" rx="8" fill="#2f254f" /><circle cx="699" cy="44" r="3" fill="#cf986d" /><text x="709" y="47" fill="#cfc3e1" fontSize="8" fontFamily="sans-serif">Interno</text>
      {view === "dashboard" ? <>
        {[177, 377, 577].map((x, index) => <g key={x}><rect x={x} y="104" width="187" height="91" rx="12" fill="#1a182b" stroke="#302b45" /><text x={x + 16} y="129" fill="#b6b1cc" fontSize="10" fontFamily="sans-serif">{["Operación", "Rutas", "Históricos"][index]}</text><text x={x + 16} y="158" fill="#e2d9f6" fontSize="17" fontFamily="sans-serif" fontWeight="600">{["Registro", "Seguimiento", "Consulta"][index]}</text><path d={`M${x + 16} 177h150`} stroke="#39304d" /><path d={`M${x + 16} 177h${[100, 65, 125][index]}`} stroke="#a997e4" strokeWidth="2" /></g>)}
        <rect x="177" y="218" width="382" height="236" rx="12" fill="#181626" stroke="#302b45" />
        <text x="195" y="247" fill="#d9d4ea" fontSize="12" fontFamily="sans-serif">Actividad operativa</text>
        {[282, 327, 372, 417].map((y) => <path key={y} d={`M195 ${y}h345`} stroke="#302b45" />)}
        <path d="M196 399l40-37 41 16 43-65 41 27 43-42 43 15 45-49 45 17v146H196Z" fill="#7358fa" fillOpacity=".12" />
        <path d="M196 399l40-37 41 16 43-65 41 27 43-42 43 15 45-49 45 17" fill="none" stroke="#aa95f2" strokeWidth="3" />
        <rect x="577" y="218" width="187" height="236" rx="12" fill="#181626" stroke="#302b45" />
        <text x="594" y="247" fill="#d9d4ea" fontSize="12" fontFamily="sans-serif">Distribución</text><circle cx="670" cy="325" r="48" fill="none" stroke="#302b45" strokeWidth="16" /><circle cx="670" cy="325" r="48" fill="none" stroke="#9b83e4" strokeWidth="16" strokeDasharray="170 302" transform="rotate(-90 670 325)" />
        <text x="670" y="322" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#e2d9f6">Operación</text><text x="670" y="338" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#a99cbe">por área</text>
        <circle cx="600" cy="407" r="3" fill="#9b83e4" /><text x="609" y="411" fill="#b3a6c9" fontFamily="sans-serif" fontSize="8">Registro</text><circle cx="677" cy="407" r="3" fill="#cf986d" /><text x="686" y="411" fill="#b3a6c9" fontFamily="sans-serif" fontSize="8">Revisión</text>
        <text x="195" y="440" fill="#827790" fontSize="8" fontFamily="sans-serif">LUN</text><text x="276" y="440" fill="#827790" fontSize="8" fontFamily="sans-serif">MAR</text><text x="357" y="440" fill="#827790" fontSize="8" fontFamily="sans-serif">MIÉ</text><text x="438" y="440" fill="#827790" fontSize="8" fontFamily="sans-serif">JUE</text><text x="515" y="440" fill="#827790" fontSize="8" fontFamily="sans-serif">VIE</text>
      </> : view === "messengers" ? <>
        <rect x="177" y="104" width="587" height="350" rx="12" fill="#181626" stroke="#302b45" />
        <path d="M200 150h540M200 215h540M200 280h540M200 345h540M255 120v310M370 120v310M485 120v310M600 120v310M715 120v310" stroke="#262237" />
        <path d="M185 420L460 115M315 450L630 108M180 302L760 410" stroke="#242033" strokeWidth="16" />
        <path d="M252 353h116v-134h137v80h119V166h82" fill="none" stroke="#ac95ee" strokeWidth="4" strokeDasharray="8 6" />
        {[[252,353],[368,219],[505,299],[624,166],[706,166]].map(([x,y], index) => <g key={index}><circle cx={x} cy={y} r="15" fill="#33274f" stroke="#b3a9fd" /><circle cx={x} cy={y} r="4" fill="#dfd4ff" /></g>)}
        <rect x="196" y="122" width="128" height="29" rx="7" fill="#30264f" /><text x="209" y="141" fontFamily="sans-serif" fontSize="11" fill="#d7cbee">Rutas y disponibilidad</text>
        <rect x="564" y="350" width="180" height="84" rx="8" fill="#211b30" stroke="#493958" /><circle cx="582" cy="371" r="3" fill="#cf986d" /><text x="594" y="375" fill="#d8cde5" fontFamily="sans-serif" fontSize="10">Asignación de ruta</text><text x="581" y="399" fill="#a89ab9" fontFamily="sans-serif" fontSize="9">Origen → Entrega</text><text x="581" y="417" fill="#b3a9fd" fontFamily="sans-serif" fontSize="8">Seguimiento del equipo ↗</text>
      </> : view === "invoices" ? <>
        <rect x="177" y="102" width="365" height="345" rx="10" fill="#181626" stroke="#302b45" />
        <text x="199" y="132" fill="#e1d8ef" fontSize="13" fontFamily="sans-serif">Nueva factura</text><text x="199" y="151" fill="#94869f" fontSize="9" fontFamily="sans-serif">Registro y clasificación de la operación</text>
        {[["Referencia", "Número de factura"], ["Punto de operación", "Seleccionar punto"], ["Área / Revisor", "Asignar responsable"], ["Mesa", "Seleccionar mesa"]].map(([label, value], index) => <g key={label}><text x="199" y={184 + index * 56} fill="#ac9fbe" fontSize="9" fontFamily="sans-serif">{label}</text><rect x="199" y={192 + index * 56} width="320" height="29" rx="5" fill="#11101c" stroke="#322a42" /><text x="211" y={211 + index * 56} fill="#786c8a" fontSize="9" fontFamily="sans-serif">{value}</text></g>)}
        <rect x="393" y="402" width="126" height="28" rx="6" fill="#7358ba" /><text x="456" y="420" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="9">Registrar factura →</text>
        <rect x="562" y="102" width="202" height="345" rx="10" fill="#181626" stroke="#302b45" /><text x="582" y="132" fill="#e1d8ef" fontSize="12" fontFamily="sans-serif">Trazabilidad</text><path d="M589 175v192" stroke="#5c467c" />
        {["Registro", "Clasificación", "Revisión", "Histórico"].map((label, index) => <g key={label}><circle cx="589" cy={177 + index * 62} r="5" fill={index === 2 ? "#cf986d" : "#aa95ed"} /><text x="606" y={180 + index * 62} fill="#d5c9e6" fontSize="10" fontFamily="sans-serif">{label}</text><text x="606" y={197 + index * 62} fill="#8f809f" fontSize="8" fontFamily="sans-serif">{["Entrada al sistema", "Área y responsable", "Control del proceso", "Consulta compartida"][index]}</text></g>)}
      </> : <>
        <rect x="177" y="104" width="587" height="48" rx="10" fill="#1a182b" /><rect x="194" y="121" width="159" height="12" rx="6" fill="#39324e" /><rect x="665" y="116" width="83" height="24" rx="6" fill="#7358fa" fillOpacity=".6" />
        {[175, 240, 305, 370].map((y, index) => <g key={y}><rect x="177" y={y} width="587" height="55" rx="9" fill="#181626" stroke="#302b45" />{view === "users" ? <circle cx="208" cy={y+27} r="13" fill="#39304f" /> : <rect x="196" y={y+19} width="16" height="16" rx="4" fill="#39304f" />}<rect x="239" y={y+18} width={100+index*13} height="7" rx="3" fill="#8e86a6" /><rect x="239" y={y+33} width="68" height="5" rx="2" fill="#494259" /><rect x="443" y={y+23} width="80" height="7" rx="3" fill="#625775" /><rect x="598" y={y+16} width="106" height="24" rx="12" fill="#2d2447" /><rect x="614" y={y+25} width="72" height="5" rx="2" fill="#b3a9fd" /></g>)}
        <text x="178" y="455" fill="#827d99" fontSize="11" fontFamily="sans-serif">{view === "users" ? "Acceso por módulos" : "Registro · Clasificación · Histórico"}</text>
      </>}
    </svg>
    <p className="border-t border-white/10 px-3 py-1.5 text-[8px] leading-4 text-lavender sm:px-4 sm:text-[9px]">Vista conceptual · Sin datos reales</p>
  </div>;
}
