import request from '@/utils/request'

// 获取楼盘列表
export function getBuildingList(params) {
  return request({
    url: '/api/rental/building',
    method: 'get',
    params
  })
}

// 获取楼盘详情
export function getBuilding(id) {
  return request({
    url: `/api/rental/building/${id}`,
    method: 'get'
  })
}

// 创建楼盘
export function createBuilding(data) {
  return request({
    url: '/api/rental/building',
    method: 'post',
    data
  })
}

// 更新楼盘
export function updateBuilding(id, data) {
  return request({
    url: `/api/rental/building/${id}`,
    method: 'put',
    data
  })
}

// 删除楼盘
export function deleteBuilding(id) {
  return request({
    url: `/api/rental/building/${id}`,
    method: 'delete'
  })
}
