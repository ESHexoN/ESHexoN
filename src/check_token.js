import ghkv_get from "./ghkv/get";
import md5 from 'md5';
export default async function check_token(ghkv_config, rqToken) {
    var userdata = await ghkv_get(ghkv_config, "user");
    var token = md5(userdata[0].username + userdata[0].password + `${new Date(Date.now()).getFullYear()}${new Date(Date.now()).getMonth()+1}`);
    if (token == rqToken) {
        return true;
    } else {
        return false;
    }
}