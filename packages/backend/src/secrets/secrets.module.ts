import { Global, Module } from "@nestjs/common";
import { SecretsServiceFactory } from "./SecretsServiceFactory";

@Global()
@Module({
	providers: [SecretsServiceFactory],
	exports: ["SecretsService"]
})
export class SecretsModule {}
