interface Ref {
  _type: 'reference';
  _ref: string;
}

interface TestimonialRow {
  id: string;
  name: string;
  nationality: string;
  featured: boolean;
  tour?: string;
  quote: { en: string; ko: string; mn: string };
}

const rows: TestimonialRow[] = [
  {
    id: 'testimonial-james-whitfield',
    name: 'James Whitfield',
    nationality: 'United States',
    featured: true,
    tour: 'tour-gobi-crossing',
    quote: {
      en: 'The stillness on the third night in the Gobi was something I had never experienced. Nomin and her team knew exactly when to speak and when to let the landscape do it.',
      ko: '고비에서의 셋째 날 밤의 고요함은 제가 한 번도 겪어본 적 없는 것이었습니다. 노민과 팀은 언제 말해야 하고 언제 풍경에 맡겨야 하는지 정확히 알고 있었습니다.',
      mn: 'Говьд гурав дахь шөнийн нам гүм нь миний өмнө нь хэзээ ч мэдэрч байгаагүй зүйл байлаа. Номин болон баг нь хэзээ ярих, хэзээ нутагт нь үг өгөхийг сайн мэддэг.',
    },
  },
  {
    id: 'testimonial-jiyoung-park',
    name: 'Ji Young Park',
    nationality: 'South Korea',
    featured: true,
    tour: 'tour-five-peaks',
    quote: {
      en: 'We came for Naadam and stayed for the guides. Saraa introduced us to a Kazakh family in Olgii whose hospitality redefined the trip. Every meal was a lesson in something.',
      ko: '나담 때문에 갔다가 가이드 때문에 머물렀습니다. 사라가 울기의 한 카자흐 가정을 소개해 주었고, 그 환대가 여행의 의미를 다시 정의해 주었습니다. 매 끼니가 하나의 수업이었습니다.',
      mn: 'Наадамыг үзэх гэж очоод, хөтчдийнхөө ачаар тэр нутагт үлдсэн. Сараа биднийг Өлгийн нэг казах айлтай танилцуулсан нь аяллын утгыг шинэчилж өгсөн. Хоол бүр нэг сургамж байлаа.',
    },
  },
  {
    id: 'testimonial-klaus-weber',
    name: 'Klaus Weber',
    nationality: 'Germany',
    featured: true,
    tour: 'tour-five-peaks',
    quote: {
      en: 'My wife and I have traveled to forty seven countries. Amuun Altai expedition ranks in the top three for pure landscape and top one for guide quality. Tuvshin adapted the route daily based on weather.',
      ko: '아내와 저는 47개국을 여행했습니다. Amuun의 알타이 원정은 풍경만으로도 최고 3위 안에 들고, 가이드 품질로는 1위입니다. 투브신은 매일 날씨에 따라 경로를 조정했습니다.',
      mn: 'Эхнэр бид хоёр 47 улсад очсон. Amuun-ы Алтайн аялал зөвхөн нутгийн хувьд эхний гуравт, хөтчийн чанараараа гарцаагүй тэргүүнд явдаг. Түвшин өдөр бүр цаг агаарт тохируулан замаа солиод байлаа.',
    },
  },
  {
    id: 'testimonial-amelie-rousseau',
    name: 'Amelie Rousseau',
    nationality: 'France',
    featured: false,
    tour: 'tour-reindeer-camp',
    quote: {
      en: 'The reindeer camp felt private and sacred. We were alone with the Tsaatan for three days. No Instagram tour feel. The horses, the quiet, the smoked fish. Unforgettable.',
      ko: '순록 캠프는 사적이면서도 성스러운 공간처럼 느껴졌습니다. 차탄 분들과 3일을 단둘이 보냈습니다. 인스타그램용 투어 느낌이 전혀 없었고, 말과 고요, 훈제 생선이 기억에 남습니다.',
      mn: 'Цаатны бууц бидний хувьд хаалттай, ариун газар мэт санагдсан. Цаатантай гурван өдөр ганцаараа байсан. Instagram аяллын амт огт байгаагүй. Морь, нам гүм, утсан загас. Мартагдашгүй.',
    },
  },
  {
    id: 'testimonial-henry-wilson',
    name: 'Henry Wilson',
    nationality: 'United Kingdom',
    featured: false,
    tour: 'tour-khermen-canyon',
    quote: {
      en: 'I photograph for travel magazines. This was one of the few trips where I put the camera down more than I picked it up. That is the highest compliment I can give a landscape.',
      ko: '저는 여행 잡지에 사진을 기고합니다. 카메라를 드는 시간보다 내려놓는 시간이 더 많았던 몇 안 되는 여행 중 하나였습니다. 풍경에 대한 가장 큰 찬사입니다.',
      mn: 'Би аяллын сэтгүүлд зурагчилж ажилладаг. Энэ аяллаас камераа авахаасаа илүү хойш тавьж суусан цөөн аяллын нэг. Нутагт өгч болох хамгийн өндөр магтаал энэ.',
    },
  },
  {
    id: 'testimonial-yuki-tanaka',
    name: 'Yuki Tanaka',
    nationality: 'Japan',
    featured: true,
    tour: 'tour-gobi-crossing',
    quote: {
      en: 'Small group, but each guide knew our names, our dietary needs, our pace. Erdene pointed out fossils at Bayanzag my guidebook missed entirely. Authentic expertise, not a script.',
      ko: '소규모였지만 모든 가이드가 우리 이름, 식이 요구, 걸음 속도까지 알고 있었습니다. 에르덴은 가이드북이 전혀 언급하지 않은 바얀작의 화석들을 짚어주었습니다. 각본이 아닌 진짜 전문성.',
      mn: 'Багаараа цөөн байсан ч хөтөч бүр нэрийг маань, хоолны шаардлагыг, алхааны хэмнэлийг мэддэг байлаа. Эрдэнэ Баянзагт манай гарын авлагад огт дурдаагүй чулуужсан ясыг зааж өгсөн. Script биш, жинхэнэ мэдлэг.',
    },
  },
];

export function buildTestimonials() {
  return rows.map((r) => {
    const doc: {
      _id: string;
      _type: 'testimonial';
      name: string;
      nationality: string;
      quote: { _type: 'localeText'; en: string; ko: string; mn: string };
      featured: boolean;
      submittedAt: string;
      tour?: Ref;
    } = {
      _id: r.id,
      _type: 'testimonial',
      name: r.name,
      nationality: r.nationality,
      quote: { _type: 'localeText', ...r.quote },
      featured: r.featured,
      submittedAt: new Date('2026-03-15T12:00:00Z').toISOString(),
    };
    if (r.tour) doc.tour = { _type: 'reference', _ref: r.tour };
    return doc;
  });
}
