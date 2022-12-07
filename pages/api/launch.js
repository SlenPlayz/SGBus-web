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
    if (data.Message.length != 0) {
      message = data.Message[0];
      response.alerts.push({ title: "Train service alert", message });
    }
    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(e);
  }
}
