import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import path from "node:path";
import url from "node:url";
import json from '@rollup/plugin-json';
const isWatching = !!process.env.ROLLUP_WATCH;
const flexPlugin = "com.eniac.test.plugin";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: "src/plugin.js",
	output: {
		file: `${flexPlugin}/backend/plugin.js`,
		sourcemap: isWatching,
		sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
			return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath)).href;
		}
	},
	plugins: [
		json(),
		{
			name: "watch-externals",
			buildStart: function () {
				this.addWatchFile(`${flexPlugin}/manifest.json`);
			},
		},
		nodeResolve({
			browser: false,
			exportConditions: ["node"],
			preferBuiltins: true
		}),
		commonjs(),
		!isWatching && terser(),
		{
			name: "emit-module-package-file",
			generateBundle() {
				this.emitFile({ fileName: "package.json", source: `{ "type": "module" }`, type: "asset" });
			}
		}
	]
};

export default config;
