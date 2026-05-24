/* =========================================================
   MoyunNote · 墨韵
   규칙 기반 중국어 학습 시스템 (API 없음 · localStorage)
   ========================================================= */

/* ---------------------------------------------------------
   1. 맥락 분석 DB
   한국어/중국어 입력 → 자연 번역·문법·오류 피드백·상황별 차이·회화·문화·HSK
--------------------------------------------------------- */
const ANALYSIS_DB = [
  {
    id: "a_fighting",
    category: "감정 표현",
    keywords: ["화이팅", "파이팅", "힘내", "응원", "fighting"],
    inputExamples: ["화이팅", "화이팅!", "힘내", "파이팅"],
    natural: "加油！",
    pinyin: "Jiāyóu!",
    meaning: "힘내! / 화이팅!",
    grammar: "加(더하다) + 油(기름). 자동차에 연료를 넣듯 '힘을 더한다'는 뜻으로 굳어진 응원 표현이에요. 두 글자를 통째로 외우세요.",
    errors: [
      { type: "한국어식 직역 경고", desc: "[화이팅]을 영어 fighting으로 직역해 [战斗](전투하다)으로 옮기면 완전히 어색해요. 중국어 응원은 무조건 [加油]예요.", kind: "warn" },
      { type: "문화 차이", desc: "한국의 '화이팅'은 응원·격려 모두에 쓰지만, 중국에선 상황 따라 [加油]·[祝你成功]을 구분해 쓰면 더 자연스러워요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "加油加油！", py: "Jiāyóu jiāyóu!" },
      { tag: "학교 발표", cn: "你一定可以的！", py: "Nǐ yídìng kěyǐ de!" },
      { tag: "공식 표현", cn: "祝您一切顺利。", py: "Zhù nín yíqiè shùnlì." }
    ],
    conversation: [
      { cn: "明天就要考试了。", py: "Míngtiān jiù yào kǎoshì le.", ko: "내일이 바로 시험이야." },
      { cn: "加油，你没问题的！", py: "Jiāyóu, nǐ méi wèntí de!", ko: "화이팅, 넌 문제없어!" }
    ],
    culture: "加油는 경기장·시험장·일상 어디서나 외치는 중국의 국민 응원어예요. 이름을 붙여 [小明加油!]처럼 부르면 더 따뜻해요.",
    hsk: { level: 2, label: "HSK 2급", desc: "응원 표현" }
  },
  {
    id: "a_nunchi",
    category: "감정 표현",
    keywords: ["눈치", "눈치챙겨", "눈치없", "분위기파악", "센스"],
    inputExamples: ["눈치 좀 챙겨", "눈치가 없어", "눈치 봐"],
    natural: "你要会看脸色。",
    pinyin: "Nǐ yào huì kàn liǎnsè.",
    meaning: "분위기·상대 표정을 살필 줄 알아야 해.",
    grammar: "看脸色(kàn liǎnsè)은 '안색을 살피다'로, 한국어 '눈치를 보다'에 가장 가까운 표현이에요. 会(~할 줄 안다)와 함께 자주 써요.",
    errors: [
      { type: "직역 위험 표현", desc: "[눈치]를 글자 그대로 옮길 중국어 단어는 없어요. [眼睛速度](눈 속도)처럼 직역하면 의미가 전혀 안 통해요.", kind: "warn" },
      { type: "문화 의미 차이", desc: "맥락에 따라 [情商高](눈치·센스가 좋다)·[懂事](철들어 분위기를 안다)로 나눠 표현해야 자연스러워요.", kind: "warn" },
      { type: "좋은 접근", desc: "'눈치'처럼 한 단어로 안 떨어지는 개념은 [상황 전체]를 풀어 설명하는 연습이 중요해요.", kind: "good" }
    ],
    situations: [
      { tag: "친구", cn: "你也太没眼力见儿了。", py: "Nǐ yě tài méi yǎnlìjiànr le." },
      { tag: "공식 표현", cn: "他情商很高，很会察言观色。", py: "Tā qíngshāng hěn gāo, hěn huì cháyánguānsè." }
    ],
    conversation: [
      { cn: "他一点眼力见儿都没有。", py: "Tā yìdiǎn yǎnlìjiànr dōu méiyǒu.", ko: "걔는 눈치가 하나도 없어." }
    ],
    culture: "察言观色(cháyánguānsè)는 '말과 표정을 살핀다'는 사자성어로, 한국의 '눈치'와 비슷한 문화 감각을 담고 있어요.",
    hsk: { level: 4, label: "HSK 4급", desc: "추상 개념 표현" }
  },
  {
    id: "a_thanks",
    category: "공식 표현",
    keywords: ["고마워", "감사", "고맙", "땡큐"],
    inputExamples: ["고마워", "감사합니다", "정말 고마워"],
    natural: "谢谢你！",
    pinyin: "Xièxie nǐ!",
    meaning: "고마워!",
    grammar: "谢谢는 그 자체로 동사예요. 뒤에 대상(你)을 붙이면 '너에게'라는 마음이 살아나요.",
    errors: [
      { type: "지나치게 딱딱한 표현", desc: "아주 친한 친구에게 매번 [非常感谢您]처럼 격식체를 쓰면 거리감이 생겨요. 가볍게 [谢啦]면 충분해요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "谢啦！", py: "Xiè la!" },
      { tag: "SNS", cn: "蟹蟹～", py: "Xièxie~" },
      { tag: "공식 표현", cn: "非常感谢您。", py: "Fēicháng gǎnxiè nín." }
    ],
    conversation: [
      { cn: "谢谢你的帮助。", py: "Xièxie nǐ de bāngzhù.", ko: "도와줘서 고마워." },
      { cn: "不客气！", py: "Bú kèqi!", ko: "천만에!" }
    ],
    culture: "蟹蟹(xièxie, 게게)는 谢谢와 발음이 같아 SNS에서 귀엽게 쓰는 표기예요.",
    hsk: { level: 1, label: "HSK 1급", desc: "기초 감사" }
  },
  {
    id: "a_sorry",
    category: "일상 회화",
    keywords: ["미안", "죄송", "사과", "쏘리"],
    inputExamples: ["미안해", "죄송합니다", "미안"],
    natural: "对不起！",
    pinyin: "Duìbuqǐ!",
    meaning: "미안해!",
    grammar: "对(향하다) + 不起(~할 면목이 없다). 진심 어린 사과에 써요.",
    errors: [
      { type: "상황에 맞지 않는 표현", desc: "살짝 부딪힌 정도의 가벼운 실수에 [对不起]는 너무 무거워요. 이럴 땐 [不好意思]가 자연스러워요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "不好意思！", py: "Bù hǎoyìsi!" },
      { tag: "공식 표현", cn: "非常抱歉。", py: "Fēicháng bàoqiàn." }
    ],
    conversation: [
      { cn: "对不起，我来晚了。", py: "Duìbuqǐ, wǒ lái wǎn le.", ko: "미안, 늦었어." },
      { cn: "没关系。", py: "Méi guānxi.", ko: "괜찮아." }
    ],
    culture: "가벼운 사과엔 不好意思, 진지한 사과엔 对不起·抱歉으로 무게를 구분해요.",
    hsk: { level: 1, label: "HSK 1급", desc: "기초 사과" }
  },
  {
    id: "a_exam",
    category: "일상 회화",
    keywords: ["시험", "잘봤", "시험어땠", "성적"],
    inputExamples: ["시험 잘 봤어?", "시험 어땠어", "시험 잘 봤니"],
    natural: "考试考得怎么样？",
    pinyin: "Kǎoshì kǎo de zěnmeyàng?",
    meaning: "시험 잘 봤어?",
    grammar: "동사 + 得 + 정도보어 구조예요. 考得怎么样(보는 정도가 어때?)으로 결과·정도를 물어요.",
    errors: [
      { type: "어순 문제", desc: "[考试好吗?]는 어색해요. 정도를 물을 땐 반드시 [考得怎么样]처럼 [동사+得+怎么样] 어순을 써야 해요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "考得咋样？", py: "Kǎo de zǎyàng?" },
      { tag: "공식 표현", cn: "您这次考试结果如何？", py: "Nín zhècì kǎoshì jiéguǒ rúhé?" }
    ],
    conversation: [
      { cn: "考试考得怎么样？", py: "Kǎoshì kǎo de zěnmeyàng?", ko: "시험 잘 봤어?" },
      { cn: "马马虎虎。", py: "Mǎmahūhū.", ko: "그럭저럭이야." }
    ],
    culture: "马马虎虎(그럭저럭)는 겸손하게 답할 때 쓰는 단골 표현이에요.",
    hsk: { level: 3, label: "HSK 3급", desc: "정도보어" }
  },
  {
    id: "a_whatdoing",
    category: "일상 회화",
    keywords: ["뭐해", "뭐하고", "지금뭐", "심심"],
    inputExamples: ["뭐해?", "지금 뭐해", "뭐하고 있어"],
    natural: "你在干嘛呢？",
    pinyin: "Nǐ zài gàn ma ne?",
    meaning: "뭐 하고 있어?",
    grammar: "在…呢는 동작이 진행 중임을 나타내요. 干嘛(뭐 해)는 아주 구어적인 표현이에요.",
    errors: [
      { type: "지나치게 딱딱한 표현", desc: "친구에게 [您在做什么?]는 너무 격식 있어요. 편하게 [干嘛呢?]가 자연스러워요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "干嘛呢？", py: "Gàn ma ne?" },
      { tag: "공식 표현", cn: "您在忙什么呢？", py: "Nín zài máng shénme ne?" }
    ],
    conversation: [
      { cn: "你在干嘛呢？", py: "Nǐ zài gàn ma ne?", ko: "뭐 하고 있어?" },
      { cn: "在刷手机呢。", py: "Zài shuā shǒujī ne.", ko: "그냥 폰 보고 있어." }
    ],
    culture: "刷手机(폰을 스크롤하다)는 SNS·영상을 보는 걸 가리키는 요즘 표현이에요.",
    hsk: { level: 2, label: "HSK 2급", desc: "진행형" }
  },
  {
    id: "a_price",
    category: "여행 표현",
    keywords: ["얼마", "가격", "비싸", "값", "얼마예요"],
    inputExamples: ["이거 얼마예요?", "얼마예요", "가격이 어떻게 돼요"],
    natural: "这个多少钱？",
    pinyin: "Zhège duōshao qián?",
    meaning: "이거 얼마예요?",
    grammar: "这个(이것) + 多少钱(얼마). 多少钱은 통째로 외우는 가격 질문 패턴이에요.",
    errors: [
      { type: "좋은 접근", desc: "시장에선 [能便宜点吗?](좀 싸게 안 돼요?)를 이어 쓰면 흥정이 자연스러워요.", kind: "good" }
    ],
    situations: [
      { tag: "여행", cn: "这个怎么卖？", py: "Zhège zěnme mài?" },
      { tag: "공식 표현", cn: "请问这个的价格是多少？", py: "Qǐngwèn zhège de jiàgé shì duōshao?" }
    ],
    conversation: [
      { cn: "这个多少钱？", py: "Zhège duōshao qián?", ko: "이거 얼마예요?" },
      { cn: "二十块。", py: "Èrshí kuài.", ko: "20위안이요." }
    ],
    culture: "块(kuài)는 회화에서 元(yuán) 대신 쓰는 돈 단위예요. 시장 흥정은 자연스러운 문화예요.",
    hsk: { level: 1, label: "HSK 1급", desc: "가격 묻기" }
  },
  {
    id: "a_where",
    category: "여행 표현",
    keywords: ["어디", "화장실", "길", "어떻게가"],
    inputExamples: ["화장실 어디예요?", "길 좀 알려주세요", "어떻게 가요"],
    natural: "请问，洗手间在哪里？",
    pinyin: "Qǐngwèn, xǐshǒujiān zài nǎlǐ?",
    meaning: "실례지만 화장실 어디예요?",
    grammar: "请问(여쭙다) + [장소] + 在哪里(어디 있나요). 장소만 바꾸면 두루 활용돼요.",
    errors: [
      { type: "상황에 맞지 않는 표현", desc: "공공장소에서 [厕所]는 다소 직접적이에요. [洗手间]이 더 점잖게 들려요.", kind: "warn" }
    ],
    situations: [
      { tag: "여행", cn: "地铁站怎么走？", py: "Dìtiězhàn zěnme zǒu?" },
      { tag: "공식 표현", cn: "请问，最近的车站在哪里？", py: "Qǐngwèn, zuìjìn de chēzhàn zài nǎlǐ?" }
    ],
    conversation: [
      { cn: "请问，洗手间在哪里？", py: "Qǐngwèn, xǐshǒujiān zài nǎlǐ?", ko: "실례지만 화장실 어디예요?" },
      { cn: "在那边。", py: "Zài nàbiān.", ko: "저쪽이에요." }
    ],
    culture: "怎么走(어떻게 가요)는 길을, 在哪里(어디 있어요)는 위치를 물을 때 써요.",
    hsk: { level: 1, label: "HSK 1급", desc: "위치 묻기" }
  },
  {
    id: "a_present",
    category: "공식 표현",
    keywords: ["발표", "시작하겠습니다", "발표할게요"],
    inputExamples: ["발표 시작하겠습니다", "지금부터 발표할게요"],
    natural: "下面我来介绍一下。",
    pinyin: "Xiàmiàn wǒ lái jièshào yíxià.",
    meaning: "이제 제가 소개해 보겠습니다.",
    grammar: "下面(이제부터) + 我来(제가 나서서) + 介绍(소개하다) + 一下(좀). 来가 적극성을 더해요.",
    errors: [
      { type: "좋은 접근", desc: "발표는 [首先](먼저)→[然后](그다음)→[最后](마지막으로)로 순서를 정리하면 흐름이 깔끔해요.", kind: "good" }
    ],
    situations: [
      { tag: "학교 발표", cn: "首先，我想说明一下背景。", py: "Shǒuxiān, wǒ xiǎng shuōmíng yíxià bèijǐng." },
      { tag: "공식 표현", cn: "请允许我做个简单的介绍。", py: "Qǐng yǔnxǔ wǒ zuò ge jiǎndān de jièshào." }
    ],
    conversation: [
      { cn: "下面我来介绍一下我们的项目。", py: "Xiàmiàn wǒ lái jièshào yíxià wǒmen de xiàngmù.", ko: "이제 저희 프로젝트를 소개하겠습니다." }
    ],
    culture: "발표 마무리엔 [以上就是我的分享，谢谢大家](이상입니다, 감사합니다)를 쓰면 깔끔해요.",
    hsk: { level: 4, label: "HSK 4급", desc: "발표 표현" }
  },
  {
    id: "a_hardwork",
    category: "감정 표현",
    keywords: ["수고", "수고했어", "고생", "고생했어"],
    inputExamples: ["수고했어", "고생 많았어", "수고하셨습니다"],
    natural: "辛苦了！",
    pinyin: "Xīnkǔ le!",
    meaning: "수고했어! / 고생 많았어!",
    grammar: "辛苦(고생스럽다) + 了. 상대의 노고를 위로하는 두 글자 표현이에요.",
    errors: [
      { type: "한국어식 직역 경고", desc: "[수고]를 [辛苦] 없이 [工作多](일이 많다)처럼 풀어 쓰면 위로의 뉘앙스가 사라져요. 위로엔 [辛苦了]가 정답이에요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "辛苦啦！", py: "Xīnkǔ la!" },
      { tag: "공식 표현", cn: "您辛苦了，谢谢您。", py: "Nín xīnkǔ le, xièxie nín." }
    ],
    conversation: [
      { cn: "项目终于做完了。", py: "Xiàngmù zhōngyú zuò wán le.", ko: "프로젝트 드디어 끝났어." },
      { cn: "辛苦了！", py: "Xīnkǔ le!", ko: "수고했어!" }
    ],
    culture: "辛苦了는 직장·학교에서 상대의 노고를 인정하는 따뜻한 인사예요. 윗사람에겐 您辛苦了로 써요.",
    hsk: { level: 3, label: "HSK 3급", desc: "위로 표현" }
  },
  {
    id: "a_nevermind",
    category: "일상 회화",
    keywords: ["괜찮아", "괜찮", "신경쓰지마", "별일아니"],
    inputExamples: ["괜찮아", "괜찮아요", "신경 쓰지 마"],
    natural: "没关系。",
    pinyin: "Méi guānxi.",
    meaning: "괜찮아. / 상관없어.",
    grammar: "没(없다) + 关系(관계, 상관). '상관없다 → 괜찮다'로 굳어진 표현이에요.",
    errors: [
      { type: "좋은 접근", desc: "사과를 받았을 땐 [没关系], 감사를 받았을 땐 [不客气]로 구분해 답하면 자연스러워요.", kind: "good" }
    ],
    situations: [
      { tag: "친구", cn: "没事儿！", py: "Méishìr!" },
      { tag: "공식 표현", cn: "没关系，不用在意。", py: "Méi guānxi, búyòng zàiyì." }
    ],
    conversation: [
      { cn: "对不起，让你久等了。", py: "Duìbuqǐ, ràng nǐ jiǔ děng le.", ko: "미안, 오래 기다리게 했네." },
      { cn: "没关系。", py: "Méi guānxi.", ko: "괜찮아." }
    ],
    culture: "没事儿(méishìr)은 没关系의 더 캐주얼한 버전으로 친구끼리 자주 써요.",
    hsk: { level: 1, label: "HSK 1급", desc: "기초 응답" }
  },
  {
    id: "a_slowly",
    category: "감정 표현",
    keywords: ["천천히", "천천히해", "급하지않", "서두르지마"],
    inputExamples: ["천천히 해", "급하게 하지 마", "천천히 하세요"],
    natural: "慢慢来，不着急。",
    pinyin: "Mànmàn lái, bù zháojí.",
    meaning: "천천히 해, 급할 거 없어.",
    grammar: "慢慢来는 '천천히 하다'는 격려 표현이에요. 来가 '~해 나가다'의 느낌을 줘요.",
    errors: [
      { type: "좋은 접근", desc: "조급해하는 사람을 다독일 때 [慢慢来]는 따뜻한 격려가 돼요. 비슷하게 [别急]도 자주 써요.", kind: "good" }
    ],
    situations: [
      { tag: "친구", cn: "别急，慢慢来。", py: "Bié jí, mànmàn lái." },
      { tag: "공식 표현", cn: "请慢慢来，不用着急。", py: "Qǐng mànmàn lái, búyòng zháojí." }
    ],
    conversation: [
      { cn: "我有点紧张，怕做不好。", py: "Wǒ yǒudiǎn jǐnzhāng, pà zuò bu hǎo.", ko: "좀 긴장돼, 잘 못할까 봐." },
      { cn: "慢慢来，不着急。", py: "Mànmàn lái, bù zháojí.", ko: "천천히 해, 급할 거 없어." }
    ],
    culture: "慢慢来는 결과보다 과정을 다독이는 중국식 위로의 정서를 담고 있어요.",
    hsk: { level: 3, label: "HSK 3급", desc: "격려 표현" }
  },
  {
    id: "a_help",
    category: "일상 회화",
    keywords: ["부탁", "도와줘", "도와주세요", "해줄래"],
    inputExamples: ["도와줘", "부탁이 있어", "도와주실래요?"],
    natural: "能帮我一个忙吗？",
    pinyin: "Néng bāng wǒ yí ge máng ma?",
    meaning: "부탁 하나 들어줄 수 있어?",
    grammar: "帮忙(돕다)은 사이에 대상이 들어가요. 帮我一个忙이 한 덩어리예요.",
    errors: [
      { type: "어순 문제", desc: "[帮我忙]은 어색해요. 반드시 [帮我一个忙] 또는 [帮我个忙]처럼 양사를 넣어야 해요.", kind: "warn" }
    ],
    situations: [
      { tag: "친구", cn: "帮我个忙呗。", py: "Bāng wǒ ge máng bei." },
      { tag: "공식 표현", cn: "麻烦您帮我一下。", py: "Máfan nín bāng wǒ yíxià." }
    ],
    conversation: [
      { cn: "能帮我一个忙吗？", py: "Néng bāng wǒ yí ge máng ma?", ko: "부탁 하나 해도 돼?" },
      { cn: "当然可以！", py: "Dāngrán kěyǐ!", ko: "당연하지!" }
    ],
    culture: "부탁 앞에 麻烦你(번거롭게 해 미안)를 붙이면 더 정중하게 들려요.",
    hsk: { level: 3, label: "HSK 3급", desc: "부탁 표현" }
  },
  {
    id: "a_tired",
    category: "Z세대 표현",
    keywords: ["피곤", "지친다", "번아웃", "현타", "힘빠져", "다포기"],
    inputExamples: ["너무 피곤해", "현타온다", "다 내려놓고 싶어"],
    natural: "我躺平了。",
    pinyin: "Wǒ tǎngpíng le.",
    meaning: "(아등바등 안 하고) 다 내려놨어.",
    grammar: "躺(눕다) + 平(평평하게) + 了. '드러눕다'에서 '경쟁을 포기하고 쉰다'는 뜻으로 확장됐어요.",
    errors: [
      { type: "문화 의미 차이", desc: "[躺平]은 단순히 피곤하다가 아니라, 과도한 경쟁에 지쳐 '무리하지 않겠다'는 청년 정서를 담은 사회적 표현이에요.", kind: "warn" }
    ],
    situations: [
      { tag: "SNS", cn: "今天直接躺平。", py: "Jīntiān zhíjiē tǎngpíng." },
      { tag: "친구", cn: "我累了，想躺平。", py: "Wǒ lèi le, xiǎng tǎngpíng." }
    ],
    conversation: [
      { cn: "你怎么不学习了？", py: "Nǐ zěnme bù xuéxí le?", ko: "왜 공부 안 해?" },
      { cn: "太累了，我躺平了。", py: "Tài lèi le, wǒ tǎngpíng le.", ko: "너무 지쳐서 다 내려놨어." }
    ],
    culture: "躺平은 内卷(과잉 경쟁)에 대한 반작용으로 등장한 중국 청년 문화의 핵심 키워드예요.",
    hsk: { level: 4, label: "HSK 4급", desc: "청년 유행어" }
  },
  {
    id: "a_amazing",
    category: "Z세대 표현",
    keywords: ["대박", "최고", "쩐다", "미쳤다", "짱"],
    inputExamples: ["대박", "완전 최고", "미쳤다"],
    natural: "YYDS！",
    pinyin: "(yǒngyuǎn de shén)",
    meaning: "영원한 신, 최고! (永远的神의 줄임말)",
    grammar: "YYDS는 永远的神(영원한 신)의 병음 첫 글자를 딴 인터넷 줄임말이에요. 최고를 칭찬할 때 단독으로 써요.",
    errors: [
      { type: "상황에 맞지 않는 표현", desc: "[YYDS]는 SNS·친구 사이의 캐주얼 표현이에요. 발표·공식 자리에서 쓰면 어색하니 [非常出色](매우 훌륭하다)로 바꿔 쓰세요.", kind: "warn" }
    ],
    situations: [
      { tag: "SNS", cn: "这首歌YYDS！", py: "Zhè shǒu gē YYDS!" },
      { tag: "친구", cn: "也太牛了吧！", py: "Yě tài niú le ba!" },
      { tag: "공식 표현", cn: "表现非常出色。", py: "Biǎoxiàn fēicháng chūsè." }
    ],
    conversation: [
      { cn: "他又拿冠军了！", py: "Tā yòu ná guànjūn le!", ko: "걔 또 우승했대!" },
      { cn: "YYDS！", py: "(yǒngyuǎn de shén)", ko: "완전 최고야!" }
    ],
    culture: "YYDS는 원래 스포츠 팬덤에서 시작돼 지금은 음식·노래·사람 등 최고를 칭찬할 때 두루 쓰여요.",
    hsk: { level: 5, label: "HSK 5급", desc: "인터넷 신조어" }
  },
  {
    id: "a_emo",
    category: "Z세대 표현",
    keywords: ["우울", "슬퍼", "기분안좋", "센치", "emo"],
    inputExamples: ["나 좀 우울해", "기분이 안 좋아", "emo온다"],
    natural: "我emo了。",
    pinyin: "Wǒ emo le.",
    meaning: "나 좀 센치해졌어 / 우울해졌어.",
    grammar: "영어 emo를 그대로 동사처럼 써요. emo了는 '우울 모드에 들어갔다'는 요즘 표현이에요.",
    errors: [
      { type: "문화 의미 차이", desc: "[emo了]는 진지한 우울증이 아니라, 밤에 문득 센치해지는 가벼운 감정을 가리키는 SNS 표현이에요.", kind: "warn" }
    ],
    situations: [
      { tag: "SNS", cn: "深夜了，又开始emo。", py: "Shēnyè le, yòu kāishǐ emo." },
      { tag: "친구", cn: "我今天有点emo。", py: "Wǒ jīntiān yǒudiǎn emo." }
    ],
    conversation: [
      { cn: "你怎么了？", py: "Nǐ zěnme le?", ko: "무슨 일이야?" },
      { cn: "没事，就是有点emo。", py: "Méishì, jiùshì yǒudiǎn emo.", ko: "별일 아냐, 그냥 좀 센치해." }
    ],
    culture: "emo了는 중국 Z세대가 영어 단어를 그대로 들여와 동사처럼 쓰는 대표적인 신조어예요.",
    hsk: { level: 5, label: "HSK 5급", desc: "인터넷 신조어" }
  }
];

/* ---------------------------------------------------------
   2. 표현 아카이브 (Z세대/SNS/감정/일상/여행/공식) — 45+
--------------------------------------------------------- */
const ARCHIVE = [
  // ---- Z세대 / 인터넷 유행어 ----
  { id: "e01", category: "Z세대 표현", cn: "YYDS", py: "yǒngyuǎn de shén", ko: "영원한 신, 최고", use: "최고를 칭찬할 때", mood: "흥분·찬양", culture: "永远的神의 줄임말. 스포츠 팬덤에서 시작돼 전 분야로 퍼졌어요.", caution: "공식 자리에선 부적절해요." },
  { id: "e02", category: "Z세대 표현", cn: "emo了", py: "emo le", ko: "센치해졌어", use: "밤에 문득 울적할 때", mood: "잔잔한 우울", culture: "영어 emo를 동사처럼 쓰는 표현이에요.", caution: "진짜 우울증과는 무게가 달라요." },
  { id: "e03", category: "Z세대 표현", cn: "栓Q", py: "shuān Q", ko: "(어이없는) 땡큐…", use: "황당하거나 어이없을 때", mood: "체념·헛웃음", culture: "thank you의 사투리식 발음을 한자로 적은 밈이에요.", caution: "진심 감사로 오해되면 안 돼요." },
  { id: "e04", category: "Z세대 표현", cn: "绝绝子", py: "jué jué zǐ", ko: "끝내준다", use: "엄청 좋거나 엄청 별로일 때", mood: "과장된 감탄", culture: "绝(최고다)에 귀여운 접미사를 붙인 SNS 유행어예요.", caution: "맥락 따라 칭찬/비꼼 둘 다 돼요." },
  { id: "e05", category: "Z세대 표현", cn: "上头了", py: "shàngtóu le", ko: "푹 빠졌어", use: "무언가에 중독될 만큼 빠졌을 때", mood: "몰입·도취", culture: "원래 '술기운이 오르다'에서 '헤어나오지 못하다'로 확장됐어요.", caution: "긍·부정 모두 가능해요." },
  { id: "e06", category: "Z세대 표현", cn: "社死", py: "shè sǐ", ko: "사회적 사망(쪽팔림)", use: "엄청 창피한 일을 당했을 때", mood: "민망·자조", culture: "社会性死亡의 줄임말. 공개적으로 망신당함을 과장한 말이에요.", caution: "가벼운 농담조로만 써요." },
  { id: "e07", category: "Z세대 표현", cn: "内卷", py: "nèi juǎn", ko: "과잉 경쟁", use: "불필요한 무한 경쟁을 말할 때", mood: "피로·비판", culture: "노력 대비 보상이 없는 소모적 경쟁을 가리키는 사회 용어예요.", caution: "사회적 함의가 큰 단어예요." },
  { id: "e08", category: "Z세대 표현", cn: "摆烂", py: "bǎi làn", ko: "될 대로 되라지", use: "노력을 포기하고 방치할 때", mood: "자포자기", culture: "이미 망가진 걸 그대로 둔다는 뜻. 躺平보다 더 체념적이에요.", caution: "부정적 태도라 진지한 자리엔 부적합." },
  { id: "e09", category: "Z세대 표현", cn: "躺平", py: "tǎng píng", ko: "다 내려놓기", use: "경쟁을 멈추고 쉴 때", mood: "체념·여유", culture: "内卷에 대한 반작용으로 등장한 청년 문화 키워드예요.", caution: "사회적 의미가 담겨 있어요." },
  { id: "e10", category: "Z세대 표현", cn: "666", py: "liù liù liù", ko: "쩐다, 대박", use: "잘하거나 멋질 때 감탄", mood: "감탄·칭찬", culture: "溜(능숙하다)와 발음이 비슷해 '잘한다'는 뜻으로 써요.", caution: "게임·채팅에서 특히 자주 써요." },
  { id: "e11", category: "Z세대 표현", cn: "笑死我了", py: "xiào sǐ wǒ le", ko: "웃겨 죽겠어", use: "엄청 웃길 때", mood: "유쾌·폭소", culture: "死了(죽겠다)를 붙여 정도를 과장하는 회화 패턴이에요.", caution: "" },
  { id: "e12", category: "Z세대 표현", cn: "绷不住了", py: "bēng bu zhù le", ko: "(웃음을) 못 참겠어", use: "웃음·감정을 참다 터질 때", mood: "터지는 웃음", culture: "참고 있던 표정이 무너졌다는 뜻이에요.", caution: "" },
  { id: "e13", category: "Z세대 표현", cn: "好家伙", py: "hǎo jiāhuo", ko: "이야, 대단한데/세상에", use: "놀라거나 황당할 때 감탄사", mood: "놀람·감탄", culture: "동북 방언에서 퍼진 만능 감탄사예요.", caution: "문장 맨 앞에 추임새로 써요." },
  { id: "e14", category: "Z세대 표현", cn: "太绝了", py: "tài jué le", ko: "완전 끝내준다", use: "최고이거나 어이없을 때", mood: "강한 감탄", culture: "绝(극에 달하다)를 강조한 표현이에요.", caution: "맥락 따라 칭찬/비꼼 둘 다." },
  { id: "e15", category: "Z세대 표현", cn: "无语了", py: "wúyǔ le", ko: "할 말을 잃었어", use: "어이없거나 답답할 때", mood: "기막힘", culture: "말문이 막힐 정도라는 뜻이에요.", caution: "약한 불만 표현이에요." },
  { id: "e16", category: "Z세대 표현", cn: "我服了", py: "wǒ fú le", ko: "두 손 두 발 다 들었다", use: "감탄 또는 어이없을 때", mood: "인정/체념", culture: "服(승복하다)에서 왔어요. 진짜 인정과 비꼼 둘 다 가능해요.", caution: "톤에 따라 의미가 달라요." },
  { id: "e17", category: "Z세대 표현", cn: "破防了", py: "pò fáng le", ko: "마음이 무너졌어", use: "감동·울컥하거나 멘붕일 때", mood: "감정 동요", culture: "게임의 '방어 깨짐'에서 '감정 방어선이 무너졌다'로 확장됐어요.", caution: "" },
  { id: "e18", category: "Z세대 표현", cn: "真香", py: "zhēn xiāng", ko: "(말 바꿔서) 역시 좋네", use: "안 한다더니 결국 좋아할 때", mood: "민망·반전", culture: "어떤 예능에서 유래한 밈. '절대 안 해'라더니 즐기는 상황을 놀릴 때 써요.", caution: "" },
  { id: "e19", category: "Z세대 표현", cn: "凡尔赛", py: "fán'ěrsài", ko: "은근한 자랑(척)", use: "겸손한 척 자랑할 때", mood: "비꼼·풍자", culture: "'베르사유'에서 온 말로, 은근슬쩍 부를 과시하는 행동을 가리켜요.", caution: "놀림조라 직접 말하면 무례할 수 있어요." },
  { id: "e20", category: "Z세대 표현", cn: "摸鱼", py: "mō yú", ko: "(일·공부) 농땡이", use: "할 일 안 하고 딴짓할 때", mood: "장난·여유", culture: "'물고기를 만지작거린다'에서 '근무 중 딴짓'으로 굳어졌어요.", caution: "가벼운 농담으로만 써요." },
  { id: "e21", category: "Z세대 표현", cn: "打工人", py: "dǎgōng rén", ko: "노동자, 직장인(자조)", use: "고된 직장·아르바이트를 자조할 때", mood: "자조·연대", culture: "스스로를 '품팔이'라 부르며 위로하는 표현이에요.", caution: "" },
  { id: "e22", category: "Z세대 표현", cn: "卷王", py: "juǎn wáng", ko: "경쟁왕(지독한 노력파)", use: "지나치게 열심히 하는 사람을 가리킬 때", mood: "감탄·약올림", culture: "内卷(과잉 경쟁)의 '왕'이라는 뜻이에요.", caution: "칭찬 같지만 놀림이 섞여요." },
  { id: "e23", category: "Z세대 표현", cn: "蚌埠住了", py: "bèngbù zhù le", ko: "못 참겠어(笑/泪)", use: "웃음·감정을 못 참을 때", mood: "터지는 감정", culture: "绷不住了와 발음이 비슷한 지명을 끼운 말장난 밈이에요.", caution: "" },
  { id: "e24", category: "Z세대 표현", cn: "yyds的快乐", py: "yyds de kuàilè", ko: "최고의 행복", use: "정말 행복한 순간을 강조할 때", mood: "충만·기쁨", culture: "YYDS를 활용한 응용 표현이에요.", caution: "캐주얼한 자리에서만." },
  { id: "e25", category: "Z세대 표현", cn: "i人 / e人", py: "i rén / e rén", ko: "내향형 / 외향형", use: "MBTI로 성격을 말할 때", mood: "캐주얼·자기소개", culture: "MBTI의 I·E를 따 성격을 가리키는 요즘 표현이에요.", caution: "" },

  // ---- SNS 표현 ----
  { id: "e26", category: "SNS 표현", cn: "点赞", py: "diǎnzàn", ko: "좋아요 누르기", use: "게시물에 좋아요를 누를 때", mood: "호응", culture: "给我点个赞(좋아요 눌러줘)처럼 활용해요.", caution: "" },
  { id: "e27", category: "SNS 표현", cn: "互关", py: "hù guān", ko: "맞팔", use: "서로 팔로우하자고 할 때", mood: "친근·요청", culture: "互相关注의 줄임말이에요.", caution: "" },
  { id: "e28", category: "SNS 표현", cn: "求关注", py: "qiú guānzhù", ko: "팔로우 부탁해요", use: "팔로우를 요청할 때", mood: "애교·요청", culture: "求(구하다)를 붙여 부탁의 느낌을 줘요.", caution: "" },
  { id: "e29", category: "SNS 표현", cn: "种草", py: "zhòng cǎo", ko: "뽐뿌, 사고 싶어짐", use: "남의 추천으로 갖고 싶어질 때", mood: "설렘·소비욕", culture: "마음에 '풀 씨를 심는다'에서 온 샤오훙슈 단골 표현이에요.", caution: "" },
  { id: "e30", category: "SNS 표현", cn: "拔草", py: "bá cǎo", ko: "구매욕 사라짐/질러버림", use: "사고 싶던 마음을 비울 때", mood: "후련·정리", culture: "种草(뽐뿌)의 반대로, 풀을 뽑아 정리한다는 뜻이에요.", caution: "" },
  { id: "e31", category: "SNS 표현", cn: "yu到了", py: "yù dào le", ko: "딱 마주쳤다/공감돼", use: "공감 가는 글을 만났을 때", mood: "공감", culture: "遇到了(만났다)를 SNS식으로 적은 표현이에요.", caution: "" },
  { id: "e32", category: "SNS 표현", cn: "蟹蟹", py: "xièxie", ko: "고마워(귀엽게)", use: "가볍게 감사할 때", mood: "귀여움", culture: "谢谢와 발음이 같아 '게'를 빌려 적는 SNS 표기예요.", caution: "공식 자리엔 부적절." },
  { id: "e33", category: "SNS 표현", cn: "在线等", py: "zàixiàn děng", ko: "실시간으로 답 기다림", use: "급히 답을 구할 때", mood: "다급", culture: "在线等，挺急的(실시간 대기, 급해요)로 자주 써요.", caution: "" },

  // ---- 감정 표현 ----
  { id: "e34", category: "감정 표현", cn: "我太开心了", py: "wǒ tài kāixīn le", ko: "너무 행복해", use: "기쁠 때", mood: "기쁨", culture: "太…了로 감정을 강조해요.", caution: "" },
  { id: "e35", category: "감정 표현", cn: "我好紧张", py: "wǒ hǎo jǐnzhāng", ko: "너무 긴장돼", use: "긴장될 때", mood: "긴장", culture: "好(아주)는 형용사 앞에서 감정을 살리는 강조예요.", caution: "동사 앞엔 못 써요." },
  { id: "e36", category: "감정 표현", cn: "我太感动了", py: "wǒ tài gǎndòng le", ko: "너무 감동이야", use: "감동받았을 때", mood: "감동", culture: "感动은 그 자체로 '감동받다'를 뜻해요.", caution: "" },
  { id: "e37", category: "감정 표현", cn: "我服了你了", py: "wǒ fú le nǐ le", ko: "너한테 졌다", use: "어이없거나 인정할 때", mood: "체념/인정", culture: "톤에 따라 진심 인정과 비꼼이 갈려요.", caution: "어조 주의." },
  { id: "e38", category: "감정 표현", cn: "心态崩了", py: "xīntài bēng le", ko: "멘탈 나갔어", use: "멘붕일 때", mood: "좌절", culture: "心态(멘탈)가 무너졌다는 뜻이에요.", caution: "" },

  // ---- 일상 회화 ----
  { id: "e39", category: "일상 회화", cn: "随便", py: "suíbiàn", ko: "아무거나/맘대로", use: "선택을 상대에게 맡길 때", mood: "무던함", culture: "吃什么? 随便!(뭐 먹어? 아무거나!)처럼 자주 써요.", caution: "성의 없게 들릴 수도 있어요." },
  { id: "e40", category: "일상 회화", cn: "看情况", py: "kàn qíngkuàng", ko: "상황 봐서", use: "확답을 피할 때", mood: "유보", culture: "상황에 따라 결정하겠다는 부드러운 표현이에요.", caution: "" },
  { id: "e41", category: "일상 회화", cn: "改天吧", py: "gǎitiān ba", ko: "다음에 하자", use: "약속을 미룰 때", mood: "완곡한 거절", culture: "딱 잘라 거절하지 않고 여지를 남기는 표현이에요.", caution: "" },
  { id: "e42", category: "일상 회화", cn: "我请客", py: "wǒ qǐngkè", ko: "내가 살게", use: "한턱낼 때", mood: "호의", culture: "请客(한턱내다)는 우정·관계를 다지는 중요한 문화예요.", caution: "" },
  { id: "e43", category: "일상 회화", cn: "加个微信吧", py: "jiā ge wēixìn ba", ko: "위챗 추가하자", use: "연락처를 교환할 때", mood: "친근", culture: "중국에선 전화번호보다 微信(위챗) 교환이 기본이에요.", caution: "" },

  // ---- 여행 표현 ----
  { id: "e44", category: "여행 표현", cn: "买单", py: "mǎidān", ko: "계산할게요", use: "식당에서 계산할 때", mood: "일상", culture: "服务员，买单!(저기요, 계산할게요!)처럼 손 들고 외쳐요.", caution: "" },
  { id: "e45", category: "여행 표현", cn: "能便宜点吗", py: "néng piányi diǎn ma", ko: "좀 깎아주세요", use: "시장에서 흥정할 때", mood: "흥정", culture: "시장에서는 흥정이 자연스러운 문화예요.", caution: "백화점·마트에선 안 통해요." },
  { id: "e46", category: "여행 표현", cn: "扫码", py: "sǎo mǎ", ko: "QR코드 스캔", use: "모바일 결제·주문할 때", mood: "일상", culture: "중국은 扫码支付(QR 결제)가 보편화돼 현금이 드물어요.", caution: "" },
  { id: "e47", category: "여행 표현", cn: "帮我拍张照", py: "bāng wǒ pāi zhāng zhào", ko: "사진 좀 찍어주세요", use: "사진 부탁할 때", mood: "요청", culture: "사진은 양사 张(zhāng)을 써요.", caution: "[一个照片]은 어색해요." },

  // ---- 공식 표현 ----
  { id: "e48", category: "공식 표현", cn: "您好", py: "nín hǎo", ko: "안녕하세요(정중)", use: "윗사람·처음 만난 사람에게", mood: "정중", culture: "你好의 존댓말 버전이에요.", caution: "친구끼리 쓰면 딱딱해요." },
  { id: "e49", category: "공식 표현", cn: "麻烦您了", py: "máfan nín le", ko: "번거롭게 해 죄송합니다", use: "부탁·도움을 받았을 때", mood: "정중·겸손", culture: "상대의 수고를 미리 헤아리는 예의 표현이에요.", caution: "" },
  { id: "e50", category: "공식 표현", cn: "请多关照", py: "qǐng duō guānzhào", ko: "잘 부탁드립니다", use: "처음 인사·협업 시작 시", mood: "정중", culture: "새로운 관계를 시작할 때 쓰는 격식 표현이에요.", caution: "" },
  { id: "e51", category: "공식 표현", cn: "辛苦您了", py: "xīnkǔ nín le", ko: "수고 많으셨습니다", use: "윗사람의 노고를 위로할 때", mood: "정중·감사", culture: "辛苦了에 您을 더해 더 정중해진 표현이에요.", caution: "" }
];

const ARCHIVE_CATS = ["전체", "Z세대 표현", "SNS 표현", "감정 표현", "일상 회화", "여행 표현", "공식 표현"];
const ANALYZE_CATS = ["감정 표현", "공식 표현", "일상 회화", "여행 표현", "Z세대 표현"];

/* ---------------------------------------------------------
   localStorage
--------------------------------------------------------- */
const LS = {
  fav:    "moyunnote_fav",
  recent: "moyunnote_recent",
  count:  "moyunnote_analyze_count"
};
function lsGet(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

let activeCat = "전체";
let selectedSit = null;

/* ---------------------------------------------------------
   유틸
--------------------------------------------------------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}
function speak(text) {
  if (!("speechSynthesis" in window)) { toast("이 브라우저에서는 발음 듣기를 지원하지 않아요."); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[A-Za-z]/g, ""));
    u.lang = "zh-CN"; u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch (e) { toast("발음을 재생할 수 없어요."); }
}
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast("표현을 복사했어요."), () => fbCopy(text));
  } else fbCopy(text);
}
function fbCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); toast("표현을 복사했어요."); } catch (e) { toast("복사 실패"); }
  document.body.removeChild(ta);
}

/* ---------------------------------------------------------
   매칭 엔진
--------------------------------------------------------- */
function norm(s) { return String(s || "").toLowerCase().replace(/[\s!?.,~。！？，、]/g, ""); }
function overlap(a, b) {
  a = norm(a); b = norm(b);
  if (!a || !b) return 0;
  const setB = new Set(b.split(""));
  const seen = new Set(); let hit = 0;
  for (const ch of a.split("")) if (setB.has(ch) && !seen.has(ch)) { hit++; seen.add(ch); }
  return hit / Math.max(new Set(a.split("")).size, new Set(b.split("")).size);
}
function score(input, p) {
  const q = norm(input);
  if (!q) return 0;
  for (const ex of [...(p.inputExamples || []), p.natural]) if (norm(ex) === q) return 99;
  let s = 0;
  let kwHits = 0;
  for (const kw of (p.keywords || [])) if (q.includes(norm(kw)) || norm(kw).includes(q)) kwHits++;
  if (kwHits) s = Math.max(s, 60 + kwHits * 9);
  for (const ex of (p.inputExamples || [])) {
    s = Math.max(s, overlap(q, ex) * 92);
    if (norm(ex).includes(q) || q.includes(norm(ex))) s = Math.max(s, 82);
  }
  if (/[\u4e00-\u9fff]/.test(input)) {
    s = Math.max(s, overlap(q, p.natural) * 95);
    if (norm(p.natural).includes(q)) s = Math.max(s, 88);
  }
  return Math.min(99, Math.round(s));
}
function bestMatch(input) {
  return ANALYSIS_DB
    .map(p => ({ p, s: score(input, p) }))
    .sort((a, b) => b.s - a.s)[0];
}

/* ---------------------------------------------------------
   분석 실행
--------------------------------------------------------- */
function runAnalyze(text) {
  const input = (text != null ? text : document.getElementById("analyzeInput").value).trim();
  const zone = document.getElementById("analyzeResult");
  if (!input) { toast("표현을 입력해 주세요."); return; }

  // loading
  zone.innerHTML = `<div class="loading"><div class="brush"></div><p>맥락을 살펴보는 중…</p></div>`;
  zone.scrollIntoView({ behavior: "smooth", block: "start" });

  setTimeout(() => {
    const best = bestMatch(input);
    if (!best || best.s < 28) {
      zone.innerHTML = renderNoMatch(input);
    } else {
      zone.innerHTML = renderResult(best.p, best.s);
      requestAnimationFrame(() => {
        const f = zone.querySelector(".match-fill");
        if (f) f.style.width = best.s + "%";
      });
    }
    bindResultActs(zone);
    addRecent(input);
    bumpCount();
  }, 650);
}

function matchNote(s) {
  if (s >= 85) return "표현 사전에서 꼭 맞는 표현을 찾았어요.";
  if (s >= 60) return "입력한 문장과 비슷한 표현을 바탕으로 정리했어요.";
  return "가장 가까운 등록 표현을 참고해 정리했어요.";
}
function hskBars(level) {
  let html = "";
  for (let i = 1; i <= 6; i++) html += `<span class="hsk-seg ${i <= level ? "on" : ""}"></span>`;
  return html;
}
function errDesc(d) { return esc(d).replace(/\[(.+?)\]/g, '<span class="err-key">$1</span>'); }

function renderResult(p, s) {
  const errors = (p.errors || []).map(e => `
    <div class="err ${e.kind === "good" ? "good" : "warn"}">
      <span class="err-mk">${e.kind === "good" ? "✓" : "!"}</span>
      <span><span class="err-type">${esc(e.type)}</span>${errDesc(e.desc)}</span>
    </div>`).join("");
  const sits = (p.situations || []).map(x => `
    <div class="sit-line">
      <span class="sit-tag">${esc(x.tag)}</span>
      <span><span class="sit-cn">${esc(x.cn)}</span> <span class="sit-py">${esc(x.py)}</span></span>
    </div>`).join("");
  const convo = (p.conversation || []).map(c => `
    <div class="convo">
      <div class="c-cn">${esc(c.cn)}</div>
      <div class="c-py">${esc(c.py)}</div>
      <div class="c-ko">${esc(c.ko)}</div>
    </div>`).join("");
  const hsk = p.hsk || { level: 1, label: "HSK 1급", desc: "" };

  return `
  <div class="paper-card result-card">
    <div class="match-row">
      <span class="match-pct">${s}%</span>
      <div class="match-track"><div class="match-fill" style="width:0%"></div></div>
      <span class="exp-cat">${esc(p.category)}</span>
    </div>
    <p class="match-note">${matchNote(s)}</p>

    <div class="natural">
      <p class="n-cn">${esc(p.natural)}</p>
      <p class="n-py">${esc(p.pinyin)}</p>
      <p class="n-ko">${esc(p.meaning)}</p>
      <div class="n-acts">
        <button class="btn-ghost" data-act="speak" data-text="${esc(p.natural)}">🔊 발음 듣기</button>
        <button class="btn-ghost" data-act="copy" data-text="${esc(p.natural)}">⧉ 복사</button>
      </div>
    </div>

    <div class="block"><h4>📐 문법 설명</h4><p>${esc(p.grammar)}</p></div>

    ${errors ? `<div class="block"><h4>🖌 학습자 오류 피드백</h4>${errors}</div>` : ""}

    ${sits ? `<div class="block"><h4>🍵 상황별 표현 차이</h4><div class="sit-grid">${sits}</div></div>` : ""}

    ${convo ? `<div class="block"><h4>💬 실제 중국 회화</h4>${convo}</div>` : ""}

    ${p.culture ? `<div class="block"><h4>🏮 문화적 맥락</h4><div class="literal-box">${esc(p.culture)}</div></div>` : ""}

    <div class="block">
      <h4>📊 HSK 난이도</h4>
      <div class="hsk-row">
        <div class="hsk-bars">${hskBars(hsk.level)}</div>
        <span class="hsk-label">${esc(hsk.label)}</span>
        <span class="hsk-desc">${esc(hsk.desc || "")}</span>
      </div>
    </div>
  </div>`;
}

function renderNoMatch(input) {
  const t = getToday();
  return `
  <div class="paper-card result-card">
    <p class="match-note">아직 "${esc(input)}"과 꼭 맞는 표현은 없지만, 오늘의 표현을 추천해 드려요.</p>
    <div class="natural">
      <p class="n-cn">${esc(t.cn)}</p>
      <p class="n-py">${esc(t.py)}</p>
      <p class="n-ko">${esc(t.ko)}</p>
      <div class="n-acts">
        <button class="btn-ghost" data-act="speak" data-text="${esc(t.cn)}">🔊 발음 듣기</button>
        <button class="btn-ghost" data-act="copy" data-text="${esc(t.cn)}">⧉ 복사</button>
      </div>
    </div>
    <div class="block"><h4>🏮 문화적 맥락</h4><div class="literal-box">${esc(t.culture)}</div></div>
    <p class="match-note" style="text-align:center;">표현 아카이브에서 더 많은 표현을 둘러볼 수 있어요.</p>
  </div>`;
}

function bindResultActs(scope) {
  scope.querySelectorAll("[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.act === "speak") speak(btn.dataset.text);
      else if (btn.dataset.act === "copy") copyText(btn.dataset.text);
    });
  });
}

/* ---------------------------------------------------------
   최근 학습 / 분석 횟수
--------------------------------------------------------- */
function addRecent(input) {
  let r = lsGet(LS.recent, []);
  r = r.filter(x => x !== input);
  r.unshift(input);
  r = r.slice(0, 8);
  lsSet(LS.recent, r);
  renderSideRecent();
}
function renderSideRecent() {
  const wrap = document.getElementById("sideRecent");
  const r = lsGet(LS.recent, []);
  if (!r.length) { wrap.innerHTML = `<span class="recent-empty">아직 학습 기록이 없어요.</span>`; return; }
  wrap.innerHTML = r.slice(0, 5).map(x => `<button class="recent-pill" data-r="${esc(x)}">${esc(x)}</button>`).join("");
  wrap.querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => {
    switchView("analyze");
    document.getElementById("analyzeInput").value = b.dataset.r;
    runAnalyze(b.dataset.r);
    closeSidebar();
  }));
}
function bumpCount() {
  const c = lsGet(LS.count, 0) + 1;
  lsSet(LS.count, c);
}

/* ---------------------------------------------------------
   오늘의 표현
--------------------------------------------------------- */
function getToday() {
  const day = Math.floor(Date.now() / 86400000);
  const e = ARCHIVE[day % ARCHIVE.length];
  return { cn: e.cn, py: e.py, ko: e.ko, culture: e.culture, id: e.id };
}
function renderSideToday() {
  const t = getToday();
  const el = document.getElementById("sideToday");
  el.innerHTML = `
    <div class="tm-cn">${esc(t.cn)}</div>
    <div class="tm-py">${esc(t.py)}</div>
    <div class="tm-ko">${esc(t.ko)}</div>`;
  el.onclick = () => {
    switchView("archive");
    document.getElementById("archiveSearch").value = t.cn;
    activeCat = "전체";
    renderCatFilter();
    renderArchive();
    closeSidebar();
  };
}

/* ---------------------------------------------------------
   즐겨찾기
--------------------------------------------------------- */
function getFav() { return lsGet(LS.fav, []); }
function isFav(id) { return getFav().includes(id); }
function toggleFav(id) {
  let f = getFav();
  if (f.includes(id)) { f = f.filter(x => x !== id); toast("즐겨찾기에서 뺐어요."); }
  else { f.push(id); toast("즐겨찾기에 인장을 찍었어요."); }
  lsSet(LS.fav, f);
  renderArchive(); renderFavorite();
}

/* ---------------------------------------------------------
   표현 카드
--------------------------------------------------------- */
function expCard(e) {
  const fav = isFav(e.id);
  return `
  <div class="exp-card">
    <div class="exp-head">
      <span class="exp-cat">${esc(e.category)}</span>
      <button class="exp-fav ${fav ? "on" : ""}" data-fav="${esc(e.id)}" title="즐겨찾기">${fav ? "❤" : "♡"}</button>
    </div>
    <div class="exp-cn">${esc(e.cn)}</div>
    <div class="exp-py">${esc(e.py)}</div>
    <div class="exp-ko">${esc(e.ko)}</div>
    <div class="exp-meta"><b>쓰는 상황</b> · ${esc(e.use)}</div>
    <div class="exp-meta"><b>분위기</b> · ${esc(e.mood)}</div>
    <div class="exp-meta"><b>문화</b> · ${esc(e.culture)}</div>
    ${e.caution ? `<div class="exp-caution">⚠ ${esc(e.caution)}</div>` : ""}
    <div class="exp-acts">
      <button class="ic-btn" data-exp="speak" data-text="${esc(e.cn)}">🔊 발음</button>
      <button class="ic-btn" data-exp="copy" data-text="${esc(e.cn)} ${esc(e.py)}">⧉ 복사</button>
    </div>
  </div>`;
}
function bindExpActs(scope) {
  scope.querySelectorAll("[data-fav]").forEach(b => b.addEventListener("click", () => toggleFav(b.dataset.fav)));
  scope.querySelectorAll("[data-exp]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.exp === "speak") speak(b.dataset.text);
    else copyText(b.dataset.text);
  }));
}

