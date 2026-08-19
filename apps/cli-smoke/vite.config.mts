/// <reference types="vitest" />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	root: __dirname,
	plugins: [nxViteTsPaths()],
	test: {
		globals: true,
		// Emit the default summary so CI logs show the test counts; a terse reporter previously let
		// a project's specs go silently undiscovered.
		reporters: ['default'],
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		// Stands up a local npm registry and publishes the spartan packages before the matrix runs.
		globalSetup: ['src/support/global-setup.ts'],
		// Each matrix cell scaffolds a workspace, installs dependencies and runs a real build, so the
		// suite is slow and must not run in parallel (a single local registry is shared).
		testTimeout: 900_000,
		hookTimeout: 900_000,
		// Each smoke cell blocks the event loop for well over 60s doing synchronous npm
		// install/build work. Vitest 3's worker RPC channel has a hardcoded 60s timeout
		// (unrelated to testTimeout/hookTimeout above) that isn't currently configurable
		// (vitest-dev/vitest#6511, #8164). That timeout surfaces as a false-positive
		// "Unhandled Error" / non-zero exit even when every test passed, so we ignore it
		// here rather than let a known Vitest bug fail otherwise-green CI runs.
		dangerouslyIgnoreUnhandledErrors: true,
		fileParallelism: false,
		pool: 'forks',
		poolOptions: {
			forks: { singleFork: true },
		},
	},
	cacheDir: '../../node_modules/.vitest/cli-smoke',
});
