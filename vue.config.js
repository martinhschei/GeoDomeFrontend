module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:6000',
				changeOrigin: true,
			}
		}
	}
}