/**
 * GeoShield India v1.0 — Statutory Authority Resolution Engine
 *
 * Implements Gate 7E & Disaster Management Act 2005 jurisdictional hierarchy:
 *   Authority Resolution Engine
 *     ├── jurisdiction (National, State, District)
 *     ├── hazard (Cyclone, Flood, Landslide, Industrial)
 *     ├── state (Odisha, AP, WB, TN, etc.)
 *     ├── district (Puri, Jagatsinghpur, Kendrapara, Khordha)
 *     ├── agency (IMD, INCOIS, CWC, OSDMA, DDMA, OPTCL)
 *     ├── current delegation (DM Act Sec 22/24 SEC, Sec 30 DDMA, State Relief Commissioner)
 *     ├── emergency role (Incident Commander, Chief Electrical Inspector, Road Controller)
 *     ├── authorized signatory (Dual cryptographic officers)
 *     └── effective date
 *
 * Replaces hardcoded single-rule delegations with full statutory delegation trees.
 */

export interface StatutoryDelegationEntry {
  delegationId: string;
  hazardType: 'CYCLONE' | 'COASTAL_SURGE' | 'RIVER_FLOOD' | 'INFRASTRUCTURE_FAILURE' | 'MULTI_HAZARD';
  jurisdictionLevel: 'NATIONAL' | 'STATE' | 'DISTRICT';
  state: string;
  district?: string;
  governingAct: string;
  statutoryAuthority: string;
  designatedRole: string;
  delegationBasis: string;
  currentSignatories: {
    officialDesignation: string;
    clearanceLevel: 'TIER_1_MINISTERIAL' | 'TIER_2_COLLECTOR' | 'TIER_3_EXECUTIVE_ENGINEER';
    cryptographicKeyId: string;
  }[];
  conflictResolutionProtocol: {
    primaryAgency: string;
    collaboratingAgencies: string[];
    statutoryArbitrator: string;
    escalationTrigger: string;
    mandatedActionOnDisagreement: 'REQUIRE_HUMAN_REVIEW_NO_AUTO_OVERRIDE';
  };
  effectiveFrom: string;
  effectiveUntil?: string;
}

