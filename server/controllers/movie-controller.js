
const Movie = require('../models/movie-model');

const createMovie = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({ success: false, error: 'Must provide movie' });
    }
    console.log('body', body)
    const movie = new Movie(body);

    if (!movie) {
        return res.status(400).json({ success: false, error: 'Couldn\'t create movie' });
    }

    movie
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: movie._id,
                message: 'Movie created'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Movie not created!',
            })
        });
};

const updateMovie = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Movie
        .findOne({ _id: req.params.id }, (err, movie) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Movie not found!',
                });
            }

            movie.name = body.name;
            movie.time = body.time
            movie.rating = body.rating
            movie
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: movie._id,
                        message: 'Movie updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Movie not updated!',
                    })
                });
        })
};

const deleteMovie = async (req, res) => {
    await Movie.findOneAndDelete({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!movie) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` });
        }

        return res.status(200).json({ success: true, data: movie });
    }).catch(err => console.log(err));
};

const getMovieById = async (req, res) => {
    await Movie.findOne({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!movie) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` });
        }
        return res.status(200).json({ success: true, data: movie });
    }).catch(err => console.log(err));
};

const getMovies = (req, res) => {
    return Movie.find({}, (err, movies) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!movies.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` });
        }
        return res.status(200).json({ success: true, data: movies });
    }).catch(err => console.log(err));
};

module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovies,
    getMovieById,
};