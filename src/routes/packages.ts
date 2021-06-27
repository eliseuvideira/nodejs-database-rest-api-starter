import { Router } from "express";
import { packagesPostOne } from "../endpoints/packages";

const router = Router();

/**
 * POST /packages
 * @tag packages
 * @bodyContent {packagesPostRequestBody} application/json
 * @response 201
 * @responseContent {package} 201.application/json
 * @response default
 * @responseContent {error} default.application/json
 */
router.post("/packages", packagesPostOne);

export default router;
