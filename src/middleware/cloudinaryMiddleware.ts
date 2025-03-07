import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = Array.isArray(req.files?.image) ? req.files.image[0] : req.files?.image;
    console.log(req);

    // Check if a file is provided in the request
    if (!file) {
      res.status(400).json({
        success: false,
        message: "No file provided",
      });
      return;
    }

    // Upload the file to Cloudinary in the 'post' folder
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "post",
    });

    // Save the Cloudinary image URL and other details to res.locals
    res.locals.uploadResult = {
      success: true,
      imageUrl: result.secure_url,
    };
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const deleteImage = async (imageUrl: string, res: Response) => {
  try {
    // Delete the image from Cloudinary
    const imageName = imageUrl.split("/").pop();
    if (!imageName) {
      throw new Error("Invalid image URL");
    }
    const modifiedImageUrl = `post/${imageName.replace(/\.\w+$/, "")}`;
    await cloudinary.uploader.destroy(modifiedImageUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

export default { deleteImage, uploadImage };
