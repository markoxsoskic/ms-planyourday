const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const https = require("https");
const dbConnection = require("../db/database");
const User = require("../models/user");
const [Task, Prio, Work] = require("../models/task");

dbConnection();

router.get("/pages/planyourday/:id", (req, res) => {

    User.findOne({ _id: req.params.id })
        .then((found) => {
            if (found) {

                let currentUser = found;

                var date = new Date();
                var options = {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                };

                var today = date.toLocaleDateString("en-US", options);
                let year = date.getFullYear();

                let query = currentUser.city ?? "";
                const apiKey = process.env.WEATHER;
                const units = "metric"
                const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

                https.get(url, function (response) {
                    response.on("data", function (data) {
                        const weatherData = JSON.parse(data);
                        if (weatherData.main == undefined) {
                            temp = "";
                            tempIcon = "";
                            imageURL = "";
                        } else {
                            temp = Math.floor(weatherData.main.temp);
                            tempIcon = weatherData.weather[0].icon;
                            imageURL = "https://openweathermap.org/img/wn/" + tempIcon + "@2x.png";
                        }

                        Task.find({ author: currentUser._id })
                            .then((found) => {
                                const foundTasks = found;
                                Prio.find({ author: currentUser._id })
                                    .then((found) => {
                                        const foundPrio = found;
                                        Work.find({ author: currentUser._id })
                                            .then((found) => {
                                                const foundWork = found;
                                                res.render("planner-page", {
                                                    author: currentUser._id,
                                                    city: currentUser.city,
                                                    imageURL: imageURL,
                                                    name: currentUser.fName,
                                                    newPrio: foundPrio,
                                                    newTask: foundTasks,
                                                    newWork: foundWork,
                                                    temp: temp,
                                                    today: today,
                                                    year: year,
                                                });
                                            })
                                    })
                            });
                    })
                })
            }
        })
})

// add new tasks

router.post("/pages/planyourday/:id/daily", (req, res) => {

    const newTask = new Task({ content: req.body.newTask, author: req.body.author });
    newTask.save()
        .then(() => {
            console.log("Daily task successfully added to the database.");
        }).catch((err) => {
            console.log(err);
        })
    res.redirect(`/pages/planyourday/${req.body.author}`);
})

router.post("/pages/planyourday/:id/prio", (req, res) => {

    const newPrio = new Prio({ content: req.body.newPrio, author: req.body.author });
    newPrio.save()
        .then(() => {
            console.log("Priority successfully added to the database.");
        })
    res.redirect(`/pages/planyourday/${req.body.author}`);
})

router.post("/pages/planyourday/:id/work", (req, res) => {

    const newWork = new Work({ content: req.body.newWork, author: req.body.author });
    newWork.save()
        .then(() => {
            console.log("Work task successfully added to the database.");
        })
    res.redirect(`/pages/planyourday/${req.body.author}`);
})

// delete tasks

router.post("/pages/planyourday/:id/delete/daily", (req, res) => {

    const checkedTaskId = req.body.checkbox;
    let taskAuthor;

    Task.findOne({ _id: checkedTaskId })
        .then((found) => {
            taskAuthor = found.author;
            Task.deleteOne({ _id: checkedTaskId })
                .then(() => {
                    console.log("Daily task successfully removed from the database.");
                    res.redirect(`/pages/planyourday/${taskAuthor}`);
                }).catch((err) => {
                    console.log(err);
                });
        });
});

router.post("/pages/planyourday/:id/delete/prio", (req, res) => {

    const checkedTaskId = req.body.checkbox;
    let prioAuthor;

    Prio.findOne({ _id: checkedTaskId })
        .then((found) => {
            prioAuthor = found.author;
            Prio.deleteOne({ _id: checkedTaskId })
                .then(() => {
                    console.log("Priority successfully removed from the database.");
                    res.redirect(`/pages/planyourday/${prioAuthor}`);
                }).catch((err) => {
                    console.log(err);
                });
        });
});

router.post("/pages/planyourday/:id/delete/work", (req, res) => {

    const checkedTaskId = req.body.checkbox;
    let workAuthor;

    Work.findOne({ _id: checkedTaskId })
        .then((found) => {
            workAuthor = found.author;
            Work.deleteOne({ _id: checkedTaskId })
                .then(() => {
                    console.log("Work task successfully removed from the database.");
                    res.redirect(`/pages/planyourday/${workAuthor}`);
                }).catch((err) => {
                    console.log(err);
                });
        });
});

// update location

router.post("/pages/planyourday/:id/location", (req, res) => {

    let newQuery = req.body.newQuery;
    let cityName = newQuery.split(" ");
    let result = [];
    cityName.forEach((item) => {
        result.push(item[0].toUpperCase() + item.slice(1));
    });
    let city = result.join(" ");

    User.findOneAndUpdate({ _id: String(req.params.id) }, { city: city })
        .then(() => {
            res.redirect(`/pages/planyourday/${req.body.author}`);
            console.log("Successfully updated the location.");
        }).catch((err) => {
            console.log(err);
        });
});

module.exports = router;