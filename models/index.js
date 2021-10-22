const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    required: true,
    default: Date.now
  },

  exercises: [
    {
      type: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      distance: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      reps: {
        type: Number,
      },
      sets: {
        type: Number,
      },
    },
  ],
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = { Workout };

/*
 day: new Date(new Date().setDate(new Date().getDate() - 1)),
 exercises: [
   {
     type: 'resistance',
     name: 'Military Press',
     duration: 20,
     weight: 300,
     reps: 10,
     sets: 4,
   },
 ],
 */
