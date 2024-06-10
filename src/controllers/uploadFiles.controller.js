const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { sendResponse } = require('../helpers/apiResponse');
const iconv = require('iconv-lite');
// upload single File

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const connectionName = req.customerId;
        const folderName = req.body.company_id;
        const uploadPath = getUploadPath(folderName, connectionName);

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
        const connectionName = req.customerId;
        const folderName = req.body.company_id;
        const uploadPath = getUploadPath(folderName, connectionName);
        let originalName = file.originalname;

        // Decode the file name using iconv-lite
        originalName = iconv.decode(Buffer.from(originalName, 'latin1'), 'utf8');
        const directoryPath = path.join(uploadPath, originalName);
       
        if (fs.existsSync(directoryPath)) {
            const uniqueFilename = getUniqueFilename(file);
    
            cb(null, uniqueFilename);
        } else {
            cb(null, originalName);
        }
    },
});
const uploadFiles = multer({ storage: storage });

const deleteFile = async (req, res) => {
    try {
        const { company_id } = req.params;
        const connectionName = req.customerId;;
        const { filename } = req.body;
        
        const filePath = path.join(__dirname, `../../assets/${connectionName}/files`, company_id, filename);
       
         if (fs.existsSync(filePath)) {
             fs.unlink(filePath, (err) => {
                 if (err) {
                     return sendResponse(res, 500, 'Internal Server Error', null, 'Error deleting file', err);
                 }
                 return sendResponse(res, 200, 'Ok', 'File deleted successfully', null, null);
             });
         } else {
             return sendResponse(res, 404, 'Not Found', null, 'File not found', null);
         }
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, error);
    }
}

const folderCounters = {};

function getUniqueFilename(file, folderName) {
    let folderCount = (folderCounters[folderName] || 0) + 1;
    folderCounters[folderName] = folderCount;
    const uniqueSuffix = folderCount;
    return file.originalname.replace(/\.[^/.]+$/, '') + '-' + uniqueSuffix + path.extname(file.originalname);
}

function getUploadPath(folderName, connectionName) {
    return path.join(__dirname, `../../assets/${connectionName}/files/`, folderName);
}

const uploadFile = (req, res) => {
    uploadFiles.single('file')(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return sendResponse(res, 400, 'Internal Server Error', null, 'Too many files uploaded', null);
                }
                return sendResponse(res, 400, 'Internal Server Error', null, 'File upload error', null);
            } else if (err) {
                return sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
            }
            if (!req.file) {
                return sendResponse(res, 400, 'Internal Server Error', null, 'No file uploaded', null);
            }
            return res.status(200).json({
                message: 'File uploaded successfully',
                file: req.file,
                ok: true,
            });
        } catch (error) {
            sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
        }
    });
};

const getFile = async (req, res) => {
    try {
        const { filename, company_id } = req.params;
        const connectionName = req.customerId;
        const filePath = path.join(__dirname, `../../assets/${connectionName}/files`, company_id, filename);
        console.log(filePath);
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    return sendResponse(res, 500, 'Internal Server Error', null, 'Error downloading file', null);
                }
            });
        } else {
            return res.status(406).json({ error: 'File not found' });
        }
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getFiles = async (req, res) => {
    try {
        const { company_id } = req.params;
        const connectionName = req.customerId;
        const directoryPath = path.join(__dirname, `../../assets/${connectionName}/files`, company_id);
       
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
            const customPath = `assets/${connectionName}/files/${company_id}/${filename}`;
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
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const uploadMultiFiles = async (req, res) => {
    try {
        uploadFiles.array('files')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ error: 'Error uploading files' });
            } else if (err) {
                return sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
            } else {
                return sendResponse(res, 200, 'Ok', 'Files uploaded successfully', null, null);
            }
        });
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const previewFile = async (req, res) => {
    const { company_id, filename } = req.params;
    const connectionName = req.customerId;
    const filePath = path.join(__dirname, `../../assets/${connectionName}/files`, company_id, filename);
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
