// const getAllNotes = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Note.find(), req.query).sort();

//   const notes = await features.query;

//   if (!notes.length) {
//     return next(new AppError("No notes found!", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     results: notes.length,
//     data: {
//       notes,
//     },
//   });
// });

// const getNote = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   const note = await Note.findById(id).select("+createdAt");

//   if (!note) {
//     return next(new AppError("No note found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       note,
//     },
//   });
// });

// module.exports = { getAllNotes, getNote };
