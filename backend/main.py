from fastapi import FastAPI,Depends,Body,HTTPException
from sqlalchemy.orm import Session
from database import engine,Base,get_db
from models import Tasks
from schemas import TaskUpdate
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TasK_Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for testing)
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {"message":"Task Manager"}

@app.get('/task')
def all_tasks(db:Session= Depends(get_db)):
    tasks=db.query(Tasks).all()
    return tasks

@app.post("/tasks")
def add_task(title: str = Body(...), db: Session = Depends(get_db)):
    if not title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    new_task = Tasks(title=title)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/tasks/{id}/complete")
def update_task(id: int, db: Session = Depends(get_db)):
    task = db.query(Tasks).filter(Tasks.id == id).first()
    if not task:
        return {"error": "Task not found"}
    if task.Completed is True:
        task.Completed = False
    else:
        task.Completed=True
    db.commit()
    return {"message": "Task updated"}

@app.put("/tasks/{task_id}/title")
def update_task_title(task_id: int, updated: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Tasks).filter(Tasks.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if not updated.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")

    task.title = updated.title
    db.commit()
    db.refresh(task)

    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id:int,db:Session=Depends(get_db)):
    task=db.query(Tasks).filter(Tasks.id==task_id).first()
    if not task:
        raise HTTPException(status_code=404,detail="task not found")
    db.delete(task)
    db.commit()
    return {"message": "task deleted successfully"}

