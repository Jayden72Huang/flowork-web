export type Lang = "zh" | "en";
export type L = Record<Lang, string>;

/** Section eyebrows: what each block is about, shown above its heading. */
export const sectionTags: Record<string, { n: string; k: L; v: L }> = {
  people: { n: "01", k: { zh: "人群", en: "Who" }, v: { zh: "我们为谁而做", en: "Who it’s for" } },
  pain: { n: "02", k: { zh: "痛点", en: "Problem" }, v: { zh: "他们遇到的问题", en: "What goes wrong today" } },
  solution: { n: "03", k: { zh: "方案", en: "Solution" }, v: { zh: "FloWork 怎么解决", en: "How FloWork solves it" } },
  demo: { n: "04", k: { zh: "使用", en: "In use" }, v: { zh: "精英白领的一天，从早到晚怎么用", en: "A full day with FloWork" } },
  modes: { n: "05", k: { zh: "场景", en: "Scenes" }, v: { zh: "不同场合，不同能力", en: "Different places, different skills" } },
  audience: { n: "06", k: { zh: "分身", en: "Roles" }, v: { zh: "工作和生活随时切换", en: "Switching between work and life" } },
  forms: { n: "07", k: { zh: "形态", en: "Forms" }, v: { zh: "四种戴法，适配四种场合", en: "Four ways to wear it" } },
  gestures: { n: "08", k: { zh: "交互", en: "Gestures" }, v: { zh: "在设备上怎么操作", en: "How to operate it" } },
  app: { n: "09", k: { zh: "App", en: "App" }, v: { zh: "手机上看到什么、做什么", en: "What you see on your phone" } },
  features: { n: "10", k: { zh: "优势", en: "Why us" }, v: { zh: "和一般录音产品的区别", en: "How it differs from other recorders" } },
  ai: { n: "11", k: { zh: "AI 能力", en: "AI" }, v: { zh: "背后的 AI 怎么分工", en: "How the AI works" } },
  structure: { n: "12", k: { zh: "结构", en: "Inside" }, v: { zh: "产品拆解与落地可行性", en: "Teardown and feasibility" } },
  team: { n: "13", k: { zh: "团队", en: "Team" }, v: { zh: "谁在做这件事", en: "Who’s building it" } },
  trial: { n: "14", k: { zh: "试用", en: "Try it" }, v: { zh: "加入 Waiting list", en: "Join the waiting list" } },
  faq: { n: "15", k: { zh: "FAQ", en: "FAQ" }, v: { zh: "常见问题", en: "Common questions" } },
};

export const nav: { id: string; label: L }[] = [
  { id: "people", label: { zh: "人群", en: "People" } },
  { id: "pain", label: { zh: "痛点", en: "Problem" } },
  { id: "solution", label: { zh: "方案", en: "Solution" } },
  { id: "demo", label: { zh: "使用", en: "In use" } },
  { id: "modes", label: { zh: "场景", en: "Scenes" } },
  { id: "forms", label: { zh: "形态", en: "Forms" } },
  { id: "gestures", label: { zh: "交互", en: "Gestures" } },
  { id: "app", label: { zh: "App", en: "App" } },
  { id: "features", label: { zh: "优势", en: "Why us" } },
  { id: "ai", label: { zh: "AI 能力", en: "AI" } },
  { id: "structure", label: { zh: "结构", en: "Inside" } },
  { id: "team", label: { zh: "团队", en: "Team" } },
  { id: "trial", label: { zh: "试用", en: "Try it" } },
];

/** The solution section: the four parts and the loop they form. */
export const solutionParts: { img?: string; role: L; name: L; body: L }[] = [
  { img: "/images/flowork-a-p08-satin-silver.webp", role: { zh: "负责「记」", en: "Captures" }, name: { zh: "FloWork 记忆助理", en: "FloWork memory assistant" }, body: { zh: "录音豆加触控板，戴在手腕、胸前或手机上。双击标记重要的话，点一下确认 Flo 的待办。", en: "Recorder plus trackpad, worn on wrist, chest or phone. Double-press to mark, tap to confirm." } },
  { img: "/app/main.jpg", role: { zh: "负责「整理」", en: "Organises" }, name: { zh: "FloWork App", en: "FloWork App" }, body: { zh: "只截取你标记的片段并转成文字，所有记录、待确认和日程都在这里。", en: "Clips and transcribes only what you marked; every note, pending item and event lives here." } },
  { role: { zh: "负责「判断和办」", en: "Decides & acts" }, name: { zh: "Flow Agent · Flo", en: "Flow Agent · Flo" }, body: { zh: "Jev 快速判断这件事怎么处理，Flow Agent 按你的习惯起草邮件、日程和纪要，并一直跟进。", en: "Jev decides how to handle it; Flow Agent drafts emails, events and notes in your style and follows up." } },
  { img: "/images/hero_dock.jpg", role: { zh: "负责「带回家」", en: "Brings it home" }, name: { zh: "记忆底座", en: "Memory Dock" }, body: { zh: "回家插上就充电，主动告诉你今天还差什么；说「Hey Flo，发吧」就办完。", en: "Charges when docked and tells you what’s left; “Hey Flo, send it” finishes it." } },
];

