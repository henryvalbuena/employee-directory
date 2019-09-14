const express           =   require('express');
const HTTP_PORT         =   process.env.PORT || 8080;
const app               =   express();
const multer            =   require('multer');
const path              =   require('path');
const dataService       =   require('./data-service.js');
const dataServiceAuth   =   require('./data-service-auth');
const fs                =   require('fs');
const exphbs            =   require('express-handlebars');
const bodyParser        =   require('body-parser');
const clientSession     =   require('client-sessions');
const storage           =   multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

app.use(express.static('public'));

const urlencodedParser  =   bodyParser.urlencoded({extended:true});

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue)
                return options.inverse(this);
            else
                return options.fn(this);
        },
        pageTitle: function(url, options) {
            if (url == app.locals.activeRoute) return options.fn(this);
        }
    }
}));
app.set('view engine', '.hbs');

app.use((req, res, next) => {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = route;
    next();
});

app.use(clientSession({
    cookieName: "session",
    secret: "A6_Webb322",
    duration: 1000 * 60 * 5,
    activeDuration: 1000 * 60 * 2
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (res.locals.session.user)
        next();
    else
        res.redirect('/login');
}

// ***************** TESTS *****************

app.get('/test', ensureLogin, (req, res) => {
    res.json({
        query: req.query,
        user: res.locals.session.user
    })
});

// ***************** ROUTES *****************
// GET
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
    dataServiceAuth.queryUser({userName: res.locals.session.user}).then(data => {
        console.log(data[0]);
        res.render('userHistory', {user: data[0]});
    }).catch(err => {
        data = {
            ok: false,
            msg: 'ERROR: user session not initiated'
        }
        res.render('userHistory', {error: data});
    });
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/employees', ensureLogin, (req, res) => {
    if (req.query.status) {
        dataService.getEmployeesByStatus(res.locals.session.user, req.query.status).then(data => {
            res.render('employees', {employees: data})
        }).catch(err => {
            data = {
                ok: false,
                msg: 'ERROR: no employees were found with this status'
            }
            res.render('employees', {error: data});
        });
    }
    else if (req.query.department) {
        dataService.getEmployeesByDepartment(res.locals.session.user, req.query.department).then(data => {
            res.render('employees', {employees: data})
        }).catch(err => {
            data = {
                ok: false,
                msg: 'ERROR: no employees were found in this department'
            }
            res.render('employees', {error: data});
        });
    }
    else if (req.query.manager) {
        dataService.getEmployeesByManager(res.locals.session.user, req.query.manager).then(data => {
            res.render('employees', {employees: data})
        }).catch(err => {
            data = {
                ok: false,
                msg: 'ERROR: no employees were found working with this manager'
            }
            res.render('employees', {error: data});
        });
    }
    else {
        dataService.getAllEmployees(res.locals.session.user).then(data => {
            res.render('employees', {employees: data})
        }).catch(err => {
            data = {
                ok: false,
                msg: 'ERROR: no employees were found'
            }
            res.render('employees', {error: data});
        });
    }
});

app.get('/employees/add', ensureLogin, (req, res) => {
    res.render('addEmployee');
});

app.get('/employee/:num', ensureLogin, (req, res) => {
    dataService.getEmployeeByNum(res.locals.session.user, req.params.num).then(data => {
        res.render('employee', {emp: data[0].dataValues})
    }).catch(err => {
        data = {
            ok: false,
            msg: 'ERROR: no employees were found with this employee number'
        }
        res.render('employee', {error: data});
    });
});

app.get('/departments', ensureLogin, (req, res) => {
    dataService.getDepartments().then(data => {
        res.render('departments', {departments: data});
    }).catch(err => {
        data = {
            ok: false,
            msg: 'ERROR: no departments were found'
        }
        res.render('departments', {error: data});
    });
});

app.get('/departments/add', ensureLogin, (req, res) => {
    res.render('addDepartment')
});

app.get('/department/:departmentId', ensureLogin, (req, res) => {
    dataService.getDepartmentById(req.params.departmentId).then(data => {
        res.render('department', {dept: data[0].dataValues})
    }).catch(err => {
        data = {
            ok: false,
            msg: 'ERROR: no departments were found with this department id'
        }
        res.render('department', {error: data});
    });
});

app.get('/images/add', ensureLogin, (req, res) => {
    res.render('addImage');
});

app.get('/images', ensureLogin, (req, res) => {
    fs.readdir('./public/images/uploaded', (err, files) => {
        if (err) { 
            data = {
                ok: false,
                msg: 'ERROR: no images were found'
            }
            res.render('images', {error: data});
        }
        else res.render('image', {images: files});
    });
});

// POST

app.post('/login', urlencodedParser, (req, res) => {
    req.body.agent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body).then(data => {
        req.session.user = data;
        res.redirect('/');
    }).catch(err => {
        data = {
            ok: false,
            msg: "User: " + err + ", or Password don't match, check and try again"
        }
        res.render('login', {error: data});
    });
});

app.post('/register', urlencodedParser, (req, res) => {
    req.body.agent = req.get('User-Agent');
    dataServiceAuth.registerUser(req.body).then(() => {
        res.redirect('/');
    }).catch(err => {
        data = {
            ok: false,
            msg: "User: " + err + " already in use, check and try again"
        }
        res.render('register', {error: data});
    });
});

app.post('/images/add', upload.single('imageFile'), (req, res) => {
    res.redirect('/images');
});

app.post('/employees/add', ensureLogin, urlencodedParser, (req, res) => {
    dataService.addEmployee(res.locals.session.user, req.body).then(() => {
        res.redirect('/employees');
    }).catch(err => {
        res.status(404).write(JSON.stringify(err));
        res.end();
    });
});

app.post('/employee/update', ensureLogin, urlencodedParser, (req, res) => {
    dataService.updateEmployee(res.locals.session.user, req.body).then(() => {
        console.log('Success');
        res.redirect('/employees');
    }).catch(err => {
        console.log(err);
        res.status(404).write(JSON.stringify(err));
        res.end();
    });
});

app.post('/departments/add', urlencodedParser, (req, res) => {
    dataService.addDepartment(req.body).then(() => {
        res.redirect('/departments');
    }).catch(err => {
        res.status(404).write(JSON.stringify(err));
        res.end();
    });
});

app.post('/department/update', urlencodedParser, (req, res) => {
    dataService.updateDepartment(req.body).then(() => {
        res.redirect('/departments');
    }).catch(err => {
        res.status(404).write(JSON.stringify(err));
        res.end();
    });
});

// DELETE

app.get('/department/delete/:num', ensureLogin, (req, res) => {
    dataService.deleteDepartment(req.params.num).then(() => {
        res.redirect('/departments');
    }).catch(err => {
        res.status(404).write(JSON.stringify(err));
        res.end();
    });
});

app.get('/employee/delete/:num', ensureLogin, (req, res) => {
    dataService.deleteEmployee(res.locals.session.user, req.params.num).then(() => {
        res.redirect('/employees');
    }).catch(err => {
        res.status(404).write(JSON.stringify(err));
        res.end();
    });
});

// ERROR 404 NOT FOUND

app.use((req, res) => {
    res.status(404);
    res.write("<h1>404</h1><h4>Whoops, that's an error.</h4>");
    res.write("<h2>The requested url was not found on this server.</h2>");
    res.end();
});

dataService.initialize().then(dataServiceAuth.initialize().then(msg => {
    app.listen(HTTP_PORT, ()=> {
        console.log(msg);
        console.log("Express http server listening on " + HTTP_PORT);
    });
})).catch(err => {
    console.log(err);
});