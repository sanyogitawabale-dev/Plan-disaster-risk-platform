// GeoShield India v1.0 — Hazard Configuration Registry (Plugin Architecture)
// Eliminates hardcoded hazard logic by defining modular hazard plugins.

export interface HazardConfigPlugin {
  id: string;
  hazardCode: 'CYCLONE' | 'FLOOD' | 'LANDSLIDE' | 'URBAN_FLOOD' | 'HEATWAVE' | 'LIGHTNING' | 'TSUNAMI' | 'STORM_SURGE';
  name: string;
  description: string;
  officialSource: {
    agency: string;
    datasetOrApi: string;
    statutoryMandate: string;
  };
  supportingSources: Array<{
    agency: string;
    product: string;
    tier: number;
  }>;
  inputs: {
    primaryVariables: string[];
    telemetrySources: string[];
    thresholdLimits: Record<string, string>;
  };
  models: {
    primaryPhysicsEngine: string;
    governingEquation: string;
    spatialResolution: string;
    temporalResolution?: string;
    forecastHorizonHours: number;
    calibrationParameters?: string[];
    boundaryConditions?: string;
    uncertaintyFactor?: string;
    failureModeAndFallback?: string;
    modelVersion?: string;
  };
  outputs: {
    exposureVectors: string[];
    infrastructureRiskMetrics: string[];
    alertCategories: string[];
  };
  governingStandards: string[];
  activeInPilot: boolean;
  odishaApplicability: 'CRITICAL_PRIMARY' | 'HIGH_SECONDARY' | 'SEASONAL' | 'LOCALIZED';
  validationStatus: 'VERIFIED' | 'NEEDS_VALIDATION';
  auditNotes?: string;
}

