import React, { useState,useEffect } from "react";
import axios from 'axios';

function App() {
  const [text, settext] = useState("");
  const [date, setdate] = useState("");
  const [data, setdata] = useState();
  const [priority, setpriority] = useState('');
  const [select, setselect] = useState();
  const [num, setnum]= useState();


  
 

  useEffect(() => {
    async function fetchData() {
      try {
        ///////////GET ALL TASKS /////////////
        const tasks = await axios.get('http://localhost:5000/api/task/');
        console.log('tasks', tasks.data);
        setdata(tasks.data);
        if(data !== undefined){
          console.log('array of data after set',data)
        }
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
     setdata(tasks.data); 
  }

   /////////////DELETE DATA//////////////
   const handledelete= async(e,id)=>{
    e.preventDefault();
    axios.delete("http://localhost:5000/api/"+id);
    console.log('task deleted');
    const tasks = await axios.get('http://localhost:5000/api/task/');
     console.log('tasks', tasks.data);
     setdata(tasks.data); 
  }
 
  return (
    <div className="App">
      <br/>
      <br/>
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
      {select === undefined ?
         <table>
         <thead>
           <tr>
             <th>
               text
             </th>
             <th>
               date
             </th>
             <th>
               Priority
             </th>
             <th>
               number
             </th>
             <th>
               Delete
             </th>
           </tr>
         </thead>
         <tbody>
             {data!== undefined ?data.map((task,i)=>(
               <tr key={i}>
               <td>{task.text}</td>
               <td>{task.date}</td>
               <td>{task.priority}</td>
               <td>{task._id}</td>
               <td><button onClick={e=>handledelete(e,task._id)}>Delete</button></td>
               </tr>
             )):null}
         </tbody>
       </table>
      :null}
   
      {select!== undefined ? data.filter(result=>result.priority === select).map((task,i)=>(
        <tr key={i}>
        <td>{task.text}</td>
        <td>{task.date}</td>
        <td>{task.priority}</td>
        <td>{task._id}</td>
        </tr>
      )
      ):null}

    </div>
  );
}

export default App;

// var array = tasks.data
// for(var i = 0; i <array.length;i++){
// setState(prev => {
//   return {
//     ...prev,
//     todo: {
//       title: "Todo",
//       items: [
//         array[i],
//         ...prev.todo.items
//       ]
//     }
//   }
// })}
