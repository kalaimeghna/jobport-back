import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder
 * @param {string} resourceType - image | raw | auto
 */
export const uploadToCloudinary = async (
  filePath,
  folder = "jobportal",
  resourceType = "auto"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });

    // Delete local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Delete local file if upload fails
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new Error(error.message);
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId
 * @param {string} resourceType - image | raw
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};