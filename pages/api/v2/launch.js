import axios from "axios";

export default async function handler(req, res) {
  // Train Service Alert
  try {
    let resp = await axios.get(
      `http://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts`,
      {
        headers: {
          AccountKey: process.env.ACCKEY,
        },
      }
    );
    let LTATrainServiceAlertData = resp.data.value;
    let message;
    let response = {};
    response.alerts = [];

    if (LTATrainServiceAlertData.Message.length != 0) {
      message = LTATrainServiceAlertData.Message[0].Content;
      response.alerts.push({
        header: "Train service alert",
        message,
        link: "",
        linkDesc: "",
        type: "text",
      });
    }

    // My Alerts
    try {
      let dbDat = await axios.get(process.env.NPOINT_URL2);
      if (dbDat) {
        dbDat.data.forEach((a) => {
          response.alerts.push({
            header: a.header,
            message: a.message,
            link: a.link,
            linkDesc: a.linkDesc,
            type: a.type,
            startTimestamp: a.startTimestamp,
            endTimestamp: a.endTimestamp,
            crowdMap: a.crowdMap
          });
        });
      }
    } catch (error) {
      console.log(error);
    }

    // Data Updates
    try {
      let ghCommitHistory = await axios.get(
        "https://api.github.com/repos/slenplayz/sgbusdata/commits"
      );
      if (ghCommitHistory) {
        response.lastUpdated = ghCommitHistory.data[0].commit.committer.date;
      }
    } catch (error) {
      console.log(error);
    }

    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ alerts: [], error: true });
  }
}
