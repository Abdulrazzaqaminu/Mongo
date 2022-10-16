const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require('fs');
const { counter, user } = require('../users');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
})

var upload = multer({
    storage: storage, 
}).single("image");


// insert user
router.post('/add', upload, (req, res) =>{
    counter.findOneAndUpdate(
        {id:"autoval"},
        {"$inc": {"seq":1}},
        {new:true}, (err, rs) =>{
            let seqId
            if(rs==null){
                const newval = new counter({id:"autoval", seq:1})
                newval.save()
                seqId = 1;
            }
            else{
                seqId = rs.seq
            }
            const User = new user({
                id:seqId,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                image: req.file.filename,
            });
            User.save((err) =>{
                if(err) throw err;
                else{
                    console.log(User)
                    res.redirect('/')
                }
            })
        }
    )
})
// display database record
router.get('/', (req, res) =>{
    user.find().exec((err, rs) =>{
        if(err) throw err;
        else{
            res.render('index', {
                title: 'Home Page', 
                users: rs
            })
        }
    })
})

router.get('/add', (req, res) =>{
    res.render('add_user')
})
// Edit user
router.get('/edit/:id', (req, res) =>{
    let id = req.params.id
    user.findById(id, (err, rs) =>{
        if(err){
            res.redirect('/')
        }
        else{
            if(rs == null){
                res.redirect('/')
            }
            else{
                res.render('edit_user', {
                    title: 'Edit User', 
                    user: rs
                })
            }
        }
    })
})
// update user
router.post('/update/:id', upload, (req, res) =>{
    let id = req.params.id;
    let new_image = "";
    if(req.file){
        new_image = req.file.filename
        try{
            fs.unlinkSync("./uploads/"+req.body.old_image)
        }
        catch(err){
            console.log(err)
        }
    }else{

        new_image = req.body.old_image;
    }
    user.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image
    }, (err, rs) =>{
        if(err) throw err
        else{
            res.redirect('/')
        }
    })
})

// Delete user

router.get('/delete/:id', (req, res) =>{
    let id = req.params.id;
    user.findByIdAndRemove(id, (err, result) =>{
        if(result.image != ''){
            try{
                fs.unlinkSync("./uploads/"+result.image)
            }
            catch(err){
                console.log(err);
            }
        }
        if(err) throw err;
        else{

            res.redirect('/')
        }
    })
})

module.exports = router;