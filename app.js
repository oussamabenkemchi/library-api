const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.set('view engine',"ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true,useUnifiedTopology: true })

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
})
const Article = new mongoose.model('article',articleSchema)

app.route('/articles')
    .get(function(req,res){
    Article.find(function(err,foundArticles){
        if(err){
            console.log(err);
        }else{
            res.send(foundArticles)    
        }
    })
    })
    .post(function(req,res){
   
    const article = new Article({
        title : req.body.title,
        content : req.body.content
    })

    article.save(function(err){
        if(!err){
            res.send("succesfully added new article")
        }else{
            res.send(err)
        }
    })
    })
    .delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send('all articles succesfully deleted')
        }else{
            res.send(err)
        }
    })
});


app.route('/articles/:articleTitle')
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(!err){
                if(foundArticle){
                    res.send(foundArticle)
                }else{
                    res.send('no articles matching that title was found')
                }
        }else{
            res.write('hello it s an error')
            res.write(err)
            res.send
        }
    })
})
.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},function(err,results){
            if(!err){
                res.send('article was succesfully updated')
            }else{
                res.send(err)
            }
        }) 
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send('article was succesfully updated via patch request')
            }else{
                res.send(err)
            }  
        }
        )
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err,foundArticle){
        if(!err){
          
                res.send('article was deleted succesfully')

                   

        }else{
            res.send(err)
        }
    })
})
;


app.get('/',function(req,res){
    res.send('welcome to wiki api')
})


app.listen(3000,function(){
    console.log('server listens at port 3000');
})