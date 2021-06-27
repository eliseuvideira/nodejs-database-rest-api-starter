import { Router } from "express";
import { packagesPostOne } from "../endpoints/packages";

const router = Router();

/**
 * POST /packages
 * @tag Packages
 * @bodyContent {PackagePostRequestBody} application/json
 * @response 201
 * @responseContent {Package} 201.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/packages", packagesPostOne);

export default router;
