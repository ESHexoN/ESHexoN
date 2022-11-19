import env from './src/env.js';
import ghkv_set from './src/ghkv/set.js';
import ghkv_get from './src/ghkv/get.js';
import res from './src/res.js';
import md5 from 'md5';
import check_token from './src/check_token.js';
import get_posts_list from './src/repo/get_posts.js';
import get_drafts_list from './src/repo/get_drafts.js';
import add_posts from './src/repo/add_posts.js';
import delete_posts from './src/repo/delete_posts.js';
import get_config from './src/config/get.js';
import set_config from './src/config/set.js';
import get_file_content from './src/repo/get_file_content.js';
// import _ from 'lodash';

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const urlStr = request.url;
    const urlObj = new URL(urlStr);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    const timestamp = Date.now(new Date());
    // GitHub Token
    const _GITHUB_TOKEN = env("GITHUB_TOKEN");
    // GitHub 主仓库, branch
    const _GITHUB_MAIN_REPO = env("GITHUB_MAIN_REPO")[0];
    const _GITHUB_MAIN_BRANCH = env("GITHUB_MAIN_REPO")[1];
    // GitHub 配置仓库, branch
    const _GITHUB_SUB_REPO = env("GITHUB_SUB_REPO")[0];
    const _GITHUB_SUB_BRANCH = env("GITHUB_SUB_REPO")[1];
    // GitHub 配置文件名
    const _GITHUB_CONFIG_NAME = env("GITHUB_CONFIG_NAME");
    const ghkv_config = {
        username: _GITHUB_SUB_REPO.split("/")[0],
        repo: _GITHUB_SUB_REPO.split("/")[1],
        token: _GITHUB_TOKEN,
        filename: _GITHUB_CONFIG_NAME,
        branch: _GITHUB_SUB_BRANCH,
    }
    const blog_repo_config = {
        username: _GITHUB_MAIN_REPO.split("/")[0],
        repo: _GITHUB_MAIN_REPO.split("/")[1],
        token: _GITHUB_TOKEN,
        branch: _GITHUB_MAIN_BRANCH,
    }
    // console.log(ghkv_config);
    if (path.startsWith("/api/reg")) {
        /**
         * 用户注册
         */
        var userdata = await ghkv_get(ghkv_config, "user");
        if (userdata) {
            // 已有账号，目前仅允许注册一个
            return res("403", "已有注册账号，如需注册，请删除已有账号重试。");
        } else {
            // 无账号，接收注册
            var requestBody = await request.text();
            // console.log(requestBody);
            requestBody = JSON.parse(requestBody);
            if (/^[a-z0-9_-]{3,15}$/.test(requestBody.username)) {
                var setst = await ghkv_set(ghkv_config, "user", [
                    {
                        username: requestBody.username,
                        password: requestBody.password,
                    }
                ]);
                if (setst) {
                    return res("200", "注册成功。");
                } else {
                    return res("500", "注册失败。");
                }
            } else {
                return res("403", "用户名或密码不符合要求。");
            }
        }
    }

    if (path.startsWith("/api/login")) {
        /**
         * 用户登录
         */
        var requestBody = await request.text();
        requestBody = JSON.parse(requestBody);
        var userdata = await ghkv_get(ghkv_config, "user");
        if (userdata && userdata[0].username == requestBody.username && userdata[0].password == requestBody.password) {
            return res("200", md5(userdata[0].username + userdata[0].password + `${new Date(Date.now()).getFullYear()}${new Date(Date.now()).getMonth()+1}`))
        } else {
            return res("403", "用户名或密码错误。");
        }
    }

    if (path.startsWith("/api/check_token")) {
        /**
         * 检查 Token 是否有效
         */
        var requestBody = JSON.parse(await request.text()).token;
        if (await check_token(ghkv_config, requestBody) == true) {
            return res("200", "Token 有效。");
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/get_posts_list")) {
        /**
         * 获取文章列表
         */
        var requestBody = JSON.parse(await request.text()).token;
        if (await check_token(ghkv_config, requestBody) == true) {
            return res("200", await get_posts_list(blog_repo_config));
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/get_drafts_list")) {
        /**
         * 获取草稿列表
         */
        var requestBody = JSON.parse(await request.text()).token;
        if (await check_token(ghkv_config, requestBody) == true) {
            return res("200", await get_drafts_list(blog_repo_config));
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/add_posts")) {
        /**
         * 新增文章
         */
        var requestBody = JSON.parse(await request.text());
        if (await check_token(ghkv_config, requestBody.token) == true) {
            var status = await add_posts(blog_repo_config, requestBody.filename, requestBody.content, requestBody.b64);
            if (status) {
                return res("200", "上传成功。");
            } else {
                return res("500", "上传失败。");
            }
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/add_drafts")) {
        /**
         * 新增草稿
         */
        var requestBody = JSON.parse(await request.text());
        if (await check_token(ghkv_config, requestBody.token) == true) {
            var status = await add_posts(blog_repo_config, requestBody.filename, requestBody.content, requestBody.b64);
            if (status) {
                return res("200", "上传成功。");
            } else {
                return res("500", "上传失败。");
            }
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/delete_posts")) {
        /**
         * 删除文章
         */
        var requestBody = JSON.parse(await request.text());
        if (await check_token(ghkv_config, requestBody.token) == true) {
            var status = await delete_posts(blog_repo_config, requestBody.filename);
            if (status) {
                return res("200", "删除成功。");
            } else {
                return res("500", "删除失败。");
            }
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/delete_drafts")) {
        /**
         * 删除草稿
         */
        var requestBody = JSON.parse(await request.text());
        if (await check_token(ghkv_config, requestBody.token) == true) {
            var status = await delete_posts(blog_repo_config, requestBody.filename);
            if (status) {
                return res("200", "删除成功。");
            } else {
                return res("500", "删除失败。");
            }
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/edit_config")) {
        /**
         * 修改配置
         */
        var requestBody = JSON.parse(await request.text());
        if (await check_token(ghkv_config, requestBody.token) == true) {
            var status = await add_posts(blog_repo_config, requestBody.filename, requestBody.content, requestBody.b64);
            if (status) {
                return res("200", "修改成功。");
            } else {
                return res("500", "修改失败。");
            }
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/get_config")) {
        var requestBody = JSON.parse(await request.text());
        if (requestBody.token && await check_token(ghkv_config, requestBody.token) == true) {
            var rtconfig = await get_config(ghkv_config, requestBody.key, true);
            if (typeof rtconfig != "object") return res("200", rtconfig);
            else return res("200", JSON.stringify(rtconfig));
        } else {
            var rtconfig = await get_config(ghkv_config, requestBody.key, false);
            if (typeof rtconfig != "object") return res("403", rtconfig);
            else return res("403", JSON.stringify(rtconfig));
        }
    }
    if (path.startsWith("/api/set_config")) {
        var requestBody = JSON.parse(await request.text());
        if (requestBody.token && await check_token(ghkv_config, requestBody.token) == true) {
            var rtconfig = await set_config(ghkv_config, requestBody.key, requestBody.value, true);
            if (rtconfig) return res("200", "修改成功。");
            else return res("500", "修改失败。");
        } else {
            return res("403", "Token 无效。");
        }
    }
    if (path.startsWith("/api/get_file_content")) {
        var requestBody = JSON.parse(await request.text());
        if (requestBody.token && await check_token(ghkv_config, requestBody.token) == true) {
            let data = await get_file_content(blog_repo_config, requestBody.filename);
            return res("200", data);
        } else {
            return res("403", "Token 无效。");
        }
    }
    // if (path.startsWith("/api/status")) {
    //     // Status 统计文章总数和草稿总数，是鉴权接口
    //     var requestBody = JSON.parse(await request.text());
    //     if (await check_token(ghkv_config, requestBody.token) == true) {

    //     } else {
    //         return res("403", "Token 无效。");
    //     }
    // }
    return new Response(JSON.stringify({
        main: _GITHUB_MAIN_REPO,
        mainbranch: _GITHUB_MAIN_BRANCH,
        sub: _GITHUB_SUB_REPO,
        subbranch: _GITHUB_SUB_BRANCH,
        config: _GITHUB_CONFIG_NAME,
    }));
}
