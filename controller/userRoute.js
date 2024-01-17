const express = require("express");
const router = express.Router();
const {format} = require('date-fns');
const {query,body, validationResult} = require('express-validator');

const taskModel = require("../model/task");
const { end } = require("../model/database");

router.get('/', (req, res) => {
    taskModel.getAllTasks().then((rows) => {
        rows[0].forEach(element => {
            console.log(element)
        });
        res.render("home", { tasks: rows[0] });
    });
});

router.get('/completedtask', (req, res) => {
    console.log("Completed Task Page Called");
    taskModel.getAllCompletedTasks().then(rows => {

        rows.forEach(row=>{
            const {start_time} = JSON.stringify(row);
            console.log("Time: " + start_time);
        });

        res.render("completedTask", {tasks:rows[0]});
    });
});

router.post('/getTask?',(req,res)=>{
    const taskId = req.query.id;

    taskModel.getTaskByID(taskId).then(data=>{
        console.log("Data: " + JSON.stringify(data[0][0]));
        res.json(data[0][0]);
    });
})

router.post('/addTask', [
    body('title',"Title must be in 3 to 45 length").trim().notEmpty().isLength({min:3,max:45}),
    body('description',"Description must be in 5 to 150 length").trim().notEmpty().isLength({min:5,max:150})
    ] ,
    (req, res) => {
    const { title, description } = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log("Errors are generated");
        return res.status(400).json({errors: errors.array()});
    }

    taskModel.addTask(title, description).then(result => {
        console.log("Added task Successfully");
        res.redirect('/');
    });

});

router.post('/deleteTask',[
    body('id').trim().notEmpty()
] ,(req, res) => {
    console.log("Body: " + JSON.stringify(req.body));
    const id = req.body.id;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    taskModel.deleteTask(id).then(result => {
        console.log("Task Deleted Successfully");
        res.json({
            success: true
        });
    });
});

router.post('/updateTask',[
    body('id','ID cant be Empty').trim().notEmpty(),
    body('title','Title must be in 3 to 45 length').trim().notEmpty().isLength({min: 3,max: 45}),
    body('description','Description must be in 5 to 150 length').trim().notEmpty().isLength({min:5,max:150})
], (req, res) => {
    const { id, title, description } = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    taskModel.updateTask(id, title, description).then(result => {
        console.log("Updation Successful");
        res.redirect('/');
    })
})

router.post('/updateStatus', (req, res) => {
    const { id, status, timer } = req.body;

});

router.get('/getTimerStatus?', (req, res) => {
    const taskId = req.query.id;
    

    console.log("GetTimer for: " + taskId);

    taskModel.getStatusTimer(taskId).then((rows) => {
        try {
            console.log("Response: " + res);
            const row = rows[0];
            console.log("Row: " + JSON.stringify(row));

            const { status, timer } = row[0];
            console.log("Status of getTimer: " + status);
            console.log("Start_Time of getTimer: " + timer);
            res.json({ success: true, timer: timer, status: status});
        } catch (error) {
            console.log("Error generated");
            res.status(500).json({ success: false, error: error.message });
        }

    });
});


router.post('/updateTimer?', (req, res) => {
    console.log("Body: " + JSON.stringify(req.body));
    const taskId = req.query.id;
    try {
        let { status, timer, endTime } = req.body;
        
        console.log("UpdatedTimer for: " + taskId + 'Time: ' + timer + 'EndTime: '+ endTime);

        if(timer!== null){
            timer = format(timer,'yyyy-MM-dd HH:mm:ss');
        }else if(endTime !== null){
            endTime = format(endTime,'yyyy-MM-dd HH:mm:ss');
        }

        
            
            taskModel.updateStatusTimer(taskId, status, timer, endTime).then(result => {
                res.json({ success: true });
            });
        
        
    } catch (error) {
        console.log("Error generated: " + error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/updateStartTime?',(req, res) => {

    let {id,startTime} = req.body;

    startTime = format(startTime,'yyyy-MM-dd HH:mm:ss')

    taskModel.updateStartTime(id,startTime).then(result=>{
        console.log("Start Time updated");
        res.json({success:true});
    });
})



module.exports = router;