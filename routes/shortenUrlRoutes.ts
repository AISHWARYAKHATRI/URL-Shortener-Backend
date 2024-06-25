import express from "express";

const router = express.Router();

router.post("/shorten");
router.get("/:shortUrlId");

export default router;
