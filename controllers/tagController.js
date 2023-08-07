const {
  insertTag,
  linkUserWithTag,
  deleteAllUserTags,
  fetchUserTags,
  getTagIdByName,
  linkCommunityWithTag,
  deleteAllCommunityTags,
  fetchCommunityTags,
} = require("../database/tagQueries");

const getUserTags = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tags = await fetchUserTags(userId);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user tags", error });
  }
};

const postUserTags = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tagsArray = req.body.tags;

    // Delete all user tags first
    await deleteAllUserTags(userId);

    // Loop through tagsArray and insert each tag & link with user
    for (let tag of tagsArray) {
      const result = await insertTag(tag);
      let tagId;

      if (result.insertId === 0) {
        // The tag already existed. Fetch its id.
        tagId = await getTagIdByName(tag); // You will need to write this function
      } else {
        tagId = result.insertId;
      }

      await linkUserWithTag(userId, tagId);
    }

    res.status(200).json({ message: "Tags successfully updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user tags", error });
  }
};

const getCommunityTags = async (req, res) => {
  try {
    const communityId = req.params.communityId;
    const tags = await fetchCommunityTags(communityId);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch community tags", error });
  }
};

const postCommunityTags = async (req, res) => {
  try {
    console.log(req);
    const communityId = req.params.communityId;
    const tagsArray = req.body.tags;

    // Delete all community tags first
    await deleteAllCommunityTags(communityId);

    // Loop through tagsArray and insert each tag & link with community
    for (let tag of tagsArray) {
      const result = await insertTag(tag);
      let tagId;

      if (result.insertId === 0) {
        // The tag already existed. Fetch its id.
        tagId = await getTagIdByName(tag); // You will need to write this function
      } else {
        tagId = result.insertId;
      }

      await linkCommunityWithTag(communityId, tagId);
    }

    res.status(200).json({ message: "Tags successfully updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update community tags", error });
  }
};

module.exports = {
  getUserTags,
  postUserTags,
  getCommunityTags,
  postCommunityTags,
};
