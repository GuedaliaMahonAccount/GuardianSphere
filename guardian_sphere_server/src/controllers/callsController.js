const Call = require('../models/call');
const mongoose = require('mongoose');

exports.createCall = async (req, res) => {
    try {
        const newCall = new Call({
            id: req.body.id || new mongoose.Types.ObjectId().toString(),
            participants: req.body.participants || [],
        });

        if (newCall.participants.length === 0) {
            return res.status(400).json({ message: 'Cannot create a call without participants' });
        }

        await newCall.save();
        res.status(201).json(newCall);
    } catch (error) {
        console.error('Error creating call:', error);
        res.status(500).json({ message: 'Error creating call', error });
    }
};

exports.getActiveCalls = async (req, res) => {
    try {
        const activeCalls = await Call.find({ status: 'active' });
        res.status(200).json(activeCalls);
    } catch (error) {
        console.error('Error fetching calls:', error);
        res.status(500).json({ message: 'Error fetching calls', error });
    }
};

exports.removeEmptyCall = async (req, res) => {
    const { id: callId } = req.params;

    try {
        const call = await Call.findOne({ id: callId });
        if (!call) {
            return res.status(404).json({ message: 'Call not found' });
        }

        if (call.participants.length === 0) {
            await Call.deleteOne({ id: callId });
            console.log(`Call ${callId} deleted as it has no participants.`);
            return res.status(200).json({ message: 'Call deleted successfully' });
        }

        res.status(200).json({ message: 'Call still has participants' });
    } catch (error) {
        console.error('Error removing empty call:', error);
        res.status(500).json({ message: 'Error removing empty call', error });
    }
};
