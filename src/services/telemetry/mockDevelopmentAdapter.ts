/**
 * GeoShield India v1.0 — Phase 8.1: Development Mock Adapter
 *
 * Explicitly labeled synthetic test fixture adapter for deterministic offline regression.
 * Never confused with live operational or primary statutory feeds.
 *
 * Source Tier: DEVELOPMENT_MOCK
 * Authority: DEVELOPMENT_FIXTURE
 */

import {
  TelemetryProvider,
  ProviderMetadata,
  ProviderHealth,
  RawTelemetryRecord,
  CanonicalTelemetryRecord
} from './telemetryTypes';
import { rawDataArchive } from './rawArchive';
import { TelemetryNormalizer } from './normalizer';

export class MockDevelopmentAdapter implements TelemetryProvider {
  public readonly metadata: ProviderMetadata = {
    providerId: 'provider_dev_mock_fixture',
    name: 'GeoShield Development Offline Test Fixture (Calibrated Synthetic Frame)',
    sourceAuthority: 'DEVELOPMENT_FIXTURE',
    sourceTier: 'DEVELOPMENT_MOCK',
    endpointUrl: 'mock://local-fixture/telemetry/v1',
    defaultCoordinates: [20.31, 86.61],
    updateIntervalMinutes: 60,
    isStatutoryAuthority: false,
    legalCitation: 'INTERNAL USE ONLY — NOT CERTIFIED FOR OPERATIONAL DISASTER RESPONSE'
  };

  public async getLatest(): Promise<{
    raw: RawTelemetryRecord;
    canonical: CanonicalTelemetryRecord[];
  }> {
    const [lat, lon] = this.metadata.defaultCoordinates;
    const nowIso = new Date().toISOString();

    const mockPayload = {
      isSynthetic: true,
      simulationPurpose: "OFFLINE_DETERMINISTIC_REGRESSION",
      timestamp: nowIso,
      values: {
        pressure: 974.0,
        windSpeed: 140.0,
        rainfall: 180.0,
        riverStage: 22.5
      }
    };

    // 1. RAW ARCHIVE
    const rawArchive = rawDataArchive.archiveRawPayload({
      providerId: this.metadata.providerId,
      sourceAuthority: this.metadata.sourceAuthority,
      sourceTier: this.metadata.sourceTier,
      providerTimestamp: nowIso,
      requestParameters: { mock: true },
      httpStatus: 200,
      rawPayload: mockPayload,
      schemaVersion: 'mock-v1'
    });

    // 2. Normalization
    const canonical: CanonicalTelemetryRecord[] = [
      TelemetryNormalizer.normalizeRecord(rawArchive, {
        sourceId: 'MOCK-P-01',
        variableName: 'surface_pressure_hpa',
        rawValue: mockPayload.values.pressure,
        rawUnit: 'hPa',
        targetUnit: 'hPa',
        latitude: lat,
        longitude: lon,
        timestamp: nowIso
      }),
      TelemetryNormalizer.normalizeRecord(rawArchive, {
        sourceId: 'MOCK-W-02',
        variableName: 'wind_speed_kmh',
        rawValue: mockPayload.values.windSpeed,
        rawUnit: 'km/h',
        targetUnit: 'km/h',
        latitude: lat,
        longitude: lon,
        timestamp: nowIso
      })
    ];

    return { raw: rawArchive, canonical };
  }

  public async getHistorical(_startTime: string, _endTime: string): Promise<{
    raw: RawTelemetryRecord[];
    canonical: CanonicalTelemetryRecord[];
  }> {
    const latest = await this.getLatest();
    return { raw: [latest.raw], canonical: latest.canonical };
  }

  public async getHealth(): Promise<ProviderHealth> {
    return {
      providerId: this.metadata.providerId,
      name: this.metadata.name,
      sourceAuthority: this.metadata.sourceAuthority,
      sourceTier: this.metadata.sourceTier,
      operationalStatus: 'ONLINE',
      latencyMs: 1,
      lastSuccessfulSync: new Date().toISOString(),
      slaMaxMinutes: 1440,
      failureCount: 0,
      notes: 'Synthetic fixture active for development verification.'
    };
  }
}