export const solutionLoop: { k: L; v: L }[] = [
  { k: { zh: "双击标记", en: "Double-press" }, v: { zh: "在录音豆上标记刚才那句话", en: "Mark what was just said" } },
  { k: { zh: "截取转写", en: "Clip & transcribe" }, v: { zh: "App 只处理标记前后约 1 分钟", en: "About a minute around the mark" } },
  { k: { zh: "Jev 判断", en: "Jev decides" }, v: { zh: "承诺还是日程，工作还是家事", en: "Promise or event, work or home" } },
  { k: { zh: "Flow Agent 起草", en: "Flow Agent drafts" }, v: { zh: "邮件、日程、纪要按你的习惯写好", en: "Emails, events, notes in your style" } },
  { k: { zh: "你来确认", en: "You confirm" }, v: { zh: "App 点、触控板单击或说 Hey Flo", en: "App, trackpad tap or “Hey Flo”" } },
  { k: { zh: "回家播报", en: "Home brief" }, v: { zh: "底座晚上总结，早上播报", en: "Evening wrap-up, morning brief" } },
];

export const hero = {
  eyebrow: { zh: "Anker 黑客松 · 赛道一 智能录音", en: "Anker Hackathon · Track 01 Smart Recording" },
  title: { zh: "精英白领的无感记忆体", en: "The effortless memory for busy pros" },
  sub: {
    // [[...]] marks the words highlighted in the hero
    zh: "FloWork 是一个[[带触控板的移动记忆助理]]。它装着 soundcore Work 录音豆，戴在手腕、挂在胸前或吸在手机上[[随手记录]]；[[双击标记]]的事，Flow Agent 整理成待办、邮件和日程并[[跟进到办完]]，在触控板上[[点一下就确认]]；回到家，[[记忆底座主动提醒]]你还差什么。",
    en: "FloWork is a [[mobile memory assistant with a trackpad]]. It carries the soundcore Work recorder — on your wrist, your chest or your phone — so you can [[capture anything]]; [[double-press]] what matters and Flow Agent turns it into to-dos, emails and events and [[follows through]], confirmed with [[one tap]] on the trackpad. At home, the [[Memory Dock reminds you]] what’s still open.",
  },

  cta: { zh: "试玩 Demo", en: "Try the Demo" },
  cta2: { zh: "加入候补名单", en: "Join Waitlist" },
};

export const stats: { n: string; l: L }[] = [
  { n: "42×26×9.5", l: { zh: "mm，WHOOP 级大小，内嵌官方录音豆", en: "mm, WHOOP-sized, stock recorder inside" } },
  { n: "5", l: { zh: "个场景自动切换模式", en: "scenes, auto-switched modes" } },
  { n: "1", l: { zh: "份跨场景统一记忆", en: "shared memory across scenes" } },
  { n: "07:30", l: { zh: "底座每天早上主动播报行程", en: "daily morning briefing from the dock" } },
];

