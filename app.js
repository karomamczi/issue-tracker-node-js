const express = require('express');
const path = require('path');

const app = express();

const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', 'views');

const issueTrackerRoutes = require('./routes/issue-tracker');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(issueTrackerRoutes);

app.listen(3000);
