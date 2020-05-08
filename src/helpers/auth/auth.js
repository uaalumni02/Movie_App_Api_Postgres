import Token from "../jwt/token";

const getToken = (req, res) => {
  try {
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = Token.decode(jwtToken).userId;
    return userId;
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

export default getToken;
