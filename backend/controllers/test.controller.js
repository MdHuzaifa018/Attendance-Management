

const testController = (req,res)=>{
    res.status(200).json({
        success:true,
        message: "test api working",
    });
};

export default testController;