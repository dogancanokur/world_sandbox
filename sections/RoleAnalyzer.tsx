"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleAlert,
  Copy,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AMBITION_LABELS,
  DEFAULT_PLAYER_INPUT,
  LEAGUES,
  REGION_LABELS,
  ROLE_DEFINITIONS,
  SKILL_KEYS,
  SKILL_LABELS,
  STAT_KEYS,
  STAT_LABELS,
  getLeague,
} from "@/data/ftgRoleData";
import { analyzeRoles } from "@/lib/roleAnalyzer";
import { cn } from "@/lib/utils";
import type {
  Ambition,
  LeagueId,
  LeagueTarget,
  PlayerInput,
  RegionFilter,
  RoleId,
  SkillKey,
  StatKey,
} from "@/types/ftg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STORAGE_KEY = "ftg-role-analyzer:v2";

type WantedProfile = {
  roleId: RoleId | "";
  stats: Partial<Record<StatKey, boolean>>;
  skills: Partial<Record<SkillKey, boolean>>;
  statTarget: number;
  skillTarget: number;
};

const DEFAULT_WANTED_PROFILE: WantedProfile = {
  roleId: "",
  stats: {},
  skills: {},
  statTarget: 45,
  skillTarget: 1,
};

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

const ROLE_STAT_GRADES: Record<RoleId, Partial<Record<StatKey, GuideGrade>>> = {
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

const ROLE_SKILL_GRADES: Record<
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

const GRADE_TARGET_RATIO: Record<GuideGrade, number> = {
  "A++": 1,
  "A+": 0.98,
  A: 0.96,
  "A-": 0.94,
  "B+": 0.9,
  B: 0.87,
  "B-": 0.84,
  "C+": 0.78,
  C: 0.74,
  "C-": 0.7,
  "D+": 0.66,
  D: 0.62,
  "D-": 0.58,
  "F+": 0.54,
  F: 0.5,
};

function isPrimaryOrSecondaryGrade(grade: GuideGrade) {
  return (
    grade === "A++" ||
    grade === "A+" ||
    grade === "A" ||
    grade === "A-" ||
    grade === "B+" ||
    grade === "B" ||
    grade === "B-"
  );
}

function isPrimaryGrade(grade: GuideGrade) {
  return grade === "A++" || grade === "A+" || grade === "A" || grade === "A-";
}

function isSecondaryGrade(grade: GuideGrade) {
  return grade === "B+" || grade === "B" || grade === "B-";
}

function buildTargetFromGrades<T extends string>(
  baseTarget: number,
  gradeMap: Partial<Record<T, GuideGrade>>,
  keys: T[],
) {
  if (keys.length === 0) return baseTarget;

  const averageRatio =
    keys.reduce(
      (sum, key) => sum + GRADE_TARGET_RATIO[gradeMap[key] ?? "B-"],
      0,
    ) / keys.length;

  return Math.round(baseTarget * averageRatio);
}

function toNumber(value: string, min: number, max: number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

function getDefaultTarget(input: PlayerInput): LeagueTarget {
  return getLeague(input.leagueId).targets[input.ambition];
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div
      className="flex min-w-28 items-center gap-3"
      aria-label={`Skor ${Math.round(value)}`}
    >
      <Progress value={Math.round(value)} className="h-2" />
    </div>
  );
}

function decisionBadgeVariant(decision: "tut" | "gelistir" | "sat") {
  if (decision === "tut") return "secondary" as const;
  if (decision === "gelistir") return "outline" as const;
  return "destructive" as const;
}

function riskLabel(riskLevel: "dusuk" | "orta" | "yuksek") {
  if (riskLevel === "dusuk") return "Düşük risk";
  if (riskLevel === "orta") return "Orta risk";
  return "Yüksek risk";
}

function decisionLabel(decision: "tut" | "gelistir" | "sat") {
  if (decision === "tut") return "TUT";
  if (decision === "gelistir") return "GELİŞTİR";
  return "SAT";
}

function NumberInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(toNumber(event.target.value, min, max))}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  children,
  onChange,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <NativeSelect
        className="w-full"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </NativeSelect>
    </div>
  );
}

