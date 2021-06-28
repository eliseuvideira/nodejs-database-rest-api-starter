import Joi from "joi";

export const packagesPostOneBody = Joi.object()
  .keys({
    name: Joi.string().required(),
    version: Joi.string().required(),
    description: Joi.string().required(),
    license: Joi.string().required(),
    repository: Joi.string().required(),
    homepage: Joi.string().required(),
    node_version: Joi.string(),
    downloads: Joi.number().integer().min(0).required(),
  })
  .required();

export const packagesGetOneParams = Joi.object()
  .keys({
    name: Joi.string().required(),
  })
  .required();

export const packagesPatchOneBody = Joi.object()
  .keys({
    name: Joi.string(),
    version: Joi.string(),
    description: Joi.string(),
    license: Joi.string(),
    repository: Joi.string(),
    homepage: Joi.string(),
    node_version: Joi.string(),
    downloads: Joi.number().integer().min(0),
  })
  .required();
