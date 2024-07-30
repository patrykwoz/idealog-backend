from typing import Any, Annotated

from fastapi import APIRouter, HTTPException, FastAPI, Query
from sqlmodel import func, select
from fastapi.encoders import jsonable_encoder

from app.api.deps import Neo4jDriverDep, CurrentUser
from app.dao.nodes import NodeDAO
# from app.models_neo4j import NodeCreate, NodeUpdate

from neo4j.exceptions import ConstraintError, CypherTypeError

router = APIRouter()

@router.get("/")
def read_nodes(
    driver:Neo4jDriverDep,
    sort: Annotated[str | None, Query(max_length=50)] = "name",
    order: Annotated[str | None, Query] ="ASC",
    limit: int | None = 10,
    skip: int | None = 0) -> Any:
    dao = NodeDAO(driver)
    output = dao.all(sort, order, limit, skip)
    return jsonable_encoder(output)