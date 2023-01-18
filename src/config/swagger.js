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
      name: "agency",
      description: "Agency listing endpoints",
    },
  ],
  paths: {
    "/listings": {
      get: {
        tags: ["agency"],
        summary: "API endpoint to get all listings",
        produces: ["application/json"],
        responses: {
          200: {
            name: "listing",
            description: "Get all listings",
            schema: {
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                tags: {
                  properties: [{ type: "string" }],
                },
                description: {
                  type: "string",
                },
                requirements: {
                  properties: [{ type: "string" }],
                },
                deadline: {
                  type: "string",
                },
                created: {
                  type: "string",
                },
                updated: {
                  type: "string",
                },
                authorId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["agency"],
        summary: "API endpoint to create a listings",
        produces: ["application/json"],
        responses: {
          200: {
            name: "listing",
            description: "Create a listing",
            schema: {
              properties: {
                id: {
                  type: "string",
                  description: "The listing id",
                },
                title: {
                  type: "string",
                },
                tags: {
                  properties: [{ type: "string" }],
                },
                description: {
                  type: "string",
                },
                requirements: {
                  properties: [{ type: "string" }],
                },
                deadline: {
                  type: "string",
                },
                created: {
                  type: "string",
                },
                updated: {
                  type: "string",
                },
                authorId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    "/listings/id": {
      get: {
        tags: ["agency"],
        summary: "API endpoint to get a specific listing",
        produces: ["application/json"],
        responses: {
          200: {
            name: "listing",
            description: "Get a specific listing",
            schema: {
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                tags: {
                  properties: [{ type: "string" }],
                },
                description: {
                  type: "string",
                },
                requirements: {
                  properties: [{ type: "string" }],
                },
                deadline: {
                  type: "string",
                },
                created: {
                  type: "string",
                },
                updated: {
                  type: "string",
                },
                authorId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["agency"],
        summary: "API endpoint to edit a listing",
        produces: ["application/json"],
        responses: {
          200: {
            name: "listing",
            description: "Edit a listing",
            schema: {
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                tags: {
                  properties: [{ type: "string" }],
                },
                description: {
                  type: "string",
                },
                requirements: {
                  properties: [{ type: "string" }],
                },
                deadline: {
                  type: "string",
                },
                created: {
                  type: "string",
                },
                updated: {
                  type: "string",
                },
                authorId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["agency"],
        summary: "API endpoint to delete a listing",
        produces: ["application/json"],
        responses: {
          200: {
            name: "listing",
            description: "Delete a listing",
            schema: {
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                tags: {
                  properties: [{ type: "string" }],
                },
                description: {
                  type: "string",
                },
                requirements: {
                  properties: [{ type: "string" }],
                },
                deadline: {
                  type: "string",
                },
                created: {
                  type: "string",
                },
                updated: {
                  type: "string",
                },
                authorId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
