import env from './src/env.js';
// import {ghkv_get, ghkv_set, ghkv_delete} from './src/ghkv.js';
import ghkv_set from './src/ghkv/set.js';
import ghkv_get from './src/ghkv/get.js';
import res from './src/res.js';
// import _ from 'lodash';

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const urlStr = request.url;
    const urlObj = new URL(urlStr);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
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
    return new Response(JSON.stringify({
        main: _GITHUB_MAIN_REPO,
        mainbranch: _GITHUB_MAIN_BRANCH,
        sub: _GITHUB_SUB_REPO,
        subbranch: _GITHUB_SUB_BRANCH,
        config: _GITHUB_CONFIG_NAME,
    }));
}
