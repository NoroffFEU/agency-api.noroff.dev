export default {
  title: "Test API",
  swagger: "2.0",
  info: {
    title: "API for Agency",
  },
  description: "Test",
  version: "1.0.0",
  basePath: "localhost:PORT/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "agency-listings",
      description: "Agency listing endpoints",
    },
  ],
  paths: {
    "/listings": {
      get: {
        tags: ["agency"],
      },
      post: {
        tags: ["agency"],
      },
    },
    "/listings/id": {
      get: {
        tags: ["agency"],
      },
      put: {
        tags: ["agency"],
      },
      delete: {
        tags: ["agency"],
      },
    },
  },
};
