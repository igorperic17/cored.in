import { Headers } from '@nestjs/common';

export const WALLET_HEADER = 'x-coredin-authenticated-wallet';

export const WalletParam = () => Headers(WALLET_HEADER);

export const MaxLoginDurationMs = 60 * 60 * 1000; // 1h

export const LoginMessage = 'Welcome to Coredin! Login expiration:';
