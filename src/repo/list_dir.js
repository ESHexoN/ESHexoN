export default async function list_dir(config, dirname) {
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