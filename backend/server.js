import express from 'express';

const app = express();
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("Hello World")
});


const port = 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})