const usersCtrl = {};

const passport = require('passport');
const User = require('../models/User');

usersCtrl.renderSignUpForm = (req, res) => {
	res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
	
	const errors = [];
	const {name, email, password, confirm_password} = req.body;
	
	if(password !== confirm_password){
		errors.push({text: 'Passwords do not match'});
	}
	if(password.length < 4){
		errors.push({text: 'Passwords must be least 4 characteres'});
	}
	if(errors.length > 0){
		res.render('users/signup', {errors, name, email});
	}
	else{
		const emailUser = await User.findOne({email});
		if(emailUser){
			req.flash('error_msg', 'The e-mail is already in use.');
			res.redirect('signup');
		}
		else{
			const newUser =  new User({name, email, password});
			newUser.password = await newUser.encryptPassword(password);
			await newUser.save();
			req.flash('success_msg', 'You are Registered.');
			res.redirect('login');
		}
	}
	
};

usersCtrl.renderLoginForm = (req, res) => {
	res.render('users/login');
};

usersCtrl.login = async (req, res) => {
	//so funcionou assim aqui
	const {email, password} = req.body;
	const user = await User.findOne({email});
	if(!user){
		if(email.length>0)
			req.flash('error_msg', 'User not found.');
		res.redirect('login');
	}
	else{
		const match = await user.matchPassword(password);
		if(match){
			
			//console.log(user._id);
			req.login(user._id, function(err){
				res.redirect(`/notes/${user._id}`);
			});
		}
		else{
			req.flash('error_msg', 'Invalid Password.');
			res.redirect('login');
		}
		//res.redirect('login');
	}
	//res.send('login');
};
/*usersCtrl.login = passport.authenticate('local', {
	failureRedirect: '/users/login',
	successRedirect: '/notes',
	failureFlash: true
});*/

usersCtrl.logout = (req, res) => {
	//res.send('logout');
	req.logout();
	req.flash('success_msg', 'You are logged out now');
	res.redirect('/users/login');
};


module.exports = usersCtrl;