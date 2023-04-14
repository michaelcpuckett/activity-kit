import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  globalSetup: './jest-setup.ts',
  transform: {
    '^.+\\.tsx?$': [
      'esbuild-jest',
      {
        isolatedModules: true,
      },
    ],
  },
};

export default jestConfig;
