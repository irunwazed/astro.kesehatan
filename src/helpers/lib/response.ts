
type ResponseStatus = 200 | 201 | 400 | 401 | 402 | 403 | 404 | 500
export const HTTPResponse = ({
    status, message, data }: {
        status: ResponseStatus,
        message?: string,
        data?: any
    }
) => {
    return new Response(JSON.stringify({ message: message, status: status, data: data }), {
        status: status,
        headers: { 'Content-Type': 'application/json' },
    });
}