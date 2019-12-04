<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style>
body .el-cascader-menu {
  min-width: 100px!important;
}
body .el-cascader-node {
  padding-left: 10px!important;
}
body .el-message {
  min-width: 280px!important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.center {
  text-align: center;
}
.left {
  text-align: left;
}
.right {
  text-align: right;
}
.font14 {
  font-size: 14px;
}
</style>
