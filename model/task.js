const con = require("./database");

const Task = {
    getAllTasks(){
        return con.execute("select * from task where status != ?",[3]);
    },

    getTaskByID(taskId){
        return con.execute("select * from task where id =?",[taskId]);
    },

    getAllCompletedTasks(){
       return con.execute("select * from task where status = ?",[3]);
    },

    addTask(title,description){
        return con.execute("insert into task (title,description,status) values(?,?,?)",[title,description,1]);
    },

    deleteTask(id){
        return con.execute("delete from task where id = ?",[id]);
    },

    updateTask(id,title,description){
        return con.execute("update task set title=?, description=? where id=?",[title,description,id]);
    },

    startTask(id){
        return con.execute("update task set status = ? where id = ?",[2,id]);
    },

    endTask(id){
        return con.execute("update task set status = ? where id = ?",[3,id]);
    },

    updateStatusTimer(taskId,status,timer,endTime){
        return con.execute("update task set status = ?, timer = ?, end_time = ? where id = ?",[status,timer,endTime,taskId]);
    },

    getStatusTimer(taskId){
        return con.execute("select * from task where id = ?",[taskId]);
    },

    updateStartTime(taskId,startTime){
        return con.execute("update task set start_time = ? where id = ?",[startTime,taskId]);
    }

}

module.exports = Task;
