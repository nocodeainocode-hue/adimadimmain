// Sihirbaz seçenek kartlarındaki açıklayıcı çizimler. Fotoğraf değil, anlamı güçlendiren basit illüstrasyonlar.
const NAVY = "#0c2340";
const BLUE = "#0b5cc2";
const WATER = "#6fb1f2";

function Cartridge({ body, band, cap = "#9aa7b8", spots = [], drips = [], specks = [], children }) {
  return (
    <>
      <rect x="31" y="8" width="34" height="8" rx="3" fill={cap} />
      <rect x="28" y="14" width="40" height="62" rx="7" fill={body} stroke={NAVY} strokeOpacity=".25" />
      <rect x="28" y="30" width="40" height="8" fill={band} opacity=".55" />
      <rect x="28" y="52" width="40" height="8" fill={band} opacity=".55" />
      {spots.map(([cx, cy, r], i) => <circle key={`s${i}`} cx={cx} cy={cy} r={r} fill="#2f1b0c" opacity=".55" />)}
      {drips.map(([x, y, h], i) => <rect key={`d${i}`} x={x} y={y} width="3.5" height={h} rx="1.7" fill="#3a2410" opacity=".7" />)}
      <rect x="31" y="76" width="34" height="8" rx="3" fill={cap} />
      {specks.map(([cx, cy], i) => <circle key={`k${i}`} cx={cx} cy={cy} r="1.8" fill="#5a3a1c" />)}
      {children}
    </>
  );
}

// 19 litrelik damacana. x, y sol-üst köşe; s ölçek.
function Carboy({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="8" y="0" width="12" height="6" rx="2" fill={NAVY} />
      <rect x="10" y="6" width="8" height="8" fill="#cfe3f8" stroke={BLUE} strokeWidth="1.2" />
      <path d="M10 14 h8 v4 c8 3 10 8 10 16 v26 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6 v-26 c0 -8 2 -13 10 -16z" fill={WATER} fillOpacity=".55" stroke={BLUE} strokeWidth="1.6" />
      <path d="M6 36 q8 -3 16 0" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <path d="M7 28 v22" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".6" />
    </g>
  );
}

const ART = {
  // Son filtre değişimi
  "filter-fresh": (
    <Cartridge body="#ece6d3" band="#d8cfb0" spots={[[40, 24, 1.6], [56, 44, 1.4], [44, 66, 1.5]]} />
  ),
  "filter-old": (
    <Cartridge
      body="#6a4a2a" band="#3d2815" cap="#6d6258"
      spots={[[38, 22, 4], [57, 28, 3], [42, 44, 5], [55, 58, 4], [36, 68, 3.5], [60, 70, 3]]}
      drips={[[33, 76, 10], [47, 76, 14], [60, 76, 8]]}
      specks={[[22, 40], [74, 52], [20, 62], [78, 30]]}
    />
  ),
  "filter-unknown": (
    <Cartridge body="#d3dbe6" band="#b8c4d3">
      <text x="48" y="56" textAnchor="middle" fontSize="30" fontWeight="800" fill={NAVY} fontFamily="Figtree, sans-serif">?</text>
    </Cartridge>
  ),

  // Günlük su tüketimi: damacana sayısı arttıkça tüketim artar
  "people-low": <Carboy x={34} y={12} s={1} />,
  "people-mid": (<><Carboy x={6} y={22} s={.82} /><Carboy x={36} y={22} s={.82} /><Carboy x={66} y={22} s={.82} /></>),
  "people-high": (<><Carboy x={2} y={30} s={.6} /><Carboy x={20} y={30} s={.6} /><Carboy x={38} y={30} s={.6} /><Carboy x={56} y={30} s={.6} /><Carboy x={74} y={30} s={.6} /></>),

  // Arıza türleri
  "fault-damla": (
    <>
      <rect x="14" y="14" width="68" height="12" rx="5" fill="#9aa7b8" />
      <path d="M48 36 c0 0 -9 11 -9 17 a9 9 0 0 0 18 0 c0 -6 -9 -17 -9 -17z" fill={WATER} stroke={BLUE} strokeWidth="1.5" />
      <path d="M48 66 c0 0 -4 5 -4 8 a4 4 0 0 0 8 0 c0 -3 -4 -8 -4 -8z" fill={WATER} opacity=".7" />
    </>
  ),
  "fault-az_akis": (
    <>
      <rect x="14" y="14" width="68" height="12" rx="5" fill="#9aa7b8" />
      <rect x="46.5" y="26" width="3" height="20" rx="1.5" fill={WATER} />
      <circle cx="48" cy="54" r="2.2" fill={WATER} />
      <circle cx="48" cy="64" r="1.6" fill={WATER} opacity=".7" />
      <path d="M30 80 h36" stroke="#c4cedb" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  "fault-sizinti": (
    <>
      <rect x="14" y="12" width="68" height="12" rx="5" fill="#9aa7b8" />
      <rect x="40" y="22" width="16" height="9" fill="#7b8899" />
      <path d="M48 34 c0 0 -6 8 -6 12 a6 6 0 0 0 12 0 c0 -4 -6 -12 -6 -12z" fill={WATER} stroke={BLUE} strokeWidth="1.3" />
      <ellipse cx="48" cy="72" rx="30" ry="9" fill={WATER} opacity=".55" />
      <ellipse cx="48" cy="72" rx="20" ry="5.5" fill={WATER} opacity=".6" />
    </>
  ),
  "fault-tat_koku": (
    <>
      <path d="M28 40 h40 l-4 40 a5 5 0 0 1 -5 4 h-22 a5 5 0 0 1 -5 -4z" fill="#e8f2fd" stroke={BLUE} strokeWidth="2" />
      <path d="M31 56 h34 l-2 24 h-30z" fill={WATER} opacity=".6" />
      <path d="M38 30 q-5 -6 0 -11 t0 -10 M50 30 q-5 -6 0 -11 t0 -10 M62 30 q-5 -6 0 -11 t0 -10" fill="none" stroke="#8a6d3b" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  "fault-ses": (
    <>
      <rect x="18" y="32" width="34" height="34" rx="6" fill="#9aa7b8" stroke={NAVY} strokeOpacity=".3" />
      <circle cx="35" cy="49" r="8" fill="#e8f2fd" />
      <path d="M60 38 q8 11 0 22 M68 31 q13 18 0 36 M76 24 q18 25 0 50" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  "fault-diger": (
    <>
      <circle cx="48" cy="48" r="30" fill="#eaf2fc" stroke={BLUE} strokeWidth="2.5" />
      <text x="48" y="60" textAnchor="middle" fontSize="38" fontWeight="800" fill={BLUE} fontFamily="Figtree, sans-serif">?</text>
    </>
  ),
};

const FALLBACK = (
  <path d="M48 16 c0 0 -22 26 -22 42 a22 22 0 0 0 44 0 c0 -16 -22 -42 -22 -42z" fill={WATER} stroke={BLUE} strokeWidth="2" />
);

export default function OptionArt({ name }) {
  if (!name) return null;
  return (
    <span className="option-art" aria-hidden="true">
      <svg viewBox="0 0 96 96" width="100%" height="100%" focusable="false">{ART[name] || FALLBACK}</svg>
    </span>
  );
}
