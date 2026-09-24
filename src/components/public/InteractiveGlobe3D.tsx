import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Globe,
  Compass,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  Waves,
  Wind,
  ShieldAlert,
  Radio,
  Eye,
  ChevronRight,
  Maximize2,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Mountain,
  Building,
  CheckCircle2,
  Sparkles,
  Search,
  Crosshair
} from 'lucide-react';
import {
  EnvironmentalHotspot,
  GLOBAL_HOTSPOTS,
  ZOOM_HIERARCHIES,
  ZoomNode
} from '../../data/globalEnvironmentalData';

interface InteractiveGlobe3DProps {
  selectedHotspot: EnvironmentalHotspot | null;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  activeLanguage: string;
  onOpenExplainer?: () => void;
  onOpenEvidence?: () => void;
}

// Comprehensive continent and island coastlines for realistic planetary representation
const WORLD_CONTINENTS: Array<{ name: string; isIndia?: boolean; coords: [number, number][] }> = [
  // India Subcontinent (High-resolution coastline and borders)
  {
    name: 'India',
    isIndia: true,
    coords: [
      [8.08, 77.55],   // Kanyakumari
      [8.88, 76.58],   // Kollam
      [9.96, 76.24],   // Kochi
      [11.25, 75.77],  // Kozhikode
      [12.91, 74.85],  // Mangalore
      [15.49, 73.82],  // Goa
      [18.92, 72.83],  // Mumbai
      [20.90, 72.90],  // Surat
      [21.17, 72.83],  // Gulf of Khambhat
      [20.75, 70.98],  // Diu / Saurashtra South
      [22.25, 68.97],  // Dwarka / Okha
      [22.80, 70.10],  // Gulf of Kutch
      [23.70, 68.20],  // Kori Creek / Rann of Kutch
      [24.50, 71.20],  // Rajasthan border south
      [27.00, 70.00],  // Jaisalmer
      [29.90, 73.80],  // Ganganagar
      [31.60, 74.87],  // Amritsar / Punjab
      [32.70, 74.80],  // Jammu
      [34.50, 74.20],  // Kashmir valley
      [35.50, 76.80],  // Karakoram / Siachen
      [34.20, 78.50],  // Ladakh / Pangong
      [31.10, 78.20],  // Himachal
      [30.40, 79.50],  // Uttarakhand / Chamoli
      [28.80, 80.20],  // Nepal-UP border
      [27.50, 84.50],  // Bihar border
      [26.70, 88.40],  // Siliguri corridor
      [27.40, 88.60],  // Sikkim
      [28.00, 92.00],  // Arunachal West
      [28.70, 96.20],  // Arunachal East
      [27.00, 95.50],  // Assam-Nagaland
      [24.50, 93.50],  // Manipur
      [23.00, 93.00],  // Mizoram
      [23.80, 91.30],  // Tripura
      [25.00, 92.00],  // Meghalaya
      [25.20, 89.80],  // Dhubri / Assam
      [22.80, 88.50],  // Sundarbans North
      [21.65, 87.55],  // Digha / West Bengal
      [21.49, 87.00],  // Balasore / Chandipur (Odisha)
      [20.79, 86.92],  // Dhamra Port
      [20.31, 86.61],  // Paradip Port & Mahanadi Estuary
      [19.80, 85.82],  // Puri / Chilika Lake
      [19.31, 84.78],  // Gopalpur
      [17.68, 83.21],  // Visakhapatnam
      [16.98, 82.24],  // Kakinada / Godavari Delta
      [15.82, 80.35],  // Machilipatnam / Krishna Delta
      [14.44, 80.02],  // Nellore
      [13.08, 80.27],  // Chennai
      [11.94, 79.80],  // Puducherry
      [10.76, 79.84],  // Nagapattinam / Kaveri Delta
      [9.28, 79.31],   // Rameswaram
      [8.76, 78.13],   // Thoothukudi
      [8.08, 77.55]    // Back to Kanyakumari
    ]
  },
  // Eurasia (Europe, Russia, Central Asia, East Asia, Southeast Asia)
  {
    name: 'Eurasia',
    coords: [
      [36.0, -5.3],   // Gibraltar
      [36.8, -8.9],   // Cape St Vincent
      [43.8, -9.3],   // Galicia
      [43.5, -1.8],   // Bay of Biscay
      [48.4, -4.7],   // Brittany
      [51.0, 1.8],    // Calais
      [53.6, 7.2],    // Germany coast
      [57.7, 10.6],   // Denmark
      [59.9, 10.7],   // Oslo
      [71.2, 25.8],   // North Cape
      [68.9, 33.1],   // Murmansk
      [73.3, 56.0],   // Novaya Zemlya
      [77.0, 104.0],  // Taymyr Peninsula
      [72.5, 140.0],  // Laptev coast
      [66.0, 170.0],  // Chukotka
      [60.0, 163.0],  // Kamchatka
      [53.0, 142.0],  // Sakhalin
      [43.1, 131.9],  // Vladivostok
      [38.0, 126.0],  // Korea West
      [35.1, 129.0],  // Busan
      [37.5, 129.1],  // Korea East
      [39.0, 122.0],  // Bohai Sea
      [31.2, 121.5],  // Shanghai
      [22.3, 114.2],  // Hong Kong
      [21.0, 108.0],  // Gulf of Tonkin
      [16.0, 108.2],  // Da Nang (Vietnam)
      [10.8, 106.7],  // Mekong Delta
      [8.5, 100.0],   // Thai-Malay Peninsula
      [1.3, 103.8],   // Singapore
      [4.0, 98.0],    // Malacca Strait
      [16.8, 96.2],   // Yangon (Myanmar)
      [20.0, 92.8],   // Rakhine coast
      [22.3, 91.8],   // Chittagong
      [25.0, 67.0],   // Karachi / Pakistan
      [25.3, 62.0],   // Gwadar / Makran
      [27.1, 56.5],   // Strait of Hormuz
      [25.0, 55.0],   // Persian Gulf
      [29.5, 48.0],   // Kuwait
      [24.0, 57.0],   // Oman coast
      [17.0, 54.0],   // Salalah
      [12.8, 45.0],   // Aden (Yemen)
      [13.0, 43.0],   // Bab-el-Mandeb
      [22.0, 39.0],   // Red Sea Saudi
      [28.0, 34.5],   // Gulf of Aqaba
      [31.5, 34.5],   // Levant coast
      [36.8, 36.0],   // Iskenderun (Turkey)
      [36.5, 30.0],   // Antalya
      [38.4, 27.1],   // Aegean Izmir
      [41.0, 29.0],   // Istanbul / Bosphorus
      [44.0, 38.0],   // Black Sea Russia
      [41.6, 41.6],   // Batumi (Georgia)
      [41.3, 36.3],   // Samsun (Turkey)
      [42.0, 28.0],   // Bulgaria Black Sea
      [46.5, 30.7],   // Odessa
      [44.5, 33.5],   // Crimea
      [47.0, 38.0],   // Sea of Azov
      [40.0, 24.0],   // Greece East
      [36.4, 23.0],   // Peloponnese
      [40.6, 17.9],   // Italy Puglia
      [38.1, 15.6],   // Messina / Sicily
      [41.9, 12.5],   // Rome / Tyrrhenian
      [44.4, 8.9],    // Genoa
      [43.3, 5.4],    // Marseille
      [41.4, 2.2],    // Barcelona
      [36.7, -4.4],   // Malaga
      [36.0, -5.3]    // Back to Gibraltar
    ]
  },
  // Africa
  {
    name: 'Africa',
    coords: [
      [35.8, -5.8],   // Tangier
      [33.9, -6.8],   // Rabat
      [30.4, -9.6],   // Agadir
      [23.7, -15.9],  // Western Sahara
      [14.7, -17.4],  // Dakar (Senegal)
      [9.5, -13.7],   // Conakry
      [6.3, -10.8],   // Monrovia
      [4.3, -7.5],    // Cape Palmas
      [5.3, -4.0],    // Abidjan
      [5.6, -0.2],    // Accra
      [6.4, 3.4],     // Lagos (Nigeria)
      [4.0, 9.7],     // Douala (Cameroon)
      [0.4, 9.4],     // Libreville (Gabon)
      [-6.1, 12.4],   // Congo River mouth
      [-8.8, 13.2],   // Luanda (Angola)
      [-16.5, 11.8],  // Namibe
      [-22.9, 14.5],  // Walvis Bay (Namibia)
      [-28.6, 16.5],  // Orange River mouth
      [-33.9, 18.4],  // Cape Town
      [-34.8, 20.0],  // Cape Agulhas
      [-34.0, 25.6],  // Port Elizabeth
      [-29.9, 31.0],  // Durban
      [-25.9, 32.6],  // Maputo (Mozambique)
      [-19.8, 34.8],  // Beira
      [-15.0, 40.7],  // Mozambique North
      [-6.8, 39.3],   // Dar es Salaam (Tanzania)
      [-4.0, 39.7],   // Mombasa (Kenya)
      [2.0, 45.3],    // Mogadishu (Somalia)
      [10.5, 51.3],   // Cape Guardafui (Horn of Africa)
      [11.6, 43.1],   // Djibouti
      [15.6, 39.5],   // Massawa (Eritrea)
      [24.0, 35.5],   // Egypt Red Sea
      [27.8, 34.3],   // Sharm El Sheikh
      [31.2, 32.3],   // Port Said / Suez
      [31.2, 29.9],   // Alexandria
      [32.8, 21.8],   // Benghazi (Libya)
      [32.9, 13.2],   // Tripoli
      [36.8, 10.2],   // Tunis
      [36.8, 3.0],    // Algiers
      [35.7, -0.6],   // Oran
      [35.8, -5.8]    // Back to Tangier
    ]
  },
  // North America
  {
    name: 'North America',
    coords: [
      [71.3, -156.8], // Point Barrow (Alaska)
      [65.0, -168.0], // Bering Strait
      [58.0, -158.0], // Alaska Peninsula
      [54.0, -165.0], // Aleutians root
      [59.0, -140.0], // Gulf of Alaska
      [54.3, -130.4], // Prince Rupert (BC)
      [49.3, -123.1], // Vancouver
      [46.2, -124.0], // Columbia River
      [37.8, -122.5], // San Francisco
      [32.7, -117.2], // San Diego
      [23.0, -110.0], // Cabo San Lucas (Baja)
      [27.0, -110.0], // Gulf of California
      [20.6, -105.2], // Puerto Vallarta
      [16.8, -99.9],  // Acapulco
      [14.6, -92.2],  // Guatemala Pacific
      [8.9, -79.5],   // Panama canal
      [9.5, -79.0],   // Panama Caribbean
      [15.8, -87.9],  // Honduras Caribbean
      [18.5, -88.3],  // Belize
      [21.2, -86.7],  // Cancun (Yucatan)
      [19.2, -96.1],  // Veracruz (Mexico)
      [26.0, -97.1],  // Brownsville (Texas)
      [29.3, -94.8],  // Galveston
      [29.2, -89.4],  // Mississippi Delta
      [27.8, -82.6],  // Tampa (Florida)
      [24.5, -81.8],  // Key West
      [25.8, -80.1],  // Miami
      [32.1, -80.8],  // Savannah (Georgia)
      [35.2, -75.5],  // Cape Hatteras
      [38.8, -75.0],  // Delaware Bay
      [40.7, -74.0],  // New York Harbor
      [42.3, -71.0],  // Boston / Cape Cod
      [44.6, -63.6],  // Halifax (Nova Scotia)
      [47.5, -52.7],  // St. John's (Newfoundland)
      [53.0, -56.0],  // Labrador
      [62.0, -65.0],  // Frobisher Bay
      [70.0, -85.0],  // Baffin Island
      [74.0, -110.0], // Canadian Arctic Archipelago
      [71.3, -156.8]  // Back to Point Barrow
    ]
  },
  // South America
  {
    name: 'South America',
    coords: [
      [11.0, -74.8],  // Barranquilla (Colombia)
      [10.6, -71.6],  // Maracaibo (Venezuela)
      [10.5, -66.9],  // Caracas
      [8.6, -60.0],   // Orinoco Delta
      [5.0, -52.0],   // French Guiana
      [0.0, -50.0],   // Amazon River mouth
      [-2.5, -44.3],  // Sao Luis
      [-5.8, -35.2],  // Natal (Easternmost horn)
      [-13.0, -38.5], // Salvador da Bahia
      [-22.9, -43.2], // Rio de Janeiro
      [-24.0, -46.3], // Santos / Sao Paulo
      [-30.0, -50.1], // Porto Alegre
      [-34.6, -58.4], // Buenos Aires / Rio de la Plata
      [-38.0, -57.5], // Mar del Plata
      [-45.8, -67.5], // Comodoro Rivadavia
      [-52.5, -68.3], // Strait of Magellan
      [-55.0, -67.0], // Cape Horn
      [-46.0, -75.0], // Chilean Fjords
      [-33.0, -71.6], // Valparaiso (Chile)
      [-23.6, -70.4], // Antofagasta
      [-12.0, -77.0], // Lima (Peru)
      [-4.0, -81.0],  // Talara / Piura
      [-2.2, -79.9],  // Guayaquil (Ecuador)
      [3.9, -77.0],   // Buenaventura (Colombia)
      [7.5, -77.5],   // Darien Gap
      [11.0, -74.8]   // Back to Barranquilla
    ]
  },
  // Australia & New Zealand
  {
    name: 'Australia',
    coords: [
      [-12.4, 130.8], // Darwin
      [-11.0, 136.0], // Arnhem Land
      [-12.0, 142.0], // Cape York
      [-16.9, 145.8], // Cairns / Great Barrier Reef
      [-23.4, 150.5], // Rockhampton
      [-27.5, 153.0], // Brisbane
      [-33.9, 151.2], // Sydney
      [-37.8, 145.0], // Melbourne
      [-39.0, 146.4], // Wilsons Promontory
      [-35.0, 138.5], // Adelaide
      [-32.0, 133.0], // Great Australian Bight
      [-34.0, 121.9], // Esperance
      [-35.0, 117.9], // Albany
      [-32.0, 115.8], // Perth / Fremantle
      [-24.9, 113.6], // Shark Bay
      [-21.9, 114.1], // Exmouth / North West Cape
      [-20.3, 118.6], // Port Hedland
      [-17.9, 122.2], // Broome
      [-14.0, 126.0], // Kimberley
      [-12.4, 130.8]  // Back to Darwin
    ]
  },
  // Japan Archipelago
  {
    name: 'Japan',
    coords: [
      [31.0, 130.5],  // Kyushu
      [33.5, 130.4],  // Fukuoka
      [34.3, 132.4],  // Hiroshima
      [34.7, 135.5],  // Osaka
      [35.4, 139.7],  // Tokyo Bay
      [38.3, 141.0],  // Sendai
      [40.8, 140.7],  // Aomori
      [42.0, 141.0],  // Hokkaido South
      [45.4, 141.7],  // Cape Soya (Hokkaido North)
      [43.0, 145.0],  // Nemuro
      [42.3, 143.0],  // Erimo
      [41.5, 140.0],  // Tsugaru
      [37.5, 137.0],  // Noto Peninsula
      [35.5, 133.0],  // Shimane
      [33.8, 131.0],  // Kitakyushu
      [31.0, 130.5]   // Back to Kyushu
    ]
  },
  // British Isles
  {
    name: 'British Isles',
    coords: [
      [50.0, -5.2],   // Lizard Point
      [50.7, -1.3],   // Isle of Wight
      [51.3, 1.4],    // Dover
      [52.9, 1.5],    // Norfolk
      [54.5, -0.6],   // Yorkshire
      [57.0, -2.0],   // Aberdeen
      [58.6, -3.1],   // John o' Groats
      [58.5, -5.0],   // Cape Wrath
      [56.0, -5.5],   // Argyll
      [54.8, -5.0],   // Galloway
      [53.4, -3.0],   // Liverpool
      [51.6, -5.0],   // Pembrokeshire
      [50.3, -4.5],   // Cornwall
      [50.0, -5.2]    // Back to Lizard Point
    ]
  }
];

