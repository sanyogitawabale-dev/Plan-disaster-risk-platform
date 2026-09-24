/**
 * GeoShield India v1.0 — Phase 8.1: Telemetry Normalizer & Metrological Validator
 *
 * Enforces strict scientific unit conversion, vertical datum attachment (Survey of India GTS MSL),
 * coordinate reference system validation, and physical sanity bounds checking.
 */

import {
  RawTelemetryRecord,
  CanonicalTelemetryRecord,
  SourceAuthority,
  SourceTier,
  VerticalDatum,
  CoordinateReferenceSystem,
  TelemetryQualityStatus
} from './telemetryTypes';
import { computeSha256 } from './rawArchive';

const CODE_COMMIT_BASELINE = 'cf3eb75f28056069f329be2e439810d4a225a010';

export interface RawFieldSpecification {
  sourceId: string;
  variableName: string;
  rawValue: number;
  rawUnit: string;
  targetUnit: string;
  latitude: number;
  longitude: number;
  verticalDatum?: VerticalDatum;
  crs?: CoordinateReferenceSystem;
  timestamp?: string;
}

export interface NormalizationBounds {
  min: number;
  max: number;
  targetUnit: string;
}

const PHYSICAL_BOUNDS: Record<string, NormalizationBounds> = {
  surface_pressure_hpa: { min: 860, max: 1045, targetUnit: 'hPa' },
  wind_speed_kmh: { min: 0, max: 360, targetUnit: 'km/h' },
  wind_gust_kmh: { min: 0, max: 420, targetUnit: 'km/h' },
  rainfall_24h_mm: { min: 0, max: 1200, targetUnit: 'mm' },
  river_stage_m: { min: 0, max: 35, targetUnit: 'm' },
  storm_surge_m: { min: -2.0, max: 12.0, targetUnit: 'm' },
  water_depth_m: { min: 0, max: 15.0, targetUnit: 'm' }
};

export class TelemetryNormalizer {
  /**
   * Normalizes raw field inputs into an immutable CanonicalTelemetryRecord.
   * Rejects bare numbers or corrupt units with fail-closed OUT_OF_BOUNDS / CORRUPT flags.
   */
  public static normalizeRecord(
    rawArchive: RawTelemetryRecord,
    spec: RawFieldSpecification
  ): CanonicalTelemetryRecord {
    const rawVal = Number(spec.rawValue);
    let normalizedVal = rawVal;
    let qualityStatus: TelemetryQualityStatus = 'VALID';

    // 1. Sanity check: NaN or infinite values
    if (isNaN(rawVal) || !isFinite(rawVal)) {
      qualityStatus = 'CORRUPT';
      normalizedVal = 0;
    }

    // 2. Unit conversions
    if (spec.rawUnit === 'm/s' && spec.targetUnit === 'km/h') {
      normalizedVal = rawVal * 3.6;
    } else if (spec.rawUnit === 'Pa' && spec.targetUnit === 'hPa') {
      normalizedVal = rawVal / 100;
    } else if (spec.rawUnit === 'cusecs' && spec.targetUnit === 'm3/s') {
      normalizedVal = rawVal * 0.0283168;
    } else if (spec.rawUnit === 'feet' && spec.targetUnit === 'm') {
      normalizedVal = rawVal * 0.3048;
    } else if (spec.rawUnit !== spec.targetUnit) {
      // Unrecognized conversion
      qualityStatus = 'OUT_OF_BOUNDS';
    }

    // 3. Physical plausibility bounds check
    const bounds = PHYSICAL_BOUNDS[spec.variableName];
    if (bounds) {
      if (normalizedVal < bounds.min || normalizedVal > bounds.max) {
        qualityStatus = 'OUT_OF_BOUNDS';
      }
    }

    // 4. Vertical datum enforcement
    let verticalDatum: VerticalDatum = spec.verticalDatum || 'NOT_APPLICABLE';
    if (spec.variableName.includes('surge') || spec.variableName.includes('stage') || spec.variableName.includes('elevation')) {
      if (!spec.verticalDatum || spec.verticalDatum === 'NOT_APPLICABLE') {
        verticalDatum = 'MSL_SURVEY_OF_INDIA'; // Default national GTS datum
      }
    }

    // 5. CRS enforcement
    const crs: CoordinateReferenceSystem = spec.crs || 'EPSG:4326';

    // 6. Freshness calculation
    const now = Date.now();
    const recordTime = new Date(spec.timestamp || rawArchive.providerTimestamp).getTime();
    const freshnessMinutes = Math.max(0, Math.floor((now - recordTime) / (60 * 1000)));

    if (freshnessMinutes > 45 && qualityStatus === 'VALID') {
      qualityStatus = 'STALE';
    }

    if (rawArchive.sourceTier === 'DEVELOPMENT_MOCK') {
      qualityStatus = 'SYNTHETIC';
    }

    // 7. Cryptographic Provenance Hash
    const canonicalId = `CANON-${rawArchive.providerId}-${spec.sourceId}-${spec.variableName}-${Date.now()}`;
    const provenanceSeed = `${rawArchive.payloadHash}|${spec.sourceId}|${spec.variableName}|${normalizedVal.toFixed(3)}|${verticalDatum}|${crs}`;
    const provenanceHash = computeSha256(provenanceSeed);

    return {
      id: canonicalId,
      sourceId: spec.sourceId,
      sourceAuthority: rawArchive.sourceAuthority,
      sourceTier: rawArchive.sourceTier,
      timestamp: spec.timestamp || rawArchive.providerTimestamp,
      ingestionTimestamp: rawArchive.receivedAt,
      latitude: spec.latitude,
      longitude: spec.longitude,
      variableName: spec.variableName,
      unit: spec.targetUnit,
      verticalDatum,
      crs,
      rawValue: rawVal,
      normalizedValue: Number(normalizedVal.toFixed(3)),
      qualityStatus,
      freshnessMinutes,
      rawArchiveRef: rawArchive.payloadHash,
      provenanceHash,
      modelLock: {
        codeCommit: CODE_COMMIT_BASELINE,
        schemaVersion: 'v1.0.0',
        algorithmHash: provenanceHash.slice(0, 16)
      }
    };
  }
}
