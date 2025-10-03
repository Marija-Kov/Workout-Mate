const db = require("./sqliteDb");

module.exports.closeSqlite = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports.clearSqlite = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM wm_users", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      db.run("DELETE FROM account_confirmation", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      db.run("DELETE FROM password_reset", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
