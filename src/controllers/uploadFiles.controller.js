
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Extract data from req.body to create the folder name

        const folderName = req.body.company_id; // Assuming folderName is a key in req.body

        const uploadPath = path.join(__dirname, '../../assets/files', folderName);

        

        const directoryPath = path.join(__dirname, `../../assets/files/${folderName}/${file.originalname}`);
      
        if (fs.existsSync(directoryPath)) {
       
            const error = new Error(`File ${file.originalname} already exists in the directory.`);
            cb(error, null);

        } else {

            // Create the folder using the dynamically generated folder name
            fs.mkdir(uploadPath, { recursive: true }, (err) => {

                if (err) {

                    console.error('Error creating folder:', err);

                    cb(err, null);
                } else {
                    cb(null, uploadPath);
                }
            });
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original file name
    }
});


const uploadFiles = multer({ storage: storage });

const uploadFile = (req, res) => {
    uploadFiles.single('file')(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ error: 'Too many files uploaded' });
                }
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            res.status(200).json({ message: 'File uploaded successfully', file: req.file });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    });
};

const deleteFile = async (req, res) => {
    try {
        const { filename, company_id } = req.params;
        const filePath = path.join(__dirname, '../../assets/files', company_id, filename);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error deleting file' });
                }
                return res.status(200).json({ message: 'File deleted successfully' });
            });
        } else {
            return res.status(406).json({ error: 'File not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getFile = async (req, res) => {
    
    try {
        const { filename, company_id } = req.params;
        const filePath = path.join(__dirname, '../../assets/files', company_id, filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error downloading file' });
                }
            });
        } else {
            return res.status(406).json({ error: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

const getFiles = async (req, res) => {
    try {
        const { company_id } = req.params;
        const directoryPath = path.join(__dirname, '../../assets/files', company_id);

        // Read all files in the directory
        const files = fs.readdirSync(directoryPath);

        if (files.length === 0) {
            return res.send({
                statusCode: 406,
                ok: false,
                message: 'No files found',
            });
        }

        // Prepare file details
        const filesDetails = await Promise.all(files.map(async filename => {
            const filePath = path.join(directoryPath, filename);
            const customPath = `assets/files/${company_id}/${filename}`;
            const stats = fs.statSync(filePath);
            const fileSizeMB = stats.size / (1024 * 1024);
            return {
                filename,
                path: customPath,
                size: +fileSizeMB.toFixed(2)
            };
        }));

        // Send file details as response
        return res.send({
            statusCode: 406,
            ok: true,
            data: filesDetails
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    getFiles
};