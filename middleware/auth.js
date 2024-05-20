const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    var headerToken=req.headers;
    try{
        var token=req.headers.authorization.split(" ")[1];
       // console.log(token);
       // var token=req.body.token.split(" ")[1];
        var decode= jwt.verify(token, 'F4Jr80oZV+lc001wXnhB07687vdEuudrX/K/mtQfv');
        req.userData=decode;
        next();

    }catch(error){
        res.status(401).json({
            error: "valid authorization header is required"
        });
    }
}