export type UUID = string;

export type TagColor = 'red' | 'blue' | 'yellow' | 'green';

export interface ConstructionAnnotation {
  color: TagColor | null;
  ve: boolean;
  ut: boolean;
  comment: string;
}

export interface ConstructionAdditionalItem extends ConstructionAnnotation {
  label: string;
  value: string;
}

export interface ConstructionAnnotations {
  standard: Record<string, ConstructionAnnotation>;
  additional: ConstructionAdditionalItem[];
}

export interface Tank {
  tank_unique_id: UUID;
  tank_name: string;
  owner: string;
  facility_type: string;
  city: string;
  state: string;
  year_built: number | null;
  design_standard: string;
  manufacturer: string | null;
  product_stored: string;
  inspection_type: string;
  client_name: string;
  exact_address: string;
  po_number: string;
  inspection_date: string | null;
  construction_date: string | null;
  external_inspection_date: string | null;
  internal_inspection_date: string | null;
  ut_inspection_date: string | null;
  next_inspection_due_date: string | null;
  nameplate_present: boolean;
  diameter_ft: number | null;
  height_ft: number | null;
  capacity_bbl: number | null;
  operating_height_ft: number | null;
  foundation: string;
  anchors: string;
  shell_weld_type: string;
  shell_number_of_courses: number | null;
  insulation: string | null;
  shell_manway: string;
  drain: string | null;
  level_gauge_type: string | null;
  access_structure: string;
  bottom_type: string;
  bottom_weld: string | null;
  annular_plate: string | null;
  fixed_roof_type: string | null;
  floating_roof_type: string | null;
  primary_seal: string | null;
  secondary_seal: string | null;
  anti_rotation_device: string | null;
  vent_type_and_number: string | null;
  emergency_venting_type: string | null;
  roof_manway_or_hatch: string | null;
  inlet_size_in: number | null;
  outlet_size_in: number | null;
  flow_rate_in_bph: number | null;
  flow_rate_out_bph: number | null;
  pressure: string | null;
  temperature: string | null;
  secondary_containment_type: string;
  construction_annotations: ConstructionAnnotations;
  created_at: string;
  updated_at: string;
}

export type TankPayload = Omit<Tank, 'tank_unique_id' | 'created_at' | 'updated_at'>;

export interface ShellSettlementReading {
  station_label: string;
  measurement_in: number;
}

export interface ShellSettlementSurvey {
  id: number;
  tank: UUID;
  station_count: number;
  readings: ShellSettlementReading[];
  created_at: string;
  updated_at: string;
}

export type UTCategory = 'bottom' | 'appurtenance' | 'roof' | 'shell';

export interface UTResult {
  id: number;
  tank: UUID;
  category: UTCategory;
  location: string;
  course: number | null;
  thickness_in: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EdgeSettlementCheck {
  id: number;
  tank: UUID;
  present: boolean;
  result: string | null;
  created_at: string;
  updated_at: string;
}

export interface ColumnPlumbnessCheck {
  id: number;
  tank: UUID;
  column_id: string;
  plumbness_in_per_ft: number;
  direction: string | null;
  created_at: string;
  updated_at: string;
}

export type CommentType = 'perform' | 'consider' | 'monitor';

export interface VisualFinding {
  id: number;
  tank: UUID;
  area: string;
  finding: string;
  comment_type: CommentType;
  created_at: string;
  updated_at: string;
}

export interface OtherNDE {
  id: number;
  tank: UUID;
  nde_type: string;
  result: string;
  created_at: string;
  updated_at: string;
}

export type GoalKey =
  | 'goal_1'
  | 'goal_2'
  | 'goal_3'
  | 'goal_4'
  | 'goal_5'
  | 'goal_6'
  | 'goal_7'
  | 'goal_8';

export interface GoalResult {
  id: number;
  tank: UUID;
  goal_key: GoalKey;
  goal_key_display: string;
  methods: string[];
  standard_responses: Record<string, unknown>;
  custom_responses: Array<{ prompt: string; answer: string; template_id?: number }>;
  created_at: string;
  updated_at: string;
}

export interface GoalQuestionTemplate {
  id: number;
  goal_key: GoalKey;
  prompt: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface MetadataResponse {
  methods: string[];
  goals: { key: GoalKey; label: string }[];
  tank_choices: {
    facility_type: [string, string][];
    foundation: [string, string][];
    access_structure: [string, string][];
    comment_types: [string, string][];
    visual_areas: [string, string][];
    ut_categories: [string, string][];
  };
}

export interface TankDetail extends Tank {
  shell_settlement_surveys: ShellSettlementSurvey[];
  ut_results: UTResult[];
  edge_settlement_checks: EdgeSettlementCheck[];
  column_plumbness_checks: ColumnPlumbnessCheck[];
  visual_findings: VisualFinding[];
  other_nde: OtherNDE[];
  goal_results: GoalResult[];
}
