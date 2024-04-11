import * as fs from "fs";

export class FileReadError extends Error {
	constructor(path: string) {
		super(`FileReadError: ${path}`);
	}
}

export class FileParseError extends Error {
	constructor(e: unknown) {
		super(`SecretService FileParseError: ${e}`);
	}
}

export class SecretsService {
	private readonly secrets: Map<string, string>;

	constructor(secrets: Map<string, string>) {
		this.secrets = secrets;
	}

	static fromEnvVarJsonFile(envName: string, pathToJsonFile: string): SecretsService {
		const merged = [];

		let ssFromEnv, ssFromFile: SecretsService;
		try {
			ssFromEnv = SecretsService.fromEnvVar(envName);
			merged.push(...ssFromEnv.getAll().entries());
		} catch (e) {
			console.log("SecretService.fromEnvVarJsonFile: Ignored EnvVar");
		}

		try {
			ssFromFile = SecretsService.fromJsonFile(pathToJsonFile);
			merged.push(...ssFromFile.getAll().entries());
		} catch (e) {
			console.log("SecretService.fromEnvVarJsonFile: Ignored file");
		}

		if (merged.length === 0) {
			throw new Error("No secret found");
		}
		return new SecretsService(new Map<string, string>(merged));
	}

	static fromJsonFile(pathToJsonFile: string): SecretsService {
		let fileContents;
		try {
			fileContents = JSON.parse(fs.readFileSync(pathToJsonFile).toString());
		} catch (e) {
			throw new FileReadError(pathToJsonFile);
		}

		const secrets = SecretsService.fromJsonData(fileContents);

		return new SecretsService(secrets);
	}

	static fromEnvVar(envName: string): SecretsService {
		const secrets = new Map<string, string>();
		const envValue = process.env[envName];
		if (typeof envValue !== "string") {
			throw new Error(`Given env is not defined: ${envName}`);
		}

		let jsonData: Record<string, unknown>;
		try {
			jsonData = JSON.parse(envValue);
		} catch (e) {
			throw new FileParseError(e);
		}

		return new SecretsService(SecretsService.fromJsonData(jsonData));
	}

	private static fromJsonData(content: Record<string, unknown>): Map<string, string> {
		const secrets = new Map<string, string>();
		Object.entries(content).forEach(([key, value]) => {
			if (typeof value !== "string") {
				return;
			}

			secrets.set(key, value as string);
		});

		return secrets;
	}

	get(secretName: string): string {
		const secret = this.secrets.get(secretName);
		if (secret === undefined) {
			throw new Error("Secret missing: " + secretName);
		}

		return secret;
	}

	getAll(): Map<string, string> {
		return new Map(this.secrets);
	}
}
