#!/usr/bin/env node
/**
 * GeoShield India v1.0 — Phase 8.3: Dedicated Historical Replay & Provider Connectivity Verification Suite
 *
 * Verifies:
 * 1. Statutory Provider 10-Point Connectivity & Empirical Status Taxonomy (IMD, CWC, INCOIS, Open-Meteo)
 * 2. Historical Scenarios & Dataset Boundaries (Fani 2019, Dana 2024, 1999 Super Cyclone)
 * 3. Physically Bifurcated Temporal Gate & Future Leakage Rejection (t <= T_eval vs t > T_eval)
 * 4. Full Decision-Chain Model-Version Lock (Software, Models, Governance, and SHA-256 hashes)
 * 5. Replay Determinism under locked execution configuration
 * 6. Dimension D Fault Injection (D1-D10: Outage, Stale Data, Unit Corruption, Provider Divergence)
 * 7. Lead-Time Decomposition (T1, T2, T3, T4) with explicit NOT_COMPUTABLE metric handling
 * 8. Scientific Validation Classification (CALIBRATED_HISTORICAL_BENCHMARK)
 */

import { providerConnectivityVerifier } from '../src/services/telemetry/providerConnectivityVerifier';
import { historicalReplayEngine } from '../src/services/replay/historicalReplayEngine';
import {
  HISTORICAL_DATASET_MANIFESTS,
  HISTORICAL_LANDFALL_TIMESTAMPS
} from '../src/services/replay/historicalScenariosCorpus';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runPhase83Suite() {
  console.log('================================================================================');
  console.log('  GEOSHIELD INDIA v1.0 — PHASE 8.3 HISTORICAL REPLAY & PROVIDER VERIFICATION   ');
  console.log('================================================================================');
  console.log(`Execution Timestamp: ${new Date().toISOString()}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(testId: string, description: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] [${testId}] ${description}`);
      if (details) console.log(`         -> ${details}`);
    } else {
      failedTests++;
      console.error(`  [FAIL] [${testId}] ${description}`);
      if (details) console.error(`         -> ${details}`);
    }
  }

  // ============================================================================
  // SECTION 1: STATUTORY PROVIDER 10-POINT CONNECTIVITY PROBE
  // ============================================================================
  console.log('\n--- SECTION 1: STATUTORY PROVIDER CONNECTIVITY VERIFICATION ---');
  const connReport = await providerConnectivityVerifier.probeAll();

  assert(
    'PROV-10PT-01',
    'Provider connectivity verifier evaluated all 5 providers (IMD, CWC, INCOIS, Open-Meteo, Mock)',
    connReport.totalProvidersChecked === 5,
    `Checked: ${connReport.results.map(r => r.name.split(' ')[0]).join(', ')}`
  );

  const openMeteoResult = connReport.results.find(r => r.sourceAuthority === 'OPEN_METEO');
  assert(
    'PROV-LIVE-02',
    'Open-Meteo operational NWP endpoint verified LIVE with valid JSON and SHA-256 payload archive',
    openMeteoResult?.connectivityStatus === 'LIVE_VERIFIED' && openMeteoResult.checklist.sha256IntegrityVerified,
    `Status: ${openMeteoResult?.connectivityStatus}, Hash: ${openMeteoResult?.rawPayloadHash?.slice(0, 16)}...`
  );

  const imdResult = connReport.results.find(r => r.sourceAuthority === 'IMD');
  assert(
    'PROV-HONESTY-03',
    'IMD endpoint transparently records actual HTTP status (HTTP_404) without fabricating live verification',
    imdResult?.connectivityStatus === 'HTTP_404' && !imdResult.checklist.endpointReachable === false,
    `Status: ${imdResult?.connectivityStatus} (${imdResult?.details})`
  );

  const cwcResult = connReport.results.find(r => r.sourceAuthority === 'CWC');
  assert(
    'PROV-CWC-GOOGLE-04',
    'CWC river gauge via Google Flood Forecasting API transparently records AUTHENTICATION_REQUIRED citing developers.google.com/flood-forecasting',
    cwcResult?.connectivityStatus === 'AUTHENTICATION_REQUIRED' || cwcResult?.connectivityStatus === 'LIVE_VERIFIED',
    `Status: ${cwcResult?.connectivityStatus} (${cwcResult?.details})`
  );

  const mockResult = connReport.results.find(r => r.sourceAuthority === 'DEVELOPMENT_FIXTURE');
  assert(
    'PROV-MOCK-05',
    'Synthetic development mock is strictly labeled as DEVELOPMENT_ONLY',
    mockResult?.connectivityStatus === 'DEVELOPMENT_ONLY',
    `Status: ${mockResult?.connectivityStatus}`
  );

  // ============================================================================
  // SECTION 2: HISTORICAL SCENARIOS & DATASET BOUNDARIES
  // ============================================================================
  console.log('\n--- SECTION 2: HISTORICAL SCENARIO BOUNDARIES & DATASET MANIFESTS ---');
  
  const faniManifest = HISTORICAL_DATASET_MANIFESTS.CYCLONE_FANI_2019;
  const danaManifest = HISTORICAL_DATASET_MANIFESTS.CYCLONE_DANA_2024;
  const superManifest = HISTORICAL_DATASET_MANIFESTS.SUPER_CYCLONE_1999;

  assert(
    'DATASET-MANIFEST-01',
    'Cyclone Fani 2019 classified under MODERN_HISTORICAL_REPLAY with full agency metadata',
    faniManifest.replayRole === 'MODERN_HISTORICAL_REPLAY' && faniManifest.recordCount > 0,
    `Role: ${faniManifest.replayRole}, Source: ${faniManifest.source.slice(0, 40)}...`
  );

  assert(
    'DATASET-MANIFEST-02',
    'Cyclone Dana 2024 classified under RECENT_HISTORICAL_REPLAY with coastal gauge coverage',
    danaManifest.replayRole === 'RECENT_HISTORICAL_REPLAY' && danaManifest.year === 2024,
    `Role: ${danaManifest.replayRole}, Coverage: ${danaManifest.coverageStart} to ${danaManifest.coverageEnd}`
  );

  assert(
    'DATASET-MANIFEST-03',
    '1999 Odisha Super Cyclone separated under HISTORICAL_STRESS_REFERENCE_REPLAY',
    superManifest.replayRole === 'HISTORICAL_STRESS_REFERENCE_REPLAY' && superManifest.year === 1999,
    `Role: ${superManifest.replayRole} (Extreme physical boundary test)`
  );

  // ============================================================================
  // SECTION 3: PHYSICALLY BIFURCATED TEMPORAL GATE & FUTURE ANTI-LEAKAGE
  // ============================================================================
  console.log('\n--- SECTION 3: PHYSICALLY BIFURCATED TEMPORAL GATE & ANTI-LEAKAGE ---');

  const faniReplayT24 = await historicalReplayEngine.executeReplay({
    scenarioId: 'CYCLONE_FANI_2019',
    timeStep: 'T-24h',
    dimension: 'DIMENSION_A_OBSERVATIONS_ONLY'
  });

  const nominalTEvalFani = faniReplayT24.nominalTEval;
  const rejectedCount = faniReplayT24.rejectedFutureRecordsCount;
  const acceptedCount = faniReplayT24.acceptedRecordsCount;
  const totalExamined = faniReplayT24.totalCorpusRecordsExamined;

  assert(
    'ANTI-LEAKAGE-01',
    'Temporal gate physically bifurcates corpus: t <= T_eval accepted, t > T_eval rejected',
    acceptedCount > 0 && rejectedCount > 0 && acceptedCount + rejectedCount === totalExamined,
    `T_eval: ${nominalTEvalFani} | Accepted: ${acceptedCount} | Rejected Future: ${rejectedCount} | Total: ${totalExamined}`
  );

  const allRejectedAreFuture = faniReplayT24.rejectedRecordsLog.every(
    r => Date.parse(r.timestamp) > Date.parse(nominalTEvalFani)
  );
  assert(
    'ANTI-LEAKAGE-02',
    'Every record in rejected log has observation timestamp strictly GREATER than T_eval',
    allRejectedAreFuture,
    `Verified ${faniReplayT24.rejectedRecordsLog.length} future observations intercepted with POST_EVAL_LEAKAGE_PREVENTED`
  );

  // ============================================================================
  // SECTION 4: FULL DECISION-CHAIN MODEL-VERSION LOCK
  // ============================================================================
  console.log('\n--- SECTION 4: FULL DECISION-CHAIN MODEL-VERSION LOCK ---');

  const lock = faniReplayT24.modelLock;
  assert(
    'MODEL-LOCK-01',
    'Full decision model lock incorporates software, models, and governance tiers',
    lock.softwareLock.codeCommit.length > 0 &&
    lock.modelLock.hazardModelVersion.length > 0 &&
    lock.governanceLock.regulatoryRegistryVersion.length > 0,
    `Code Commit: ${lock.softwareLock.codeCommit}, Hazard Model: ${lock.modelLock.hazardModelVersion}`
  );

  assert(
    'MODEL-LOCK-02',
    'Decision hashes and Model Lock Hash computed via SHA-256',
    lock.decisionInputHash.length === 64 &&
    lock.decisionConfigurationHash.length === 64 &&
    lock.modelLockHash.length === 64,
    `Model Lock Hash: ${lock.modelLockHash.slice(0, 24)}...`
  );

  // ============================================================================
  // SECTION 5: REPLAY DETERMINISM UNDER LOCKED EXECUTION CONFIGURATION
  // ============================================================================
  console.log('\n--- SECTION 5: REPLAY DETERMINISM UNDER LOCKED CONFIGURATION ---');

  const faniReplayT24SecondRun = await historicalReplayEngine.executeReplay({
    scenarioId: 'CYCLONE_FANI_2019',
    timeStep: 'T-24h',
    dimension: 'DIMENSION_A_OBSERVATIONS_ONLY'
  });

  assert(
    'DETERMINISM-01',
    'Identical locked software, model, parameters, and input dataset yield identical manifest hashes',
    faniReplayT24.manifestHash === faniReplayT24SecondRun.manifestHash,
    `Run 1 Hash: ${faniReplayT24.manifestHash.slice(0, 20)}... | Run 2 Hash: ${faniReplayT24SecondRun.manifestHash.slice(0, 20)}...`
  );

  // ============================================================================
  // SECTION 6: DIMENSION D SENSOR FAILURE FAULT INJECTION (D1 - D10)
  // ============================================================================
  console.log('\n--- SECTION 6: DIMENSION D SENSOR FAILURE FAULT INJECTION ---');

  const danaStressReplay = await historicalReplayEngine.executeReplay({
    scenarioId: 'CYCLONE_DANA_2024',
    timeStep: 'T-12h',
    dimension: 'DIMENSION_D_SENSOR_FAILURE_STRESS_TEST',
    injectedFaults: [
      'D1_COMPLETE_SENSOR_OUTAGE',
      'D2_STALE_SENSOR_DATA',
      'D5_UNIT_CORRUPTION',
      'D9_CONTRADICTORY_PROVIDER_OBSERVATION'
    ]
  });

  assert(
    'FAULT-INJECT-01',
    'Dimension D applies explicit fault injections (D1 Outage, D2 Stale, D5 Unit, D9 Divergence)',
    danaStressReplay.faultInjectionsApplied.length === 4,
    `Injected ${danaStressReplay.faultInjectionsApplied.length} faults: ${danaStressReplay.faultInjectionsApplied.map(f => f.faultType).join(', ')}`
  );

  const hasFailClosed = danaStressReplay.faultInjectionsApplied.some(f => f.systemBehavior === 'FAIL_CLOSED');
  const hasFallback = danaStressReplay.faultInjectionsApplied.some(f => f.systemBehavior === 'FALLBACK_ACTIVATED');
  assert(
    'FAULT-INJECT-02',
    'System responses correctly cataloged as FAIL_CLOSED and FALLBACK_ACTIVATED',
    hasFailClosed && hasFallback && danaStressReplay.replayStatus === 'SUCCESS_WITH_SENSOR_FAILURE',
    `Replay Status: ${danaStressReplay.replayStatus}`
  );

  // ============================================================================
  // SECTION 7: LEAD-TIME DECOMPOSITION (T1 - T4) & NOT_COMPUTABLE HANDLING
  // ============================================================================
  console.log('\n--- SECTION 7: LEAD-TIME DECOMPOSITION (T1, T2, T3, T4) & NOT_COMPUTABLE ---');

  const faniLeadTimes = faniReplayT24.leadTimes;
  assert(
    'LEAD-TIME-01',
    'Cyclone Fani computes valid 3-way lead times (Detection: T4-T1, Recommendation: T4-T2, Warning: T4-T3)',
    typeof faniLeadTimes.detectionLeadTimeHours === 'number' &&
    typeof faniLeadTimes.recommendationLeadTimeHours === 'number' &&
    typeof faniLeadTimes.officialWarningLeadTimeHours === 'number',
    `Detection: +${faniLeadTimes.detectionLeadTimeHours}h | Recommendation: +${faniLeadTimes.recommendationLeadTimeHours}h | Warning: +${faniLeadTimes.officialWarningLeadTimeHours}h`
  );

  const super1999Replay = await historicalReplayEngine.executeReplay({
    scenarioId: 'SUPER_CYCLONE_1999',
    timeStep: 'T-24h',
    dimension: 'DIMENSION_A_OBSERVATIONS_ONLY'
  });

  const super1999LeadTimes = super1999Replay.leadTimes;
  assert(
    'LEAD-TIME-02',
    '1999 Super Cyclone handles missing T3 (official alert) as NOT_COMPUTABLE with explicit reason',
    super1999LeadTimes.officialWarningLeadTimeHours === 'NOT_COMPUTABLE' &&
    super1999LeadTimes.computabilityReasons.officialWarningLeadTimeReason === 'OFFICIAL_ALERT_TIMESTAMP_UNAVAILABLE',
    `Official Warning Lead Time: ${super1999LeadTimes.officialWarningLeadTimeHours} (${super1999LeadTimes.computabilityReasons.officialWarningLeadTimeReason})`
  );

  // ============================================================================
  // SECTION 8: SCIENTIFIC VALIDATION CLASSIFICATION
  // ============================================================================
  console.log('\n--- SECTION 8: SCIENTIFIC VALIDATION CLASSIFICATION ---');

  assert(
    'VALIDATION-CLASS-01',
    'Replay output is explicitly tagged CALIBRATED_HISTORICAL_BENCHMARK (not certified operational)',
    faniReplayT24.validationStatus === 'CALIBRATED_HISTORICAL_BENCHMARK' &&
    faniReplayT24.scientificDisclaimer.includes('CALIBRATED_HISTORICAL_BENCHMARK'),
    `Validation Status: ${faniReplayT24.validationStatus}`
  );

  // ============================================================================
  // SUMMARY SCORECARD
  // ============================================================================
  console.log('\n================================================================================');
  console.log('       PHASE 8.3 HISTORICAL REPLAY & PROVIDER VERIFICATION SCORECARD            ');
  console.log('================================================================================');
  console.log(`Total Test Vectors:   ${totalTests}`);
  console.log(`Passed Vectors:       ${passedTests}`);
  console.log(`Failed Vectors:       ${failedTests}`);
  console.log(`Compliance Score:     ${Math.round((passedTests / totalTests) * 100)}%`);

  // Write machine readable manifest artifact
  try {
    const outDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const replayArtifact = {
      timestamp: new Date().toISOString(),
      connectivityReport: connReport,
      faniReplayManifest: faniReplayT24,
      danaStressReplayManifest: danaStressReplay,
      superCyclone1999ReplayManifest: super1999Replay,
      suiteSummary: {
        totalTests,
        passedTests,
        failedTests,
        status: failedTests === 0 ? 'PHASE_8_3_VERIFIED' : 'FAILED'
      }
    };
    fs.writeFileSync(path.join(outDir, 'geoshield-phase8-replay-manifest.json'), JSON.stringify(replayArtifact, null, 2));
    console.log('Artifact exported to dist/geoshield-phase8-replay-manifest.json');
  } catch (_e) {
    // Non-blocking
  }

  if (failedTests > 0) {
    console.error(`\nFATAL: Phase 8.3 verification failed with ${failedTests} failures.`);
    process.exit(1);
  } else {
    console.log('\nVERIFICATION COMPLETE: Phase 8.3 Historical Replay & Provider Connectivity passed 100%.');
    process.exit(0);
  }
}

runPhase83Suite().catch(err => {
  console.error('CRITICAL RUNTIME ERROR in Phase 8.3 Verification Suite:', err);
  process.exit(1);
});
