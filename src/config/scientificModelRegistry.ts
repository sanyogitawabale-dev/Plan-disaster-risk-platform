/**
 * GeoShield India v1.0 — Scientific Model & Engineering Assumptions Registry
 *
 * Implements Gate 7B:
 * Every scientific and hydrodynamic threshold must be linked to:
 *  - Formal engineering/scientific peer-reviewed or institutional source
 *  - Explicit physical assumptions
 *  - Validated parameter ranges
 *  - Dominant physical uncertainties
 *  - Degradation / cutoff regimes
 */

export interface ScientificModelDefinition {
  modelId: string;
  modelName: string;
  domain: 'HYDRODYNAMIC_SURGE' | 'ATMOSPHERIC_WIND' | 'RIVERINE_BACKWATER' | 'ELECTRICAL_FLASHOVER' | 'STRUCTURAL_WIND_LOAD';
  governingInstitution: string;
  peerReviewedSource: string;
  primaryEquations: string;
  keyAssumptions: string[];
  validParameterRanges: {
    parameter: string;
    unit: string;
    min: number;
    max: number;
    engineeringBasis: string;
  }[];
  dominantUncertainties: string[];
  operationalCutoffs: {
    condition: string;
    actionRequired: string;
  }[];
  verifiedBy: string;
}

