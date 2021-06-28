import { endpoint } from "@ev-fns/endpoint";
import { HttpError } from "@ev-fns/errors";
import { Package, PackageProps } from "../models/Package";
import { database } from "../utils/database";

export const packagesGetMany = endpoint(async (req, res) => {
  const items = await Package.find({ database });

  res.status(200).json(items);
});

export const packagesPostOne = endpoint(async (req, res) => {
  let pkg: PackageProps = req.body;

  const exists = await Package.exists({
    database,
    filter: { $eq: { name: pkg.name } },
  });
  if (exists) {
    throw new HttpError(409, `package name "${pkg.name}" already exists`);
  }

  await database.transaction(async (database) => {
    pkg = await Package.insertOne({ database }, pkg);
  });

  res.status(201).json(pkg);
});

export const packagesGetOne = endpoint(async (req, res) => {
  const { name } = req.params;

  const found = await Package.findOne({ database, filter: { $eq: { name } } });

  if (!found) {
    throw new HttpError(404, "Not found");
  }

  const pkg = found;

  res.status(200).json(pkg);
});

export const packagesPatchOne = endpoint(async (req, res) => {
  const { name } = req.params;

  let pkg = await Package.findOne({ database, filter: { $eq: { name } } });

  if (!pkg) {
    throw new HttpError(404, "Not found");
  }

  const instance = pkg;

  const newPkg = req.body;

  await database.transaction(async (database) => {
    pkg = await Package.updateOne({ database, instance }, newPkg);
  });

  res.status(200).json(pkg);
});

export const packagesDeleteOne = endpoint(async (req, res) => {
  const { name } = req.params;

  const found = await Package.findOne({ database, filter: { $eq: { name } } });

  if (!found) {
    throw new HttpError(404, "Not found");
  }

  const instance = found;

  await database.transaction(async (database) => {
    await Package.deleteOne({ database, instance });
  });

  res.status(204).end();
});
