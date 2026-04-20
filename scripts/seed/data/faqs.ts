type Locale = { en: string; ko: string; mn: string };
type FaqCategory = 'general' | 'booking' | 'during' | 'visa';

interface FaqRow {
  id: string;
  category: FaqCategory;
  order: number;
  question: Locale;
  answer: Locale;
}

const rows: FaqRow[] = [
  {
    id: 'faq-general-1',
    category: 'general',
    order: 1,
    question: {
      en: 'What makes Amuun different from other Mongolia tour operators?',
      ko: 'Amuun이 다른 몽골 투어 운영사와 다른 점은 무엇인가요?',
      mn: 'Amuun нь Монголын өөр аяллын компаниас юугаараа ялгаатай вэ?',
    },
    answer: {
      en: 'We run six expeditions per year, each private or limited to eight guests. Our guides are full time employees, not contractors. We own the vehicles, ger camps, and horses our teams use. Slow travel over schedule churn.',
      ko: '연 6회 원정만 운영하며 각 일정은 프라이빗 혹은 8명 이하로 제한합니다. 가이드는 모두 정직원이며 외주가 아닙니다. 차량, 게르 캠프, 말까지 자체 보유합니다. 일정 소화가 아닌 호흡의 여행입니다.',
      mn: 'Бид жилд зургаан аялал л явуулдаг бөгөөд тус бүр хаалттай эсвэл найм хүртэл зочинтой. Хөтчид гэрээт биш, бүгд манай байнгын ажилтан. Автомашин, гэр буудал, морьд бүгд өөрсдийн өмч. Яаран биш, тайван аялал.',
    },
  },
  {
    id: 'faq-general-2',
    category: 'general',
    order: 2,
    question: {
      en: 'Is Mongolia safe for solo travelers?',
      ko: '몽골은 혼자 여행하기에 안전한가요?',
      mn: 'Монгол улс ганцаараа аялахад аюулгүй юу?',
    },
    answer: {
      en: 'Yes. Violent crime is rare, especially outside Ulaanbaatar. Our guides remain with you throughout the expedition. In the city we recommend standard urban caution after dark.',
      ko: '네. 울란바토르 외곽에서는 강력 범죄가 거의 없습니다. 일정 내내 가이드가 함께합니다. 도심에서는 늦은 밤 일반적인 도시 수준의 주의만 권장드립니다.',
      mn: 'Тийм. Улаанбаатараас гарвал ноцтой гэмт хэрэг ховор. Аяллын туршид хөтөч тантай үргэлж хамт явна. Хотод шөнө орой нийтлэг хотын болгоомжлол хангалттай.',
    },
  },
  {
    id: 'faq-general-3',
    category: 'general',
    order: 3,
    question: {
      en: 'What level of fitness is required?',
      ko: '어느 정도의 체력이 필요한가요?',
      mn: 'Ямар хэмжээний бие бялдар шаардлагатай вэ?',
    },
    answer: {
      en: 'Varies by expedition. Gobi and Orkhon programs suit all fitness levels. Altai and Khermen Tsav require three or more hours of daily hiking on uneven ground. We discuss your baseline before booking.',
      ko: '일정에 따라 다릅니다. 고비와 오르혼 코스는 체력 부담이 적습니다. 알타이와 헤르멘 차브는 매일 3시간 이상 불규칙한 지형을 걷게 됩니다. 예약 전에 체력 수준을 함께 확인합니다.',
      mn: 'Аяллаас хамаарна. Говь, Орхоны хөтөлбөрүүд ямар ч бие бялдарт тохирно. Алтай, Хэрмэн цав өдөр тутам гурваас дээш цаг тэгшгүй газраар явган аялахыг шаардана. Захиалгын өмнө таны чадварыг хамт ярилцана.',
    },
  },
  {
    id: 'faq-booking-1',
    category: 'booking',
    order: 1,
    question: {
      en: 'How far in advance should I book?',
      ko: '얼마나 미리 예약해야 하나요?',
      mn: 'Хэр эрт захиалах хэрэгтэй вэ?',
    },
    answer: {
      en: 'Four to six months for summer departures. Altai and Naadam programs book nine months out. Shoulder season expeditions in May and September have more flexibility.',
      ko: '여름 출발은 4~6개월 전, 알타이와 나담 프로그램은 9개월 전에 예약하시는 것을 권장드립니다. 5월과 9월의 비수기 일정은 여유가 있습니다.',
      mn: 'Зуны аялалд 4–6 сарын өмнө, Алтай болон Наадамын хөтөлбөрт 9 сарын өмнө захиалах нь зүйтэй. Таван ба есдүгээр сарын аялалд илүү уян хатан.',
    },
  },
  {
    id: 'faq-booking-2',
    category: 'booking',
    order: 2,
    question: {
      en: 'What is your cancellation policy?',
      ko: '취소 정책은 어떻게 되나요?',
      mn: 'Цуцлалтын нөхцөл юу вэ?',
    },
    answer: {
      en: 'Full refund up to 90 days before departure, 50 percent between 60 and 90 days, non refundable within 60 days. Independent travel insurance is strongly recommended.',
      ko: '출발 90일 전까지 전액 환불, 60~90일 사이 50% 환불, 60일 이내에는 환불 불가입니다. 별도의 여행자 보험 가입을 강력히 권장드립니다.',
      mn: 'Аяллаас 90 өдрийн өмнө бол бүтэн буцаалт, 60–90 өдрийн хооронд 50 хувь, 60 өдрийн дотор буцаалтгүй. Бие даасан аяллын даатгалыг заавал зөвлөдөг.',
    },
  },
  {
    id: 'faq-booking-3',
    category: 'booking',
    order: 3,
    question: {
      en: 'Can I customize dates and itinerary?',
      ko: '일정과 경로를 맞춤 조정할 수 있나요?',
      mn: 'Огноо, маршрутыг өөрийн хүслээр өөрчилж болох уу?',
    },
    answer: {
      en: 'Yes. Every expedition can run as a private journey with adjusted dates and stops. Custom itineraries typically add ten to fifteen percent to the standard tier. Contact us through the Custom Trip form.',
      ko: '네. 모든 일정은 날짜와 경유지를 조정해 프라이빗 여정으로 운영할 수 있습니다. 맞춤 경로는 보통 스탠다드 요금 대비 10~15% 추가됩니다. 맞춤 여정 문의 폼으로 연락 주십시오.',
      mn: 'Тийм. Аялал бүрийг огноо, чиглэл нь тохируулагдсан хаалттай аяллаар зохиох боломжтой. Захиалгат маршрут нь ихэвчлэн стандарт үнэн дээр 10–15 хувийн нэмэлт үнэтэй. Захиалгат аяллын хуудсаар холбогдоорой.',
    },
  },
  {
    id: 'faq-during-1',
    category: 'during',
    order: 1,
    question: {
      en: 'What kind of accommodation should I expect?',
      ko: '어떤 숙소에서 머무르게 되나요?',
      mn: 'Ямар байрлалд буудаллах вэ?',
    },
    answer: {
      en: 'Traditional gers at nomadic camps with shared facilities, boutique ger camps with ensuite bathrooms in popular regions, and four star hotels in Ulaanbaatar at the start and end. Deluxe tier upgrades ger camps to premium ensuite throughout.',
      ko: '유목민 캠프의 전통 게르(공용 시설), 주요 지역의 부티크 게르 캠프(개별 욕실), 울란바토르 시작과 종료 지점에 4성급 호텔입니다. 디럭스 등급은 모든 게르 캠프가 프리미엄 개별 욕실로 업그레이드됩니다.',
      mn: 'Нүүдэлчдийн бууцан дахь уламжлалт гэр (нийтийн угаалга), алдартай бүс нутагт ванны өрөөтэй гэр буудал, Улаанбаатарт дөрвөн одтой зочид буудал. Deluxe түвшинд бүх гэр буудлыг ванны өрөөтэй болгож сайжруулдаг.',
    },
  },
  {
    id: 'faq-during-2',
    category: 'during',
    order: 2,
    question: {
      en: 'Will I have internet or phone signal?',
      ko: '인터넷이나 휴대폰 신호는 잡히나요?',
      mn: 'Интернет эсвэл утасны сүлжээ байх уу?',
    },
    answer: {
      en: 'Spotty. Mobile coverage reaches most Gobi tourist areas and larger towns. Expect full disconnection two to four days in Altai and the Taiga. We carry satellite phones for emergencies.',
      ko: '제한적입니다. 고비의 주요 관광 지역과 큰 마을은 대체로 연결됩니다. 알타이와 타이가에서는 2~4일 완전한 단절을 예상하셔야 합니다. 비상시를 위해 위성 전화를 항상 휴대합니다.',
      mn: 'Хязгаарлагдмал. Говийн аялагчдын бүсэд, томоохон сууринд сүлжээ хүрдэг. Алтай, тайгад 2–4 өдөр бүрэн таслагдах магадлал өндөр. Яаралтай үеийн сансрын утас үргэлж авч явна.',
    },
  },
  {
    id: 'faq-during-3',
    category: 'during',
    order: 3,
    question: {
      en: 'What is the food like?',
      ko: '식사는 어떤가요?',
      mn: 'Хоол нь ямар байдаг вэ?',
    },
    answer: {
      en: 'Meat heavy Mongolian cuisine with grains and dairy, mainly mutton and beef. Our camp cooks adapt to dietary restrictions with advance notice. Vegetarian and gluten free are possible with notice. Strict vegan is challenging outside Ulaanbaatar.',
      ko: '양고기와 소고기 중심의 몽골 요리에 곡물과 유제품이 곁들여집니다. 캠프 셰프는 사전에 알려주시면 식이 제한에 맞춰드립니다. 채식과 글루텐 프리는 가능하며 비건은 울란바토르 외 지역에서는 쉽지 않습니다.',
      mn: 'Мах зонхилсон Монгол хоол, үр тариа ба сүүн бүтээгдэхүүнтэй хослолтой. Ихэвчлэн хонь, үхрийн мах. Бууцан дахь тогооч хоолны хориг байвал урьдчилан хэлэхэд тохируулна. Vegetarian, gluten free боломжтой. Үнэн вегант хоолонд хотоос гадна хүндрэлтэй.',
    },
  },
  {
    id: 'faq-visa-1',
    category: 'visa',
    order: 1,
    question: {
      en: 'Do I need a visa?',
      ko: '비자가 필요한가요?',
      mn: 'Виз авах шаардлагатай юу?',
    },
    answer: {
      en: 'Depends on nationality. Citizens of the United States, European Union, United Kingdom, Canada, Japan, and South Korea travel visa free for up to thirty days. Confirm your status on the Mongolian Ministry of Foreign Affairs website. We send a reminder sixty days before departure.',
      ko: '국적에 따라 다릅니다. 미국, 유럽연합, 영국, 캐나다, 일본, 한국 국적자는 30일 무비자 체류가 가능합니다. 몽골 외교부 웹사이트에서 현재 상태를 확인하시고, 당사는 출발 60일 전에 리마인더를 보내드립니다.',
      mn: 'Харьяа улсаас хамаарна. АНУ, Европын холбоо, Их Британи, Канад, Япон, Солонгосын иргэд 30 хүртэл хоног визгүй зорчино. Гадаад Харилцааны Яамны сайтаас одоогийн нөхцөлийг баталгаажуулна. Аяллаас 60 өдрийн өмнө бид сануулга илгээнэ.',
    },
  },
  {
    id: 'faq-visa-2',
    category: 'visa',
    order: 2,
    question: {
      en: 'What is the best airport route?',
      ko: '어느 공항 경로가 좋나요?',
      mn: 'Хамгийн тохиромжтой онгоцны буудлын чиглэл юу вэ?',
    },
    answer: {
      en: 'Chinggis Khaan International Airport (UBN) in Ulaanbaatar. Direct flights from Istanbul, Seoul, Beijing, Tokyo, and Hong Kong. One stop from most European and North American hubs through these gateways.',
      ko: '울란바토르의 칭기즈 칸 국제공항(UBN)입니다. 이스탄불, 서울, 베이징, 도쿄, 홍콩에서 직항이 있습니다. 대부분의 유럽과 북미 주요 도시에서는 이 허브를 경유한 1회 경유 항공편으로 연결됩니다.',
      mn: 'Улаанбаатарын Чингис хаан олон улсын нисэх буудал (UBN). Стамбул, Сөүл, Бээжин, Токио, Хонг Конгоос шууд нислэгтэй. Европ, Хойд Америкийн ихэнх хотоос эдгээр буудлаар нэг дамжин ирдэг.',
    },
  },
  {
    id: 'faq-visa-3',
    category: 'visa',
    order: 3,
    question: {
      en: 'Is altitude sickness a concern?',
      ko: '고산병이 걱정되나요?',
      mn: 'Өндрийн өвчин гарах уу?',
    },
    answer: {
      en: 'Not for most expeditions. Altai Tavan Bogd base camp sits at 3,000 meters with trek peaks reaching 4,000 meters, which requires acclimatization days built into the itinerary. Gobi, Taiga, and Central expeditions stay below 2,000 meters.',
      ko: '대부분의 일정에서는 문제가 되지 않습니다. 알타이 타반 복드 베이스캠프는 해발 3,000m이며 트레킹 구간은 4,000m에 달해 일정에 고도 적응 일자가 포함됩니다. 고비, 타이가, 중앙 몽골 일정은 2,000m 이하입니다.',
      mn: 'Ихэнх аялалд асуудалгүй. Алтай Таван Богдын баазын хуаран 3000 метрт байрладаг бөгөөд оргилын ажил 4000 метрт хүрдэг тул дасан зохицох өдрүүдийг хуваарьт багтаадаг. Говь, тайга, төв нутгийн аялалууд 2000 метрээс доор байна.',
    },
  },
];

export function buildFaqs() {
  return rows.map((r) => ({
    _id: r.id,
    _type: 'faq',
    question: { _type: 'localeString', ...r.question },
    answer: { _type: 'localeText', ...r.answer },
    category: r.category,
    order: r.order,
  }));
}
