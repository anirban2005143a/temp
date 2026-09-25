from pathlib import Path
from typing import Literal
import tempfile

def is_pdf(file_name: Path | str) -> bool:
    return Path(file_name).suffix.lower() == ".pdf"


def is_docx(file_name: Path | str) -> bool:
    return Path(file_name).suffix.lower() == ".docx"


def save_temp_file(content , file_type: Literal[".pdf" , ".docx"]) -> str :
    temp_path = None

    with tempfile.NamedTemporaryFile(
        suffix=file_type,
        delete=False,
    ) as temp_file:
        temp_file.write(content)
        temp_path = Path(temp_file.name)


    return temp_path

    
