const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

/**
 * WorkoutRepository provides methods to access and manipulate workout data.
 */

class WorkoutRepository {
  async getAll(userId) {
    return Workout.find({ user_id: userId });
  }

  async getByQuery(userId, searchQuery) {
    return Workout.find(
      searchQuery
        ? {
            user_id: userId,
            title: new RegExp(`^${searchQuery.toLowerCase()}`),
          }
        : { user_id: userId }
    );
  }

  async getChunkByQuery(userId, searchQuery, page, limit) {
    return Workout.find(
      searchQuery
        ? {
            user_id: userId,
            title: new RegExp(`^${searchQuery.toLowerCase()}`),
          }
        : { user_id: userId }
    )
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
  }

  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async add(title, muscleGroup, reps, load, userId) {
    return Workout.create({
      title: title,
      muscle_group: muscleGroup,
      reps,
      load,
      user_id: userId,
    });
  }

  async delete(id) {
    return Workout.findOneAndDelete({ _id: id });
  }

  async update(id, body) {
    return Workout.findOneAndUpdate({ _id: id }, body, {
      new: true,
      runValidators: true,
    });
  }

  async deleteAll(userId) {
    return Workout.deleteMany({ user_id: userId });
  }
}

module.exports = new WorkoutRepository();
