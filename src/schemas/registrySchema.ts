/**
 * GeoShield India v1.0 — Statutory Registry & Validation Schemas
 * Comprehensive schema definitions, entity specifications, validation rules,
 * field constraints, and JSON Schema generation for the entire disaster-risk registry.
 */

export type SchemaDataType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

export interface SchemaFieldDefinition {
  name: string;
  type: SchemaDataType;
  description: string;
  required: boolean;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  itemType?: SchemaDataType;
  statutoryReference?: string;
  example?: any;
  defaultValue?: any;
}

export interface EntitySchemaDefinition {
  entityName: string;
  version: string;
  description: string;
  statutoryMandate: string;
  fields: Record<string, SchemaFieldDefinition>;
}

// -------------------------------------------------------------
// 1. Validation Matrix Row Schema (20 Subsystems)
// -------------------------------------------------------------
export const VALIDATION_MATRIX_ROW_SCHEMA: EntitySchemaDefinition = {
  entityName: 'ValidationMatrixRow',
  version: '1.0.0',
  description: 'Statutory verification row mapping operational models to Indian authorities and standards.',
  statutoryMandate: 'Disaster Management Act, 2005 (DMA 2005) & BIS National Building Code Part 6',
  fields: {
    rowId: {
      name: 'rowId',
      type: 'integer',
      description: 'Sequential identification number for the operational component (1-20).',
      required: true,
      minimum: 1,
      maximum: 20,
      example: 13
    },
    category: {
      name: 'category',
      type: 'string',
      description: 'Operational subsystem category.',
      required: true,
      enum: [
        'METEOROLOGY',
        'OCEAN_SURGE',
        'RIVERINE_HYDROLOGY',
        'EARTH_OBSERVATION',
        'ELECTRICAL_LIFELINES',
        'TRANSPORT_LIFELINES',
        'DISASTER_ALERTING',
        'EVACUATION_GOVERNANCE',
        'AI_INFERENCE'
      ],
      example: 'ELECTRICAL_LIFELINES'
    },
    component: {
      name: 'component',
      type: 'string',
      description: 'Descriptive title of the operational component or subsystem.',
      required: true,
      minLength: 5,
      maxLength: 150,
      example: 'Substation Flood De-energization Gate'
    },
    officialAuthority: {
      name: 'officialAuthority',
      type: 'string',
      description: 'Statutory agency with primary regulatory jurisdiction in India.',
      required: true,
      minLength: 3,
      maxLength: 120,
      example: 'Central Electricity Authority (CEA) / OPTCL'
    },
    officialDatasetOrApi: {
      name: 'officialDatasetOrApi',
      type: 'string',
      description: 'Designated authoritative dataset, sensor stream, or API feed.',
      required: true,
      minLength: 3,
      example: 'CEA Gazette Notification / SCADA 220kV Bus Telemetry'
    },
    statutoryStandard: {
      name: 'statutoryStandard',
      type: 'string',
      description: 'Governing statutory regulation, BIS standard, or code of practice.',
      required: true,
      minLength: 5,
      statutoryReference: 'CEA Safety Regulations 2023 Reg 44(3A); IS 1646:2015',
      example: 'CEA (Measures Relating to Safety and Electric Supply) Regulations 2023, Reg 44(3A)'
    },
    governingModelOrEngine: {
      name: 'governingModelOrEngine',
      type: 'string',
      description: 'Primary computational model, algorithm, or physics engine.',
      required: true,
      example: 'Hydrodynamic Head vs. Transformer Base Plinth Threshold Engine'
    },
    primaryInputs: {
      name: 'primaryInputs',
      type: 'array',
      description: 'Array of input parameters consumed by the component.',
      required: true,
      example: ['Inundation Depth', 'Substation Plinth Elevation', '100-yr HFL']
    },
    primaryOutputs: {
      name: 'primaryOutputs',
      type: 'array',
      description: 'Array of analytical or operational outputs produced.',
      required: true,
      example: ['Circuit Breaker Trip Advisory', 'Section 30 DMA Notification']
    },
    spatialResolution: {
      name: 'spatialResolution',
      type: 'string',
      description: 'Spatial granularity of the model or observation.',
      required: true,
      example: 'Asset-level (0.5m GPS survey)'
    },
    temporalCadence: {
      name: 'temporalCadence',
      type: 'string',
      description: 'Frequency of data ingestion or recalculation.',
      required: true,
      example: 'Real-time (1-min SCADA / 15-min gauge)'
    },
    currentEffectiveVersion: {
      name: 'currentEffectiveVersion',
      type: 'string',
      description: 'Active effective version of the standard or model.',
      required: true,
      example: '2023 Edition with 2026 Amendment'
    },
    officialSourceUrl: {
      name: 'officialSourceUrl',
      type: 'string',
      description: 'URL to the official ministry/gazette documentation.',
      required: true,
      pattern: '^https?://',
      example: 'https://cea.nic.in/regulations'
    },
    fallbackSource: {
      name: 'fallbackSource',
      type: 'string',
      description: 'Designated secondary fallback when primary feed is degraded.',
      required: true,
      minLength: 5,
      example: 'Manual RTU Telemetry & Local Substation Operator Log'
    },
    validationMethodology: {
      name: 'validationMethodology',
      type: 'string',
      description: 'Empirical or analytical verification procedure.',
      required: true,
      example: 'Cyclone Fani (2019) Puri grid restoration telemetry cross-check'
    },
    historicalTestEvent: {
      name: 'historicalTestEvent',
      type: 'string',
      description: 'Historical disaster benchmark event used for verification.',
      required: true,
      example: 'Cyclone Fani (2019)'
    },
    dominantUncertainty: {
      name: 'dominantUncertainty',
      type: 'string',
      description: 'Primary physical or mathematical uncertainty parameter.',
      required: true,
      example: 'Local plinth micro-topography & drainage pump failure'
    },
    failureCondition: {
      name: 'failureCondition',
      type: 'string',
      description: 'Exact physical or operational failure threshold.',
      required: true,
      statutoryReference: 'Mandatory lockout at depth >= 0.30m',
      example: 'Submergence >= 0.30m without automated de-energization'
    },
    requiresHumanApproval: {
      name: 'requiresHumanApproval',
      type: 'boolean',
      description: 'Whether human statutory authorization is strictly required.',
      required: true,
      example: true
    },
    status: {
      name: 'status',
      type: 'string',
      description: 'Audit verification status in GeoShield registry.',
      required: true,
      enum: ['VERIFIED', 'NEEDS_VALIDATION', 'INCORRECT', 'NOT_APPLICABLE'],
      example: 'VERIFIED'
    },
    auditNotes: {
      name: 'auditNotes',
      type: 'string',
      description: 'Independent auditor and legal compliance notes.',
      required: false,
      example: 'Gazette notification verified by legal counsel.'
    }
  }
};

