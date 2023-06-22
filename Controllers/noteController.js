const { client, db } = require("../Config/dbConfig.js");
const notesCollection = client.db("notesdb").collection("notes");
const { v4: uuidv4 } = require("uuid");

const insertNote = async (req, res, next) => {
  const { title, content, tag, isCompleted } = req.body;

  let data = {
    _id: uuidv4(),
    title: title,
    content: content,
    tag: tag,
    isCompleted: isCompleted,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const insertRecord = await notesCollection.insertOne(data);
  console.log("insertRecord : ", insertRecord);

  res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "New Note Inserted successfully",
    insertRecord: insertRecord,
  });
};

const readNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const singleNote = await notesCollection.findOne({ _id: noteId });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "Note Fetched successfully",
    note: singleNote,
  });
};

const readAllNotes = async (req, res, next) => {
  const allNotes = await notesCollection.find({}).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "All Notes Fetched successfully",
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const deleteNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  notesCollection
    .deleteOne({ _id: noteId })
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Note deleted successfully",
        result: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        status: "failed",
        message: "Error Occured While Deleting Note!!",
      });
    });
};

const updateNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const updateNote = {
    $set: {
      title: req.body.title,
      content: req.body.content,
      isCompleted: req.body.isCompleted,
      tag: req.body.tag,
      updated_at: new Date(),
    },
  };

  notesCollection
    .findOneAndUpdate({ _id: noteId }, updateNote)
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Note updated successfully",
        result: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        status: "failed",
        message: "Error Occured While Updating Note!!",
      });
    });
};

const deleteAllNotes = async (req, res, next) => {
  notesCollection
    .deleteMany({})
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "All Note deleted successfully",
        result: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        status: "failed",
        message: "Error Occured While Deleting ALL Note!!",
      });
    });
};

const readNotesByTag = async (req, res, next) => {
  const { noteTag } = req.params;

  const singleNote = await notesCollection.find({ tag: noteTag }).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "Note By Tag Fetched successfully",
    note: singleNote,
  });
};

const readNotesByStatus = async (req, res, next) => {
  const { noteStatus } = req.params;

  const singleNote = await notesCollection.findOne({ isCompleted: noteStatus });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "Note By Status Fetched successfully",
    note: singleNote,
  });
};

//Advance NodeJs + MongoDB CRUd

const insertMultipleNotes = async (req, res, next) => {
  const { title, content, tag, isCompleted } = req.body;

  let data1 = {
    _id: uuidv4(),
    title: title,
    content: content,
    tag: tag,
    read_count: 0,
    isCompleted: isCompleted,
    stats: {
      heading: "stats_heading",
      title_length: title.length,
      content_length: content.length,
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  let data2 = {
    _id: uuidv4(),
    title: title + "[2nd Batch Write]",
    content: content + "[2nd Batch Write]",
    tag: tag,
    isCompleted: isCompleted,
    read_count: 0,
    stats: {
      heading: "stats_heading",
      title_length: title.length,
      content_length: content.length,
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  let data3 = {
    _id: uuidv4(),
    title: title + "[3rd Batch Write]",
    content: content + "[3rd Batch Write]",
    tag: tag,
    isCompleted: isCompleted,
    read_count: 0,
    stats: {
      heading: "stats_heading",
      title_length: title.length,
      content_length: content.length,
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    const insertManyRes = await notesCollection.insertMany([
      data1,
      data2,
      data3,
    ]);
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "New Notes Inserted successfully",
      insertManyRes: insertManyRes,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "New Notes Inserted Failed",
      error: error,
    });
  }
};

const deleteMultipleNotes = async (req, res, next) => {
  const { deletableIds } = req.body;
  console.log(`deletableIds : ${deletableIds}`);

  try {
    var deletedResults = [];
    for (let index = 0; index < deletableIds.length; index++) {
      const element = deletableIds[index];
      const notesBeingDeleted = await notesCollection.deleteOne({
        _id: element,
      });
      console.log(`notesBeingDeleted : ${notesBeingDeleted}`);
      deletedResults.push(notesBeingDeleted);
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "All Notes deleted successfully",
      deletedResults: deletedResults,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Error Occured While Deleting ALL Notes!!",
    });
  }
};

const sortNotesBasedOnTimestamp = async (req, res, next) => {
  try {
    const sort = { created_at: 1 };
    const sortedNotesResult = await notesCollection.find().sort(sort).toArray();

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Sorted Notes Fetched successfully",
      sortedNotesResult: sortedNotesResult,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note Fetched Failed",
      error: error,
    });
  }
};

const incrementDocumentField = async (req, res, next) => {
  const { noteId } = req.params;

  const fliter = { _id: noteId };
  const incrementDocument = {
    $inc: {
      read_count: 1,
    },
  };

  try {
    const incrementedResult = await notesCollection.updateOne(
      fliter,
      incrementDocument
    );
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Note Incremented successfully",
      incrementedResult: incrementedResult,
      incrementedNote: await notesCollection.findOne(fliter),
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note Incremention Failed",
      error: error,
    });
  }
};

