import { uploadLocalImage, imageWithAlt } from '../upload';

export async function buildDestinations() {
  const gobi = await uploadLocalImage('gobi-crossing.jpg');
  const altai = await uploadLocalImage('altai-peaks.jpg');
  const taiga = await uploadLocalImage('taiga-reindeer.jpg');
  const kharkhorum = await uploadLocalImage('karakorum.jpg');
  const terelj = await uploadLocalImage('canyon-descent.jpg');

  return [
    {
      _id: 'destination-gobi',
      _type: 'destination',
      title: { _type: 'localeString', en: 'Gobi Desert', ko: '고비 사막', mn: 'Говь цөл' },
      slug: { _type: 'slug', current: 'gobi' },
      subtitle: {
        _type: 'localeString',
        en: 'Southern Mongolia / Desert',
        ko: '남몽골 / 사막',
        mn: 'Өмнөд Монгол / Цөл',
      },
      region: 'gobi',
      bestTime: {
        _type: 'localeString',
        en: 'June through September',
        ko: '6월부터 9월까지',
        mn: '6 сараас 9 сар хүртэл',
      },
      highlights: [
        { _type: 'localeString', en: 'Khongoryn Sand Dunes', ko: '홍고린 사구', mn: 'Хонгорын элс' },
        { _type: 'localeString', en: 'Yolyn Am ice gorge', ko: '욜린 암 얼음 협곡', mn: 'Ёлын амны мөсөн хавцал' },
        { _type: 'localeString', en: 'Bayanzag flaming cliffs', ko: '바얀작 붉은 절벽', mn: 'Баянзагийн улаан хад' },
        { _type: 'localeString', en: 'Dinosaur fossil beds', ko: '공룡 화석 지대', mn: 'Үлэг гүрвэлийн чулуужсан орд' },
        { _type: 'localeString', en: 'Two humped Bactrian camels', ko: '쌍봉낙타', mn: 'Хоёр бөхт тэмээ' },
      ],
      heroImage: imageWithAlt(gobi, {
        en: 'Gobi desert road stretching toward distant mountains',
        ko: '먼 산을 향해 뻗어 있는 고비 사막 도로',
        mn: 'Хол уул руу сунасан Говийн зам',
      }),
      seo: {
        _type: 'seo',
        title: {
          _type: 'localeString',
          en: 'Gobi Desert Expeditions · Amuun',
          ko: '고비 사막 원정 · Amuun',
          mn: 'Говийн аялал · Amuun',
        },
        description: {
          _type: 'localeText',
          en: 'Private expeditions across the Gobi desert. Dunes, fossil cliffs, herder camps, and a silence that rearranges your sense of scale.',
          ko: '고비 사막을 가로지르는 프라이빗 원정. 사구, 화석 절벽, 유목민 캠프, 그리고 감각의 척도를 바꾸는 침묵.',
          mn: 'Говь цөлийг туулах хаалттай аялал. Манхан, чулуужсан хад, малчны буудал, тэгээд хэмжээг өөрчилдөг нам гүм.',
        },
      },
    },
    {
      _id: 'destination-western',
      _type: 'destination',
      title: {
        _type: 'localeString',
        en: 'Altai Tavan Bogd',
        ko: '알타이 타반 복드',
        mn: 'Алтай Таван Богд',
      },
      slug: { _type: 'slug', current: 'altai' },
      subtitle: {
        _type: 'localeString',
        en: 'Western Mongolia / High Peaks',
        ko: '서몽골 / 고산 지대',
        mn: 'Баруун Монгол / Өндөр уул',
      },
      region: 'western',
      bestTime: {
        _type: 'localeString',
        en: 'July through August',
        ko: '7월부터 8월까지',
        mn: '7 сараас 8 сар хүртэл',
      },
      highlights: [
        { _type: 'localeString', en: 'Potanin Glacier', ko: '포타닌 빙하', mn: 'Потанины мөсөн гол' },
        { _type: 'localeString', en: 'Five Holy Peaks', ko: '다섯 성산', mn: 'Таван Богд оргил' },
        { _type: 'localeString', en: 'Kazakh eagle hunters', ko: '카자흐 매잡이', mn: 'Казах бүргэдчид' },
        { _type: 'localeString', en: 'Alpine glacial lakes', ko: '고산 빙하호', mn: 'Мөсөн голын нуурууд' },
        { _type: 'localeString', en: 'Malchin summit base camp', ko: '말친 정상 베이스캠프', mn: 'Малчин оргилын баазын хуаран' },
      ],
      heroImage: imageWithAlt(altai, {
        en: 'Altai Tavan Bogd high peaks under morning light',
        ko: '새벽 빛 아래 알타이 타반 복드 고봉',
        mn: 'Үүрийн гэрэлд Алтай Таван Богдын оргил',
      }),
      seo: {
        _type: 'seo',
        title: {
          _type: 'localeString',
          en: 'Altai Expeditions · Amuun',
          ko: '알타이 원정 · Amuun',
          mn: 'Алтайн аялал · Amuun',
        },
        description: {
          _type: 'localeText',
          en: 'Guided expeditions to Mongolia highest range. Glacier trekking, Kazakh eagle hunter homestays, and summit pushes on Malchin Peak.',
          ko: '몽골 최고봉으로의 가이드 원정. 빙하 트레킹, 카자흐 매잡이 가정 방문, 말친 정상 등정.',
          mn: 'Монголын дээд уулсруу хөтлөгдөх аян. Мөсөн гол, казах бүргэдчийн гэрт хоноглох, Малчин оргилд гарах.',
        },
      },
    },
    {
      _id: 'destination-northern',
      _type: 'destination',
      title: {
        _type: 'localeString',
        en: 'Khuvsgul and Northern Taiga',
        ko: '흡스굴과 북부 타이가',
        mn: 'Хөвсгөл ба Хойд тайга',
      },
      slug: { _type: 'slug', current: 'khuvsgul' },
      subtitle: {
        _type: 'localeString',
        en: 'Northern Mongolia / Lake and Forest',
        ko: '북몽골 / 호수와 숲',
        mn: 'Хойд Монгол / Нуур ба ой',
      },
      region: 'northern',
      bestTime: {
        _type: 'localeString',
        en: 'June through September',
        ko: '6월부터 9월까지',
        mn: '6 сараас 9 сар хүртэл',
      },
      highlights: [
        {
          _type: 'localeString',
          en: 'Khuvsgul Dark Blue Pearl',
          ko: '흡스굴 검푸른 진주 호수',
          mn: 'Хөвсгөл нуурын хөх сувд',
        },
        { _type: 'localeString', en: 'Darkhad Valley', ko: '다르카드 계곡', mn: 'Дархадын хөндий' },
        {
          _type: 'localeString',
          en: 'Tsaatan reindeer herders',
          ko: '차탄 순록 유목민',
          mn: 'Цаатан иргэд',
        },
        { _type: 'localeString', en: 'Shamanic traditions', ko: '샤머니즘 전통', mn: 'Бөөгийн ёс' },
        { _type: 'localeString', en: 'Boreal forest wildlife', ko: '북방 숲 야생동물', mn: 'Тайгын зэрлэг амьтад' },
      ],
      heroImage: imageWithAlt(taiga, {
        en: 'Reindeer resting inside a Tsaatan camp in the northern taiga',
        ko: '북부 타이가의 차탄 캠프 안에서 쉬는 순록',
        mn: 'Хойд тайгын цаатны бууцанд амарч буй цаа буга',
      }),
      seo: {
        _type: 'seo',
        title: {
          _type: 'localeString',
          en: 'Khuvsgul Expeditions · Amuun',
          ko: '흡스굴 원정 · Amuun',
          mn: 'Хөвсгөлийн аялал · Amuun',
        },
        description: {
          _type: 'localeText',
          en: 'Boat crossings on Khuvsgul, horseback trails through the Darkhad Valley, and days with the Tsaatan reindeer herders.',
          ko: '흡스굴에서의 보트 횡단, 다르카드 계곡을 따라 말을 타고, 차탄 순록 유목민과 함께하는 날들.',
          mn: 'Хөвсгөлөөр завиар туулж, Дархадын хөндийд морь унан, Цаатан иргэдтэй цаг өнгөрөөх.',
        },
      },
    },
    {
      _id: 'destination-central',
      _type: 'destination',
      title: {
        _type: 'localeString',
        en: 'Kharkhorum and Orkhon Valley',
        ko: '하르허림과 오르혼 계곡',
        mn: 'Хархорум ба Орхоны хөндий',
      },
      slug: { _type: 'slug', current: 'kharkhorum' },
      subtitle: {
        _type: 'localeString',
        en: 'Central Mongolia / Ancient Capital',
        ko: '중앙 몽골 / 고대의 수도',
        mn: 'Төв Монгол / Эртний нийслэл',
      },
      region: 'central',
      bestTime: {
        _type: 'localeString',
        en: 'May through October',
        ko: '5월부터 10월까지',
        mn: '5 сараас 10 сар хүртэл',
      },
      highlights: [
        { _type: 'localeString', en: 'Erdene Zuu Monastery', ko: '에르덴 주 사원', mn: 'Эрдэнэ зуу хийд' },
        { _type: 'localeString', en: 'Orkhon Waterfall', ko: '오르혼 폭포', mn: 'Орхоны хүрхрээ' },
        { _type: 'localeString', en: 'Ancient capital ruins', ko: '고대 수도의 폐허', mn: 'Эртний нийслэлийн балгас' },
        { _type: 'localeString', en: 'Stone turtle monuments', ko: '돌거북 유적', mn: 'Чулуун яст мэлхий' },
        { _type: 'localeString', en: 'Karakorum Museum', ko: '카라코룸 박물관', mn: 'Харахорум музей' },
      ],
      heroImage: imageWithAlt(kharkhorum, {
        en: 'Ruins and monument stones near Kharkhorum at dusk',
        ko: '해질녘 하르허림 인근의 유적과 비석',
        mn: 'Үдшийн гэгээнд Хархорумын балгас ба хөшөө',
      }),
      seo: {
        _type: 'seo',
        title: {
          _type: 'localeString',
          en: 'Kharkhorum Expeditions · Amuun',
          ko: '하르허림 원정 · Amuun',
          mn: 'Хархорумын аялал · Amuun',
        },
        description: {
          _type: 'localeText',
          en: 'Walk the empire that remade the world. Erdene Zuu, the Orkhon waterfall, and the fields where Karakorum once stood.',
          ko: '세상을 다시 만든 제국을 걷다. 에르덴 주, 오르혼 폭포, 그리고 카라코룸이 서 있던 평원.',
          mn: 'Дэлхийг өөрчилсөн эзэнт гүрний газар. Эрдэнэ зуу, Орхоны хүрхрээ, Хархорум босч байсан талууд.',
        },
      },
    },
    {
      _id: 'destination-terelj',
      _type: 'destination',
      title: {
        _type: 'localeString',
        en: 'Gorkhi Terelj',
        ko: '고르히 테렐지',
        mn: 'Горхи Тэрэлж',
      },
      slug: { _type: 'slug', current: 'terelj' },
      subtitle: {
        _type: 'localeString',
        en: 'Eastern Mongolia / National Park',
        ko: '동몽골 / 국립공원',
        mn: 'Зүүн Монгол / Байгалийн цогцолбор газар',
      },
      region: 'terelj',
      bestTime: {
        _type: 'localeString',
        en: 'June through September and winter for ice festivals',
        ko: '6월부터 9월, 그리고 얼음 축제를 위한 겨울',
        mn: '6 сараас 9 сар, мөсөн баярын өвөл',
      },
      highlights: [
        { _type: 'localeString', en: 'Turtle Rock formation', ko: '거북 바위', mn: 'Мэлхий хад' },
        { _type: 'localeString', en: 'Aryabal Meditation Temple', ko: '아리아발 명상 사원', mn: 'Арьяабалын хийд' },
        { _type: 'localeString', en: 'Alpine meadows and ger camps', ko: '고산 초원과 게르 캠프', mn: 'Өндөр нутгийн бэлчээр ба гэр буудал' },
        { _type: 'localeString', en: 'Horseback riding trails', ko: '승마 트레일', mn: 'Морин аяллын зам' },
        { _type: 'localeString', en: 'Chinggis Khaan statue complex', ko: '칭기즈 칸 조각상 단지', mn: 'Чингис хааны хөшөөт цогцолбор' },
      ],
      heroImage: imageWithAlt(terelj, {
        en: 'Rock formations and alpine valley in Gorkhi Terelj',
        ko: '고르히 테렐지의 암석 지형과 고원 계곡',
        mn: 'Горхи Тэрэлжийн хаднууд ба уулын хөндий',
      }),
      seo: {
        _type: 'seo',
        title: {
          _type: 'localeString',
          en: 'Terelj Expeditions · Amuun',
          ko: '테렐지 원정 · Amuun',
          mn: 'Тэрэлжийн аялал · Amuun',
        },
        description: {
          _type: 'localeText',
          en: 'A short drive from Ulaanbaatar opens into alpine valleys, granite rock formations, and temples tucked into the hillsides.',
          ko: '울란바토르에서 잠시 달리면 고산 계곡, 화강암 바위, 그리고 언덕 속에 숨은 사원이 펼쳐진다.',
          mn: 'Улаанбаатараас богинохон замаар уулын хөндий, боржингийн хаднууд, уулын хажуугийн хийд нээгдэнэ.',
        },
      },
    },
  ];
}
