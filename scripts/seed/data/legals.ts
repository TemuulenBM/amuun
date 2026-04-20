type Locale = { en: string; ko: string; mn: string };

function lstr(v: Locale) {
  return { _type: 'localeString', ...v };
}

function block(text: string, style: 'normal' | 'h2' = 'normal') {
  return {
    _key: Math.random().toString(36).slice(2, 10),
    _type: 'block' as const,
    style,
    markDefs: [],
    children: [
      { _key: Math.random().toString(36).slice(2, 10), _type: 'span' as const, marks: [], text },
    ],
  };
}

function locBlocks(en: string[], ko: string[], mn: string[], h2Indices: number[] = []) {
  const build = (arr: string[]) => arr.map((t, i) => block(t, h2Indices.includes(i) ? 'h2' : 'normal'));
  return { _type: 'localeBlockContent', en: build(en), ko: build(ko), mn: build(mn) };
}

const privacyEn = [
  'Privacy Policy',
  'Amuun Expeditions LLC collects personal information only for the purpose of delivering the private expeditions you book with us. This page describes what we collect, how we use it, and how long we keep it.',
  'Information we collect',
  'We collect the information you submit via our inquiry, booking, and custom trip forms. This includes your name, email, phone number, nationality for visa guidance, and any dietary or medical information you share so that our field team can prepare appropriately.',
  'How we use your information',
  'We use your information to confirm bookings, coordinate logistics, communicate pre trip and on trip updates, and follow up after the expedition. We never sell your data. We share it only with vetted in country providers who need it to deliver services on your itinerary.',
  'Retention',
  'Submission records are retained for seven years for tax and regulatory reasons. After that period they are purged from our records. You may request earlier deletion at any time by emailing hello at amuun dot travel.',
  'Your rights',
  'You may request a copy of your data, correction of inaccuracies, or deletion subject to legal retention requirements. Requests are processed within thirty days.',
  'Contact',
  'Questions about this policy should be sent to hello at amuun dot travel. This page was last updated April 2026.',
];
const privacyKo = [
  '개인정보 처리방침',
  'Amuun Expeditions LLC는 귀하가 예약하신 프라이빗 원정을 제공하기 위한 목적으로만 개인정보를 수집합니다. 본 문서는 어떤 정보를 수집하고, 어떻게 사용하며, 얼마나 보관하는지를 안내합니다.',
  '수집 정보',
  '문의, 예약, 맞춤 여정 양식을 통해 제공해 주신 이름, 이메일, 전화번호, 비자 안내를 위한 국적, 그리고 현장 운영에 필요한 식이 및 의료 정보를 수집합니다.',
  '정보 이용 방식',
  '예약 확정, 현지 운영 조율, 여행 전과 여행 중 안내, 여행 후 사후 소통에 사용됩니다. 데이터를 판매하지 않으며, 일정 운영에 반드시 필요한 검증된 현지 파트너와만 공유합니다.',
  '보관 기간',
  '세무 및 규정상의 이유로 제출 기록은 7년간 보관됩니다. 이후 기록은 삭제되며, hello at amuun dot travel로 요청 시 조기 삭제도 가능합니다.',
  '귀하의 권리',
  '본인 데이터 사본 요청, 오류 정정 요청, 법적 보관 요건 범위 내에서의 삭제 요청이 가능합니다. 요청은 30일 이내 처리됩니다.',
  '문의',
  '본 방침 관련 문의는 hello at amuun dot travel로 보내주십시오. 최종 업데이트: 2026년 4월.',
];
const privacyMn = [
  'Нууцлалын бодлого',
  'Amuun Expeditions LLC нь танай захиалсан хаалттай аяллыг явуулах зорилгоор л хувийн мэдээллийг цуглуулдаг. Энэ хуудас нь ямар мэдээлэл цуглуулж, яаж ашиглаж, хэр удаан хадгалдгийг тайлбарлана.',
  'Цуглуулдаг мэдээлэл',
  'Холбогдох, захиалга, хувийн аяллын маягтаар таны өгсөн нэр, имэйл, утас, виз зөвлөгөө өгөх зорилгоор иргэншил, хээрийн баг зохистой бэлдэхэд шаардлагатай хоол, эрүүл мэндийн мэдээллийг авдаг.',
  'Ашиглалт',
  'Захиалга баталгаажуулах, тээвэр-зохион байгуулалт, аяллын өмнө, аяллын дунд, аяллын дараах харилцааг хангахад л хэрэглэнэ. Өгөгдлийг бид хэзээ ч зардаггүй. Зөвхөн таны хөтөлбөрт хэрэгтэй батлагдсан дотоодын хамтрагчидтай хуваалцана.',
  'Хадгалах хугацаа',
  'Татварын болон зохицуулалтын үүднээс ирүүлсэн маягтуудыг долоон жил хадгална. Түүний дараа устгагдана. Та hello at amuun dot travel-д имэйл илгээж эрт устгалыг хүсэж болно.',
  'Таны эрх',
  'Та өгөгдлийнхөө хуулбар, засвар, хуулийн хугацаан дотор устгуулах хүсэлт гаргах эрхтэй. Хүсэлтийг 30 хоногт боловсруулна.',
  'Холбоо',
  'Энэ бодлогын талаарх асуултыг hello at amuun dot travel-д илгээнэ үү. Сүүлд шинэчлэгдсэн: 2026 оны 4 сар.',
];

