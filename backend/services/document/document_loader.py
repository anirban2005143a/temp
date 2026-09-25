from abc import ABC, abstractmethod
from pathlib import Path

class DocumentLoader(ABC):

    @abstractmethod
    def load(self, file_path: Path) -> str:
        pass