export const SCIENTIFIC_MODEL_REGISTRY: ScientificModelDefinition[] = [
  // 1. Storm Surge & Coastal Hydrodynamics (ADCIRC / IIT-D Fine Mesh)
  {
    modelId: 'SCI-ADCIRC-BAY-OF-BENGAL',
    modelName: 'ADCIRC Bay of Bengal Coastal Inundation Model (IIT-D / INCOIS Mesh)',
    domain: 'HYDRODYNAMIC_SURGE',
    governingInstitution: 'INCOIS (Ministry of Earth Sciences) & IIT Delhi',
    peerReviewedSource: 'Rao et al., "Storm Surge Prediction along the East Coast of India using ADCIRC", Journal of Coastal Engineering 2018 / INCOIS Technical Report 2021',
    primaryEquations: '2D Depth-Integrated Shallow Water Equations (Shallow Water Continuity + Momentum with Coriolis & Bottom Manning Friction): ∂η/∂t + ∇·(UH) = 0',
    keyAssumptions: [
      'Hydrostatic pressure distribution valid across continental shelf',
      'Bathymetry derived from GEBCO 15-arcsec blended with Survey of India hydrographic charts',
      'Astronomical tides linearly superposed or dynamically coupled with wind-stress setup',
      'Manning roughness coefficient n = 0.025 to 0.035 for coastal mangrove / alluvial plains'
    ],
    validParameterRanges: [
      { parameter: 'surgeDepthMeters', unit: 'm', min: 0.0, max: 12.0, engineeringBasis: 'Historical maximum Bay of Bengal surge (1999 Odisha Super Cyclone: 7.2m surge)' },
      { parameter: 'coastalWindSpeedKmh', unit: 'km/h', min: 0, max: 320, engineeringBasis: 'IMD Super Cyclonic Storm upper threshold (315 km/h)' },
      { parameter: 'tideElevationMsl', unit: 'm', min: -1.5, max: 3.5, engineeringBasis: 'Survey of India Paradip & Dhamra spring tide range' }
    ],
    dominantUncertainties: [
      'Nearshore wave setup and wave run-up bathymetry errors (< 5m depth contours)',
      'Mangrove vegetative attenuation friction uncertainty in Bhitarkanika and Mahanadi Delta',
      'Coincident river discharge backwater coupling at estuarine mouths'
    ],
    operationalCutoffs: [
      { condition: 'Bathymetric resolution coarser than 100m in estuary', actionRequired: 'Flag localized inundation confidence as DEGRADED (0.65 weight)' },
      { condition: 'Radar eye fix older than 3 hours', actionRequired: 'Halt automated trajectory projection; fallback to deterministic cone' }
    ],
    verifiedBy: 'INCOIS Coastal Hazard Warning Directorate'
  },

  // 2. High Flood Level & Backwater Hydrology (CWC / HEC-RAS 1D/2D)
  {
    modelId: 'SCI-CWC-HECRAS-RIVERINE',
    modelName: 'CWC Mahanadi Delta Backwater & Flood Attenuation Model',
    domain: 'RIVERINE_BACKWATER',
    governingInstitution: 'Central Water Commission (CWC), Ministry of Jal Shakti',
    peerReviewedSource: 'CWC Hydrological Studies Organisation: "Flood Frequency Analysis and HFL Estimation for Mahanadi Basin", Technical Paper 2020',
    primaryEquations: '1D St. Venant Unsteady Flow & 2D Diffusive Wave Inundation: ∂Q/∂x + ∂A/∂t = q',
    keyAssumptions: [
      '100-Year High Flood Level (HFL) computed using Gumbel / Log-Pearson Type III extreme value distributions on 65-year gauge record at Mundali and Naraj',
      'Substation plinths surveyed relative to Survey of India Great Trigonometrical Survey (GTS) benchmarks',
      'Barrage gate operations follow strictly the Hirakud-Mundali Reservoir Regulation Manual'
    ],
    validParameterRanges: [
      { parameter: 'peakDischargeCusecs', unit: 'cusecs', min: 100000, max: 1800000, engineeringBasis: 'Historical maximum recorded at Mundali barrage (1982 flood: 1.58M cusecs)' },
      { parameter: 'culvertOvertoppingRatio', unit: 'ratio', min: 0.0, max: 2.5, engineeringBasis: 'MoRTH Section 300 IRC:SP:13 culvert hydraulic head limit' }
    ],
    dominantUncertainties: [
      'Sediment siltation altering river bed stage-discharge rating curves',
      'Uncontrolled breach of rural agricultural ring bunds upstream of NH-316'
    ],
    operationalCutoffs: [
      { condition: 'Telemetry gauge transmission gap > 120 minutes', actionRequired: 'Downgrade river stage confidence to STALE (0.65 weight); deploy linear extrapolation guard' }
    ],
    verifiedBy: 'Central Water Commission Hydrological Directorate'
  },

  // 3. Electrical Flashover & Substation Plinth Clearance (CEA / IEEE 605)
  {
    modelId: 'SCI-CEA-PLINTH-CLEARANCE',
    modelName: 'CEA 44(3A) Substation Flood Inundation & Flashover Safety Model',
    domain: 'ELECTRICAL_FLASHOVER',
    governingInstitution: 'Central Electricity Authority (CEA) & CPRI Bengaluru',
    peerReviewedSource: 'IEEE Standard 605 / CEA Manual on Substation Layouts & Surge Plinth Clearance, 4th Edition',
    primaryEquations: 'Plinth Ingress Head: h_ingress = WaterLevel_MSL - (FinishedFloorLevel_MSL); Dielectric breakdown risk R_flashover = 1.0 for h_ingress >= 0.30m',
    keyAssumptions: [
      'Transformer terminal bushings and marshalling kiosks vulnerable to conductive salt-water flashover upon contact',
      '0.30m (300mm) statutory clearance provides safety freeboard against wave splashing and transformer radiator cooling fin submersion',
      'Substation de-energization must precede physical submersion of 33kV/220kV bus duct marshalling boxes to prevent explosive arc-faults'
    ],
    validParameterRanges: [
      { parameter: 'waterDepthPlinth', unit: 'm', min: 0.0, max: 3.0, engineeringBasis: 'Statutory trip at strictly >= 0.30m (300mm)' },
      { parameter: 'substationVoltageKv', unit: 'kV', min: 33, max: 765, engineeringBasis: 'Standard Indian transmission grid voltage classes' }
    ],
    dominantUncertainties: [
      'Micro-topography of switchyard gravel bed vs finished concrete plinth',
      'Subsurface trench backflow through unsealed cable conduits'
    ],
    operationalCutoffs: [
      { condition: 'Plinth water depth reaches or breaches 0.300m', actionRequired: 'MANDATORY AUTOMATED TRIP LOCKOUT ADVISORY (Fail-Closed; cannot be overridden by AI)' }
    ],
    verifiedBy: 'Central Electricity Authority Electrical Safety Directorate'
  }
];
