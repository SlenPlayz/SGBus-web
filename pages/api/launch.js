import { Redis } from "@upstash/redis";
import axios from "axios";

const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_ACCKEY,
});

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
      let dbDat = await axios.get(process.env.UPSTASH_URL + "/get/alerts", {
        headers: {
          Authorization: process.env.UPSTASH_ACCKEY,
        },
      });
      if (dbDat) {
        let dbDatParsed = JSON.parse(dbDat.data.result);
        dbDatParsed.forEach((a) => {
          response.alerts.push(a);
        });
      }
    } catch (error) {}
    if (data.Message.length != 0) {
      message = data.Message[0].Content;
      response.alerts.push({ title: "Train service alert", message });
    }
    try {
      let ghCommitHistory = await axios.get("https://api.github.com/repos/slenplayz/sgbusdata/commits");
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
