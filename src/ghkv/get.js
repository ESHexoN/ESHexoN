export default async function ghkv_get(__config, key) {
    var __username = __config["username"];
    var __repo = __config["repo"];
    var __token = __config["token"];
    var __filename = __config["filename"];
    var __branch = __config["branch"];
    // 检查传入的信息是否完整
    if (!__token || !__filename || !__branch || !__username) {
        console.error(
            "[Error] Please Check the Config. (token/filename/branch/username)"
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
    let shaValue = await shavl.json();
    // console.log(shaValue);
    shaValue = shaValue[0].sha;
    // 拼接为获取文件的链接
    let url = encodeURI(
        `https://raw.githubusercontent.com/${__username}/${
            __repo
        }/${shaValue}${__filename}?dt=${Math.floor(
            Math.random() * 100000000
        )}`
    );
    console.log(url);
    let value = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${__token}`,
        },
    });
    // 对 JSON 文件进行处理
    let dtb = await value.text();
    console.log(dtb);
    dtb = JSON.parse(dtb);
    if (key == true) {
        return dtb;
    } else {
        return dtb[key];
    }
};