// -------------------------------------------------------------
// 2. Authority Registry Entry Schema (14 Statutory Bodies)
// -------------------------------------------------------------
export const AUTHORITY_REGISTRY_ENTRY_SCHEMA: EntitySchemaDefinition = {
  entityName: 'AuthorityRegistryEntry',
  version: '1.0.0',
  description: 'Statutory authority profile with data ingestion credentials, mandates, and provenance.',
  statutoryMandate: 'Disaster Management Act, 2005 & National Disaster Management Guidelines',
  fields: {
    id: {
      name: 'id',
      type: 'string',
      description: 'Unique authority identifier code.',
      required: true,
      pattern: '^[A-Z]{3,4}-[A-Z0-9]{3,8}-[0-9]{2}$',
      example: 'MET-IMD-01'
    },
    category: {
      name: 'category',
      type: 'string',
      description: 'Domain category of statutory authority.',
      required: true,
      enum: [
        'Meteorology',
        'Ocean / Storm Surge',
        'River / Flood',
        'Disaster Management',
        'Earth Observation',
        'Roads & Highways',
        'Structural & Civil',
        'Electrical Lifeline',
        'Emergency Communications'
      ],
      example: 'Meteorology'
    },
    authority: {
      name: 'authority',
      type: 'string',
      description: 'Official name of the statutory agency.',
      required: true,
      minLength: 3,
      example: 'IMD (India Meteorological Department)'
    },
    departmentOrDivision: {
      name: 'departmentOrDivision',
      type: 'string',
      description: 'Specific division or specialized center.',
      required: true,
      example: 'Cyclone Warning Division (RSMC New Delhi)'
    },
    standardOrDataset: {
      name: 'standardOrDataset',
      type: 'string',
      description: 'Title of the statutory dataset or standard.',
      required: true,
      example: 'Tropical Cyclone Advisory Bulletin (TCP) & 3-Hourly Best Track'
    },
    versionOrEdition: {
      name: 'versionOrEdition',
      type: 'string',
      description: 'Edition, version, or year of enforcement.',
      required: true,
      example: 'WMO TCP Report No. 8 (2024 Rev)'
    },
    purpose: {
      name: 'purpose',
      type: 'string',
      description: 'Statutory role and operational mandate.',
      required: true,
      example: 'Official cyclone track forecast, intensity classification, and landfall cone'
    },
    geographicScope: {
      name: 'geographicScope',
      type: 'string',
      description: 'Jurisdictional geographic coverage.',
      required: true,
      example: 'North Indian Ocean (Bay of Bengal & Arabian Sea)'
    },
    applicableHazard: {
      name: 'applicableHazard',
      type: 'string',
      description: 'Target natural hazard domain.',
      required: true,
      example: 'Tropical Cyclone, Severe Storm'
    },
    applicableAsset: {
      name: 'applicableAsset',
      type: 'string',
      description: 'Assets or sectors governed.',
      required: true,
      example: 'All coastal and inland infrastructure'
    },
    inputData: {
      name: 'inputData',
      type: 'array',
      description: 'Array of telemetry feeds consumed.',
      required: true,
      example: ['INSAT-3D/3DR Radiance', 'Doppler Weather Radar (DWR) Paradip']
    },
    output: {
      name: 'output',
      type: 'string',
      description: 'Format and structure of statutory output.',
      required: true,
      example: 'Track coordinates, wind radius (34kt/50kt/64kt), central pressure'
    },
    updateFrequency: {
      name: 'updateFrequency',
      type: 'string',
      description: 'Official dissemination cadence.',
      required: true,
      example: '3-hourly during storm; hourly prior to landfall'
    },
    officialSource: {
      name: 'officialSource',
      type: 'string',
      description: 'Governing ministry or constitutional parent body.',
      required: true,
      example: 'Ministry of Earth Sciences (MoES), Government of India'
    },
    officialApiOrPortal: {
      name: 'officialApiOrPortal',
      type: 'string',
      description: 'Official API endpoint or dissemination portal URL.',
      required: true,
      pattern: '^https?://',
      example: 'https://rsmcnewdelhi.imd.gov.in'
    },
    fallbackSource: {
      name: 'fallbackSource',
      type: 'string',
      description: 'Secondary fallback authority or model.',
      required: true,
      example: 'JTWC Pearl Harbor Bulletins & ECMWF Ensemble'
    },
    validationStatus: {
      name: 'validationStatus',
      type: 'string',
      description: 'Verification status.',
      required: true,
      enum: ['VERIFIED', 'NEEDS_VALIDATION', 'INCORRECT', 'NOT_APPLICABLE'],
      example: 'VERIFIED'
    },
    lastVerified: {
      name: 'lastVerified',
      type: 'string',
      description: 'Date of last formal verification (YYYY-MM-DD).',
      required: true,
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      example: '2026-03-15'
    },
    confidenceScore: {
      name: 'confidenceScore',
      type: 'number',
      description: 'Audited confidence score between 0.0 and 1.0.',
      required: true,
      minimum: 0.0,
      maximum: 1.0,
      example: 0.98
    },
    notes: {
      name: 'notes',
      type: 'string',
      description: 'Audit provenance and integration remarks.',
      required: true,
      example: 'Statutory sole authority for official cyclone naming and track forecasts in India.'
    }
  }
};

