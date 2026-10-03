// Story 003, Task 1.2 — automated updates respect the seven-day rule and pin Actions (R1.3, R1.4).
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

type Raw = Record<string, any>;

const ROOT = process.cwd();
const RENOVATE = path.join(ROOT, 'renovate.json');
const renovate = (): Raw => JSON.parse(readFileSync(RENOVATE, 'utf8')) as Raw;
const pkg = (): Raw => JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as Raw;

const UNIT_DAYS: Record<string, number> = {
  minute: 1 / 1440, minutes: 1 / 1440, min: 1 / 1440, mins: 1 / 1440,
  hour: 1 / 24, hours: 1 / 24, h: 1 / 24,
  day: 1, days: 1, d: 1,
  week: 7, weeks: 7, w: 7,
};

/** A Renovate duration ("7 days", "1 week") in days; null when it has no explicit unit. */
function durationDays(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const m = value.trim().match(/^(\d+)\s*([a-z]+)$/i);
  if (!m) return null;
  const unit = UNIT_DAYS[m[2].toLowerCase()];
  return unit === undefined ? null : Number(m[1]) * unit;
}

const holdsSevenDays = (value: unknown): boolean => (durationDays(value) ?? 0) >= 7;

/** Every place a Renovate config sets a release age must still hold seven days. */
function weakenedAges(config: Raw): string[] {
  const out: string[] = [];
  (config.packageRules ?? []).forEach((rule: Raw, i: number) => {
    if ('minimumReleaseAge' in rule && !holdsSevenDays(rule.minimumReleaseAge)) {
      out.push(`packageRules[${i}].minimumReleaseAge = ${JSON.stringify(rule.minimumReleaseAge)}`);
    }
  });
  return out;
}

describe('the guards themselves reject the wrong shapes', () => {
  // Hostile: a bare number, or a shorter unit, reads as "seven" but is not seven days.
  it('a duration with no unit, or in minutes or hours, is refused', () => {
    expect(holdsSevenDays('7')).toBe(false);
    expect(holdsSevenDays(7)).toBe(false);
    expect(holdsSevenDays('7 minutes')).toBe(false);
    expect(holdsSevenDays('7 hours')).toBe(false);
    expect(holdsSevenDays('6 days')).toBe(false);
    expect(holdsSevenDays(null)).toBe(false);
  });

  // Hostile (converse): the same seven days in another spelling must still be accepted.
  it('seven days in any spelling is accepted', () => {
    expect(holdsSevenDays('7 days')).toBe(true);
    expect(holdsSevenDays('1 week')).toBe(true);
    expect(holdsSevenDays('168 hours')).toBe(true);
  });

  // Hostile: a package rule that nulls or shortens the age punches a hole in the gate.
  it('a package rule that lowers or clears the age is reported', () => {
    const config = {
      minimumReleaseAge: '7 days',
      packageRules: [
        { matchDepTypes: ['devDependencies'], rangeStrategy: 'pin' },
        { matchUpdateTypes: ['patch'], minimumReleaseAge: null },
        { matchManagers: ['npm'], minimumReleaseAge: '3 days' },
      ],
    };
    expect(weakenedAges(config)).toHaveLength(2);
  });
});

describe('renovate.json withholds young releases (R1.3)', () => {
  it('exists and is valid JSON', () => {
    expect(existsSync(RENOVATE), 'renovate.json at the project root').toBe(true);
    expect(() => renovate()).not.toThrow();
  });

  it('extends config:recommended', () => {
    expect(renovate().extends).toEqual(expect.arrayContaining(['config:recommended']));
  });

  it('sets minimumReleaseAge to at least seven days', () => {
    const age = renovate().minimumReleaseAge;
    expect(holdsSevenDays(age), `minimumReleaseAge = ${JSON.stringify(age)}`).toBe(true);
  });

  it('opens no branch or PR before the age check passes (internalChecksFilter strict)', () => {
    expect(renovate().internalChecksFilter).toBe('strict');
  });

  it('no package rule lowers or clears the age', () => {
    expect(weakenedAges(renovate())).toEqual([]);
  });

  // Hostile: this preset adds an npm package rule of 3 days that overrides the top-level age.
  it('does not extend a preset that shortens the age for npm', () => {
    expect(renovate().extends ?? []).not.toContain('security:minimumReleaseAgeNpm');
  });

  // Hostile: Renovate's vulnerabilityAlerts defaults clear minimumReleaseAge, so security
  // PRs would skip the gate unless the block sets the age itself.
  it('keeps vulnerability alerts on, under the same seven-day age', () => {
    const alerts = renovate().vulnerabilityAlerts ?? {};
    expect(alerts.enabled).toBe(true);
    expect(holdsSevenDays(alerts.minimumReleaseAge), `vulnerabilityAlerts.minimumReleaseAge = ${JSON.stringify(alerts.minimumReleaseAge)}`).toBe(true);
  });

  it('pins devDependencies', () => {
    const rules: Raw[] = renovate().packageRules ?? [];
    const pin = rules.find((r) => (r.matchDepTypes ?? []).includes('devDependencies') && r.rangeStrategy === 'pin');
    expect(pin, 'a packageRule matching devDependencies with rangeStrategy "pin"').toBeDefined();
  });

  it('runs lock-file maintenance on a schedule', () => {
    const lfm = renovate().lockFileMaintenance ?? {};
    expect(lfm.enabled).toBe(true);
    expect(Array.isArray(lfm.schedule) && lfm.schedule.length > 0, 'lockFileMaintenance.schedule').toBe(true);
  });
});

describe('Action updates are pinned to a commit SHA (R1.4)', () => {
  it('extends helpers:pinGitHubActionDigests', () => {
    const ext: string[] = renovate().extends ?? [];
    expect(ext.some((p) => /^helpers:pinGitHubActionDigests(ToSemver)?$/.test(p))).toBe(true);
  });

  // Hostile: the preset is listed, but a later setting turns digest pinning back off.
  it('nothing turns digest pinning off', () => {
    const config = renovate();
    expect(config.pinDigests).not.toBe(false);
    expect((config.packageRules ?? []).filter((r: Raw) => r.pinDigests === false)).toEqual([]);
    expect(config.ignorePresets ?? []).not.toContain('helpers:pinGitHubActionDigests');
  });
});

describe('no second updater bypasses the gate (R1.3)', () => {
  // Hostile: Renovate reads renovate.json first, so a second config is silent drift.
  it('renovate.json is the only Renovate configuration', () => {
    expect('renovate' in pkg()).toBe(false);
    for (const f of ['renovate.json5', '.github/renovate.json', '.github/renovate.json5', '.renovaterc', '.renovaterc.json']) {
      expect(existsSync(path.join(ROOT, f)), f).toBe(false);
    }
  });

  // Hostile: Dependabot version updates without a cooldown would propose day-old releases.
  it('any Dependabot version-update entry waits at least seven days', () => {
    const file = ['.github/dependabot.yml', '.github/dependabot.yaml'].map((f) => path.join(ROOT, f)).find(existsSync);
    if (!file) return;
    const updates: Raw[] = ((yaml.load(readFileSync(file, 'utf8')) as Raw)?.updates ?? []) as Raw[];
    for (const u of updates) {
      expect(u.cooldown?.['default-days'] ?? 0, `${u['package-ecosystem']} cooldown`).toBeGreaterThanOrEqual(7);
    }
  });
});
