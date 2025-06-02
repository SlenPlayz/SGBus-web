import axios from "axios";
import fetch from "cross-fetch";

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

export default async function handler(req, res) {
  let stopid = req.query.stopid;
  try {
    let resp = await axios.get(
      `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${stopid}`,
      {
        headers: {
          AccountKey: process.env.ACCKEY,
        },
      }
    );
    let srt = resp.data;
    srt.Services.sort((a, b) => {
      if (isNumeric(a.ServiceNo)) {
        return a.ServiceNo - b.ServiceNo;
      } else {
        return a.ServiceNo.slice(0, -1) - b.ServiceNo;
      }
    });
    res.setHeader("Cache-Control", "s-maxage=30");
    res.status(200).json(srt); 
  } catch (e) {
    res.status(500).json(e);
  }
}