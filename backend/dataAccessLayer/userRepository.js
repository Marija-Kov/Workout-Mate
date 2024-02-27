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
              row.profileImg = row.profile_image;
              delete row.profile_image;
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, [email]);
        client.release();
        result.rows[0].profileImg = result.rows[0].profile_image;
        delete result.rows[0].profile_image;
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.findByEmail:", error);
    }
  }

  async findById(id) {
    const sql = `
    SELECT * FROM wm_users WHERE _id = $1;
   `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.get(sql, [id], (err, row) => {
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
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.findById:", error);
    }
  }

  async findAccountConfirmationToken(token) {
    const sql = `
    SELECT user_id as _id, token FROM account_confirmation WHERE token = $1;
    `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.get(sql, [token], (err, row) => {
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
        const result = await client.query(sql, [token]);
        client.release();
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.findAccountConfirmationToken:", error);
    }
  }

  async savePasswordResetToken(user_id, token) {
    const sql = `
    INSERT INTO password_reset (user_id, token)
    VALUES ($1, $2);
    `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.run(sql, [user_id, token], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        await client.query(sql, [user_id, token]);
        return client.release();
      }
    } catch (error) {
      console.error("User.savePasswordResetToken:", error);
    }
  }

  async findPasswordResetToken(token) {
    const sql =
      process.env.NODE_ENV === "test"
        ? ` 
          SELECT _id
          FROM wm_users JOIN password_reset 
          ON wm_users._id = password_reset.user_id
          WHERE password_reset.token = $1
          AND password_reset.expires > unixepoch('now');
          `
        : ` 
          SELECT _id
          FROM wm_users JOIN password_reset 
          ON wm_users._id = password_reset.user_id
          WHERE password_reset.token = $1
          AND password_reset.expires > now();
          `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.get(sql, [token], (err, row) => {
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
        const result = await client.query(sql, [token]);
        client.release();
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.findPasswordResetToken:", error);
    }
  }

  async changePassword(password, user_id) {
    const sql = `
     UPDATE wm_users
     SET
      password = $1
     WHERE _id = $2;
    `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.run(sql, [password, user_id], (err, row) => {
            this.db.run(
              `DELETE FROM password_reset WHERE user_id = ?;`,
              user_id
            );
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
        const result = await client.query(sql, [password, user_id]);
        await client.query(`DELETE FROM password_reset WHERE user_id = $1;`, [
          user_id,
        ]);
        client.release();
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.changePassword:", error);
    }
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
    const sql = `
     UPDATE wm_users
     SET 
      username = COALESCE($1, username),
      profile_image = COALESCE($2, profile_image)
     WHERE _id = $3
     RETURNING _id, email, username, profile_image;
    `;
    try {
      if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
          this.db.get(sql, [body.username, body.profileImg, id], (err, row) => {
            if (err) {
              reject(err);
            } else {
              row.profileImg = row.profile_image;
              delete row.profile_image;
              resolve(row);
            }
          });
        });
      } else {
        const client = await this.pool.connect();
        const result = await client.query(sql, [
          body.username,
          body.profileImg,
          id,
        ]);
        client.release();
        result.rows[0].profileImg = result.rows[0].profile_image;
        delete result.rows[0].profile_image;
        return result.rows[0];
      }
    } catch (error) {
      console.error("User.update:", error);
    }
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
