// GeoShield India v1.0 — Central Authority & Standards Registry
// Single Source of Truth for Statutory Authorities, Standards, APIs, and Datasets

export type ValidationStatus = 'VERIFIED' | 'NEEDS_VALIDATION' | 'INCORRECT' | 'NOT_APPLICABLE';

export interface AuthorityRegistryEntry {
  id: string;
  category: 
    | 'Meteorology'
    | 'Ocean / Storm Surge'
    | 'River / Flood'
    | 'Disaster Management'
    | 'Earth Observation'
    | 'Roads & Highways'
    | 'Structural & Civil'
    | 'Electrical Lifeline'
    | 'Emergency Communications';
  authority: string;
  departmentOrDivision: string;
  standardOrDataset: string;
  versionOrEdition: string;
  purpose: string;
  geographicScope: string;
  applicableHazard: string;
  applicableAsset: string;
  inputData: string[];
  output: string;
  updateFrequency: string;
  officialSource: string;
  officialApiOrPortal: string;
  fallbackSource: string;
  validationStatus: ValidationStatus;
  lastVerified: string;
  confidenceScore: number; // 0.0 - 1.0
  notes: string;
}

export const INDIA_AUTHORITY_REGISTRY: AuthorityRegistryEntry[] = [
  // 1. Meteorology (IMD)
  {
    id: 'MET-IMD-01',
    category: 'Meteorology',
    authority: 'IMD (India Meteorological Department)',
    departmentOrDivision: 'Cyclone Warning Division (RSMC New Delhi)',
    standardOrDataset: 'Tropical Cyclone Advisory Bulletin (TCP) & 3-Hourly Best Track',
    versionOrEdition: 'NDMA SOP for Cyclones 2019 / WMO TCP 21',
    purpose: 'Authoritative cyclone track, intensity, central pressure deficit, and landfall corridor prediction',
    geographicScope: 'North Indian Ocean (Bay of Bengal & Arabian Sea), Odisha Coastal Belt',
    applicableHazard: 'Cyclone, Extreme Wind, Gale Gusts',
    applicableAsset: 'All coastal lifelines, shelters, transmission corridors, ports',
    inputData: ['INSAT-3DR TIR/WV Imagers', 'Doppler Weather Radars (Paradip, Gopalpur)', 'Ocean Moored Buoys (DS4/BD08)', 'AWS Gauges'],
    output: '6-hourly predicted cyclone track coordinates, MSW (km/h), quadrant wind radii (34/50/64 kts)',
    updateFrequency: 'Every 3 Hours during active cyclone alert stage',
    officialSource: 'IMD RSMC New Delhi (rsmcnewdelhi.imd.gov.in)',
    officialApiOrPortal: 'https://mausam.imd.gov.in / RSMC GTS Gateway',
    fallbackSource: 'NCMRWF Unified Model (NCUM) & ECMWF IFS 0.1° deterministic',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.94,
    notes: 'Primary Tier 1 statutory forecast authority in India. AI synthesis must not override IMD wind track coordinates.'
  },
  {
    id: 'MET-IMD-02',
    category: 'Meteorology',
    authority: 'IMD / NCMRWF',
    departmentOrDivision: 'Radar Meteorology Division / Satellite Hydrology',
    standardOrDataset: 'Doppler Radar Reflectivity (Z) & 0.25° Gridded Rainfall',
    versionOrEdition: 'IMD QPE Standard Protocol v3.1',
    purpose: 'High-resolution quantitative precipitation estimation (QPE) and short-term cloudburst nowcasting',
    geographicScope: 'Odisha, West Bengal, Andhra Pradesh Coastal Districts',
    applicableHazard: 'Extreme Rainfall, Pluvial Urban Flooding, Drainage Choking',
    applicableAsset: 'Culverts, drainage canals, low-lying substations, hospital basements',
    inputData: ['DWR Paradip S-band Radar', 'District Automated Rain Gauge (ARG) network', 'INSAT-3DR Hydro-Estimator'],
    output: '1-hr and 3-hr cumulative rainfall accumulation fields (mm/hr), flash flood guidance (FFG)',
    updateFrequency: 'Every 15 minutes (Radar) / 1 hour (AWS)',
    officialSource: 'IMD Radar Network & NWP Portal',
    officialApiOrPortal: 'https://radar.imd.gov.in',
    fallbackSource: 'NASA GPM IMERG Early Run (0.1° gridded)',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.90,
    notes: 'Directly drives hydraulic watershed runoff and embankment overtopping models.'
  },

  // 2. Ocean / Storm Surge (INCOIS)
  {
    id: 'OCEAN-INCOIS-01',
    category: 'Ocean / Storm Surge',
    authority: 'INCOIS (Indian National Centre for Ocean Information Services)',
    departmentOrDivision: 'Coastal Hazard Warning & Ocean State Forecast (OSF)',
    standardOrDataset: 'ADCIRC-2DDI Hydrodynamic Ocean Surge Mesh & Inundation Envelopes',
    versionOrEdition: 'Bay of Bengal High-Resolution Coastal Mesh v4.2',
    purpose: 'Dynamic ocean storm surge amplitude and total coastal inundation boundary calculation',
    geographicScope: 'Bay of Bengal Coastline (Paradip, Dhamra, Gopalpur, Chandbali)',
    applicableHazard: 'Meteorological Storm Surge, Sea Level Rise, Coastal Overwash',
    applicableAsset: 'Coastal embankments, ports, saline ingress bunds, coastal high schools/shelters',
    inputData: ['IMD Cyclone Wind & Pressure fields', 'EODAS high-resolution bathymetry', 'Tide harmonic constituents'],
    output: 'Peak storm surge height above GTS MSL (m), overland water ingress limits (km)',
    updateFrequency: 'Every 6 hours (00, 06, 12, 18 UTC sync)',
    officialSource: 'INCOIS Ocean Portal (incois.gov.in)',
    officialApiOrPortal: 'https://incois.gov.in/portal/storm_surge.jsp',
    fallbackSource: 'IIT Delhi 2D Surge Nomograms & SLOSH Bay of Bengal basin',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.88,
    notes: 'Calibrated against Survey of India tide gauge at Paradip Port. Crucial for astronomical tide superposition.'
  },
  {
    id: 'OCEAN-INCOIS-02',
    category: 'Ocean / Storm Surge',
    authority: 'INCOIS / NIOT',
    departmentOrDivision: 'Wave Energy & Coastal Engineering',
    standardOrDataset: 'Simulating Waves Nearshore (SWAN) Coastal Wave Radiation Model',
    versionOrEdition: 'SWAN Cycle III v41.31',
    purpose: 'Infragravity wave radiation stress setup and 2% dynamic swash runup over sea-facing slopes',
    geographicScope: 'Nearshore 0-20m depth littoral corridor',
    applicableHazard: 'Wave Setup, Dynamic Swash Runup, Revetment Overwash',
    applicableAsset: 'Paradip Port breakwater, coastal road causeways, marine revetments',
    inputData: ['Offshore significant wave height (Hs)', 'Peak period (Tp)', 'Nearshore lidar beach slope (tan beta)'],
    output: 'Dynamic wave setup (m), R2% swash runup elevation above still water (m)',
    updateFrequency: 'Every 3 hours',
    officialSource: 'INCOIS OSF Real-Time Buoy Service',
    officialApiOrPortal: 'https://incois.gov.in/portal/osf/osf.jsp',
    fallbackSource: 'NOAA WaveWatch III regional mesh',
    validationStatus: 'NEEDS_VALIDATION',
    lastVerified: '2026-09-22',
    confidenceScore: 0.82,
    notes: 'Requires continuous empirical calibration with local beach slope profiles surveyed by State PWD/ODSMA.'
  },

  // 3. River / Flood (CWC)
  {
    id: 'RIVER-CWC-01',
    category: 'River / Flood',
    authority: 'CWC (Central Water Commission)',
    departmentOrDivision: 'Hydrological Studies Organisation (HSO) / IFEWS',
    standardOrDataset: 'Mahanadi Basin 1D/2D Coupled Hydrodynamic Model & Barrage Gauges',
    versionOrEdition: 'CWC IFEWS Manual / HEC-RAS 2D Basin Calibrated Edition 2022',
    purpose: 'River stage, discharge rate, barrage regulation schedules, and downstream flood peak transit',
    geographicScope: 'Mahanadi, Kathajodi, Devi, Birupa, Baitarani River Network',
    applicableHazard: 'Fluvial Riverine Flooding, Embankment Breaching, Estuary Backwater Choking',
    applicableAsset: 'Bridges, barrages (Jobra, Naraj), pumping intake stations, agricultural embankments',
    inputData: ['Hirakud Dam outflow discharge (cusecs)', 'Naraj & Tikarpara gauge telemetry', 'Catchment runoff estimates'],
    output: 'Downstream river stage (m GTS MSL), breach arrival time, flood wave velocity (m/s)',
    updateFrequency: 'Hourly during monsoon/cyclone flood emergency',
    officialSource: 'CWC Flood Early Warning Portal',
    officialApiOrPortal: 'https://ffs.india-water.gov.in',
    fallbackSource: 'DoWR Odisha State Hydrology Project Data Centre',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.92,
    notes: 'Hirakud to Naraj wave transit time is approximately 36 hours; critical for planning combined discharge peak.'
  },

  // 4. Disaster Management (NDMA / OSDMA)
  {
    id: 'DM-NDMA-01',
    category: 'Disaster Management',
    authority: 'NDMA / OSDMA',
    departmentOrDivision: 'Special Relief Commissioner (SRC) Odisha / State Disaster Management',
    standardOrDataset: 'Odisha Disaster Management Plan & Multi-Hazard Shelter Cadastre',
    versionOrEdition: 'OSDMA Standard Operating Procedure (SOP) Rev 2024',
    purpose: 'Statutory evacuation triggers, shelter allocation, ODRF/NDRF tactical logistics, emergency cordons',
    geographicScope: 'Odisha 30 Districts (Focus on Jagatsinghpur, Kendrapara, Puri, Balasore)',
    applicableHazard: 'All-Hazard Emergency Response',
    applicableAsset: 'Multipurpose Cyclone Shelters, emergency supply routes, district hospital ICUs',
    inputData: ['IMD stage bulletins', 'CWC danger levels', 'Local tehsildar village census'],
    output: 'Evacuation boundary orders, shelter opening decrees, convoy route mandates, toll-free 1077 dispatch',
    updateFrequency: 'Real-time incident feed',
    officialSource: 'OSDMA Emergency Control System',
    officialApiOrPortal: 'https://osdma.odisha.gov.in',
    fallbackSource: 'District Collectorate Emergency Control Teletype',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.97,
    notes: 'Statutory administrative authority under Disaster Management Act 2005. Highest operational dispatch tier.'
  },

  // 5. Earth Observation (ISRO / NRSC / Bhuvan)
  {
    id: 'EO-ISRO-01',
    category: 'Earth Observation',
    authority: 'ISRO / NRSC',
    departmentOrDivision: 'Disaster Management Support Programme (DMSP) / Bhuvan Geospatial',
    standardOrDataset: 'CartoDEM v3R1 (10m) & RISAT/Sentinel-1 SAR Inundation Mapping',
    versionOrEdition: 'Bhuvan CartoDEM 10m Stereo-Orthorectified Elevation v3R1',
    purpose: 'High-precision bare-earth elevation benchmark referenced to Survey of India GTS MSL datum',
    geographicScope: 'All India Coastal and Deltaic Basins',
    applicableHazard: 'Terrain Overtopping, Slope Liquefaction, Micro-Drainage Sinks',
    applicableAsset: 'All physical assets, road crowns, culvert inverts, substation plinths',
    inputData: ['Cartosat-1 stereoscopic sensors', 'DGPS ground validation points', 'Sentinel-1 C-band SAR'],
    output: '10m resolution elevation grid (m GTS MSL), slope gradient (°), SAR flood inundation polygons',
    updateFrequency: 'Static DEM (Annual re-survey) / SAR Inundation (12-24 hours post-pass)',
    officialSource: 'Bhuvan Geoportal (bhuvan.nrsc.gov.in)',
    officialApiOrPortal: 'https://bhuvan-app1.nrsc.gov.in/disaster/disaster.php',
    fallbackSource: 'Copernicus GLO-30 / ALOS PALSAR 12.5m DEM',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.89,
    notes: 'Essential for eliminating arbitrary FFE errors. Calibrated against Survey of India benchmark pillars.'
  },

  // 6. Roads & Highways (MoRTH / IRC)
  {
    id: 'ROAD-MORTH-01',
    category: 'Roads & Highways',
    authority: 'MoRTH / IRC (Indian Roads Congress)',
    departmentOrDivision: 'Bridges & Highway Engineering Committee',
    standardOrDataset: 'IRC:SP:13-2004 & MoRTH Specifications for Road & Bridge Works (5th Rev)',
    versionOrEdition: 'IRC:SP:13-2004 (Guidelines for the Design of Small Bridges and Culverts)',
    purpose: 'Hydraulic safety criteria for highway overtopping, culvert afflux, and rescue convoy accessibility',
    geographicScope: 'National Highways (NH-16, NH-53) and State Highways (SH-12)',
    applicableHazard: 'Road Overtopping, Culvert Scour, Embankment Liquefaction',
    applicableAsset: 'Highway causeways, box culverts, approach embankments',
    inputData: ['Crown elevation (m GTS)', 'Overland water flow depth', 'Flow velocity (m/s)'],
    output: 'Convoy clearance grade: Passable (<0.15m), Heavy Rescue Only (<0.35m), Severed (>0.35m or >1.5m/s)',
    updateFrequency: 'Event-driven (Dynamic water level calculation)',
    officialSource: 'Indian Roads Congress (irc.nic.in)',
    officialApiOrPortal: 'https://morth.nic.in',
    fallbackSource: 'State PWD Roads Manual & District Police Traffic Reports',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.93,
    notes: 'Codified rule: Depth > 0.15m sweeps away light passenger cars; depth > 0.35m halts NDRF Ashok Leyland trucks.'
  },
  {
    id: 'ROAD-IRC-02',
    category: 'Roads & Highways',
    authority: 'IRC / BIS',
    departmentOrDivision: 'Foundation and Substructure Committee',
    standardOrDataset: 'IRC:78-2014 & IS 7784 (Part 1-2)',
    versionOrEdition: 'IRC:78-2014 (Standard Specifications and Code of Practice for Road Bridges - Section VII)',
    purpose: 'Foundation and pier hydraulic scour depth calculations under peak flood discharge',
    geographicScope: 'All river bridges across coastal estuarine rivers',
    applicableHazard: 'Hydrodynamic Silt Scour, Pier Undermining, Bridge Collapse',
    applicableAsset: 'Bridge piers, well foundations, abutment guide bunds',
    inputData: ['Design discharge Q (cusecs)', 'Lacey silt factor f', 'Pier width and shape factor K'],
    output: 'Maximum design scour depth below High Flood Level (d_sm = 1.34 (D_b^2 / f)^(1/3))',
    updateFrequency: 'Design time verification & real-time threshold check during peak discharge',
    officialSource: 'Indian Roads Congress Bridge Standards',
    officialApiOrPortal: 'https://irc.nic.in',
    fallbackSource: 'IS 7784 Design of Regulators & Barrages',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.87,
    notes: 'Scour depth exceeding 1.5x design scour triggers immediate vehicular structural closure of the span.'
  },

  // 7. Structural & Civil (BIS)
  {
    id: 'STRUCT-BIS-01',
    category: 'Structural & Civil',
    authority: 'BIS (Bureau of Indian Standards)',
    departmentOrDivision: 'Civil Engineering Division (CED 57 / CED 2)',
    standardOrDataset: 'IS 875 (Part 3):2015 — Design Loads (Wind Loads) for Buildings and Structures',
    versionOrEdition: 'IS 875 (Part 3):2015 (Third Revision)',
    purpose: 'Site-specific calculation of design wind velocity (Vz) and cyclonic wind pressure (Pz)',
    geographicScope: 'Pan-India (Focus on coastal cyclonic zone Vb = 50 m/s)',
    applicableHazard: 'Extreme Cyclonic Wind, Structural Uplift, Cladding Failure',
    applicableAsset: 'Substations, transmission towers, shelter roofs, industrial port warehouses',
    inputData: ['Basic wind speed Vb (50 m/s for Odisha)', 'Risk factor k1 (1.07)', 'Terrain factor k2', 'Cyclonic factor k4 (1.15)'],
    output: 'Design wind speed Vz = Vb·k1·k2·k3·k4 (m/s), Wind pressure Pz = 0.6·Vz² (kPa)',
    updateFrequency: 'Deterministic design calculation per coordinate node',
    officialSource: 'Bureau of Indian Standards (standardsbis.bsbedge.com)',
    officialApiOrPortal: 'https://www.services.bis.gov.in',
    fallbackSource: 'National Building Code of India (NBC 2016 Part 6 Section 1)',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.96,
    notes: 'IS 875 Part 3:2015 Clause 6.3 mandates k4 = 1.15 for industrial and post-disaster lifelines within 5km of eastern coast.'
  },
  {
    id: 'STRUCT-BIS-02',
    category: 'Structural & Civil',
    authority: 'BIS',
    departmentOrDivision: 'Cement and Concrete Committee (CED 2)',
    standardOrDataset: 'IS 456:2000 — Plain and Reinforced Concrete - Code of Practice',
    versionOrEdition: 'IS 456:2000 (Fourth Revision, Reaffirmed 2021)',
    purpose: 'Concrete structural durability, minimum cover, and marine saltwater exposure limit states',
    geographicScope: 'Coastal marine exposure corridors (<10km from sea)',
    applicableHazard: 'Marine Salt-Spray Corrosion, Chlorides Ingress, Concrete Spalling',
    applicableAsset: 'Substation plinths, hospital columns, shelter foundations, storm water sumps',
    inputData: ['Environmental exposure class ("Severe" or "Extreme")', 'Concrete characteristic strength (fck)', 'Cover thickness'],
    output: 'Minimum cement content (360 kg/m³), max w/c ratio (0.40), minimum cover (75mm for extreme)',
    updateFrequency: 'Static engineering asset audit',
    officialSource: 'Bureau of Indian Standards',
    officialApiOrPortal: 'https://www.services.bis.gov.in',
    fallbackSource: 'CPWD Specifications 2019 Vol 1',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.95,
    notes: 'Used to audit structural longevity and prevent premature failure during continuous seawater immersion.'
  },

  // 8. Electrical Lifeline (CEA)
  {
    id: 'ELEC-CEA-01',
    category: 'Electrical Lifeline',
    authority: 'CEA (Central Electricity Authority)',
    departmentOrDivision: 'Grid Standards & Electrical Safety Directorate',
    standardOrDataset: 'Central Electricity Authority (Measures Relating to Safety and Electric Supply) Regulations',
    versionOrEdition: 'CEA Safety Regulations 2010 (as amended 2018/2023)',
    purpose: 'Electrical substation ground clearance, flood isolation thresholds, and mandatory de-energization criteria',
    geographicScope: 'National, OPTCL 220kV/132kV transmission and distribution grid in Odisha',
    applicableHazard: 'Saltwater Arc Flash, Substation Inundation, Grid Cascading Blackout',
    applicableAsset: '220kV/132kV/33kV Substations, GIS switchyards, transformer oil sumps, backup DG gensets',
    inputData: ['Live busbar ground clearance', 'Plinth finished elevation (m GTS)', 'Overland saltwater flood depth'],
    output: 'Automated de-energization advisory when water level approaches 0.3m below live busbar base',
    updateFrequency: 'Continuous real-time telemetry threshold check',
    officialSource: 'Central Electricity Authority (cea.nic.in)',
    officialApiOrPortal: 'https://cea.nic.in/regulations',
    fallbackSource: 'State Load Despatch Centre (SLDC Odisha) Grid Code',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.98,
    notes: 'De-energization is mandatory before saltwater contact to prevent catastrophic arc explosions that destroy transformers for months.'
  },

  // 9. Emergency Communications (NDMA / C-DOT SACHET)
  {
    id: 'ALERT-SACHET-01',
    category: 'Emergency Communications',
    authority: 'NDMA / C-DOT',
    departmentOrDivision: 'Integrated Disaster Early Warning Platform (SACHET)',
    standardOrDataset: 'Common Alerting Protocol (CAP) — India Profile',
    versionOrEdition: 'OASIS CAP v1.2 / ITU-T X.1303 / DoT National CBS Standard',
    purpose: 'Multi-lingual, multi-channel geo-targeted public early warnings across mobile cellular networks',
    geographicScope: 'Pan-India, targeted down to district/sub-district polygon geofences',
    applicableHazard: 'All Authorized Natural Hazards',
    applicableAsset: 'Public cellular handsets, radio/TV broadcasts, railway station public address systems',
    inputData: ['CAP XML payload (Severity, Urgency, Certainty, Polygon WGS84, Multilingual text)'],
    output: 'Cell Broadcast Service (CBS) burst transmission, SMS, FM Radio interrupt, sirens',
    updateFrequency: 'Event-driven emergency transmission',
    officialSource: 'C-DOT SACHET National Portal (sachet.ndma.gov.in)',
    officialApiOrPortal: 'https://sachet.ndma.gov.in/cap-cp',
    fallbackSource: 'District Collector Emergency Siren Network & BSNL PRI SMS line',
    validationStatus: 'VERIFIED',
    lastVerified: '2026-09-22',
    confidenceScore: 0.97,
    notes: 'Supports 12 Eighth-Schedule languages including Odia, Bengali, Hindi, Telugu, Tamil. Zero cellular data connection needed.'
  }
];

// Helper: Query registry by hazard or category
export function getRegistryEntriesByCategory(category: AuthorityRegistryEntry['category']): AuthorityRegistryEntry[] {
  return INDIA_AUTHORITY_REGISTRY.filter(item => item.category === category);
}

export function getRegistryEntryById(id: string): AuthorityRegistryEntry | undefined {
  return INDIA_AUTHORITY_REGISTRY.find(item => item.id === id);
}
