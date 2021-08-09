const router = require("express").Router();
const Tasks = require('../model/task-model');


router.post('/task', (req,res)=>{
    try{
    const newTask = new Tasks(req.body)
        newTask.save();
        res.json(newTask)
    }
    catch(err){res.json("sth wrong");} 
})

router.get('/task' , function (req , res) {
     Tasks.find().then((taskFound) => {
         if(!taskFound) return res.status(404).json("Can't find the task");
         else return res.status(200).json(taskFound);
     }).catch((err) => {
        res.status(500).json("not working");
    });
  });

router.get("/:id", function(req, res) {
    console.log(req.params.id)
    Tasks.findById(req.params.id)
    .then(task => res.json(task))
    .catch(err => res.status(400).json("Error: " + err));
  });

router.delete('/:id', function(req, res) { 
    console.log('delete function',req.params.id)
    Tasks.findByIdAndDelete(req.params.id)    
    .then(() => res.json('task deleted.'))    
    .catch(err => res.status(400).json('Error: ' + err));
});

router.put("/task/:id",(req,res)=>{
    console.log("the id",req.params.id)
    const promise = Tasks.findByIdAndUpdate(req.params.id,req.body);
    console.log(req.body)
    promise.then((data)=>{
     res.json(data);
    }).catch((err)=>{
     res.json(err);
    })
   })


module.exports = router;