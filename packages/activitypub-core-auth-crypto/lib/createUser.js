var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var createUser_exports = {};
__export(createUser_exports, {
  createUser: () => createUser
});
module.exports = __toCommonJS(createUser_exports);
async function createUser({
  email,
  password,
  preferredUsername
}) {
  const existingUser = await this.adapters.db.findStringIdByValue(
    "account",
    email
  );
  if (existingUser) {
    throw new Error("Account already exists.");
  }
  const salt = await this.adapters.crypto.randomBytes(16);
  const hashedPassword = await this.adapters.crypto.hashPassword(
    password,
    salt
  );
  const uid = await this.adapters.crypto.randomBytes(16);
  const token = await this.getTokenByUserId(uid);
  this.adapters.db.saveString("username", uid, preferredUsername);
  this.adapters.db.saveString("email", uid, email);
  this.adapters.db.saveString(
    "hashedPassword",
    uid,
    `${salt}:${hashedPassword}`
  );
  return { uid, token };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser
});
