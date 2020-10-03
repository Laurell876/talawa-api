const axios = require("axios");
const { URL } = require("../constants");
const getToken = require("./functions/getToken");
const shortid = require("shortid");
const getUserId = require("./functions/getUserId");

let token;
let loggedInUserId;

beforeAll(async () => {
  token = await getToken();
  loggedInUserId = await getUserId();
});

describe("chat resolvers", () => {
  let createdGroupChatId;
  let createdDirectChatId;
  let createdOrgId;

  test("create direct chat", async () => {
    // CREATE AN ORGANIZATION

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

    // CREATE A NEW USER
    let nameForNewUser = shortid.generate();
    let email = `${nameForNewUser}@test.com`;

    const createNewUserResponse = await axios.post(URL, {
      query: `
              mutation {
                  signUp(data: {
                  firstName:"${nameForNewUser}",
                  lastName:"${nameForNewUser}"
                  email: "${email}"
                  password:"password"
                  }) {
                  user{
                    _id
                  }
                  accessToken
                  }
              }
              `,
    });
    const signUpData = createNewUserResponse.data;
    newUserToken = signUpData.data.signUp.accessToken;
    newUserId = signUpData.data.signUp.user._id;

    // CREATE DIRECT CHAT

    const createDirectChatResponse = await axios.post(
      URL,
      {
        query: `
        mutation{
            createDirectChat(data: {
              organizationId: "${createdOrgId}"
              userIds: ["${loggedInUserId}", "${newUserId}"]
            }){
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

    const createDirectChatData = createDirectChatResponse.data;
    createdDirectChatId = createDirectChatData.data.createDirectChat._id;
    expect(createDirectChatData.data.createDirectChat).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
  });

  // SEND A MESSAGE TO A DIRECT CHAT

  test("send message to direct chat", async () => {
    const sendMessageToDirectChatResponse = await axios.post(
      URL,
      {
        query: `
        mutation{
          sendMessageToDirectChat(chatId: "${createdDirectChatId}", messageContent: "this is a test message"){
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

    const sendMessageToADirectChatData = sendMessageToDirectChatResponse.data;
    expect(sendMessageToADirectChatData.data.sendMessageToDirectChat).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
  });

  // REMOVE DIRECT CHAT

  test("remove direct chat", async () => {
    const removeDirectChatResponse = await axios.post(
      URL,
      {
        query: `
    mutation{
      removeDirectChat(chatId:"${createdDirectChatId}", organizationId:"${createdOrgId}") {
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

    const removeDirectChatData = removeDirectChatResponse.data;
    expect(removeDirectChatData.data.removeDirectChat).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
  });

  // CREATE GROUP CHAT

  test("create group chat", async () => {
    const createGroupChatResponse = await axios.post(
      URL,
      {
        query: `
      mutation{
          createGroupChat(data: {
            organizationId: "${createdOrgId}"
            userIds: ["${loggedInUserId}", "${newUserId}"]
          }){
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

    const createGroupChatData = createGroupChatResponse.data;
    createdGroupChatId = createGroupChatData.data.createGroupChat._id;

    expect(createGroupChatData.data.createGroupChat).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
  });


  // SEND MESSAGE TO GROUP CHAT

  
  test("send message to group chat", async () => {


    const sendMessageToGroupChatResponse = await axios.post(
      URL,
      {
        query: `
        mutation{
          sendMessageToGroupChat(chatId: "${createdGroupChatId}", messageContent: "this is a test message"){
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

    const sendMessageToAGroupChatData = sendMessageToGroupChatResponse.data;
    expect(sendMessageToAGroupChatData.data.sendMessageToGroupChat).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );

    
  });

  // REMOVE GROUP CHAT

  test("remove group chat", async () => {
    const removeGroupChatResponse = await axios.post(
      URL,
      {
        query: `
    mutation{
      removeGroupChat(chatId:"${createdGroupChatId}") {
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

    const removeGroupChatData = removeGroupChatResponse.data;
    expect(removeGroupChatData.data.removeGroupChat).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
  });
});