export const scenes: { img: string; tag: L; title: L; body: L }[] = [
  {
    img: "/images/wear_collar.jpg",
    tag: { zh: "08:30 · 出门", en: "08:30 · Out the door" },
    title: { zh: "你只管往前走，细节它来记", en: "You move forward. It keeps the details." },
    body: { zh: "真正忙的人，脑子应该留给判断，而不是备忘。Bar 戴在手腕、挂在胸前，路上闪过的想法、电话里的一句安排，双击一下就不会丢。", en: "Busy people should spend their mind on judgment, not memos. Wear the Bar and a double-press keeps every idea and every promise." },
  },
  {
    img: "/images/meeting.jpg",
    tag: { zh: "14:00 · 开会", en: "14:00 · In the room" },
    title: { zh: "答应的事，永远说到做到", en: "Every promise, kept" },
    body: { zh: "会上一句「周五前把报价发给您」，Jev 立刻判断这是承诺，Flow Agent 当场起草邮件。客户记住的是你的靠谱，而你什么都不用额外操心。", en: "“I’ll send the quote by Friday” — Jev flags it, Flow Agent drafts the email on the spot. Clients remember you as the one who always delivers." },
  },
  {
    img: "/images/home_evening.jpg",
    tag: { zh: "21:30 · 回家", en: "21:30 · Home" },
    title: { zh: "进门那一刻，一天已经收好尾", en: "Walk in, and the day is already wrapped" },
    body: { zh: "把 Bar 插进底座，它边充电边告诉你：今天办完了什么、还差哪一件。你说「Hey Flo，发吧」，事情就结了。晚上的时间，留给家人和自己。", en: "Dock the Bar and it tells you what got done and what’s left. Say “Hey Flo, send it” and it’s handled. Your evening belongs to family and yourself." },
  },
];

export const personas: { img: string; tag: L; name: L; line: L; pains: L[] }[] = [
  {
    img: "/images/persona_founder.jpg",
    tag: { zh: "01 / 核心", en: "01 / CORE" },
    name: { zh: "一人公司创业者", en: "Solo founders" },
    line: { zh: "一天 8 场对话，承诺散落在各处。", en: "8 conversations a day, promises everywhere." },
    pains: [
      { zh: "会上答应的事，晚上想不起来", en: "Forgets what was promised" },
      { zh: "录音转写堆成山，没人看", en: "Transcripts pile up unread" },
    ],
  },
  {
    img: "/images/persona_sales.jpg",
    tag: { zh: "02 / 扩展", en: "02 / EXPANDING" },
    name: { zh: "外勤销售与顾问", en: "Field sales & consultants" },
    line: { zh: "客户说的每句话都是线索。", en: "Every client sentence is a lead." },
    pains: [
      { zh: "拜访完手动整理 CRM", en: "Manual CRM after every visit" },
      { zh: "跟进邮件总是拖到第二天", en: "Follow-ups slip to tomorrow" },
    ],
  },
  {
    img: "/images/persona_carer.jpg",
    tag: { zh: "03 / 家庭", en: "03 / FAMILY" },
    name: { zh: "上有老下有小的上班族", en: "Working carers" },
    line: { zh: "工作和家里是两套记忆。", en: "Work and home live in two memories." },
    pains: [
      { zh: "父亲复诊时间只在电话里提过", en: "Dad’s appointment only mentioned on a call" },
      { zh: "家里的安排出门就忘", en: "Home plans forgotten outside" },
    ],
  },
];

/** Cited figures for the problem section; each links to its source. */
export const painStats: { n: string; l: L; src: L; url: string }[] = [
  { n: "55%", l: { zh: "的人开完会，不清楚下一步该做什么", en: "of people leave meetings unsure of the next steps" }, src: { zh: "Microsoft Work Trend Index 2023", en: "Microsoft Work Trend Index 2023" }, url: "https://www.microsoft.com/en-us/worklab/work-trend-index/will-ai-fix-work" },
  { n: "2 min", l: { zh: "核心工作时间里，平均每 2 分钟被会议、邮件或消息打断一次", en: "during core hours, an interruption from a meeting, email or message every 2 minutes" }, src: { zh: "Microsoft Work Trend Index 2025", en: "Microsoft Work Trend Index 2025" }, url: "https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday" },
  { n: "≈ 2/3", l: { zh: "按艾宾浩斯遗忘曲线，没人整理的内容一天后约 2/3 就记不清了", en: "per the Ebbinghaus forgetting curve, about two-thirds is gone a day later if nobody reviews it" }, src: { zh: "Murre & Dros, PLOS ONE 2015", en: "Murre & Dros, PLOS ONE 2015" }, url: "https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0120644" },
];