// -------------------------------------------------------------
// 3. SACHET Language Registry Entry Schema (12 Languages)
// -------------------------------------------------------------
export const LANGUAGE_REGISTRY_ENTRY_SCHEMA: EntitySchemaDefinition = {
  entityName: 'LanguageRegistryEntry',
  version: '1.0.0',
  description: 'Schedule 8 Eighth Schedule official language entry with CAP and SMS limits.',
  statutoryMandate: 'Constitution of India Eighth Schedule & TRAI Cell Broadcast Regulations',
  fields: {
    languageCode: {
      name: 'languageCode',
      type: 'string',
      description: 'ISO-639-1 language code.',
      required: true,
      enum: ['en', 'or', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'ml', 'kn', 'pa', 'as'],
      example: 'or'
    },
    languageName: {
      name: 'languageName',
      type: 'string',
      description: 'English name of the language.',
      required: true,
      example: 'Odia'
    },
    nativeName: {
      name: 'nativeName',
      type: 'string',
      description: 'Autonym / native script name.',
      required: true,
      example: 'ଓଡ଼ିଆ'
    },
    script: {
      name: 'script',
      type: 'string',
      description: 'Script name (Unicode block).',
      required: true,
      example: 'Odia'
    },
    officialInSchedule8: {
      name: 'officialInSchedule8',
      type: 'boolean',
      description: 'Whether listed in Eighth Schedule of the Constitution of India.',
      required: true,
      example: true
    },
    sachetSupported: {
      name: 'sachetSupported',
      type: 'boolean',
      description: 'Supported in NDMA SACHET Common Alerting Protocol platform.',
      required: true,
      example: true
    },
    smsTemplate160Char: {
      name: 'smsTemplate160Char',
      type: 'string',
      description: 'Pre-vetted emergency broadcast template within 160 GSM-7 / Unicode limits.',
      required: true,
      maxLength: 160,
      statutoryReference: 'TRAI Cell Broadcast Emergency Limit (160 characters)',
      example: 'ସତର୍କତା: ବାତ୍ୟା ଯୋଗୁଁ ତୁରନ୍ତ ନିକଟସ୍ଥ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ। ସହାୟତା ପାଇଁ ୧୦୭୦ ଡାଏଲ କରନ୍ତୁ।'
    },
    capTemplateOasis: {
      name: 'capTemplateOasis',
      type: 'string',
      description: 'OASIS CAP v1.2 compliant payload schema reference.',
      required: true,
      example: 'OASIS-CAP-v1.2-ODIA-CYCLONE'
    },
    ttsAvailable: {
      name: 'ttsAvailable',
      type: 'boolean',
      description: 'Whether Text-To-Speech voice synthesis engine is available.',
      required: true,
      example: true
    },
    primaryRegions: {
      name: 'primaryRegions',
      type: 'array',
      description: 'Primary States or Union Territories where spoken.',
      required: true,
      example: ['Odisha', 'Coastal Bay of Bengal']
    },
    validationStatus: {
      name: 'validationStatus',
      type: 'string',
      description: 'Linguistic verification status.',
      required: true,
      enum: ['VERIFIED', 'NEEDS_VALIDATION', 'INCORRECT', 'NOT_APPLICABLE'],
      example: 'VERIFIED'
    }
  }
};

