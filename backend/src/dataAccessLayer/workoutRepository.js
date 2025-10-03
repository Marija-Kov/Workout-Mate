const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

/**
 * Connects to MongoDB server and provides methods to access and manipulate workout data.
 */
class WorkoutRepository {
  constructor() {
    if (process.env.NODE_ENV !== "test") {
      this.connect();
    }
  }

  async connect(retryCount = Number(process.env.MAX_RETRIES) || 10) {
    const retryDelayMs = 2000;
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
      if (retryCount > 0) {
        console.error(
          `MongoDB connection failed. Retrying in ${Number(process.env.RETRY_DELAY_MS) || retryDelayMs / 1000} seconds...`
        );
        setTimeout(
          () => this.connect(retryCount - 1),
          Number(process.env.RETRY_DELAY_MS) || retryDelayMs
        );
      } else {
        console.error("Could not connect to MongoDB:", error);
      }
    }
  }

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
      .skip((page - 1) * limit)
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
