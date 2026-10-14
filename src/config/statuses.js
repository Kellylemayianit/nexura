// Payment lifecycle the backend reports. The processing screen simply maps these onto its steps.
export const STATUS_ORDER = ['created', 'signed', 'partner_received', 'converting', 'paid_out', 'completed'];
export const TERMINAL = new Set(['completed', 'failed']);
