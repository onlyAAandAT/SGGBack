import request from '@/utils/request'

// spu
// /admin/product/{page}/{limit} get 根据接口文档，可以看到实际上需要三个参数，page、limit、category3Id
// 由于在路径中没有category3Id的位置，因此使用params参数添加
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });

// 获取某一spu信息
// /admin/product/getSpuById/{spuId} get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

// 获取品牌信息
// /admin/product/baseTrademark/getTrademarkList get
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' });

// 获取spu图片
// /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

// 获取平台的全部销售属性
// /admin/product/baseSaleAttrList get
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });

// 修改或添加SPU 参数有id是修改，无id是添加
// /admin/product/updateSpuInfo post
// /admin/product/saveSpuInfo post
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
    }

}

// 删除SPU
// /admin/product/deleteSpu/{spuId} delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })