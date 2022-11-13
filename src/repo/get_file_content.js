export default async function get_file_content(__config, filename) {
    var __username = __config["username"];
    var __repo = __config["repo"];
    var __token = __config["token"];
    var __filename = filename;
    var __branch = __config["branch"];
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
    let url = encodeURI(
        `https://raw.githubusercontent.com/${__username}/${
            __repo
        }/${shaValue}/${__filename}?dt=${Math.floor(
            Math.random() * 100000000
        )}`
    );
    let value = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${__token}`,
        },
    });
    console.log(url);
    return await value.text();
}