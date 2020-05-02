import casual from "casual";

let name = casual.random_element(["Xmen", "Coming to America", "Bad Boyz"]);
let rating = casual.random_element(["R", "X", "PG", "PG-13"]);
let release = casual.random_element(["2019", "1998", "1997"]);
let directors = casual.random_element([
  "Spike Lee",
  "John Singleton",
  "Demeco Bell",
]);

casual.define("user", () => {
  return {
    username: casual.username.replace(/[^a-zA-Z]/, "").slice(0, 6),
    password: casual.password,
  };
});

casual.define("movie", () => {
  return {
    name,
    rating,
    release,
    directors,
  };
});

export default casual;
