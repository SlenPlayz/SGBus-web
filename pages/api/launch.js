import axios from "axios";

export default async function handler(req, res) {
  try {
    let resp = await axios.get(
      `http://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts`,
      {
        headers: {
          AccountKey: process.env.ACCKEY,
        },
      }
    );
    let data = resp.data.value;
    let message;
    let response = {};
    response.alerts = [];
    try {
      let dbDat = await axios.get(process.env.NPOINT_URL);
      if (dbDat) {
        dbDat.data.forEach((a) => {
          response.alerts.push({
            title: a.title,
            message: a.content
          });
        });
      }
    } catch (error) {
      console.log(error)
    }
    if (data.Message.length != 0) {
      message = data.Message[0].Content;
      response.alerts.push({ title: "Train service alert", message });
    }
    try {
      let ghCommitHistory = await axios.get("https://api.github.com/repos/cheeaun/sgbusdata/commits");
      if (ghCommitHistory) {
        response.lastUpdated = ghCommitHistory.data[0].commit.committer.date
      }
    } catch (error) {console.log(error)}
    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ alerts: [], error: true });
  }
}
