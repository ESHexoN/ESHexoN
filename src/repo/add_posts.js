import { Base64 } from 'js-base64';
export default async function add_posts(__config, filename, content, b64) {
    var posts_dir = filename;
    console.log(posts_dir)
    // if (type == "drafts") posts_dir = "source/_drafts/"+ filename;
    // else posts_dir = "source/_posts/" + filename;
    var  __username = __config["username"];
    var  __repo = __config["repo"];
    var  __token = __config["token"];
    var  __branch = __config["branch"];
    var dbsha;
    // 获取文件信息
    let fileAPI = await fetch(
        `https://api.github.com/repos/${__username}/${__repo}/contents/${posts_dir}?ref=${__branch}`,
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
    dbsha = fileJSON["sha"];
    var b64Content;
    if (b64) {
        b64Content = content;
    } else {
        b64Content = Base64.encode(content);
    }
    // 推送配置信息
    let cfg = {
        body: JSON.stringify({
            branch: __branch,
            message: "Upload by ESHexoN.",
            content: b64Content,
            sha: dbsha,
        }),
        method: "PUT",
        headers: {
            accept: "application/vnd.github.v3+json",
            "content-type": "application/json;charset=UTF-8",
            "user-agent": "ESHexoN Client",
            Authorization: "token " + __token,
        },
    };

    // 发送请求
    let putC = await fetch(
        `https://api.github.com/repos/${__username}/${__repo}/contents/${posts_dir}?ref=${__branch}`,
        cfg
    );
    console.info(`https://api.github.com/repos/${__username}/${__repo}/contents/${posts_dir}?ref=${__branch}`);
    console.log(await putC.text());
    // 返回 状态值
    if (putC["status"] == 200 || putC["status"] == 201) {
        return true;
    } else {
        console.log(putC["status"]);
        return false;
    }
};