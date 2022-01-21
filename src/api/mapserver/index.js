import request from '@/utils/request'



// 查询服务详情
export function getserver(rowId) {
    return request({
      url: '/system/layer/server/' + rowId,
      method: 'get'
    })
}

// 查询服务列表
export function getServerList(query) {
    return request({
      url: 'system/layer/layerServerList' ,
      method: 'get',
      params: query
    })
}