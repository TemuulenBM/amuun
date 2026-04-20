import { uploadLocalImage, imageWithAlt } from '../upload';

type Locale = { en: string; ko: string; mn: string };
function lstr(v: Locale) {
  return { _type: 'localeString', ...v };
}
function ltext(v: Locale) {
  return { _type: 'localeText', ...v };
}

function block(lang: 'en' | 'ko' | 'mn', text: string, style: 'normal' | 'h2' | 'h3' | 'blockquote' = 'normal') {
  return {
    _key: Math.random().toString(36).slice(2, 10),
    _type: 'block' as const,
    style,
    markDefs: [],
    children: [
      {
        _key: Math.random().toString(36).slice(2, 10),
        _type: 'span' as const,
        marks: [],
        text,
      },
    ],
  };
}

function locBlocks(en: string[], ko: string[], mn: string[], headings?: Partial<Record<number, 'h2' | 'h3' | 'blockquote'>>) {
  const build = (arr: string[], lang: 'en' | 'ko' | 'mn') =>
    arr.map((t, i) => block(lang, t, headings?.[i] ?? 'normal'));
  return {
    _type: 'localeBlockContent',
    en: build(en, 'en'),
    ko: build(ko, 'ko'),
    mn: build(mn, 'mn'),
  };
}

