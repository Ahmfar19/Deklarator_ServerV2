const Note = require('../models/note.model');
const { sendResponse } = require('../helpers/apiResponse');

const getAllNoties = async (req, res) => {
    try {
        const noties = await Note.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the note', null, noties);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleNote = async (req, res) => {
    try {
        const id = req.params.id;
        const note = await Note.getNoteById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved single note', null, note);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addNote = async (req, res) => {
    try {
        const note = new Note(req.body);
        await note.save();
        sendResponse(res, 201, 'Created', 'Successfully created a note.', null, note);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateNote = async (req, res) => {
    try {
        const id = req.params.id;
        const note = new Note(req.body);

        const data = await note.updateNote(id);
        if (data.affectedRows === 0) {
            throw new Error('Note not found or unable to update');
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a Note.', null, note);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteNote = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Note.findByIdAndDelete(id);

        if (data.affectedRows === 0) {
            throw new Error('Note not found or unable to delete');
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a note.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getNotesBy_CompanyId = async (req, res) => {
    try {
        const id = req.params.id;
        const noties = await Note.getNotesByCompanyId(id);
        sendResponse(res, 200, 'Ok', `Successfully retrieved all the notiesByCompanyId ${id}`, null, noties);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
module.exports = {
    getAllNoties,
    addNote,
    getSingleNote,
    updateNote,
    deleteNote,
    getNotesBy_CompanyId,
};
