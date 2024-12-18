import request from "../utils/request";

export function getOrderPageList(params) {
  return request({
    url: "/order/getAllOrder",
    method: "get",
    params: params
  });
}

export function addOrder(data) {
  return request({
    url: "/order/add",
    method: "post",
    data,
  });
}

export function getOrder(query) {
  return request({
    url: "/order/getOrderById/" + query,
    method: "get",
  });
}

export function delOrder(query) {
  return request({
    url: "/order/delete/" + query,
    method: "delete",
  });
}

export function editOrder(data) {
  return request({
    url: "/order/updateOrder",
    method: "put",
    data,
  });
}
