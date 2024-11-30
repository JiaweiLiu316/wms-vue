import request from "../utils/request";

// 列表分页数据
export function deliveryPageList(params) {
  return request({
    url: "/delivery/pageList",
    method: "get",
    params: params
  });
}

// 详情接口
export function getDelivery(query) {
  return request({
    url: "/delivery/" + query,
    method: "get",
  });
}

// 详情接口
export function deliveryList() {
  return request({
    url: "/delivery/list" ,
    method: "get",
  });
}



// 编辑接口
export function editDelivery(data) {
  return request({
    url: "/delivery/updateDelivery",
    method: "put",
    data,
  });
}
