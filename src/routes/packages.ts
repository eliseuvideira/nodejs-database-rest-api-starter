import { body, params } from "@ev-fns/validation";
import { Router } from "express";
import {
  packagesDeleteOne,
  packagesGetMany,
  packagesGetOne,
  packagesPatchOne,
  packagesPostOne,
} from "../endpoints/packages";
import { auth } from "../middlewares/auth";
import {
  packagesGetOneParams,
  packagesPatchOneBody,
  packagesPostOneBody,
} from "../validations/packages";

const router = Router();

/**
 * GET /packages
 * @tag Packages
 * @security BearerAuth
 * @response 200
 * @responseContent {Package[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/packages", auth, packagesGetMany);

/**
 * POST /packages
 * @tag Packages
 * @security BearerAuth
 * @bodyContent {PackagePostRequestBody} application/json
 * @response 201
 * @responseContent {Package} 201.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/packages", auth, body(packagesPostOneBody), packagesPostOne);

/**
 * GET /packages/{name}
 * @tag Packages
 * @security BearerAuth
 * @pathParam {string} name
 * @response 200
 * @responseContent {Package} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get(
  "/packages/:name",
  auth,
  params(packagesGetOneParams),
  packagesGetOne,
);

/**
 * PATCH /packages/{name}
 * @tag Packages
 * @security BearerAuth
 * @pathParam {string} name
 * @bodyContent {PackagePatchRequestBody} application/json
 * @response 200
 * @responseContent {Package} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.patch(
  "/packages/:name",
  auth,
  params(packagesGetOneParams),
  body(packagesPatchOneBody),
  packagesPatchOne,
);

/**
 * DELETE /packages/{name}
 * @tag Packages
 * @security BearerAuth
 * @pathParam {string} name
 * @response 204
 * @response default
 * @responseContent {Error} default.application/json
 */
router.delete(
  "/packages/:name",
  auth,
  params(packagesGetOneParams),
  packagesDeleteOne,
);

export default router;
