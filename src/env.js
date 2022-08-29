export default function env(key) {
	var value, value_raw;
	switch (key) {
		case "GITHUB_TOKEN":
			try {
				value = Deno.env.get(key);
			} catch (e) {
				value = GITHUB_TOKEN;
			}
			break;
		case "GITHUB_MAIN_REPO":
			try {
				value_raw = Deno.env.get(key);
				value = value_raw.split(", ");
				if (value.length == 1) value = value_raw.split(",");
			} catch (e) {
				// console.warn(e.message);
				value_raw = GITHUB_MAIN_REPO;
				value = value_raw.split(", ");
				if (value.length == 1) value = value_raw.split(",");
			}
			break;
		case "GITHUB_SUB_REPO":
			try {
				value_raw = Deno.env.get(key);
				value = value_raw.split(", ");
				if (value.length == 1) value = value_raw.split(",");
			} catch (e) {
				value_raw = GITHUB_SUB_REPO;
				value = value_raw.split(", ");
				if (value.length == 1) value = value_raw.split(",");
			}
			break;
		case "GITHUB_CONFIG_NAME":
			try {
				value = Deno.env.get(key);
			} catch (e) {
				value = GITHUB_CONFIG_NAME;
			}
			break;
		default:
			value = Deno.env.get(key);
			break;
	}
	return value;
}
