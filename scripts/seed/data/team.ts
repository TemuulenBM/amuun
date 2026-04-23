import { uploadRemoteImage } from '../upload';

const PORTRAITS = {
  founder: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
  guide1: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80',
  guide2: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  guide3: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80',
};

export async function buildTeam() {
  const [founder, guide1, guide2, guide3] = await Promise.all([
    uploadRemoteImage(PORTRAITS.founder, 'nomin-batbayar.jpg'),
    uploadRemoteImage(PORTRAITS.guide1, 'erdene-munkhbat.jpg'),
    uploadRemoteImage(PORTRAITS.guide2, 'saraa-dashdorj.jpg'),
    uploadRemoteImage(PORTRAITS.guide3, 'tuvshin-altangerel.jpg'),
  ]);

  return [
    {
      _id: 'team-nomin-batbayar',
      _type: 'teamMember',
      name: 'Nomin Batbayar',
      role: {
        _type: 'localeString',
        en: 'Founder and Expedition Director',
        ko: '창립자이자 원정 디렉터',
        mn: 'Үүсгэн байгуулагч ба Аяллын удирдлага',
      },
      bio: {
        _type: 'localeText',
        en: 'Nomin grew up in Arkhangai province in a family of horse breeders. She spent twelve years leading expeditions for Nomadic Expeditions before founding Amuun in 2023. She holds a tourism management degree from the Mongolian University of Science and Technology and is a certified Wilderness First Responder. She leads every private journey personally.',
        ko: '노민은 아르항가이 지방의 말 목축 가정에서 자랐습니다. 2023년 Amuun을 설립하기 전 Nomadic Expeditions에서 12년간 원정을 이끌었습니다. 몽골과학기술대학교에서 관광경영학을 전공했으며 Wilderness First Responder 자격을 보유하고 있습니다. 모든 프라이빗 원정을 직접 인솔합니다.',
        mn: 'Номин Архангай аймгийн малчин гэр бүлд өсөж торнисон. Amuun-ыг 2023 онд үүсгэн байгуулахаас өмнө Nomadic Expeditions-т 12 жил аяллын хөтөч хийсэн. ШУТИС-д аялал жуулчлалын менежментээр суралцаж, Wilderness First Responder гэрчилгээтэй. Бүх хаалттай аяллыг өөрийн биеэр удирддаг.',
      },
      photo: founder,
      isFounder: true,
      order: 1,
    },
    {
      _id: 'team-erdene-munkhbat',
      _type: 'teamMember',
      name: 'Erdene Munkhbat',
      role: {
        _type: 'localeString',
        en: 'Senior Guide, Gobi and Central Mongolia',
        ko: '시니어 가이드, 고비와 중앙 몽골',
        mn: 'Ахлах хөтөч, Говь ба Төв нутаг',
      },
      bio: {
        _type: 'localeText',
        en: 'Erdene was born in Dundgovi province. Twelve years guiding across the Gobi with specialist knowledge in paleontology sites and fossil-bearing cliffs. He was previously a park ranger at Gurvan Saikhan National Park and speaks English, Russian, and conversational Japanese.',
        ko: '에르덴은 둔드고비 지방 출신으로, 고비 일대에서 12년간 가이드 활동을 했습니다. 고생물학 유적과 화석 절벽에 대한 전문 지식을 갖고 있으며, 구르반 사이항 국립공원 관리원으로 근무한 경력이 있습니다. 영어, 러시아어, 일상 수준의 일본어 구사.',
        mn: 'Эрдэнэ Дундговь аймгийн уугуул. Говьд хөтөч хийсэн 12 жилийн туршлагатай, палеонтологийн орд газар, чулуужсан яст хаднуудын тухай нарийн мэдлэгтэй. Өмнө нь Говь гурван сайхан байгалийн цогцолборт газрын хамгаалагч байсан. Англи, орос, өдөр тутмын япон хэлтэй.',
      },
      photo: guide1,
      order: 2,
    },
    {
      _id: 'team-saraa-dashdorj',
      _type: 'teamMember',
      name: 'Saraa Dashdorj',
      role: {
        _type: 'localeString',
        en: 'Cultural Programs Lead',
        ko: '문화 프로그램 리드',
        mn: 'Соёлын хөтөлбөрийн удирдагч',
      },
      bio: {
        _type: 'localeText',
        en: 'Saraa holds a Masters in cultural anthropology from the National University of Mongolia. Eight years leading programs into the northern Taiga and western Kazakh regions. She is fluent in Kazakh and serves as the primary liaison with Tsaatan reindeer herder families.',
        ko: '사라는 몽골국립대학교에서 문화인류학 석사 학위를 취득했습니다. 북부 타이가와 서부 카자흐 지역 프로그램을 8년간 이끌었으며, 카자흐어에 능통하고 차탄 순록 유목민 가족들과의 주요 연락책 역할을 맡고 있습니다.',
        mn: 'Сараа МУИС-д соёл судлалаар магистраа хамгаалсан. Хойд тайга болон баруун казахын хөтөлбөрийг удирдаж найман жил болж байна. Казах хэлээр чөлөөтэй ярьж, Цаатан цаачин айлуудтай гол холбоогч.',
      },
      photo: guide2,
      order: 3,
    },
    {
      _id: 'team-tuvshin-altangerel',
      _type: 'teamMember',
      name: 'Tuvshin Altangerel',
      role: {
        _type: 'localeString',
        en: 'High Altitude Expedition Guide',
        ko: '고산 원정 가이드',
        mn: 'Өндөр уулын аяллын хөтөч',
      },
      bio: {
        _type: 'localeText',
        en: 'Tuvshin has summited all five peaks of Altai Tavan Bogd. He represented Mongolia on the 2021 Everest North Col expedition and holds UIAGM mountain guide certification. He leads all Altai and high altitude programs for Amuun.',
        ko: '투브신은 알타이 타반 복드의 다섯 봉우리를 모두 등정했습니다. 2021년 에베레스트 노스 콜 원정대에서 몽골 대표로 활동했으며 UIAGM 산악 가이드 자격을 보유합니다. Amuun의 알타이와 고산 프로그램을 전담 인솔합니다.',
        mn: 'Түвшин Алтай Таван Богдын таван оргилыг бүгдийг нь туулсан. 2021 онд Эверестийн хойд цулбуурын экспедицт Монголын төлөөлөгч байсан, UIAGM уулын хөтчийн гэрчилгээтэй. Amuun-ы Алтайн бүх хөтөлбөр, өндрийн аяллыг удирддаг.',
      },
      photo: guide3,
      order: 4,
    },
    {
      _id: 'team-temuulen',
      _type: 'teamMember',
      name: 'Temuulen',
      role: {
        _type: 'localeString',
        en: 'Voidex Studio',
        ko: 'Voidex Studio',
        mn: 'Voidex Studio',
      },
      bio: {
        _type: 'localeText',
        en: 'Temuulen is the founder of Voidex Studio, a one-person development studio building premium web experiences for travel and hospitality brands.',
        ko: 'Temuulen은 여행 및 호스피탈리티 브랜드를 위한 프리미엄 웹 경험을 구축하는 1인 개발 스튜디오 Voidex Studio의 창립자입니다.',
        mn: 'Temuulen бол аялал, зочид буудлын брэндүүдэд зориулсан шилдэг вэб туршлага бүтээдэг нэг хүний Voidex Studio студийн үүсгэн байгуулагч юм.',
      },
      photo: null,
      order: 5,
    },
  ];
}
