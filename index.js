import env from './src/env.js';
// import {ghkv_get, ghkv_set, ghkv_delete} from './src/ghkv.js';
import ghkv_set from './src/ghkv/set.js';
// import _ from 'lodash';

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    var github_token = env("GITHUB_TOKEN");
    return new Response();
}
