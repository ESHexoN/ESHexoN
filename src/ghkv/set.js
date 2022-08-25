import ghkv_get from "./get";
import { Base64 } from 'js-base64';
export default async function ghkv_set(__config, key, value, all) {
   var  __username = __config["username"];
   var  __repo = __config["repo"];
   var  __token = __config["token"];
   var  __filename = __config["filename"];
   var  __branch = __config["branch"];
    // 获取文件信息
    let fileAPI = await fetch(
        `https://api.github.com/repos/${__username}/${__repo}/contents/${__filename}?ref=${__branch}`,
        {
            method: "GET",
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "user-agent": "ghKV Client",
                Authorization: "token " + __token,
            },
        }
    );
    // 得到文件 sha 值
    let fileJSON = await fileAPI.json();
    let dbsha = fileJSON["sha"];
    // 优化性能, 直接由 get(true) 接管
    var dbContent;
    if (all == true) {
        dbContent = value;
    } else {
        dbContent = await ghkv_get(__config, true);
        dbContent[key] = value;
    }

    dbContent = JSON.stringify(dbContent);
    // 推送配置信息
    let cfg = {
        body: JSON.stringify({
            branch: __branch,
            message: "Upload Database by ghKV.",
            content: Base64.encode(dbContent),
            sha: dbsha,
        }),
        method: "PUT",
        headers: {
            accept: "application/vnd.github.v3+json",
            "content-type": "application/json;charset=UTF-8",
            "user-agent": "ghKV Client",
            Authorization: "token " + __token,
        },
    };

    // 发送请求
    let putC = await fetch(
        `https://api.github.com/repos/${__username}/${__repo}/contents${__filename}?ref=${__branch}`,
        cfg
    );
    // 返回 状态值
    if (putC["status"] == 200 || putC["status"] == 201) {
        return true;
    } else {
        return false;
    }
};