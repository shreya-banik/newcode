if(process.env.NODE_ENV!=='production'){
  require('dotenv').config();
}

const express =  require('express');
const app = express();
const bcrypt=require('bcrypt');
const passport=  require('passport');
const flash= require('express-flash');
const session= require('express-session');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const User = require('./models/user');
const bodyParser=require('body-parser');
const path = require('path')

const JWT_SECRET = 'fydgqaikwoqaiwe263rgkjfewgtr732836rydhhj347';

mongoose.connect('mongodb://localhost:27017/users', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

const initializePassport=require('./passport-config');
initializePassport(
  passport,
  email=> {
  return users.find(user=>user.email===email);
});

app.set('view-engine','ejs');
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,

}));

app.get('/',(req,res)=> {
  res.render('index.ejs');
});

app.get('/login',(req,res) =>{
  res.render('login.ejs');
});

app.post('/login',async(req,res)=>{
  const { name, password } = req.body;
	const user = await user.findOne({ name }).lean();

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' });
	}

	if (await bcrypt.compare(password, user.password)) {

		const token = jwt.sign(
			{
				id: user._id,
				name: user.name
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token });
	}

	res.json({ status: 'error', error: 'Invalid username/password' });

});

app.get('/register',(req,res) =>{
  res.render('register.ejs');
});

app.post('/register',async (req,res)=>{
  try{
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    users.push({
      id: Date.now().toString(),
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    }),
    res.redirect('/login');
  }catch{
    res.redirect('/register');
  }
  console.log(users);
  req.body.email;
});

app.listen(3000);
