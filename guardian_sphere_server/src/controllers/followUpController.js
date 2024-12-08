const FollowUp = require('../models/follow');
const mongoose = require('mongoose');

exports.createTreatment = async (req, res) => {
  try {
    const { username, treatementData } = req.body;

    if (!username || !treatementData) {
      return res.status(400).send({ error: "Username and treatment data are required" });
    }

    let followUp = await FollowUp.findOne({ username });
    if (!followUp) {
      followUp = new FollowUp({ username, treatments: [] });
    }

    followUp.treatments.push(treatementData);
    await followUp.save();
    res.status(201).send(followUp);
  } catch (error) {
    console.error("Error in createTreatment:", error);
    res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const followUp = await FollowUp.findOne({ username });
    if (!followUp) {
      return res.status(200).json([]); // Renvoie un tableau vide si aucun traitement n'est trouvé
    }
    res.status(200).json(followUp.treatments);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTreatment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    const followUp = await FollowUp.findOne({ 'treatments._id': id });
    if (!followUp) {
      return res.status(404).send({ error: "Treatment not found" });
    }

    const treatment = followUp.treatments.id(id);
    if (name) treatment.name = name;
    if (description) treatment.description = description;
    if (date) {
      const check = treatment.checks.find(c => c.date === date);
      if (check) check.done = !check.done;
    }

    await followUp.save();
    res.status(200).send(treatment);
  } catch (error) {
    console.error("Error updating treatment:", error);
    res.status(400).send(error);
  }
};

exports.deleteTreatment = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifiez si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    // Recherchez le document contenant le traitement
    const followUp = await FollowUp.findOne({ 'treatments._id': id });
    if (!followUp) {
      return res.status(404).send({ error: "Treatment not found" });
    }

    // Supprimez le traitement en le filtrant hors du tableau
    followUp.treatments = followUp.treatments.filter(
      (treatment) => treatment._id.toString() !== id
    );

    // Sauvegardez les modifications
    await followUp.save();

    res.status(200).send({ message: "Treatment deleted successfully" });
  } catch (error) {
    console.error("Error deleting treatment:", error);
    res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
};