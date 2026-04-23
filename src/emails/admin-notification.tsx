import { Heading, Hr, Section, Text } from 'react-email';
import { EmailShell } from './email-shell';

type FormType = 'contact' | 'customTrip' | 'booking';

interface AdminNotificationProps {
  formType: FormType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: 'en' | 'ko' | 'mn';
  payload: Record<string, unknown>;
  submittedAt: string;
  sanityStudioUrl?: string;
}

const headingStyle = {
  color: '#0B0D10',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '22px',
  margin: '0 0 16px 0',
};

const labelStyle = {
  color: '#6B6E73',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '16px 0 4px 0',
};

const valueStyle = {
  color: '#0B0D10',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
};

function formTypeLabel(formType: FormType): string {
  switch (formType) {
    case 'contact':
      return 'Contact inquiry';
    case 'customTrip':
      return 'Custom trip request';
    case 'booking':
      return 'Booking inquiry';
  }
}

export function AdminNotification(props: AdminNotificationProps) {
  const {
    formType,
    name,
    email,
    phone,
    message,
    locale,
    payload,
    submittedAt,
    sanityStudioUrl,
  } = props;
  return (
    <EmailShell preview={`[${formType}] New inquiry from ${name}`}>
      <Heading style={headingStyle}>{formTypeLabel(formType)}</Heading>
      <Text style={labelStyle}>Name</Text>
      <Text style={valueStyle}>{name}</Text>
      <Text style={labelStyle}>Email</Text>
      <Text style={valueStyle}>{email}</Text>
      {phone ? (
        <>
          <Text style={labelStyle}>Phone</Text>
          <Text style={valueStyle}>{phone}</Text>
        </>
      ) : null}
      <Text style={labelStyle}>Message</Text>
      <Text style={valueStyle}>{message}</Text>
      <Hr style={{ borderColor: '#E5E2DA', margin: '24px 0' }} />
      <Text style={labelStyle}>Locale</Text>
      <Text style={valueStyle}>{locale}</Text>
      <Text style={labelStyle}>Submitted</Text>
      <Text style={valueStyle}>{submittedAt}</Text>
      <Text style={labelStyle}>Payload</Text>
      <Text style={valueStyle}>
        {JSON.stringify(payload, null, 2)}
      </Text>
      {sanityStudioUrl ? (
        <Section style={{ marginTop: '24px' }}>
          <Text style={valueStyle}>
            Open in Studio:{' '}
            <a href={sanityStudioUrl} style={{ color: '#D4A23A' }}>
              {sanityStudioUrl}
            </a>
          </Text>
        </Section>
      ) : null}
    </EmailShell>
  );
}
