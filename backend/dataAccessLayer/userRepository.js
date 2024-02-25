const { Pool } = require("pg");
require("dotenv").config();

class UserRepository {
  constructor() {
    if (process.env.NODE_ENV === "test") {
      this.db = require("../controllers/test-utils/sqliteDb");
      this.deleteToken = (id) => {
        this.db.run(`DELETE FROM account_confirmation WHERE user_id = ?;`, id);
      };
    } else {
      this.pool = new Pool({
        user: process.env.SB_USER,
        password: process.env.SB_PASSWORD,
        host: process.env.SB_HOST,
        database: process.env.SB_DATABASE,
      });
    }
  }
  async create(email, password) {
    const sql = ` 
    INSERT INTO wm_users (email, password)
    VALUES ($1, $2)
    RETURNING _id, email;
    `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.get(sql, [email, password], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, [email, password]);
        client.release();
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.create:", error);
    }
  }

  async login(email, password) {
    return User.login(email, password);
  }

  async findAll() {
    try {
      const sql = `
       SELECT _id FROM wm_users;
      `;
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, []);
        client.release();
        return result.rows;
      }
    } catch (error) {
      console.error("User.findAll:", error);
    }
  }

  async findByEmail(email) {
    return User.findOne({ email: email });
  }

  async isEmailInDb(email) {
    const sql = `
    SELECT * FROM wm_users WHERE email = $1;
   `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.get(sql, [email], (err, row) => {
            if (err) {
              reject(err);
            } else if (!row) {
              resolve(null);
            } else {
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, [email]);
        client.release();
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.isEmailInDb:", error);
    }
  }

  async findById(id) {
    return User.findOne({ _id: id });
  }

  async findAccountConfirmationToken(token) {
    return User.findOne({ accountConfirmationToken: token });
  }

  async findPasswordResetToken(token) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });
  }

  async delete(id) {
    const sql =
      process.env.NODE_ENV === "test"
        ? `
           DELETE FROM wm_users WHERE _id = $1`
        : `
           WITH delete_user AS (
             DELETE FROM wm_users WHERE _id = $1
           )
           DELETE FROM account_confirmation WHERE user_id = $1;
          `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.deleteToken(id);
          this.db.run(sql, [id], (err, row) => {
            if (err) {
              reject(err);
            } else if (!row) {
              resolve(null);
            } else {
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, [id]);
        client.release();
      }
    } catch (error) {
      console.error("User.delete:", error);
    }
  }

  async update(id, body) {
    return User.findOneAndUpdate({ _id: id }, body, {
      new: true,
      runValidators: true,
    });
  }

  async save(user) {
    const { _id, accountConfirmationToken } = user;
    const activate =
      process.env.NODE_ENV === "test"
        ? `UPDATE wm_users SET account_status = 'active' WHERE _id = $1;`
        : `WITH activate_user AS (
            UPDATE wm_users 
            SET account_status = 'active'
            WHERE _id = $1
          )
          DELETE FROM account_confirmation WHERE user_id = $1;
          `;
    const sql = accountConfirmationToken
      ? `
         INSERT INTO account_confirmation (user_id, token)
         VALUES ($1, $2)
         RETURNING user_id, token;
        `
      : activate;
    const args = accountConfirmationToken
      ? [_id, accountConfirmationToken]
      : [_id];
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.deleteToken(_id);
          this.db.get(sql, [...args], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, [...args]);
        client.release();
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.save:", error);
    }
  }
}

module.exports = new UserRepository();
