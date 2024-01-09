import { Amplify, type ResourcesConfig } from 'aws-amplify';

const awsConfig: ResourcesConfig = {};

export default defineNuxtPlugin({
  setup() {
    // This configures Amplify on the client side of your Nuxt app
    Amplify.configure(awsConfig, { ssr: true });

    return { provide: {} };
  },
});