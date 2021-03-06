const axios = require("axios");
const { URL } = require("../constants");
const getToken = require("./functions/getToken");

let token;
let createdOrgId;

beforeAll(async () => {
  token = await getToken();
});

describe("organization resolvers", () => {
  test("allOrganizations", async () => {
    let response = await axios.post(URL, {
      query: `{
                organizations {
                    _id
                    name
                }
            }
            `,
    });
    let { data } = response;
    expect(Array.isArray(data.data.organizations)).toBeTruthy();
  });

  test("createOrganization", async () => {
    let createdOrgResponse = await axios.post(
      URL,
      {
        query: `
            mutation {
                createOrganization(data: {
                    name:"test org"
                    description:"test description"
                    isPublic: true
                    visibleInSearch: true
                    }) {
                        _id
                    }
            }
              `,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let { data } = createdOrgResponse;
    createdOrgId = createdOrgResponse.data.data.createOrganization._id;
    //console.log(createdOrgId);
    expect(data.data.createOrganization).toEqual(
      expect.objectContaining({
        _id: expect.any(String)
      })
    );
  });

  // console.log(createdOrgId)

  test("updateOrganization", async () => {
    let updateOrgRes = await axios.post(
      URL,
      {
        query: `
            mutation {
                updateOrganization(id: "${createdOrgId}", data: {
                    description: "new description",
                    isPublic: false
                    }) {
                        _id
                        description
                        isPublic
                    }
            }
              `,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let{ data } = updateOrgRes;

    expect(data).toMatchObject({
      data: {
        updateOrganization: {
          _id: `${createdOrgId}`,
          description: "new description",
          isPublic: false,
        },
      },
    });
  });

  test("removeOrganization", async () => {
    

    const deletedResponse = await axios.post(
      URL,
      {
        query: `
            mutation {
                removeOrganization(id: "${createdOrgId}") {
                    _id
                }
            }
            `,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    expect(deletedResponse.data.data.removeOrganization).toEqual(
			expect.objectContaining({
				_id: expect.any(String)
			})
		);


  });
});

module.exports.token = token;
