export type Region = "forvet" | "ortaSaha" | "defans" | "kaleci";
export type RegionFilter = Region | "hepsi";

export type StatKey = "accuracy" | "control" | "passing" | "defence";

export type SkillKey =
  | "headPlay"
  | "rainbowFeint"
  | "nutmeg"
  | "cannonShot"
  | "layoffPass"
  | "longPass"
  | "bananaCross"
  | "slideTackle"
  | "topInterceptor"
  | "throwIn"
  | "reaction"
  | "strongGoalkeeper"
  | "playingOut";

export type RoleId =
  | "CF"
  | "WF"
  | "FW"
  | "AM"
  | "CM"
  | "WM"
  | "DM"
  | "MF"
  | "CD"
  | "FB"
  | "SW"
  | "DF"
  | "GK";

export type LeagueId = "amator" | "lig3" | "lig2" | "lig1" | "ustLig" | "elit";
export type Ambition = "tutunma" | "ortaSira" | "sampiyonluk";

type NumberMap<T extends string> = Record<T, number>;

export type PlayerInput = {
  regionFilter: RegionFilter;
  leagueId: LeagueId;
  ambition: Ambition;
  stats: NumberMap<StatKey>;
  skills: NumberMap<SkillKey>;
};

export type LeagueTarget = {
  statTarget: number;
  skillTarget: number;
};

export type LeagueDefinition = {
  id: LeagueId;
  name: string;
  targets: Record<Ambition, LeagueTarget>;
};

export type RoleDefinition = {
  id: RoleId;
  name: string;
  region: Region;
  shortDescription: string;
  statWeights: Partial<NumberMap<StatKey>>;
  skillWeights: Partial<NumberMap<SkillKey>>;
  criticalStats: StatKey[];
  criticalSkills: SkillKey[];
  notes: string[];
};

export type RoleAnalysis = {
  role: RoleDefinition;
  score: number;
  rawScore: number;
  maxScore: number;
  isFilteredOut: boolean;
  missingStats: Array<{
    key: StatKey;
    label: string;
    value: number;
    target: number;
  }>;
  missingSkills: Array<{
    key: SkillKey;
    label: string;
    value: number;
    target: number;
  }>;
  verdict: "guclu" | "oynar" | "gelistir" | "satVeyaYedek";
  verdictText: string;
  decision: "tut" | "gelistir" | "sat";
  decisionText: string;
  riskLevel: "dusuk" | "orta" | "yuksek";
  confidence: number;
};
