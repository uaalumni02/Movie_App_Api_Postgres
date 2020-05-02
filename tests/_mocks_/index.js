import casual from "casual";

// let id = casual.random_element(['2019-10-24', '2019-10-26']);

casual.define("user", () => {
  return {
    // id: casual.uuid,
    username: casual.username.replace(/[^a-zA-Z]/, "").slice(0, 6),
    password: casual.password,
  };
});


export default casual;
