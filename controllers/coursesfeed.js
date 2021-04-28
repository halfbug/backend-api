const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');

// @desc      Retrun courses from udemy
// @route     GET /api/v1/coursesfeed
// @access    Private
exports.getCourses = asyncHandler(async (req, res, next) => {
  // Copy req.query
  // const reqQuery = { ...req.query };
  var config = {
    method: 'get',
    url: `${process.env.UDEMY_API_URL}/courses/?page=2&page_size=10&search=${req.query.search}` ,
    headers: { 
      "Accept": "application/json, text/plain, */*",
      'Authorization': process.env.UDEMY_AUTH_TOCKEN, 
      "Content-Type": "application/json;charset=utf-8"
    }
  };
  
  axios(config)
  .then(function (response) {
    // console.log(JSON.stringify(response.data));
    if(response.data.results.length > 0){
      const cdata = response.data.results.map((course)=>{
       return {
         title:course.title, 
         link: `https://www.udemy.com${course.url}`,
         detail : course.headline,
         image : course.image_240x135,
         auther : course.visible_instructors
      }
      
      });
      res.status(200).json({
        success: true,
        data: cdata
      });

    }
    else
    return next(new ErrorResponse({
      success: false,
      message: "no course found"
    }, 500));
    
  })
  .catch(function (error) {
    console.log(error);
  });
});