/* ---------------------------------------------------------
   아카이브
--------------------------------------------------------- */
function renderCatFilter() {
  const wrap = document.getElementById("catFilter");
  wrap.innerHTML = ARCHIVE_CATS.map(c =>
    `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  wrap.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => {
    activeCat = b.dataset.cat; renderCatFilter(); renderArchive();
  }));
}
function renderArchive() {
  const grid = document.getElementById("archiveGrid");
  const q = norm(document.getElementById("archiveSearch").value);
  let list = ARCHIVE.slice();
  if (activeCat !== "전체") list = list.filter(e => e.category === activeCat);
  if (q) list = list.filter(e =>
    norm(e.cn).includes(q) || norm(e.py).includes(q) ||
    norm(e.ko).includes(q) || norm(e.use).includes(q) || norm(e.category).includes(q));
  if (!list.length) { grid.innerHTML = `<div class="empty"><div class="e-ic">藏</div><p>조건에 맞는 표현이 없어요.</p></div>`; return; }
  grid.innerHTML = list.map(expCard).join("");
  bindExpActs(grid);
}
function randomExpression() {
  const e = ARCHIVE[Math.floor(Math.random() * ARCHIVE.length)];
  switchView("archive");
  document.getElementById("archiveSearch").value = "";
  activeCat = "전체"; renderCatFilter();
  const grid = document.getElementById("archiveGrid");
  grid.innerHTML = expCard(e);
  bindExpActs(grid);
  toast("오늘의 랜덤 표현을 골랐어요.");
}

/* ---------------------------------------------------------
   즐겨찾기 뷰
--------------------------------------------------------- */
function renderFavorite() {
  const grid = document.getElementById("favoriteGrid");
  const fav = getFav();
  const list = ARCHIVE.filter(e => fav.includes(e.id));
  if (!list.length) { grid.innerHTML = `<div class="empty"><div class="e-ic">印</div><p>아직 즐겨찾기한 표현이 없어요. 마음에 드는 표현에 ♡ 인장을 찍어보세요.</p></div>`; return; }
  grid.innerHTML = list.map(expCard).join("");
  bindExpActs(grid);
}

/* ---------------------------------------------------------
   학습 통계
--------------------------------------------------------- */
function renderStats() {
  document.getElementById("statAnalyze").textContent = lsGet(LS.count, 0);
  document.getElementById("statFav").textContent = getFav().length;
  document.getElementById("statRecent").textContent = lsGet(LS.recent, []).length;
  document.getElementById("statArchive").textContent = ARCHIVE.length;

  // 카테고리별 분포 (즐겨찾기 기준)
  const fav = getFav();
  const counts = {};
  ARCHIVE_CATS.slice(1).forEach(c => counts[c] = 0);
  ARCHIVE.filter(e => fav.includes(e.id)).forEach(e => counts[e.category]++);
  const total = ARCHIVE_CATS.slice(1).reduce((m, c) => Math.max(m, counts[c]), 0) || 1;

  const chart = document.getElementById("catChart");
  chart.innerHTML = ARCHIVE_CATS.slice(1).map(c => `
    <div class="cc-row">
      <span class="cc-name">${esc(c)}</span>
      <div class="cc-track"><div class="cc-fill" style="width:0%"></div></div>
      <span class="cc-val">${counts[c]}</span>
    </div>`).join("");
  requestAnimationFrame(() => {
    chart.querySelectorAll(".cc-row").forEach((row, i) => {
      const c = ARCHIVE_CATS.slice(1)[i];
      row.querySelector(".cc-fill").style.width = (counts[c] / total * 100) + "%";
    });
  });
}

/* ---------------------------------------------------------
   뷰 전환 / 사이드바
--------------------------------------------------------- */
function switchView(name) {
  document.querySelectorAll(".nav-item").forEach(m => m.classList.toggle("active", m.dataset.view === name));
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
  if (name === "archive") { renderCatFilter(); renderArchive(); }
  if (name === "favorite") renderFavorite();
  if (name === "stats") renderStats();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function closeSidebar() { document.getElementById("sidebar").classList.remove("open"); }

/* ---------------------------------------------------------
   초기화
--------------------------------------------------------- */
function init() {
  document.querySelectorAll(".nav-item").forEach(m =>
    m.addEventListener("click", () => { switchView(m.dataset.view); closeSidebar(); }));

  document.querySelectorAll("#sitChips .chip").forEach(chip =>
    chip.addEventListener("click", () => {
      if (selectedSit === chip.dataset.sit) { selectedSit = null; chip.classList.remove("active"); }
      else {
        document.querySelectorAll("#sitChips .chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active"); selectedSit = chip.dataset.sit;
      }
    }));

  document.getElementById("analyzeBtn").addEventListener("click", () => runAnalyze());
  document.getElementById("analyzeInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runAnalyze();
  });

  document.getElementById("archiveSearch").addEventListener("input", renderArchive);
  document.getElementById("randomBtn").addEventListener("click", randomExpression);

  const toggle = document.getElementById("navToggle");
  if (toggle) toggle.addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));

  renderSideToday();
  renderSideRecent();
}
document.addEventListener("DOMContentLoaded", init);
