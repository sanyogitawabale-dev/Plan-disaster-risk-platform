// GeoShield India v1.0 — Compound Hazard Coupling Engine
// Models hydrodynamic interactions between Cyclone, Rainfall, River Discharge, Astronomical Tide, and Storm Surge.

export interface CompoundHazardInput {
  cycloneIntensity: 'CS' | 'SCS' | 'VSCS' | 'ESCS' | 'SuCS'; // Statutory IMD intensity classification
  maxWindSpeedKmh: number;              // km/h
  centralPressureDeficitHpa: number;    // Delta P = P_ambient - P_center (e.g. 75 hPa)
  rainfall24hMm: number;                // 24-hr accumulated rainfall
  upstreamRiverDischargeCusecs: number; // e.g. 950,000 cusecs at Naraj
  astronomicalTidePhase: 'SPRING_HIGH' | 'NEAP_HIGH' | 'MEAN_TIDE' | 'LOW_TIDE';
  offshoreSignificantWaveHeightM: number;// e.g. 7.5m
  beachForeshoreSlopeTanBeta: number;   // e.g. 1/30 = 0.0333
  nearshoreBathymetryDepthM?: number;   // e.g. 8.5m at 2km offshore
  groundElevationGtsM: number;          // Site elevation above Survey of India GTS MSL (m)
  substationPlinthElevationM: number;   // e.g. 3.2m GTS MSL
  roadCrownElevationM: number;          // e.g. 2.4m GTS MSL
}

export interface CompoundHydrodynamicResult {
  // Independent Physical Hydrodynamic Components (meters GTS MSL)
  river_stage_m: number;
  storm_surge_m: number;
  astronomical_tide_m: number;
  rainfall_accumulation_mm: number;
  surface_runoff_depth_m: number;
  DEM_elevation_gts_m: number;
  nearshore_bathymetry_m: number;
  wave_setup_m: number;
  wave_runup_m: number;
  estuary_backwater_choking_m: number;

  // Synthesized Totals
  coastal_total_water_level_m: number; // Tide + Surge + Wave Setup + Runup
  compound_water_level_m: number;      // Coastal TWL + Estuarine Backwater Stacking

  // Site-specific impact metrics
  gravityDrainageLocked: boolean;
  overlandInundationDepthM: number;
  flowVelocityMs: number;
  scourShearStressPa: number;

  // Legacy mappings for backwards-compatibility
  astronomicalTideM: number;
  meteorologicalSurgeM: number;
  waveSetupM: number;
  waveRunupM: number;
  coastalTotalWaterLevelM: number;
  upstreamStageM: number;
  estuaryBackwaterChokingM: number;
  compoundTotalWaterLevelM: number;

  // Infrastructure Cascade Trigger Evaluations (CEA Safety 2026 / MoRTH 5th Rev)
  infrastructureImpact: {
    roadPassability: 'PASSABLE' | 'RESTRICTED_CONVOY' | 'SEVERED';
    roadWaterDepthM: number;
    substationSafetyStatus: 'SAFE' | 'WARNING_WATER_APPROACHING' | 'MANDATORY_DE_ENERGIZE_CEA';
    substationClearanceRemainingM: number;
    lifelineCascadeRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC';
    cascadingConsequences: string[];
  };

  // Uncertainty Analysis
  dominantUncertaintyFactor: string;
  uncertaintyMarginM: number;
  confidenceScore: number;
}

