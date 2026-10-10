// Static content for the page. Edit text here; components render it at build time.

export const pinnedRepos = [
  { name: 'rakia-pipeline', lang: 'Shell', color: '#89e051', stars: 420,
    desc: 'CI/CD for home distilling. Build fails if ABV < 40%. Deploys straight to the jacuzzi.' },
  { name: 'jacuzzi-operator', lang: 'Go', color: '#00add8', stars: 138,
    desc: 'Kubernetes operator that keeps the water at 38°C. Reconciles every 5 min. Never scales down.' },
  { name: 'standup-skipper', lang: 'Python', color: '#3572a5', stars: 97,
    desc: 'Auto-replies "in jacuzzi, wont fix" to every standup invite. 100% test coverage (tested in jacuzzi).' },
  { name: 'terraform-provider-shopska', lang: 'HCL', color: '#844fba', stars: 64,
    desc: 'Declarative shopska salad. Manages tomatoes, cucumbers and sirene as code. Requires rakia >= 1.0.' },
];

// Demo league shown until real data exists in Supabase. Form: W/D/L, most recent last.
export const demoLeague = [
  { emoji: '⛷️', name: 'Bansko ski trip',                    days: 3, drinks: 64, perDay: '21.3', form: 'WWWDW', pts: 99 },
  { emoji: '🏖️', name: 'Sozopol summer offsite',             days: 2, drinks: 52, perDay: '26.0', form: 'WWDWW', pts: 87 },
  { emoji: '🎄', name: 'Christmas party',                    days: 1, drinks: 38, perDay: '38.0', form: 'WWWWL', pts: 76 },
  { emoji: '🔐', name: 'Escape room (escaped to bar)',       days: 1, drinks: 21, perDay: '21.0', form: 'DWLWW', pts: 58 },
  { emoji: '💻', name: 'Hackathon',                          days: 2, drinks: 19, perDay: '9.5',  form: 'LDWDW', pts: 41 },
  { emoji: '📹', name: 'Online quiz (remote, camera off)',   days: 1, drinks: 11, perDay: '11.0', form: 'LLDLW', pts: 12 },
];
export const demoGoldenBoot =
  '👟 GOLDEN BOOT: alex-beleganski — 205 drinks in 6 team buildings (34.2 per event) • 0 assists (never shares the rakia)';

export const incidents = [
  { kind: 'major', title: '🔴 Major outage: Alex detected at desk', date: '3 days ago • duration: 4 min',
    updates: [
      ['Investigating', 'Monitoring reported Alex at his desk during work hours.'],
      ['Resolved', 'False alarm, it was a cardboard cutout. Alex was in the jacuzzi all along.'],
    ] },
  { kind: 'minor', title: '🟡 Degraded: water temperature dropped to 36°C', date: '2 weeks ago • duration: 12 min',
    updates: [['Mitigated', 'Added more hot water and more rakia. Temperature back to nominal.']] },
  { kind: 'maint', title: '🔵 Scheduled maintenance: rakia bottle rotation', date: 'recurring • every 45 min',
    updates: [['Completed', 'Empty bottle replaced with full bottle. Zero downtime, zero sobriety.']] },
];
