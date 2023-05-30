// middleware for advanced results on filtering, selecting, limit, page ...
// we wanna pass in the model we are using and model we use to populate the first
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // copy version of req.query
  const reqQuery = { ...req.query };
  // Fields to exclude, we don't want to include select from URL
  const removeFields = ["select", "sort", "page", "limit"];
  // loop over removeFields and delete the property from reqQuery
  // it will delete select=name from query object
  removeFields.forEach((param) => delete reqQuery[param]);

  // make our query to a string that we can make a $ sign in gt
  let queryStr = JSON.stringify(reqQuery);

  // \b for searching at the beggining and use mongoose comparison like greater then ..
  // and put a $ sign it to work
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // make it json format and search DB, if there is no query param the it will get all
  query = model.find(JSON.parse(queryStr));

  // SELECT FIELDS if the is a select property in query obj
  if (req.query.select) {
    // because it has to be space seperated not comma separated
    const fileds = req.query.select.split(",").join(" ");
    // we use mongoose method select to filter only from query params
    query = query.select(fileds);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-cratedAt");
  }

  // Pagination
  // make it a number and go to base 10
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  // for skiping
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // method to count all documents
  const total = await model.countDocuments();

  // Pagination resoult
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  query = query.skip(startIndex).limit(limit);

  // if something is passed into populate
  // populate the modal with that modal
  if (populate) {
    query = query.populate(populate);
  }

  // take query
  const results = await query;

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
