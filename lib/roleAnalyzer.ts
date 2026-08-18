import {
  ROLE_DEFINITIONS,
  SKILL_LABELS,
  STAT_LABELS,
  getLeague,
} from "@/data/ftgRoleData";
import type {
  LeagueTarget,
  PlayerInput,
  RoleAnalysis,
  RoleDefinition,
  RoleId,
  SkillKey,
  StatKey,
} from "@/types/ftg";

type GuideGrade =
  | "A++"
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D+"
  | "D"
  | "D-"
  | "F+"
  | "F";

const GUIDE_STAT_GRADES: Record<
  RoleId,
  Partial<Record<StatKey, GuideGrade>>
> = {
  CF: { accuracy: "A+", control: "B+", defence: "D-", passing: "F" },
  WF: { control: "A+", passing: "B", accuracy: "C+", defence: "D+" },
  FW: { control: "A", accuracy: "A-", defence: "B", passing: "D" },
  AM: { accuracy: "A+", passing: "B", defence: "C", control: "D-" },
  CM: { passing: "A+", defence: "B", control: "D+", accuracy: "F" },
  WM: { control: "B+", passing: "B+", defence: "C", accuracy: "F+" },
  DM: { defence: "A+", passing: "C+", control: "D+", accuracy: "F" },
  MF: { passing: "A", defence: "B", control: "C+", accuracy: "D-" },
  CD: { defence: "A+", control: "B", passing: "C" },
  FB: { defence: "B+", passing: "C+", control: "C" },
  SW: { defence: "A++", passing: "C", control: "C-" },
  DF: { defence: "A+", control: "B", passing: "C-" },
  GK: { defence: "A++", control: "B", passing: "D-" },
};

const GUIDE_SKILL_GRADES: Record<
  RoleId,
  Partial<Record<SkillKey, GuideGrade>>
> = {
  CF: {
    rainbowFeint: "A+",
    cannonShot: "A-",
    headPlay: "B+",
    nutmeg: "C-",
    slideTackle: "D-",
  },
  WF: { cannonShot: "A+", rainbowFeint: "A-", slideTackle: "C", nutmeg: "D" },
  FW: {
    headPlay: "A+",
    nutmeg: "A",
    cannonShot: "A-",
    rainbowFeint: "A-",
    slideTackle: "B+",
    layoffPass: "D-",
  },
  AM: {
    rainbowFeint: "A+",
    layoffPass: "A-",
    nutmeg: "B+",
    cannonShot: "C",
    slideTackle: "D",
  },
  CM: {
    slideTackle: "B+",
    reaction: "B",
    longPass: "C-",
    layoffPass: "D+",
    nutmeg: "D",
    throwIn: "D",
  },
  WM: {
    bananaCross: "A",
    slideTackle: "A",
    cannonShot: "B",
    longPass: "B-",
    layoffPass: "B-",
    reaction: "F+",
    nutmeg: "F+",
  },
  DM: {
    topInterceptor: "A+",
    longPass: "A+",
    reaction: "B-",
    slideTackle: "C+",
    layoffPass: "C",
    headPlay: "C-",
  },
  MF: {
    topInterceptor: "A",
    slideTackle: "A+",
    longPass: "A",
    layoffPass: "A-",
    reaction: "B+",
    nutmeg: "B-",
    cannonShot: "C",
    throwIn: "B-",
  },
  CD: {
    topInterceptor: "A+",
    reaction: "A+",
    headPlay: "A",
    longPass: "A-",
    layoffPass: "C-",
    slideTackle: "D-",
  },
  FB: {
    topInterceptor: "A",
    slideTackle: "A+",
    longPass: "A-",
    layoffPass: "B-",
    throwIn: "C-",
    reaction: "D",
  },
  SW: {
    topInterceptor: "A",
    reaction: "A",
    longPass: "B+",
    slideTackle: "B-",
    headPlay: "C+",
  },
  DF: {
    topInterceptor: "A+",
    slideTackle: "A+",
    longPass: "A",
    reaction: "B",
    headPlay: "B",
    throwIn: "C+",
    layoffPass: "C",
  },
  GK: {
    strongGoalkeeper: "A+",
    playingOut: "A",
    longPass: "A",
    reaction: "B",
  },
};

const GRADE_PRIORITY_WEIGHT: Record<GuideGrade, number> = {
  "A++": 4.8,
  "A+": 4.4,
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.8,
  "C+": 2.4,
  C: 2.1,
  "C-": 1.9,
  "D+": 1.5,
  D: 1.3,
  "D-": 1.1,
  "F+": 0.9,
  F: 0.7,
};

const GRADE_SHAPE_EXPONENT: Record<GuideGrade, number> = {
  "A++": 2.3,
  "A+": 2.1,
  A: 1.9,
  "A-": 1.75,
  "B+": 1.55,
  B: 1.4,
  "B-": 1.3,
  "C+": 1.2,
  C: 1.1,
  "C-": 1.05,
  "D+": 1,
  D: 0.95,
  "D-": 0.9,
  "F+": 0.85,
  F: 0.8,
};

