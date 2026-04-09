class TaskNotFoundException(Exception):
    def __init__(self, message: str | None = None):
        super().__init__(f"Task not found. {message}")


__all__ = [
    "TaskNotFoundException",
]
