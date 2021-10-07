module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/socket.io": {
        target: "ws://192.168.230.72:4400",
        ws: true,
        changeOrigin: true,
      },
      "sockjs-node": {
        target: "ws://192.168.230.72:4400",
        ws: false,
        changeOrigin: true,
      },
    },
  },
};
