module.exports = {
     publicPath:"./",
     // Paths 设置跨域问题
     devServer: {
        proxy: {
            //名字可以自定义，这里我用的是api
            '/api/support': {
                target: 'https://www.sensorsdata.cn/api/support/',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,//这里设置是否跨域
                pathRewrite: {
                    '^/api/support': ''
                }
            }
        }
    },
}