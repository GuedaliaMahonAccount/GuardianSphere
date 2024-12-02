const Message = require('../models/groups');

// Fetch messages by group
exports.getMessagesByGroup = async (req, res) => {
  const { group } = req.params;
  console.log(`Fetching messages for group: ${group}`); // Log the group
  try {
    const messages = await Message.find({ group })
      .sort({ timestamp: -1 })
      .limit(20);
    console.log(`Found ${messages.length} messages for group: ${group}`);
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  const { group, sender, content, photo, userId } = req.body;

  console.log('Creating message:', { group, sender, content, userId });

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required to create a message.' });
  }

  try {
    const message = new Message({ group, sender, userId, content, photo });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message', error });
  }
};

