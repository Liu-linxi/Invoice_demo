module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
  	//xlsx-style不生效替换代码
  	config.externals({
  		"./cptable": "var cptable"
  	}); 
  },
  publicPath: './',
  assetsDir: 'static',
  parallel: false,
}