export const pains: { pain: L; painBody: L; fix: L; fixBody: L }[] = [
  {
    pain: { zh: "答应的事，转头就忘", en: "Promises slip away" },
    painBody: { zh: "会上、电话里随口答应的事，没人记成待办，等想起来已经晚了。", en: "Things you agreed to in meetings or calls never become to-dos until it’s too late." },
    fix: { zh: "双击一下，Flo 接手", en: "Double-press, Flo takes over" },
    fixBody: { zh: "标记的那句话自动变成待办和提醒，邮件草稿当场备好。", en: "The marked line becomes a to-do and reminder, with the email already drafted." },
  },
  {
    pain: { zh: "录音堆成山，没人看", en: "Recordings pile up unread" },
    painBody: { zh: "一场会一篇转写，重点还得自己翻、自己搬到各个工具里。", en: "Every meeting yields a transcript; you still dig and copy the key points by hand." },
    fix: { zh: "只处理你标记的", en: "Only what you mark" },
    fixBody: { zh: "不标记的内容不进入 AI，Flo 只处理真正重要的那几句。", en: "Unmarked audio never reaches the AI; Flo handles only what matters." },
  },
  {
    pain: { zh: "工作和生活两套记忆", en: "Work and home don’t connect" },
    painBody: { zh: "白天记下的事回家没人提，家里的安排出门就忘。", en: "Daytime notes never come up at home; home plans are forgotten at work." },
    fix: { zh: "一份记忆，回家它先开口", en: "One memory; the dock speaks first" },
    fixBody: { zh: "所有场景写进同一份记忆，回家插上底座，它主动告诉你还差什么。", en: "Every scene feeds one memory; dock the Bar and it tells you what’s left." },
  },
];

/** High-level modules for the structure section (no part numbers). */
export const modules: { k: L; v: L }[] = [
  { k: { zh: "感知", en: "Sensing" }, v: { zh: "原装录音豆负责收音，动作传感器判断你怎么戴", en: "The stock recorder listens; a motion sensor knows how it’s worn" } },
  { k: { zh: "交互", en: "Interaction" }, v: { zh: "触控板、线性马达和一条状态线", en: "Glass trackpad, haptics and one status line" } },
  { k: { zh: "连接", en: "Connectivity" }, v: { zh: "低功耗蓝牙连手机，底座走 Wi-Fi 连云端记忆", en: "Low-energy Bluetooth to the phone; the dock reaches the cloud over Wi-Fi" } },
  { k: { zh: "供电", en: "Power" }, v: { zh: "小电池随身续航，回家插进底座磁吸充电", en: "A small battery for the day; magnetic charging in the dock" } },
];

export const barCore = {
  img: "/images/flowork-a-p08-satin-silver.webp",
  title: { zh: "一个助理，四种戴法，覆盖你的一整天", en: "One assistant, four ways to wear it, your whole day covered" },
  body: {
    zh: "WHOOP 大小的移动记忆助理：左边嵌着原装 soundcore Work 录音豆，不拆不改、随时取出，负责「记」；右边是一块触控板，负责「办」。换一种戴法，它就自动换一种工作方式，不用打开 App 设置。",
    en: "A WHOOP-sized mobile memory assistant: the stock soundcore Work recorder sits on the left — unmodified and removable — to capture; a trackpad on the right acts. Wear it differently and it works differently, no app settings needed.",
  },

  specs: [
    { zh: "WHOOP 级大小，戴一整天没负担", en: "WHOOP-sized, comfortable all day" },
    { zh: "录音豆负责记，触控板负责办", en: "Recorder captures, glass surface acts" },
    { zh: "录音豆按进去就用，随时取出", en: "Recorder snaps in and pops out" },
  ] as L[],
};

