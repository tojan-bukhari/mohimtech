import React, { useState,useEffect } from "react";
import Button from 'react-bootstrap/Button';
import 'fa-icons';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _, { endsWith } from "lodash";
const $ = require( "jquery" )( window );




function App() {
  const [text, settext] = useState("");
  const [date, setdate] = useState("");
  const [priority, setpriority] = useState('');
  const [oldtext, setoldtext] = useState("");
  const [olddate, setolddate] = useState("");
  const [oldpriority, setoldpriority] = useState('');
  const [id, setid] = useState("");
  const [select, setselect] = useState();
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = async(e,id) =>{
    e.preventDefault();
    setShow(true)
    const res= await axios.get('http://localhost:5000/api/'+id);
    setoldtext(res.data.text);
    setoldpriority(res.data.priority);
    setolddate(res.data.date);
    setid(res.data._id);
  }; 
  
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
    console.log(text,date,priority)
    var task={text:text,date:date,priority:priority};
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
    settext("");
    setdate("");
    setpriority("");
    document.getElementById("form").reset();
     
  }
  console.log('text changing',text)
   /////////////DELETE DATA//////////////
   const handledelete= async(e,id)=>{
    e.preventDefault();
    await axios.delete("http://localhost:5000/api/"+id);
    document.location.reload ();
   }

 const handleedit= async (e,id)=>{
  e.preventDefault();
  var task = {text:oldtext,date:olddate,priority:oldpriority}
  console.log(id)
  const res = await axios.put("http://localhost:5000/api/task/"+id,task);
  const result = await axios.get('http://localhost:5000/api/'+id);
  console.log(result.data);
  var array = state.todo.items
  for (var i =0 ; i<array.length; i++){
    if(array[i]._id===result.data._id){
      array[i]=result.data
    }
  }
  console.log('the new array',array)
     setState(prev => {
        return {
          ...prev,
          todo: {
            title: "Todo",
            items: [
              array,
              ...prev.todo.items
            ]
          }
        }
      })   
 }


  return (
    <div className="App">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <input value={oldtext} onChange={e=>{setoldtext(e.target.value)}}></input>
         <input value={olddate} onChange={e=>{setolddate(e.target.value)}}></input>
         <input value={oldpriority} onChange={e=>{setoldpriority(e.target.value)}}></input>
         <Button variant="primary" onClick={e=>handleedit(e,id)}>
            Submit
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
            
        </Modal.Footer>
      </Modal>
     <div className="App">
      <div tabindex="-1"><div  >
        <select onChange={e=>setselect(e.target.value)} className="form-select" aria-label="Default select example">
        <option selected>Filter</option>
        <option value="strong">Strong</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
       </select>
      </div><br/>
      <form id="form">
      <dive>
      <lable>Add New Task</lable><br/>
      <lable>Text</lable><br/>
      <input onChange={e => settext(e.target.value)}></input><br/><br/>
      <lable>Date</lable><br/>
      <input type='date' onChange={e => setdate(e.target.value)}></input><br/><br/>
      <lable>Choose priority:</lable><br/>
      <select onChange={e=>setpriority(e.target.value)} class="form-select" aria-label="Default select example">
        <option selected>Priority</option>
        <option value="strong">Strong</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
       </select><br/>
      <button  onClick={submit}>ADD</button>
      </dive>
      </form>
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
                        if(el.text===undefined){return}else{
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
                                <div className="task">
                                <div className="text">{el.text}</div>
                                <div className="priority">{el.priority}</div>
                                <button className="delete" onClick={e=>handledelete(e,el._id)}>&#128686;</button>
                                <button className="edit"onClick={e=>handleShow(e,el._id)}>&#10002;</button>
                                </div>
                                </div>
                              )
                            }}
                          </Draggable>
                        )}
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
                                <div className="task">
                                <div className="text">{el.text}</div>
                                <div className="priority">{el.priority}</div>
                                <button className="delete" onClick={e=>handledelete(e,el._id)}>&#128686;</button>
                                <button className="edit"onClick={e=>handleShow(e,el._id)}>&#10002;</button>
                                </div>
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
