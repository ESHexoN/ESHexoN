export default function env(key) {
	var value;
	switch (key) {
		case "GITHUB_TOKEN":
			try {
				value = Deno.env.get(key);
			} catch (e) {
				value = GITHUB_TOKEN;
			}
			break;
		default:
			value = Deno.env.get(key);
			break;
	}
	return value;
}