function CheckField({
  label,
  checked,
  onCheckedChange,
  className,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm",
        className,
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span className="leading-none">{label}</span>
    </label>
  );
}

function MetricInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-2 rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Input
          className="h-8 w-20"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(toNumber(event.target.value, min, max))}
        />
      </div>
    </div>
  );
}

function MissingList({
  emptyText,
  items,
}: {
  emptyText: string;
  items: Array<{ key: string; label: string; value: number; target: number }>;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="grid gap-2 text-sm">
      {items.map((item) => (
        <li
          className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"
          key={item.key}
        >
          <span>{item.label}</span>
          <Badge variant="outline">
            {item.value} / hedef {item.target}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function RoleAnalyzer() {
  const { t } = useTranslation();

  const [input, setInput] = useState<PlayerInput>(DEFAULT_PLAYER_INPUT);
  const [useCustomTarget, setUseCustomTarget] = useState(false);
  const [customTarget, setCustomTarget] = useState<LeagueTarget>(() =>
    getDefaultTarget(DEFAULT_PLAYER_INPUT),
  );
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId | "">("");
  const [priorityRoleId, setPriorityRoleId] = useState<RoleId | "">("");
  const [wantedProfile, setWantedProfile] = useState<WantedProfile>(
    DEFAULT_WANTED_PROFILE,
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        input?: PlayerInput;
        useCustomTarget?: boolean;
        customTarget?: LeagueTarget;
        selectedRoleId?: RoleId | "";
        priorityRoleId?: RoleId | "";
        wantedProfile?: WantedProfile;
      };

      if (parsed.input) {
        setInput({
          ...DEFAULT_PLAYER_INPUT,
          ...parsed.input,
          stats: {
            ...DEFAULT_PLAYER_INPUT.stats,
            ...(parsed.input.stats ?? {}),
          },
          skills: {
            ...DEFAULT_PLAYER_INPUT.skills,
            ...(parsed.input.skills ?? {}),
          },
        });
      }
      if (typeof parsed.useCustomTarget === "boolean") {
        setUseCustomTarget(parsed.useCustomTarget);
      }
      if (parsed.customTarget) setCustomTarget(parsed.customTarget);
      if (parsed.selectedRoleId !== undefined) {
        setSelectedRoleId(parsed.selectedRoleId);
      }
      if (parsed.priorityRoleId !== undefined) {
        setPriorityRoleId(parsed.priorityRoleId);
      }
      if (parsed.wantedProfile) {
        setWantedProfile({
          ...DEFAULT_WANTED_PROFILE,
          ...parsed.wantedProfile,
          stats: parsed.wantedProfile.stats ?? {},
          skills: parsed.wantedProfile.skills ?? {},
        });
      }
    } catch {
      // Bozuk localStorage verisi uygulamayı kırmasın.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        input,
        useCustomTarget,
        customTarget,
        selectedRoleId,
        priorityRoleId,
        wantedProfile,
      }),
    );
  }, [
    input,
    useCustomTarget,
    customTarget,
    selectedRoleId,
    priorityRoleId,
    wantedProfile,
  ]);

  useEffect(() => {
    if (!useCustomTarget) setCustomTarget(getDefaultTarget(input));
  }, [input.leagueId, input.ambition, useCustomTarget]);

  const activeTarget = useCustomTarget ? customTarget : getDefaultTarget(input);

  const results = useMemo(
    () => analyzeRoles(input, activeTarget),
    [input, activeTarget],
  );
  const visibleResults = results.filter((result) => !result.isFilteredOut);
  const best = visibleResults[0] ?? null;

  const roleOptions = useMemo(
    () =>
      ROLE_DEFINITIONS.filter(
        (role) =>
          input.regionFilter === "hepsi" || role.region === input.regionFilter,
      ),
    [input.regionFilter],
  );

  const selectedRoleAnalysis = useMemo(() => {
    if (!selectedRoleId) return null;
    return results.find((result) => result.role.id === selectedRoleId) ?? null;
  }, [results, selectedRoleId]);

  const wantedRole = useMemo(() => {
    if (!wantedProfile.roleId) return null;
    return (
      ROLE_DEFINITIONS.find((role) => role.id === wantedProfile.roleId) ?? null
    );
  }, [wantedProfile.roleId]);

  const priorityRole = useMemo(() => {
    if (!priorityRoleId) return null;
    return ROLE_DEFINITIONS.find((role) => role.id === priorityRoleId) ?? null;
  }, [priorityRoleId]);

  const wantedMissingStats = useMemo(
    () =>
      STAT_KEYS.filter((key) => wantedProfile.stats[key])
        .filter((key) => input.stats[key] < wantedProfile.statTarget)
        .map((key) => ({
          key,
          label: STAT_LABELS[key],
          value: input.stats[key],
          target: wantedProfile.statTarget,
        })),
    [input.stats, wantedProfile.statTarget, wantedProfile.stats],
  );

  const wantedMissingSkills = useMemo(
    () =>
      SKILL_KEYS.filter((key) => wantedProfile.skills[key])
        .filter((key) => input.skills[key] < wantedProfile.skillTarget)
        .map((key) => ({
          key,
          label: SKILL_LABELS[key],
          value: input.skills[key],
          target: wantedProfile.skillTarget,
        })),
    [input.skills, wantedProfile.skillTarget, wantedProfile.skills],
  );

  const wantedSelectedCount = useMemo(
    () =>
      STAT_KEYS.filter((key) => wantedProfile.stats[key]).length +
      SKILL_KEYS.filter((key) => wantedProfile.skills[key]).length,
    [wantedProfile.stats, wantedProfile.skills],
  );

  useEffect(() => {
    if (
      selectedRoleId &&
      !roleOptions.some((role) => role.id === selectedRoleId)
    ) {
      setSelectedRoleId("");
    }

    if (
      wantedProfile.roleId &&
      !roleOptions.some((role) => role.id === wantedProfile.roleId)
    ) {
      setWantedProfile((current) => ({ ...current, roleId: "" }));
    }
  }, [roleOptions, selectedRoleId, wantedProfile.roleId]);

  const updateStat = (key: StatKey, value: number) => {
    setInput((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [key]: value,
      },
    }));
  };

  const updateSkill = (key: SkillKey, value: number) => {
    setInput((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [key]: value,
      },
    }));
  };

  const toggleWantedStat = (key: StatKey, checked: boolean) => {
    setWantedProfile((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [key]: checked,
      },
    }));
  };

  const toggleWantedSkill = (key: SkillKey, checked: boolean) => {
    setWantedProfile((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [key]: checked,
      },
    }));
  };

  const fillWantedProfileFromRole = () => {
    if (!wantedRole) return;

    const statGradeMap = ROLE_STAT_GRADES[wantedRole.id];
    const skillGradeMap = ROLE_SKILL_GRADES[wantedRole.id];

    const selectedStats = STAT_KEYS.filter((key) =>
      isPrimaryOrSecondaryGrade(statGradeMap[key] ?? "F"),
    );
    const selectedSkills = SKILL_KEYS.filter((key) =>
      isPrimaryOrSecondaryGrade(skillGradeMap[key] ?? "F"),
    );

    const wantedStats =
      selectedStats.length > 0 ? selectedStats : wantedRole.criticalStats;
    const wantedSkills =
      selectedSkills.length > 0 ? selectedSkills : wantedRole.criticalSkills;

    setWantedProfile((current) => ({
      ...current,
      statTarget: buildTargetFromGrades(
        activeTarget.statTarget,
        statGradeMap,
        wantedStats,
      ),
      skillTarget: buildTargetFromGrades(
        activeTarget.skillTarget,
        skillGradeMap,
        wantedSkills,
      ),
      stats: wantedStats.reduce<Partial<Record<StatKey, boolean>>>(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {},
      ),
      skills: wantedSkills.reduce<Partial<Record<SkillKey, boolean>>>(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {},
      ),
    }));
  };

  const clearWantedProfile = () => {
    setWantedProfile((current) => ({
      ...DEFAULT_WANTED_PROFILE,
      roleId: current.roleId,
      statTarget: activeTarget.statTarget,
      skillTarget: activeTarget.skillTarget,
    }));
  };

  const reset = () => {
    setInput(DEFAULT_PLAYER_INPUT);
    setUseCustomTarget(false);
    setCustomTarget(getDefaultTarget(DEFAULT_PLAYER_INPUT));
    setSelectedRoleId("");
    setPriorityRoleId("");
    setWantedProfile(DEFAULT_WANTED_PROFILE);
  };

  const copyAnalysis = async () => {
    if (!best) return;

    const missing = [
      ...best.missingStats.map(
        (item) => `${item.label}: ${item.value}/${item.target}`,
      ),
      ...best.missingSkills.map(
        (item) => `${item.label}: ${item.value}/${item.target}`,
      ),
    ];

    const text = [
      `En uygun rol: ${best.role.name}`,
      `Rol skoru: ${Math.round(best.score)}%`,
      `Aksiyon: ${decisionLabel(best.decision)} (${riskLabel(best.riskLevel)})`,
      `Güven: ${best.confidence}%`,
      `Lig: ${getLeague(input.leagueId).name} / ${AMBITION_LABELS[input.ambition]}`,
      `Hedef: Stat ${activeTarget.statTarget}, Beceri ${activeTarget.skillTarget}`,
      `Karar: ${best.verdictText}`,
      `Eksikler: ${missing.length ? missing.join(", ") : "Yok"}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
  };

  const selectedRoleMissing = selectedRoleAnalysis
    ? [
        ...selectedRoleAnalysis.missingStats,
        ...selectedRoleAnalysis.missingSkills,
      ]
    : [];
  const bestMissing = best ? [...best.missingStats, ...best.missingSkills] : [];
  const wantedMissing = [...wantedMissingStats, ...wantedMissingSkills];
  const secondBest = visibleResults[1] ?? null;
  const scoreGap =
    best && secondBest ? Math.round(best.score - secondBest.score) : null;
  const bestMissingCount = best
    ? best.missingStats.length + best.missingSkills.length
    : 0;

  const getPriorityTone = (grade: GuideGrade | undefined, isSkill = false) => {
    if (grade && isPrimaryGrade(grade)) {
      return "border-red-300 bg-red-500/10 text-red-700 dark:border-red-900 dark:text-red-300";
    }
    if (grade && isSecondaryGrade(grade)) {
      return "border-yellow-300 bg-yellow-500/10 text-yellow-800 dark:border-yellow-900 dark:text-yellow-300";
    }
    if (isSkill) {
      return "border-blue-300 bg-blue-500/10 text-blue-800 dark:border-blue-900 dark:text-blue-300";
    }
    return "border-muted bg-muted/40 text-muted-foreground";
  };

  const statPriorityItems = priorityRole
    ? STAT_KEYS.map((key) => ({
        key,
        label: STAT_LABELS[key],
        grade: ROLE_STAT_GRADES[priorityRole.id][key],
      }))
    : [];

  const skillPriorityItems = priorityRole
    ? SKILL_KEYS.map((key) => ({
        key,
        label: SKILL_LABELS[key],
        grade: ROLE_SKILL_GRADES[priorityRole.id][key],
      }))
    : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <Badge variant="secondary">
            Football, Tactics & Glory - Unofficial Analyzer
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
              {t("Oyuncu Rol & Lig Seviyesi Analiz Aracı")}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {t("ftgPlayerInfoText")}
            </p>
          </div>
        </div>

        <Alert>
          <AlertTitle>{t("ftgPlayerWarningText1")}</AlertTitle>
          <AlertDescription>
            {t("ftgPlayerWarningText2")}
            {t("ftgPlayerWarningText3")}
          </AlertDescription>
        </Alert>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle>1. Filtre ve lig hedefi</CardTitle>
            <CardDescription>
              Rol havuzunu daralt, lig ve hedef seviyesini belirle.
            </CardDescription>
            <CardAction>
              <Button variant="ghost" type="button" onClick={reset}>
                <RotateCcw />
                Sıfırla
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Bölge filtresi"
                value={input.regionFilter}
                onChange={(value) =>
                  setInput((current) => ({
                    ...current,
                    regionFilter: value as RegionFilter,
                  }))
                }
              >
                {Object.entries(REGION_LABELS).map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </SelectField>

              <SelectField
                label="Lig seviyesi"
                value={input.leagueId}
                onChange={(value) =>
                  setInput((current) => ({
                    ...current,
                    leagueId: value as LeagueId,
                  }))
                }
              >
                {LEAGUES.map((league) => (
                  <NativeSelectOption key={league.id} value={league.id}>
                    {league.name}
                  </NativeSelectOption>
                ))}
              </SelectField>

              <SelectField
                label="Hedef"
                value={input.ambition}
                onChange={(value) =>
                  setInput((current) => ({
                    ...current,
                    ambition: value as Ambition,
                  }))
                }
              >
                {Object.entries(AMBITION_LABELS).map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </SelectField>

              <SelectField
                label="Seçeceğim rol"
                value={selectedRoleId}
                onChange={(value) => setSelectedRoleId(value as RoleId | "")}
              >
                <NativeSelectOption value="">Rol seç</NativeSelectOption>
                {roleOptions.map((role) => (
                  <NativeSelectOption key={role.id} value={role.id}>
                    {role.name}
                  </NativeSelectOption>
                ))}
              </SelectField>
            </div>

            <CheckField
              label="Eşiği kendim ayarlayacağım"
              checked={useCustomTarget}
              onCheckedChange={setUseCustomTarget}
            />

            <div className="grid gap-4 rounded-lg border bg-muted/25 p-4 md:grid-cols-2">
              <NumberInput
                label="Kritik stat hedefi"
                min={0}
                max={100}
                value={activeTarget.statTarget}
                onChange={(value) => {
                  setUseCustomTarget(true);
                  setCustomTarget((current) => ({
                    ...current,
                    statTarget: value,
                  }));
                }}
              />
              <NumberInput
                label="Kritik beceri hedefi"
                min={0}
                max={5}
                step={0.5}
                value={activeTarget.skillTarget}
                onChange={(value) => {
                  setUseCustomTarget(true);
                  setCustomTarget((current) => ({
                    ...current,
                    skillTarget: value,
                  }));
                }}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="grid content-start gap-3 rounded-lg border p-4">
                <h3 className="font-medium">Stat puanları</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {STAT_KEYS.map((key) => (
                    <MetricInput
                      key={key}
                      label={STAT_LABELS[key]}
                      min={0}
                      max={100}
                      value={input.stats[key]}
                      onChange={(value) => updateStat(key, value)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid content-start gap-3 rounded-lg border p-4">
                <h3 className="font-medium">Beceri seviyeleri</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SKILL_KEYS.map((key) => (
                    <MetricInput
                      key={key}
                      label={SKILL_LABELS[key]}
                      min={0}
                      max={5}
                      step={1}
                      value={input.skills[key]}
                      onChange={(value) => updateSkill(key, value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sonuç</CardTitle>
            <CardDescription>En yakın rol ve kritik eksikler.</CardDescription>
            <CardAction>
              <Button type="button" onClick={copyAnalysis} disabled={!best}>
                <Copy />
                Kopyala
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-4">
            {best ? (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Aksiyon</p>
                    <div className="mt-1 flex items-center gap-2">
                      {best.decision === "sat" ? (
                        <ShieldAlert className="size-4 text-destructive" />
                      ) : (
                        <ShieldCheck className="size-4 text-emerald-600" />
                      )}
                      <Badge variant={decisionBadgeVariant(best.decision)}>
                        {decisionLabel(best.decision)}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Güven</p>
                    <div className="mt-1 flex items-center gap-2">
                      <TrendingUp className="size-4 text-primary" />
                      <p className="text-sm font-medium">%{best.confidence}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Risk</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CircleAlert className="size-4 text-amber-600" />
                      <p className="text-sm font-medium">
                        {riskLabel(best.riskLevel)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "grid gap-3 rounded-lg border p-4",
                    best.verdict === "guclu" &&
                      "border-emerald-500/30 bg-emerald-500/10",
                    best.verdict === "oynar" &&
                      "border-amber-500/30 bg-amber-500/10",
                    (best.verdict === "gelistir" ||
                      best.verdict === "satVeyaYedek") &&
                      "border-destructive/30 bg-destructive/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        En uygun rol
                      </p>
                      <h2 className="text-xl font-semibold">
                        {best.role.name}
                      </h2>
                    </div>
                    <Badge variant="outline">{Math.round(best.score)}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {best.role.shortDescription}
                  </p>
                  <ScoreBar value={best.score} />
                </div>

                <div className="grid gap-2 rounded-lg border p-4">
                  <h3 className="font-medium">Karar</h3>
                  <p className="text-sm font-medium">{best.decisionText}</p>
                  <p className="text-sm text-muted-foreground">
                    {best.verdictText}
                  </p>
                  {scoreGap !== null ? (
                    <p className="text-xs text-muted-foreground">
                      İkinci en iyi role fark: %{scoreGap}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 rounded-lg border p-4">
                  <h3 className="font-medium">Kritik eksikler</h3>
                  <MissingList
                    emptyText="Bu rol için kritik eksik görünmüyor."
                    items={bestMissing}
                  />
                </div>

                <div className="grid gap-3 rounded-lg border p-4">
                  <h3 className="font-medium">
                    Seçeceğim rol için şunlar eksik
                  </h3>
                  {!selectedRoleId ? (
                    <p className="text-sm text-muted-foreground">
                      Önce “Seçeceğim rol” alanından bir rol seç.
                    </p>
                  ) : selectedRoleAnalysis ? (
                    <MissingList
                      emptyText={`${selectedRoleAnalysis.role.name} için kritik eksik görünmüyor.`}
                      items={selectedRoleMissing}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Seçilen rol bu filtrede bulunamadı.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Bu filtrede uygun rol bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>2. Mevki seç + şunlar olsun</CardTitle>
          <CardDescription>
            Mevkiyi seç, oyuncuda özellikle olmasını istediğin stat ve
            becerileri işaretle.
          </CardDescription>
          <CardAction className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={fillWantedProfileFromRole}
              disabled={!wantedRole}
            >
              <Sparkles />
              Kritiklerini seç
            </Button>
            <Button variant="ghost" type="button" onClick={clearWantedProfile}>
              <X />
              Temizle
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <SelectField
              label="Mevki / rol"
              value={wantedProfile.roleId}
              onChange={(value) =>
                setWantedProfile((current) => ({
                  ...current,
                  roleId: value as RoleId | "",
                }))
              }
            >
              <NativeSelectOption value="">Mevki seç</NativeSelectOption>
              {roleOptions.map((role) => (
                <NativeSelectOption key={role.id} value={role.id}>
                  {role.name}
                </NativeSelectOption>
              ))}
            </SelectField>

            <NumberInput
              label="İstediğim stat alt sınırı"
              min={0}
              max={100}
              value={wantedProfile.statTarget}
              onChange={(value) =>
                setWantedProfile((current) => ({
                  ...current,
                  statTarget: value,
                }))
              }
            />

            <NumberInput
              label="İstediğim beceri seviyesi"
              min={0}
              max={5}
              step={1}
              value={wantedProfile.skillTarget}
              onChange={(value) =>
                setWantedProfile((current) => ({
                  ...current,
                  skillTarget: value,
                }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid content-start gap-3 rounded-lg border p-4">
              <h3 className="font-medium">Şu statlar olsun</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {STAT_KEYS.map((key) => (
                  <CheckField
                    key={`wanted-stat-${key}`}
                    label={STAT_LABELS[key]}
                    checked={Boolean(wantedProfile.stats[key])}
                    onCheckedChange={(checked) =>
                      toggleWantedStat(key, checked)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="grid content-start gap-3 rounded-lg border p-4">
              <h3 className="font-medium">Şu beceriler olsun</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {SKILL_KEYS.map((key) => (
                  <CheckField
                    key={`wanted-skill-${key}`}
                    label={SKILL_LABELS[key]}
                    checked={Boolean(wantedProfile.skills[key])}
                    onCheckedChange={(checked) =>
                      toggleWantedSkill(key, checked)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-3 rounded-lg border p-4 xl:col-span-2">
            <h3 className="font-medium">Bu isteğe göre eksikler</h3>
            <p className="text-sm text-muted-foreground">
              {wantedRole
                ? `Seçilen mevki: ${wantedRole.name}`
                : "Mevki seçilmedi."}
            </p>

            {wantedSelectedCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                En az bir stat veya beceri işaretle.
              </p>
            ) : wantedMissing.length === 0 ? (
              <p className="text-sm font-medium text-emerald-600">
                İşaretlediğin şartlara göre eksik görünmüyor.
              </p>
            ) : (
              <MissingList emptyText="" items={wantedMissing} />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Önem Haritası</CardTitle>
          <CardDescription>
            Mevkiye göre kritikler ve ikinci seviye önemliler.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="max-w-sm">
            <SelectField
              label="Önem haritası mevkii"
              value={priorityRoleId}
              onChange={(value) => setPriorityRoleId(value as RoleId | "")}
            >
              <NativeSelectOption value="">Mevki seç</NativeSelectOption>
              {ROLE_DEFINITIONS.map((role) => (
                <NativeSelectOption key={role.id} value={role.id}>
                  {role.name}
                </NativeSelectOption>
              ))}
            </SelectField>
          </div>

          {!priorityRole ? (
            <p className="text-sm text-muted-foreground">
              Renk haritasını görmek için mevki seç.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Stat Önceliği
                </p>
                <div className="grid gap-2">
                  {statPriorityItems.map((item) => (
                    <div
                      key={`stat-priority-${item.key}`}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-2.5 py-1.5 text-sm",
                        getPriorityTone(item.grade),
                      )}
                    >
                      <span>{item.label}</span>
                      <Badge variant="outline">{item.grade ?? "-"}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Beceri Önceliği
                </p>
                <div className="grid gap-2">
                  {skillPriorityItems.map((item) => (
                    <div
                      key={`skill-priority-${item.key}`}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-2.5 py-1.5 text-sm",
                        getPriorityTone(item.grade, true),
                      )}
                    >
                      <span>{item.label}</span>
                      <Badge variant="outline">{item.grade ?? "-"}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rol sıralaması</CardTitle>
          <CardDescription>
            Gösterilen hedef: {getLeague(input.leagueId).name} /{" "}
            {AMBITION_LABELS[input.ambition]} / Stat {activeTarget.statTarget} /
            Beceri {activeTarget.skillTarget}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Bölge</TableHead>
                <TableHead>Skor</TableHead>
                <TableHead>Aksiyon</TableHead>
                <TableHead>Karar</TableHead>
                <TableHead>Eksik</TableHead>
                <TableHead>Not</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleResults.map((result) => {
                const missingCount =
                  result.missingStats.length + result.missingSkills.length;

                return (
                  <TableRow key={result.role.id}>
                    <TableCell className="font-medium">
                      {result.role.name}
                    </TableCell>
                    <TableCell>{REGION_LABELS[result.role.region]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-sm">
                          {Math.round(result.score)}%
                        </span>
                        <ScoreBar value={result.score} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid gap-1">
                        <Badge variant={decisionBadgeVariant(result.decision)}>
                          {decisionLabel(result.decision)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          %{result.confidence} güven
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{result.verdictText}</TableCell>
                    <TableCell>
                      <Badge
                        variant={missingCount === 0 ? "secondary" : "outline"}
                      >
                        {missingCount === 0
                          ? "Yok"
                          : `${missingCount} kritik eksik`}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-80 whitespace-normal text-muted-foreground">
                      {result.role.notes[0]}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {best ? (
        <div className="sticky bottom-2 z-30 rounded-lg border bg-background/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                Canlı Sonuç: {best.role.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {best.decisionText}
              </p>
            </div>
            <Badge variant="outline">%{Math.round(best.score)}</Badge>
            <Badge variant={decisionBadgeVariant(best.decision)}>
              {decisionLabel(best.decision)}
            </Badge>
            <Badge variant="outline">%{best.confidence} güven</Badge>
            <Badge variant={bestMissingCount === 0 ? "secondary" : "outline"}>
              {bestMissingCount === 0
                ? "Eksik yok"
                : `${bestMissingCount} kritik eksik`}
            </Badge>
          </div>
        </div>
      ) : null}
    </main>
  );
}
