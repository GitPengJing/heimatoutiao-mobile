// 配置postcss插件
module.exports = {
  plugins: {
    // 自动给css加兼容浏览器前缀
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值  元素的px/基准值 = rem
      propList: ['*'] // 需要转化为rem的文件
    }
  }
}