function isHighPriorityGrade(grade: GuideGrade) {
  return grade === "A++" || grade === "A+" || grade === "A" || grade === "A-";
}

function clamp(value: number, min: number, max: number) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}

function getTarget(
  input: PlayerInput,
  customTarget?: LeagueTarget,
): LeagueTarget {
  if (customTarget) {
    return {
      statTarget: clamp(customTarget.statTarget, 0, 100),
      skillTarget: clamp(customTarget.skillTarget, 0, 5),
    };
  }

  return getLeague(input.leagueId).targets[input.ambition];
}

function calculateRoleScore(input: PlayerInput, role: RoleDefinition) {
  let rawScore = 0;
  let maxScore = 0;

  Object.entries(role.statWeights).forEach(([key, weight]) => {
    const statValue = clamp(
      input.stats[key as keyof typeof input.stats],
      0,
      100,
    );
    rawScore += statValue * (weight ?? 0);
    maxScore += 100 * (weight ?? 0);
  });

  Object.entries(role.skillWeights).forEach(([key, weight]) => {
    const skillValue =
      clamp(input.skills[key as keyof typeof input.skills], 0, 5) * 20;
    rawScore += skillValue * (weight ?? 0);
    maxScore += 100 * (weight ?? 0);
  });

  const score = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;

  return {
    rawScore,
    maxScore,
    score: clamp(score, 0, 100),
  };
}

function calculateGuideScore(
  input: PlayerInput,
  target: LeagueTarget,
  roleId: RoleId,
) {
  const statGrades = GUIDE_STAT_GRADES[roleId];
  const skillGrades = GUIDE_SKILL_GRADES[roleId];

  let weightedScore = 0;
  let maxWeight = 0;
  let leaguePenalty = 0;

  Object.entries(statGrades).forEach(([key, grade]) => {
    if (!grade) return;
    const statValue = clamp(input.stats[key as StatKey], 0, 100);
    const normalized = statValue / 100;
    const weight = GRADE_PRIORITY_WEIGHT[grade];
    const shaped = normalized ** GRADE_SHAPE_EXPONENT[grade];

    weightedScore += shaped * weight;
    maxWeight += weight;

    if (isHighPriorityGrade(grade) && statValue < target.statTarget) {
      leaguePenalty += ((target.statTarget - statValue) / 100) * 8;
    }
  });

  Object.entries(skillGrades).forEach(([key, grade]) => {
    if (!grade) return;
    const skillValue = clamp(input.skills[key as SkillKey], 0, 5);
    const normalized = skillValue / 5;
    const weight = GRADE_PRIORITY_WEIGHT[grade];
    const shaped = normalized ** GRADE_SHAPE_EXPONENT[grade];

    weightedScore += shaped * weight;
    maxWeight += weight;

    if (isHighPriorityGrade(grade) && skillValue < target.skillTarget) {
      leaguePenalty += ((target.skillTarget - skillValue) / 5) * 10;
    }
  });

  if (maxWeight === 0) return 0;

  return clamp((weightedScore / maxWeight) * 100 - leaguePenalty, 0, 100);
}

function calculateTargetFitScore(
  input: PlayerInput,
  target: LeagueTarget,
  criticalStats: StatKey[],
  criticalSkills: SkillKey[],
) {
  const statFit =
    criticalStats.length === 0
      ? 1
      : criticalStats.reduce((sum, key) => {
          if (target.statTarget <= 0) return sum + 1;
          return sum + clamp(input.stats[key] / target.statTarget, 0, 1);
        }, 0) / criticalStats.length;

  const skillFit =
    criticalSkills.length === 0
      ? 1
      : criticalSkills.reduce((sum, key) => {
          if (target.skillTarget <= 0) return sum + 1;
          return sum + clamp(input.skills[key] / target.skillTarget, 0, 1);
        }, 0) / criticalSkills.length;

  return Math.round(clamp((statFit * 0.55 + skillFit * 0.45) * 100, 0, 100));
}

function buildVerdict(
  score: number,
  missingStats: unknown[],
  missingSkills: unknown[],
) {
  const missingCount = missingStats.length + missingSkills.length;

  if (score >= 78 && missingCount === 0) {
    return {
      verdict: "guclu" as const,
      verdictText:
        "Bu lig/hedef için güçlü. Ana rolde oynat veya değeri artınca yüksek fiyata sat.",
    };
  }

  if (score >= 62 && missingCount <= 1) {
    return {
      verdict: "oynar" as const,
      verdictText:
        "Oynar. Kritik eksik az; takım zayıfsa ana kadro, kadro genişse rotasyon.",
    };
  }

  if (score >= 45) {
    return {
      verdict: "gelistir" as const,
      verdictText:
        "Geliştirme adayı. Yaşı gençse tut; yaşlıysa ve interest high yakalarsan satmayı düşün.",
    };
  }

  return {
    verdict: "satVeyaYedek" as const,
    verdictText:
      "Bu hedef için zayıf. Genç/potansiyelli değilse yedek veya satış adayı.",
  };
}