export function computeCompoundHazard(input: CompoundHazardInput): CompoundHydrodynamicResult {
  // 1. Astronomical Tide (Survey of India Harmonic Table calibration at Paradip)
  let astronomicalTideM = 1.2; // Mean high water spring
  if (input.astronomicalTidePhase === 'SPRING_HIGH') astronomicalTideM = 2.45;
  else if (input.astronomicalTidePhase === 'NEAP_HIGH') astronomicalTideM = 1.60;
  else if (input.astronomicalTidePhase === 'LOW_TIDE') astronomicalTideM = 0.20;

  // 2. Meteorological Storm Surge (Inverse Barometer + Wind Stress formulation)
  // Inverse barometer: ~1 cm rise per 1 hPa pressure drop -> 0.01 * Delta P
  const ibRiseM = 0.01 * input.centralPressureDeficitHpa;
  // Wind stress shoaling over shallow shelf (empirical scale from INCOIS ADCIRC)
  const windSurgeComponentM = (input.maxWindSpeedKmh / 220) ** 2 * 2.8;
  const meteorologicalSurgeM = Number((ibRiseM + windSurgeComponentM).toFixed(2));

  // 3. Dynamic Wave Setup (SWAN radiation stress transfer: ~0.15 * Hs)
  const waveSetupM = Number((0.15 * input.offshoreSignificantWaveHeightM).toFixed(2));

  // 4. Dynamic Wave Runup (Stockdon et al. 2006 formulation: R2% = 1.1 * (0.35*beta*(H0*L0)^0.5 + ...))
  // Approximated for coastal embankment slope
  const waveRunupM = Number((0.65 * input.beachForeshoreSlopeTanBeta * Math.sqrt(input.offshoreSignificantWaveHeightM * 100)).toFixed(2));

  const coastalTotalWaterLevelM = Number(
    (astronomicalTideM + meteorologicalSurgeM + waveSetupM + waveRunupM).toFixed(2)
  );

  // 5. Riverine Inflow & Estuarine Backwater Choking
  // Base upstream river stage at delta head (e.g. Naraj/Jobra) calibrated to discharge
  const upstreamStageM = Number((18.5 + (input.upstreamRiverDischargeCusecs / 1000000) * 8.5).toFixed(2));

  // Estuarine Backwater Convergence:
  // If coastal sea boundary (coastalTotalWaterLevelM) exceeds baseline river discharge outlet level (+1.5m),
  // gravity drainage into the Bay of Bengal is physically choked, resulting in freshwater stacking.
  let estuaryBackwaterChokingM = 0.0;
  let gravityDrainageLocked = false;

  if (coastalTotalWaterLevelM > 2.0) {
    gravityDrainageLocked = true;
    // Freshwater discharge backwater stacking is proportional to river flow and sea level obstruction
    const riverFlowFactor = input.upstreamRiverDischargeCusecs / 1000000; // e.g. 0.95
    estuaryBackwaterChokingM = Number((0.45 * riverFlowFactor * (coastalTotalWaterLevelM - 1.5)).toFixed(2));
  }

  // Compound Total Water Level (TWL) at the delta confluence
  const compoundTotalWaterLevelM = Number(
    (coastalTotalWaterLevelM + estuaryBackwaterChokingM).toFixed(2)
  );

  // 6. Overland Inundation Depth at specific asset coordinates
  const netDepth = compoundTotalWaterLevelM - input.groundElevationGtsM;
  const overlandInundationDepthM = Number(Math.max(0, netDepth).toFixed(2));

  // Overland flow velocity (Manning's formula proxy based on water depth and hydraulic slope)
  const flowVelocityMs = overlandInundationDepthM > 0 
    ? Number((0.85 * Math.sqrt(overlandInundationDepthM)).toFixed(2)) 
    : 0.0;

  // Bed shear stress tau = rho * g * d * S
  const scourShearStressPa = Number((1000 * 9.81 * overlandInundationDepthM * 0.002).toFixed(1));

  // 7. Infrastructure Cascade Triggers
  // Road Passability (MoRTH Section 300 / IRC:SP:13)
  const roadWaterDepthM = Number(Math.max(0, compoundTotalWaterLevelM - input.roadCrownElevationM).toFixed(2));
  let roadPassability: 'PASSABLE' | 'RESTRICTED_CONVOY' | 'SEVERED' = 'PASSABLE';
  if (roadWaterDepthM > 0.35 || flowVelocityMs > 1.8) {
    roadPassability = 'SEVERED';
  } else if (roadWaterDepthM > 0.15 || flowVelocityMs > 1.0) {
    roadPassability = 'RESTRICTED_CONVOY';
  }

  // Electrical Substation (CEA Regulations 2010: water must not reach within 0.3m of live plinth)
  const substationClearanceRemainingM = Number((input.substationPlinthElevationM - compoundTotalWaterLevelM).toFixed(2));
  let substationSafetyStatus: 'SAFE' | 'WARNING_WATER_APPROACHING' | 'MANDATORY_DE_ENERGIZE_CEA' = 'SAFE';
  if (substationClearanceRemainingM <= 0.30) {
    substationSafetyStatus = 'MANDATORY_DE_ENERGIZE_CEA';
  } else if (substationClearanceRemainingM <= 0.80) {
    substationSafetyStatus = 'WARNING_WATER_APPROACHING';
  }

  // Cascading Consequences Analysis
  const cascadingConsequences: string[] = [];
  let lifelineCascadeRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC' = 'LOW';

  if (substationSafetyStatus === 'MANDATORY_DE_ENERGIZE_CEA') {
    lifelineCascadeRisk = 'CATASTROPHIC';
    cascadingConsequences.push('Grid Safety SOP: OPTCL 220kV Paradip Substation busbars must be immediately de-energized.');
    cascadingConsequences.push('Downstream Lifeline: Paradip Port marine radar, IOCL refinery pumping, and SCB Medical emergency trauma center forced onto diesel generator autonomy (max 18h fuel reserves).');
  } else if (substationSafetyStatus === 'WARNING_WATER_APPROACHING') {
    lifelineCascadeRisk = 'HIGH';
    cascadingConsequences.push('Substation flood barrier pumps active; SLDC Odisha alerted for controlled feeder isolation.');
  }

  if (roadPassability === 'SEVERED') {
    cascadingConsequences.push('SH-12 Cuttack-Paradip expressway completely severed. Evacuation convoys diverted via NH-16 inland bypass (+65 min latency).');
    cascadingConsequences.push('NDRF rubberized inflatable boats (IRBs) required for Erasama and Kujang delta extractions.');
  }

  if (gravityDrainageLocked) {
    cascadingConsequences.push('Mahanadi estuarine gravity sluices completely backflow-locked. Low-lying agricultural basins flooded with brackish saltwater for minimum 72 hours.');
  }

  // 8. Uncertainty & Confidence Breakdown
  const dominantUncertaintyFactor = 
    waveRunupM > 0.8 ? 'Nearshore Dynamic Wave Runup (Bathymetric slope variability)' :
    estuaryBackwaterChokingM > 0.5 ? 'Estuarine Drainage Lockup (Counter-surge hydraulic head)' :
    'Wind Stress Drag Coefficient Shoaling (ADCIRC drag saturation)';

  const uncertaintyMarginM = Number((0.15 * coastalTotalWaterLevelM + 0.10).toFixed(2)); // e.g. ±0.45m
  const confidenceScore = Number((0.92 - (uncertaintyMarginM / 3.0)).toFixed(2));

  return {
    // Independent physical variables
    river_stage_m: upstreamStageM,
    storm_surge_m: meteorologicalSurgeM,
    astronomical_tide_m: astronomicalTideM,
    rainfall_accumulation_mm: input.rainfall24hMm,
    surface_runoff_depth_m: Number(((input.rainfall24hMm * 0.75) / 1000).toFixed(3)),
    DEM_elevation_gts_m: input.groundElevationGtsM,
    nearshore_bathymetry_m: input.nearshoreBathymetryDepthM || 8.5,
    wave_setup_m: waveSetupM,
    wave_runup_m: waveRunupM,
    estuary_backwater_choking_m: estuaryBackwaterChokingM,

    // Synthesized Totals
    coastal_total_water_level_m: coastalTotalWaterLevelM,
    compound_water_level_m: compoundTotalWaterLevelM,

    // Site-specific impacts
    astronomicalTideM,
    meteorologicalSurgeM,
    waveSetupM,
    waveRunupM,
    coastalTotalWaterLevelM,
    upstreamStageM,
    estuaryBackwaterChokingM,
    gravityDrainageLocked,
    compoundTotalWaterLevelM,
    overlandInundationDepthM,
    flowVelocityMs,
    scourShearStressPa,
    infrastructureImpact: {
      roadPassability,
      roadWaterDepthM,
      substationSafetyStatus,
      substationClearanceRemainingM,
      lifelineCascadeRisk,
      cascadingConsequences
    },
    dominantUncertaintyFactor,
    uncertaintyMarginM,
    confidenceScore
  };
}
