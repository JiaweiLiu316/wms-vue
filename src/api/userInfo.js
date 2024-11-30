import request from "../utils/request";

// 列表分页数据
export function customerInfoPageList(params) {
  return request({
    url: "/customerInfo/pageList",
    method: "get",
    params: params,
  });
}

export function addCustomerInfo(data) {
  return request({
    url: "/customerInfo/add",
    method: "post",
    data,
  });
}

export function getCustomerInfo(query) {
  return request({
    url: "/customerInfo/" + query,
    method: "get",
  });
}

export function editCustomerInfo(data) {
  return request({
    url: "/customerInfo/editCustomer",
    method: "put",
    data,
  });
}
