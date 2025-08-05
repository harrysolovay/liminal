export default {
  fetch: (_request: Request): Promise<Response> => {
    return Promise.resolve(Response.json({}))
  },
}
