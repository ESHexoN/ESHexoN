/**
 * Cloudflare Workers GitHub KV
 * Use JSON file in GitHub repository as KV database.
 * Use GitHub API, need GitHub access token (repo*).
 * Author: YFun (@oCoke)
 */

/**
 * Get (获取)
 * @param {string} key 键
 * @returns {*} 值
 */
export async function ghkv_get(__config, key) {
    __username = __config["username"];
    __repo = __config["repo"];
    __token = __config["token"];
    __filename = __config["filename"];
    __branch = __config["branch"];
    // 检查传入的信息是否完整
    if (!__token || !__filename || !__branch) {
        console.error(
            "[Error] Please Check the Config. (token/filename/branch)"
        );
        return false;
    }
    if (!key) {
        console.error("[Error] Please Check the key.");
        return false;
    }
    // 在获取文件前先获得 Commit SHA.
    let shaurl = encodeURI(
        `https://api.github.com/repos/${__username}/${
            __repo
        }/commits?sha=${__branch}&dt=${Math.floor(
            Math.random() * 100000000
        )}`
    );
    let shavl = await fetch(shaurl, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${__token}`,
            "User-Agent": "ghKV Clinet",
        },
    });
    let shaValue = await shavl.text();
    shaValue = JSON.parse(shaValue)[0].sha;
    // 拼接为获取文件的链接
    let url = encodeURI(
        `https://raw.githubusercontent.com/${__username}/${
            __repo
        }/${shaValue}${__filename}?dt=${Math.floor(
            Math.random() * 100000000
        )}`
    );
    let value = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${__token}`,
        },
    });
    // 对 JSON 文件进行处理
    let dtb = await value.text();
    dtb = JSON.parse(dtb);
    if (key == true) {
        return dtb;
    } else {
        return dtb[key];
    }
};

/**
 * Set (修改 / 设置)
 * @param {string} key 键
 * @param {string} value 值
 * @returns {boolean} 状态
 */
export async function ghkv_set(__config, key, value, all) {
    __username = __config["username"];
    __repo = __config["repo"];
    __token = __config["token"];
    __filename = __config["filename"];
    __branch = __config["branch"];
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
        dbContent = await this.get(true);
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

/**
 * Delete (删除)
 * @param {string} key 删除的键
 * @returns {boolean} 状态
 */
export async function ghkv_delete(__config, key) {
    __username = __config["username"];
    __repo = __config["repo"];
    __token = __config["token"];
    __filename = __config["filename"];
    __branch = __config["branch"];
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
    // 获取文件 sha 值
    let fileJSON = await fileAPI.json();
    let dbsha = fileJSON["sha"];
    var dbContent = await this.get(true);
    delete dbContent[key];
    dbContent = JSON.stringify(dbContent);
    // 请求配置
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
    // 返回状态
    if (putC["status"] == 200 || putC["status"] == 201) {
        return true;
    } else {
        return false;
    }
};