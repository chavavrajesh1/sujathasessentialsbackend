const asyncHandler = require("../middleware/asyncHandler");
const Tour = require("../models/Tour");

const createTour = asyncHandler(async (req, res) => {
  const { title, slug, description, places, duration, price, notes } = req.body;
  const tour = new Tour({
    title,
    slug,
    description,
    places,
    duration,
    price,
    notes,
  });
  if (req.files && req.files.length)
    tour.images = req.files.map((f) => ({
      url: f.path,
      public_id: f.filename || f.public_id,
    }));
  await tour.save();
  res.status(201).json(tour);
});

const getTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find().sort({ createdAt: -1 });
  res.json(tours);
});

const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (tour) res.json(tour);
  else {
    res.status(404);
    throw new Error("Tour not found");
  }
});

const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }
  Object.assign(tour, req.body);
  if (req.files && req.files.length)
    tour.images = req.files.map((f) => ({
      url: f.path,
      public_id: f.filename || f.public_id,
    }));

    const updatedTour = await tour.save();
    res.json(updatedTour);
});

const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }
  await tour.remove();
  res.json({ message: "Tour removed" });
});

module.exports = { createTour, getTours, getTourById, updateTour, deleteTour };
