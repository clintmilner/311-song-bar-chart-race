const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const buildDataSet = ({ setlist }) => {
  const desired = setlist.map((sl) => {
    console.log(sl);
    return {
      id: sl.id,
      data: sl.eventDate,
      venue: sl.venue.name,
      city: sl.venue.city,
      tour: sl.tour,
      sets: sl.sets,
    };
  });
  return desired;
};

router.get("/", (req, res, next) => {
  fetchData(process.env.MBID).then((message) => {
    res.status(200).json(buildDataSet(message));
  });
});

router.get("/:mbid", (req, res, next) => {
  const id = req.params.mbid;
  res.status(200).json({
    message: `specific API get request success - ${id}`,
  });
});

const fetchData = async (id) => {
  console.log("fetching", id);
  const headers = {
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const response = await fetch(
    `https://api.setlist.fm/rest/1.0/artist/${id}/setlists`,
    {
      headers,
    }
  );

  return await response.json();
};

module.exports = router;
