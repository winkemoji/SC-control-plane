import request from "@/utils/request";
// C -> Create
// U -> Update
// R -> Retrival
// D -> Delete

//获取所有蓝图
export function blueprintsR() {
  return request({
    url: "/api/blueprints",
    method: "get",
  });
}
//获取指定蓝图
export function blueprintR(blueprint_id) {
  return request({
    url: "/api/blueprints/" + blueprint_id,
    method: "get",
  });
}
// 根据blueprint_id 删除指定蓝图
export function blueprintsD(blueprint_id) {
  return request({
    url: "/api/blueprints/" + blueprint_id,
    method: "delete",
  });
}
// 根据bluerpprint_id 更新指定蓝图
export function blueprintsU(blueprint_id, data) {
  return request({
    url: "api/blueprints/" + blueprint_id,
    method: "put",
    data,
  });
}
// 创建蓝图
export function blueprintsC(data) {
  return request({
    url: "/api/blueprints",
    method: "post",
    data,
  });
}

// 组装蓝图创建采集
export function blueprintsA(blueprint_id) {
  return request({
    url: "api/blueprints/assemble/" + blueprint_id,
    method: "post",
  });
}
