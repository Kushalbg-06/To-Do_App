from sqlalchemy import Column,Integer,String,Boolean
from database import Base

class Tasks(Base):
    __tablename__="Tasks"
    id=Column(Integer,primary_key=True,unique=True,index=True)
    title=Column(String,nullable=False)
    Completed=Column(Boolean,default=False)