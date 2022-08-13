import express, { Request, Response, Router } from "express";
import { outputData } from "../databaseManagmanet/getOutputData";

const router: Router = express.Router();

router.post("/outputData", outputData);

export default router;
