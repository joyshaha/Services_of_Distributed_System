from fastapi import FastAPI
from pydantic import BaseModel # type: ignore
import uvicorn # type: ignore

app = FastAPI(title="Addition API", version="1.0.0")


class AddRequest(BaseModel):
    a: float
    b: float


@app.get("/")
def root():
    return {"message": "FastAPI server is running Sertvice2!"}


@app.post("/add")
def add_numbers(data: AddRequest):
    return {
        "a": data.a,
        "b": data.b,
        "result": data.a + data.b
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
# to run the app, run the command: uvicorn main:app --reload