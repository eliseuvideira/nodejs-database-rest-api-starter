import { createModel } from "@ev-postgres/model";

export interface PackageProps {
  name: string;
  version: string;
  license: string;
  description: string;
  homepage: string;
  repository: string;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export const Package = createModel<PackageProps>({
  table: "packages",
  fields: [
    "name",
    "version",
    "license",
    "description",
    "homepage",
    "repository",
    "downloads",
    "created_at",
    "updated_at",
  ],
  getPrimaryKey: ({ name }) => ({ name }),
});
