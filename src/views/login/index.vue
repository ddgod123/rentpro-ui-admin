<template>
  <div class="login-container">
    <a-form 
      :form="form" 
      class="login-form" 
      @submit="handleLogin"
    >
      <div class="title-container">
        <h3 class="title">RentPro Admin</h3>
        <p class="sub-title">租赁管理系统</p>
      </div>

      <a-form-item>
        <a-input
          v-decorator="[
            'username',
            { rules: [{ required: true, message: '请输入用户名!' }] }
          ]"
          size="large"
          placeholder="用户名"
          prefix-icon="user"
        >
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码!' }] }
          ]"
          size="large"
          placeholder="密码"
          prefix-icon="lock"
        >
          <a-icon slot="prefix" type="lock" />
        </a-input-password>
      </a-form-item>

      <a-button
        :loading="loading"
        size="large"
        type="primary"
        html-type="submit"
        class="login-button"
      >
        登录
      </a-button>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    
    handleLogin(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.login(values)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);

    .title-container {
      text-align: center;
      margin-bottom: 30px;

      .title {
        color: #2d3748;
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }

      .sub-title {
        color: #718096;
        margin: 5px 0 0 0;
        font-size: 14px;
      }
    }

    .login-button {
      width: 100%;
      margin-top: 10px;
    }

    /deep/ .ant-input-affix-wrapper {
      border-radius: 6px;
    }

    /deep/ .ant-btn {
      border-radius: 6px;
      height: 40px;
    }
  }
}
</style>