function buildDecision(
  score: number,
  missingCount: number,
): Pick<RoleAnalysis, "decision" | "decisionText" | "riskLevel"> {
  if (score >= 80 && missingCount === 0) {
    return {
      decision: "tut",
      decisionText: "Ana rolde tut. Satış için acele etme.",
      riskLevel: "dusuk",
    };
  }

  if (score >= 65 && missingCount <= 1) {
    return {
      decision: "tut",
      decisionText: "Rotasyon/ilk 11 için tut. Form durumuna göre değerlendir.",
      riskLevel: "orta",
    };
  }

  if (score >= 48) {
    return {
      decision: "gelistir",
      decisionText: "Kısa vadede geliştir, uygun teklif gelirse değerlendir.",
      riskLevel: "orta",
    };
  }

  return {
    decision: "sat",
    decisionText: "Bu hedef için satış veya yedek en rasyonel seçenek.",
    riskLevel: "yuksek",
  };
}

function calculateConfidence(
  score: number,
  missingCount: number,
  scoreGapToNext: number,
) {
  const base = 52 + scoreGapToNext * 2.4 + (score - 60) * 0.35;
  const penalty = missingCount * 7;
  return Math.round(clamp(base - penalty, 30, 96));
}

function getGuideCriticalStats(roleId: RoleId) {
  return Object.entries(GUIDE_STAT_GRADES[roleId])
    .filter(([, grade]) => grade && isHighPriorityGrade(grade))
    .map(([key]) => key as StatKey);
}

function getGuideCriticalSkills(roleId: RoleId) {
  return Object.entries(GUIDE_SKILL_GRADES[roleId])
    .filter(([, grade]) => grade && isHighPriorityGrade(grade))
    .map(([key]) => key as SkillKey);
}

export function analyzeRoles(
  input: PlayerInput,
  customTarget?: LeagueTarget,
): RoleAnalysis[] {
  const target = getTarget(input, customTarget);

  const analyzed = ROLE_DEFINITIONS.map((role) => {
    const legacyScore = calculateRoleScore(input, role);
    const guideScore = calculateGuideScore(input, target, role.id);
    const isFilteredOut =
      input.regionFilter !== "hepsi" && input.regionFilter !== role.region;

    const guideCriticalStats = getGuideCriticalStats(role.id);
    const guideCriticalSkills = getGuideCriticalSkills(role.id);
    const criticalStats =
      guideCriticalStats.length > 0 ? guideCriticalStats : role.criticalStats;
    const criticalSkills =
      guideCriticalSkills.length > 0
        ? guideCriticalSkills
        : role.criticalSkills;

    const roleFitScore = clamp(
      legacyScore.score * 0.35 + guideScore * 0.65,
      0,
      100,
    );
    const targetFitScore = calculateTargetFitScore(
      input,
      target,
      criticalStats,
      criticalSkills,
    );
    const score = clamp(roleFitScore * 0.55 + targetFitScore * 0.45, 0, 100);
    const rawScore = score;
    const maxScore = 100;

    const missingStats = criticalStats
      .filter((statKey) => input.stats[statKey] < target.statTarget)
      .map((statKey) => ({
        key: statKey,
        label: STAT_LABELS[statKey],
        value: input.stats[statKey],
        target: target.statTarget,
      }));

    const missingSkills = criticalSkills
      .filter((skillKey) => input.skills[skillKey] < target.skillTarget)
      .map((skillKey) => ({
        key: skillKey,
        label: SKILL_LABELS[skillKey],
        value: input.skills[skillKey],
        target: target.skillTarget,
      }));

    return {
      role,
      score,
      rawScore,
      maxScore,
      isFilteredOut,
      missingStats,
      missingSkills,
      ...buildVerdict(score, missingStats, missingSkills),
    };
  }).sort((a, b) => {
    if (a.isFilteredOut !== b.isFilteredOut) return a.isFilteredOut ? 1 : -1;
    return b.score - a.score;
  });

  return analyzed.map((result, index) => {
    const next = analyzed[index + 1];
    const scoreGapToNext = next ? Math.max(0, result.score - next.score) : 6;
    const missingCount =
      result.missingStats.length + result.missingSkills.length;

    return {
      ...result,
      ...buildDecision(result.score, missingCount),
      confidence: calculateConfidence(
        result.score,
        missingCount,
        scoreGapToNext,
      ),
    };
  });
}

function getBestRole(input: PlayerInput, customTarget?: LeagueTarget) {
  return (
    analyzeRoles(input, customTarget).find((result) => !result.isFilteredOut) ??
    null
  );
}
