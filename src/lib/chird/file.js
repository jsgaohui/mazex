export default {
  getFileByPath() {
    return Helper.requireAll(require.context(`../views`, true, /\.vue$/))
  },
}