export async function buildBlogs() {
  const taiga = await uploadLocalImage('taiga-reindeer.jpg');
  const gobi = await uploadLocalImage('gobi-crossing.jpg');
  const altai = await uploadLocalImage('altai-peaks.jpg');

  const tsaatanEnParas = [
    'The Tsaatan are not a travel destination. They are a people with a calendar, a language, and a future. Visiting them should feel like being invited to a neighbor house, not opening a brochure.',
    'We work with three Tsaatan families in the Western Taiga, rotating visits so no single household carries the full weight of the season. The families set the schedule. We set the boundaries.',
    'There are twelve Tsaatan households left in Mongolia. Their migration calendar follows pasture for the reindeer, a seasonal rhythm older than any map. To walk with them is to remember that time has a texture we have mostly forgotten.',
    'If you join us, leave the drone, the tripods, and the Instagram mindset behind. Bring a notebook, a second pair of wool socks, and a quiet curiosity. The smoked fish is excellent. The silence is better.',
  ];
  const tsaatanKoParas = [
    '차탄 사람들은 관광지가 아닙니다. 그들에게는 달력이 있고, 언어가 있고, 미래가 있습니다. 그들을 방문한다는 것은 팜플렛을 펼치는 것이 아니라 이웃의 집에 초대받는 일에 가깝습니다.',
    '저희는 서부 타이가의 세 차탄 가족과 협업하며 방문을 분산시켜, 한 가정이 한 시즌의 부담을 전부 짊어지지 않도록 합니다. 일정은 가족이 정합니다. 경계는 저희가 정합니다.',
    '몽골에 남아 있는 차탄 가구는 열두 호입니다. 그들의 이주는 순록을 위한 목초지를 따르며, 어떤 지도보다도 오래된 리듬을 지킵니다. 그들과 함께 걷는 것은, 우리가 대부분 잊어버린 시간의 결을 다시 기억하는 일입니다.',
    '함께하신다면 드론, 삼각대, 인스타그램의 태도를 두고 오십시오. 노트, 양털 양말 한 켤레, 조용한 호기심을 챙겨오십시오. 훈제 생선은 훌륭합니다. 침묵은 그보다 더 좋습니다.',
  ];
  const tsaatanMnParas = [
    'Цаатан бол аялалын цэг биш. Тэд өөрийн хуанлитай, хэлтэй, ирээдүйтэй ард түмэн. Тэдэн дээр очсон нь товхимол нээх биш, хөршийн гэрт урихад хариу өгсөн мэт байх ёстой.',
    'Бид баруун тайгын гурван Цаатан айлтай хамтарч, улиралын ачааллыг нэг айлд даруулахгүйгээр уулзалт хуваарилдаг. Хуваарийг айл тогтооно. Хязгаарыг бид тогтоодог.',
    'Монголд үлдсэн 12 Цаатан өрх бий. Тэдний нүүдэл цаа бугын бэлчээрийг дагадаг, аливаа газрын зургаас эртний хэмнэлтэй. Тэдэнтэй хамт алхсан нь, бидний мартсан цагийн бүтэцийг эргэн санах явдал юм.',
    'Бидэнтэй хамт очих бол дрон, гурвалжин тулгуур, Instagram-ын сэтгэлгээг хаяж ирээрэй. Дэвтэр, хоёр хос ноосон оймс, нам гүм сониуч занг авчирна уу. Утсан загас нь гайхамшигтай. Чимээгүй нь түүнээс давсан.',
  ];

  const packingEn = [
    'Packing for the Gobi is less about gear and more about layers. The desert swings thirty degrees between noon and midnight. Your body will do the same.',
    'Merino base layer, mid weight fleece, soft shell jacket. That is the kit we send to every guest. We skip the waterproofs. In the Gobi you do not fight weather. You dress for it.',
    'Footwear matters more than people think. Low cut trail shoes for camp days. Mid ankle hiking boots for dune ascents and canyon rim walks. One pair of sandals for the ger. Never more.',
    'Small, specific items that change the trip. A headlamp with a red filter. A three inch folding knife. A silk sleep liner. A paperback for the afternoons when the wind picks up and you want a corner of the ger to yourself.',
    'What to leave at home. Cotton. Technical clothing you have never tested. Power banks above ten thousand milliamps. Opinions about what the desert should feel like. The Gobi has its own opinions.',
  ];
  const packingKo = [
    '고비를 위한 짐꾸리기는 장비가 아니라 레이어의 문제입니다. 사막은 정오와 자정 사이에 30도를 오갑니다. 몸도 그렇게 반응합니다.',
    '메리노 울 이너, 중간 두께 플리스, 소프트 쉘 자켓. 저희가 모든 손님에게 권하는 기본 구성입니다. 방수 옷은 생략합니다. 고비에서는 날씨와 싸우는 것이 아니라 날씨에 맞춰 옷을 입습니다.',
    '신발은 사람들이 생각하는 것보다 더 중요합니다. 캠프 일상용 로우컷 트레일 슈즈. 사구와 절벽 산책을 위한 미드 앵클 하이킹 부츠. 게르용 샌들 한 켤레. 그 이상은 필요 없습니다.',
    '여정을 바꾸는 작은 품목들. 빨간색 필터가 있는 헤드램프. 3인치 폴딩 나이프. 실크 슬리핑 라이너. 바람이 세지고 게르 한구석에서 혼자 있고 싶을 오후를 위한 종이책 한 권.',
    '두고 와야 할 것들. 면 소재 옷. 한 번도 입어보지 않은 테크니컬 의류. 만 밀리암페어 이상의 보조 배터리. 사막이 어떤 느낌이어야 한다는 선입견. 고비는 자기만의 의견을 갖고 있습니다.',
  ];
  const packingMn = [
    'Говьд ачаа бэлдэх нь тоног хэрэгсэлээс илүү давхарласан хувцастай холбоотой. Цөл үд болон шөнийн хооронд 30 градус хэлбэлздэг. Таны бие мөн адил.',
    'Merino дотор, дунд зузаан fleece, soft shell гадуур. Бид бүх зочиндоо үүнийг санал болгодог. Водоз хувцасгүй. Говьд цаг агаартай тэмцдэггүй. Цаг агаарт тохируулан өмсдөг.',
    'Гутал нь хүмүүсийн боддогоос илүү чухал. Бууцны өдрүүдэд намхан trail гутал. Манхан, хадан ирмэгт дунд өндрийн hiking гутал. Гэр дотор хэрэглэх нэг хос шаахай. Дахиж хэрэггүй.',
    'Аяллыг өөрчилдөг жижиг зүйлс. Улаан шүүлтэй headlamp. Гурван инчийн нугаралттай хутга. Торгон унтлагын дагалд. Салхи ширүүсэх цагт гэрийн нэг буланд ганцаараа уншихаар нимгэн ном.',
    'Гэртээ үлдээх зүйл. Хөвөн хувцас. Өмнө нь туршаагүй техник хувцас. Арван мянган милиамперээс дээш power bank. Цөл ямар байх ёстой тухай өөрийн үзэл бодол. Говь өөрийн гэсэн бодолтой.',
  ];

  const winterEn = [
    'Most Mongolia tour companies close in October. We book winter clients starting in November for a specific reason. The landscape is better alone.',
    'In February, the Gobi turns silver. The dunes hold snow only at their edges. The air has a sound you will not hear in any other season. If you can handle negative twenty at noon, the photography is extraordinary.',
    'Winter is not for everyone. The gers stay warm. The vehicles stay moving. But the hours of daylight are shorter and the mental demands of cold climate travel are real. We screen for this before booking.',
    'What winter gives you. A photographer who is calibrated for ice, not haze. A guide whose full attention is on you, not on a rotation of clients. A country reduced to its essential shapes. Silence that has weight.',
  ];
  const winterKo = [
    '몽골 투어 회사 대부분은 10월에 문을 닫습니다. 저희는 11월부터 겨울 손님을 받습니다. 이유는 명확합니다. 풍경은 혼자일 때 더 좋습니다.',
    '2월의 고비는 은빛이 됩니다. 사구는 가장자리에만 눈이 남고, 공기는 다른 계절에서 들을 수 없는 소리를 냅니다. 정오에 영하 20도를 견딜 수 있다면, 사진이 놀라운 결과를 만듭니다.',
    '겨울이 모두에게 맞는 것은 아닙니다. 게르는 따뜻하게 유지되고 차량은 문제없이 달립니다. 그러나 낮 시간이 짧고, 혹한 속 여행이 요구하는 정신적 체력은 실재합니다. 저희는 예약 전 이를 확인합니다.',
    '겨울이 주는 것. 얼음에 맞춘 사진작가. 다른 손님들이 아닌 당신에게만 집중하는 가이드. 본질적인 선으로 축소된 나라. 무게를 가진 침묵.',
  ];
  const winterMn = [
    'Монголын ихэнх аяллын компаниуд 10 сард хаалгаа хаадаг. Бид 11 сараас өвлийн зочдыг хүлээж авдаг. Нэг гол шалтгаантай. Нутаг ганцаараа байхад илүү сайн.',
    '2 сарын Говь мөнгөлөг өнгөтэй болдог. Манхан дээр цас зөвхөн ирмэгээр нь үлддэг. Агаар өөр улиралд үгүй дуу чимээтэй. Үд дунд минус 20 градус тэссэн тохиолдолд гэрэл зураг нь ер бусын.',
    'Өвөл хүн бүрт тохирохгүй. Гэр дулаан, машин явна. Гэхдээ өдрийн гэрэлтэй цаг богино, хүйтний аяллын оюун санааны даацыг үнэлэх ёстой. Захиалгын өмнө бид үүнийг тодруулдаг.',
    'Өвөл юу өгдөг вэ. Мананд биш, мөсөнд тохируулсан гэрэл зурагчин. Өөр зочдод биш, танд чиглэсэн хөтөчийн бүрэн анхаарал. Үндсэн зураасаараа үлдсэн улс орон. Жинтэй нам гүм.',
  ];

  return [
    {
      _id: 'blog-tsaatan-story',
      _type: 'blogPost',
      title: lstr({
        en: 'The Last Reindeer Herders',
        ko: '마지막 순록 유목민',
        mn: 'Сүүлчийн цаатан иргэд',
      }),
      slug: { _type: 'slug', current: 'last-reindeer-herders' },
      excerpt: ltext({
        en: 'How we partner with the Tsaatan community in the northern Taiga and what guests should expect.',
        ko: '북부 타이가에서 차탄 공동체와 협업하는 방식, 그리고 방문객이 예상해야 할 것들.',
        mn: 'Хойд тайгын Цаатан нийгэмлэгтэй хэрхэн хамтран ажиллаж, зочин юу хүлээх ёстой вэ.',
      }),
      content: locBlocks(tsaatanEnParas, tsaatanKoParas, tsaatanMnParas),
      heroImage: imageWithAlt(taiga, {
        en: 'Reindeer grazing in summer pasture',
        ko: '여름 목초지에서 풀을 뜯는 순록',
        mn: 'Зуны бэлчээрт өвс идэж буй цаа буга',
      }),
      category: 'culture',
      author: { _type: 'reference', _ref: 'team-saraa-dashdorj' },
      relatedTours: [{ _type: 'reference', _ref: 'tour-reindeer-camp' }],
      publishedAt: new Date('2026-03-05T09:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({ en: 'The Last Reindeer Herders · Amuun', ko: '마지막 순록 유목민 · Amuun', mn: 'Сүүлчийн цаатан · Amuun' }),
        description: ltext({
          en: 'A working relationship with Mongolia Tsaatan families: twelve households, three partnerships, zero Instagram.',
          ko: '몽골 차탄 가족과의 협업: 열두 가구, 세 파트너십, 인스타그램 없는 진심.',
          mn: 'Монголын Цаатан айлуудтай хамтын ажиллагаа: 12 өрх, гурван түншлэл, Instagram-гүй.',
        }),
      },
    },
    {
      _id: 'blog-packing-gobi',
      _type: 'blogPost',
      title: lstr({
        en: 'Packing for the Gobi',
        ko: '고비를 위한 짐꾸리기',
        mn: 'Говьд ачаа бэлдэх нь',
      }),
      slug: { _type: 'slug', current: 'packing-gobi' },
      excerpt: ltext({
        en: 'What twenty years of desert guiding taught us about what to bring and what to leave.',
        ko: '20년간의 사막 가이드 경험이 우리에게 가르쳐 준, 챙겨야 할 것과 두고 와야 할 것.',
        mn: 'Хорин жилийн цөлийн хөтчийн туршлагаас юу авч явах, юу үлдээхийг сурсан зүйлс.',
      }),
      content: locBlocks(packingEn, packingKo, packingMn),
      heroImage: imageWithAlt(gobi, {
        en: 'Desert road with gear bag',
        ko: '장비와 함께한 사막 도로',
        mn: 'Тоног хэрэгсэлтэй цөлийн зам',
      }),
      category: 'tips',
      author: { _type: 'reference', _ref: 'team-erdene-munkhbat' },
      relatedTours: [
        { _type: 'reference', _ref: 'tour-gobi-crossing' },
        { _type: 'reference', _ref: 'tour-singing-dunes' },
      ],
      publishedAt: new Date('2026-03-10T09:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({ en: 'Packing for the Gobi · Amuun', ko: '고비를 위한 짐꾸리기 · Amuun', mn: 'Говийн ачаа бэлдэх · Amuun' }),
        description: ltext({
          en: 'A minimalist packing philosophy for a thirty degree swing desert, written by our lead Gobi guide.',
          ko: '30도 기온차의 사막을 위한 미니멀 패킹 철학, 수석 고비 가이드가 썼습니다.',
          mn: '30 градусын хэлбэлзэлтэй цөлийн минималист бэлтгэл, Говийн ахлах хөтчийн бичсэн.',
        }),
      },
    },
    {
      _id: 'blog-winter-stories',
      _type: 'blogPost',
      title: lstr({
        en: 'Why We Work Alone in Winter',
        ko: '겨울에 단독으로 운영하는 이유',
        mn: 'Өвөл ганцаараа ажилладгийн шалтгаан',
      }),
      slug: { _type: 'slug', current: 'winter-alone' },
      excerpt: ltext({
        en: 'Most operators close in October. We keep a quiet winter schedule. Here is why.',
        ko: '대부분의 운영사는 10월에 문을 닫습니다. 저희는 조용히 겨울 일정을 이어갑니다. 그 이유.',
        mn: 'Ихэнх компаниуд 10 сард хаадаг. Бид өвлийн чимээгүй хуваарийг үргэлжлүүлдэг. Шалтгаан нь энэ.',
      }),
      content: locBlocks(winterEn, winterKo, winterMn),
      heroImage: imageWithAlt(altai, {
        en: 'Frozen Altai peak at dawn',
        ko: '동틀 무렵의 얼어붙은 알타이 봉우리',
        mn: 'Өглөөний шалбааг Алтайн оргил',
      }),
      category: 'stories',
      author: { _type: 'reference', _ref: 'team-nomin-batbayar' },
      relatedTours: [{ _type: 'reference', _ref: 'tour-five-peaks' }],
      publishedAt: new Date('2026-03-15T09:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({ en: 'Winter in Mongolia · Amuun', ko: '몽골의 겨울 · Amuun', mn: 'Монгол өвөл · Amuun' }),
        description: ltext({
          en: 'Off season reasoning from our founder: why Mongolia November to February might be the best time to visit.',
          ko: '창립자의 비수기 논리: 11월부터 2월까지의 몽골이 최고의 방문 시기일 수 있는 이유.',
          mn: 'Үүсгэн байгуулагчийн бус улиралын үзэл: 11 сараас 2 сар хүртэлх Монгол яагаад хамгийн сонголттой байж болох вэ.',
        }),
      },
    },
  ];
}
