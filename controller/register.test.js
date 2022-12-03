import { register } from "./userController";

test('register function exists', () => {
    expect(typeof register).toEqual('function');
    console.log(typeof register)
  });