import casual from "casual";


casual.define("user", () => {
  return {
    username: casual.username.replace(/[^a-zA-Z]/, "").slice(0, 6),
    password: casual.password,
  };
});

export default casual;
