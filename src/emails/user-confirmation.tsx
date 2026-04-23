import { Heading, Text } from 'react-email';
import { EmailShell } from './email-shell';

type Locale = 'en' | 'ko' | 'mn';
type FormType = 'contact' | 'customTrip' | 'booking';

interface UserConfirmationProps {
  formType: FormType;
  name: string;
  locale: Locale;
  tourTitle?: string;
}

const headingStyle = {
  color: '#0B0D10',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '26px',
  margin: '0 0 16px 0',
};

const paragraphStyle = {
  color: '#0B0D10',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 16px 0',
};

interface Copy {
  title: string;
  greeting: (name: string) => string;
  lede: string;
  followup: string;
  signoff: string;
  bookingNote?: (tourTitle: string) => string;
}

const copy: Record<Locale, Copy> = {
  en: {
    title: 'Your inquiry has reached us',
    greeting: (n) => `Dear ${n},`,
    lede: 'Thank you for reaching out to Amuun. We have received your message and a member of our expedition team will respond within 24 hours.',
    followup:
      'If your inquiry is time-sensitive, please reply directly to this email — it goes straight to our inbox.',
    signoff: 'Warmly,\nThe Amuun team',
    bookingNote: (t) =>
      `We have noted your interest in "${t}". Expect a detailed itinerary, pricing breakdown, and availability in our reply.`,
  },
  ko: {
    title: '문의가 도착했습니다',
    greeting: (n) => `${n} 님께,`,
    lede: 'Amuun에 연락주셔서 감사합니다. 귀하의 메시지를 잘 받았으며, 24시간 이내에 저희 원정 팀의 담당자가 답변드리겠습니다.',
    followup:
      '긴급하신 경우 이 이메일에 바로 회신하시면 저희 팀의 받은편지함으로 전달됩니다.',
    signoff: '감사합니다.\nAmuun 팀 드림',
    bookingNote: (t) =>
      `"${t}" 탐험에 관심 주셔서 감사합니다. 자세한 일정, 가격 안내, 가용 일정을 회신에 담아 전해드리겠습니다.`,
  },
  mn: {
    title: 'Таны хүсэлт хүрсэн байна',
    greeting: (n) => `Эрхэм ${n},`,
    lede: 'Amuun-д хандсан танд баярлалаа. Бид таны мессежийг хүлээн авсан бөгөөд манай экспедицийн багийн гишүүн 24 цагийн дотор хариу өгнө.',
    followup:
      'Хэрэв яаралтай асуудал байвал энэ имэйлд шууд хариу бичнэ үү — биднийх рүү шууд очно.',
    signoff: 'Хүндэтгэсэн,\nAmuun-ийн баг',
    bookingNote: (t) =>
      `"${t}" аялалд сонирхолтой байгаад баярлалаа. Нарийвчилсан хөтөлбөр, үнийн задаргаа, сул ордон бүхий хариу өгнө.`,
  },
};

export function UserConfirmation({
  formType,
  name,
  locale,
  tourTitle,
}: UserConfirmationProps) {
  const c = copy[locale];
  return (
    <EmailShell preview={c.title}>
      <Heading style={headingStyle}>{c.title}</Heading>
      <Text style={paragraphStyle}>{c.greeting(name)}</Text>
      <Text style={paragraphStyle}>{c.lede}</Text>
      {formType === 'booking' && tourTitle && c.bookingNote ? (
        <Text style={paragraphStyle}>{c.bookingNote(tourTitle)}</Text>
      ) : null}
      <Text style={paragraphStyle}>{c.followup}</Text>
      <Text style={paragraphStyle}>{c.signoff}</Text>
    </EmailShell>
  );
}
