const notesCtrl = {};
const Note = require('../models/Notes');
const User = require('../models/User');

notesCtrl.renderNoteForm = (req, res) => {
    //res.send('Notes Add');
	res.render('notes/new-note');
};

notesCtrl.createNewNote = async (req, res) => {
	const {title, description } =  req.body;
	const newNote = new Note({title, description});
	newNote.user = req.user.id;
	try{
		await newNote.save();
		req.flash('success_msg', 'Note Added Successfully');
		res.redirect(`/notes/${req.user.id}`);
	}
	catch(error){
		console.log(error);
	}
};

notesCtrl.renderNotes = async (req, res) => {
	//console.log(req.params.usrId);
    //res.send('Render notes');
	const notes = await Note.find({"user": req.params.usrId});
	const usrName = await User.findById(req.params.usrId).select('name');

	await notes.map((note) => {
		note.usrName= usrName.name;
	})
	res.render('notes/all-notes', {notes});
};

notesCtrl.renderEditForm = async (req, res) => {
	const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
};

notesCtrl.updateNote = async (req, res) => {
	const id = req.query.id, usrId = req.query.usrId;
	const {title, description } =  req.body;
	await Note.findByIdAndUpdate(id, {title,description});
    res.redirect(`/notes/${usrId}`);
};

notesCtrl.deleteNote = async (req, res) => {
	const id = req.query.id, usrId = req.query.usrId;
	await Note.findByIdAndDelete(id);
	res.redirect(`/notes/${usrId}`);
};

module.exports = notesCtrl; 