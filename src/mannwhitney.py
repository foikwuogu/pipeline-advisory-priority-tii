"""Pure-Python Mann-Whitney U test (normal approximation with tie correction),
used because the device's outbound network policy blocks pip installs of
scipy from this analysis environment. Formula follows the standard
large-sample normal approximation (Mann & Whitney, 1947)."""
from __future__ import annotations
import math


def mannwhitneyu(x, y):
    x = list(x)
    y = list(y)
    n1, n2 = len(x), len(y)
    combined = [(v, 0) for v in x] + [(v, 1) for v in y]
    combined.sort(key=lambda t: t[0])
    ranks = [0.0] * len(combined)
    i = 0
    while i < len(combined):
        j = i
        while j < len(combined) and combined[j][0] == combined[i][0]:
            j += 1
        avg_rank = (i + 1 + j) / 2.0
        for k in range(i, j):
            ranks[k] = avg_rank
        i = j
    r1 = sum(r for r, (v, g) in zip(ranks, combined) if g == 0)
    u1 = r1 - n1 * (n1 + 1) / 2.0
    u2 = n1 * n2 - u1
    u = min(u1, u2)
    mean_u = n1 * n2 / 2.0
    tie_groups = {}
    for v, _ in combined:
        tie_groups[v] = tie_groups.get(v, 0) + 1
    tie_sum = sum(t ** 3 - t for t in tie_groups.values())
    N = n1 + n2
    sigma_u = math.sqrt((n1 * n2 / 12.0) * ((N + 1) - tie_sum / (N * (N - 1))))
    if sigma_u == 0:
        return u1, 1.0
    z = (u - mean_u) / sigma_u
    # two-sided p-value via normal CDF complement
    p = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
    return u1, p
