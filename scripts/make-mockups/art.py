"""
Illustrative chart art for projects that have no screenshots yet.

IMPORTANT: none of these charts are project results. The real datasets aren't available
offline, so every figure is generated from a fixed random seed or textbook maths, and is
stamped "ILLUSTRATIVE" in the corner. Swap them for real notebook or dashboard exports by
dropping PNGs into assets/raw/ and re-running `npm run mockups` (see README).

Output: scripts/make-mockups/.cache/art/*.png
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

OUT = Path(__file__).parent / ".cache" / "art"
OUT.mkdir(parents=True, exist_ok=True)

PAPER, INK, ACCENT = "#F4F3EF", "#0E0E0E", "#FF5B1F"
MUTED, LINE = "#8A877F", "#D9D6CE"

plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "font.size": 13,
        "axes.edgecolor": LINE,
        "axes.labelcolor": MUTED,
        "xtick.color": MUTED,
        "ytick.color": MUTED,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.grid": True,
        "grid.color": LINE,
        "grid.linewidth": 0.8,
        "axes.axisbelow": True,
        "figure.facecolor": "white",
        "axes.facecolor": "white",
        "axes.titleweight": "bold",
        "axes.titlesize": 15,
        "axes.titlecolor": INK,
        "axes.titlelocation": "left",
        "axes.titlepad": 14,
    }
)
rng = np.random.default_rng(7)


def stamp(fig):
    fig.text(0.99, 0.015, "ILLUSTRATIVE · not project output", ha="right", va="bottom",
             fontsize=9, color=MUTED, family="DejaVu Sans Mono")


def save(fig, name):
    stamp(fig)
    fig.savefig(OUT / f"{name}.png", dpi=150, bbox_inches="tight", pad_inches=0.25)
    plt.close(fig)


# 1. Generic binary-classification visuals (IndiGo)
fig, axes = plt.subplots(1, 2, figsize=(10, 4.2), gridspec_kw={"width_ratios": [1, 1.25]})
ax = axes[0]
ax.bar(["Would recommend", "Would not"], [0.62, 0.38], color=[ACCENT, INK], width=0.55)
ax.set_title("Target balance")
ax.set_ylim(0, 1)
ax.yaxis.set_major_formatter(matplotlib.ticker.PercentFormatter(1.0))
ax = axes[1]
fpr = np.linspace(0, 1, 100)
for k, c, lab in [(6, ACCENT, "Classifier A"), (3, INK, "Classifier B")]:
    ax.plot(fpr, 1 - (1 - fpr) ** k, color=c, lw=2.4, label=lab)
ax.plot([0, 1], [0, 1], ls="--", color=MUTED, lw=1)
ax.set_title("ROC curve, shape only")
ax.set_xlabel("False positive rate")
ax.set_ylabel("True positive rate")
ax.legend(frameon=False, loc="lower right")
fig.tight_layout()
save(fig, "indigo")

# 2. Catalogue EDA visuals (Prime Video)
fig, axes = plt.subplots(1, 2, figsize=(10, 4.2), gridspec_kw={"width_ratios": [1.5, 1]})
ax = axes[0]
decades = ["1950s", "60s", "70s", "80s", "90s", "2000s", "2010s", "2020s"]
vals = np.array([3, 4, 6, 9, 14, 24, 58, 41]) * (1 + rng.normal(0, 0.05, 8))
ax.bar(decades, vals, color=[INK] * 6 + [ACCENT, INK], width=0.65)
ax.set_title("Titles by release decade")
ax.set_yticklabels([])
ax = axes[1]
ax.pie([0.78, 0.22], colors=[INK, ACCENT], startangle=90, counterclock=False,
       wedgeprops={"width": 0.36, "edgecolor": "white", "linewidth": 3})
ax.set_title("Movies vs shows")
ax.text(0, 0, "type\nsplit", ha="center", va="center", color=MUTED, fontsize=11)
fig.tight_layout()
save(fig, "prime")

# 3. Dashboard-style tiles (MDAE)
fig = plt.figure(figsize=(10, 4.6))
gs = fig.add_gridspec(1, 3, width_ratios=[1.6, 1, 1])
ax = fig.add_subplot(gs[0])
x = np.arange(72)
y = np.cumsum(rng.normal(0.4, 2.0, 72)) + 40
ax.plot(x, y, color=INK, lw=1.8)
out = rng.choice(72, 5, replace=False)
ax.scatter(out, y[out], s=70, color=ACCENT, zorder=3, label="flagged outlier")
ax.set_title("Monthly metric, 6 years")
ax.set_xticks([0, 12, 24, 36, 48, 60, 71], ["Y1", "Y2", "Y3", "Y4", "Y5", "Y6", ""])
ax.legend(frameon=False, loc="upper left")
ax = fig.add_subplot(gs[1])
imp = np.sort(rng.dirichlet(np.ones(6)))
ax.barh([f"feature {i}" for i in range(6, 0, -1)], imp, color=[INK] * 5 + [ACCENT])
ax.set_title("Feature importance")
ax.set_xticklabels([])
ax = fig.add_subplot(gs[2])
ax.bar([f"S{i}" for i in range(1, 9)], rng.integers(20, 100, 8), color=INK, width=0.6)
ax.set_title("Rows by source")
ax.set_yticklabels([])
fig.tight_layout()
save(fig, "mdae")

# 4. Hydrogen-like orbital density (textbook maths, rendered as art)
n = 600
xs = np.linspace(-20, 20, n)
X, Z = np.meshgrid(xs, xs)
R = np.sqrt(X**2 + Z**2) + 1e-9
cos = Z / R
psi = (R / 3) ** 2 * np.exp(-R / 3) * (3 * cos**2 - 1)  # 3d_z2-like
dens = psi**2
from matplotlib.colors import LinearSegmentedColormap

cmap = LinearSegmentedColormap.from_list("site", [INK, "#3a1a10", ACCENT, "#FFD9C7", PAPER])
fig, ax = plt.subplots(figsize=(8, 8))
ax.imshow(dens ** 0.45, cmap=cmap, extent=[-20, 20, -20, 20])
ax.axis("off")
fig.patch.set_facecolor(INK)
fig.text(0.04, 0.95, "|ψ|² · hydrogen-like 3d orbital", color=PAPER, family="DejaVu Sans Mono", fontsize=12)
fig.text(0.99, 0.015, "ILLUSTRATIVE · not simulator output", ha="right", color="#9a958c", fontsize=9, family="DejaVu Sans Mono")
fig.savefig(OUT / "orbital.png", dpi=150, bbox_inches="tight", pad_inches=0, facecolor=INK)
plt.close(fig)

# 5. Energy levels E_n = -13.6/n^2 eV (textbook)
fig, ax = plt.subplots(figsize=(9, 4.6))
for k in range(1, 7):
    e = -13.6 / k**2
    ax.hlines(e, 0.1, 0.9, color=ACCENT if k == 1 else INK, lw=2.6)
    ax.text(0.92, e, f"n = {k}", va="center", color=MUTED, fontsize=11)
for a, b in [(3, 2), (4, 2), (2, 1)]:
    ax.annotate("", xy=(0.25 + 0.12 * a, -13.6 / b**2), xytext=(0.25 + 0.12 * a, -13.6 / a**2),
                arrowprops=dict(arrowstyle="->", color=ACCENT, lw=1.6))
ax.set_xlim(0, 1.05)
ax.set_xticks([])
ax.set_ylabel("Energy (eV)")
ax.set_title("Energy levels, Eₙ = −13.6 / n² eV")
ax.grid(False)
save(fig, "levels")

print("art ->", OUT)
