const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage();
const bucketName = 'guardian-sphere-frontend-bucket'; // Update this to your bucket name

// Serve the main index.html
exports.serveIndexHtml = (req, res) => {
  const file = storage.bucket(bucketName).file('index.html');

  try {
    res.setHeader('Content-Type', 'text/html'); // Set content type
    file.createReadStream()
      .on('error', (error) => {
        console.error('Error streaming index.html:', error.message);
        res.status(500).send('Error fetching index.html');
      })
      .pipe(res); // Stream index.html to the response
  } catch (error) {
    console.error('Error fetching index.html:', error.message);
    res.status(500).send('Error fetching index.html');
  }
};

// Serve static files (CSS, JS, images, etc.)
exports.serveStaticFile = (req, res) => {
  const filePath = req.path.replace(/^\//, ''); // Remove leading slash from the path
  const file = storage.bucket(bucketName).file(filePath);

  try {
    file.getMetadata()
      .then(([metadata]) => {
        // Set the appropriate content type
        res.setHeader('Content-Type', metadata.contentType);

        // Stream the file
        file.createReadStream()
          .on('error', (error) => {
            console.error(`Error streaming file ${filePath}:`, error.message);
            res.status(404).send('File not found');
          })
          .pipe(res);
      })
      .catch((error) => {
        console.error(`Error fetching metadata for ${filePath}:`, error.message);
        res.status(404).send('File not found');
      });
  } catch (error) {
    console.error(`Error fetching file ${filePath}:`, error.message);
    res.status(500).send('Error fetching file');
  }
};
