// I tried to learn some unit testing with jest and vitest

const { signup, signToken, login } = require("./auth.controller");
const User = require("../models/user.models");

require("dotenv").config();

jest.mock("../models/user.models");

test("should generate a token value", async () => {
  const testUserId = "635a46586271f63e394e5968";

  const token = await signToken(testUserId);

  expect(token).toBeDefined();
});

test("should throw an error", async () => {
  const req = {
    body: {
      name: "charbel",
      email: "charbel@gmail.com",
      password: "12345",
    },
  };

  const newUser = User.findOne.mockImplementationOnce(() => ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }));

  const res = {
    status: "success",
    data: {
      user: newUser,
    },
  };

  const result = await signup(req);

  console.log(result);

  expect(result).toBeDefined();
});

it("should throw an error", async () => {
  const req = {
    body: {
      email: "charbel@gmail.com",
      password: "12345",
    },
  };

  const result = login(req);

  expect(result).toEqual(undefined);
});
