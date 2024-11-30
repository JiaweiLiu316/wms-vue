import request from "../utils/request";

// 列表分页数据
export function paymentPageList(params) {
  return request({
    url: "/paymentInfo/pageList",
    method: "get",
    params: params
  });
}

// 详情接口
export function getPaymenInfo(query) {
  return request({
    url: "/paymentInfo/" + query,
    method: "get",
  });
}


