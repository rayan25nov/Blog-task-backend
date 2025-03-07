import { Request, Response } from "express";
import Blog from "../model/blogModel.js";
import User from "../model/userModel.js";
import cloudinaryMiddleware from "../middleware/cloudinaryMiddleware.js";

interface UserRequest extends Request {
  user?: {
    id: string;
  };
}

const createBlog = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { title, description, createdAt } = req.body;
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const userId = req.user.id;

    await cloudinaryMiddleware.uploadImage(req, res);
    const uploadResult = res.locals.uploadResult;
    const imageUrl = uploadResult.imageUrl;

    const blog = new Blog({
      title,
      description,
      image: imageUrl,
      userId,
      createdAt,
    });
    const newBlog = await blog.save();

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    user.blogs.push(newBlog._id);
    await user.save();

    res
      .status(201)
      .json({ success: true, message: "Blog created successfully", newBlog });
    return;
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
    return;
  }
};

const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    blogs.reverse();
    res
      .status(200)
      .json({ success: true, message: "Blogs fetched successfully", blogs });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Blog fetched successfully", blog });
    return;
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
    return;
  }
};

const updateBlog = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    if (!req.user || blog.userId.toString() !== req.user.id.toString()) {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }

    const newImageFile = req.files?.image;
    if (newImageFile) {
      await cloudinaryMiddleware.deleteImage(blog.image, res);
      await cloudinaryMiddleware.uploadImage(req, res);
      req.body.image = res.locals.uploadResult.imageUrl;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      updatedBlog,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
    return;
  }
};

const deleteBlog = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    if (!req.user || blog.userId.toString() !== req.user.id.toString()) {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }
    await cloudinaryMiddleware.deleteImage(blog.image, res);
    await blog.deleteOne();
    const user = await User.findById(req.user.id);
    if (user) {
      user.blogs = user.blogs.filter(
        (blogId) => blogId.toString() !== req.params.id
      );
    }
    await user?.save();

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
    return;
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
    return;
  }
};

const getBlogsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ userId: req.params.id }).exec();
    res
      .status(200)
      .json({ success: true, message: "Blogs fetched successfully", blogs });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllBlogIdsForSpecificUser = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const blogs = await Blog.find({ userId: req.user.id });
    const blogIds = blogs.map((blog) => blog._id);
    res.status(200).json({
      success: true,
      message: "Blog IDs fetched successfully",
      blogIds,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error while fetching Blog IDs",
      error: err.message,
    });
    return;
  }
};

export {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUserId,
  getAllBlogIdsForSpecificUser,
};
