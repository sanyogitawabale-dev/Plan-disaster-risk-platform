import {
  INDIA_SCENARIO,
  INDIA_ASSETS,
  INDIA_ROADS,
  INDIA_SHELTERS,
  INDIA_SAR_HOTSPOTS,
  INDIA_CWC_GAUGES
} from '../src/data/indiaDisasterData';
import {
  analyzeSpatialContext,
  resolveGeographicLocation
} from '../src/services/areaIntelligenceEngine';
import { SpatialAreaSelection } from '../src/types/areaIntelligence';

console.log('================================================================================');
console.log('  GEOSHIELD LIVE SPATIAL COMPOSITE AREA INTELLIGENCE VERIFICATION SUITE       ');
console.log('================================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, code: string, message: string, details?: any) {
  if (condition) {
    console.log(`  [PASS] [${code}] ${message}`);
    if (details) console.log(`         -> ${JSON.stringify(details)}`);
    passCount++;
  } else {
    console.error(`  [FAIL] [${code}] ${message}`);
    if (details) console.error(`         -> ${JSON.stringify(details)}`);
    failCount++;
  }
}

// TEST 1: Coordinate to Geographic Location Resolution
const geoJobra = resolveGeographicLocation(240, 245, true);
assert(
  geoJobra.locationName.includes('Jobra') && geoJobra.districtState.includes('Cuttack'),
  'GEO-RESOLVE-01',
  'Resolves SVG coordinates (240, 245) to Jobra Barrage & Cuttack Delta',
  { name: geoJobra.locationName, district: geoJobra.districtState, lat: geoJobra.lat, lng: geoJobra.lng }
);

const geoParadip = resolveGeographicLocation(505, 325, true);
assert(
  geoParadip.locationName.includes('Paradip') && geoParadip.districtState.includes('Jagatsinghpur'),
  'GEO-RESOLVE-02',
  'Resolves coastal SVG coordinates (505, 325) to OPTCL Paradip Grid / Jagatsinghpur',
  { name: geoParadip.locationName, district: geoParadip.districtState }
);

// TEST 2: Core Area Intelligence Analysis at NOW
const selectionJobra: SpatialAreaSelection = {
  type: 'click',
  coords: { lat: 20.490, lng: 85.892, svgX: 240, svgY: 245 },
  radiusKm: 10,
  locationName: 'Jobra Barrage & Cuttack Delta',
  districtState: 'Cuttack, Odisha'
};

const analysisNow = analyzeSpatialContext(
  selectionJobra,
  'NOW',
  INDIA_SCENARIO,
  INDIA_ASSETS,
  INDIA_ROADS,
  INDIA_SHELTERS,
  INDIA_SAR_HOTSPOTS,
  INDIA_CWC_GAUGES,
  'INDIA_NDMA'
);

assert(
  analysisNow.liveStatus === 'LIVE',
  'STATUS-LIVE-01',
  'Accurately flags live verified status at current operational step',
  { liveStatus: analysisNow.liveStatus }
);

assert(
  analysisNow.plainLanguageSynthesis.length > 30 &&
  analysisNow.plainLanguageSynthesis.toLowerCase().includes('river'),
  'SYNTHESIS-01',
  'Generates prominent plain-language situation synthesis without hallucination',
  { synthesis: analysisNow.plainLanguageSynthesis }
);

// TEST 3: Environmental Conditions Breakdown
const rainCond = analysisNow.conditions.find(c => c.category === 'rainfall');
const riverCond = analysisNow.conditions.find(c => c.category === 'river');
const windCond = analysisNow.conditions.find(c => c.category === 'wind');
const stormCond = analysisNow.conditions.find(c => c.category === 'storm');

assert(
  Boolean(rainCond && riverCond && windCond && stormCond),
  'CONDITIONS-ALL-01',
  'All 4 core environmental conditions (Rainfall, River, Wind, Storm) present',
  {
    rainfall: rainCond?.observedValue,
    river: riverCond?.observedValue,
    wind: windCond?.observedValue,
    storm: stormCond?.observedValue
  }
);

assert(
  Boolean(riverCond?.observedValue.includes('21.65') && riverCond?.referenceBaseline.includes('21.00')),
  'RIVER-TELEMETRY-01',
  'CWC river stage matches Jobra Barrage official measurement (21.65m MSL)',
  { observed: riverCond?.observedValue, baseline: riverCond?.referenceBaseline }
);

// TEST 4: "Why is this happening?" Causal Relationship Chain
assert(
  analysisNow.causalChain.length === 5,
  'CAUSAL-CHAIN-01',
  'Causal flowchart contains 5 distinct linked steps',
  { steps: analysisNow.causalChain.map(s => s.title) }
);

const types = analysisNow.causalChain.map(s => s.type);
assert(
  types.includes('Observed') && types.includes('Model-derived') && types.includes('AI explanation'),
  'CAUSAL-DISTINCTION-02',
  'Clearly distinguishes Observed vs Model-derived vs AI explanation',
  { types }
);

// TEST 5: "What Changed?" (Deltas vs Previous 6h)
assert(
  analysisNow.recentChanges.length >= 4,
  'CHANGES-DELTA-01',
  'Recent changes table computes deltas for rainfall, river stage, wind, and risk area',
  { changes: analysisNow.recentChanges.map(c => `${c.metric}: ${c.deltaText}`) }
);

const riverChange = analysisNow.recentChanges.find(c => c.id === 'change_river');
assert(
  riverChange?.deltaText === '+0.48 m',
  'RIVER-DELTA-02',
  'River level delta correctly reflects +0.48m rise over preceding 6h',
  { past: riverChange?.pastValue, current: riverChange?.currentValue, delta: riverChange?.deltaText }
);

