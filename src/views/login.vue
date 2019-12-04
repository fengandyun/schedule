<template>
  <div class="content">
    <header class="login-header sa-logo"></header>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="口令" prop="psd">
        <el-input v-model="ruleForm.psd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">go 排班</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src
// import { http, url } from "../libs/http";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        psd: ""
      },
      rules: {
        psd: [
          {
            validator: this.validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    validatePass(rule, value, callback) {
      if (value === "芝麻开门") {
        callback();
      } else {
        callback(new Error("提示：阿里巴巴与四十大盗"));
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.push({ path: "/home" });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.content {
  display: block;
  background-color: #2dca93;
  width: 100%;
  height: 100%;
  position: absolute;
}
.login-header.sa-logo {
  width: 100%;
  height: 18vh;
  min-height: 80px;
  background: url(../assets/logo.svg) center center no-repeat;
  background-size: auto 60%;
  margin-top: 100px;
}
.demo-ruleForm {
  width: 80%;
  margin-left: 10%;
  text-align: center;
}
.el-form-item {
  /* width: 300px; */
}
.demo-ruleForm /deep/ .el-form-item__label {
  text-align: center;
}
.demo-ruleForm /deep/ .el-form-item__content {
  margin-left: 0 !important;
}
.demo-ruleForm /deep/ .el-form-item__label {
  float: none;
  font-size: 18px;
  font-weight: 800;
}
.demo-ruleForm /deep/ .el-form-item__error {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
}
</style>

