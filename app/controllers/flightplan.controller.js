const db = require("../models").default;
const Flightplan = db.flightplan;
const Op = db.Sequelize.Op

// Create and Save a new flightplan
exports.create = (req, res) => {
  // Validate request 
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Flightplan             
  const flightplan = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };

  // Save Flightplan in the database    
  Flightplan.create(flightplan)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Flightplan.",
      });
    });
};

// Retrieve all Flightplans from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Flightplan.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving flightplans.",
      });
    });
};

// Find a single Flightplans with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Flightplan.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Flightplan with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Flightplan with id=" + id,
      });
    });
};

// Update a Flightplan by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Flightplan.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Flightplan was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Flightplan with id=${id}. Maybe Flightplan was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Flightplan with id=" + id,
      });
    });
};

// Delete a Flightplan with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Flightplan.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Flightplan was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Flightplan with id=${id}. Maybe Flightplan was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Flightplan with id=" + id,
      });
    });
};

// Delete all FlightplanS from the database.
exports.deleteAll = (req, res) => {
  Flightplan.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} FlightplanS were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all flightplanS.",
      });
    });
};

// Find all published FlightplanS
exports.findAllPublished = (req, res) => {
  Flightplan.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving published Flightplans.",
      });
    });
};