export const forms: { img: string; no: string; title: L; body: L; specs: L[] }[] = [
  {
    img: "/images/bar_band.jpg",
    no: "A",
    title: { zh: "手环 · 通勤与运动", en: "Wristband · Commute & gym" },
    body: { zh: "像戴一块没有屏幕的表。走路、坐地铁、健身时抬手双击就能记，动作传感器还能数训练组数。", en: "A screenless watch. Raise your wrist and double-press on the go; the motion sensor even counts your sets." },
    specs: [{ zh: "自动进入灵感 / 训练模式", en: "Auto idea / training mode" }, { zh: "适合通勤、外勤、健身", en: "Commute, field work, gym" }],
  },
  {
    img: "/images/wear_collar.jpg",
    no: "B",
    title: { zh: "项链 · 会议与面谈", en: "Necklace · Meetings" },
    body: { zh: "挂在胸前，离嘴最近，会议和面谈收音最清楚；看起来像一件配饰，不像一台设备。", en: "Worn on the chest, closest to your voice — the clearest pickup in meetings, and it reads as jewellery, not a gadget." },
    specs: [{ zh: "自动进入会议模式", en: "Auto meeting mode" }, { zh: "开录时提示告知在场的人", en: "Reminds you to tell people present" }],
  },
  {
    img: "/images/phone_cradle.jpg",
    no: "C",
    title: { zh: "手机背面 · 工位与电话", en: "Phone back · Desk & calls" },
    body: { zh: "磁吸在手机背面，握手机时拇指正好落在触控板上，打电话、在工位时随手确认 Flo 的待办。", en: "Snaps to the back of your phone; your thumb lands on the trackpad to confirm Flo’s to-dos at your desk or on a call." },
    specs: [{ zh: "自动进入工作模式", en: "Auto work mode" }, { zh: "拇指单击确认", en: "Thumb-tap to confirm" }],
  },
  {
    img: "/images/hero_dock.jpg",
    no: "D",
    title: { zh: "记忆底座 · 在家", en: "Memory Dock · Home" },
    body: { zh: "回家插进圆锥底座就开始充电，同时变成家里的管家：晚上总结今天，早上播报行程。", en: "Slot it into the cone dock at home: it charges and becomes your house butler — evening wrap-up, morning briefing." },
    specs: [{ zh: "自动进入家庭模式", en: "Auto home mode" }, { zh: "07:30 晨报 · 22:00 总结", en: "07:30 brief · 22:00 wrap-up" }],
  },
];

export const gestures: { g: string; where: L; name: L; does: L }[] = [
  { g: "press", where: { zh: "录音豆", en: "Recorder" }, name: { zh: "按一下", en: "Press" }, does: { zh: "开始 / 停止录音。开录时手机提醒你告知在场的人", en: "Start / stop recording; your phone reminds you to tell people present" } },
  { g: "double", where: { zh: "录音豆", en: "Recorder" }, name: { zh: "双击", en: "Double-press" }, does: { zh: "标记刚才那句话，交给 Flo 处理", en: "Mark what was just said and hand it to Flo" } },
  { g: "tap", where: { zh: "触控板", en: "Trackpad" }, name: { zh: "单击", en: "Tap" }, does: { zh: "确认 Flo 准备好的事，比如发出邮件", en: "Confirm what Flo prepared, e.g. send the email" } },
  { g: "up", where: { zh: "触控板", en: "Trackpad" }, name: { zh: "上滑", en: "Swipe up" }, does: { zh: "看下一条待确认；插在底座上时调大音量", en: "Next pending item; volume up when docked" } },
  { g: "down", where: { zh: "触控板", en: "Trackpad" }, name: { zh: "下滑", en: "Swipe down" }, does: { zh: "稍后再说；刚确认的 3 秒内下滑可以撤回", en: "Later; within 3 s of confirming, undo" } },
  { g: "hold", where: { zh: "触控板", en: "Trackpad" }, name: { zh: "长按 1 秒", en: "Hold 1 s" }, does: { zh: "隐私静音，所有采集立即暂停", en: "Privacy mute — all capture pauses" } },
];

export const hciRules: { t: L; b: L }[] = [
  { t: { zh: "不用看也能操作", en: "Works without looking" }, b: { zh: "左边金属豆盖管「记」，右边触控板管「办」，手感不同，摸一下就知道按的是哪。", en: "Metal cap on the left captures, glass on the right acts — you can tell them apart by touch." } },
  { t: { zh: "怎么戴都一样用", en: "Same on every mount" }, b: { zh: "内置动作传感器，竖挂横戴都能认出方向，「上滑」永远朝上。", en: "A motion sensor knows how it’s worn, so “up” is always up." } },
  { t: { zh: "每一下都有回应", en: "Every touch answers" }, b: { zh: "一条暖白状态线加轻微震动：单击是一声「咔」，长按是两下震动。", en: "A warm-white status line and a haptic click; a hold buzzes twice." } },
  { t: { zh: "不会误触", en: "No accidental touches" }, b: { zh: "只有在录音中、有事等你确认或插在底座上时才响应手势，衣服蹭到不会触发。", en: "It only listens while recording, when something awaits you, or when docked." } },
  { t: { zh: "随时可以反悔", en: "Always undoable" }, b: { zh: "发邮件、改日程这类对外动作都要你确认，确认后 3 秒内还能撤回。", en: "Anything outward needs your OK, and you can undo within 3 s." } },
];

