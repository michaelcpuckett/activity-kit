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
var authenticatePassword_exports = {};
__export(authenticatePassword_exports, {
  authenticatePassword: () => authenticatePassword
});
module.exports = __toCommonJS(authenticatePassword_exports);
async function authenticatePassword(email, password) {
  const uid = await this.adapters.db.findStringIdByValue("email", email);
  if (!uid) {
    return null;
  }
  const hashedPassword = await this.adapters.db.findStringValueById(
    "hashedPassword",
    uid
  );
  const verifyPassword = async () => {
    const [salt, storedHashedPassword] = hashedPassword.split(":");
    const derivedKey = await this.adapters.crypto.hashPassword(password, salt);
    return derivedKey === storedHashedPassword;
  };
  if (await verifyPassword()) {
    const token = await this.getTokenByUserId(uid);
    return {
      uid,
      token
    };
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticatePassword
});