const termsEn = [
  'Terms of Service',
  'By booking an expedition with Amuun Expeditions LLC you agree to the following terms.',
  'Booking and payment',
  'A thirty percent deposit secures your spot. The balance is due ninety days before departure. Payment accepted in USD, EUR, KRW.',
  'Cancellation',
  'Full refund of deposit up to ninety days before departure. Fifty percent refund between sixty and ninety days. Non refundable within sixty days. Travel insurance is strongly recommended.',
  'Health and fitness',
  'You are responsible for disclosing medical conditions that could affect your ability to complete the expedition. We may require a medical clearance for expert tier expeditions involving altitude.',
  'Liability',
  'Amuun manages all reasonable risks of backcountry travel. We are not liable for delays due to weather, aviation, or force majeure events. We carry comprehensive third party liability insurance.',
  'Contact',
  'Questions about these terms should be sent to hello at amuun dot travel. Last updated April 2026.',
];
const termsKo = [
  '이용약관',
  'Amuun Expeditions LLC의 원정을 예약하시는 것은 아래 약관에 동의하시는 것으로 간주됩니다.',
  '예약 및 결제',
  '30% 계약금으로 예약이 확정됩니다. 잔금은 출발 90일 전까지 지불됩니다. USD, EUR, KRW 결제 가능.',
  '취소',
  '출발 90일 전까지 전액 환불. 60~90일 사이 50% 환불. 60일 이내 환불 불가. 여행자 보험 가입을 강력히 권장합니다.',
  '건강과 체력',
  '원정 수행 능력에 영향을 줄 수 있는 의학적 사항은 사전에 반드시 고지해 주십시오. 전문가 등급의 고산 원정의 경우 의학 소견서가 필요할 수 있습니다.',
  '책임',
  'Amuun은 오지 여행의 합리적 위험을 관리합니다. 기상, 항공, 불가항력 사유로 인한 지연에 대해 책임지지 않습니다. 포괄적인 제3자 배상책임 보험에 가입되어 있습니다.',
  '문의',
  '약관 문의는 hello at amuun dot travel로 보내주십시오. 최종 업데이트: 2026년 4월.',
];
const termsMn = [
  'Үйлчилгээний нөхцөл',
  'Amuun Expeditions LLC-тэй аяллаа захиалснаар та дараах нөхцөлүүдийг хүлээн зөвшөөрнө.',
  'Захиалга ба төлбөр',
  'Гучин хувийн урьдчилгаагаар суудлаа баталгаажуулна. Үлдэгдлийг аяллаас 90 өдрийн өмнө төлнө. USD, EUR, KRW-ээр төлөх боломжтой.',
  'Цуцлалт',
  '90 өдрийн өмнө бол бүтэн буцаалт. 60–90 өдрийн хооронд 50 хувь. 60 өдрийн дотор буцаалтгүй. Аяллын даатгалыг заавал зөвлөнө.',
  'Эрүүл мэнд, биеийн бэлэн байдал',
  'Аяллыг бүрэн дуусгах чадварт нөлөөлөх эрүүл мэндийн мэдээллийг урьдчилан мэдэгдэх үүрэгтэй. Өндрийн аяллуудад эмчийн тодорхойлолт шаардагдаж болно.',
  'Хариуцлага',
  'Amuun нь хөдөөний аяллын боломжит эрсдэлийг удирдана. Цаг агаар, нислэг, давагдашгүй хүчин зүйлээс шалтгаалсан саатлыг бид хариуцдаггүй. Бид гуравдагч этгээдийн хариуцлагын бүх тал дээрх даатгалтай.',
  'Холбоо',
  'Нөхцөлийн талаарх асуултыг hello at amuun dot travel-д илгээнэ үү. Сүүлд шинэчлэгдсэн: 2026 оны 4 сар.',
];

export function buildLegalPages() {
  return [
    {
      _id: 'legal-privacy',
      _type: 'legalPage',
      slug: 'privacy',
      title: lstr({ en: 'Privacy Policy', ko: '개인정보 처리방침', mn: 'Нууцлалын бодлого' }),
      content: locBlocks(privacyEn, privacyKo, privacyMn, [0, 2, 4, 6, 8, 10]),
      updatedAt: new Date('2026-04-01T00:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({ en: 'Privacy · Amuun', ko: '개인정보 · Amuun', mn: 'Нууцлал · Amuun' }),
        description: { _type: 'localeText', en: 'How we collect and use your information.', ko: '개인정보 수집 및 이용 안내.', mn: 'Таны мэдээллийг хэрхэн цуглуулж, ашигладаг.' },
      },
    },
    {
      _id: 'legal-terms',
      _type: 'legalPage',
      slug: 'terms',
      title: lstr({ en: 'Terms of Service', ko: '이용약관', mn: 'Үйлчилгээний нөхцөл' }),
      content: locBlocks(termsEn, termsKo, termsMn, [0, 2, 4, 6, 8, 10]),
      updatedAt: new Date('2026-04-01T00:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({ en: 'Terms · Amuun', ko: '이용약관 · Amuun', mn: 'Нөхцөл · Amuun' }),
        description: { _type: 'localeText', en: 'Booking, payment, and cancellation terms.', ko: '예약, 결제, 취소 약관.', mn: 'Захиалга, төлбөр, цуцлалтын нөхцөл.' },
      },
    },
  ];
}
