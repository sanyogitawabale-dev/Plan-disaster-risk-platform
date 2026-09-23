/**
 * GeoShield India v1.0 — Registry Provider & Context
 * Central React Context Provider providing reactive access to:
 * - 20-row Subsystems Validation Matrix
 * - 14-body Authority Registry
 * - 12 Schedule 8 Language Profiles (NDMA SACHET)
 * - 8 Hazard Engine Plugins
 * - Interactive Operational Certifier
 * - Real-time Validation Validator & System Self-Audit Suite
 * - Formal JSON Schemas & Entity Specifications
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  GEOSHIELD_INDIA_VALIDATION_MATRIX,
  ValidationMatrixRow,
  AuditVerificationStatus,
  INDIA_SACHET_LANGUAGE_REGISTRY,
  LanguageRegistryEntry,
  CEA_SAFETY_REGULATION_FAMILY,
  CEARegulationFamily
} from '../config/geoShieldIndiaValidationRegistry';
import {
  INDIA_AUTHORITY_REGISTRY,
  AuthorityRegistryEntry,
  ValidationStatus
} from '../config/indiaAuthorityRegistry';
import {
  HAZARD_PLUGIN_REGISTRY,
  HazardConfigPlugin
} from '../config/hazardPluginRegistry';
import {
  VALIDATION_MATRIX_ROW_SCHEMA,
  AUTHORITY_REGISTRY_ENTRY_SCHEMA,
  LANGUAGE_REGISTRY_ENTRY_SCHEMA,
  HAZARD_PLUGIN_SCHEMA,
  CERTIFICATION_REQUEST_SCHEMA,
  getRegistryJsonSchema,
  EntitySchemaDefinition
} from '../schemas/registrySchema';
import {
  validateArbitraryPayload,
  runSystemSelfAudit,
  ValidationReport,
  FullSystemAuditReport
} from '../services/validationValidator';
import {
  runGeoShieldAdversarialSuite,
  AdversarialSuiteResult
} from '../services/adversarialTestSuite';
import {
  getValidationRegistryStats,
  queryValidationMatrix,
  certifyOperationalComponent,
  generateStatutoryDossierMarkdown,
  ValidationRegistryStats,
  ComponentCertificationRequest,
  ComponentCertificationResult
} from '../services/validationRegistryService';

export interface RegistryFilterOptions {
  searchQuery: string;
  category: string;
  status: string;
}

export interface RegistryContextType {
  // Core Registry Data Collections
  matrixRows: ValidationMatrixRow[];
  authorities: AuthorityRegistryEntry[];
  languages: LanguageRegistryEntry[];
  hazardPlugins: HazardConfigPlugin[];
  ceaRegulations: CEARegulationFamily;

  // Real-time Metrics & Stats
  stats: ValidationRegistryStats;
  isAuditing: boolean;
  activeAuditReport: FullSystemAuditReport | null;

  // Schemas & Specifications
  schemas: {
    matrixRow: EntitySchemaDefinition;
    authorityEntry: EntitySchemaDefinition;
    languageEntry: EntitySchemaDefinition;
    hazardPlugin: EntitySchemaDefinition;
    certificationRequest: EntitySchemaDefinition;
    masterJsonSchema: Record<string, any>;
  };

  // Operational Certifications
  activeCertificate: ComponentCertificationResult | null;
  certifyComponent: (request: ComponentCertificationRequest) => ComponentCertificationResult;
  clearCertificate: () => void;

  // Payload Validation Engine
  validatePayload: (payload: any, schemaType?: string) => ValidationReport;
  lastValidationReport: ValidationReport | null;

  // Audit & Red-Team Actions
  triggerSelfAudit: () => Promise<FullSystemAuditReport>;
  adversarialSuiteResult: AdversarialSuiteResult | null;
  isRunningAdversarialSuite: boolean;
  triggerAdversarialSuite: () => Promise<AdversarialSuiteResult>;

  // Filter & Search Utilities
  filterOptions: RegistryFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<RegistryFilterOptions>>;
  filteredMatrixRows: ValidationMatrixRow[];
  filteredAuthorities: AuthorityRegistryEntry[];

  // Export Utilities
  exportDossierMarkdown: (format?: 'markdown' | 'json') => string;
  downloadDossier: (filename?: string) => void;
  downloadJsonSchema: () => void;
}

const RegistryContext = createContext<RegistryContextType | undefined>(undefined);

export interface RegistryProviderProps {
  children: React.ReactNode;
  initialFilter?: Partial<RegistryFilterOptions>;
}

export const RegistryProvider: React.FC<RegistryProviderProps> = ({
  children,
  initialFilter
}) => {
  // Filter state for matrix and authority search
  const [filterOptions, setFilterOptions] = useState<RegistryFilterOptions>({
    searchQuery: initialFilter?.searchQuery || '',
    category: initialFilter?.category || 'ALL',
    status: initialFilter?.status || 'ALL'
  });

  // Self Audit State
  const [activeAuditReport, setActiveAuditReport] = useState<FullSystemAuditReport | null>(() => runSystemSelfAudit());
  const [isAuditing, setIsAuditing] = useState(false);

  // Adversarial Red-Team State
  const [adversarialSuiteResult, setAdversarialSuiteResult] = useState<AdversarialSuiteResult | null>(() => runGeoShieldAdversarialSuite());
  const [isRunningAdversarialSuite, setIsRunningAdversarialSuite] = useState(false);

  // Operational Certification State
  const [activeCertificate, setActiveCertificate] = useState<ComponentCertificationResult | null>(null);

  // Live Payload Validation State
  const [lastValidationReport, setLastValidationReport] = useState<ValidationReport | null>(null);

  // Registry Statistics
  const stats = useMemo(() => getValidationRegistryStats(), [activeAuditReport]);

  // Schema bundle
  const schemas = useMemo(
    () => ({
      matrixRow: VALIDATION_MATRIX_ROW_SCHEMA,
      authorityEntry: AUTHORITY_REGISTRY_ENTRY_SCHEMA,
      languageEntry: LANGUAGE_REGISTRY_ENTRY_SCHEMA,
      hazardPlugin: HAZARD_PLUGIN_SCHEMA,
      certificationRequest: CERTIFICATION_REQUEST_SCHEMA,
      masterJsonSchema: getRegistryJsonSchema()
    }),
    []
  );

  // Filtered rows memo
  const filteredMatrixRows = useMemo(() => {
    return queryValidationMatrix(
      filterOptions.searchQuery,
      filterOptions.category,
      filterOptions.status
    );
  }, [filterOptions]);

  // Filtered authorities memo
  const filteredAuthorities = useMemo(() => {
    return INDIA_AUTHORITY_REGISTRY.filter((auth) => {
      const q = filterOptions.searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        auth.authority.toLowerCase().includes(q) ||
        auth.standardOrDataset.toLowerCase().includes(q) ||
        auth.departmentOrDivision.toLowerCase().includes(q) ||
        auth.category.toLowerCase().includes(q);

      const matchesCategory =
        filterOptions.category === 'ALL' ||
        auth.category.toLowerCase() === filterOptions.category.toLowerCase();

      const matchesStatus =
        filterOptions.status === 'ALL' || auth.validationStatus === filterOptions.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [filterOptions]);

  // Certify operational component callback
  const certifyComponent = useCallback(
    (request: ComponentCertificationRequest): ComponentCertificationResult => {
      const result = certifyOperationalComponent(request);
      setActiveCertificate(result);
      return result;
    },
    []
  );

  const clearCertificate = useCallback(() => {
    setActiveCertificate(null);
  }, []);

  // Validate arbitrary payload callback
  const validatePayload = useCallback(
    (payload: any, schemaType?: string): ValidationReport => {
      const report = validateArbitraryPayload(payload, schemaType);
      setLastValidationReport(report);
      return report;
    },
    []
  );

  // Trigger real-time self audit
  const triggerSelfAudit = useCallback(async (): Promise<FullSystemAuditReport> => {
    setIsAuditing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = runSystemSelfAudit();
        setActiveAuditReport(report);
        setIsAuditing(false);
        resolve(report);
      }, 250);
    });
  }, []);

  // Trigger adversarial red-team verification suite
  const triggerAdversarialSuite = useCallback(async (): Promise<AdversarialSuiteResult> => {
    setIsRunningAdversarialSuite(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = runGeoShieldAdversarialSuite();
        setAdversarialSuiteResult(result);
        setIsRunningAdversarialSuite(false);
        resolve(result);
      }, 350);
    });
  }, []);

  // Export statutory dossier markdown
  const exportDossierMarkdown = useCallback((format: 'markdown' | 'json' = 'markdown'): string => {
    if (format === 'json') {
      return JSON.stringify(
        {
          registry: 'GeoShield India v1.0 Statutory Validation Registry',
          stats: getValidationRegistryStats(),
          matrix: GEOSHIELD_INDIA_VALIDATION_MATRIX,
          authorities: INDIA_AUTHORITY_REGISTRY,
          languages: INDIA_SACHET_LANGUAGE_REGISTRY,
          ceaSafetyRegulation: CEA_SAFETY_REGULATION_FAMILY,
          hazardPlugins: HAZARD_PLUGIN_REGISTRY,
          exportedAt: new Date().toISOString()
        },
        null,
        2
      );
    }
    return generateStatutoryDossierMarkdown();
  }, []);

  // Download Dossier
  const downloadDossier = useCallback(
    (filename: string = 'GeoShield_India_v1.0_Statutory_Validation_Dossier.md') => {
      const markdown = generateStatutoryDossierMarkdown();
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    []
  );

  // Download JSON Schema
  const downloadJsonSchema = useCallback(() => {
    const jsonSchema = getRegistryJsonSchema();
    const blob = new Blob([JSON.stringify(jsonSchema, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GeoShield_India_Validation_Registry_Schema.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const contextValue: RegistryContextType = {
    matrixRows: GEOSHIELD_INDIA_VALIDATION_MATRIX,
    authorities: INDIA_AUTHORITY_REGISTRY,
    languages: INDIA_SACHET_LANGUAGE_REGISTRY,
    hazardPlugins: HAZARD_PLUGIN_REGISTRY,
    ceaRegulations: CEA_SAFETY_REGULATION_FAMILY,
    stats,
    isAuditing,
    activeAuditReport,
    schemas,
    activeCertificate,
    certifyComponent,
    clearCertificate,
    validatePayload,
    lastValidationReport,
    triggerSelfAudit,
    adversarialSuiteResult,
    isRunningAdversarialSuite,
    triggerAdversarialSuite,
    filterOptions,
    setFilterOptions,
    filteredMatrixRows,
    filteredAuthorities,
    exportDossierMarkdown,
    downloadDossier,
    downloadJsonSchema
  };

  return (
    <RegistryContext.Provider value={contextValue}>
      {children}
    </RegistryContext.Provider>
  );
};

/**
 * Custom hook to consume the Registry Context.
 * Throws a helpful error if used outside a <RegistryProvider>.
 */
export function useRegistry(): RegistryContextType {
  const context = useContext(RegistryContext);
  if (!context) {
    throw new Error('useRegistry must be used within a <RegistryProvider>.');
  }
  return context;
}
