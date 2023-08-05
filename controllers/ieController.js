const gatherVideoData = (req, res) => {
  // Retrieve links from user

  const { vid1, vid2, vid3, vid4 } = req.body;

  const videos = [vid1, vid2, vid3, vid4];
  const videoObjs = [];

  console.log(vid1, vid2, vid3, vid4);

  // loop through videos and make video objects and put them into videoObjs
  //for (let index = 0; index < videos.length; index++)
  //{
  //console.log()
  //}
};

module.exports = { gatherVideoData };
