// 这个模块获取品牌管理的数据
import request from '@/utils/request'
// 获取品牌列表的接口
// admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

// 添加品牌
// 新增品牌：/admin/product/baseTrademark/save post 品牌名称、品牌LOGO
// 对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

// 修改品牌
// /admin/product/baseTrademark/update put ID
// 对于修改某一个品牌的操作，前端携带的参数需要带上Id，告诉服务器要修改哪一个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        // tradeMark带有id，是修改操作
        return request({ url: "/admin/product/baseTrademark/update", method: 'put', data: tradeMark })
    } else {
        return request({ url: "/admin/product/baseTrademark/save", method: 'post', data: tradeMark })
    }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id} delete id
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
