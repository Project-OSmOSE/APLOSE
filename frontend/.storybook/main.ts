import type { StorybookConfig } from '@storybook/tanstack-react/dist';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  framework: "@storybook/tanstack-react",
  // core: {
  //   builder: {
  //     options: {
  //       viteConfigPath: '../vite.storybook.config.ts',
  //     }
  //   }
  // }
};
export default config;