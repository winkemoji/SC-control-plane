import request from "@/utils/request";
// C -> Create
// U -> Update
// R -> Retrival
// D -> Delete

//获取所有采集
export function collectionsR() {
  return request({
    url: "/api/collections",
    method: "get",
  });
}

//删除指定采集
export function collectionsD(collection_id) {
  return request({
    url: "/api/collections/" + collection_id,
    method: "delete",
  });
}

//启动指定采集
export function collectionsStart(collection_id) {
  return request({
    url: "/api/collections/start/" + collection_id,
    method: "post",
  });
}
//停止指定采集
export function collectionsStop(collection_id) {
  return request({
    url: "/api/collections/stop/" + collection_id,
    method: "post",
  });
}

//重启指定采集
export function collectionRestart(collection_id) {
  return request({
    url: "/api/collections/restart/" + collection_id,
    method: "post",
  });
}
