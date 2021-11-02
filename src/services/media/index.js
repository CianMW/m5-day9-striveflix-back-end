import express from "express";
import uniqid from "uniqid";
import listEndpoints from "express-list-endpoints";
import fs from "fs";
import fetch from "node-fetch";
import {
  getMedia,
  getReviews,
  writeMediaToFile,
  writeReviewsToFile,
} from "../../lib/f-tools.js";
import { Console } from "console";
import { send } from "process";

const mediaRouter = express.Router();
/* 
    EXAMPLE OF A MEDIA ENTRY
{
    "Title": "The Lord of the Rings: The Fellowship of the Ring",
    "Year": "2001",
    "imdbID": "tt0120737",  //UNIQUE
    "Type": "movie",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
} */

mediaRouter.get("/", async (req, res, next) => {
  try {
    const media = await getMedia();
    if (media) {
      console.log(media);
      res.status(200).send(media);
    } else next(error);
  } catch (error) {
    next(error);
  }
});

mediaRouter.get("/query/", async (req, res, next) => {
  //using "search" as the query parameter
  try {
    const searchParam = req.query.search;
    if (searchParam) {
      const media = await getMedia();

      //gets the search and console logs
      console.log("this is the search query", searchParam);
      //filters and returns an array
      const foundMedia = media.filter((media) =>
        media.Title.includes(searchParam)
      );
      console.log("the lenth of the found media is : ", foundMedia.length);
      if (foundMedia.length > 0) {
        console.log("the found media is ", foundMedia);
        res.status(200).send(foundMedia);
      } else {
        const response = await fetch(
          "http://www.omdbapi.com/?apikey=2acb287b&s=" + searchParam,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          let data = await response.json();
          if (data.Search) {
            //here place what happens to the data from the OMDBAPI search
            console.log("HERE IS THE DATA", data);
            const newMedia = [];

            if (foundMedia.length > 0 && data.Search.length > 0) {
              foundMedia.forEach((media) => {
                const newRecord = data.Search.filter(
                  (record) => record.imdbID !== media.imdbID
                );
                console.log("here's the media under the filter", media);
                console.log(newRecord);
                if (newRecord.length > 0) {
                  newRecord.forEach((element) => {
                    newMedia.push(element);
                  });
                }
              });
            } else if (data.Search.length > 0) {
              data.Search.forEach((media) => newMedia.push(media));
            }

            console.log("HERE IS THE NEWMEDIA ARRAY", newMedia);
            if (newMedia.length > 0) {
              const mediaToWrite = media.concat(newMedia);
              writeMediaToFile(mediaToWrite);
            }

            res.send(data.Search[0]);
          }
        }
      }
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

mediaRouter.post("/", async (req, res, next) => {
  const allMedia = await getMedia();
  const existsCheck = allMedia.filter((media) => media.imdbID === req.imdbID);
  if (existsCheck.length > 0) {
    next(403);
  } else {
    try {
      const allMedia = await getMedia();
      const newMedia = { ...req.body, _id: uniqid() };
      console.log("this is the new media", newMedia);
      allMedia.push(newMedia);
      writeMediaToFile(allMedia);
      res.status(200).send(`new content created ID: ${newMedia._id}`);
    } catch (error) {
      next(error);
    }
  }
});

//needs testing
mediaRouter.get("/single/:id", async (req, res, next) => {
  try {
    const media = await getMedia();
    const filteredMedia = media.filter(media => media.imdbID === req.params.id)

    if (filteredMedia) {
      console.log(media);
      const allReviews = await getReviews()
      const foundReviews = allReviews.filter(review => review,elementId === filteredMedia.imdbID)
      filteredMedia.reviews = {...foundReviews}
      res.status(200).send(filteredMedia);
    } else next(error);
  } catch (error) {
    next(error);
  }
});

mediaRouter.delete("/:id", async (req, res, next) => {
if(req.params,id){
 const allMedia = getMedia()
 const filteredMedia = allMedia.filter(media => media.imdbID !== req.params.id)
 writeMediaToFile(filteredMedia)
}
})
mediaRouter.put("/:id", async (req, res, next) => {
if(req.params.id){
 const allMedia = getMedia()
 const filteredMedia = allMedia.filter(media => media.imdbID !== req.params.id)
 writeMediaToFile(filteredMedia)
}
})


export default mediaRouter;

// GET Media (list) (reviews included)

// GET Media (single) (with reviews)

// UPDATE Media
// DELETE Media

// /media/:id/poster

// POST Poster to single media

// /media/:id/reviews

// POST Review to media

// DELETE Review of media

// /media/:id/pdf
