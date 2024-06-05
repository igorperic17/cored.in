import { Module } from "@nestjs/common";
import { CoredinContractService } from "../services";
import { CoredinContractServiceProvider } from "./providers";

@Module({
  imports: [],
  providers: [CoredinContractServiceProvider],
  exports: [CoredinContractService]
})
export class CoreumModule {}
