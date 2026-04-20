import { uploadLocalImage, imageWithAlt, UploadedAsset } from '../upload';

type Locale = { en: string; ko: string; mn: string };
type Meal = 'breakfast' | 'lunch' | 'dinner';

function lstr(v: Locale) {
  return { _type: 'localeString', ...v };
}
function ltext(v: Locale) {
  return { _type: 'localeText', ...v };
}
function ref(id: string) {
  return { _type: 'reference', _ref: id };
}

function imgAlt(asset: UploadedAsset, alt: Locale) {
  return imageWithAlt(asset, alt);
}

interface TourDayInput {
  day: number;
  title: Locale;
  description: Locale;
  accommodation?: Locale;
  meals?: Meal[];
}

function itineraryDay(d: TourDayInput) {
  return {
    _type: 'itineraryDay',
    _key: `day-${d.day}`,
    day: d.day,
    title: lstr(d.title),
    description: ltext(d.description),
    ...(d.accommodation ? { accommodation: lstr(d.accommodation) } : {}),
    ...(d.meals ? { meals: d.meals } : {}),
  };
}

export async function buildTours() {
  const gobi = await uploadLocalImage('gobi-crossing.jpg');
  const taiga = await uploadLocalImage('taiga-reindeer.jpg');
  const dunes = await uploadLocalImage('dunes-climb.jpg');
  const canyon = await uploadLocalImage('canyon-descent.jpg');
  const altai = await uploadLocalImage('altai-peaks.jpg');
  const volcano = await uploadLocalImage('volcano-lake.jpg');
  const karakorum = await uploadLocalImage('karakorum.jpg');
  const heroDesert = await uploadLocalImage('hero-desert.jpg');

  // helper to build a gallery entry
  const g = (img: UploadedAsset, alt: Locale) => ({
    ...imgAlt(img, alt),
    _key: `${Math.random().toString(36).slice(2, 10)}`,
  });

  const tours = [
    {
      _id: 'tour-gobi-crossing',
      _type: 'tour',
      title: lstr({
        en: 'Gobi Crossing',
        ko: '고비 횡단',
        mn: 'Говийн аялал',
      }),
      slug: { _type: 'slug', current: 'gobi-crossing' },
      summary: ltext({
        en: 'Nine days across the silent heart of the Gobi. Singing dunes, ice canyons, fossil cliffs, and nights beside a herder family under the clearest sky on earth.',
        ko: '고비의 고요한 심장을 가로지르는 9일. 노래하는 사구, 얼음 협곡, 화석 절벽, 그리고 지구에서 가장 맑은 하늘 아래 유목민 가족 곁에서 보내는 밤.',
        mn: 'Говийн нам гүм зүрхийг туулах ес хоногийн аялал. Дуулах манхан, мөсөн хавцал, чулуужсан хад, тэгээд дэлхийн хамгийн цэлмэг тэнгэр дор малчин айлд хоноглох шөнө.',
      }),
      heroImage: imgAlt(gobi, {
        en: 'Straight desert road in the Gobi at golden hour',
        ko: '황금빛 시간대 고비의 곧게 뻗은 사막 도로',
        mn: 'Нар жаргах үеийн Говийн шулуун зам',
      }),
      gallery: [
        g(gobi, { en: 'Desert road at dawn', ko: '새벽 사막 도로', mn: 'Үүрийн гэгээн дэх цөлийн зам' }),
        g(dunes, { en: 'Camel caravan on Khongoryn dunes', ko: '홍고린 사구의 낙타 행렬', mn: 'Хонгорын манхан дээрх тэмээний цуваа' }),
        g(canyon, { en: 'Red cliffs of Bayanzag at sunset', ko: '해질녘 바얀작의 붉은 절벽', mn: 'Үдшийн гэгээнд Баянзагийн улаан хад' }),
      ],
      duration: 9,
      difficulty: 'moderate',
      seasons: ['spring', 'summer', 'autumn'],
      included: [
        lstr({ en: 'Domestic flights Ulaanbaatar to Dalanzadgad', ko: '울란바토르-달란자드가드 국내선', mn: 'УБ-Даланзадгад дотоодын нислэг' }),
        lstr({ en: 'All accommodation and meals on expedition', ko: '원정 기간 전 숙박과 식사', mn: 'Аяллын бүх байр, хоол' }),
        lstr({ en: 'Private 4WD with driver', ko: '전용 4WD 차량과 기사', mn: 'Хувийн 4WD машин, жолоочтой' }),
        lstr({ en: 'English speaking lead guide', ko: '영어 구사 리드 가이드', mn: 'Англи хэлтэй ахлах хөтөч' }),
        lstr({ en: 'Park entrance fees', ko: '공원 입장료', mn: 'Байгалийн цогцолборын хураамж' }),
      ],
      excluded: [
        lstr({ en: 'International flights to Mongolia', ko: '몽골행 국제선', mn: 'Монгол руу ирэх олон улсын нислэг' }),
        lstr({ en: 'Travel insurance', ko: '여행자 보험', mn: 'Аяллын даатгал' }),
        lstr({ en: 'Alcohol and optional activities', ko: '주류 및 선택 액티비티', mn: 'Согтууруулах ундаа, нэмэлт үйл ажиллагаа' }),
      ],
      itinerary: [
        itineraryDay({
          day: 1,
          title: { en: 'Ulaanbaatar arrival', ko: '울란바토르 도착', mn: 'Улаанбаатарт ирэх' },
          description: {
            en: 'Welcome briefing at the Shangri La Ulaanbaatar. Evening walk through Sukhbaatar Square. Trip overview dinner.',
            ko: '샹그릴라 울란바토르에서 환영 브리핑. 저녁에는 수흐바타르 광장을 산책합니다. 일정 안내와 함께 환영 만찬.',
            mn: 'Шангри-Ла Улаанбаатарт угтах уулзалт. Оройдоо Сүхбаатарын талбайгаар явган алхана. Аяллын танилцуулга оройн зоог.',
          },
          accommodation: {
            en: 'Shangri La Ulaanbaatar',
            ko: '샹그릴라 울란바토르',
            mn: 'Шангри-Ла Улаанбаатар',
          },
          meals: ['dinner'],
        }),
        itineraryDay({
          day: 2,
          title: {
            en: 'Fly to the Gobi, Yolyn Am ice gorge',
            ko: '고비로 이동, 욜린 암 얼음 협곡',
            mn: 'Говь руу нислэг, Ёлын амны хавцал',
          },
          description: {
            en: 'Morning flight to Dalanzadgad. Drive into Gurvan Saikhan National Park to hike Yolyn Am, a narrow ice bearing canyon that holds glacier into July.',
            ko: '오전 달란자드가드 비행 후 구르반 사이항 국립공원으로 이동. 7월까지도 빙하가 남아있는 좁은 얼음 협곡 욜린 암 하이킹.',
            mn: 'Өглөө Даланзадгад руу нислэг. Говь гурван сайхан цогцолборт хүрч, 7 сар хүртэл мөсний үлдэгдэлтэй нарийн Ёлын амны хавцлаар явган аялна.',
          },
          accommodation: {
            en: 'Three Camel Lodge boutique ger camp',
            ko: '쓰리 카멜 로지 부티크 게르 캠프',
            mn: 'Three Camel Lodge гэр буудал',
          },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 3,
          title: {
            en: 'Khongoryn Els singing dunes',
            ko: '홍고린 엘스 노래하는 사구',
            mn: 'Хонгорын элс',
          },
          description: {
            en: 'Drive west to the three hundred meter dunes of Khongoryn. Late afternoon camel ride with a local herder, sunset ascent on foot.',
            ko: '서쪽으로 이동해 홍고린의 300m 사구로 향합니다. 오후 늦게 현지 유목민과 낙타 라이딩, 일몰에 맞춰 도보로 등정합니다.',
            mn: 'Баруун тийш хөдөлж Хонгорын 300 метрийн манхныг зорино. Орой болоход малчинтай тэмээн тууранд, нар жаргахад явганаар оргилд гарна.',
          },
          accommodation: {
            en: 'Gobi Discovery Camp',
            ko: '고비 디스커버리 캠프',
            mn: 'Gobi Discovery Camp гэр буудал',
          },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 4,
          title: {
            en: 'Herder family day',
            ko: '유목민 가정 체험',
            mn: 'Малчин айлын өдөр',
          },
          description: {
            en: 'Morning with a two humped camel breeding family. Learn airag and aaruul preparation. Afternoon drive to a quiet ger camp near the dunes.',
            ko: '오전에는 쌍봉낙타 번식 가정을 방문해 아이락과 아루울 만드는 법을 배웁니다. 오후에는 사구 인근의 조용한 게르 캠프로 이동.',
            mn: 'Өглөө хоёр бөхт тэмээ маллаж буй айлд очно. Айраг, ааруул хийх аргыг мэдэж авна. Үдээс хойш манхны ойролцоо нам гүм гэр буудал руу.',
          },
          accommodation: { en: 'Private nomadic ger', ko: '유목민 게르(프라이빗)', mn: 'Хаалттай уламжлалт гэр' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 5,
          title: {
            en: 'Bayanzag flaming cliffs',
            ko: '바얀작 붉은 절벽',
            mn: 'Баянзагийн улаан хад',
          },
          description: {
            en: 'Drive to the flaming cliffs where Roy Chapman Andrews unearthed the first dinosaur egg fossils. Walk the rim at golden hour with a paleontology briefing.',
            ko: '로이 채프먼 앤드루스가 최초로 공룡 알 화석을 발굴한 붉은 절벽으로 이동. 고생물학 해설과 함께 황금빛 시간대에 절벽 산책.',
            mn: 'Рой Чапман Эндрюс анх үлэг гүрвэлийн өндөгний чулуужсан ясыг олсон улаан хаднууд руу. Алтан гэгээнд хадны ирмэгээр палеонтологичны тайлбартай алхана.',
          },
          accommodation: { en: 'Three Camel Lodge', ko: '쓰리 카멜 로지', mn: 'Three Camel Lodge' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 6,
          title: {
            en: 'Tsagaan Suvarga white stupa',
            ko: '차간 수바르가 백색 스투파',
            mn: 'Цагаан суварга',
          },
          description: {
            en: 'Long drive across open steppe to the striped cliffs of Tsagaan Suvarga, an ancient seabed exposed by wind.',
            ko: '광활한 초원을 가로질러 바람에 드러난 고대 해저, 차간 수바르가의 줄무늬 절벽으로 향합니다.',
            mn: 'Уудам талаар удаан жолоодож, салхинд нээгдсэн эртний далайн ёроол болох Цагаан сувргын судалтай хаднууд хүрнэ.',
          },
          accommodation: { en: 'Desert ger camp', ko: '사막 게르 캠프', mn: 'Цөлийн гэр буудал' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 7,
          title: {
            en: 'Arkhangai steppe transition',
            ko: '아르항가이 초원 이동',
            mn: 'Архангайн тал нутаг руу шилжих' ,
          },
          description: {
            en: 'Drive north from the desert into high steppe. Stop for lunch with a horse breeding family.',
            ko: '사막을 떠나 북쪽으로 이동하며 고원 초지로 들어섭니다. 말 목축 가정에서 점심을 먹습니다.',
            mn: 'Цөлөөс хойш уулын тал руу явна. Үдийн хоолыг адуу маллаж буй айлд зооглоно.',
          },
          accommodation: { en: 'Arkhangai ger camp', ko: '아르항가이 게르 캠프', mn: 'Архангайн гэр буудал' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 8,
          title: {
            en: 'Return to Ulaanbaatar',
            ko: '울란바토르 복귀',
            mn: 'Улаанбаатар руу буцах',
          },
          description: {
            en: 'Flight back to the capital. Afternoon rest. Farewell dinner at a private Mongolian fine dining restaurant.',
            ko: '수도로 돌아가는 항공편. 오후 휴식. 저녁에는 프라이빗 몽골 파인 다이닝 레스토랑에서 작별 만찬.',
            mn: 'Нислэгээр нийслэл рүү эргэн ирнэ. Үдээс хойш амралт. Оройдоо хаалттай Монгол fine dining зоогийн газарт үдэлтийн зоог.',
          },
          accommodation: { en: 'Shangri La Ulaanbaatar', ko: '샹그릴라 울란바토르', mn: 'Шангри-Ла Улаанбаатар' },
          meals: ['breakfast', 'dinner'],
        }),
        itineraryDay({
          day: 9,
          title: { en: 'Departure', ko: '출국', mn: 'Буцах өдөр' },
          description: {
            en: 'Private transfer to Chinggis Khaan International Airport.',
            ko: '칭기즈 칸 국제공항으로 프라이빗 이동.',
            mn: 'Чингис хаан олон улсын нисэх буудал руу хаалттай шилжүүлэг.',
          },
          meals: ['breakfast'],
        }),
      ],
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 3200,
        deluxe: 5400,
        private: 9800,
        notes: ltext({
          en: 'Pricing based on double occupancy. Single supplement 20 percent.',
          ko: '2인실 기준 가격입니다. 1인실 추가금 20%.',
          mn: 'Хоёр хүний өрөөний үнэ. Ганц хүний нэмэгдэл 20 хувь.',
        }),
      },
      destinations: [ref('destination-gobi')],
      faqs: [ref('faq-booking-1'), ref('faq-during-1'), ref('faq-during-3')],
      featured: true,
      order: 1,
      publishedAt: new Date('2026-02-10T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'Gobi Crossing Expedition · Amuun',
          ko: '고비 횡단 원정 · Amuun',
          mn: 'Говийн аялал · Amuun',
        }),
        description: ltext({
          en: 'Nine day private expedition across the Gobi. Ice canyons, singing dunes, fossil cliffs, herder family hospitality.',
          ko: '고비를 가로지르는 9일간의 프라이빗 원정. 얼음 협곡, 노래하는 사구, 화석 절벽, 유목민 가정의 환대.',
          mn: 'Говийг туулах 9 хоногийн хаалттай аялал. Мөсөн хавцал, дуулах манхан, чулуужсан хад, малчин айлын зочломтгой уур амьсгал.',
        }),
      },
    },
    {
      _id: 'tour-reindeer-camp',
      _type: 'tour',
      title: lstr({
        en: 'Reindeer Camp with the Tsaatan',
        ko: '차탄과 함께하는 순록 캠프',
        mn: 'Цаатны бууц дахь аялал',
      }),
      slug: { _type: 'slug', current: 'reindeer-camp' },
      summary: ltext({
        en: 'Ten days into the northern Taiga. Boat across Lake Khuvsgul, ride horses through the Darkhad Valley, and live three days beside a Tsaatan family in their reindeer camp.',
        ko: '북부 타이가로 떠나는 10일. 흡스굴 호수를 보트로 건너고 다르카드 계곡을 말로 지나 차탄 가족의 순록 캠프에서 3일을 함께 지냅니다.',
        mn: 'Хойд тайга руу 10 хоног. Хөвсгөлийг завиар гатлан, Дархадын хөндийгөөр морь унаж, Цаатан айлын бууцанд гурав хоног хамт амьдарна.',
      }),
      heroImage: imgAlt(taiga, {
        en: 'Reindeer resting inside a Tsaatan ortz tent',
        ko: '차탄 오르츠 텐트 안에서 쉬는 순록',
        mn: 'Цаатны урцан дотор амарч буй цаа буга',
      }),
      gallery: [
        g(taiga, { en: 'Tsaatan ortz tents under forest', ko: '숲 아래 차탄 오르츠', mn: 'Ойн дор Цаатны урц' }),
        g(volcano, { en: 'White lake of Khorgo in summer', ko: '여름의 호르고 하얀 호수', mn: 'Зуны Хорго Цагаан нуур' }),
        g(karakorum, { en: 'Alpine steppe in Khuvsgul province', ko: '흡스굴 아이막의 고산 초원', mn: 'Хөвсгөл аймгийн уулын тал' }),
      ],
      duration: 10,
      difficulty: 'challenging',
      seasons: ['summer', 'autumn'],
      included: [
        lstr({ en: 'Domestic flights UB Murun round trip', ko: 'UB-무룬 왕복 국내선', mn: 'УБ-Мөрөн буцах нислэг' }),
        lstr({ en: 'Private 4WD transfer and boat crossing', ko: '프라이빗 4WD 및 보트 횡단', mn: 'Хаалттай 4WD, завиар гатлалт' }),
        lstr({ en: 'Three nights with Tsaatan host family', ko: '차탄 호스트 가족과 3박', mn: 'Цаатан айлд гурав хоног' }),
        lstr({ en: 'Horses and pack mounts', ko: '승용 및 짐마', mn: 'Унаа, ачааны морь' }),
        lstr({ en: 'Cultural programs lead (Saraa)', ko: '문화 프로그램 리드(사라)', mn: 'Соёлын хөтөлбөрийн удирдагч (Сараа)' }),
      ],
      excluded: [
        lstr({ en: 'International flights', ko: '국제선 항공편', mn: 'Олон улсын нислэг' }),
        lstr({ en: 'Travel insurance', ko: '여행자 보험', mn: 'Аяллын даатгал' }),
        lstr({ en: 'Personal equipment rental', ko: '개인 장비 대여', mn: 'Хувийн хэрэгсэл, түрээс' }),
      ],
      itinerary: [
        itineraryDay({
          day: 1,
          title: { en: 'Ulaanbaatar arrival', ko: '울란바토르 도착', mn: 'Улаанбаатарт ирэх' },
          description: { en: 'Welcome briefing and equipment check at the hotel.', ko: '호텔에서 환영 브리핑과 장비 점검.', mn: 'Зочид буудалд угтах уулзалт, тоног төхөөрөмжийн шалгалт.' },
          accommodation: { en: 'Shangri La Ulaanbaatar', ko: '샹그릴라 울란바토르', mn: 'Шангри-Ла Улаанбаатар' },
          meals: ['dinner'],
        }),
        itineraryDay({
          day: 2,
          title: { en: 'Fly to Murun, drive to Khatgal', ko: '무룬 비행, 하트갈 이동', mn: 'Мөрөн рүү нислэг, Хатгал руу жолоо' },
          description: { en: 'Morning flight to Murun. Drive north to Khatgal on the southern tip of Khuvsgul.', ko: '오전 무룬행 비행편 후 흡스굴 남단 하트갈로 북상.', mn: 'Өглөө Мөрөн рүү нислэг. Хөвсгөлийн урд хойгийн Хатгал руу хойш жолоо.' },
          accommodation: { en: 'Khatgal lakeside ger camp', ko: '하트갈 호숫가 게르', mn: 'Хатгалын нуурын эрэг дэх гэр буудал' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 3,
          title: { en: 'Boat across Khuvsgul', ko: '흡스굴 호수 보트 횡단', mn: 'Хөвсгөлөөр завиар гатлах' },
          description: { en: 'Full day crossing of the lake on a private charter. Disembark at Khankh on the northern shore.', ko: '프라이빗 보트로 호수 횡단 하루 소요. 북쪽 기슭 한흐에서 하선.', mn: 'Тусгайлсан завиар нуурыг өдөржин гатална. Хойд эрэгтэй Ханхад буух.' },
          accommodation: { en: 'Khankh shore camp', ko: '한흐 해안 캠프', mn: 'Ханхын эрэг дэх буудал' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 4,
          title: { en: 'Darkhad Valley entry', ko: '다르카드 계곡 진입', mn: 'Дархадын хөндийд орох' },
          description: { en: 'Drive west into the Darkhad depression and switch to horses at the trailhead.', ko: '서쪽 다르카드 분지로 이동해 트레킹 출발점에서 말로 환승.', mn: 'Баруун тийш Дархадын хотгор руу ороод, морины тохиргоонд шилжинэ.' },
          accommodation: { en: 'Wilderness camp', ko: '야영지', mn: 'Байгалийн буудал' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 5,
          title: { en: 'Horseback to the Tsaatan camp', ko: '차탄 캠프로 말을 타고 이동', mn: 'Морин аялал, Цаатны бууц руу' },
          description: { en: 'Full day ride through alpine forest and marsh to the West Tsaatan camp.', ko: '하루 종일 고산 침엽수림과 습지를 가로질러 서부 차탄 캠프로.', mn: 'Өдөржин ой, намгийг даван баруун цаатны бууцыг зорино.' },
          accommodation: { en: 'Ortz with Tsaatan family', ko: '차탄 가족의 오르츠', mn: 'Цаатан айлын урц' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 6,
          title: { en: 'Life with the reindeer', ko: '순록과 함께하는 하루', mn: 'Цаа бугатай өдөр' },
          description: { en: 'Full day in camp. Learn reindeer milking, smoking fish, and the annual migration calendar from elders.', ko: '캠프에서 하루. 순록 젖 짜기, 생선 훈제, 연간 이동 일정을 어르신들로부터 배웁니다.', mn: 'Бууцанд өдөржин. Цаа буга саах, загас утах, жил жилийн нүүдлийн хуваарийг ахмадуудаас суралцана.' },
          accommodation: { en: 'Ortz with Tsaatan family', ko: '차탄 가족의 오르츠', mn: 'Цаатан айлын урц' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 7,
          title: { en: 'Evening shamanic ceremony', ko: '저녁 샤먼 의식', mn: 'Орой бөөгийн ёслол' },
          description: { en: 'Optional participation in an evening ceremony with a local shaman.', ko: '현지 샤먼과 함께하는 저녁 의식 선택 참여.', mn: 'Нутгийн бөөтэй оройн ёслолд сайн дураараа оролцох боломж.' },
          accommodation: { en: 'Ortz with Tsaatan family', ko: '차탄 가족의 오르츠', mn: 'Цаатан айлын урц' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 8,
          title: { en: 'Ride out and transfer', ko: '하산 및 이동', mn: 'Бууцаас гарах, шилжилт' },
          description: { en: 'Ride back to the trailhead, drive to Khankh, cross the lake in the late afternoon.', ko: '트레킹 출발점으로 돌아가 한흐로 이동, 오후 늦게 호수 횡단.', mn: 'Бууцнаас гарч Ханх, орой нуурыг дахин гатална.' },
          accommodation: { en: 'Khatgal lakeside ger camp', ko: '하트갈 호숫가 게르', mn: 'Хатгалын гэр буудал' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 9,
          title: { en: 'Murun, flight to Ulaanbaatar', ko: '무룬, 울란바토르 비행', mn: 'Мөрөн, УБ руу нислэг' },
          description: { en: 'Drive south to Murun, afternoon flight to the capital, farewell dinner.', ko: '남쪽 무룬으로 이동 후 오후 수도 비행, 작별 만찬.', mn: 'Урагш Мөрөн, үдээс хойш Улаанбаатар руу нислэг, үдэлтийн зоог.' },
          accommodation: { en: 'Shangri La Ulaanbaatar', ko: '샹그릴라 울란바토르', mn: 'Шангри-Ла Улаанбаатар' },
          meals: ['breakfast', 'dinner'],
        }),
        itineraryDay({
          day: 10,
          title: { en: 'Departure', ko: '출국', mn: 'Буцах өдөр' },
          description: { en: 'Private transfer to the airport.', ko: '공항으로 프라이빗 이동.', mn: 'Нисэх буудал руу хаалттай шилжүүлэг.' },
          meals: ['breakfast'],
        }),
      ],
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 3800,
        deluxe: 6200,
        private: 11400,
        notes: ltext({
          en: 'Horses included. Reindeer herder family compensation paid directly by Amuun at fair community rates.',
          ko: '말은 포함입니다. 차탄 가족에게 지급되는 호스팅 비용은 Amuun이 지역 공정 기준에 따라 직접 지급합니다.',
          mn: 'Морь багтсан. Цаатан айлд төлөх шимтгэлийг Amuun нь шударга нийгмийн үнээр шууд төлдөг.',
        }),
      },
      destinations: [ref('destination-northern')],
      faqs: [ref('faq-during-2'), ref('faq-booking-1'), ref('faq-visa-3')],
      featured: true,
      order: 2,
      publishedAt: new Date('2026-02-12T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'Reindeer Camp Expedition · Amuun',
          ko: '순록 캠프 원정 · Amuun',
          mn: 'Цаатны аялал · Amuun',
        }),
        description: ltext({
          en: 'Ten day private expedition into the northern Taiga with the Tsaatan reindeer herders.',
          ko: '북부 타이가의 차탄 순록 유목민과 함께하는 10일 프라이빗 원정.',
          mn: 'Хойд тайгын Цаатан иргэдтэй хамт 10 хоногийн хаалттай аялал.',
        }),
      },
    },
    {
      _id: 'tour-singing-dunes',
      _type: 'tour',
      title: lstr({
        en: 'Singing Dunes · Khongoryn',
        ko: '노래하는 사구 · 홍고린',
        mn: 'Дуулах элс · Хонгорын',
      }),
      slug: { _type: 'slug', current: 'singing-dunes' },
      summary: ltext({
        en: 'Seven slow days at the Khongoryn sand sea. Camel caravans, family stays, and evenings on top of the dunes as the wind finds its note.',
        ko: '홍고린 모래 바다에서 보내는 느리게 흐르는 7일. 낙타 카라반, 가족 체험, 그리고 바람이 제 음을 찾는 사구 위에서의 저녁.',
        mn: 'Хонгорын элсэн далайд долоо хоногийн тайван аялал. Тэмээн цуваа, айлд хонох, манхны дээр салхи аялгуугаа олох орой.',
      }),
      heroImage: imgAlt(dunes, {
        en: 'Camel caravan ascending the Khongoryn dunes',
        ko: '홍고린 사구를 오르는 낙타 카라반',
        mn: 'Хонгорын элсэн манхан руу авирч буй тэмээн цуваа',
      }),
      gallery: [
        g(dunes, { en: 'Camels at golden hour', ko: '황금빛 시간의 낙타', mn: 'Алтан цагийн тэмээ' }),
        g(gobi, { en: 'Open road into the Gobi', ko: '고비로 이어진 길', mn: 'Говь руу тэмүүлэх зам' }),
        g(heroDesert, { en: 'Road at sunset', ko: '해질녘의 도로', mn: 'Нар жаргах зам' }),
      ],
      duration: 7,
      difficulty: 'easy',
      seasons: ['spring', 'summer', 'autumn'],
      included: [
        lstr({ en: 'Domestic flights and transfers', ko: '국내선 및 이동', mn: 'Дотоодын нислэг ба шилжүүлэг' }),
        lstr({ en: 'Camel caravan with herder', ko: '유목민과 낙타 카라반', mn: 'Малчинтай тэмээн цуваа' }),
        lstr({ en: 'All meals and water', ko: '전 식사와 식수', mn: 'Бүх хоол ба цэвэр ус' }),
      ],
      excluded: [
        lstr({ en: 'International flights', ko: '국제선', mn: 'Олон улсын нислэг' }),
        lstr({ en: 'Tips', ko: '팁', mn: 'Шагнал мөнгө' }),
      ],
      itinerary: [
        itineraryDay({
          day: 1,
          title: { en: 'Ulaanbaatar arrival', ko: '울란바토르 도착', mn: 'Улаанбаатарт ирэх' },
          description: { en: 'Arrive, brief, rest.', ko: '도착, 브리핑, 휴식.', mn: 'Ирэх, товч танилцуулга, амрах.' },
          accommodation: { en: 'Shangri La Ulaanbaatar', ko: '샹그릴라 울란바토르', mn: 'Шангри-Ла Улаанбаатар' },
          meals: ['dinner'],
        }),
        itineraryDay({
          day: 2,
          title: { en: 'Fly to Dalanzadgad', ko: '달란자드가드 비행', mn: 'Даланзадгадад нислэг' },
          description: { en: 'Morning flight, drive toward the dunes.', ko: '오전 비행 후 사구로 이동.', mn: 'Өглөө нислэг, манхан руу жолоо.' },
          accommodation: { en: 'Gobi Discovery Camp', ko: '고비 디스커버리 캠프', mn: 'Gobi Discovery Camp' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 3,
          title: { en: 'Camel caravan and dune ascent', ko: '낙타 카라반과 사구 등정', mn: 'Тэмээн цуваа, манханд авирах' },
          description: { en: 'Ride camels to the dune base, ascend in the late afternoon.', ko: '낙타를 타고 사구 기슭에 이른 뒤 늦은 오후에 등정.', mn: 'Тэмээгээр манхны бэл хүрч, орой нь оргилд гарна.' },
          accommodation: { en: 'Gobi Discovery Camp', ko: '고비 디스커버리 캠프', mn: 'Gobi Discovery Camp' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 4,
          title: { en: 'Herder family day', ko: '유목민 가정 체험', mn: 'Малчин айлын өдөр' },
          description: { en: 'Afternoon learning traditional dairy preparation.', ko: '오후에는 전통 유제품 제조 방법을 배웁니다.', mn: 'Үдээс хойш уламжлалт цагаан идээ хийхийг сурна.' },
          accommodation: { en: 'Nomadic family ger', ko: '유목민 가정 게르', mn: 'Малчин айлын гэр' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 5,
          title: { en: 'Yolyn Am day trip', ko: '욜린 암 일일 투어', mn: 'Ёлын амны өдрийн аялал' },
          description: { en: 'Drive to the ice gorge and hike the narrow canyon.', ko: '얼음 협곡으로 이동해 좁은 골짜기를 하이킹.', mn: 'Мөсөн хавцал хүрч, нарийн хавцлаар явганаар аялна.' },
          accommodation: { en: 'Three Camel Lodge', ko: '쓰리 카멜 로지', mn: 'Three Camel Lodge' },
          meals: ['breakfast', 'lunch', 'dinner'],
        }),
        itineraryDay({
          day: 6,
          title: { en: 'Return to Ulaanbaatar', ko: '울란바토르 복귀', mn: 'Улаанбаатарт буцах' },
          description: { en: 'Flight back, evening at leisure.', ko: '비행편으로 복귀, 저녁은 자유.', mn: 'Нислэгээр буцаж, оройн цагаар чөлөөтэй.' },
          accommodation: { en: 'Shangri La Ulaanbaatar', ko: '샹그릴라 울란바토르', mn: 'Шангри-Ла Улаанбаатар' },
          meals: ['breakfast'],
        }),
        itineraryDay({
          day: 7,
          title: { en: 'Departure', ko: '출국', mn: 'Буцах өдөр' },
          description: { en: 'Transfer to the airport.', ko: '공항으로 이동.', mn: 'Нисэх буудал руу шилжүүлэг.' },
          meals: ['breakfast'],
        }),
      ],
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 2400,
        deluxe: 4200,
        private: 7600,
        notes: ltext({
          en: 'Shortest Gobi itinerary. Excellent introduction to the desert region.',
          ko: '가장 짧은 고비 일정. 사막 지역 입문에 적합.',
          mn: 'Говийн хамгийн богино аялал. Цөлийн бүсийг анх удаа үзэхэд тохиромжтой.',
        }),
      },
      destinations: [ref('destination-gobi')],
      faqs: [ref('faq-general-3'), ref('faq-booking-1')],
      featured: false,
      order: 3,
      publishedAt: new Date('2026-02-14T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'Singing Dunes · Amuun',
          ko: '노래하는 사구 · Amuun',
          mn: 'Дуулах элс · Amuun',
        }),
        description: ltext({
          en: 'Seven day expedition focused on Khongoryn sand dunes and the herder families that live beside them.',
          ko: '홍고린 사구와 그 곁에서 살아가는 유목민 가정에 초점을 맞춘 7일 원정.',
          mn: 'Хонгорын манхан болон тэндэхийн малчин айлуудыг төвлөрүүлсэн 7 хоногийн аялал.',
        }),
      },
    },
    {
      _id: 'tour-khermen-canyon',
      _type: 'tour',
      title: lstr({
        en: 'Khermen Tsav Canyon Trek',
        ko: '헤르멘 차브 협곡 트레킹',
        mn: 'Хэрмэн цавын аялал',
      }),
      slug: { _type: 'slug', current: 'khermen-canyon' },
      summary: ltext({
        en: 'Eight days in the Mongolian Grand Canyon. Red cliff walks, fossil forests, and two nights under stars where no ambient light reaches.',
        ko: '몽골 그랜드 캐니언에서 보내는 8일. 붉은 절벽 트레킹, 화석 숲, 그리고 인공 빛이 닿지 않는 두 번의 별빛 아래 밤.',
        mn: 'Монголын Гранд каньонд найм хоног. Улаан хадаар алхах, чулуужсан ойд очих, хотын гэрэл хүрэхгүй хоёр шөнийг оддын дор өнгөрөөх.',
      }),
      heroImage: imgAlt(canyon, {
        en: 'Red cliff labyrinth of Khermen Tsav',
        ko: '헤르멘 차브의 붉은 절벽 미로',
        mn: 'Хэрмэн цавын улаан хадан лабиринт',
      }),
      gallery: [
        g(canyon, { en: 'Red cliff walls', ko: '붉은 절벽 벽', mn: 'Улаан хадан хана' }),
        g(gobi, { en: 'Desert approach road', ko: '사막 진입 도로', mn: 'Цөл рүү ойртох зам' }),
        g(dunes, { en: 'Dunes on horizon', ko: '지평선 위 사구', mn: 'Тэнгэрийн хаяа дах манхан' }),
      ],
      duration: 8,
      difficulty: 'challenging',
      seasons: ['spring', 'summer', 'autumn'],
      included: [
        lstr({ en: 'All flights and 4WD transport', ko: '전 항공편 및 4WD 이동', mn: 'Бүх нислэг, 4WD тээвэр' }),
        lstr({ en: 'Two nights wilderness tent camp', ko: '야영 2박', mn: 'Хоёр шөнө байгалийн майхан' }),
        lstr({ en: 'Paleontology briefing with specialist', ko: '전문가의 고생물학 해설', mn: 'Мэргэжилтэнтэй палеонтологийн танилцуулга' }),
      ],
      excluded: [
        lstr({ en: 'International flights', ko: '국제선', mn: 'Олон улсын нислэг' }),
        lstr({ en: 'Sleeping bag rental optional', ko: '침낭 대여는 선택', mn: 'Унтлагын цүнхний түрээс сонголттой' }),
      ],
      itinerary: Array.from({ length: 8 }, (_, i) => {
        const day = i + 1;
        const map: Record<number, { title: Locale; desc: Locale; stay?: Locale; meals?: Meal[] }> = {
          1: {
            title: { en: 'Ulaanbaatar arrival', ko: '울란바토르 도착', mn: 'Улаанбаатарт ирэх' },
            desc: { en: 'Evening briefing.', ko: '저녁 브리핑.', mn: 'Оройн танилцуулга.' },
            stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' },
            meals: ['dinner'],
          },
          2: {
            title: { en: 'Fly to Dalanzadgad, drive south', ko: '달란자드가드 비행, 남쪽으로', mn: 'Даланзадгадад, урагш жолоо' },
            desc: { en: 'Long drive to the canyon edge.', ko: '캐니언 가장자리까지 장거리 이동.', mn: 'Хавцлын ирмэг хүртэл удаан жолоо.' },
            stay: { en: 'Wilderness camp', ko: '야영지', mn: 'Байгалийн буудал' },
            meals: ['breakfast', 'lunch', 'dinner'],
          },
          3: {
            title: { en: 'North rim walk', ko: '북쪽 가장자리 트레킹', mn: 'Хойд ирмэгээр алхах' },
            desc: { en: 'Full day hike along the northern cliff line.', ko: '북쪽 절벽 라인을 따라 하루 종일 하이킹.', mn: 'Хойд хадан ирмэгийн дагуу өдөржин явган аялал.' },
            stay: { en: 'Wilderness camp', ko: '야영지', mn: 'Байгалийн буудал' },
            meals: ['breakfast', 'lunch', 'dinner'],
          },
          4: {
            title: { en: 'South rim and fossil beds', ko: '남쪽 가장자리와 화석 지대', mn: 'Өмнөд ирмэг, чулуужсан орд' },
            desc: { en: 'Guided walk with paleontologist.', ko: '고생물학자 동행 가이드 산책.', mn: 'Палеонтологичтай хамтарсан алхалт.' },
            stay: { en: 'Wilderness camp', ko: '야영지', mn: 'Байгалийн буудал' },
            meals: ['breakfast', 'lunch', 'dinner'],
          },
          5: {
            title: { en: 'Descend into the canyon', ko: '협곡 하강', mn: 'Хавцал руу уруудах' },
            desc: { en: 'Full day in the labyrinth floor.', ko: '미로 같은 계곡 바닥에서 하루를 보냅니다.', mn: 'Өдөржин хавцлын ёроолын лабиринтэд.' },
            stay: { en: 'Wilderness camp', ko: '야영지', mn: 'Байгалийн буудал' },
            meals: ['breakfast', 'lunch', 'dinner'],
          },
          6: {
            title: { en: 'Transition toward dunes', ko: '사구 방향 이동', mn: 'Манхан руу шилжилт' },
            desc: { en: 'Drive to Khongoryn Els for a final Gobi night.', ko: '마지막 고비 밤을 위해 홍고린 엘스로 이동.', mn: 'Говийн сүүлчийн шөнөд Хонгорын элс рүү.' },
            stay: { en: 'Ger camp', ko: '게르 캠프', mn: 'Гэр буудал' },
            meals: ['breakfast', 'lunch', 'dinner'],
          },
          7: {
            title: { en: 'Return to Ulaanbaatar', ko: '울란바토르 복귀', mn: 'Улаанбаатарт буцах' },
            desc: { en: 'Flight back, farewell dinner.', ko: '비행 복귀, 작별 만찬.', mn: 'Нислэгээр буцаж, үдэлтийн зоог.' },
            stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' },
            meals: ['breakfast', 'dinner'],
          },
          8: {
            title: { en: 'Departure', ko: '출국', mn: 'Буцах' },
            desc: { en: 'Airport transfer.', ko: '공항 이동.', mn: 'Нисэх буудал.' },
            meals: ['breakfast'],
          },
        };
        return itineraryDay({
          day,
          title: map[day]!.title,
          description: map[day]!.desc,
          accommodation: map[day]!.stay,
          meals: map[day]!.meals,
        });
      }),
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 3600,
        deluxe: 5800,
        private: 10200,
        notes: ltext({
          en: 'Backcountry expedition. Physical fitness assessment required.',
          ko: '오지 원정. 사전 체력 평가 필수.',
          mn: 'Хөдөөний аялал. Биеийн чадлын үнэлгээ шаардлагатай.',
        }),
      },
      destinations: [ref('destination-gobi')],
      faqs: [ref('faq-general-3'), ref('faq-during-2')],
      featured: false,
      order: 4,
      publishedAt: new Date('2026-02-16T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'Khermen Tsav Canyon Trek · Amuun',
          ko: '헤르멘 차브 트레킹 · Amuun',
          mn: 'Хэрмэн цавын аялал · Amuun',
        }),
        description: ltext({
          en: 'Eight days deep in the Mongolian Grand Canyon with paleontology briefings and two nights under unlit skies.',
          ko: '몽골 그랜드 캐니언의 깊은 곳에서 보내는 8일, 고생물학 해설과 빛 없는 두 번의 밤.',
          mn: 'Монголын Гранд каньонд найман хоног. Палеонтологийн танилцуулга, хотын гэрэлгүй хоёр шөнө.',
        }),
      },
    },
    {
      _id: 'tour-five-peaks',
      _type: 'tour',
      title: lstr({
        en: 'Altai Five Peaks',
        ko: '알타이 다섯 봉우리',
        mn: 'Алтайн Таван Богд',
      }),
      slug: { _type: 'slug', current: 'altai-five-peaks' },
      summary: ltext({
        en: 'Twelve days in Mongolia highest range. Potanin Glacier, Kazakh eagle hunter homestays, and a summit push on Malchin Peak for those who can.',
        ko: '몽골 최고봉에서 보내는 12일. 포타닌 빙하, 카자흐 매잡이 가정, 그리고 체력이 허락되면 말친 정상 등정.',
        mn: 'Монголын дээд уулсад 12 хоног. Потанины мөсөн гол, казах бүргэдчийн гэрт хоноглох, боломжтой зочдод Малчин оргилын туулалт.',
      }),
      heroImage: imgAlt(altai, {
        en: 'Tavan Bogd peaks under morning light',
        ko: '아침 빛 아래 타반 복드 봉우리',
        mn: 'Өглөөний туяан дор Таван Богдын оргилууд',
      }),
      gallery: [
        g(altai, { en: 'Glacial peaks', ko: '빙하 봉우리', mn: 'Мөсөн голын оргилууд' }),
        g(heroDesert, { en: 'Approach road', ko: '진입 도로', mn: 'Ойртох зам' }),
        g(volcano, { en: 'Alpine lake', ko: '고산 호수', mn: 'Уулын нуур' }),
      ],
      duration: 12,
      difficulty: 'expert',
      seasons: ['summer'],
      included: [
        lstr({ en: 'All domestic flights', ko: '국내선 전부', mn: 'Бүх дотоод нислэг' }),
        lstr({ en: 'UIAGM certified lead guide', ko: 'UIAGM 인증 리드 가이드', mn: 'UIAGM-ийн гэрчилгээтэй ахлах хөтөч' }),
        lstr({ en: 'Glacier equipment and technical gear', ko: '빙하 장비 및 기술 장비', mn: 'Мөсөн гол, техникийн тоног' }),
        lstr({ en: 'Kazakh eagle hunter family homestay', ko: '카자흐 매잡이 가정 홈스테이', mn: 'Казах бүргэдчийн гэрт хоноглох' }),
      ],
      excluded: [
        lstr({ en: 'International flights', ko: '국제선', mn: 'Олон улсын нислэг' }),
        lstr({ en: 'Personal mountaineering insurance', ko: '개인 등산 보험', mn: 'Уулын спортын хувийн даатгал' }),
      ],
      itinerary: Array.from({ length: 12 }, (_, i) => {
        const day = i + 1;
        const mapDay: Record<number, { title: Locale; desc: Locale; stay?: Locale; meals?: Meal[] }> = {
          1: { title: { en: 'UB arrival', ko: 'UB 도착', mn: 'УБ ирэх' }, desc: { en: 'Equipment check.', ko: '장비 점검.', mn: 'Тоног хэрэгсэл шалгах.' }, stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' }, meals: ['dinner'] },
          2: { title: { en: 'Fly to Olgii', ko: '울기 비행', mn: 'Өлгий нислэг' }, desc: { en: 'Afternoon in Olgii bazaar.', ko: '오후 울기 시장 탐방.', mn: 'Өдөр Өлгийн зах.' }, stay: { en: 'Eagle Boutique', ko: '이글 부티크', mn: 'Eagle Boutique' }, meals: ['breakfast', 'lunch', 'dinner'] },
          3: { title: { en: 'Drive to Kazakh homestead', ko: '카자흐 가정으로', mn: 'Казах айл руу' }, desc: { en: 'Three hours to the eagle hunter family.', ko: '3시간 이동 후 매잡이 가정 도착.', mn: 'Гурван цагийн замд бүргэдчийн айлд.' }, stay: { en: 'Kazakh ger', ko: '카자흐 게르', mn: 'Казах гэр' }, meals: ['breakfast', 'lunch', 'dinner'] },
          4: { title: { en: 'Day with the eagle hunter', ko: '매잡이 동행 하루', mn: 'Бүргэдчний хамт' }, desc: { en: 'Morning training, afternoon horseback ride.', ko: '오전 훈련, 오후 승마.', mn: 'Өглөө бэлтгэл, орой морин аялал.' }, stay: { en: 'Kazakh ger', ko: '카자흐 게르', mn: 'Казах гэр' }, meals: ['breakfast', 'lunch', 'dinner'] },
          5: { title: { en: 'Transfer to base camp', ko: '베이스캠프로 이동', mn: 'Баазны хуаранд' }, desc: { en: 'Drive into the national park and set camp.', ko: '국립공원으로 이동해 캠프 설치.', mn: 'Цогцолборт орж хуаран байгуулна.' }, stay: { en: 'Base camp tents', ko: '베이스캠프 텐트', mn: 'Баазны майхан' }, meals: ['breakfast', 'lunch', 'dinner'] },
          6: { title: { en: 'Acclimatization day', ko: '고도 적응일', mn: 'Дасан зохицох өдөр' }, desc: { en: 'Hike to 3,400 meters and return.', ko: '3,400m까지 하이킹 후 복귀.', mn: '3400 метр хүртэл алхаад буцна.' }, stay: { en: 'Base camp', ko: '베이스캠프', mn: 'Баазны хуаран' }, meals: ['breakfast', 'lunch', 'dinner'] },
          7: { title: { en: 'Glacier walk', ko: '빙하 워킹', mn: 'Мөсөн голын алхалт' }, desc: { en: 'Rope team glacier crossing on Potanin.', ko: '포타닌에서 로프팀 빙하 횡단.', mn: 'Потанины мөсөн голоор багийн уяа.' }, stay: { en: 'High camp', ko: '고소 캠프', mn: 'Өндрийн хуаран' }, meals: ['breakfast', 'lunch', 'dinner'] },
          8: { title: { en: 'Summit push', ko: '정상 등정 시도', mn: 'Оргилд гарах' }, desc: { en: 'Pre dawn start for Malchin Peak. Weather dependent.', ko: '새벽 출발, 기상에 따라 말친 등정.', mn: 'Үүр орой эртэй Малчин оргил. Цаг агаарт шалтгаалж.' }, stay: { en: 'Base camp', ko: '베이스캠프', mn: 'Баазны хуаран' }, meals: ['breakfast', 'lunch', 'dinner'] },
          9: { title: { en: 'Rest and recovery', ko: '휴식과 회복', mn: 'Амралт, сэргэлт' }, desc: { en: 'Short walks, glacier lakes photography.', ko: '짧은 산책, 빙하호 촬영.', mn: 'Богино алхалт, мөсөн нуурын гэрэл зураг.' }, stay: { en: 'Base camp', ko: '베이스캠프', mn: 'Баазны хуаран' }, meals: ['breakfast', 'lunch', 'dinner'] },
          10: { title: { en: 'Return to Olgii', ko: '울기 복귀', mn: 'Өлгий рүү' }, desc: { en: 'Drive back and hotel evening.', ko: '이동 후 호텔 휴식.', mn: 'Буцах замд, оройд зочид буудалд.' }, stay: { en: 'Eagle Boutique', ko: '이글 부티크', mn: 'Eagle Boutique' }, meals: ['breakfast', 'lunch', 'dinner'] },
          11: { title: { en: 'Fly to UB', ko: 'UB로 비행', mn: 'УБ руу нислэг' }, desc: { en: 'Farewell dinner.', ko: '작별 만찬.', mn: 'Үдэлтийн зоог.' }, stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' }, meals: ['breakfast', 'dinner'] },
          12: { title: { en: 'Departure', ko: '출국', mn: 'Буцах' }, desc: { en: 'Transfer.', ko: '공항 이동.', mn: 'Нисэх буудал.' }, meals: ['breakfast'] },
        };
        return itineraryDay({ day, title: mapDay[day]!.title, description: mapDay[day]!.desc, accommodation: mapDay[day]!.stay, meals: mapDay[day]!.meals });
      }),
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 4800,
        deluxe: 7600,
        private: 14500,
        notes: ltext({
          en: 'Requires expert fitness and mountaineering experience. Altitude to 4,000 meters.',
          ko: '전문가 수준의 체력과 등산 경험 필수. 고도 4,000m.',
          mn: 'Мэргэжлийн бие бялдар, уулын туршлага шаардана. 4000 метрийн өндөр.',
        }),
      },
      destinations: [ref('destination-western')],
      faqs: [ref('faq-general-3'), ref('faq-visa-3'), ref('faq-during-2')],
      featured: true,
      order: 5,
      publishedAt: new Date('2026-02-18T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'Altai Five Peaks Expedition · Amuun',
          ko: '알타이 다섯 봉우리 원정 · Amuun',
          mn: 'Алтайн Таван Богдын аялал · Amuun',
        }),
        description: ltext({
          en: 'Twelve day mountain expedition in Altai Tavan Bogd with glacier work and a Malchin Peak summit push.',
          ko: '알타이 타반 복드에서의 12일 원정. 빙하 훈련과 말친 정상 등정.',
          mn: 'Алтай Таван Богдод 12 хоногийн уулын аялал. Мөсөн голын ажил, Малчин оргилын туулалт.',
        }),
      },
    },
    {
      _id: 'tour-white-lake',
      _type: 'tour',
      title: lstr({
        en: 'White Lake · Khorgo',
        ko: '하얀 호수 · 호르고',
        mn: 'Цагаан нуур · Хорго',
      }),
      slug: { _type: 'slug', current: 'white-lake' },
      summary: ltext({
        en: 'Seven days in central Mongolia paddling on the lake that formed inside an extinguished volcano. Herder camps, hot springs, and the clearest night sky in the country.',
        ko: '꺼진 화산 안에 형성된 호수에서 카누를 타는 7일의 중앙 몽골 여정. 유목민 캠프, 온천, 그리고 몽골에서 가장 맑은 밤하늘.',
        mn: 'Унтарсан галт уулын дотор тогтсон нуурт сэлүүрдэж, төв Монголд долоо хоног. Малчин буудал, халуун ус, улсын хамгийн цэлмэг тэнгэр.',
      }),
      heroImage: imgAlt(volcano, {
        en: 'Khorgo volcano white lake under summer sky',
        ko: '여름 하늘 아래 호르고 화산 하얀 호수',
        mn: 'Зуны тэнгэр дор Хоргын цагаан нуур',
      }),
      gallery: [
        g(volcano, { en: 'Lake and volcano ridge', ko: '호수와 화산 능선', mn: 'Нуур ба галт уулын хяр' }),
        g(karakorum, { en: 'Arkhangai steppe', ko: '아르항가이 초원', mn: 'Архангайн тал' }),
        g(taiga, { en: 'Wooded valley', ko: '숲이 우거진 계곡', mn: 'Ой бүхий хөндий' }),
      ],
      duration: 7,
      difficulty: 'easy',
      seasons: ['summer', 'autumn'],
      included: [
        lstr({ en: 'Private 4WD transport', ko: '프라이빗 4WD', mn: 'Хаалттай 4WD' }),
        lstr({ en: 'Kayak or canoe rental', ko: '카약 또는 카누 대여', mn: 'Kayak эсвэл каноэ' }),
        lstr({ en: 'Hot springs access at Tsenkher', ko: '첸헤르 온천 이용', mn: 'Цэнхэрийн халуун ус' }),
      ],
      excluded: [
        lstr({ en: 'International flights', ko: '국제선', mn: 'Олон улсын нислэг' }),
        lstr({ en: 'Personal items', ko: '개인 물품', mn: 'Хувийн хэрэгцээ' }),
      ],
      itinerary: Array.from({ length: 7 }, (_, i) => {
        const day = i + 1;
        const map: Record<number, { title: Locale; desc: Locale; stay?: Locale; meals?: Meal[] }> = {
          1: { title: { en: 'UB arrival', ko: 'UB 도착', mn: 'УБ ирэх' }, desc: { en: 'Brief and rest.', ko: '브리핑 후 휴식.', mn: 'Товч танилцуулга, амралт.' }, stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' }, meals: ['dinner'] },
          2: { title: { en: 'Drive to Arkhangai', ko: '아르항가이로', mn: 'Архангай руу' }, desc: { en: 'Long drive west into steppe country.', ko: '서쪽 초원 지대로 장거리 이동.', mn: 'Баруун талын тал нутгаар удаан жолоо.' }, stay: { en: 'Tsenkher hot springs camp', ko: '첸헤르 온천 캠프', mn: 'Цэнхэрийн гэр буудал' }, meals: ['breakfast', 'lunch', 'dinner'] },
          3: { title: { en: 'To White Lake', ko: '하얀 호수로', mn: 'Цагаан нуур руу' }, desc: { en: 'Drive to Terkhiin Tsagaan Nuur.', ko: '테르힝 차강 호수로 이동.', mn: 'Тэрхийн цагаан нуур руу.' }, stay: { en: 'Lakeside ger camp', ko: '호숫가 게르', mn: 'Нуурын эрэг дэх буудал' }, meals: ['breakfast', 'lunch', 'dinner'] },
          4: { title: { en: 'On the water', ko: '호수 위에서', mn: 'Усан дээр' }, desc: { en: 'Full day of paddling, lake loop.', ko: '카약으로 호수 일주.', mn: 'Өдөржин сэлүүр, нуурын эргэн тойрон.' }, stay: { en: 'Lakeside ger camp', ko: '호숫가 게르', mn: 'Нуурын буудал' }, meals: ['breakfast', 'lunch', 'dinner'] },
          5: { title: { en: 'Khorgo crater hike', ko: '호르고 화산 하이킹', mn: 'Хоргын аманд аялах' }, desc: { en: 'Climb the extinct crater rim.', ko: '사화산 분화구 등정.', mn: 'Унтарсан галт уулын ам руу гарах.' }, stay: { en: 'Lakeside ger camp', ko: '호숫가 게르', mn: 'Нуурын буудал' }, meals: ['breakfast', 'lunch', 'dinner'] },
          6: { title: { en: 'Return eastward', ko: '동쪽으로 복귀', mn: 'Зүүн тийш буцах' }, desc: { en: 'Drive back through Arkhangai and Bulgan.', ko: '아르항가이와 불간을 통과해 복귀.', mn: 'Архангай, Булганаар буцах.' }, stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' }, meals: ['breakfast', 'dinner'] },
          7: { title: { en: 'Departure', ko: '출국', mn: 'Буцах' }, desc: { en: 'Transfer.', ko: '공항 이동.', mn: 'Нисэх буудал.' }, meals: ['breakfast'] },
        };
        return itineraryDay({ day, title: map[day]!.title, description: map[day]!.desc, accommodation: map[day]!.stay, meals: map[day]!.meals });
      }),
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 2600,
        deluxe: 4400,
        private: 7800,
        notes: ltext({
          en: 'Relaxed pace. Good for families with teenagers.',
          ko: '여유로운 일정. 청소년 동반 가족에게 적합.',
          mn: 'Тайван хэмнэл. Өсвөр насны хүүхэдтэй гэр бүлд тохиромжтой.',
        }),
      },
      destinations: [ref('destination-central')],
      faqs: [ref('faq-booking-3'), ref('faq-during-3')],
      featured: false,
      order: 6,
      publishedAt: new Date('2026-02-20T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'White Lake Khorgo Expedition · Amuun',
          ko: '호르고 하얀 호수 원정 · Amuun',
          mn: 'Хорго Цагаан нуурын аялал · Amuun',
        }),
        description: ltext({
          en: 'Seven days on and around the volcanic Khorgo lake with hot springs, herder camps, and quiet paddling days.',
          ko: '화산 호수 호르고 주변에서의 7일. 온천, 유목민 캠프, 조용한 카약.',
          mn: 'Галт уулын Хорго нуурын эргэн тойронд долоо хоног. Халуун ус, малчин буудал, нам гүм сэлүүр.',
        }),
      },
    },
    {
      _id: 'tour-ancient-capital',
      _type: 'tour',
      title: lstr({
        en: 'Ancient Capital · Orkhon',
        ko: '고대의 수도 · 오르혼',
        mn: 'Эртний нийслэл · Орхон',
      }),
      slug: { _type: 'slug', current: 'ancient-capital' },
      summary: ltext({
        en: 'Six days through the Orkhon Valley where the Mongol empire began. Erdene Zuu monastery, the Orkhon waterfall, and a stay at a horse breeding family.',
        ko: '몽골 제국이 시작된 오르혼 계곡을 가로지르는 6일. 에르덴 주 사원, 오르혼 폭포, 그리고 말 목축 가정에서의 하룻밤.',
        mn: 'Монгол эзэнт гүрний эх эхэлсэн Орхоны хөндийгөөр зургаан хоног. Эрдэнэ зуу хийд, Орхоны хүрхрээ, адуу маллаж буй айлд хоноглох.',
      }),
      heroImage: imgAlt(karakorum, {
        en: 'Ruins and pillars at Kharkhorum at dusk',
        ko: '해질녘 하르허림의 유적과 기둥',
        mn: 'Үдшийн гэгээнд Хархорумын балгас',
      }),
      gallery: [
        g(karakorum, { en: 'Kharkhorum ruins', ko: '하르허림 유적', mn: 'Хархорумын балгас' }),
        g(heroDesert, { en: 'Steppe road', ko: '초원 도로', mn: 'Талын зам' }),
        g(volcano, { en: 'River valley', ko: '강 계곡', mn: 'Голын хөндий' }),
      ],
      duration: 6,
      difficulty: 'easy',
      seasons: ['spring', 'summer', 'autumn'],
      included: [
        lstr({ en: '4WD private transport', ko: '프라이빗 4WD', mn: 'Хаалттай 4WD' }),
        lstr({ en: 'Erdene Zuu monastery entrance', ko: '에르덴 주 사원 입장', mn: 'Эрдэнэ зуу хийдийн билет' }),
        lstr({ en: 'Horse family homestay', ko: '말 목축 가정 홈스테이', mn: 'Адуу маллагч айлд хоноглох' }),
      ],
      excluded: [
        lstr({ en: 'International flights', ko: '국제선', mn: 'Олон улсын нислэг' }),
        lstr({ en: 'Additional horse riding hours', ko: '추가 승마 시간', mn: 'Нэмэлт морин унааны цаг' }),
      ],
      itinerary: Array.from({ length: 6 }, (_, i) => {
        const day = i + 1;
        const map: Record<number, { title: Locale; desc: Locale; stay?: Locale; meals?: Meal[] }> = {
          1: { title: { en: 'UB arrival', ko: 'UB 도착', mn: 'УБ ирэх' }, desc: { en: 'Evening walking tour of Gandan monastery.', ko: '저녁 간단 사원 도보 투어.', mn: 'Орой Гандан хийдийн явган аялал.' }, stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' }, meals: ['dinner'] },
          2: { title: { en: 'Drive to Kharkhorum', ko: '하르허림으로', mn: 'Хархорум руу' }, desc: { en: 'Six hour drive across central steppe.', ko: '중앙 초원을 6시간 이동.', mn: 'Төв талаар зургаан цаг жолоо.' }, stay: { en: 'Kharkhorum hotel', ko: '하르허림 호텔', mn: 'Хархорумын зочид буудал' }, meals: ['breakfast', 'lunch', 'dinner'] },
          3: { title: { en: 'Erdene Zuu monastery', ko: '에르덴 주 사원', mn: 'Эрдэнэ зуу хийд' }, desc: { en: 'Morning monastery tour, afternoon Kharakhorum museum.', ko: '오전 사원 투어, 오후 카라코룸 박물관.', mn: 'Өглөө хийд, үдээс хойш музей.' }, stay: { en: 'Kharkhorum hotel', ko: '하르허림 호텔', mn: 'Хархорумын зочид буудал' }, meals: ['breakfast', 'lunch', 'dinner'] },
          4: { title: { en: 'Orkhon waterfall and herder family', ko: '오르혼 폭포와 유목민 가정', mn: 'Орхоны хүрхрээ, малчин айл' }, desc: { en: 'Waterfall hike, afternoon with a horse family.', ko: '폭포 하이킹, 오후에는 말 목축 가정 체험.', mn: 'Хүрхрээний алхалт, орой адуучин айлд.' }, stay: { en: 'Nomadic family ger', ko: '유목민 게르', mn: 'Малчин айлын гэр' }, meals: ['breakfast', 'lunch', 'dinner'] },
          5: { title: { en: 'Khustai wild horses', ko: '후스타이 야생마', mn: 'Хустайн тахь' }, desc: { en: 'Drive east to Khustai National Park to see Przewalski horses.', ko: '동쪽 후스타이 국립공원으로 이동해 프셰발스키 야생마를 관찰.', mn: 'Зүүн тийш Хустайн цогцолборт очиж тахь адуу үзнэ.' }, stay: { en: 'Shangri La', ko: '샹그릴라', mn: 'Шангри-Ла' }, meals: ['breakfast', 'dinner'] },
          6: { title: { en: 'Departure', ko: '출국', mn: 'Буцах' }, desc: { en: 'Transfer.', ko: '공항 이동.', mn: 'Нисэх буудал.' }, meals: ['breakfast'] },
        };
        return itineraryDay({ day, title: map[day]!.title, description: map[day]!.desc, accommodation: map[day]!.stay, meals: map[day]!.meals });
      }),
      pricing: {
        _type: 'pricing',
        currency: 'USD',
        perPerson: true,
        standard: 2200,
        deluxe: 3800,
        private: 6900,
        notes: ltext({
          en: 'Shortest expedition. Good for pre trip or post Gobi extension.',
          ko: '가장 짧은 일정. 본 여행 전후 연장에 적합.',
          mn: 'Хамгийн богино аялал. Говийн аяллын өмнө эсвэл дараа нэмэлт хувилбар.',
        }),
      },
      destinations: [ref('destination-central')],
      faqs: [ref('faq-visa-1'), ref('faq-visa-2'), ref('faq-general-2')],
      featured: false,
      order: 7,
      publishedAt: new Date('2026-02-22T10:00:00Z').toISOString(),
      seo: {
        _type: 'seo',
        title: lstr({
          en: 'Ancient Capital Expedition · Amuun',
          ko: '고대 수도 원정 · Amuun',
          mn: 'Эртний нийслэлийн аялал · Amuun',
        }),
        description: ltext({
          en: 'Six day private journey through the Orkhon Valley, the cradle of the Mongol empire.',
          ko: '몽골 제국의 요람인 오르혼 계곡을 가로지르는 6일 프라이빗 여정.',
          mn: 'Монгол эзэнт гүрний өлгий Орхоны хөндийгөөр зургаан хоногийн хаалттай аялал.',
        }),
      },
    },
  ];

  return tours;
}
