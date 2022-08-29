import env from './src/env.js';
// import {ghkv_get, ghkv_set, ghkv_delete} from './src/ghkv.js';
import ghkv_set from './src/ghkv/set.js';
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
    return new Response(JSON.stringify({
        main: _GITHUB_MAIN_REPO,
        mainbranch: _GITHUB_MAIN_BRANCH,
        sub: _GITHUB_SUB_REPO,
        subbranch: _GITHUB_SUB_BRANCH,
        config: _GITHUB_CONFIG_NAME,
    }));
}
