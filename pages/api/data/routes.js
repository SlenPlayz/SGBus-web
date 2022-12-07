export default async function handler(req, res) {
  //   try {
  await fetch(`https://data.busrouter.sg/v1/routes.min.geojson`)
    .then((x) => x.json())
    .then((resp) => {
      res.setHeader("Cache-Control", "s-maxage=259200");
      return res.status(200).json(resp);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
}

export const config = {
  api: {
    responseLimit: '8mb',
  },
}