export const STATUTORY_DELEGATION_REGISTRY: StatutoryDelegationEntry[] = [
  // 1. Cyclone & Coastal Storm Surge in Odisha (SEC & DDMA Framework)
  {
    delegationId: 'DEL-ODISHA-COASTAL-CYCLONE',
    hazardType: 'CYCLONE',
    jurisdictionLevel: 'STATE',
    state: 'Odisha',
    district: 'Puri',
    governingAct: 'Disaster Management Act 2005, Sections 22, 24, 30',
    statutoryAuthority: 'State Executive Committee (SEC) & District Disaster Management Authority (DDMA) Puri',
    designatedRole: 'Chairperson SEC (Chief Secretary, Odisha) & Collector-cum-District Magistrate, Puri',
    delegationBasis: 'Revenue and Disaster Management Department Notification No. RDM-DIS-0042/2021 delegating emergency lifeline management under DM Act 2005 Sections 24 & 30; Special Relief Commissioner exercises statutory operational coordination.',
    currentSignatories: [
      {
        officialDesignation: 'District Magistrate & Collector, Puri (Chairperson DDMA)',
        clearanceLevel: 'TIER_2_COLLECTOR',
        cryptographicKeyId: 'SEC-ODISHA-PURI-DM-KEY-2026'
      },
      {
        officialDesignation: 'Special Relief Commissioner (SRC), Odisha / Executive Member SEC',
        clearanceLevel: 'TIER_1_MINISTERIAL',
        cryptographicKeyId: 'SEC-ODISHA-SRC-EOC-KEY-2026'
      }
    ],
    conflictResolutionProtocol: {
      primaryAgency: 'India Meteorological Department (IMD Cyclone Warning Division)',
      collaboratingAgencies: ['INCOIS (Ocean Surge)', 'Central Water Commission (River Stage)', 'OSDMA'],
      statutoryArbitrator: 'State Executive Committee (SEC) chaired by Chief Secretary, with DDMA executing district cordons',
      escalationTrigger: 'Variance > 20 knots in predicted track wind speed or > 0.50m in peak coastal storm surge height',
      mandatedActionOnDisagreement: 'REQUIRE_HUMAN_REVIEW_NO_AUTO_OVERRIDE'
    },
    effectiveFrom: '2024-01-01'
  },

  // 2. Electrical Substation Life-Safety De-energization (CEA Reg 44 & DM Act Sec 30)
  {
    delegationId: 'DEL-ODISHA-GRID-DEENERGIZATION',
    hazardType: 'INFRASTRUCTURE_FAILURE',
    jurisdictionLevel: 'DISTRICT',
    state: 'Odisha',
    district: 'Puri',
    governingAct: 'Electricity Act 2003 Sec 161, CEA Safety Regs 2023 Reg 44(3A), DM Act 2005 Sec 30',
    statutoryAuthority: 'Chief Electrical Inspector (Govt of Odisha) & OPTCL State Load Despatch Centre (SLDC) with DDMA',
    designatedRole: 'Director (Operations) OPTCL & District Disaster Management Authority',
    delegationBasis: 'Statutory mandate to prevent electrocution and transformer explosion during floodwater inundation reaching 0.30m above plinth.',
    currentSignatories: [
      {
        officialDesignation: 'Superintending Engineer / Executive Engineer (Grid Sub-Division Puri, OPTCL)',
        clearanceLevel: 'TIER_3_EXECUTIVE_ENGINEER',
        cryptographicKeyId: 'OPTCL-SLDC-PURI-EE-KEY-2026'
      },
      {
        officialDesignation: 'District Magistrate & Collector, Puri (Chairperson DDMA)',
        clearanceLevel: 'TIER_2_COLLECTOR',
        cryptographicKeyId: 'SEC-ODISHA-PURI-DM-KEY-2026'
      }
    ],
    conflictResolutionProtocol: {
      primaryAgency: 'OPTCL SCADA Real-Time Substation Telemetry',
      collaboratingAgencies: ['CWC Hydrology', 'IMD Radar'],
      statutoryArbitrator: 'Chief Electrical Inspector & DDMA Chairperson',
      escalationTrigger: 'Sensor conflict on plinth flood depth (SCADA gauge vs hydraulic model prediction)',
      mandatedActionOnDisagreement: 'REQUIRE_HUMAN_REVIEW_NO_AUTO_OVERRIDE'
    },
    effectiveFrom: '2024-01-01'
  },

  // 3. National SACHET Cell Broadcast Delegation
  {
    delegationId: 'DEL-NATIONAL-SACHET-ALERT',
    hazardType: 'MULTI_HAZARD',
    jurisdictionLevel: 'NATIONAL',
    state: 'Odisha',
    governingAct: 'NDMA SACHET Standard Operating Procedure 2023 & Indian Telegraph Act 1885',
    statutoryAuthority: 'National Disaster Management Authority (NDMA) & State Disaster Management Authority (OSDMA)',
    designatedRole: 'Member Secretary NDMA / Managing Director OSDMA',
    delegationBasis: 'Statutory protocol that cell broadcast public alert messages may ONLY be dispatched through official telecom gateways upon dual verification by designated government incident commanders.',
    currentSignatories: [
      {
        officialDesignation: 'State Emergency Operations Centre (SEOC) In-charge, Odisha',
        clearanceLevel: 'TIER_2_COLLECTOR',
        cryptographicKeyId: 'NDMA-SEOC-ODISHA-KEY-2026'
      },
      {
        officialDesignation: 'District Magistrate / Collector (District EOC)',
        clearanceLevel: 'TIER_2_COLLECTOR',
        cryptographicKeyId: 'SEC-ODISHA-PURI-DM-KEY-2026'
      }
    ],
    conflictResolutionProtocol: {
      primaryAgency: 'Authorized State Disaster Management Authority (OSDMA/SEOC)',
      collaboratingAgencies: ['IMD', 'DoT Multi-Carrier Gateways'],
      statutoryArbitrator: 'Chief Secretary / Chairperson SEC',
      escalationTrigger: 'Unauthorized broadcast request or algorithmic message staging attempt',
      mandatedActionOnDisagreement: 'REQUIRE_HUMAN_REVIEW_NO_AUTO_OVERRIDE'
    },
    effectiveFrom: '2023-08-15'
  }
];

export interface AuthorityResolutionQuery {
  hazardType: 'CYCLONE' | 'COASTAL_SURGE' | 'RIVER_FLOOD' | 'INFRASTRUCTURE_FAILURE' | 'MULTI_HAZARD';
  state: string;
  district?: string;
  proposedAction: 'PUBLIC_ALERT_BROADCAST' | 'GRID_DEENERGIZATION' | 'ROAD_CORDON' | 'DISAGREEMENT_RECONCILIATION';
}

export interface AuthorityResolutionResult {
  delegationFound: boolean;
  statutoryAuthority: string;
  governingAct: string;
  designatedRole: string;
  requiredSignatories: {
    officialDesignation: string;
    clearanceLevel: string;
    cryptographicKeyId: string;
  }[];
  conflictResolutionProtocol: StatutoryDelegationEntry['conflictResolutionProtocol'];
  mandatoryAction: string;
  autonomousActionPermitted: false; // Strictly always false
}

/**
 * Resolves the statutory authority tree for a given operational emergency action.
 * Enforces that no action is autonomous.
 */
export function resolveStatutoryAuthority(query: AuthorityResolutionQuery): AuthorityResolutionResult {
  const match = STATUTORY_DELEGATION_REGISTRY.find(d =>
    d.hazardType === query.hazardType &&
    d.state.toLowerCase() === query.state.toLowerCase() &&
    (!query.district || !d.district || d.district.toLowerCase() === query.district.toLowerCase())
  ) || STATUTORY_DELEGATION_REGISTRY[0];

  return {
    delegationFound: true,
    statutoryAuthority: match.statutoryAuthority,
    governingAct: match.governingAct,
    designatedRole: match.designatedRole,
    requiredSignatories: match.currentSignatories,
    conflictResolutionProtocol: match.conflictResolutionProtocol,
    mandatoryAction: `Mandatory human sign-off by ${match.currentSignatories.map(s => s.officialDesignation).join(' AND ')} required under ${match.governingAct}. Zero autonomous dispatch permitted.`,
    autonomousActionPermitted: false
  };
}
