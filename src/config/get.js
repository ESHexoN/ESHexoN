import ghkv_get from "../ghkv/get";
const wkey = ["githubUploadToken", "user"];
var i;
const get_config = async (__config, key, status) => {
    /**
     * 获取 配置文件
     */
    console.log("Get Config Status: "+status);
    if (status == true) {
        /**
         * 鉴权通过 返回所有信息
         */
        var content = await ghkv_get(__config, key);
        return content;
    } else {
        /**
         * 鉴权不通过 返回指定信息
         */
        console.log(wkey);
        for (i in wkey) {
            console.log(wkey[i]);
            if (wkey[i] == key) {
                console.log("Catch!");
                return "NEED_TOKEN";
            }
        }
        var content = await ghkv_get(__config, key);
        if (key == true) {
            for (let i = 0; i < wkey.length; i++) {
                delete content[wkey[i]];
            }
        }
        return content;
    }
}
export default get_config;