// -------------------------------------------------------------
// 4. Hazard Plugin Registry Entry Schema
// -------------------------------------------------------------
export const HAZARD_PLUGIN_SCHEMA: EntitySchemaDefinition = {
  entityName: 'HazardConfigPlugin',
  version: '1.0.0',
  description: 'Domain-specific hazard engine plugin for multi-hazard cascading simulations.',
  statutoryMandate: 'NDMA Multi-Hazard Risk Assessment Guidelines 2020',
  fields: {
    id: {
      name: 'id',
      type: 'string',
      description: 'Plugin identifier code.',
      required: true,
      example: 'plugin_cyclone_surge_incois'
    },
    name: {
      name: 'name',
      type: 'string',
      description: 'Human-readable title of the hazard plugin.',
      required: true,
      example: 'INCOIS Coastal Storm Surge & Wave Runup Model'
    },
    hazardCategory: {
      name: 'hazardCategory',
      type: 'string',
      description: 'Hazard class.',
      required: true,
      enum: ['CYCLONE', 'FLOOD', 'SURGE', 'LANDSLIDE', 'HEATWAVE', 'TSUNAMI', 'EARTHQUAKE'],
      example: 'SURGE'
    },
    version: {
      name: 'version',
      type: 'string',
      description: 'Plugin build version.',
      required: true,
      example: 'v3.2.1'
    },
    statutoryAuthority: {
      name: 'statutoryAuthority',
      type: 'string',
      description: 'Authoritative body responsible for the plugin physics.',
      required: true,
      example: 'INCOIS / MoES'
    },
    enabledByDefault: {
      name: 'enabledByDefault',
      type: 'boolean',
      description: 'Whether enabled in baseline pipeline.',
      required: true,
      example: true
    },
    computationCadenceMs: {
      name: 'computationCadenceMs',
      type: 'integer',
      description: 'Refresh interval in milliseconds.',
      required: true,
      minimum: 100,
      maximum: 86400000,
      example: 300000
    }
  }
};

