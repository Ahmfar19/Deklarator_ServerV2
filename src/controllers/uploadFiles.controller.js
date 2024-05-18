const path = require('path');
const fs = require('fs');
const multer = require('multer');

// upload single File
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = req.body.company_id;
        const uploadPath = getUploadPath(folderName);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdir(uploadPath, { recursive: true }, (err) => {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, uploadPath);
                }
            });
        } else {
            cb(null, uploadPath);
        }
    },
    filename: (req, file, cb) => {
        const folderName = req.body.company_id;
        const uploadPath = getUploadPath(folderName);
        const directoryPath = path.join(uploadPath, file.originalname);

        if (fs.existsSync(directoryPath)) {
            const uniqueFilename = getUniqueFilename(file);
            cb(null, uniqueFilename);
        } else {
            cb(null, file.originalname);
        }
    },
});

function getUploadPath(folderName) {
    return path.join(__dirname, '../../assets/files', folderName);
}

const folderCounters = {};

function getUniqueFilename(file, folderName) {
    let folderCount = (folderCounters[folderName] || 0) + 1;
    folderCounters[folderName] = folderCount;
    const uniqueSuffix = folderCount;
    return file.originalname.replace(/\.[^/.]+$/, '') + '-' + uniqueSuffix + path.extname(file.originalname);
}

// upload Multi File
const storageMulti = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = req.body.company_id;
        const uploadPath = getUploadPath(folderName);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdir(uploadPath, { recursive: true }, (err) => {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, uploadPath);
                }
            });
        } else {
            cb(null, uploadPath);
        }
    },
    filename: (req, file, cb) => {
        const folderName = req.body.company_id;
        const uploadPath = getUploadPath(folderName);
        const directoryPath = path.join(uploadPath, file.originalname);

        if (fs.existsSync(directoryPath)) {
            const uniqueFilename = getUniqueFilename(file);
            cb(null, uniqueFilename);
        } else {
            cb(null, file.originalname);
        }
    },
});

const uploadSingleFile = multer({ storage: storage });
const uploadMultiFile = multer({ storage: storageMulti });

const uploadFile = (req, res) => {
    uploadSingleFile.single('file')(req, res, (err) => {
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
};

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
};

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
            return {
                filename,
                path: customPath,
                size: stats.size,
            };
        }));

        // Send file details as response
        return res.send({
            statusCode: 406,
            ok: true,
            data: filesDetails,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const uploadMultiFiles = async (req, res) => {
    try {
        uploadMultiFile.array('files')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ error: 'Error uploading files' });
            } else if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            } else {
                return res.status(200).json({ message: 'Files uploaded successfully' });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred during file upload' });
    }
};

const previewFile = async (req, res) => {
    const { company_id, filename } = req.params;
    const filePath = path.join(__dirname, '../../assets/files', company_id, filename);
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.txt') {
        res.setHeader('Content-Type', 'text/plain');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading file');
            }
            res.send(data);
        });
    } else {
        res.status(400).send('Unsupported file type');
    }
};

module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    getFiles,
    uploadMultiFiles,
    previewFile,
};
