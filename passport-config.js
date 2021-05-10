const LocalStrategy=require('passport-local').Strategy;
const bcrypt =require('bcrypt');

function initialize(passport){
  const authenticateUser=(email,password,done)=>{
    const user= getUserByEmail(email);
    if(user==null){
      return done(null,false,{message:"No user with that email"});
    }
    try{
      if (bcrypt.compare(password, user.password)){
        console.log('hello');
      }else{
        return done(null,false,{message:'Password incorrect'})
      }
    }catch(e){
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  });
};

module.exports=initialize;
