export type FormType = 'contact' | 'customTrip' | 'booking';

export type FormErrorCode =
  | 'INVALID_JSON'
  | 'VALIDATION'
  | 'TURNSTILE_FAILED'
  | 'HONEYPOT_TRIPPED'
  | 'SERVICE_UNAVAILABLE';

export interface ApiSuccess {
  ok: true;
  submissionId: string;
  emailWarning?: boolean;
}

export interface ApiValidationError {
  ok: false;
  error: 'VALIDATION';
  fields: Record<string, string>;
}

export interface ApiError {
  ok: false;
  error: Exclude<FormErrorCode, 'VALIDATION'>;
}

export type ApiResult = ApiSuccess | ApiValidationError | ApiError;

export interface RequestMeta {
  ip: string;
  userAgent: string;
  referrer?: string;
  submittedAt: string; // ISO 8601
}
