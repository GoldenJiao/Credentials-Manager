//jshint esversion:6
const express = require("express");
const bodyParser = require("body-Parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var bcrypt=require("bcrypt");
var CryptoJS=require("crypto-js");
var moment = require('moment');




const KEY = "abcdef"


const app = express();

app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true},{useUnifiedTopology:true}).then(()=>{
  console.log("connected");
})
.catch((err)=>console.log("err"));


const userSchema ={
  email: String,
  password: String,
  storedpass:[{
    type:String
  }]

};

const User = new mongoose.model('User',userSchema);


app.get('/',function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/submit",function(req,res){
  res.render("submit");
});



app.get("/logout",function(req,res){
  res.redirect("/");
});
var newUser;

app.post('/register',function(req,res){

  bcrypt.hash(req.body.password,10,function(err,hash){
     newUser = new User({
      email:req.body.username,
      password:hash
    });

    newUser.save(function(err){
      if (err){
        console.log(err);
      }else{

        var list;

        // User.findOne({email:username},function(err, foundUser){
        //   if (foundUser){
        //   // console.log(foundUser);
        //   list =foundUser.storedpass;
        //   console.log(list[0]);
        //
        //   for (var i=0; i<list.length; i++){
        //     console.log(list[i]);
        //       list[i] = CryptoJS.AES.decrypt(list[i], KEY).toString(CryptoJS.enc.Utf8);
        //       console.log(list[i]);
        //
        //   }


        res.render("secrets", {listp : []});

      }
    });
  });


  // console.log(password);
});

var username;
var password;

app.post("/login", function(req,res){
   username=req.body.username;
   password=req.body.password;

  User.findOne({email:username},function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if (foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result===true){

            var list;

            User.findOne({email:username},function(err, foundUser){
              if (foundUser){
              // console.log(foundUser);
              list =foundUser.storedpass;
              // console.log(list);

            for (var i=0; i<list.length; i++){
              console.log(list[i]);
                list[i] = CryptoJS.AES.decrypt(list[i], KEY).toString(CryptoJS.enc.Utf8);
                console.log(list[i]);

            }


            res.render("secrets", {listp : list});
}});
            // res.render('secrets');
          }
          else{
            alert('Invalid Credential')
          }
        });

      }else if (currentuser ===null) {
         console.log("invalid username");
         res.redirect("/login");
      }
      }
    });
  });

  app.post("/submit",function(req,res){
    const newpass=req.body.secret;

    const  encrypted = CryptoJS.AES.encrypt(newpass, KEY).toString();
//U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

// const decrypted = CryptoJS.AES.decrypt(encrypted, KEY).toString();
  console.log("df: ", encrypted);

    // console.log(newpass);
    User.findOne({email:username},function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if (foundUser){


          User.updateOne({email:username},{$push:{storedpass:encrypted}},function(err, res) {
            console.log(err);
            console.log(res);



          });

          console.log(foundUser);

          }
        }
      });







  });

  app.post("/psswrd",function(req,res){


        User.findOne({email:username},function(err, foundUser){
          if (foundUser){
          // console.log(foundUser);

          list =foundUser.storedpass;

          console.log(list);
         return list;
        }
        });


     });

app.listen(3000,function(){
    console.log("Server running..");
  });
