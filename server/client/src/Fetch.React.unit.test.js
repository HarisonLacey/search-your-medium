// Make sure fecthing Itunes API works

require("es6-promise").polyfill();
require("isomorphic-fetch");

const term = "Metallica";
const media = "music";

test("Artist name should be Metallica", () => {
  return fetch(
    `https://itunes.apple.com/search?term=${term}&media=${media}&limit=50`
  )
    .then((result) => result.json())
    .then((result) => result.results[0].artistName)
    .then((result) => {
      expect(result).toBe("Metallica");
    });
});