export const aiLayers: { k: string; title: L; body: L; tag: L }[] = [
  { k: "01", title: { zh: "你双击，录音豆记下这一刻", en: "You double-press; the recorder marks it" }, tag: { zh: "soundcore Work 官方能力", en: "Native soundcore Work" }, body: { zh: "录音豆负责录音和标记，标记的时间点会跟着录音一起同步到手机。", en: "The recorder records and marks; mark times sync to your phone with the audio." } },
  { k: "02", title: { zh: "手机只截取你标记的那一段", en: "Your phone clips only what you marked" }, tag: { zh: "FloWork App", en: "FloWork App" }, body: { zh: "按标记前后约 1 分钟截取、转成文字。不标记的内容不进入 AI，既省成本也保护隐私。", en: "About a minute around each mark is clipped and transcribed. Unmarked audio never reaches the AI." } },
  { k: "03", title: { zh: "Jev 快判断：这句话该怎么处理", en: "Jev decides fast: what is this?" }, tag: { zh: "决策模型 · 只给选项和概率", en: "Decision model · options + odds" }, body: { zh: "是承诺、日程还是闲聊？工作还是家事？什么时候提醒？Jev 只从固定选项里挑并给出把握度，快、便宜、不会编造。", en: "A promise, an appointment or small talk? Work or home? When to remind? Jev picks from fixed options with a confidence score — fast, cheap and never makes things up." } },
  { k: "04", title: { zh: "Flow Agent 慢推进：替你把事办完", en: "Flow Agent follows through" }, tag: { zh: "长期记忆 · 先确认再执行", en: "Long-term memory · confirm first" }, body: { zh: "按你的习惯起草邮件、日程和纪要，记住你的偏好和常联系的人，在合适的时间和地点主动提起。", en: "Drafts emails, events and notes in your style, remembers your preferences and people, and brings things up at the right time and place." } },
  { k: "05", title: { zh: "记忆底座：回家它先开口", en: "Memory Dock: it speaks first at home" }, tag: { zh: "Hey Flo 语音确认", en: "“Hey Flo” voice confirm" }, body: { zh: "晚上总结今天、早上播报行程；你说一句「Hey Flo，发吧」，事情就办完了。", en: "Evening wrap-up, morning briefing; say “Hey Flo, send it” and it’s done." } },
];

export const specs: { k: L; v: L }[] = [
  { k: { zh: "录音终端", en: "Recorder" }, v: { zh: "soundcore Work（D3200），官方原装，嵌入 FloWork Bar，不拆机", en: "soundcore Work (D3200), stock, set in FloWork Bar" } },
  { k: { zh: "条形外壳", en: "Bar shell" }, v: { zh: "42 × 26 × 9.5 mm 原色拉丝钛，连续曲率圆角矩形，背面统一磁吸 + 卡扣接口", en: "42 × 26 × 9.5 mm brushed natural titanium squircle, magnetic snap back" } },
  { k: { zh: "条内电子", en: "Bar electronics" }, v: { zh: "nRF54L15（BLE 5.4）+ 自容触控滑条 + LRA 线性马达 + 加速度计 + 隐藏式暖白状态线 + 约 40 mAh 电池，续航两周以上", en: "nRF54L15 (BLE 5.4), capacitive slider, LRA haptics, accelerometer, hidden warm-white status line, ~40 mAh, 2+ weeks" } },
  { k: { zh: "底座外形", en: "Dock form" }, v: { zh: "约 26 cm 香槟金铝合金圆锥，中段竖格栅透出琥珀光", en: "~26 cm champagne-gold cone, amber-lit slotted grille" } },
  { k: { zh: "底座主控", en: "Dock MCU" }, v: { zh: "ESP32-S3，Wi-Fi + BLE", en: "ESP32-S3, Wi-Fi + BLE" } },
  { k: { zh: "底座音频", en: "Dock audio" }, v: { zh: "双 MEMS 麦克风 + 全频扬声器，本地唤醒词", en: "Dual MEMS mics + full-range speaker, on-device wake word" } },
  { k: { zh: "充电", en: "Charging" }, v: { zh: "正面竖向插槽，磁吸对位充电，USB-C 供电", en: "Front vertical slot, magnetic charging, USB-C powered" } },
  { k: { zh: "决策模型", en: "Decision model" }, v: { zh: "TypeSafe Jev（可替换为 Laya / LLM 结构化输出）", en: "TypeSafe Jev (swappable: Laya / LLM structured output)" } },
  { k: { zh: "生成模型", en: "Generation" }, v: { zh: "任意大模型，仅用于起草", en: "Any LLM, drafting only" } },
  { k: { zh: "隐私", en: "Privacy" }, v: { zh: "录音由机身按键开启并告知在场者；只处理标记片段；长按触控板隐私静音；对外动作需确认；密钥不落设备", en: "Recording starts on the device with people informed; only marked clips processed; hold-to-mute; actions need consent; no keys on devices" } },
  { k: { zh: "外壳", en: "Enclosure" }, v: { zh: "3D 打印原型，参数化建模按实物微调", en: "3D-printed prototype, parametric fit" } },
];

