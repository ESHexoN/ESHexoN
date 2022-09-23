import list_dir from './list_dir.js';

export default async function get_posts_list(config) {
    // API URL: https://api.github.com/repos/[user]/[repo]/contents/
    // 存放文章的目录 为了与其他系统兼容 这里暂时预留个位置
    var posts_dir = "source/_posts/"
    return JSON.stringify(await list_dir(config, posts_dir));
}

