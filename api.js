const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const buildDataSet = ({ itemsPerPage, page, total, setlist }) => {
  const requiredData = setlist.map((sl) => {
    return {
      artistName: sl.artist.name,
      artistMbid: sl.artist.mbid,
      date: sl.eventDate,
      info: sl.info,
      venue: sl.venue.name,
      city: sl.venue.city.name,
      state: sl.venue.city.state,
      country: sl.venue.city.country.code,
      lat: sl.venue.city.coords.lat,
      long: sl.venue.city.coords.long,
      tour: sl.tour,
      sets: sl.sets.set,

      // debug: sl,
    };
  });
  return {
    itemsPerPage,
    page,
    total,
    setlist: requiredData,
  };
};

router.get("/", (req, res, next) => {
  fetchData(process.env.MBID, 1).then((message) => {
    const { itemsPerPage, total } = message;
    const pages = total / itemsPerPage;
    console.log("pages", pages);
    console.log("itemsPerPage", itemsPerPage);
    console.log("total", total);
    res.status(200).json(buildDataSet(message));
  });
});

router.get("/all", async (req, res, next) => {
  const entireList = await getAllSetLists(process.env.MBID);

  await res.status(200).json({
    id: process.env.MBID,
    message: "success",
    totalShows: entireList.length,
    summary: entireList[0].artistName,
    data: entireList,
  });
});

router.get("/all/:mbid", async (req, res, next) => {
  const id = req.params.mbid;
  const entireList = await getAllSetLists(id);

  await res.status(200).json({
    id: process.env.MBID,
    message: "success",
    totalShows: entireList.length,
    summary: entireList[0].artistName,
    data: entireList,
  });
});

const getAllSetLists = async function (id, pageNo = 1) {
  const {
    itemsPerPage,
    total,
    page,
    message = null,
    setlist = [],
  } = await fetchData(id, pageNo);
  let dataSet = [...setlist];
  const TOTAL_PAGES = total / itemsPerPage;
  // const TOTAL_PAGES = 1;
  console.log(`==== RESULTS FOR PAGE ${pageNo} / ${TOTAL_PAGES} ====`);
  if (!page) {
    console.log(`BAD BAD - retry page ${pageNo}`, message);
    return dataSet.concat(await getAllSetLists(id, pageNo));
  }
  if (pageNo < TOTAL_PAGES) {
    console.log(`KEEP FETCHING - PAGE No:${pageNo}`);
    return dataSet.concat(await getAllSetLists(id, pageNo + 1));
  } else {
    console.log(`STOP FETCHING - PAGE No:${pageNo}`);
    return dataSet;
  }
};

const fetchData = async (id, page) => {
  const headers = {
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const response = await fetch(
    `https://api.setlist.fm/rest/1.0/artist/${id}/setlists?p=${page}`,
    {
      headers,
    }
  );

  return await cleanData(response.json());
};

const cleanData = async (data) => {
  const json = await data.then((d) => d);
  if (json.message) {
    return json;
  }
  return buildDataSet(json);
};

module.exports = router;
