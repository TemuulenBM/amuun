"""Test helpers and factories.

Factory functions produce realistic default objects; tests override only the
fields they care about. Keeps tests immune to unrelated schema changes.
"""

from __future__ import annotations

from typing import Any


def make_user(**overrides: Any) -> dict[str, Any]:
    defaults: dict[str, Any] = {
        "id": "user_1",
        "email": "test@example.com",
        "name": "Test User",
    }
    return {**defaults, **overrides}
