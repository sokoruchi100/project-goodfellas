// TagsUtil.js

import axios from "axios";

const stringToArray = (str) => str.split(" ").filter((tag) => tag !== "");

const arrayToString = (arr) => arr.join(" ");

const postTags = (userId, tags) => {
  const tagsArray = stringToArray(tags);
  return axios.post(`/tags/userTags/${userId}`, { tags: tagsArray });
};

// TagsUtil.js
const getTags = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/tags/userTags/${userId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error getting tags:", error);
        reject(error);
      });
  });
};

const postCommunityTags = (communityId, tags) => {
  const tagsArray = stringToArray(tags);
  return axios.post(`/tags/communityTags/${communityId}`, { tags: tagsArray });
};

const getCommunityTags = (communityId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/tags/communityTags/${communityId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error getting tags:", error);
        reject(error);
      });
  });
};

export {
  stringToArray,
  arrayToString,
  postTags,
  getTags,
  getCommunityTags,
  postCommunityTags,
};
