import { uploadLocalImage, imageWithAlt } from '../upload';

type Locale = { en: string; ko: string; mn: string };

function lstr(v: Locale) {
  return { _type: 'localeString', ...v };
}
function ltext(v: Locale) {
  return { _type: 'localeText', ...v };
}

export async function buildSiteSettings() {
  const [heroAsset, storyAsset] = await Promise.all([
    uploadLocalImage('hero-desert.jpg'),
    uploadLocalImage('taiga-reindeer.jpg'),
  ]);

  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Amuun',
    tagline: lstr({
      en: 'Private expeditions across the world last wild horizon.',
      ko: '당신 한 사람을 위한, 세상의 마지막 야생.',
      mn: 'Зэлүүд нутгийн эрхэм аян. Зөвхөн таны хэмнэлээр.',
    }),
    aboutHeroImage: imageWithAlt(heroAsset, {
      en: 'Mongolian desert landscape at golden hour',
      ko: '황금빛 몽골 사막 풍경',
      mn: 'Монголын цөлийн алтан цаг',
    }),
    aboutImage: imageWithAlt(storyAsset, {
      en: 'Reindeer herders in the Mongolian taiga',
      ko: '몽골 타이가의 순록 유목민',
      mn: 'Монголын тайгад цаа буга малладаг хүмүүс',
    }),
    aboutStory: {
      _type: 'localeBlockContent',
      en: [
        {
          _type: 'block',
          _key: 'story-en-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'story-en-1-span',
              text: "Amuun was born from a simple frustration: Mongolia's most extraordinary landscapes were inaccessible to the kind of traveller who would truly appreciate them. Not inaccessible by distance, but by design — overloaded group itineraries, generic ger camps, and guides who recited the same script to every visitor.",
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'story-en-2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'story-en-2-span',
              text: 'We build six private expeditions per year — no more. Each one is shaped around a single party, a single season, and a single question: what does this landscape reveal when you slow down enough to listen?',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      ko: [
        {
          _type: 'block',
          _key: 'story-ko-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'story-ko-1-span',
              text: 'Amuun은 단순한 좌절에서 탄생했습니다. 몽골의 가장 비범한 풍경들은 그것을 진정으로 감상할 수 있는 여행자들에게 접근하기 어려웠습니다. 거리의 문제가 아니라 설계의 문제였습니다.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'story-ko-2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'story-ko-2-span',
              text: '우리는 연간 6개의 프라이빗 원정만을 운영합니다. 각각은 단일 그룹, 단일 시즌, 그리고 하나의 질문을 중심으로 구성됩니다.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      mn: [
        {
          _type: 'block',
          _key: 'story-mn-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'story-mn-1-span',
              text: 'Amuun нь энгийн хүсэл тэмүүллээс төрсөн: Монголын хамгийн гайхамшигт газар нутаг нь тэдгээрийг үнэн сэтгэлээсээ үнэлж чадах жуулчдад хүрэхэд хэцүү байсан.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'story-mn-2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'story-mn-2-span',
              text: 'Бид жилд зургаан хаалттай аялал зохион байгуулдаг — цаашгүй. Тус бүр нь нэг бүлэг, нэг улирал, нэг асуулт дээр тулгуурладаг.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
    },
    socialLinks: [
      { _key: 'ig', platform: 'instagram', url: 'https://instagram.com/amuun.travel' },
      { _key: 'fb', platform: 'facebook', url: 'https://facebook.com/amuun.travel' },
      { _key: 'yt', platform: 'youtube', url: 'https://youtube.com/@amuuntravel' },
    ],
    contactInfo: {
      email: 'hello@amuun.travel',
      phone: '+976 7777 0000',
      address: ltext({
        en: 'Sukhbaatar District 1, Ulaanbaatar, Mongolia',
        ko: '몽골 울란바토르 수흐바타르 구 1',
        mn: 'Сүхбаатар дүүрэг 1, Улаанбаатар хот, Монгол',
      }),
      mapUrl: 'https://maps.google.com/?q=Ulaanbaatar,Mongolia',
    },
    defaultSeo: {
      _type: 'seo',
      title: lstr({
        en: 'Amuun · Private expeditions across Mongolia',
        ko: 'Amuun · 몽골 프라이빗 원정',
        mn: 'Amuun · Монголын хаалттай аялал',
      }),
      description: ltext({
        en: 'Six private expeditions per year across the Gobi, Altai, Khuvsgul, and Orkhon Valley.',
        ko: '고비, 알타이, 흡스굴, 오르혼 계곡을 아우르는 연 6회의 프라이빗 원정.',
        mn: 'Говь, Алтай, Хөвсгөл, Орхоны хөндий дамжсан жилд зургаан хаалттай аялал.',
      }),
    },
  };
}
