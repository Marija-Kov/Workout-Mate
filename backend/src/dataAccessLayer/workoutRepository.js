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
        console.error(error);
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

  async get(userId, searchQuery = null, page = 1, itemsPerPage = 3) {
    if (!userId) {
      const errorMessage = "workoutRepository.js > get: Must specify user id.";
      console.error(errorMessage);
      return errorMessage;
    }
    const all = await Workout.find({ user_id: userId });
    const allMuscleGroups = all.map((workout) => workout.muscle_group);
    const byQuery = searchQuery
      ? await Workout.find({
          user_id: userId,
          title: new RegExp(`^${searchQuery.toLowerCase()}`),
        })
      : all;
    const chunk = byQuery
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return {
      foundCount: byQuery.length,
      chunk,
      allMuscleGroups,
    };
  }

  async getCount(userId) {
    return await Workout.countDocuments({ user_id: userId });
  }

  async getOldestEntryId(userId) {
    return (await Workout.findOne({ user_id: userId }).sort({ createdAt: 1 }))
      ._id;
  }

  _isValidId(id) {
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
    if (!this._isValidId(id)) {
      return null;
    }
    return Workout.findOneAndDelete({ _id: id });
  }

  async update(id, body) {
    if (!this._isValidId(id)) {
      return null;
    }
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
