const app = require("./app")

const PORT = process.env.PORT || 8000;

app.listen(8000,()=>{
    console.log(`Server is running at PORT : ${PORT}`);
    
})