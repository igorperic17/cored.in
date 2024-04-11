/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";

const YAML_CONFIG_FILENAME = join(
  "config",
  (process.env.ENV || "local") + ".yaml"
);

export default () => {
  return yaml.load(readFileSync(YAML_CONFIG_FILENAME, "utf8")) as Record<
    string,
    any
  >;
};

// export default (appName: string) => {
//   return () => {
//     return {
//       ...(yaml.load(readFileSync(YAML_CONFIG_FILENAME, "utf8")) as Record<
//         string,
//         any
//       >),
//       app_name: appName
//     };
//   };
// };
