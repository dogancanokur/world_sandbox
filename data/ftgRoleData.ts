import type {
  Ambition,
  LeagueDefinition,
  LeagueId,
  PlayerInput,
  Region,
  RegionFilter,
  RoleDefinition,
  SkillKey,
  StatKey,
} from "@/types/ftg";

export const STAT_LABELS: Record<StatKey, string> = {
  accuracy: "İsabetlilik",
  passing: "Pas",
  defence: "Savunma",
  control: "Kontrol",
};

export const SKILL_LABELS: Record<SkillKey, string> = {
  rainbowFeint: "Aşırtma Çalım",
  nutmeg: "Bacak Arası",
  cannonShot: "Füze Vuruşu",
  slideTackle: "Kayarak Müdahale",
  longPass: "Uzun Pas",
  layoffPass: "Ara Pas",
  bananaCross: "Muz Orta",
  headPlay: "Hava Topu",
  throwIn: "Taç Atıcı",
  reaction: "Reaksiyon",
  topInterceptor: "Top Kesici",
  strongGoalkeeper: "Sağlam Kaleci",
  playingOut: "Topa Çıkma",
};

export const REGION_LABELS: Record<RegionFilter, string> = {
  hepsi: "Hepsi",
  forvet: "Forvet",
  ortaSaha: "Orta saha",
  defans: "Defans",
  kaleci: "Kaleci",
};

export const AMBITION_LABELS: Record<Ambition, string> = {
  tutunma: "Tutunma",
  ortaSira: "Orta sıra",
  sampiyonluk: "Şampiyonluk",
};

export const STAT_KEYS: StatKey[] = [
  "accuracy",
  "passing",
  "defence",
  "control",
];

export const SKILL_KEYS: SkillKey[] = [
  "rainbowFeint",
  "nutmeg",
  "cannonShot",
  "slideTackle",
  "longPass",
  "layoffPass",
  "bananaCross",
  "reaction",
  "topInterceptor",
  "strongGoalkeeper",
  "playingOut",
  "headPlay",
  "throwIn",
];

export const LEAGUES: LeagueDefinition[] = [
  {
    id: "amator",
    name: "Amatör / En alt seviye",
    targets: {
      tutunma: { statTarget: 25, skillTarget: 0 },
      ortaSira: { statTarget: 32, skillTarget: 1 },
      sampiyonluk: { statTarget: 40, skillTarget: 1 },
    },
  },
  {
    id: "lig3",
    name: "3. Lig",
    targets: {
      tutunma: { statTarget: 38, skillTarget: 1 },
      ortaSira: { statTarget: 45, skillTarget: 1 },
      sampiyonluk: { statTarget: 52, skillTarget: 2 },
    },
  },
  {
    id: "lig2",
    name: "2. Lig",
    targets: {
      tutunma: { statTarget: 45, skillTarget: 1 },
      ortaSira: { statTarget: 55, skillTarget: 2 },
      sampiyonluk: { statTarget: 65, skillTarget: 3 },
    },
  },
  {
    id: "lig1",
    name: "1. Lig",
    targets: {
      tutunma: { statTarget: 58, skillTarget: 2 },
      ortaSira: { statTarget: 68, skillTarget: 3 },
      sampiyonluk: { statTarget: 76, skillTarget: 3 },
    },
  },
  {
    id: "ustLig",
    name: "Üst Lig",
    targets: {
      tutunma: { statTarget: 70, skillTarget: 3 },
      ortaSira: { statTarget: 78, skillTarget: 3 },
      sampiyonluk: { statTarget: 85, skillTarget: 4 },
    },
  },
  {
    id: "elit",
    name: "Avrupa / Elit",
    targets: {
      tutunma: { statTarget: 80, skillTarget: 4 },
      ortaSira: { statTarget: 88, skillTarget: 4 },
      sampiyonluk: { statTarget: 94, skillTarget: 5 },
    },
  },
];

