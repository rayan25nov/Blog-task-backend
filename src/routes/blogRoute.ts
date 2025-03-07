import express from "express";
import { requireAuth } from "../middleware/userMiddleware.js";

import {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUserId,
  getAllBlogIdsForSpecificUser,
} from "../controllers/blogController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllBlogs);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Blog Title
 *               description:
 *                 type: string
 *                 example: Blog Description
 *               createdAt:
 *                 type: string
 *                 example: 2023-10-01T00:00:00Z
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAuth, createBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog fetched successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getBlogById);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Blog Title
 *               description:
 *                 type: string
 *                 example: Updated Blog Description
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", requireAuth, updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", requireAuth, deleteBlog);

/**
 * @swagger
 * /blogs/user/{id}:
 *   get:
 *     summary: Get blogs by user ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/user/:id", getBlogsByUserId);

/**
 * @swagger
 * /blogs/user-blogs:
 *   get:
 *     summary: Get all blog IDs for the authenticated user
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog IDs fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/user-blogs", requireAuth, getAllBlogIdsForSpecificUser);

export default router;
