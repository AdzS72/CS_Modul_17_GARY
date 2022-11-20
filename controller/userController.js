const express = require('express')
const db = require('../db.config/db.config.js')
const jwt = require('jsonwebtoken');
//const Auth = require('../middleware/auth')
const cookieParser = require('cookie-parser');
require("dotenv").config();
const bcrypt = require('bcrypt');
SECRET = process.env.SECRET


const register = async(req, res, next) => {
    // * 7. silahkan ubah password yang telah diterima menjadi dalam bentuk hashing
    const {username, email, password} = req.body
    const hash = await bcrypt.hash(password,10)
    
    // 8. Silahkan coding agar pengguna bisa menyimpan semua data yang diinputkan ke dalam database
    try {
        await db.query(`INSERT INTO unhan_modul_17 
        VALUES(DEFAULT, $1, $2, $3)`, [username,email,hash])
        res.send("Data Berhasil Ditambahkan ke Database")
    } catch (error) {
        res.send("Data Tidak Valid");
    }
}

const login = async(req, res, next) => {
    // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
    const {email, password} = req.body
    try {
        const user  = await db.query(`SELECT * FROM unhan_modul_17 WHERE email=$1`, [email])
        var id        = user.rows[0]['id']
        var username  = user.rows[0]['username']
        var hash      = user.rows[0]['password']
        var result    = await bcrypt.compare(password, hash)

        if (result==true) {
            // 10. Generate token menggunakan jwt sign
            let data = {
                id          : id,
                username    : username,
                email       : email,
                password    : hash
            }
            const token = jwt.sign(data, SECRET);
            res.cookie('token',token);
    
            //11. kembalikan nilai id, email, dan username
            res.json({id, username, email, token});
        } else {
            res.send("Password Salah");
        }
    } catch (error) {
        res.send("Email Tidak Valid");
    }
}

const logout = async(req, res, next) => {
                
    try {
        // 14. code untuk menghilangkan token dari cookies dan mengembalikan pesan "sudah keluar dari aplikasi"
        res.clearCookie('token')
        res.send('Berhasil Keluar dari Aplikasi')
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
            
}

const verify = async(req, res, next) => {
    try {
        // 13. membuat verify
        const decode = req.user
        //const decode = {'email':'luu@gmail.com','password':'asdwad'}
        const user   = (await db.query(`SELECT * FROM unhan_modul_17 WHERE email=$1 AND password=$2`, [decode.email,decode.password])).rows
        if (user=='') {
            res.send('Invalid User')
        } else {
            res.status(200).json(user)   
        }
        console.log(user)
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)    
    }
}

module.exports = {
    register,
    login,
    logout,
    verify
}