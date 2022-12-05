# ESHexoN

> 简洁、强大的 Hexo 在线编辑器。

## 使用前

1. [你需要对您的 Hexo 博客实现集成部署。](https://eshexon-docs.netlify.app/start.html#%E5%BC%80%E5%A7%8B%E5%89%8D)

> 实现集成部署后，只需要对 Git 仓库的内容进行修改，CI 就会自动完成「生成文件」等一系列操作。

2. [注册 GitHub 账号](https://github.com/signup)

3. [注册 Deno 账号](https://dash.deno.com/signin) 或 [注册 Cloudflare 账号](https://dash.cloudflare.com/sign-up)

## 部署后端

后端部署支持 Deno 与 Cloudflare Workers 两个平台。

从更新情况上看，Deno 平台支持性会更好。

- [使用 Deno 部署](https://eshexon-docs.netlify.app/deploy/deno.html)
- [使用 Cloudflare Workers 部署](https://eshexon-docs.netlify.app/deploy/cloudflare.html)

## 部署前端

ESHexoN 官方使用 Vue + Vuetify 构建了一个公共前端。

公共前端只需要填写用户名，密码和后端地址即可直接使用。

前端地址: https://eshexon.netlify.app/

我们推荐您使用公共前端，它紧随后端版本的更新，使用更加流畅。

> 当然，ESHexoN 提供了完整的 API 支持，详情[请见此处](https://eshexon-docs.netlify.app/api/)。

## 环境变量

有关部署环境变量的相关内容，[请见此处](https://eshexon-docs.netlify.app/deploy/env.html)。

## 开发进度

开发进度：[ESHexoN (Backend)](https://github.com/orgs/ESHexoN/projects/1/views/1)