const multiplyDocumentField = async (req, res, next) => {
  const { noteId } = req.params;

  const fliter = { _id: noteId };
  const multiplyDocument = {
    $mul: {
      read_count: 2,
    },
  };

  try {
    const multipliedResult = await notesCollection.updateOne(
      fliter,
      multiplyDocument
    );
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Note Multiplied successfully",
      multipliedResult: multipliedResult,
      multipliedNote: await notesCollection.findOne(fliter),
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note Multiplication Failed",
      error: error,
    });
  }
};

const renameDocumentField = async (req, res, next) => {
  const { noteId } = req.params;

  const fliter = { _id: noteId };
  const renameDocument = {
    $rename: {
      read_count: "note_read_count",
    },
  };

  try {
    const renameResult = await notesCollection.updateMany({}, renameDocument);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Note renamed successfully",
      renameResult: renameResult,
      renamedNote: await notesCollection.findOne(fliter),
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note renamed Failed",
      error: error,
    });
  }
};

const addDocumentField = async (req, res, next) => {
  const { noteId } = req.params;

  const filter = { _id: noteId };
  const addDocument = {
    $set: {
      newly_added_field: "update_dummy_value",
    },
  };

  try {
    const addResult = await notesCollection.updateMany({}, addDocument);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Note Added successfully",
      addResult: addResult,
      addedNote: await notesCollection.findOne(filter),
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note Addition Failed",
      error: error,
    });
  }
};

const removeDocumentField = async (req, res, next) => {
  const { noteId } = req.params;

  const filter = { _id: noteId };
  const removeDocument = {
    $unset: {
      newly_added_field: "update_dummy_value",
    },
  };

  try {
    const removeResult = await notesCollection.updateMany({}, removeDocument);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Note Removed successfully",
      removeResult: removeResult,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note Removal Failed",
      error: error,
    });
  }
};

const searchNotesByTitle = async (req, res, next) => {
  const query = { $text: { $search: req.params.query } };
  const projection = {
    _id: 0,
    title: 1,
    content: 1,
  };

  var fetchNotes = [];
  const searchResults = notesCollection.find(query).project(projection);
  await searchResults.forEach((element) => {
    fetchNotes.push(element);
    console.log(element);
  });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "Notes Searched successfully",
    totalSearch: fetchNotes.length,
    fetchNotes: fetchNotes,
  });
};

const skipReturnedResults = async (req, res, next) => {
  const allNotes = await notesCollection.find({}).skip(0).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "All Skipped Notes Fetched successfully",
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const limitReturnedResults = async (req, res, next) => {
  const allNotes = await notesCollection.find({}).limit(2).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "All Limited Notes Fetched successfully",
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const sortResults = async (req, res, next) => {
  const sort = { created_at: -1 };

  const allNotes = await notesCollection.find({}).sort(sort).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "All sortResults Notes Fetched successfully",
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const readNotesPaginated = async (req, res, next) => {
  var pageNumber = req.params.pageNum;
  const sort = { created_at: 1 };
  const limit = 2;
  var skip = pageNumber * limit;

  try {
    const allNotes = await notesCollection
      .find({})
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .toArray();

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "All Notes Fetched successfully",
      pageNumber: pageNumber,
      totalNotes: allNotes.length,
      notes: allNotes,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Pagination failed",
      error: error,
    });
  }
};

const retriveDistnictValue = async (req, res, next) => {
  const projection = {
    _id: 0,
    title: 1,
  };

  const allNotes = await notesCollection.find({}).project(projection).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "All Projected Notes Fetched successfully",
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const updateArraysInDocument = async (req, res, next) => {
  const { noteId } = req.params;

  const filter = { _id: noteId };
  const updateDocument = {
    $push: {
      newly_added_field: "update_dummy_value",
    },
  };

  try {
    const updateResult = await notesCollection.updateMany({}, {
      $set: { "stats.heading": "updated_heding" },
    });
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Notes Array updated successfully",
      updateResult: updateResult,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: "Note Array update Failed",
      error: error,
    });
  }
};

module.exports = {
  insertNote,
  readNoteById,
  readAllNotes,
  deleteNoteById,
  deleteAllNotes,
  readNotesByTag,
  readNotesByStatus,
  updateNoteById,
  insertMultipleNotes,
  deleteMultipleNotes,
  sortNotesBasedOnTimestamp,
  incrementDocumentField,
  multiplyDocumentField,
  renameDocumentField,
  addDocumentField,
  removeDocumentField,
  searchNotesByTitle,
  skipReturnedResults,
  limitReturnedResults,
  sortResults,
  readNotesPaginated,
  retriveDistnictValue,
  updateArraysInDocument,
};
