import request from '@/utils/request'
import requsetpako from '@/utils/requestpako' //带有压缩的请求
import QS from 'qs';

// 查询行政区
export function getRegoin(query) {
    return requsetpako({
        url: 'regoin/getRegoin',
        method: 'post',
        params: query
    })
}

// 获取图层管理的geogson数据
export function roleLayergeoJson(query) {
    return requsetpako({
        url: 'regoin/getRegoin/geoJson',
        method: 'get',
        params: query
    })
}

// 获取水利对象
export function listByRole(query) {
    return request({
        url: 'system/base/listByRole',
        method: 'get',
        params: query
    })
}

// 获取图层管理数据
export function roleLayerTreeselect(query) {
    return request({
        url: 'system/layer/roleLayerTreeselect',
        method: 'get',
        params: query
    })
}


// 获取水利对象的筛选条件进行界面配置
export function getSysFieldCondition(query) {
    return request({
        url: 'sysfieldcondition/getTableFieldByTrue',
        method: 'get',
        params: query
    })
}

// 获取水利对象搜索
export function selectDynamic(query) {
    return request({
        url: 'system/dynamicQuery/selectDynamic',
        method: 'post',
        data: query
    })
}

//查询要素条件筛选
export function getFeatureCondition(query) {
    return request({
        url: '/sysfieldcondition/getSysFieldCondition',
        method: 'get',
        params: query
    })
}

//查询水利对象排序条件
export function getTableFieldOrder(query) {
    return request({
        url: '/sysfieldcondition/getTableFieldOrder',
        method: 'get',
        params: query
    })
}

//清空用户最近搜索
export function deleteSearch(query) {
    return request({
        url: '/system/userSearch/deleteSearch',
        method: 'get',
        params: query
    })
}

//获取热门搜索数据
export function getpopularList(query) {
    return request({
        url: '/system/userSearch/popularList',
        method: 'get',
        params: query
    })
}

//获取最近搜索数据
export function getrecentList(query) {
    return request({
        url: '/system/userSearch/recentList',
        method: 'get',
        params: query
    })
}


//获取图例列表展示
export function getlendlist(layerId) {
    return request({
        url: '/system/picture/layerPictureTreeselect/' + layerId,
        method: 'get',
    })
}

// 查询服务列表
export function getServerList(query) {
    return request({
        url: '/system/layer/LayerAndServerList',
        method: 'get',
        params: query
    })
}

// 查询服务列表
export function getAllTableName(query) {
    return request({
        url: 'system/dynamicQuery/getAllTableName',
        method: 'post',
        data: query
    })
}


// 查询服务列表
export function getGeo(query) {
    return requsetpako({
        url: 'system/dynamicQuery/getGeo',
        method: 'get',
        params: query
    })

}

// 获取统计指标
export function selectTargetList(query) {
    return request({
        url: 'system/statisticalTarget/selectTargetListByTrue',
        method: 'get',
        params: query
    })
}
// 获取统计维度
export function getSysStatisTargete(query) {
    return request({
        url: 'system/field/getSysStatisTarget',
        method: 'get',
        params: query
    })
}
// 获取统计数据
export function postStatistic(query) {
    return request({
        url: 'system/statistic',
        method: 'post',
        data: query
    })
}
// 获取统计下拉框内容
export function getIndicator(query) {
    return request({
        url: 'system/getIndicator',
        method: 'get',
        params: query
    })
}