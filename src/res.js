export default function res(statusCode, statusInfo, httpCode) {
    return new Response(JSON.stringify({
        statusCode: statusCode,
        statusInfo: statusInfo,
    }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        status: httpCode || 200,
    });
}