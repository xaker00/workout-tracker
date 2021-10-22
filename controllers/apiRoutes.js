const router = require("express").Router();
const db = require("../models");

router.get("/workouts", async (req, res) => {
  try {
    const workouts = await db.Workout.aggregate([
      {
        $addFields: {
          totalDuration: { $sum: "$exercises.duration" },
        },
      },
    ]).sort('day');
    res.json(workouts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/workouts", async (req, res) => {
  try {
    const workout = await db.Workout.create(req.body);
    res.json(workout);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/workouts/:id", async (req, res) => {
  try {
    const workout = await db.Workout.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { exercises: req.body } },
      { new: true }
    );
    res.json(workout);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// last 7 days
// https://masteringjs.io/tutorials/mongoose/aggregate
// https://stackoverflow.com/a/51174454
router.get("/workouts/range", async (req, res) => {
  try {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const filter = { day: { $gte: startDate } };

    // SQL is much easier that this mess!!!!!
    const workouts = await db.Workout.aggregate([
      { $match: filter },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$day",
            },
          },
          totalDuration: { $sum: "$exercises.duration" },
          exercises: { $push: "$exercises" },
        },
      },
      {
        // transform the names
        $project: {
          day: "$_id",
          totalDuration: "$totalDuration",
          exercises: "$exercises",
        },
      },
    ]).sort('day');

    res.json(workouts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
