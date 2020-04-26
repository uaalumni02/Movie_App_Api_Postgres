
import jwt from "jsonwebtoken";
const { JWT_KEY } = process.env;

const user = () => {
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = jwt.verify(jwtToken, JWT_KEY).userId;
}


export default user