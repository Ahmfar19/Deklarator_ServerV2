
const path = require('path');
const fs = require('fs');


const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

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

module.exports = {
    uploadFile,
    deleteFile,
    getFile
};