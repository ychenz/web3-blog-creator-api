const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post("/createSite", (request, response) => {
    const { name, themeColor, creatorAddress } = request.body;
    console.log("Site Name:", name);
    console.log("Site color:", themeColor);
    console.log("creatorAddress:", creatorAddress);
    response.send({ success: "true" });
});
