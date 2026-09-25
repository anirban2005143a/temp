import time

from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import BaseMessage
from langchain_core.output_parsers import PydanticOutputParser
from langchain_classic.output_parsers import OutputFixingParser
from langchain_core.prompts import ChatPromptTemplate

from lib.config import settings
from services.llm_module.parser import DeviationFormData
from services.llm_module.prompts import PARSE_TEXT_PROMPT


class LLM_Module:
    def __init__(self):
        print("[LLM] initializing model | model_name=%s" % settings.model_name)
        llm = HuggingFaceEndpoint(
            repo_id=settings.model_name,
            huggingfacehub_api_token=settings.huggingface_api_token,
            temperature=0.1,
        )
        self.model = ChatHuggingFace(llm=llm)
        print("[LLM] model initialized")

    def invoke(self, query: str | list[BaseMessage]) -> str:
        if not query:
            raise ValueError("Query should not be empty")

        print("[LLM] simple invoke | query_len=%s" % len(str(query)))
        return self.model.invoke(input=query).content

    def invoke_structured_model(self, file_content: str, query: str) -> DeviationFormData:
        if not query and not file_content:
            print("[LLM] validation failed | empty query and file content")
            raise ValueError("Either query or file_content is required")

        print("[LLM] starting structured extraction | file_len=%s | query_len=%s" % (len(file_content), len(query)))
        print("[LLM] sleep before model call | delay=%s sec" % settings.model_invoke_delay_sec)
        time.sleep(settings.model_invoke_delay_sec)

        parser = PydanticOutputParser(pydantic_object=DeviationFormData)

        fixing_parser = OutputFixingParser(
            parser=parser,
            llm=self.model,
            max_retries=2,
        )

        prompt = ChatPromptTemplate.from_template(PARSE_TEXT_PROMPT)
        model_chain = prompt | self.model | fixing_parser

        payload = {
            "file_content": file_content.strip() if file_content else "File is not given",
            "user_query": query.strip() if query else "Additional query is not provided",
            "structured_instructions": parser.get_format_instructions(),
        }

        print("[LLM] prompt prepared | sending to model")
        result = model_chain.invoke(payload)
        print("[LLM] model response received")

        return result