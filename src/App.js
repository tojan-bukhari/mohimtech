import React, { useState,useEffect } from "react";
import axios from 'axios';
import './App.css';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _, { endsWith } from "lodash";
import {v4} from "uuid";

function App() {
  const [text, settext] = useState("");
  const [date, setdate] = useState("");
  const [priority, setpriority] = useState('');
  const [select, setselect] = useState();
  const [num, setnum]= useState();

  const [name, setname] = useState("")
  const [state, setState] = useState({
    "todo": {
      title: "Todo",
      items: []
    },
    "in-progress": {
      title: "In Progress",
      items: []
    },
    "done": {
      title: "Completed",
      items: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = {...state[source.droppableId].items[source.index]}

    setState(prev => {
      prev = {...prev}
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)


      // Adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  useEffect(() => {
    async function fetchData() {
      try {
        ///////////GET ALL TASKS /////////////
        const tasks = await axios.get('http://localhost:5000/api/task/');
        console.log('tasks', tasks.data);
        var array = tasks.data
        for(var i = 0; i <array.length;i++){
        setState(prev => {
          return {
            ...prev,
            todo: {
              title: "Todo",
              items: [
                array[i],
                ...prev.todo.items
              ]
            }
          }
        })}
        
      } catch (error) {
        console.log(error, "oh nooooo");
      }
    } 
    fetchData();
  },[]);

  const submit = async() => {
    console.log(text,date,priority,num)
    var task={text:text,date:date,priority:priority,task_num:num};
    var res = await axios.post("http://localhost:5000/api/task",task)
     console.log('this is result',res.data)
     const tasks = await axios.get('http://localhost:5000/api/task/');
     console.log('tasks', tasks.data);
        setState(prev => {
          return {
            ...prev,
            todo: {
              title: "Todo",
              items: [
                tasks.data[tasks.data.length-1],
                ...prev.todo.items
              ]
            }
          }
        })
     
  }

   /////////////DELETE DATA//////////////
   const handledelete= async(e,id)=>{
    e.preventDefault();
    axios.delete("http://localhost:5000/api/"+id);
    console.log('task deleted');
    const tasks = await axios.get('http://localhost:5000/api/task/');
     console.log('tasks', tasks.data);
     var array = tasks.data
        for(var i = 0; i <array.length;i++){
        setState(prev => {
          return {
            ...prev,
            todo: {
              title: "Todo",
              items: [
                array[i],
                ...prev.todo.items
                
              ]
            }
          }
        })} 
 }
 //////////////////////////EDIT/////////////////////
 const handleedit = () =>{
   console.log('oh')
 }
  return (
    <div className="App">
     <div className="App">
      <div>
      <div>
      <select onChange={e=>setselect(e.target.value)} class="form-select" aria-label="Default select example">
        <option selected>Filter</option>
        <option value="strong">Strong</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
       </select>
      </div><br/>
      <dive>
      <lable>Text</lable>
      <input onChange={e => settext(e.target.value)}></input>
      <lable>Date</lable>
      <input type='date' onChange={e => setdate(e.target.value)}></input>
      <select onChange={e=>setpriority(e.target.value)} class="form-select" aria-label="Default select example">
        <option selected>Priority</option>
        <option value="strong">Strong</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
       </select>
      <button  onClick={submit}>ADD</button>
      </dive>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"}>
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return(
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}
                    >
                      {select === undefined ? data.items.map((el, index) => {
                        return(
                          <Draggable key={el._id} index={index} draggableId={el._id}>
                            {(provided, snapshot) => {
                              console.log(snapshot)
                              return(
                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {el.name}{el.text}
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      }):null}

                      {select!== undefined ? data.items.filter(result=>result.priority === select).map((el, index) => {
                        return(
                          <Draggable key={el._id} index={index} draggableId={el._id}>
                            {(provided, snapshot) => {
                              console.log(snapshot)
                              return(
                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                {el.text}
                                {el.date}
                                {el.priority}
                                 
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })

                      :null}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div>
    </div>
  );
}

export default App;
