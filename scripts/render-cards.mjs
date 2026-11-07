// Renders the stats and top-langs cards using a local checkout of github-readme-stats.
// Usage: node render-cards.mjs <grs-dir> <username> <out-dir>
import { writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";

const grs = resolve(process.argv[2]);
const username = process.argv[3];
const out = resolve(process.argv[4]);
const load = (p) => import(pathToFileURL(join(grs, p)).href);

const { fetchStats } = await load("src/fetchers/stats.js");
const { renderStatsCard } = await load("src/cards/stats.js");
const { fetchTopLanguages } = await load("src/fetchers/top-languages.js");
const { renderTopLanguages } = await load("src/cards/top-languages.js");

const colors = {
  bg_color: "0B1730", title_color: "7DD3FC", icon_color: "3B82F6",
  text_color: "EEF4FF", hide_border: true, border_radius: 20,
};

mkdirSync(out, { recursive: true });

const stats = await fetchStats(username);
writeFileSync(join(out, "stats.svg"),
  renderStatsCard(stats, { ...colors, show_icons: true, rank_icon: "github" }));

const langs = await fetchTopLanguages(username);
writeFileSync(join(out, "top-langs.svg"),
  renderTopLanguages(langs, { ...colors, layout: "compact", langs_count: 6, hide: ["c", "c++"] }));
