const controller={  
    
	quiz(req,res){  
  	    res.render('quiz')  
	},
	home(req,res){
		res.render('main')
	},
	ubisoft(req,res){
		res.render('ubisoft')
	},
	Error(req, res) {
		res.render('404')
	}
}  

module.exports = controller; 