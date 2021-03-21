export interface Report {
  amount: number;
  approved_at: Date;
  claim_number: string;
  created_at: Date;
  creator_id: string;
  currency: string;
  exported: boolean;
  from_dt: Date;
  id: string;
  last_updated_by: any; // in DB the stored values are diffrent, and we are not using this value in any place in mobile app.
  location1: string;
  location2: string;
  location3: string;
  location4: string;
  location5: string;
  manual_flag: boolean;
  num_transactions: number;
  org_user_id: string;
  physical_bill: boolean;
  physical_bill_at: Date;
  policy_flag: boolean;
  purpose: string;
  reimbursed_at: Date;
  reimbursement_id: string;
  settlement_id: string;
  source: string;
  state: string;
  status_id: string;
  submitted_at: Date;
  tally_export_id: string;
  tax: number;
  to_dt: Date;
  trip_request_id: string;
  type: string;
  updated_at: Date;
  verification_state: string;
}

export interface ExtendedReport {
  rp: {
    amount: number;
    approvals: ReportApproval[];
    approved_at: Date;
    claim_number: string;
    created_at: Date;
    currency: string;
    exported: boolean;
    from_dt: Date;
    id: string;
    location1: string;
    location2: string;
    location3: string;
    location4: string;
    location5: string;
    locations: string[];
    manual_flag: boolean;
    num_transactions: number;
    org_user_id: string;
    physical_bill: boolean;
    physical_bill_at: Date;
    policy_flag: boolean;
    purpose: string;
    reimbursed_at: Date;
    risk_state: string;
    risk_state_expense_count: number;
    settlement_id: string;
    source: string;
    state: string;
    submitted_at: Date;
    tax: number;
    to_dt: Date;
    trip_request_id: string;
    type: string;
    verification_state: string;
  }
  ou: {
    business_unit: string;
    department: string;
    department_id: string;
    employee_id: string;
    id: string;
    level: string;
    location: string;
    mobile: string;
    org_id: string;
    org_name: string;
    status: string;
    sub_department: string;
    title: string;
  };
  us: {
    email: string;
    full_name: string;
  };
}

export interface ExtendedReportInput {
  purpose: string;
  source?: string;
  trip_request_id?: string;
  id?: string;
}
export interface ExtendedReportStats {
  state?: string;
  title?: string;
  warning?: boolean;
  total_amount: number;
  total_count: number;
}
export interface ReportParams {
  state?: string[];
}
export interface ReportApproval {
  approved_at?: Date; //Calculating this value in frontend, API is not returning this value
  added_by: string;
  approver_email: string;
  approver_id: string;
  approver_name: string;
  comment: string;
  created_at: Date;
  disabled_by: string;
  id: number;
  last_updated_by: string;
  rank: number;
  report_id: string;
  request_id: string;
  state: string;
  updated_at: Date;
}

export interface ReportActions {
  can_add_approver: boolean;
  can_admin_approve: boolean;
  can_approve: boolean;
  can_delete: boolean;
  can_edit: boolean;
  can_inquire: boolean;
  can_payment_pending: boolean;
  can_resubmit: boolean;
  can_submit: boolean;
  can_undo_payment_pending: boolean;
  can_verify: boolean;
  id: string;
}