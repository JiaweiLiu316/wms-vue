import request from "../utils/request";

export function getProductIdAndNameList() {
  return request({
    url: "/product/productIdAndNameList",
    method: "get",
  });
}

export function getProductList(params) {
  return request({
    url: "/product/pageList",
    method: "get",
    params: params
  });
}

export function addProduct(data) {
  return request({
    url: "/product/add",
    method: "post",
    data,
  });
}

export function getProduct(query) {
  return request({
    url: "/product/" + query,
    method: "get",
  });
}

export function delProduct(query) {
  return request({
    url: "/product/delete/" + query,
    method: "delete",
  });
}

export function editProduct(data) {
  return request({
    url: "/product/update",
    method: "put",
    data,
  });
}