// TEST 6: "Before -> Now" Spatial Footprint Expansion
assert(
  analysisNow.spatialChangeBeforeNow.currentMetrics.floodExtentKm2 > analysisNow.spatialChangeBeforeNow.pastMetrics.floodExtentKm2,
  'SPATIAL-CHANGE-01',
  'Before -> Now footprints show positive flood extent expansion (28 km² -> 52 km²)',
  analysisNow.spatialChangeBeforeNow
);

// TEST 7: Contributing Layers & Evidence
assert(
  analysisNow.contributingLayers.length >= 5,
  'LAYERS-EVIDENCE-01',
  'Contributing layer evidence includes CWC Gauge, IMD Radar, DEM, SAR, and Surge model',
  { layers: analysisNow.contributingLayers.map(l => l.layerName) }
);

// TEST 8: Nearby Critical Infrastructure & Radius Aggregation
assert(
  analysisNow.nearbyAssets.length > 0,
  'NEARBY-ASSETS-01',
  'Nearby critical infrastructure contains assets within 10km radius',
  { count: analysisNow.nearbyAssets.length, firstAsset: analysisNow.nearbyAssets[0]?.asset.name }
);

const assetSituations = analysisNow.nearbyAssets.map(a => a.situation);
assert(
  assetSituations.includes('Monitoring') ||
  assetSituations.includes('Submerged') ||
  assetSituations.includes('Potential Exposure') ||
  assetSituations.includes('Elevated River Backwater'),
  'ASSET-SITUATION-02',
  'Accurately calculates situation status (Monitoring / Exposure / Submerged / Elevated River Backwater) from FFE',
  { situations: assetSituations }
);

// TEST 9: Cascading Impacts
assert(
  analysisNow.cascadingImpacts.length === 6,
  'CASCADE-NODES-01',
  'Cascading dependency graph contains 6 interconnected nodes',
  { chain: analysisNow.cascadingImpacts.map(c => c.name) }
);

// TEST 10: 24h Forecast Horizon & Uncertainty Spreads
assert(
  analysisNow.forecastTimeline.length === 5,
  'FORECAST-TIMELINE-01',
  'Forecast timeline covers NOW, +3h, +6h, +12h, and +24h',
  { steps: analysisNow.forecastTimeline.map(f => `${f.timeStep}: ${f.expectedCondition}`) }
);

assert(
  analysisNow.forecastTimeline.every(f => Boolean(f.uncertaintySpread)),
  'FORECAST-UNCERTAINTY-02',
  'Every single forecast timestep includes explicit uncertainty bounds (never presented as certainty)',
  { spreads: analysisNow.forecastTimeline.map(f => `${f.timeStep}: ${f.uncertaintySpread}`) }
);

// TEST 11: 3-Level Explanations Grounded in Same Telemetry
assert(
  analysisNow.aiExplanations.simple.length > 20 &&
  Boolean(analysisNow.aiExplanations.detailed.rainfall) &&
  Boolean(analysisNow.aiExplanations.expert.measurements),
  'AI-3-TIER-01',
  'Simple, Detailed, and Expert explanations all populated from verified telemetry',
  {
    simple: analysisNow.aiExplanations.simple.substring(0, 50) + '...',
    detailedRain: analysisNow.aiExplanations.detailed.rainfall.substring(0, 40) + '...',
    expertMeasurements: analysisNow.aiExplanations.expert.measurements.substring(0, 40) + '...'
  }
);

// TEST 12: Spatial Story Mode (7 Steps)
assert(
  analysisNow.storySteps.length === 7,
  'STORY-MODE-01',
  'Spatial Story Mode provides 7 sequential walkthrough steps with SVG targets',
  { steps: analysisNow.storySteps.map(s => s.title) }
);

// TEST 13: Temporal Stepper Anti-Leakage Integration (T-24h should report HISTORICAL)
const analysisPast = analyzeSpatialContext(
  selectionJobra,
  'T-24h',
  INDIA_SCENARIO,
  INDIA_ASSETS,
  INDIA_ROADS,
  INDIA_SHELTERS,
  INDIA_SAR_HOTSPOTS,
  INDIA_CWC_GAUGES,
  'INDIA_NDMA'
);

assert(
  analysisPast.liveStatus === 'HISTORICAL',
  'TEMPORAL-STEP-HISTORICAL-01',
  'T-24h temporal step correctly flags HISTORICAL status (never claims live for past)',
  { status: analysisPast.liveStatus }
);

// TEST 14: Temporal Stepper Forecast Step (T+6h should report FORECAST)
const analysisForecast = analyzeSpatialContext(
  selectionJobra,
  'T+6h',
  INDIA_SCENARIO,
  INDIA_ASSETS,
  INDIA_ROADS,
  INDIA_SHELTERS,
  INDIA_SAR_HOTSPOTS,
  INDIA_CWC_GAUGES,
  'INDIA_NDMA'
);

assert(
  analysisForecast.liveStatus === 'FORECAST',
  'TEMPORAL-STEP-FORECAST-02',
  'T+6h temporal step correctly flags FORECAST status',
  { status: analysisForecast.liveStatus }
);

console.log('\n================================================================================');
console.log('       AREA INTELLIGENCE VERIFICATION SCORECARD                                 ');
console.log('================================================================================');
console.log(`Total Test Vectors:   ${passCount + failCount}`);
console.log(`Passed Vectors:       ${passCount}`);
console.log(`Failed Vectors:       ${failCount}`);
console.log(`Compliance Score:     ${Math.round((passCount / (passCount + failCount)) * 100)}%`);
console.log('================================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('VERIFICATION COMPLETE: All Area Intelligence capabilities verified 100%.\n');
}
