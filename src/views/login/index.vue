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
      console.log('开始登录流程...')
      
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('表单验证通过，登录信息:', values)
          this.loading = true
          
          this.login(values)
            .then(async () => {
              this.loading = false
              console.log('登录成功，准备获取用户信息...')
              
              // 检查token是否已保存
              const token = this.$store.state.user.token
              console.log('当前token:', token)
              
              try {
                // 登录成功后，先获取用户信息
                console.log('获取用户信息...')
                await this.$store.dispatch('user/getInfo')
                
                // 生成路由
                console.log('生成路由...')
                await this.$store.dispatch('permission/generateRoutes', ['admin'])
                
                console.log('用户信息和路由准备完成，准备跳转...')
                
                // 登录成功后，手动跳转到目标页面
                const redirectPath = this.redirect || '/dashboard'
                console.log('跳转目标:', redirectPath)
                
                // 延迟跳转，确保所有数据已准备完成
                setTimeout(() => {
                  console.log('执行跳转...')
                  // 直接跳转并刷新页面，确保所有状态都是全新的
                  window.location.href = redirectPath
                }, 1500)
              } catch (error) {
                console.error('获取用户信息失败:', error)
                this.$message.error('获取用户信息失败，请重试')
              }
            })
            .catch((error) => {
              this.loading = false
              console.error('登录失败:', error)
              
              // 显示具体的错误信息
              const errorMessage = error?.message || error?.response?.data?.msg || '登录失败，请检查用户名和密码'
              this.$message.error(errorMessage)
            })
        } else {
          console.log('表单验证失败:', err)
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
  background: #f0f2f5;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
    opacity: 0.1;
    z-index: 0;
  }

  .login-form {
    width: 368px;
    padding: 48px 32px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;

    .title-container {
      text-align: center;
      margin-bottom: 40px;

      .title {
        color: #262626;
        margin: 0;
        font-size: 33px;
        font-weight: 600;
        line-height: 1.2;
      }

      .sub-title {
        color: #8c8c8c;
        margin: 12px 0 0 0;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .login-button {
      width: 100%;
      height: 40px;
      margin-top: 24px;
      font-size: 16px;
      font-weight: 500;
    }

    /deep/ .ant-form-item {
      margin-bottom: 24px;
    }

    /deep/ .ant-input-affix-wrapper {
      height: 40px;
      border-radius: 6px;
      border: 1px solid #d9d9d9;
      transition: all 0.3s;

      &:hover {
        border-color: #40a9ff;
      }

      &:focus,
      &.ant-input-affix-wrapper-focused {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }

    /deep/ .ant-input {
      height: 38px;
      font-size: 14px;
    }

    /deep/ .ant-input-password {
      height: 38px;
    }

    /deep/ .ant-btn {
      border-radius: 6px;
      height: 40px;
      font-weight: 500;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
      }
    }

    /deep/ .ant-form-item-explain {
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
</style>