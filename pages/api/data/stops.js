import fetch from "cross-fetch";

export default async function handler(req, res) {
  //   try {
  await fetch(`https://cdn.jsdelivr.net/gh/SlenPlayz/sgbusdata/data/v1/stops.geojson`)
    .then((x) => x.json())
    .then((resp) => {
      let stops = resp;
      let busStopsParsed = [];
      stops.features.sort((a, b) => a.properties.number - b.properties.number)
      stops.features.forEach((x) => {
        busStopsParsed.push({
          Name: x.properties.name,
          Road: x.properties.road,
          Services: x.properties.services,
          id: x.properties.number,
          cords: x.geometry.coordinates,
        });
      });
      res.setHeader("Cache-Control", "s-maxage=259200");
      return res.status(200).json(busStopsParsed);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
}
