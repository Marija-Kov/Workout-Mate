const Workout = require("../models/workoutModel");

class WorkoutRepository {
  async getAll() {
    return;
  }

  async add() {
    return;
  }

  async delete(id) {
    return;
  }

  async update() {
    return;
  }

  async deleteAll(userId) {
    return Workout.deleteMany({ user_id: userId });
  }
}

module.exports = WorkoutRepository;
