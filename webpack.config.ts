const Encore = require('@symfony/webpack-encore');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {WebpackManifestPlugin} = require('@symfony/webpack-encore/lib/webpack-manifest-plugin');

Encore.setOutputPath('public/').setPublicPath('/')
	.disableSingleRuntimeChunk()
	.enableSassLoader()
	.configureBabel()
	.configureBabelPresetEnv((config: any) => {
		config.useBuiltIns = 'usage';
		config.corejs = 3;
	})
	.enableTypeScriptLoader((config: any) => {
		config.configFile = 'tsconfig.frontend.json';
		return config;
	})
	.addPlugin(
		new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: [], cleanAfterEveryBuildPatterns: ['entrypoints.json']}),
	);

Encore
	// Add your style files here
	.addStyleEntry('css/build/skeleton', ['./assets/scss/skeleton.scss'])
	// Add your typescript files here
	.addEntry("js/build/skeleton", {import: ['./assets/typescript/bootstrap.ts'], library: {type: 'module'}})

const config = Encore.getWebpackConfig();
config.plugins = config.plugins.filter((it: any) => !(it instanceof WebpackManifestPlugin));
config.experiments = {outputModule: true};
module.exports = config;

