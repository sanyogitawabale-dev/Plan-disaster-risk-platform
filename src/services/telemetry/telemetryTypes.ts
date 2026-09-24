/**
 * GeoShield India v1.0 — Phase 8.1: Telemetry Types & Abstractions
 * 
 * Defines the provider-independent telemetry interface, raw data archive schema,
 * source authority tiers, metrological validation contracts, and model version lock.
 */

export type SourceTier = 
  | 'PRIMARY_AUTHORITATIVE'      // Official statutory government sources (IMD, CWC, INCOIS, OPTCL)
  | 'SUPPLEMENTARY_CROSS_CHECK'  // Open NWP & external cross-check providers (Open-Meteo, ECMWF open)
  | 'DEVELOPMENT_MOCK';          // Labeled synthetic test fixtures for offline verification

export type SourceAuthority =
  | 'IMD'
  | 'CWC'
  | 'INCOIS'
  | 'OPTCL'
  | 'ECMWF'
  | 'OPEN_METEO'
  | 'DEVELOPMENT_FIXTURE';

export type TelemetryQualityStatus =
  | 'VALID'
  | 'STALE'
  | 'OUT_OF_BOUNDS'
  | 'DEGRADED'
  | 'CORRUPT'
  | 'SYNTHETIC';

export type VerticalDatum =
  | 'MSL_SURVEY_OF_INDIA'
  | 'WGS84_ELLIPSOID'
  | 'LOCAL_CHART_DATUM'
  | 'NOT_APPLICABLE';

export type CoordinateReferenceSystem =
  | 'EPSG:4326'
  | 'EPSG:3857'
  | 'EPSG:32645'; // UTM Zone 45N (East Coast India)

export interface RawTelemetryRecord {
  archiveId: string;
  providerId: string;
  sourceAuthority: SourceAuthority;
  sourceTier: SourceTier;
  receivedAt: string;          // ISO-8601 ingestion timestamp
  providerTimestamp: string;    // Reported timestamp by agency/feed
  requestParameters: Record<string, any>;
  httpStatus: number;
  payloadHash: string;         // SHA-256 of rawPayload string
  rawPayloadString: string;    // Raw verbatim byte string or serialized JSON
  schemaVersion: string;
}

export interface CanonicalTelemetryRecord {
  id: string;
  sourceId: string;
  sourceAuthority: SourceAuthority;
  sourceTier: SourceTier;
  timestamp: string;           // Provider timestamp (ISO-8601)
  ingestionTimestamp: string;  // System receipt timestamp (ISO-8601)
  latitude: number;
  longitude: number;
  variableName: string;        // e.g. 'surface_pressure_hpa', 'wind_speed_kmh', 'rainfall_24h_mm'
  unit: string;                // e.g. 'hPa', 'km/h', 'mm', 'm', 'cusecs', 'm3/s'
  verticalDatum: VerticalDatum;
  crs: CoordinateReferenceSystem;
  rawValue: number;
  normalizedValue: number;     // Normalized to standard SI/National unit
  qualityStatus: TelemetryQualityStatus;
  freshnessMinutes: number;
  rawArchiveRef: string;       // Foreign key pointing to RawTelemetryRecord.payloadHash
  provenanceHash: string;      // SHA-256 fingerprint combining raw hash, metadata, and normalized value
  modelLock: {
    codeCommit: string;
    schemaVersion: string;
    algorithmHash: string;
  };
}

export interface ProviderHealth {
  providerId: string;
  name: string;
  sourceAuthority: SourceAuthority;
  sourceTier: SourceTier;
  operationalStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  lastSuccessfulSync: string;
  slaMaxMinutes: number;
  failureCount: number;
  activeError?: string;
  notes: string;
}

export interface ProviderMetadata {
  providerId: string;
  name: string;
  sourceAuthority: SourceAuthority;
  sourceTier: SourceTier;
  endpointUrl: string;
  defaultCoordinates: [number, number]; // [lat, lon]
  updateIntervalMinutes: number;
  isStatutoryAuthority: boolean;
  legalCitation?: string;
}

export interface TelemetryProvider {
  readonly metadata: ProviderMetadata;
  getLatest(): Promise<{
    raw: RawTelemetryRecord;
    canonical: CanonicalTelemetryRecord[];
  }>;
  getHistorical(startTime: string, endTime: string): Promise<{
    raw: RawTelemetryRecord[];
    canonical: CanonicalTelemetryRecord[];
  }>;
  getHealth(): Promise<ProviderHealth>;
}