export const DEFAULT_PLAYER_INPUT: PlayerInput = {
  regionFilter: "hepsi",
  leagueId: "lig2",
  ambition: "ortaSira",
  stats: {
    accuracy: 0,
    control: 0,
    passing: 0,
    defence: 0,
  },
  skills: {
    rainbowFeint: 0,
    nutmeg: 0,
    cannonShot: 0,
    slideTackle: 0,
    longPass: 0,
    layoffPass: 0,
    bananaCross: 0,
    reaction: 0,
    topInterceptor: 0,
    strongGoalkeeper: 0,
    playingOut: 0,
    headPlay: 0,
    throwIn: 0,
  },
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "CF",
    name: "MF - Saf golcü",
    region: "forvet",
    shortDescription:
      "Ceza sahasında bitirici. Accuracy ve şut becerileri ağırlıklı.",
    statWeights: { accuracy: 3.2, control: 0.8 },
    skillWeights: {
      cannonShot: 2.2,
      headPlay: 1.2,
      rainbowFeint: 0.7,
      nutmeg: 0.5,
    },
    criticalStats: ["accuracy"],
    criticalSkills: ["cannonShot", "headPlay"],
    notes: [
      "Şut pozisyonu buluyorsa çok değerlidir.",
      "Pas ve savunma düşük olsa da rolünü yapabilir.",
    ],
  },
  {
    id: "WF",
    name: "SLF SĞF - Kanat forvet",
    region: "forvet",
    shortDescription:
      "Break In, adam eksiltme ve çizgi tehdidi. Control becerisi önemlidir.",
    statWeights: { control: 2.8, accuracy: 1.2, passing: 0.6 },
    skillWeights: {
      rainbowFeint: 2.2,
      nutmeg: 1.8,
      cannonShot: 0.7,
      bananaCross: 0.6,
      headPlay: 0.4,
    },
    criticalStats: ["control"],
    criticalSkills: ["rainbowFeint", "nutmeg"],
    notes: [
      "Dar kadroda golcüden çok pozisyon hazırlayıcı gibi çalışır.",
      "Control düşükse rol skoru çabuk düşer.",
    ],
  },
  {
    id: "FW",
    name: "F - Çok yönlü forvet",
    region: "forvet",
    shortDescription:
      "Hava Topu, şut, pas bağlantısı ve fiziksel tehdit karışımı.",
    statWeights: { accuracy: 2.0, control: 1.3, passing: 0.8 },
    skillWeights: {
      headPlay: 2.0,
      cannonShot: 1.2,
      layoffPass: 0.9,
      rainbowFeint: 0.6,
    },
    criticalStats: ["accuracy", "control"],
    criticalSkills: ["headPlay"],
    notes: [
      "Tek forvet oynuyorsa en risksiz forvet sınıflarından biridir.",
      "Orta açan takımda Hava Topu değeri artar.",
    ],
  },
  {
    id: "AM",
    name: "OO - Hücum orta saha",
    region: "ortaSaha",
    shortDescription:
      "Savunmayı açar, forvete servis yapar, ceza sahası çevresinde etkilidir.",
    statWeights: { passing: 2.3, control: 1.8, accuracy: 0.9 },
    skillWeights: {
      layoffPass: 2.2,
      longPass: 1.1,
      rainbowFeint: 0.9,
      nutmeg: 0.6,
    },
    criticalStats: ["passing", "control"],
    criticalSkills: ["layoffPass"],
    notes: [
      "Pas düşükse AM verimi düşer.",
      "Control yüksekse savunma kilidini açma ihtimali artar.",
    ],
  },
  {
    id: "CM",
    name: "MO - Merkez pasör",
    region: "ortaSaha",
    shortDescription: "Tempo, pas bağlantısı ve oyun kurulum rolü.",
    statWeights: { passing: 3.0, control: 1.1, defence: 0.8 },
    skillWeights: { longPass: 2.1, layoffPass: 1.1, slideTackle: 0.5 },
    criticalStats: ["passing"],
    criticalSkills: ["longPass"],
    notes: [
      "Passing yüksekse düşük beceriyle bile iş görür.",
      "Savunma katkısı varsa DM alternatifi olabilir.",
    ],
  },
  {
    id: "WM",
    name: "SLO/SĞO - Kanat orta saha",
    region: "ortaSaha",
    shortDescription: "Kanattan taşıma, orta açma ve topu çizgide tutma.",
    statWeights: { control: 2.2, passing: 1.9, defence: 0.5 },
    skillWeights: {
      bananaCross: 2.0,
      longPass: 1.9,
      rainbowFeint: 1.2,
      nutmeg: 0.8,
      throwIn: 0.6,
    },
    criticalStats: ["control", "passing"],
    criticalSkills: ["longPass"],
    notes: [
      "Kanat oyunu oynuyorsan değerli olur.",
      "Sadece merkez oynuyorsan CM/MF daha mantıklı olabilir.",
    ],
  },
  {
    id: "DM",
    name: "DO - Defansif orta saha",
    region: "ortaSaha",
    shortDescription: "Pas keser, top kapar, defans hattını korur.",
    statWeights: { defence: 3.0, passing: 1.2, control: 0.7 },
    skillWeights: {
      topInterceptor: 2.1,
      slideTackle: 1.8,
      longPass: 0.9,
      layoffPass: 0.4,
    },
    criticalStats: ["defence"],
    criticalSkills: ["topInterceptor", "slideTackle"],
    notes: [
      "Defence düşükse DM rolü verimsizdir.",
      "Pas varsa topu kazanınca oyuna sokar.",
    ],
  },
  {
    id: "MF",
    name: "O - Esnek orta saha",
    region: "ortaSaha",
    shortDescription: "Mobil, görev adamı, pas-savunma-control dengesi.",
    statWeights: { passing: 1.8, control: 1.5, defence: 1.4, accuracy: 0.4 },
    skillWeights: {
      longPass: 1.2,
      layoffPass: 1.0,
      topInterceptor: 1.0,
      slideTackle: 1.0,
      rainbowFeint: 0.4,
    },
    criticalStats: ["passing", "defence"],
    criticalSkills: [],
    notes: [
      "Kadro zayıfsa joker oyuncu olarak çok işe yarar.",
      "Tek bir stat aşırı düşükse rol skoru dengeden düşer.",
    ],
  },
  {
    id: "CD",
    name: "D - Stoper",
    region: "defans",
    shortDescription:
      "Rakibin oyuncu geçişini ve ceza sahası girişini durdurur.",
    statWeights: { defence: 3.2, passing: 0.4, control: 0.3 },
    skillWeights: {
      topInterceptor: 1.8,
      headPlay: 1.7,
      slideTackle: 1.4,
      reaction: 0.8,
    },
    criticalStats: ["defence"],
    criticalSkills: ["topInterceptor", "headPlay", "slideTackle"],
    notes: [
      "Defence ana değer.",
      "Hava Topu duran top ve hava savunmasında fark yaratır.",
    ],
  },
  {
    id: "FB",
    name: "SLB/SĞB - Bek",
    region: "defans",
    shortDescription: "Kanat savunması, gerektiğinde çizgiden destek.",
    statWeights: { defence: 2.3, control: 1.1, passing: 0.9 },
    skillWeights: {
      topInterceptor: 1.5,
      slideTackle: 1.7,
      longPass: 0.9,
      throwIn: 0.8,
      reaction: 0.4,
    },
    criticalStats: ["defence"],
    criticalSkills: ["slideTackle"],
    notes: [
      "Kanatlardan çok saldırı yiyorsan iyi bek şart.",
      "Passing/Control yüksekse iki yönlü değer kazanır.",
    ],
  },
  {
    id: "SW",
    name: "L - Libero",
    region: "defans",
    shortDescription: "Kaleci önü sigorta, şut/pas hattını keser.",
    statWeights: { defence: 2.6, passing: 0.9, control: 0.5 },
    skillWeights: {
      reaction: 1.9,
      playingOut: 1.0,
      topInterceptor: 0.9,
      slideTackle: 0.8,
      headPlay: 0.7,
    },
    criticalStats: ["defence"],
    criticalSkills: ["reaction"],
    notes: [
      "Kaleci zayıfsa SW daha değerli olur.",
      "Reaksiyon yoksa bazı roller CD kadar net olmayabilir.",
    ],
  },
  {
    id: "DF",
    name: "D - Genel defans",
    region: "defans",
    shortDescription: "Savunma hattında esnek, görev adamı rol.",
    statWeights: { defence: 2.7, passing: 0.7, control: 0.5 },
    skillWeights: {
      topInterceptor: 1.4,
      slideTackle: 1.4,
      headPlay: 1.0,
      reaction: 0.7,
    },
    criticalStats: ["defence"],
    criticalSkills: [],
    notes: [
      "Özel rol tutmuyorsa güvenli savunmacı seçeneği.",
      "Üst seviye için özel beceri ihtiyacı artar.",
    ],
  },
  {
    id: "GK",
    name: "GK - Kaleci",
    region: "kaleci",
    shortDescription: "Şut durdurma, reaksiyon ve topu oyuna sokma.",
    statWeights: { defence: 3.6, passing: 0.4 },
    skillWeights: { strongGoalkeeper: 2.2, reaction: 1.8, playingOut: 1.1 },
    criticalStats: ["defence"],
    criticalSkills: ["strongGoalkeeper", "reaction"],
    notes: [
      "Defence düşükse lig seviyesi yükseldikçe açık verir.",
      "Playing Out pasla çıkmayı seven takımlarda artı değer.",
    ],
  },
];

export function getLeague(id: LeagueId): LeagueDefinition {
  return LEAGUES.find((league) => league.id === id) ?? LEAGUES[2];
}
