"""Capture a small, reproducible health-endpoint latency sample."""

import argparse
import csv
import statistics
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from threading import Barrier
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_URL = "https://medicine-guide-ai.vercel.app/api/health"


def probe(sample, scenario, url, barrier=None):
    if barrier:
        barrier.wait(timeout=20)
    requested_at = datetime.now(timezone.utc).isoformat()
    started = time.perf_counter()
    status = 0
    error = ""
    try:
        request = Request(url, headers={"User-Agent": "medicine-guide-ai-evidence-probe/1.0"})
        with urlopen(request, timeout=20) as response:
            status = response.status
            response.read()
    except HTTPError as exc:
        status = exc.code
        error = f"HTTPError {exc.code}"
    except (TimeoutError, URLError, OSError) as exc:
        error = type(exc).__name__
    duration = time.perf_counter() - started
    return {
        "scenario": scenario,
        "sample": sample,
        "requested_at_utc": requested_at,
        "http_status": status,
        "duration_seconds": f"{duration:.6f}",
        "error": error,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--sequential-count", type=int, default=10)
    parser.add_argument("--concurrent-count", type=int, default=5)
    parser.add_argument("--delay-seconds", type=float, default=0.8)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    if args.sequential_count < 1 or args.concurrent_count < 1:
        parser.error("sample counts must be at least 1")

    rows = []
    for sample in range(1, args.sequential_count + 1):
        rows.append(probe(sample, "sequential", args.url))
        if sample < args.sequential_count:
            time.sleep(args.delay_seconds)

    barrier = Barrier(args.concurrent_count)
    with ThreadPoolExecutor(max_workers=args.concurrent_count) as pool:
        futures = [
            pool.submit(probe, sample, "concurrent", args.url, barrier)
            for sample in range(1, args.concurrent_count + 1)
        ]
        rows.extend(future.result() for future in futures)

    output = args.output or (
        ROOT
        / "docs"
        / "evidence"
        / f"production-health-measurement-{datetime.now(timezone.utc):%Y-%m-%d-%H%M%S}.csv"
    )
    output = output if output.is_absolute() else ROOT / output
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    for scenario in ("sequential", "concurrent"):
        group = [row for row in rows if row["scenario"] == scenario]
        times = [float(row["duration_seconds"]) for row in group]
        successes = sum(row["http_status"] == 200 for row in group)
        print(
            f"{scenario}: {successes}/{len(group)} HTTP 200, "
            f"mean={statistics.mean(times):.3f}s, "
            f"median={statistics.median(times):.3f}s, "
            f"min={min(times):.3f}s, max={max(times):.3f}s"
        )
    print(f"CSV: {output}")


if __name__ == "__main__":
    main()