// -------------------------------------------------------------
// 5. Operational Certification Request Schema
// -------------------------------------------------------------
export const CERTIFICATION_REQUEST_SCHEMA: EntitySchemaDefinition = {
  entityName: 'ComponentCertificationRequest',
  version: '1.0.0',
  description: 'Operational parameters submitted for statutory compliance certification.',
  statutoryMandate: 'Section 30 & 34, Disaster Management Act 2005',
  fields: {
    componentId: {
      name: 'componentId',
      type: 'string',
      description: 'Target component code or identifier.',
      required: true,
      example: 'cea_substation_clearance'
    },
    assetName: {
      name: 'assetName',
      type: 'string',
      description: 'Name of the physical infrastructure asset.',
      required: false,
      example: 'OPTCL 220/132kV Substation Paradip'
    },
    assetType: {
      name: 'assetType',
      type: 'string',
      description: 'Infrastructure type classification.',
      required: false,
      enum: ['substation', 'hospital', 'bridge', 'shelter', 'water_plant', 'telecom'],
      example: 'substation'
    },
    operationalParameters: {
      name: 'operationalParameters',
      type: 'object',
      description: 'Real-time telemetry and engineering measurements.',
      required: true,
      example: {
        floodDepthMeters: 0.12,
        substationVoltageKv: 220,
        finishedFloorElevationMeters: 3.2,
        highFloodLevel100YrM: 2.8
      }
    }
  }
};

// -------------------------------------------------------------
// 6. Complete Machine-Readable JSON Schema (Draft-07 compliant)
// -------------------------------------------------------------
export function getRegistryJsonSchema(): Record<string, any> {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'GeoShieldIndiaValidationRegistrySchema',
    description: 'Master statutory validation schema for GeoShield India v1.0 disaster-risk intelligence.',
    type: 'object',
    required: ['version', 'compliancePercentage', 'validationMatrix', 'authorities'],
    properties: {
      registryTitle: {
        type: 'string',
        default: 'GeoShield India v1.0 Statutory Validation Registry'
      },
      version: {
        type: 'string',
        pattern: '^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9]+)?$',
        example: '1.0.0-PROD'
      },
      compliancePercentage: {
        type: 'number',
        minimum: 0,
        maximum: 100
      },
      totalComponents: {
        type: 'integer',
        minimum: 1
      },
      governingAct: {
        type: 'string',
        default: 'Disaster Management Act, 2005 (Act No. 53 of 2005)'
      },
      registryIntegrityHash: {
        type: 'string',
        pattern: '^0x[0-9a-fA-F]+$',
        description: 'Deterministic cryptographic hash verifying registry data integrity.'
      },
      validationMatrix: {
        type: 'array',
        description: 'Master array of operational subsystem validation rows.',
        items: {
          type: 'object',
          required: [
            'rowId',
            'category',
            'component',
            'officialAuthority',
            'statutoryStandard',
            'status',
            'fallbackSource',
            'failureCondition'
          ],
          properties: {
            rowId: { type: 'integer', minimum: 1, maximum: 20 },
            category: { type: 'string' },
            component: { type: 'string', minLength: 5 },
            officialAuthority: { type: 'string', minLength: 3 },
            statutoryStandard: { type: 'string', minLength: 5 },
            status: {
              type: 'string',
              enum: ['VERIFIED', 'NEEDS_VALIDATION', 'INCORRECT', 'NOT_APPLICABLE']
            },
            spatialResolution: { type: 'string' },
            temporalCadence: { type: 'string' },
            dominantUncertainty: { type: 'string' },
            failureCondition: { type: 'string' },
            fallbackSource: { type: 'string' },
            requiresHumanApproval: { type: 'boolean' }
          }
        }
      },
      authorities: {
        type: 'array',
        description: 'Statutory government authorities providing authoritative feeds.',
        items: {
          type: 'object',
          required: [
            'id',
            'category',
            'authority',
            'departmentOrDivision',
            'standardOrDataset',
            'validationStatus',
            'confidenceScore'
          ],
          properties: {
            id: { type: 'string' },
            category: { type: 'string' },
            authority: { type: 'string' },
            standardOrDataset: { type: 'string' },
            validationStatus: {
              type: 'string',
              enum: ['VERIFIED', 'NEEDS_VALIDATION', 'INCORRECT', 'NOT_APPLICABLE']
            },
            confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
            lastVerified: { type: 'string' }
          }
        }
      },
      languages: {
        type: 'array',
        description: 'Schedule 8 emergency alert languages.',
        items: {
          type: 'object',
          required: ['languageCode', 'languageName', 'smsTemplate160Char', 'capTemplateOasis'],
          properties: {
            languageCode: { type: 'string' },
            languageName: { type: 'string' },
            smsTemplate160Char: { type: 'string', maxLength: 160 },
            capTemplateOasis: { type: 'string' },
            sachetSupported: { type: 'boolean' }
          }
        }
      }
    }
  };
}