export const team: { role: L; who: L; body: L }[] = [
  { role: { zh: "队长 · 产品 & AI", en: "Lead · Product & AI" }, who: { zh: "黄俊涛 Jayden", en: "Jayden Huang" }, body: { zh: "AI 创业者、产品经理。做过已上线的 AI 录音小程序「高光册」和多 Agent 系统，负责产品定义与 Flow Agent。", en: "AI founder and PM. Shipped the Gaoguangce AI recording mini-app and a multi-agent system; owns product and Flow Agent." } },
  { role: { zh: "App & 前端", en: "App & Web" }, who: { zh: "罗浩", en: "Hao Luo" }, body: { zh: "大厂前端工程师，负责 FloWork App、官网与交互体验，以及官方 SDK 接入。", en: "Big-tech front-end engineer: the FloWork app, website and official SDK integration." } },
  { role: { zh: "硬件 & 算法", en: "Hardware & Algorithms" }, who: { zh: "陈丞锋 Carlos", en: "Carlos Chen" }, body: { zh: "硬件创业者、字节大模型算法工程师，做过智能硬件和 AI 数据库 SaaS 创业，负责记忆底座、Bar 原型和场景识别算法。", en: "Hardware founder and ByteDance LLM engineer with startups in smart hardware and AI database SaaS; owns the dock, the Bar prototype and scene detection." } },
];

export const roles: { name: L; body: L }[] = [
  { name: { zh: "客户会议", en: "Client meetings" }, body: { zh: "承诺自动变待办，邮件草稿当场备好", en: "Promises become to-dos, drafts ready" } },
  { name: { zh: "外勤拜访", en: "Field visits" }, body: { zh: "拜访结束，CRM 记录已写好", en: "CRM notes written when you leave" } },
  { name: { zh: "家人照护", en: "Family care" }, body: { zh: "电话里提到的复诊，进日历也进提醒", en: "A mentioned check-up lands on the calendar" } },
  { name: { zh: "维修工位", en: "Repair bench" }, body: { zh: "边修边说，步骤自动成工单与复盘", en: "Talk while fixing; steps become a report" } },
  { name: { zh: "采访调研", en: "Interviews" }, body: { zh: "标记的金句直接进选题库", en: "Marked quotes go straight to your notes" } },
  { name: { zh: "训练复盘", en: "Training" }, body: { zh: "训练时的感受，回家后生成复盘", en: "In-session feelings become a debrief" } },
];

export const faqs: {q:L;a:L}[] = [
{q:{zh:"现在可以体验什么？",en:"What can I try?"},a:{zh:"官网可查看产品、交互空间及合成数据确认示例。iOS 采用申请制内测。现场硬件链路以实机验收结果为准。",en:"Explore the site, 3D concept and synthetic confirmation example. Apply for the iOS beta; hardware availability depends on device validation."}},
{q:{zh:"会直接执行录音里的话吗？",en:"Does speech automatically trigger actions?"},a:{zh:"不会。Flo 根据获准资料拟好行动，由你核对内容、目标和参数后确认。打印待办不代表执行待办中提及的邮件或日程。",en:"Flo drafts an action from authorized context. You check the content, destination and parameters before approval. Printing a task does not send its email or create its event."}},
{q:{zh:"所有 Anker 设备都能用吗？",en:"Does every Anker device work?"},a:{zh:"这是未来逐项验证的方向。设备需要正式接口、适配与授权，不能从品牌或蓝牙支持推断可控制。",en:"This is a future direction. Each device requires an official interface, adaptation and authorization."}},
{q:{zh:"代码全部公开吗？",en:"Is everything public?"},a:{zh:"公开网页版代码和原创接入方法。iOS、服务端与记忆执行核心保持私有，厂商 SDK 从官方授权渠道获取。",en:"The web frontend and original integration guide are public. iOS, backend, memory and execution core remain private. Obtain vendor SDKs from authorized official channels."}},
];

