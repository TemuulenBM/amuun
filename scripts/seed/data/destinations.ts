import { uploadLocalImage, imageWithAlt } from '../upload';

export async function buildDestinations() {
  const gobi = await uploadLocalImage('gobi-crossing.jpg');
  const altai = await uploadLocalImage('altai-peaks.jpg');
  const taiga = await uploadLocalImage('taiga-reindeer.jpg');
  const kharkhorum = await uploadLocalImage('karakorum.jpg');
  const terelj = await uploadLocalImage('canyon-descent.jpg');
  const dunes = await uploadLocalImage('dunes-climb.jpg');
  const heroDesert = await uploadLocalImage('hero-desert.jpg');
  const volcanoLake = await uploadLocalImage('volcano-lake.jpg');

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
      coordinates: { _type: 'geopoint', lat: 43.5, lng: 104.0 },
      bestTime: {
        _type: 'localeString',
        en: 'June through September',
        ko: '6월부터 9월까지',
        mn: '6 сараас 9 сар хүртэл',
      },
      story: {
        _type: 'localeBlockContent',
        en: [
          {
            _type: 'block',
            _key: 'a1b2c3d4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e5f6a7b8', text: 'The Gobi is not emptiness — it is compression. Two thousand kilometres of gravel plain, saxaul scrub, and rust-red cliffs pressed under a sky so wide it bends. Light shifts colour four times before noon. The wind carries no sound except itself. You arrive expecting desolation and find instead an absolute clarity that most places charge a lifetime to reach.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'c9d0e1f2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a3b4c5d6', text: 'Khongoryn Els rises two hundred metres from the valley floor — the largest sand dunes in Mongolia — and hums when the wind catches their crests. Yolyn Am cuts into the Gurvan Saikhan massif as a canyon so narrow that ice survives there through August. At Bayanzag the cliffs burn orange at dusk, the same sediment beds where Roy Chapman Andrews found the first confirmed dinosaur eggs. Bactrian camels graze the scrub between these sights as if they own the century.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e7f8a9b0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c1d2e3f4', text: 'What stays with you is the scale made intimate. A herder family shares suutei tsai beside a stove while their animals move across the far ridgeline. The night sky is unreasonable in its detail. By the final morning you understand why nomads have always read this land as sacred — not barren, but ruthlessly, honestly alive.', marks: [] }],
          },
        ],
        ko: [
          {
            _type: 'block',
            _key: 'a5b6c7d8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e9f0a1b2', text: '고비는 공허가 아니라 압축이다. 자갈 평원과 삭소울 관목, 붉은 절벽이 광활한 하늘 아래 이어진다. 빛은 정오 전에 네 번 색을 바꾼다. 바람이 내는 소리는 오직 바람 자체뿐이다. 황량함을 기대하고 왔다가 평생이 걸려도 닿기 힘든 절대적인 명료함을 발견하게 된다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'c3d4e5f6',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a7b8c9d0', text: '홍고린 엘스는 계곡 바닥에서 이백 미터 솟아오른 몽골 최대의 모래사구로, 바람이 불면 낮게 울린다. 욜린 암은 구르반 사이한 산맥 속 좁은 협곡으로, 8월에도 얼음이 남아 있다. 바얀작의 절벽은 해질녘 주황빛으로 타오르며, 로이 채프먼 앤드루스가 세계 최초의 공룡 알 화석을 발견한 바로 그 지층이다. 쌍봉낙타들은 이 풍경 사이를 마치 세기를 지배하듯 유유히 걷는다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e1f2a3b4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c5d6e7f8', text: '남는 것은 광대함 속의 친밀함이다. 유목민 가족이 먼 능선 너머로 가축을 몰며 수테 차이를 나눠 마신다. 밤하늘은 믿기 어려울 만큼 선명하다. 마지막 아침이 되면 유목민들이 이 땅을 신성하게 여기는 이유를 알게 된다. 황폐하지 않고, 냉혹하리만큼 솔직하게 살아 있는 땅이다.', marks: [] }],
          },
        ],
        mn: [
          {
            _type: 'block',
            _key: 'a9b0c1d2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e3f4a5b6', text: 'Говь хоосон биш — шахагдсан орон зай. Хайрган тал, заксны бут, улаан хад хязгааргүй тэнгэрийн дор нийлдэг. Гэрэл үдийн өмнө дөрвөн удаа өнгөө солино. Салхи ганцхан өөрийн дуугаа авчирна. Эзгүйг хүлээгаад ирсэн боловч насан туршид хүрэхэд хэцүү тунгалаг байдлыг олж авна.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'c7d8e9f0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a1b2c3e4', text: 'Хонгорын элс хөндийн ёроолоос хоёр зуун метр өргөгдөж, салхи оройд нь тусахад дуу гарна. Ёлын ам Гурван Сайханы нуруунд нарийн хавцлаар урсдаг бөгөөд 8 сар хүртэл мөс хадгалагддаг. Баянзагийн хад нар жаргахад улбар шар гэрэлд шатна, Рой Чапман Эндрюс анхны үлэг гүрвэлийн өндгийг олсон газар юм. Хоёр бөхт тэмээнүүд энэ бүхний дундуур зуунаа эзэмдэгчийн дүрээр алхдаг.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e5f6b7c8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'd9e0f1a2', text: 'Үлдэх зүйл бол асар том орон зайн дотоод ойрхон байдал. Малчин гэр бүл хол оргилуудын чанад руу малаа туухын зэрэгцээ сүүтэй цай санал болгоно. Шөнийн огторгуй итгэшгүй тод харагдана. Сүүлчийн өглөө болоход нүүдэлчид энэ газрыг яагаад ариун хэмээн нэрлэсэн болохыг ойлгоно — хагас цөлийн нэрэнд биш, харин хүйтэн шулуун амьдралдаа.', marks: [] }],
          },
        ],
      },
      heroImage: imageWithAlt(gobi, {
        en: 'Gobi desert road stretching toward distant mountains',
        ko: '먼 산을 향해 뻗어 있는 고비 사막 도로',
        mn: 'Хол уул руу сунасан Говийн зам',
      }),
      gallery: [
        imageWithAlt(gobi, {
          en: 'Gobi desert road stretching toward distant mountains',
          ko: '먼 산을 향해 뻗어 있는 고비 사막 도로',
          mn: 'Хол уул руу сунасан Говийн зам',
        }),
        imageWithAlt(dunes, {
          en: 'Climbers ascending the crest of Khongoryn sand dunes',
          ko: '홍고린 모래사구 정상에 오르는 사람들',
          mn: 'Хонгорын элсний орой руу авирч буй хүмүүс',
        }),
        imageWithAlt(heroDesert, {
          en: 'Wide desert panorama under a clear Gobi sky',
          ko: '맑은 고비 하늘 아래 넓은 사막 파노라마',
          mn: 'Говийн цэлмэг тэнгэрийн дор өргөн цөлийн панорам',
        }),
        imageWithAlt(volcanoLake, {
          en: 'Serene lake reflecting the Gobi sky at dawn',
          ko: '새벽 고비의 하늘을 비추는 고요한 호수',
          mn: 'Говийн үүрийн тэнгэрийг толин тусгасан тайван нуур',
        }),
      ],
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
      coordinates: { _type: 'geopoint', lat: 49.0, lng: 87.7 },
      bestTime: {
        _type: 'localeString',
        en: 'July through August',
        ko: '7월부터 8월까지',
        mn: '7 сараас 8 сар хүртэл',
      },
      story: {
        _type: 'localeBlockContent',
        en: [
          {
            _type: 'block',
            _key: 'b1c2d3e4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f5a6b7c8', text: 'Mongolia ends where the Altai begins, and the Altai does not end gently. Five glaciated peaks crowd the western horizon above 4,000 metres, their flanks carrying permanent ice into the short Mongolian summer. The rivers here run milky with glacial flour. The air is thin enough that you notice your breath for the first time in years. This is the kind of landscape that makes large claims on your memory.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'd9e0f1a2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'b3c4d5e6', text: 'The Potanin Glacier descends from Khuiten Peak — at 4,374 metres the highest point in Mongolia — in a slow, groaning arc that you can hear on still mornings. Eagle hunters from the local Kazakh community ride out before sunrise, their golden eagles hooded on their fists, tracing the same ridge routes their grandparents followed. Malchin Peak offers a non-technical summit with full panoramic views into Russia, China, and Kazakhstan — four countries from one stone.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'f7a8b9c0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'd1e2f3a4', text: 'A night in a Kazakh ger is an education in hospitality with no language required. Eagle feathers and embroidered saddle blankets hang from every wall. The family serves fresh mare\'s milk, dried cheese, and flatbread still warm from the fire. You return to altitude the next morning carrying something that is hard to name and impossible to leave behind.', marks: [] }],
          },
        ],
        ko: [
          {
            _type: 'block',
            _key: 'b5c6d7e8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f9a0b1c2', text: '몽골은 알타이가 시작되는 곳에서 끝나고, 알타이는 부드럽게 끝나지 않는다. 빙하로 덮인 다섯 봉우리가 4,000미터 이상으로 솟아 서쪽 지평선을 압도한다. 강물은 빙하에 씻긴 암분으로 뽀얗게 흐른다. 공기는 오랫동안 잊고 살았던 숨의 존재를 다시 느끼게 할 만큼 희박하다. 이런 풍경은 기억에 깊은 흔적을 남긴다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'd3e4f5a6',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'b7c8d9e0', text: '포타닌 빙하는 몽골 최고봉인 후이텐 피크(4,374m)에서 완만한 호선을 그리며 내려오며, 고요한 아침이면 그 신음 소리가 들린다. 현지 카자흐 공동체의 매잡이들은 해 뜨기 전 출발해 황금 독수리를 주먹 위에 얹고 조상 대대로 이어온 능선을 따른다. 말친 피크는 기술 없이도 오를 수 있어 러시아, 중국, 카자흐스탄까지 네 나라를 한눈에 조망할 수 있다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'f1a2b3c4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'd5e6f7a8', text: '카자흐 게르에서의 하룻밤은 말이 필요 없는 환대의 교육이다. 독수리 깃털과 수놓은 안장 담요가 모든 벽에 걸려 있다. 가족은 신선한 마유, 건조 치즈, 화로에서 갓 구운 납작빵을 대접한다. 다음 날 아침 다시 고도로 돌아가지만, 이름 붙이기 어렵고 두고 오기는 불가능한 무언가를 품고 간다.', marks: [] }],
          },
        ],
        mn: [
          {
            _type: 'block',
            _key: 'b9c0d1e2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f3a4b5c6', text: 'Монгол Алтай эхлэх газраас төгсдөг, харин Алтай зөөлнөөр дуусдаггүй. Мөсөн голтой таван оргил 4000 метрээс дээш баруун тэнгэрт харагдана. Голын ус мөсний шавранд сүүтэй цагаан өнгөтэй. Агаар жижигхэн хэдий ч удаан хугацаанд мартсан амьсгалаа дахин мэдрүүлнэ. Энэ ой тогтоол дотор гүн мэт үлдэх газар нутаг.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'd7e8f9a0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'b1c2d3f4', text: 'Потанины мөсөн гол Монголын хамгийн өндөр оргил болох Хүйтний оргилоос (4374 м) удаан, дуугарсаар бүдэг нумаар буудаг. Казах бүргэдчид нар мандахын өмнө өвөг дээдсийн нурууны зам дагуж гарна. Малчин оргилд техник шаардлагагүйгээр гарч Орос, Хятад, Казахстан зэрэг дөрвөн улсыг нэг чулуунаас харж болно.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e5f6c7d8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a9b0c1e2', text: 'Казах гэрт нэг шөнө хоноглох нь хэлгүй ойлгомжтой зочломтгой байдлын сургамж. Бүргэдний өд, хатгамал эмээлийн дэвсгэр ханан дагуу дүүжлэгдэнэ. Гэр бүл гүүний сүү, хуурсан аарц, галын дулаанаас шинэхэн нухаш өргөнө. Дараа өглөө нь дахин өндөрт гарахдаа нэрлэхэд хэцүү, орхиход боломжгүй зүйл тэврэн явна.', marks: [] }],
          },
        ],
      },
      heroImage: imageWithAlt(altai, {
        en: 'Altai Tavan Bogd high peaks under morning light',
        ko: '새벽 빛 아래 알타이 타반 복드 고봉',
        mn: 'Үүрийн гэрэлд Алтай Таван Богдын оргил',
      }),
      gallery: [
        imageWithAlt(altai, {
          en: 'Altai Tavan Bogd high peaks under morning light',
          ko: '새벽 빛 아래 알타이 타반 복드 고봉',
          mn: 'Үүрийн гэрэлд Алтай Таван Богдын оргил',
        }),
        imageWithAlt(volcanoLake, {
          en: 'Alpine glacial lake in the Altai range reflecting snow peaks',
          ko: '설봉을 비추는 알타이 고산 빙하호',
          mn: 'Алтайн мөсөн голын нуурт цасан оргил тусч буй дүр',
        }),
        imageWithAlt(heroDesert, {
          en: 'Open steppe valley leading toward the Altai massif',
          ko: '알타이 산괴를 향해 펼쳐진 광활한 초원 계곡',
          mn: 'Алтайн нуруу руу хөтлөх өргөн талын хөндий',
        }),
        imageWithAlt(gobi, {
          en: 'Vast Mongolian landscape on approach to the Altai range',
          ko: '알타이 산맥으로 가는 길의 광대한 몽골 풍경',
          mn: 'Алтай руу явах замын өргөн Монголын тал нутаг',
        }),
      ],
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
      coordinates: { _type: 'geopoint', lat: 51.0, lng: 100.5 },
      bestTime: {
        _type: 'localeString',
        en: 'June through September',
        ko: '6월부터 9월까지',
        mn: '6 сараас 9 сар хүртэл',
      },
      story: {
        _type: 'localeBlockContent',
        en: [
          {
            _type: 'block',
            _key: 'c1d2e3f4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a5b6c7d8', text: 'Khuvsgul holds two percent of the world\'s fresh surface water and keeps it in a colour that has no adequate name — somewhere between cobalt and the inside of a glacier. The lake is 136 kilometres long, framed north and south by larch taiga that rolls toward Siberia without any obvious reason to stop. Horses swim the shallows. Fish eagles work the shoreline at first light. It is one of those places that insists on being present tense.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e9f0a1b2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c3d4e5f6', text: 'The Darkhad Valley opens west of the lake, a vast basin ringed by mountains where the Tsaatan — the reindeer people — keep an ancient way of life at altitude. Their ortz tents stand in spruce clearings alongside domesticated reindeer that carry packs and give milk. The shamanic tradition here is not performance; ceremonies follow seasons and are spoken of quietly. A three-day horse ride from the lake shore brings you into this world and leaves the other one behind.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a7b8c9d0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e1f2a3b4', text: 'What you carry home from the north is a revised sense of time. Days lengthen past ten o\'clock. The forest absorbs sound. Meals with the Tsaatan family — fresh reindeer milk, pine nut tea, smoked fish — are slow and wordless and deeply shared. This is not nostalgia for a simpler era; it is a living culture on its own terms, and it is generous enough to let you witness it.', marks: [] }],
          },
        ],
        ko: [
          {
            _type: 'block',
            _key: 'c5d6e7f8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a9b0c1d2', text: '흡스굴은 세계 민물 표면적의 2%를 담고 있으며, 코발트와 빙하 내부 사이 어딘가에 있는 적절한 이름이 없는 색깔로 그것을 보존한다. 호수는 136킬로미터 길이로, 남북으로 시베리아를 향해 특별한 이유 없이 이어지는 낙엽송 타이가에 둘러싸여 있다. 말이 얕은 물을 헤엄치고, 물수리가 동틀 무렵 해안선을 따라 움직인다. 현재 시제를 고집하는 장소다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e3f4a5b6',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c7d8e9f0', text: '호수 서쪽으로 다르카드 계곡이 열리는데, 산으로 둘러싸인 광대한 분지에서 차탄 순록 유목민들이 고도에서 오래된 삶의 방식을 이어간다. 그들의 오르츠 천막은 짐을 지고 젖을 주는 길들여진 순록과 함께 가문비나무 빈터에 서 있다. 이곳의 샤머니즘 전통은 공연이 아니다. 의식은 계절을 따르며 조용히 이야기된다. 호숫가에서 사흘을 말로 달리면 이 세계로 들어가고 다른 세계는 뒤에 남겨진다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a1b2c3e4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f5a6b7c8', text: '북쪽에서 가져오는 것은 시간에 대한 새로운 감각이다. 낮이 열 시를 넘어 길게 이어진다. 숲이 소리를 흡수한다. 차탄 가족과의 식사 — 신선한 순록 젖, 잣 차, 훈제 생선 — 는 느리고 말없이 깊이 나누어진다. 더 단순한 시대에 대한 향수가 아니다. 그것은 스스로의 조건으로 살아있는 문화이며, 당신이 목격하도록 충분히 너그럽다.', marks: [] }],
          },
        ],
        mn: [
          {
            _type: 'block',
            _key: 'c9d0e1f2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a3b4c5d6', text: 'Хөвсгөл нуур дэлхийн цэвэр усны гадаргуугийн 2 хувийг хадгалдаг бөгөөд кобальт ба мөсний хөндийн хоорондох нэр үгүй өнгөөр гэрэлтдэг. Нуур 136 км урт, хойд, өмнөд этгээдэд Сибирь рүү тасралтгүй үргэлжлэх шинэсэн тайгаар хүрэгдсэн. Морьд гүехэн усаар сэлж, загасчид эрэг дагуу үүрийн гэгээнд ажилладаг. Одоо цагийн оршихуйг шаардах газар.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'e7f8a9b0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c1d2e3f4', text: 'Нуурын баруунд Дархадын хөндий нэгдэж, уулсаар хүрэгдсэн өргөн хотгорт Цаатан иргэд өндөрт эртний амьдралын хэв маягаа хадгална. Тэдний ортц майхан дарааллын цоорхойд ачаа зөөж, сүү өгдөг гэршмэл цаа бугатай зэрэгцэн зогсдог. Энд бөөгийн уламжлал тоглолт биш; ёслол улирлыг дагаж, намуухан ярина. Нуурын эрэгнээс гурван хоногийн морьт аялал энэ ертөнцөд хүргэж, нөгөөгийг нь хойно нь орхино.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a5b6c7e8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f9a0b1c2', text: 'Хойноос авч яваа зүйл бол шинэчлэгдсэн цагийн мэдрэмж. Өдрүүд арваас давж уртасна. Ой дуу чимээг шингээнэ. Цаатан гэр бүлтэй хоол идэх — цаа бугын сүү, нарс самрын цай, утсан загас — удаан, чимээгүй, гүнзгий хуваалцдаг. Энэ нь энгийн цагийн тосгодол биш; өөрийн нөхцөлөөр амьдарч буй соёл бөгөөд гэрчлэхийн тулд хангалттай хайрлаг.', marks: [] }],
          },
        ],
      },
      heroImage: imageWithAlt(taiga, {
        en: 'Reindeer resting inside a Tsaatan camp in the northern taiga',
        ko: '북부 타이가의 차탄 캠프 안에서 쉬는 순록',
        mn: 'Хойд тайгын цаатны бууцанд амарч буй цаа буга',
      }),
      gallery: [
        imageWithAlt(taiga, {
          en: 'Reindeer resting inside a Tsaatan camp in the northern taiga',
          ko: '북부 타이가의 차탄 캠프 안에서 쉬는 순록',
          mn: 'Хойд тайгын цаатны бууцанд амарч буй цаа буга',
        }),
        imageWithAlt(volcanoLake, {
          en: 'Khuvsgul lake shimmering under the taiga treeline',
          ko: '타이가 수목한계선 아래 반짝이는 흡스굴 호수',
          mn: 'Тайгын ойн доор гялалзаж буй Хөвсгөл нуур',
        }),
        imageWithAlt(altai, {
          en: 'Mountain ridgeline above the Darkhad Valley in early morning',
          ko: '이른 아침 다르카드 계곡 위의 산능선',
          mn: 'Үүрийн гэгээнд Дархадын хөндийн дээрх уулын нуруу',
        }),
        imageWithAlt(heroDesert, {
          en: 'Open northern steppe at the edge of the taiga forest',
          ko: '타이가 숲 가장자리의 광활한 북부 초원',
          mn: 'Тайгын ойн ирмэгт өргөн хойд тал нутаг',
        }),
      ],
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
      coordinates: { _type: 'geopoint', lat: 47.2, lng: 102.8 },
      bestTime: {
        _type: 'localeString',
        en: 'May through October',
        ko: '5월부터 10월까지',
        mn: '5 сараас 10 сар хүртэл',
      },
      story: {
        _type: 'localeBlockContent',
        en: [
          {
            _type: 'block',
            _key: 'd1e2f3a4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'b5c6d7e8', text: 'For a century the largest city on earth sat here, in the middle of a grass valley where the Orkhon River bends. Karakorum received ambassadors from France, Korea, Persia, and China at its peak — craftsmen from a dozen conquered nations bent their skills toward its palaces and temples. Almost nothing remains above ground. What stays is the weight of the place, something the grass has absorbed and holds.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'f9a0b1c2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'd3e4f5a6', text: 'Erdene Zuu Monastery was built from the ruins using salvaged stones from the imperial city, its whitewashed walls enclosing 108 stupas. Stone turtles — boundary markers of the original capital — surface from the steppe at intervals, patient and enormous. The Orkhon Waterfall, ninety kilometres south, drops fifteen metres over basalt columns into a canyon carved by an ancient eruption. The valley between these sights is horse country in its purest form.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'b7c8d9e0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f1a2b3c4', text: 'To ride from the monastery ruins to the waterfall is to pass through eight centuries in an afternoon. Herder families camp the same valley floor the imperial court once occupied. The Karakorum Museum holds bronze palace fragments, Chinese coins, and Nestorian crosses side by side. By evening the light on the grass turns gold and it becomes genuinely unclear which century you have landed in.', marks: [] }],
          },
        ],
        ko: [
          {
            _type: 'block',
            _key: 'd5e6f7a8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'b9c0d1e2', text: '한 세기 동안 지구상에서 가장 큰 도시가 오르혼 강이 굽이치는 초원 계곡 한가운데 자리잡고 있었다. 전성기의 카라코룸은 프랑스, 한국, 페르시아, 중국의 대사를 맞이했으며 수십 개 정복국의 장인들이 궁전과 사원을 위해 기술을 쏟았다. 지상에 남은 것은 거의 없다. 남은 것은 이 장소의 무게이며, 초원이 흡수하고 간직한 것이다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'f3a4b5c6',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'd7e8f9a0', text: '에르덴 주 사원은 제국 도시에서 건진 돌로 폐허 위에 지어졌으며, 하얀 담장 안에 108개의 스투파를 품고 있다. 원래 수도의 경계 표시였던 돌거북이 초원에서 간간이 솟아 있다. 남쪽으로 90킬로미터 떨어진 오르혼 폭포는 고대 화산 폭발이 깎은 협곡 속 현무암 기둥 위로 15미터를 떨어진다. 이 사이의 계곡은 가장 순수한 형태의 말의 땅이다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'b1c2d3e4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'f5a6b7c8', text: '사원 폐허에서 폭포까지 말을 타는 것은 오후 한나절에 팔 세기를 지나는 것이다. 유목민 가족들이 한때 제국 궁정이 차지했던 계곡 바닥에 캠프를 친다. 카라코룸 박물관에는 청동 궁전 조각, 중국 동전, 네스토리우스 십자가가 나란히 놓여 있다. 저녁이 되면 초원 위의 빛이 금빛으로 변하고, 어느 세기에 발을 들인 것인지 진심으로 불분명해진다.', marks: [] }],
          },
        ],
        mn: [
          {
            _type: 'block',
            _key: 'd9e0f1a2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'b3c4d5e6', text: 'Нэг зуун жилийн турш дэлхийн хамгийн том хот Орхон мөрний нугасны дундах өвс нутагт оршин байлаа. Хархорум оргил үедээ Франц, Солонгос, Перс, Хятадын элчин сайдыг хүлээн авч, арваад байлдан дагуулсан үндэсний дархчид дворец, хийдэд ур чадвараа зориулав. Газрын дээр ярлага үлдсэн зүйл бага. Үлдсэн зүйл нь газрын жин, өвс нь шингээгаад барьж буй юм.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'f7a8b9c0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'd1e2f3b4', text: 'Эрдэнэ зуу хийд эзэнт хотын авралт чулуугаар балгасан дээр босч, цагаан хана 108 суварга тойрсон. Эртний нийслэлийн хил заасан чулуун яст мэлхий нутгийн өвснөөс тэвчээртэй, аварга том хэмжээтэй гарч ирдэг. Орхоны хүрхрээ 90 км урагшаа эртний дэлбэрэлтийн огтолсон хавцалд базальт баганад 15 метр унадаг. Хоёрын хоорондох хөндий хамгийн цэвэр хэлбэрийн моринд нутаг юм.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a5b6c7f8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e9f0a1b2', text: 'Хийдийн балгасаас хүрхрээ хүртэл морь унах нь үдэш дэх найман зуун жилийг туулах явдал. Малчин гэр бүл эзэнт шүүх эзэлж байсан хөндийн ёроолд буудаллана. Хархорумын музейд хүрэл дворецийн хэсэг, хятадын зоос, Несторийн загалмай зэрэгцэн тавигдсан. Орой болоход өвсний дэлгэцийн гэрэл шар алтан өнгөтэй болж, аль зуунд газардсаныг жинхэнэ утгаар нь мэдэгдэхгүй болдог.', marks: [] }],
          },
        ],
      },
      heroImage: imageWithAlt(kharkhorum, {
        en: 'Ruins and monument stones near Kharkhorum at dusk',
        ko: '해질녘 하르허림 인근의 유적과 비석',
        mn: 'Үдшийн гэгээнд Хархорумын балгас ба хөшөө',
      }),
      gallery: [
        imageWithAlt(kharkhorum, {
          en: 'Ruins and monument stones near Kharkhorum at dusk',
          ko: '해질녘 하르허림 인근의 유적과 비석',
          mn: 'Үдшийн гэгээнд Хархорумын балгас ба хөшөө',
        }),
        imageWithAlt(heroDesert, {
          en: 'Sweeping steppe valley of the Orkhon River basin',
          ko: '오르혼 강 유역의 광활한 초원 계곡',
          mn: 'Орхон мөрний сав газрын өргөн талын хөндий',
        }),
        imageWithAlt(volcanoLake, {
          en: 'Orkhon waterfall cascading over dark basalt columns',
          ko: '어두운 현무암 기둥 위로 쏟아지는 오르혼 폭포',
          mn: 'Хар базальт баганад Орхоны хүрхрээ урсаж буй нь',
        }),
        imageWithAlt(terelj, {
          en: 'Green valley and rocky outcrops in the Orkhon corridor',
          ko: '오르혼 회랑의 푸른 계곡과 암석 노두',
          mn: 'Орхоны голдирлын ногоон хөндий ба хад хясааны цухуйлт',
        }),
      ],
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
      coordinates: { _type: 'geopoint', lat: 48.0, lng: 107.5 },
      bestTime: {
        _type: 'localeString',
        en: 'June through September and winter for ice festivals',
        ko: '6월부터 9월, 그리고 얼음 축제를 위한 겨울',
        mn: '6 сараас 9 сар, мөсөн баярын өвөл',
      },
      story: {
        _type: 'localeBlockContent',
        en: [
          {
            _type: 'block',
            _key: 'e1f2a3b4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c5d6e7f8', text: 'Terelj is where Ulaanbaatar uncoils itself. Ninety minutes of tarmac and you are inside a national park where granite formations rise from river meadows like interrupted thoughts — Turtle Rock, the reading stacks, the unnamed spires that catch the last light for minutes after the valley goes dark. The Tuul River runs cold and clear through larch forest that smells of resin and rain. This is the version of Mongolia that surprises visitors who expected only steppe.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a9b0c1d2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e3f4a5b6', text: 'Turtle Rock sits at the valley\'s centre, a granite formation shaped by ten thousand years of freeze and thaw into something that is either a giant tortoise or a monk at prayer depending on the hour. Aryabal Meditation Temple climbs the hillside above it — 108 carved Buddhist symbols line the stair up to a small shrine with an unreasonable view. Forty kilometres east, the Chinggis Khaan equestrian statue stands at 40 metres, the largest horse-mounted figure in the world, stainless steel against a grassland sky.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'c7d8e9f0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a1b2c3d4', text: 'In winter the park transforms. River ice forms clear and thick enough to hold horses. The Naadam-adjacent ice festival draws competitors from across the province for archery, wrestling, and ice sculpture. Ger camps burn larch logs through the night and the cold is the precise kind that makes the morning feel earned. Terelj rewards every season with a different argument for why this one is best.', marks: [] }],
          },
        ],
        ko: [
          {
            _type: 'block',
            _key: 'e5f6a7b8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c9d0e1f2', text: '테렐지는 울란바토르가 풀리는 곳이다. 90분의 포장도로 끝에 화강암 바위들이 강 초원에서 중단된 생각처럼 솟아오른 국립공원이 열린다. 거북 바위, 쌓인 책장 같은 지형, 계곡이 어두워진 후에도 몇 분간 마지막 빛을 붙드는 이름 없는 첨탑들. 툴 강은 수지와 빗내음 가득한 낙엽송 숲을 통해 차갑고 맑게 흐른다. 초원만을 기대했던 방문객을 놀라게 하는 몽골이다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a3b4c5d6',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e7f8a9b0', text: '거북 바위는 계곡 중심에 자리잡고, 1만 년의 동결과 해빙으로 시간에 따라 거대한 거북이 혹은 기도하는 승려로 보이는 화강암이다. 아리아발 명상 사원이 그 위 산허리를 오르며 — 108개의 불교 상징이 새겨진 계단 위로 비현실적인 경치를 가진 소신당이 있다. 40킬로미터 동쪽에는 세계 최대의 기마 조각상인 40미터 높이의 칭기즈 칸 기마상이 초원 하늘을 배경으로 스테인리스 스틸로 서 있다.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'c1d2e3f4',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a5b6c7d8', text: '겨울이 되면 공원이 변한다. 강의 얼음이 말을 지탱할 만큼 맑고 두껍게 언다. 나담과 연계된 얼음 축제는 양궁, 씨름, 얼음 조각을 위해 주 전역에서 참가자를 끌어들인다. 게르 캠프는 밤새 낙엽송 장작을 태우고, 추위는 아침을 쟁취한 것처럼 느끼게 하는 정확한 종류다. 테렐지는 모든 계절에 이번이 최고라는 서로 다른 주장으로 보상한다.', marks: [] }],
          },
        ],
        mn: [
          {
            _type: 'block',
            _key: 'e9f0a1b2',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'c3d4e5f6', text: 'Тэрэлж бол Улаанбаатар тайлагдаж эхлэх газар. Ердөө 90 минут асфальт замаар хажуурваас гранит хаднууд голын тал нутгаас тасарсан бодол мэт өндийдөг байгалийн цогцолбор газарт ирнэ. Мэлхий хад, дараалсан шат хэлбэрийн хадан гарц, хөндий харанхуйлсны дараа ч хэдэн минут сүүлчийн гэрлийг барьдаг нэргүй хад оргилууд. Туул гол давирхай, борооны үнэртэй шинэс ойгоор хүйтэн, тунгалаг урсдаг. Зөвхөн тал нутгийг хүлээсэн зочдыг гайхшруулах Монгол нь ийм юм.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'a7b8c9d0',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'e1f2a3b4', text: 'Мэлхий хад хөндийн голд байрлаж, арван мянган жилийн хөлдөлт, гэсэлтэнд цаг хугацааны дагуу аварга мэлхий эсвэл залбирч буй лам мэт харагдах гранит хэлбэр. Арьяабалын хийд түүний дээрх уулын хажууг авирдаг — 108 будааны тэмдэг сийлсэн шат дагуу хэтэрхий өргөн харагддаг жижиг шүтээний газарт хүрнэ. 40 км зүүнд дэлхийн хамгийн том морин хөшөөний 40 метр өндөр Чингис хааны морьт хөшөө зэврэлтгүй гантуур талын тэнгэрийн эсрэг зогсоно.', marks: [] }],
          },
          {
            _type: 'block',
            _key: 'c5d6e7f8',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'a9b0c1d2', text: 'Өвөл болоход парк өөрчлөгддөг. Голын мөс морь даах хэмжээний тунгалаг, зузаан болдог. Наадамтай холбоотой мөсний наадам сумын дөрвөн зүгээс сур харваа, бөх барилдаан, мөсний уран баримлалд өрсөлдөгчдийг татдаг. Гэр буудлууд шинэсний мод шөнө дамжин шатааж, хүйтэн нь өглөөг хөдөлмөрлөн олсон мэт мэдрүүлдэг яг тэр зүйл. Тэрэлж улирал бүр энэ нь хамгийн дээр гэсэн өөр өөр маргаанаар шагналдаг.', marks: [] }],
          },
        ],
      },
      heroImage: imageWithAlt(terelj, {
        en: 'Rock formations and alpine valley in Gorkhi Terelj',
        ko: '고르히 테렐지의 암석 지형과 고원 계곡',
        mn: 'Горхи Тэрэлжийн хаднууд ба уулын хөндий',
      }),
      gallery: [
        imageWithAlt(terelj, {
          en: 'Rock formations and alpine valley in Gorkhi Terelj',
          ko: '고르히 테렐지의 암석 지형과 고원 계곡',
          mn: 'Горхи Тэрэлжийн хаднууд ба уулын хөндий',
        }),
        imageWithAlt(heroDesert, {
          en: 'Wide open meadow in the Terelj river valley',
          ko: '테렐지 강 계곡의 탁 트인 초원',
          mn: 'Тэрэлжийн голын хөндийн өргөн тал нутаг',
        }),
        imageWithAlt(volcanoLake, {
          en: 'Still river pool reflecting granite cliffs in Terelj',
          ko: '테렐지에서 화강암 절벽을 반사하는 잔잔한 강 웅덩이',
          mn: 'Тэрэлжид гранит хадыг толин тусгасан тайван гол',
        }),
        imageWithAlt(altai, {
          en: 'Distant snowcapped peaks visible from the Terelj highland',
          ko: '테렐지 고원에서 보이는 먼 설봉',
          mn: 'Тэрэлжийн өндөрлөгөөс харагдах холын цасан оргилууд',
        }),
      ],
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
