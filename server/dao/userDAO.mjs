// Module for the user's Data Access Object (DAO)

import db from "../db/db.mjs";
import crypto from "crypto";
import User from "../models/user.mjs";

export default function UserDAO() {

    //create new user
    this.createUser=(name,surname,role,username,password)=>{
        return new Promise((resolve,reject)=>{
            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.scryptSync(password,salt,16);
            const query = 'INSERT INTO users (name,surname,role,username,password,salt) VALUES (?,?,?,?,?,?)'
            db.run(query,[name,surname,role,username,hashedPassword,salt],(err)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }

    //get user by ID
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE userID=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    resolve(new User(row.userID, row.name, row.surname, row.role, row.username));
                }
            });
        });
    };

    //get user by credentials
    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username=?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    crypto.scrypt(password, row.salt, 16, function (err, hashedPassword) {
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(new User(row.userID, row.name, row.surname, row.role, row.username));
                    });
                }
            });
        });
    };

}
