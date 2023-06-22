const noteController = require("../Controllers/noteController.js");
const router = require("express").Router();

//Now we can add our all routes here
router.post("/insertNote", noteController.insertNote);
router.get("/readAllNotes", noteController.readAllNotes);
router.delete("/deleteNoteById/:noteId", noteController.deleteNoteById);
router.put("/updateNoteById/:noteId", noteController.updateNoteById);
router.get("/readNoteById/:noteId", noteController.readNoteById);
router.get("/readNotesByTag/:noteTag", noteController.readNotesByTag);
router.get("/readNotesByStatus/:noteStatus", noteController.readNotesByStatus);
router.delete("/deleteAllNotes", noteController.deleteAllNotes);

router.get("/insertMultipleNotes", noteController.insertMultipleNotes);
router.delete("/deleteMultipleNotes", noteController.deleteMultipleNotes);

router.get(
  "/sortNotesBasedOnTimestamp",
  noteController.sortNotesBasedOnTimestamp
);

router.put(
  "/incrementDocumentField/:noteId",
  noteController.incrementDocumentField
);

router.put(
  "/multiplyDocumentField/:noteId",
  noteController.multiplyDocumentField
);

router.put("/renameDocumentField/:noteId", noteController.renameDocumentField);
router.put("/addDocumentField/:noteId", noteController.addDocumentField);
router.delete(
  "/removeDocumentField/:noteId",
  noteController.removeDocumentField
);
router.get("/searchNotesByTitle/:query", noteController.searchNotesByTitle);
router.get("/skipReturnedResults", noteController.skipReturnedResults);
router.get("/limitReturnedResults", noteController.limitReturnedResults);
router.get("/sortResults", noteController.sortResults);
router.get("/readNotesPaginated/:pageNum", noteController.readNotesPaginated);
router.get("/retriveDistnictValue", noteController.retriveDistnictValue);
router.put(
  "/updateArraysInDocument/:noteId",
  noteController.updateArraysInDocument
);

module.exports = router;
