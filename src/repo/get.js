export default async function get_posts_list(config) {
    // API URL: https://api.github.com/repos/[user]/[repo]/contents/
    // 存放文章的目录 为了与其他系统兼容 这里暂时预留个位置
    var posts_dir = "source/_posts/"
    // var rootBaseUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${posts_dir}?ref=${config.branch}`;
    // let rootDir = await fetch(rootBaseUrl, {
    //     headers: {
    //         Accept: "application/vnd.github.v3.raw",
    //         Authorization: `token ${config.token}`,
    //         "User-Agent": "ghKV Clinet",
    //     },
    // }).then(res => res.json());
    return JSON.stringify(await list_dir(config, posts_dir));
}

async function list_dir(config, dirname) {
    var BaseUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${dirname}?ref=${config.branch}`;
    let DirList = await fetch(BaseUrl, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${config.token}`,
            "User-Agent": "ghKV Clinet",
        },
    }).then(res => res.json());
    var filelist = {
        "/": [],
    };
    console.log("Start..");
    console.info(DirList);
    console.info(BaseUrl);
    for (let i = 0; i < DirList.length; i++) {
        if (DirList[i].type == "dir") {
            console.log("Dir: "+DirList[i].name);
            // 是目录 需要继续遍历 (dirname: DirList[i].name+"/")
            var dir_lst = await list_dir(config, dirname+DirList[i].name+"/");
            console.info(dir_lst);
            filelist[DirList[i].name+"/"] = dir_lst["/"];
        } else {
            console.log("File: "+DirList[i].name);
            // 是文件 加入列表中
            var fileinfo = {
                filename: DirList[i].name,
                filepath: DirList[i].path,
            }
            filelist["/"].push(fileinfo);
        }
    }
    return filelist;
}