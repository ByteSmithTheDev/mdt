export type IncidentType = 'bank' | 'jewelry' | 'store' | 'drugs' | 'seizure' | 'stockade' | 'code5' | 'codered' | 'shootout' | 'civilian' | 'cadet';
export type Theme = 'light' | 'dark';

export interface Officer {
  callSign: string;
  name: string;
}

export interface CadetDetails {
  trainingOfficer: string;
  cadetName: string;
  phase: number;
  activities: string[];
  notes: string;
  overallPerformance: string;
}

export interface Vehicle {
  name: string;
}

export interface SceneAssignment {
  reportingOfficer: string;
  sceneCommand: string;
  negotiator: string;
  stayedBackForHostage: string;
  mdtCreatedBy: string;
}

export interface PursuitDetails {
  primary: string;
  secondary: string;
  tertiary: string;
  parallel: string;
  fifthUnit: string;
  airOne: string;
  showExtra: boolean;
  escaped: boolean;
}

export interface RobberyDetails {
  location: string;
  robbersInside: number;
  robbersOutside: number;
  hostages: number;
  demands: string;
  incidentNumber: string;
  dateTime: string;
  truckingCompany: string;
  valuables: string;
}

export interface DrugDetails {
  location: string;
  suspects: number;
}

export interface VehicleDetails {
  model: string;
  color: string;
  plate: string;
  registeredTo: string;
  seizeReason: string;
  seizeDuration: string;
  escaped: boolean;
  cid?: string;
}

export interface Code5Details {
  location: string;
  speed: number;
  reason: string;
}

export interface CodeRedDetails {
  location: string;
  gang1Color: string;
  gang2Color: string;
  weapons: Array<{ name: string; serial: string }>;
  medicalAttention: boolean;
  processedAt: string;
  charges: string[];
}

export interface ShootoutDetails {
  totalSuspects: number;
  suspectsDowned: number;
  officersDowned: number;
  injuredSuspects: number;
  injuredOfficers: number;
  attemptedFlee: boolean;
  processedAt: string;
  weapons: Array<{ name: string; serial: string }>;
  location: string;
  originatedFrom: string;
}

export interface CivilianDetails {
  name: string;
  phoneNumber: string;
  reportType: string;
  description: string;
}

export interface CADReportDetails {
  incidentType: string;
  location: string;
  description: string;
  reportingOfficer: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export interface LeaderboardEntry {
  id: number;
  officer_name: string;
  mdt_count: number;
  last_created: string;
}
