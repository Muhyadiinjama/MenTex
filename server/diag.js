import "dotenv/config";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI?.substring(0, 20) + "...");
