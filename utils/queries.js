const axios = require("axios");

async function getTodayPage({ queryKey, pageParam }) {
  const dbId = queryKey[1];

  try {
    const getTodayPage = await axios.get(
      `/api/notion?action=getToday&dbId=${dbId}`
    );

    return getTodayPage.data.payload;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getTodayPage,
};
