const mongoose      =       require('mongoose');
const Schema        =       mongoose.Schema;
const bcrypt        =       require('bcryptjs');

let userSchema = new Schema({
    userName: String,
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
});
let uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true`;

let User;

function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(uri);
        db.on('error', err => {
            reject(err);
        });
        db.once('open', ()=> {
            User = db.model('users', userSchema);
            resolve("Dbs Ok!");
        });
    });
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        parseUserData(userData, false, (ready, dataParsed) => {
            if(ready) {
                queryUser(dataParsed).then(user => {
                    bcrypt.compare(dataParsed.password, user[0].password).then(res => {
                        if (res) {
                            updateUserLog(dataParsed).then(() => {
                                resolve(dataParsed.userName);
                            }).catch(err => {
                                console.log(err);
                                reject(err);
                            });
                        }
                        else
                            reject('Password dont match');
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
                }).catch(err => {
                    console.log(err);
                    reject(dataParsed.userName);
                });
            }
            else reject("Error parsing user data");
        });
    });
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        parseUserData(userData, true, (ready, dataParsed) => {
            if (ready) {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(dataParsed.password, salt, (err, hash) => { 
                        dataParsed.password = hash;
                        console.log(dataParsed);
                        addUser(dataParsed).then(() => {
                            resolve("User Registered");
                        }).catch(err => {
                            console.log(err);
                            reject(err);
                        });
                    });
                });
            }
            else reject(userData.userName);
        });
    });
}

// **** helper functions **** 
function parseUserData(userData, isNew, cb) {
    if (isNew) {
        if (userData.userName && userData.password01 && userData.email) {
            queryUser(userData).then(() => {
                cb(false);
            }).catch(() => {
                parsed = {
                    userName: userData.userName,
                    password: userData.password01,
                    email: userData.email,
                    loginHistory: [{
                        dateTime: new Date(),
                        userAgent: userData.agent
                    }]
                }
                cb(true, parsed);
            });
        }
        else cb(false);
    }
    else {
        if (userData.userName && userData.password) {
            parsed = {
                userName: userData.userName,
                password: userData.password,
                loginHistory: [{
                    dateTime: new Date(),
                    userAgent: userData.agent
                }]
            }
            cb(true, parsed);
        }
        else cb(false);
    }
}
function queryUser(userData) {
    return new Promise((resolve, reject) => {
            User.find({ userName: userData.userName }).exec().then(data => {
            if (data[0])
                resolve(data);
            else reject("User Not Found!");
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}
function addUser(userData) {
    return new Promise((resolve, reject) => {
        new User(
            userData
        ).save(err => {
            if (err) reject(err);
            else resolve("User added");
        });
    });
}
function updateUserLog(user) {
    return new Promise((resolve, reject) => {
            User.findOneAndUpdate(
                {
                    userName: user.userName
                },
                {
                    $push: {
                        loginHistory: user.loginHistory[0]
                    }
                },
                (err, doc) => {
                    if (err) reject(err);
                    else resolve("User updated");
                }
            );
    });
}

// **** exports **** 
module.exports = {
    initialize,
    registerUser,
    checkUser,
    queryUser
}