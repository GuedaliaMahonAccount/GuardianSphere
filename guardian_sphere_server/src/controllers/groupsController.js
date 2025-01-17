const User = require('../models/user');
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
  const { language, secter } = req.query; // Get language and secter from query params

  console.log(`Fetching messages for group: ${group}, language: ${language}, secter: ${secter}`);
  
  try {
    const groupKey = `${group}_${language}_${secter}`; // Combine group, language, and secter
    const messages = await Message.find({ group: groupKey })
      .sort({ timestamp: -1 })
      .limit(20);
    
    console.log(`Found ${messages.length} messages for group: ${groupKey}`);
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  const { group, sender, content, photo, userId, language, secter } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required to create a message.' });
  }

  const groupKey = `${group}_${language}_${secter}`; // Combine group, language, and secter
  
  console.log('Creating message for group:', groupKey);

  try {
    const message = new Message({ group: groupKey, sender, userId, content, photo });
    await message.save();
    
    // Clean old messages for the group
    await cleanOldMessages(groupKey);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message', error });
  }
};

// Report a message
exports.reportMessage = async (req, res) => {
  const { userId } = req.body; // User ID of the reported user
  const reporterId = req.userId; // ID of the user reporting the message

  try {
    // Ensure the user exists
    const reportedUser = await User.findById(userId);
    if (!reportedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the reported user's signal count
    reportedUser.signaledcount += 1;

    // Check if the user should be banned
    if (reportedUser.signaledcount >= 3) {
      reportedUser.banned = true;
      console.log(`User ${reportedUser.realName} has been banned due to reports.`);
    }

    // Save the updated user
    await reportedUser.save();

    res.status(200).json({ 
      message: `User ${reportedUser.realName} has been reported. Current reports: ${reportedUser.signaledcount}`,
      banned: reportedUser.banned,
    });
  } catch (error) {
    console.error('Error reporting user:', error);
    res.status(500).json({ message: 'Failed to report user', error });
  }
};