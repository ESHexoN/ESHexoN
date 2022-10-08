import ghkv_set from "../ghkv/set";
const set_config = async (__config, key, value, all) => {
    /**
     * 获取 配置文件
     */
    var content = await ghkv_set(__config, key, value, all);
    return content;
}
export default set_config;