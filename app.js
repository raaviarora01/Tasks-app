const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const dbURI = "mongodb+srv://raavi:Raavi123@nodetuts.aweo4.mongodb.net/task-list?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));
const taskSchema = {
    name: String
};
const Task = mongoose.model("Task", taskSchema);
const task1 = new Task({
    name: "Welcome to CodinGyaan",
});
const task2 = new Task({
    name: "Like ,Share and Subscribe",
});
const task3 = new Task({
    name: "Enjoy learning",
});
const d = [task1, task2, task3];
app.get("/", function (req, res) {
    Task.find({}, (err, f) => {
        if (f.length === 0) {
            Task.insertMany(d, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully saved tasks to DB");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", { newListItems: f });
        }
    })
        ;
})
app.post("/", function (req, res) {
    const taskName = req.body.n;
    const task = new Task({
        name: taskName
    });
    task.save();
    res.redirect("/");
});
app.post("/delete", function (req, res) {
    const check = req.body.checkbox;
    Task.findByIdAndRemove(check, function (err) {
        if (!err) {
            console.log("Successfully deleted");
            res.redirect("/");
        }
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server starting at port ${PORT}`));