export const HAZARD_PLUGIN_REGISTRY: HazardConfigPlugin[] = [
  {
    id: 'HP-CYCLONE-01',
    hazardCode: 'CYCLONE',
    name: 'Tropical Cyclonic Storm & Gale Winds',
    description: 'Tracks cyclonic storm genesis, atmospheric vortex dynamics, gale wind radius, and eye landfall trajectory over the Bay of Bengal.',
    officialSource: {
      agency: 'IMD (India Meteorological Department)',
      datasetOrApi: 'RSMC Cyclone Bulletins (TCP) & Doppler Radar Track (DWR Paradip)',
      statutoryMandate: 'Disaster Management Act 2005 / NDMA National Cyclone SOP'
    },
    supportingSources: [
      { agency: 'INCOIS', product: 'Surface Wind Stress Vector (tau_w)', tier: 1 },
      { agency: 'NASA / JAXA', product: 'GPM IMERG Early Run Precipitation', tier: 3 },
      { agency: 'CWC', product: 'Coastal Catchment Runoff Gauge Network', tier: 1 },
      { agency: 'ISRO / NRSC', product: 'CartoDEM Topographic Friction Roughness', tier: 2 }
    ],
    inputs: {
      primaryVariables: ['Sustained Wind Speed (km/h)', 'Central Pressure Deficit (hPa)', 'Track Trajectory Vector', 'Gale Radii (34/50/64 kts)', 'Translational Speed'],
      telemetrySources: ['INSAT-3DR TIR/WV', 'DWR Paradip S-Band Radar', 'Ocean Buoys (BD08, DS4)', 'Coastal AWS Network'],
      thresholdLimits: {
        'CYCLONIC_STORM': '62 - 88 km/h',
        'SEVERE_CYCLONIC_STORM': '89 - 117 km/h',
        'VERY_SEVERE_CYCLONIC_STORM': '118 - 166 km/h',
        'EXTREMELY_SEVERE_CYCLONIC_STORM': '167 - 221 km/h',
        'SUPER_CYCLONIC_STORM': '>= 222 km/h'
      }
    },
    models: {
      primaryPhysicsEngine: 'IMD Multi-Model Ensemble (MME) + Holland Vortex Parametric Wind Field Model',
      governingEquation: 'V(r) = [ (B / rho) · (R_max / r)^B · (P_n - P_c) · exp(-(R_max/r)^B) + (r·f/2)^2 ]^0.5 - (r·f/2)',
      spatialResolution: '1.0 km coastal radial grid',
      forecastHorizonHours: 72
    },
    outputs: {
      exposureVectors: ['Wind Exposure Footprint', 'Building Cladding Pressure Envelope', 'Tree Fall / Debris Index'],
      infrastructureRiskMetrics: ['Transmission Tower Overturning Risk', 'Substation Structural Integrity', 'Hospital Roof Damage Potential'],
      alertCategories: ['PRE_CYCLONE_WATCH', 'CYCLONE_ALERT (Yellow)', 'CYCLONE_WARNING (Orange)', 'POST_LANDFALL_OUTLOOK (Red)']
    },
    governingStandards: ['IS 875 (Part 3):2015', 'NBC 2016 Part 6 Section 1', 'NDMA Cyclone Guidelines 2019'],
    activeInPilot: true,
    odishaApplicability: 'CRITICAL_PRIMARY',
    validationStatus: 'VERIFIED',
    auditNotes: 'Statutory IMD taxonomy enforced (no Saffir-Simpson categories).'
  },
  {
    id: 'HP-SURGE-02',
    hazardCode: 'STORM_SURGE',
    name: 'Hydrodynamic Coastal Storm Surge & Tidal Overwash',
    description: 'Coupled ocean-atmosphere simulation of barometric suction and shallow bathymetric wind setup along the coastal shelf.',
    officialSource: {
      agency: 'INCOIS',
      datasetOrApi: 'ADCIRC-2DDI Bay of Bengal High-Resolution Finite Element Mesh',
      statutoryMandate: 'Ministry of Earth Sciences (MoES) / NDMA Coastal Hazard Framework'
    },
    supportingSources: [
      { agency: 'Survey of India', product: 'Harmonic Tide Constituents & GTS Benchmarks', tier: 1 },
      { agency: 'NIOT', product: 'Wave Energy & Nearshore Breaking Buoy Telemetry', tier: 2 },
      { agency: 'ISRO / NRSC', product: 'Bhuvan CartoDEM 10m Coastal Surface', tier: 2 },
      { agency: 'OSDMA', product: 'Saline Embankment Breach Spatial Vector', tier: 1 }
    ],
    inputs: {
      primaryVariables: ['Astronomical Tide Height (m GTS)', 'Wind Stress Vector', 'Barometric Deficit Delta P', 'Nearshore Bathymetry', 'Wave Setup Eta'],
      telemetrySources: ['Paradip Port Tide Gauge', 'Chandbali Hydrographic Station', 'INCOIS Coastal Buoys'],
      thresholdLimits: {
        'MODERATE_SURGE': '1.0 - 2.5 m GTS MSL',
        'SEVERE_SURGE': '2.5 - 4.5 m GTS MSL',
        'CATASTROPHIC_SURGE': '> 4.5 m GTS MSL'
      }
    },
    models: {
      primaryPhysicsEngine: 'ADCIRC 2DDI Coupled with SWAN Nearshore Wave Model',
      governingEquation: 'd(eta)/dx = (tau_sx - tau_bx) / (rho · g · (h + eta)) - (1 / (rho · g)) · d(P_a)/dx',
      spatialResolution: '50m nearshore triangular mesh',
      forecastHorizonHours: 48
    },
    outputs: {
      exposureVectors: ['Overland Coastal Inundation Extent', 'Wave Force on Sea Bunds', 'Saline Soil Ingress Zone'],
      infrastructureRiskMetrics: ['Saline Bund Breach Probability', 'Port Crane Base Inundation', 'Substation Saltwater Arc Risk'],
      alertCategories: ['COASTAL_SURGE_ADVISORY', 'SURGE_WARNING', 'CATASTROPHIC_INUNDATION_EVACUATION']
    },
    governingStandards: ['CRZ Notification 2019', 'IS 456:2000 (Marine Exposure)', 'NDMA Coastal Hazard Manual'],
    activeInPilot: true,
    odishaApplicability: 'CRITICAL_PRIMARY',
    validationStatus: 'VERIFIED',
    auditNotes: 'INCOIS confirmed operational in Bay of Bengal with Paradip tide gauge calibration.'
  },
  {
    id: 'HP-FLOOD-03',
    hazardCode: 'FLOOD',
    name: 'Fluvial Riverine Flood & Deltaic Backwater',
    description: 'Catchment rainfall runoff routing and riverine flood wave propagation through the Mahanadi delta bifurcation network.',
    officialSource: {
      agency: 'CWC (Central Water Commission)',
      datasetOrApi: 'Integrated Flood Early Warning System (IFEWS) / Mahanadi Basin Model',
      statutoryMandate: 'National Water Policy / CWC Statutory Flood Operations'
    },
    supportingSources: [
      { agency: 'IMD', product: 'Sub-Basin QPF (Quantitative Precipitation Forecast)', tier: 1 },
      { agency: 'DoWR Odisha', product: 'Hirakud, Naraj, and Jobra Barrage Discharge Telemetry', tier: 1 },
      { agency: 'ISRO', product: 'Sentinel-1 SAR Real-time Water Surface Mapping', tier: 2 }
    ],
    inputs: {
      primaryVariables: ['Upstream Dam Discharge (cusecs)', 'Barrage Headwater & Tailwater Levels (m GTS)', 'Tributary Inflow', 'Tidal Backwater Head'],
      telemetrySources: ['Naraj Barrage Gauge', 'Tikarpara Gorge Gauge', 'Jobra Barrage SCADA'],
      thresholdLimits: {
        'WARNING_STAGE': '26.41 m at Naraj',
        'DANGER_LEVEL': '27.41 m at Naraj',
        'EXTREME_FLOOD_STAGE': '>= 28.50 m at Naraj (> 1,200,000 cusecs)'
      }
    },
    models: {
      primaryPhysicsEngine: 'HEC-RAS 1D/2D Unsteady Hydraulic Flow & Saint-Venant Equations',
      governingEquation: 'dQ/dt + d(Q^2 / A)/dx + g·A·(dh/dx + S_f) = 0',
      spatialResolution: '100m channel and 2D floodplain grid',
      forecastHorizonHours: 36
    },
    outputs: {
      exposureVectors: ['Riverine Floodplain Inundation', 'Drainage Lockup Duration', 'Agricultural Submergence'],
      infrastructureRiskMetrics: ['Bridge Pier Lacey Scour Index', 'Highway Culvert Overtopping', 'Water Intake Sump Inundation'],
      alertCategories: ['LOW_FLOOD', 'MEDIUM_FLOOD', 'HIGH_FLOOD', 'UNPRECEDENTED_FLOOD']
    },
    governingStandards: ['IS 10751:1983 (Design of Barrages)', 'IRC:78-2014 (Scour at Bridges)', 'CWC IFEWS SOP'],
    activeInPilot: true,
    odishaApplicability: 'CRITICAL_PRIMARY',
    validationStatus: 'VERIFIED',
    auditNotes: 'Directly calibrated to CWC statutory danger levels at Naraj and Jobra barrages.'
  },
  {
    id: 'HP-URBAN-04',
    hazardCode: 'URBAN_FLOOD',
    name: 'Pluvial Urban Inundation & Micro-Drainage',
    description: 'High-intensity convective cloudbursts exceeding municipal stormwater capacity in dense urban centers like Cuttack and Bhubaneswar.',
    officialSource: {
      agency: 'IMD & Housing & Urban Development Dept (H&UDD Odisha)',
      datasetOrApi: 'IMD DWR High-Res Rainfall & Urban Stormwater Drainage GIS',
      statutoryMandate: 'NDMA Urban Flooding Guidelines 2010'
    },
    supportingSources: [
      { agency: 'Survey of India', product: 'High-Resolution 1m Urban Ortho-DEM', tier: 1 },
      { agency: 'Cuttack Municipal Corp (CMC)', product: 'Major Storm Canal Pumping Telemetry', tier: 2 },
      { agency: 'Bhubaneswar Smart City', product: 'IoT Sump Water Level Sensors', tier: 2 }
    ],
    inputs: {
      primaryVariables: ['Rainfall Intensity (mm/hr)', 'Soil Imperviousness Ratio (%)', 'Canal Siltation Index', 'Pumping Station Outflow Capacity'],
      telemetrySources: ['Urban AWS network', 'Smart City Sump Pressure Transducers', 'Pumping Station Status'],
      thresholdLimits: {
        'WATERLOGGING_ALERT': '> 40 mm/hr',
        'SEVERE_URBAN_FLOOD': '> 75 mm/hr for 2+ hours'
      }
    },
    models: {
      primaryPhysicsEngine: 'SWMM (Storm Water Management Model) 2D Overland Spread',
      governingEquation: 'Q = (1.49 / n) · A · R^(2/3) · S^(1/2) (Manning Open Channel Equation)',
      spatialResolution: '10m street-level grid',
      forecastHorizonHours: 6
    },
    outputs: {
      exposureVectors: ['Urban Road Submergence Grid', 'Basement Inundation Map', 'Storm Drain Overtopping'],
      infrastructureRiskMetrics: ['Hospital Basement Generator Flooding', 'Traffic Arterial Paralysis', 'Transformer Ground Mount Outage'],
      alertCategories: ['URBAN_WATERLOGGING_WATCH', 'FLASH_URBAN_FLOOD_ALERT']
    },
    governingStandards: ['CPHEEO Manual on Storm Water Drainage Systems 2019', 'NDMA Urban Flood SOP'],
    activeInPilot: true,
    odishaApplicability: 'HIGH_SECONDARY',
    validationStatus: 'NEEDS_VALIDATION',
    auditNotes: 'Micro-drainage model requires ground truth IoT pressure transducer validation during high outfall head.'
  },
  {
    id: 'HP-LANDSLIDE-05',
    hazardCode: 'LANDSLIDE',
    name: 'Rainfall-Triggered Slope Liquefaction & Landslide',
    description: 'Antecedent precipitation saturation inducing pore-water pressure spikes and slope failures in eastern ghats / coastal highway escarpments.',
    officialSource: {
      agency: 'GSI (Geological Survey of India)',
      datasetOrApi: 'National Landslide Susceptibility Mapping (NLSM) & Regional Early Warning',
      statutoryMandate: 'Mines Ministry / NDMA Landslide Management Policy'
    },
    supportingSources: [
      { agency: 'ISRO / NRSC', product: 'NISAR / Sentinel-1 InSAR Slope Displacement', tier: 2 },
      { agency: 'IMD', product: '72-hr Antecedent Precipitation Index (API)', tier: 1 }
    ],
    inputs: {
      primaryVariables: ['Slope Gradient (°)', 'Soil Moisture Saturation (% Vol)', 'InSAR Displacement Rate (mm/yr)', 'Soil Cohesion c and Friction Angle phi'],
      telemetrySources: ['In-situ piezometers', 'Bhuvan NLSM CartoDEM', 'IMD AWS rain gauges'],
      thresholdLimits: {
        'SLOPE_WARNING': 'API > 150mm over 48h and Slope > 28°',
        'IMMINENT_SLIP': 'Pore water pressure exceeds shear resistance (FOS < 1.0)'
      }
    },
    models: {
      primaryPhysicsEngine: 'InSAR Deformation-to-Pore Pressure Geotechnical Pipeline + Bishop Limit Equilibrium Method',
      governingEquation: 'Pipeline: InSAR delta_d -> strain rate d(epsilon)/dt -> empirical soil water characteristic curve (SWCC) -> pore-pressure u_w -> FOS = (c\' + (sigma_n - u_w)·tan(phi\')) / tau_mob',
      spatialResolution: '25m slope mesh',
      forecastHorizonHours: 24
    },
    outputs: {
      exposureVectors: ['Debris Flow Path Polygon', 'Road Blockage Polygon', 'Hill-foot Settlement Zone'],
      infrastructureRiskMetrics: ['Mountain Highway Severance', 'Transmission Tower Base Sliding Risk'],
      alertCategories: ['LANDSLIDE_WATCH', 'LANDSLIDE_WARNING', 'SLOPE_EVACUATION_ORDER']
    },
    governingStandards: ['IS 14458 (Parts 1-4) Slope Stability Guidelines', 'IRC:SP:48 Hill Roads Manual'],
    activeInPilot: true,
    odishaApplicability: 'LOCALIZED',
    validationStatus: 'NEEDS_VALIDATION',
    auditNotes: 'FLAGGED NEEDS_VALIDATION: InSAR observations are deformation indicators, not direct pore-pressure measurements. Geotechnical transfer function requires local calibration.'
  },
  {
    id: 'HP-LIGHTNING-06',
    hazardCode: 'LIGHTNING',
    name: 'Atmospheric Convective Lightning & Cloud-to-Ground Strikes',
    description: 'Nowcasts high-density severe convective updrafts and cloud-to-ground lightning discharges responsible for acute casualties.',
    officialSource: {
      agency: 'IITM Pune / IMD',
      datasetOrApi: 'Lightning Location Network (LLN) / Damini Mobile Early Warning',
      statutoryMandate: 'MoES Lightning Early Warning Mission'
    },
    supportingSources: [
      { agency: 'ISRO', product: 'INSAT-3DR Rapid Scan Convective Cloud Top Temperature', tier: 2 },
      { agency: 'OSDMA', product: 'District Lightning Arrester Sensor Feeds', tier: 1 }
    ],
    inputs: {
      primaryVariables: ['CAPE (Convective Available Potential Energy)', 'Flash Count / Min', 'Cloud Top Brightness Temp (K)'],
      telemetrySources: ['Ground-based radio antenna sensor mesh', 'Doppler Radar Dual-Pol Reflectivity'],
      thresholdLimits: {
        'SEVERE_THUNDERSTORM': 'CAPE > 2500 J/kg and Flash Density > 5 strikes/km²/hr'
      }
    },
    models: {
      primaryPhysicsEngine: 'Electrification Parameterization & Radar Hydrometeor Echo Classification',
      governingEquation: 'FlashRate ~ w_max^6 · Z_dr (Empirical Updraft Lightning Scaling)',
      spatialResolution: '500m strike cluster centroid',
      forecastHorizonHours: 2
    },
    outputs: {
      exposureVectors: ['Active Strike Strike Polygon', 'High Casualty Vulnerability Footprint'],
      infrastructureRiskMetrics: ['Substation Lightning Arrester Duty Cycle', 'Open-field Farm Labor Exposure'],
      alertCategories: ['DAMINI_LIGHTNING_NOWCAST', 'SEVERE_THUNDERSTORM_WARNING']
    },
    governingStandards: ['IS/IEC 62305 (Protection Against Lightning)', 'NDMA Lightning Action Guidelines'],
    activeInPilot: true,
    odishaApplicability: 'SEASONAL',
    validationStatus: 'VERIFIED',
    auditNotes: 'Accredited statutory real-time feed from IITM Pune / Damini app.'
  }
];

export function getHazardPluginByCode(code: HazardConfigPlugin['hazardCode']): HazardConfigPlugin | undefined {
  return HAZARD_PLUGIN_REGISTRY.find(p => p.hazardCode === code);
}
