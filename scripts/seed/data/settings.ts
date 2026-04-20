type Locale = { en: string; ko: string; mn: string };

function lstr(v: Locale) {
  return { _type: 'localeString', ...v };
}
function ltext(v: Locale) {
  return { _type: 'localeText', ...v };
}

export function buildSiteSettings() {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Amuun',
    tagline: lstr({
      en: 'Private expeditions across the world last wild horizon.',
      ko: '당신 한 사람을 위한, 세상의 마지막 야생.',
      mn: 'Зэлүүд нутгийн эрхэм аян. Зөвхөн таны хэмнэлээр.',
    }),
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
