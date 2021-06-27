import { endpoint } from "@ev-fns/endpoint";
import { HttpError } from "@ev-fns/errors";
import { Package, PackageProps } from "../models/Package";
import { database } from "../utils/database";

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
