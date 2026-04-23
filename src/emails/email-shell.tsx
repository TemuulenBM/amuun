import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'react-email';
import type { ReactNode } from 'react';

interface EmailShellProps {
  preview: string;
  children: ReactNode;
}

const bodyStyle = {
  backgroundColor: '#F4F1EA',
  fontFamily:
    "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  backgroundColor: '#F4F1EA',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 24px',
};

const brandStyle = {
  color: '#0B0D10',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '28px',
  letterSpacing: '0.08em',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
};

const footerStyle = {
  color: '#6B6E73',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '32px 0 0 0',
};

const dividerStyle = {
  borderColor: '#D4A23A',
  borderWidth: '1px',
  margin: '32px 0',
};

export function EmailShell({ preview, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={brandStyle}>AMUUN</Text>
          <Section>{children}</Section>
          <Hr style={dividerStyle} />
          <Text style={footerStyle}>
            Amuun · Private expeditions across Mongolia
            <br />
            hello@amuun.voidex.studio
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
