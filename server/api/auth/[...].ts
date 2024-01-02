import GoogleProvider from '@auth/core/providers/google';
import type { AuthConfig } from '@auth/core/types';
import { NuxtAuthHandler } from '#auth';

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    GoogleProvider({
      clientId: runtimeConfig.google.clientId,
      clientSecret: runtimeConfig.google.clientSecret,
    }),
  ],
};

export default NuxtAuthHandler(authOptions, runtimeConfig);