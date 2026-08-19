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
		// The matrix cells' underlying npm/nx/ng commands now run via async `spawn` (see
		// utils/workspace.ts) specifically so they no longer block this worker's event loop past
		// Vitest 3's hardcoded, non-configurable 60s worker-RPC heartbeat timeout
		// (vitest-dev/vitest#6511, #8164). Keep this as a defense-in-depth backstop: if any future
		// change reintroduces a long synchronous call, a resulting RPC-timeout "Unhandled Error"
		// still won't fail an otherwise-green run.
		dangerouslyIgnoreUnhandledErrors: true,
		fileParallelism: false,
		pool: 'forks',
		poolOptions: {
			forks: { singleFork: true },
		},
	},
	cacheDir: '../../node_modules/.vitest/cli-smoke',
});
