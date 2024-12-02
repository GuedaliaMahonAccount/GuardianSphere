const Message = require('../models/groups');

// Fonction utilitaire pour nettoyer les anciens messages
async function cleanOldMessages(group) {
  try {
    // Compte le nombre total de messages dans le groupe
    const count = await Message.countDocuments({ group });
    
    if (count > 20) {
      // Trouve les messages à supprimer (les plus anciens au-delà des 20 plus récents)
      const messagesToDelete = await Message.find({ group })
        .sort({ timestamp: 1 })
        .limit(count - 20);
        
      // Supprime les messages
      if (messagesToDelete.length > 0) {
        await Message.deleteMany({
          _id: { $in: messagesToDelete.map(msg => msg._id) }
        });
      }
    }
  } catch (error) {
    console.error('Error cleaning old messages:', error);
  }
}

// Fetch messages by group
exports.getMessagesByGroup = async (req, res) => {
  const { group } = req.params;
  console.log(`Fetching messages for group: ${group}`);
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
    
    // Nettoie les anciens messages après avoir sauvegardé le nouveau
    await cleanOldMessages(group);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message', error });
  }
};