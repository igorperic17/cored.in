import { ConfigService } from "@nestjs/config";
import { SecretsService } from "./SecretsService";

export const SecretsServiceFactory = {
  provide: "SecretsService",
  useFactory: (config: ConfigService) => {
    // const appName = config.get<string>("app_name");
    const secretsFilePath = config.get<string>(`secrets.file_path`);
    if (!secretsFilePath) {
      throw new Error(`Secrets file not set: ${secretsFilePath}`);
    }

    const secretsEnvPath = config.get<string>(`secrets.json_env_var`);
    if (!secretsEnvPath) {
      throw new Error(`Secrets env var name not set: ${secretsEnvPath}`);
    }

    return SecretsService.fromEnvVarJsonFile(secretsEnvPath, secretsFilePath);
  },
  inject: [ConfigService]
};
