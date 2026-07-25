import express from 'express'
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { getBuyerInquiries, getSellerInquiries, markAsRead, sendInquiry } from '../controllers/inquiry.controller.js';

const inquiryRouter = express.Router();

inquiryRouter.post("/", protect, authorize("buyer"), sendInquiry);
inquiryRouter.get("/seller", protect, authorize("seller"), getSellerInquiries);
inquiryRouter.get("/my", protect, authorize("buyer"), getBuyerInquiries);

inquiryRouter.patch("/:id/read", protect, markAsRead);

export default inquiryRouter;