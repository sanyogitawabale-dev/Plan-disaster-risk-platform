/**
 * GeoShield India v1.0 — Metrological Unit & Physical Dimension Schema
 *
 * Enforces that no bare number enters a life-safety calculation:
 * - value
 * - unit
 * - reference_datum
 * - reference_elevation
 * - timestamp
 * - source
 * - quality_flag
 */

export type LengthUnit = 'm' | 'cm' | 'mm' | 'km';
export type VelocityUnit = 'm/s' | 'km/h' | 'knots';
export type DischargeUnit = 'm3/s' | 'cusecs';
export type VerticalDatum =
  | 'MSL_SURVEY_OF_INDIA'        // Survey of India Mean Sea Level datum
  | 'FINISHED_FLOOR_PLINTH'      // Local asset finished floor level / plinth
  | 'CWC_ZERO_GAUGE'             // Central Water Commission local gauge datum
  | '100_YR_HIGH_FLOOD_LEVEL'    // CEA Reg 44(3A) 100-yr HFL reference
  | 'WGS84_ELLIPSOID';           // Satellite GPS ellipsoidal height

export interface MetrologicalQuantity<TUnit extends string = string> {
  value: number;
  unit: TUnit;
  referenceDatum?: VerticalDatum | string;
  referenceElevationMeters?: number;
  timestamp: string; // ISO-8601
  source: string;
  crs?: 'EPSG:4326' | 'EPSG:32645' | 'EPSG:3857';
  qualityFlag: 'VERIFIED' | 'ESTIMATED' | 'UNCALIBRATED' | 'DEGRADED';
}

export interface WaterDepthQuantity extends MetrologicalQuantity<LengthUnit> {
  referenceDatum: VerticalDatum;
  referenceElevationMeters: number; // Elevation of reference surface relative to MSL
}

export interface WindSpeedQuantity extends MetrologicalQuantity<VelocityUnit> {
  gustValue?: number;
  averagingPeriodMinutes: 3 | 10; // IMD standard: 3-min sustained; WMO: 10-min
}

export interface CulvertOvertoppingRatio extends MetrologicalQuantity<'ratio'> {
  freeboardMeters: number;
  designDischargeCusecs: number;
}

export interface MetrologicalValidationResult {
  isValid: boolean;
  sanitizedValue?: number; // In canonical SI units (e.g. meters)
  errors: string[];
  warnings: string[];
  failClosedAction?: string;
}

/**
 * Validates a life-safety water depth quantity according to CEA and CWC standards.
 * Fails closed if bare numbers, missing units, unknown datums, or invalid timestamps are detected.
 */
export function validateWaterDepthQuantity(input: any): MetrologicalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (input === null || input === undefined) {
    return {
      isValid: false,
      errors: ['CRITICAL: Water depth payload is null or undefined.'],
      warnings: [],
      failClosedAction: 'BLOCK_CALCULATION'
    };
  }

  // Bare number check
  if (typeof input === 'number') {
    return {
      isValid: false,
      errors: [
        'CRITICAL METROLOGY VIOLATION: Bare number passed to life-safety flood calculation. ' +
        'Explicit unit, vertical datum, and timestamp are legally mandated by CEA Reg 44(3A).'
      ],
      warnings: [],
      failClosedAction: 'BLOCK_CALCULATION'
    };
  }

  // Value checks
  if (typeof input.value !== 'number' || isNaN(input.value)) {
    errors.push('Water depth value must be a valid finite number (NaN or non-numeric rejected).');
  } else if (input.value < 0) {
    errors.push(`Physical boundary breach: Water depth cannot be negative (${input.value}).`);
  }

  // Unit checks
  const recognizedUnits: LengthUnit[] = ['m', 'cm', 'mm', 'km'];
  if (!input.unit || !recognizedUnits.includes(input.unit)) {
    errors.push(`Unit missing or unapproved. Allowed units: [${recognizedUnits.join(', ')}]. Received: "${input.unit}".`);
  }

  // Vertical Datum checks
  const recognizedDatums: VerticalDatum[] = [
    'MSL_SURVEY_OF_INDIA',
    'FINISHED_FLOOR_PLINTH',
    'CWC_ZERO_GAUGE',
    '100_YR_HIGH_FLOOD_LEVEL',
    'WGS84_ELLIPSOID'
  ];
  if (!input.referenceDatum || !recognizedDatums.includes(input.referenceDatum)) {
    errors.push(
      `Vertical datum missing or unapproved. Life-safety calculations require legal datum [${recognizedDatums.join(', ')}]. Received: "${input.referenceDatum}".`
    );
  }

  // Reference elevation checks
  if (typeof input.referenceElevationMeters !== 'number' || isNaN(input.referenceElevationMeters)) {
    errors.push('referenceElevationMeters must be specified relative to Survey of India MSL.');
  }

  // Timestamp checks
  if (!input.timestamp || isNaN(Date.parse(input.timestamp))) {
    errors.push(`Timestamp missing or invalid ISO-8601 string. Received: "${input.timestamp}".`);
  }

  // Source provenance
  if (!input.source || typeof input.source !== 'string' || input.source.trim().length === 0) {
    errors.push('Source authority/telemetry stream identifier is required for legal auditability.');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
      failClosedAction: 'BLOCK_CALCULATION'
    };
  }

  // Convert to canonical meters
  let sanitizedValue = input.value;
  if (input.unit === 'cm') sanitizedValue = input.value / 100;
  else if (input.unit === 'mm') sanitizedValue = input.value / 1000;
  else if (input.unit === 'km') sanitizedValue = input.value * 1000;

  return {
    isValid: true,
    sanitizedValue,
    errors: [],
    warnings
  };
}
