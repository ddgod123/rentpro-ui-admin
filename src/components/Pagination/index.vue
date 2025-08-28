<template>
  <div class="pagination-container">
    <a-pagination
      :current="currentPage"
      :total="total"
      :page-size="pageSize"
      :page-size-options="pageSizes"
      :show-size-changer="showSizeChanger"
      :show-quick-jumper="showQuickJumper"
      :show-total="showTotal ? total => `共 ${total} 条` : null"
      @change="handleCurrentChange"
      @showSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return ['10', '20', '30', '50']
      }
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    showQuickJumper: {
      type: Boolean,
      default: true
    },
    showTotal: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(current, size) {
      this.$emit('pagination', { page: current, limit: size })
    },
    handleCurrentChange(current, size) {
      this.$emit('pagination', { page: current, limit: size || this.limit })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  text-align: right;
  padding: 32px 16px;
}
</style>