export const marquee: L[] = [
  { zh: "录音", en: "Recording" }, { zh: "重点标记", en: "Highlights" }, { zh: "设备状态", en: "Device status" },
  { zh: "转写", en: "Transcription" }, { zh: "Jev 决策", en: "Jev decisions" }, { zh: "统一记忆", en: "Shared memory" },
  { zh: "邮件草稿", en: "Email drafts" }, { zh: "日历", en: "Calendar" }, { zh: "CRM", en: "CRM" },
  { zh: "维修工单", en: "Work orders" }, { zh: "语音确认", en: "Voice confirm" }, { zh: "晨间播报", en: "Morning briefing" }, { zh: "圆锥底座", en: "Cone dock" }, { zh: "场景自适应", en: "Scene-aware modes" }, { zh: "Hey Flo", en: "Hey Flo" }, { zh: "Flow Agent", en: "Flow Agent" },
];

/** Exploded-view part lists, in the order the parts appear in the renders (left → right / top → bottom). */
export const barParts: { n: L; d: L }[] = [
  { n: { zh: "钛色豆盖", en: "Titanium cap" }, d: { zh: "TA2 纯钛 0.6 mm，激光拾音孔，按压行程跟随官方按键", en: "0.6 mm TA2 titanium, laser mic holes, follows the native button" } },
  { n: { zh: "录音豆", en: "Recorder" }, d: { zh: "官方 soundcore Work，Ø23.2 mm，不拆不改", en: "Stock soundcore Work, Ø23.2 mm, unmodified" } },
  { n: { zh: "钛中框", en: "Titanium frame" }, d: { zh: "TC4 钛合金 CNC，圆形豆仓 + 方形触控窗", en: "TC4 titanium, round bay + touch window" } },
  { n: { zh: "触控玻璃", en: "Touch glass" }, d: { zh: "12 × 16 mm 钛色 AG 玻璃，内含隐藏状态线", en: "12 × 16 mm titanium-tone AG glass, hidden status line" } },
  { n: { zh: "触控排线", en: "Touch FPC" }, d: { zh: "自容滑条电极，IQS7222A", en: "Self-capacitive slider, IQS7222A" } },
  { n: { zh: "主板", en: "Main board" }, d: { zh: "nRF54L15（BLE 5.4）+ 加速度计 + 电源管理", en: "nRF54L15 (BLE 5.4) + accelerometer + PMIC" } },
  { n: { zh: "线性马达", en: "LRA" }, d: { zh: "Ø8 mm，模拟按压的「咯哒」感", en: "Ø8 mm, simulated click" } },
  { n: { zh: "电池", en: "Battery" }, d: { zh: "301020 锂聚合物，约 40 mAh，续航两周以上", en: "301020 Li-po, ~40 mAh, 2+ weeks" } },
  { n: { zh: "钛后壳", en: "Titanium back" }, d: { zh: "N52 磁铁 × 2 + 镀金 pogo 充电触点", en: "2 × N52 magnets + gold pogo contacts" } },
];

export const dockParts: { n: L; d: L }[] = [
  { n: { zh: "塔尖灯", en: "Tip light" }, d: { zh: "播报时渐亮", en: "Glows while speaking" } },
  { n: { zh: "竖格栅", en: "Grille" }, d: { zh: "香槟钛色阳极氧化铝", en: "Champagne anodized aluminium" } },
  { n: { zh: "暖光 LED 环", en: "Light ring" }, d: { zh: "格栅内透出琥珀光", en: "Amber glow through the grille" } },
  { n: { zh: "全频扬声器", en: "Speaker" }, d: { zh: "2 英寸，I2S D 类功放约 3 W", en: "2-inch, ~3 W class-D" } },
  { n: { zh: "主板", en: "Main board" }, d: { zh: "ESP32-S3 + 双 MEMS 麦克风，本地唤醒词「Hey Flo」", en: "ESP32-S3 + dual MEMS mics, on-device “Hey Flo”" } },
  { n: { zh: "竖向插槽", en: "Slot" }, d: { zh: "磁吸对位，4 根 pogo：Bar 2 根、录音豆 2 根", en: "Magnetic, 4 pogo pins: 2 Bar, 2 recorder" } },
  { n: { zh: "底壳", en: "Base" }, d: { zh: "高 260 mm，底径 180 mm，USB-C 5 V / 2 A", en: "260 mm tall, Ø180 mm, USB-C 5 V / 2 A" } },
];
