#!/usr/bin/env python3
"""Copy a release phase to SMB using atomic per-file replacements."""

from __future__ import annotations

import argparse
import concurrent.futures
import fnmatch
import os
from pathlib import Path
import shutil
import threading


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("target", type=Path)
    parser.add_argument("--exclude", action="append", default=[])
    parser.add_argument("--include", action="append", default=[])
    parser.add_argument("--skip-existing-size", action="store_true")
    parser.add_argument("--workers", type=int, default=6)
    return parser.parse_args()


def matches(path: str, patterns: list[str]) -> bool:
    return any(fnmatch.fnmatch(path, pattern) for pattern in patterns)


def collect_files(
    source: Path, target: Path, includes: list[str], excludes: list[str]
) -> list[tuple[Path, Path]]:
    if source.is_file():
        return [(source, target)]

    files: list[tuple[Path, Path]] = []
    for item in source.rglob("*"):
        if not item.is_file():
            continue
        relative = item.relative_to(source).as_posix()
        if includes and not matches(relative, includes):
            continue
        if matches(relative, excludes):
            continue
        files.append((item, target / relative))
    return files


def copy_file(source: Path, target: Path, skip_existing_size: bool) -> str:
    target.parent.mkdir(parents=True, exist_ok=True)
    if (
        skip_existing_size
        and target.exists()
        and target.stat().st_size == source.stat().st_size
    ):
        return f"kept {target.name}"

    temporary = target.with_name(
        f".{target.name}.uploading-{os.getpid()}-{threading.get_ident()}"
    )
    try:
        shutil.copyfile(source, temporary)
        source_stat = source.stat()
        os.utime(temporary, (source_stat.st_atime, source_stat.st_mtime))
        os.replace(temporary, target)
    finally:
        temporary.unlink(missing_ok=True)

    return f"copied {target.name}"


def main() -> None:
    args = parse_args()
    if not args.source.exists():
        raise FileNotFoundError(f"Source does not exist: {args.source}")

    files = collect_files(
        args.source, args.target, args.include, args.exclude
    )
    if not files:
        raise RuntimeError("No files matched this deployment phase")

    with concurrent.futures.ThreadPoolExecutor(
        max_workers=max(1, args.workers)
    ) as executor:
        results = list(
            executor.map(
                lambda pair: copy_file(
                    pair[0], pair[1], args.skip_existing_size
                ),
                files,
            )
        )

    copied = sum(result.startswith("copied") for result in results)
    kept = len(results) - copied
    print(f"SMB phase complete: {copied} copied, {kept} retained")


if __name__ == "__main__":
    main()
