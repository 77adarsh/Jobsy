// controllers/cvController.js

import fs from 'fs';
import User from '../models/User.js';

export const uploadCV = async (req, res) => {
  try {
    const { userId } = req.body;

    if (req.user.id !== userId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { filename, mimetype, size, path: filePath } = req.file;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        cv: {
          fileName: filename,
          fileUrl: filePath,
          uploadDate: Date.now(),
          fileSize: size,
          fileType: mimetype
        }
      },
      { new: true, select: '-password -isTemporaryPassword' }
    );

    if (!updatedUser) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        fileName: filename,
        fileSize: size,
        fileType: mimetype,
        uploadDate: updatedUser.cv.uploadDate
      }
    });
  } catch (error) {
    console.error('CV upload error:', error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ success: false, message: 'Failed to upload CV', error: error.message });
  }
};

export const getCVInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.cv || !user.cv.fileName) {
      return res.status(404).json({ success: false, message: 'No CV found for this user' });
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: user.cv.fileName,
        fileSize: user.cv.fileSize,
        fileType: user.cv.fileType,
        uploadDate: user.cv.uploadDate
      }
    });
  } catch (error) {
    console.error('Error fetching CV info:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch CV info', error: error.message });
  }
};

export const deleteCV = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.cv || !user.cv.fileName) {
      return res.status(404).json({ success: false, message: 'No CV found' });
    }

    try {
      fs.unlinkSync(user.cv.fileUrl);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    user.cv = {
      fileName: null,
      fileUrl: null,
      uploadDate: null,
      fileSize: null,
      fileType: null
    };

    await user.save();

    res.status(200).json({ success: true, message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ success: false, message: 'Failed to delete CV', error: error.message });
  }
};