// CWC River Gauges around Mahanadi basin
const CWC_RIVER_GAUGES = [
  { name: 'Jobra Barrage', lat: 20.485, lon: 85.912, stage: '21.65m', status: 'WARNING' },
  { name: 'Naraj Barrage', lat: 20.467, lon: 85.765, stage: '26.45m', status: 'ALERT' },
  { name: 'Jenapur (Brahmani)', lat: 20.875, lon: 86.012, stage: '22.10m', status: 'WARNING' },
  { name: 'Anandapur (Baitarani)', lat: 21.218, lon: 86.121, stage: '36.80m', status: 'ALERT' },
  { name: 'Alipingal (Devi)', lat: 20.150, lon: 86.250, stage: '11.40m', status: 'DANGER' }
];

export const InteractiveGlobe3D: React.FC<InteractiveGlobe3DProps> = ({
  selectedHotspot,
  onSelectHotspot,
  activeLanguage,
  onOpenExplainer,
  onOpenEvidence
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 60fps Ref-based Camera state (avoids React re-render thrashing!)
  const rotYRef = useRef<number>(-1.48); // Longitude angle in rad (~85°E, Bay of Bengal / India)
  const rotXRef = useRef<number>(0.35);  // Latitude tilt in rad (~20°N, Tropic of Cancer)
  const zoomRef = useRef<number>(1.0);   // DEFAULT 1.0: Full Earth Pristine View
  const targetZoomRef = useRef<number>(1.0);
  const targetRotYRef = useRef<number | null>(null);
  const targetRotXRef = useRef<number | null>(null);

  // Auto-rotation engine
  const autoSpinRef = useRef<boolean>(true); // DEFAULT TRUE: The Earth is Alive!
  const spinSpeedRef = useRef<number>(0.0015); // Smooth, subtle planetary rotation
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const isUserInteractingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });

  // Animation & Rendering loop tracking
  const animFrameRef = useRef<number | null>(null);
  const pulseRef = useRef<number>(0);

  // UI state for floating controls & layer drawers
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [activeLayers, setActiveLayers] = useState({
    rainfallRadar: true,
    riverGauges: true,
    cycloneField: true,
    seismicActivity: true,
    infrastructure: true,
    graticules: true,
    atmosphereGlow: true
  });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<EnvironmentalHotspot | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeHierarchyIndex, setActiveHierarchyIndex] = useState<number>(0);

  const hierarchy = ZOOM_HIERARCHIES[0]; // Mahanadi Delta path

  // Smooth camera tween to specific lat/lon with target zoom
  const focusOnCoordinates = useCallback((lat: number, lon: number, targetZoom = 1.9) => {
    autoSpinRef.current = false;
    setIsAutoSpinning(false);
    lastInteractionTimeRef.current = Date.now();

    const targetY = -((lon * Math.PI) / 180);
    const targetX = Math.max(-1.25, Math.min(1.25, (lat * Math.PI) / 180));

    targetRotYRef.current = targetY;
    targetRotXRef.current = targetX;
    targetZoomRef.current = targetZoom;
  }, []);

  // Reset to full global Earth view
  const handleResetToEarth = useCallback(() => {
    targetRotYRef.current = -1.48;
    targetRotXRef.current = 0.35;
    targetZoomRef.current = 1.0;
    lastInteractionTimeRef.current = Date.now() - 3000; // Trigger auto-rotation resume
    autoSpinRef.current = true;
    setIsAutoSpinning(true);
    setActiveHierarchyIndex(0);
  }, []);

  // Sync when selectedHotspot prop changes
  useEffect(() => {
    if (selectedHotspot) {
      focusOnCoordinates(
        selectedHotspot.coordinates.latitude,
        selectedHotspot.coordinates.longitude,
        2.2
      );
    }
  }, [selectedHotspot, focusOnCoordinates]);

  // 3D Spherical Orthographic Projection Helper
  // Returns [screenX, screenY, isFrontHemisphere, cosIllumination]
  const project3D = useCallback((
    lat: number,
    lon: number,
    cx: number,
    cy: number,
    radius: number,
    rX: number,
    rY: number
  ): [number, number, boolean, number] => {
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;

    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    // Apply longitude rotation (rY)
    const lambdaRot = lambda + rY;
    const cosLambdaRot = Math.cos(lambdaRot);
    const sinLambdaRot = Math.sin(lambdaRot);

    // 3D Cartesian coordinates (unit sphere)
    let x = cosPhi * sinLambdaRot;
    let y = -sinPhi; // Canvas Y goes downward
    let z = cosPhi * cosLambdaRot;

    // Apply latitude tilt (rX)
    const cosRotX = Math.cos(rX);
    const sinRotX = Math.sin(rX);

    const yRot = y * cosRotX - z * sinRotX;
    const zRot = y * sinRotX + z * cosRotX;

    // Sun directional lighting vector: upper-left daylight (Lx = -0.5, Ly = -0.4, Lz = 0.77)
    const cosIllum = Math.max(0, -0.4 * x - 0.3 * yRot + 0.86 * zRot);

    // Front hemisphere visibility test: zRot > -0.02
    const isVisible = zRot > -0.02;

    const screenX = cx + x * radius;
    const screenY = cy + yRot * radius;

    return [screenX, screenY, isVisible, cosIllum];
  }, []);

  // Main 60fps Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      pulseRef.current = (pulseRef.current + 0.035) % (Math.PI * 2);

      // 1. Camera Tween Interpolation (Smooth Target Tracking)
      if (targetRotYRef.current !== null) {
        let diffY = targetRotYRef.current - rotYRef.current;
        // Shortest angular path
        while (diffY > Math.PI) diffY -= Math.PI * 2;
        while (diffY < -Math.PI) diffY += Math.PI * 2;
        rotYRef.current += diffY * 0.08;
        if (Math.abs(diffY) < 0.002) targetRotYRef.current = null;
      }

      if (targetRotXRef.current !== null) {
        const diffX = targetRotXRef.current - rotXRef.current;
        rotXRef.current += diffX * 0.08;
        if (Math.abs(diffX) < 0.002) targetRotXRef.current = null;
      }

      if (targetZoomRef.current !== zoomRef.current) {
        const diffZ = targetZoomRef.current - zoomRef.current;
        zoomRef.current += diffZ * 0.08;
        if (Math.abs(diffZ) < 0.01) zoomRef.current = targetZoomRef.current;
      }

      // 2. Intelligent Auto-Rotation Engine
      // If user is not interacting, check inactivity timer (2.5s pause)
      if (!isUserInteractingRef.current && targetRotYRef.current === null) {
        const timeSinceInteraction = Date.now() - lastInteractionTimeRef.current;
        if (timeSinceInteraction > 2500) {
          if (!autoSpinRef.current) {
            autoSpinRef.current = true;
            setIsAutoSpinning(true);
          }
          rotYRef.current += spinSpeedRef.current;
        }
      }

      // 3. Inertia Physics on Drag Release
      if (!isDraggingRef.current && (Math.abs(velocityRef.current.vx) > 0.0001 || Math.abs(velocityRef.current.vy) > 0.0001)) {
        rotYRef.current += velocityRef.current.vx;
        rotXRef.current = Math.max(-1.25, Math.min(1.25, rotXRef.current + velocityRef.current.vy));
        velocityRef.current.vx *= 0.92;
        velocityRef.current.vy *= 0.92;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // 4. PRECISE FRAMING MATHEMATICS:
      // Base radius is 0.38 of the smaller dimension.
      // At zoom 1.0, globe diameter is 0.76 of height, leaving 12% space on top and bottom.
      // Entire Earth, North Pole, South Pole, and atmosphere glow fit 100% inside!
      const baseRadius = Math.min(width, height) * 0.38;
      const globeRadius = baseRadius * zoomRef.current;

      const currentRotX = rotXRef.current;
      const currentRotY = rotYRef.current;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Deep Space Stellar Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Nebula radial atmosphere gradient
      const spaceGlow = ctx.createRadialGradient(cx, cy, globeRadius * 0.4, cx, cy, Math.max(width, height) * 0.7);
      spaceGlow.addColorStop(0, '#0a1329');
      spaceGlow.addColorStop(0.5, '#040915');
      spaceGlow.addColorStop(1, '#02050b');
      ctx.fillStyle = spaceGlow;
      ctx.fillRect(0, 0, width, height);

      // 5. Atmosphere Outer Rayleigh Glow Halo (Section 11)
      if (activeLayers.atmosphereGlow) {
        ctx.save();
        const glowGrad = ctx.createRadialGradient(
          cx, cy, globeRadius * 0.96,
          cx, cy, globeRadius * 1.14
        );
        glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        glowGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.16)');
        glowGrad.addColorStop(0.75, 'rgba(3, 105, 161, 0.04)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, globeRadius * 1.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Globe Spherical Clipping Boundary
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.clip(); // All terrestrial rendering is clipped cleanly to the globe perimeter

      // Realistic 3D Ocean Shading with Directional Sunlight
      const oceanGrad = ctx.createRadialGradient(
        cx - globeRadius * 0.32, cy - globeRadius * 0.32, globeRadius * 0.05,
        cx + globeRadius * 0.2, cy + globeRadius * 0.2, globeRadius * 1.05
      );
      oceanGrad.addColorStop(0, '#0c3559'); // Sunlit tropical azure
      oceanGrad.addColorStop(0.45, '#071f38'); // Open pelagic ocean
      oceanGrad.addColorStop(0.85, '#041121'); // Deep abyssal navy
      oceanGrad.addColorStop(1, '#02070f'); // Shadowed night-side limb
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(cx - globeRadius, cy - globeRadius, globeRadius * 2, globeRadius * 2);

      // 7. Graticule Lat/Lon Grid Lines (Subtle & Scientific)
      if (activeLayers.graticules) {
        // Latitude Parallels every 30°
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath();
          let first = true;
          const isEquator = lat === 0;
          ctx.strokeStyle = isEquator ? 'rgba(56, 189, 248, 0.22)' : 'rgba(148, 163, 184, 0.08)';
          ctx.lineWidth = isEquator ? 1.2 : 0.7;

          for (let lon = -180; lon <= 180; lon += 4) {
            const [px, py, visible] = project3D(lat, lon, cx, cy, globeRadius, currentRotX, currentRotY);
            if (visible) {
              if (first) {
                ctx.moveTo(px, py);
                first = false;
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }

        // Longitude Meridians every 30°
        for (let lon = -180; lon < 180; lon += 30) {
          ctx.beginPath();
          let first = true;
          const isPrime = lon === 0 || lon === 80;
          ctx.strokeStyle = isPrime ? 'rgba(56, 189, 248, 0.18)' : 'rgba(148, 163, 184, 0.07)';
          ctx.lineWidth = 0.7;

          for (let lat = -80; lat <= 80; lat += 4) {
            const [px, py, visible] = project3D(lat, lon, cx, cy, globeRadius, currentRotX, currentRotY);
            if (visible) {
              if (first) {
                ctx.moveTo(px, py);
                first = false;
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }
      }

      // 8. High-Fidelity Continental Landmasses
      WORLD_CONTINENTS.forEach(continent => {
        ctx.beginPath();
        let anyVisible = false;
        let first = true;

        continent.coords.forEach(([lat, lon]) => {
          const [px, py, visible] = project3D(lat, lon, cx, cy, globeRadius, currentRotX, currentRotY);
          if (visible) {
            anyVisible = true;
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          }
        });

        if (anyVisible) {
          ctx.closePath();
          // Landmass fill: India is specially highlighted in rich emerald; other continents in balanced slate-emerald
          if (continent.isIndia) {
            ctx.fillStyle = 'rgba(22, 101, 52, 0.42)'; // Rich emerald-forest
            ctx.fill();
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)'; // Crisp statutory border
            ctx.lineWidth = 1.6;
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(30, 41, 59, 0.55)'; // Elegant slate-earth
            ctx.fill();
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      });

      // 9. CWC River Channels & Hydrological Network (Section 12)
      if (activeLayers.riverGauges) {
        const riverPathCoords: [number, number][] = [
          [20.95, 83.2], [20.75, 84.1], [20.55, 84.9], [20.485, 85.912],
          [20.35, 86.4], [20.25, 86.7]
        ];

        ctx.beginPath();
        let rFirst = true;
        riverPathCoords.forEach(([lat, lon]) => {
          const [px, py, visible] = project3D(lat, lon, cx, cy, globeRadius, currentRotX, currentRotY);
          if (visible) {
            if (rFirst) {
              ctx.moveTo(px, py);
              rFirst = false;
            } else {
              ctx.lineTo(px, py);
            }
          }
        });
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.lineWidth = Math.max(1.8, 2.2 * (zoomRef.current / 1.5));
        ctx.stroke();

        // Render CWC gauge nodes
        CWC_RIVER_GAUGES.forEach(gauge => {
          const [gx, gy, gvis] = project3D(gauge.lat, gauge.lon, cx, cy, globeRadius, currentRotX, currentRotY);
          if (gvis) {
            ctx.fillStyle = gauge.status === 'DANGER' ? '#ef4444' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(gx, gy, Math.max(3.2, 4.2 * (zoomRef.current / 1.5)), 0, Math.PI * 2);
            ctx.fill();

            // Label at zoom >= 1.7
            if (zoomRef.current >= 1.7) {
              ctx.font = '10px monospace';
              ctx.fillStyle = '#67e8f9';
              ctx.fillText(`${gauge.name} (${gauge.stage})`, gx + 7, gy + 3);
            }
          }
        });
      }

      // 10. Cyclone Dana Rotating Spiral Wind Field (Section 12)
      if (activeLayers.cycloneField) {
        const stormLat = 20.35;
        const stormLon = 86.70;
        const [sx, sy, svis] = project3D(stormLat, stormLon, cx, cy, globeRadius, currentRotX, currentRotY);

        if (svis) {
          ctx.save();
          const arms = 4;
          const maxR = 48 * (zoomRef.current / 1.5);

          // Draw rotating spiral streamline arms
          for (let a = 0; a < arms; a++) {
            const startAngle = (a * (Math.PI * 2)) / arms + pulseRef.current * 0.9;
            ctx.beginPath();
            for (let r = 5; r <= maxR; r += 2.5) {
              const theta = startAngle + (r / maxR) * Math.PI * 2.3;
              const armX = sx + r * Math.cos(theta);
              const armY = sy + r * Math.sin(theta);
              if (r === 5) ctx.moveTo(armX, armY);
              else ctx.lineTo(armX, armY);
            }
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.55 - a * 0.08})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }

          // Cyclone Eye Center
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Outer gale threshold ring
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(sx, sy, maxR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 11. Live Doppler Weather Radar Sweep (Section 12)
      if (activeLayers.rainfallRadar) {
        const radarLat = 20.31;
        const radarLon = 86.61;
        const [rx, ry, rvis] = project3D(radarLat, radarLon, cx, cy, globeRadius, currentRotX, currentRotY);

        if (rvis) {
          ctx.save();
          const radarSweepR = 56 * (zoomRef.current / 1.5);
          const sweepAngle = pulseRef.current * 2.2;

          const sweepGrad = ctx.createRadialGradient(rx, ry, 2, rx, ry, radarSweepR);
          sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
          sweepGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.3)');
          sweepGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

          ctx.fillStyle = sweepGrad;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.arc(rx, ry, radarSweepR, sweepAngle - 0.75, sweepAngle);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // 12. Active Environmental Hotspots (Section 14 & 15)
      GLOBAL_HOTSPOTS.forEach(hotspot => {
        const [hx, hy, hvis] = project3D(
          hotspot.coordinates.latitude,
          hotspot.coordinates.longitude,
          cx, cy, globeRadius, currentRotX, currentRotY
        );

        if (hvis) {
          const isSelected = selectedHotspot?.id === hotspot.id;
          const isHovered = hoveredHotspot?.id === hotspot.id;

          let color = '#22c55e';
          if (hotspot.severity === 'CRITICAL') color = '#ef4444';
          else if (hotspot.severity === 'HIGH') color = '#f97316';
          else if (hotspot.severity === 'MODERATE') color = '#eab308';

          // Pulsing halo wave
          const waveRadius = 7 + Math.sin(pulseRef.current * 2.5) * 6;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(hx, hy, waveRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Core node
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(hx, hy, isSelected || isHovered ? 6.5 : 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Selection highlight ring
          if (isSelected) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(hx, hy, 15, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Hotspot label
          ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
          ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
          ctx.fillText(hotspot.name.split(' ')[0], hx + 10, hy - 4);
        }
      });

      // End of globe sphere clipping
      ctx.restore();

      // 13. Glassmorphism Sphere Rim & Reflection
      ctx.save();
      const rimGrad = ctx.createRadialGradient(
        cx, cy, globeRadius * 0.94,
        cx, cy, globeRadius
      );
      rimGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      rimGrad.addColorStop(0.82, 'rgba(56, 189, 248, 0.16)');
      rimGrad.addColorStop(1, 'rgba(125, 211, 252, 0.45)');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Crisp circular boundary ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [project3D, activeLayers, selectedHotspot, hoveredHotspot]);

  // Handle Dynamic Resize (Section 3)
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse & Touch Drag Interaction Handlers (Section 5 & 6)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    isUserInteractingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { vx: 0, vy: 0 };
    targetRotYRef.current = null;
    targetRotXRef.current = null;
    autoSpinRef.current = false;
    setIsAutoSpinning(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseCanvasX = e.clientX - rect.left;
    const mouseCanvasY = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      const deltaY = (dx * 0.0055) / zoomRef.current;
      const deltaX = (dy * 0.0055) / zoomRef.current;

      rotYRef.current += deltaY;
      rotXRef.current = Math.max(-1.25, Math.min(1.25, rotXRef.current + deltaX));

      velocityRef.current = { vx: deltaY * 0.5, vy: deltaX * 0.5 };
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      lastInteractionTimeRef.current = Date.now();
    } else {
      // Hover detection on hotspots
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const baseRadius = Math.min(rect.width, rect.height) * 0.38;
      const globeRadius = baseRadius * zoomRef.current;

      let closest: EnvironmentalHotspot | null = null;
      let minDistance = 20;

      GLOBAL_HOTSPOTS.forEach(hotspot => {
        const [px, py, visible] = project3D(
          hotspot.coordinates.latitude,
          hotspot.coordinates.longitude,
          cx, cy, globeRadius, rotXRef.current, rotYRef.current
        );

        if (visible) {
          const dist = Math.hypot(px - mouseCanvasX, py - mouseCanvasY);
          if (dist < minDistance) {
            minDistance = dist;
            closest = hotspot;
          }
        }
      });

      setHoveredHotspot(closest);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isUserInteractingRef.current = false;
    lastInteractionTimeRef.current = Date.now();
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      isUserInteractingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velocityRef.current = { vx: 0, vy: 0 };
      autoSpinRef.current = false;
      setIsAutoSpinning(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - lastMousePosRef.current.x;
      const dy = e.touches[0].clientY - lastMousePosRef.current.y;

      const deltaY = (dx * 0.0055) / zoomRef.current;
      const deltaX = (dy * 0.0055) / zoomRef.current;

      rotYRef.current += deltaY;
      rotXRef.current = Math.max(-1.25, Math.min(1.25, rotXRef.current + deltaX));

      velocityRef.current = { vx: deltaY * 0.5, vy: deltaX * 0.5 };
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastInteractionTimeRef.current = Date.now();
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    isUserInteractingRef.current = false;
    lastInteractionTimeRef.current = Date.now();
  };

  // Wheel Zoom handler with strict clamping [0.85, 3.6]
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    const newZoom = Math.max(0.85, Math.min(3.6, zoomRef.current + zoomDelta));
    zoomRef.current = newZoom;
    targetZoomRef.current = newZoom;
    lastInteractionTimeRef.current = Date.now();
  };

  const handleCanvasClick = () => {
    if (hoveredHotspot) {
      onSelectHotspot(hoveredHotspot);
    }
  };

  // Stepper Node Click
  const handleSelectHierarchyNode = (node: ZoomNode, index: number) => {
    setActiveHierarchyIndex(index);
    focusOnCoordinates(
      node.centerCoordinates.latitude,
      node.centerCoordinates.longitude,
      node.zoomLevel * 0.5 + 0.8
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-175px)] min-h-[520px] max-h-[760px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col select-none"
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* TOP LEFT: LOCATION BREADCRUMB (Section 17) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-none">
        <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-full px-3.5 py-1.5 shadow-2xl pointer-events-auto">
          <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
          <button
            onClick={handleResetToEarth}
            className="text-xs font-bold text-white hover:text-emerald-400 transition-colors"
          >
            Earth
          </button>
          {hierarchy.nodes.slice(1).map((node, index) => {
            const nodeIndex = index + 1;
            const isActive = activeHierarchyIndex === nodeIndex;
            return (
              <React.Fragment key={node.id}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <button
                  onClick={() => handleSelectHierarchyNode(node, nodeIndex)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {node.name.split(' ')[0]}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* COMPACT CURRENT SITUATION FLOATING CARD (Section 19) */}
        <div className="hidden sm:block pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl p-3.5 max-w-xs shadow-2xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CURRENT SITUATION</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">4m ago</span>
          </div>

          <p className="text-xs text-slate-200 leading-snug font-medium">
            Heavy rainfall active across coastal Odisha catchments. Mahanadi stage elevated (+0.65m over Warning).
          </p>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Flood risk:</span>
            <span className="font-bold text-amber-400">Increasing</span>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            {onOpenExplainer && (
              <button
                onClick={onOpenExplainer}
                className="flex-1 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Explain</span>
              </button>
            )}
            {onOpenEvidence && (
              <button
                onClick={onOpenEvidence}
                className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Evidence</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOP RIGHT: REDESIGNED EARTH SENSOR LAYERS PANEL (Section 18) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden transition-all">
          <button
            onClick={() => setIsLayerMenuOpen(p => !p)}
            className="px-3.5 py-2 flex items-center space-x-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors w-full"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Earth Layers</span>
            {isLayerMenuOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />}
          </button>

          {isLayerMenuOpen && (
            <div className="px-3.5 pb-3 pt-1 border-t border-slate-800 space-y-2.5 max-w-[220px] text-xs animate-fadeIn">
              {/* Atmosphere */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Atmosphere
                </span>
                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white mb-1">
                  <span className="flex items-center space-x-1.5 text-[11px]">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    <span>Doppler Radar</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.rainfallRadar}
                    onChange={e => setActiveLayers(p => ({ ...p, rainfallRadar: e.target.checked }))}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                  />
                </label>
                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span className="flex items-center space-x-1.5 text-[11px]">
                    <Wind className="w-3 h-3 text-orange-400" />
                    <span>Cyclone Wind Field</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.cycloneField}
                    onChange={e => setActiveLayers(p => ({ ...p, cycloneField: e.target.checked }))}
                    className="rounded border-slate-700 text-orange-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                  />
                </label>
              </div>

              {/* Water */}
              <div className="pt-1.5 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Water & Rivers
                </span>
                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span className="flex items-center space-x-1.5 text-[11px]">
                    <Waves className="w-3 h-3 text-cyan-400" />
                    <span>CWC River Gauges</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.riverGauges}
                    onChange={e => setActiveLayers(p => ({ ...p, riverGauges: e.target.checked }))}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                  />
                </label>
              </div>

              {/* Reference */}
              <div className="pt-1.5 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Reference Grid
                </span>
                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white mb-1">
                  <span className="flex items-center space-x-1.5 text-[11px]">
                    <Compass className="w-3 h-3 text-slate-400" />
                    <span>Lat/Lon Graticules</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.graticules}
                    onChange={e => setActiveLayers(p => ({ ...p, graticules: e.target.checked }))}
                    className="rounded border-slate-700 text-slate-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                  />
                </label>
                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span className="flex items-center space-x-1.5 text-[11px]">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Atmospheric Glow</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.atmosphereGlow}
                    onChange={e => setActiveLayers(p => ({ ...p, atmosphereGlow: e.target.checked }))}
                    className="rounded border-slate-700 text-blue-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING HOVERED HOTSPOT TOOLTIP */}
      {hoveredHotspot && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl max-w-xs transition-opacity duration-150"
          style={{ left: mousePos.x, top: mousePos.y - 10 }}
        >
          <div className="flex items-center justify-between space-x-2 mb-1.5">
            <span className="text-xs font-bold text-white tracking-tight">{hoveredHotspot.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                hoveredHotspot.severity === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : hoveredHotspot.severity === 'HIGH'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {hoveredHotspot.severity}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug mb-2">{hoveredHotspot.humanSummary}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
            <span>{hoveredHotspot.primaryMetric}:</span>
            <span className="font-mono font-semibold text-emerald-400">{hoveredHotspot.primaryValue}</span>
          </div>
          <div className="text-[9px] text-cyan-400 text-right mt-1 font-semibold">Click marker to focus →</div>
        </div>
      )}

      {/* BOTTOM CENTER: QUICK HOTSPOT CHIPS (Section 20) */}
      <div className="absolute bottom-14 inset-x-4 z-20 flex items-center justify-center pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-full px-3 py-1.5 overflow-x-auto max-w-full shadow-2xl scrollbar-none pointer-events-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1 pr-1 flex items-center space-x-1">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Focus:</span>
          </span>
          {GLOBAL_HOTSPOTS.map(hotspot => {
            const isSelected = selectedHotspot?.id === hotspot.id;
            return (
              <button
                key={hotspot.id}
                onClick={() => {
                  onSelectHotspot(hotspot);
                  focusOnCoordinates(
                    hotspot.coordinates.latitude,
                    hotspot.coordinates.longitude,
                    2.2
                  );
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    hotspot.severity === 'CRITICAL'
                      ? 'bg-red-400 animate-pulse'
                      : hotspot.severity === 'HIGH'
                      ? 'bg-orange-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span>{hotspot.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BAR: CAMERA CONTROLS & "VIEW EARTH" RESET (Section 21) */}
      <div className="absolute bottom-3 inset-x-4 z-20 flex items-center justify-between text-xs">
        {/* Left: Controls & View Earth Button */}
        <div className="flex items-center space-x-2">
          {/* RESET TO EARTH BUTTON (Section 21) */}
          <button
            onClick={handleResetToEarth}
            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-emerald-500/40 text-emerald-400 hover:text-white rounded-xl shadow-lg text-xs font-bold flex items-center space-x-1.5 transition-all"
            title="Return to full global Earth view"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Earth</span>
          </button>

          {/* Spin & Zoom Controls */}
          <div className="flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl p-1 shadow-lg">
            <button
              onClick={() => {
                const nextState = !isAutoSpinning;
                autoSpinRef.current = nextState;
                setIsAutoSpinning(nextState);
              }}
              title={isAutoSpinning ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
              className={`p-1.5 rounded-lg transition-colors ${
                isAutoSpinning
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={() => {
                const newZoom = Math.min(3.6, zoomRef.current + 0.35);
                zoomRef.current = newZoom;
                targetZoomRef.current = newZoom;
              }}
              title="Zoom In"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const newZoom = Math.max(0.85, zoomRef.current - 0.35);
                zoomRef.current = newZoom;
                targetZoomRef.current = newZoom;
              }}
              title="Zoom Out"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Coordinates & Projection Status */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl px-3 py-1.5 text-[11px] text-slate-400 shadow-lg font-mono">
          <span className="text-emerald-400 font-semibold">
            {((rotXRef.current * 180) / Math.PI).toFixed(1)}°N, {((-rotYRef.current * 180) / Math.PI).toFixed(1)}°E
          </span>
          <span className="text-slate-600">|</span>
          <span>Zoom {zoomRef.current.toFixed(1)}x</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">3D Orthographic Spherical</span>
        </div>
      </div>
    </div>
  );
};
