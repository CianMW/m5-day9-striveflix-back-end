import fs from "fs-extra";
import multer from "multer";
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data") // gets the current url, then the directory (folder) address, then goes out a level and adds the folder address "data"
console.log(dataFolderPath)
const mediaJSONPath = join(dataFolderPath, "/media.json")
const reviewsJSONPath = join(dataFolderPath, "/reviews.json")
const publicFolderPath = join(process.cwd(), "./public/images") // process.cwd() gets the address for the root


export const writeMediaToFile = (input) => {fs.writeJSON(mediaJSONPath, input)} 
export const writeReviewsToFile = (input) => {fs.writeJSON(reviewsJSONPath, input)} 
export const getMedia = () => fs.readJSON(mediaJSONPath)
export const getReviews = () => fs.readJSON(reviewsJSONPath)
export const saveMediaImages = (fileName, contentAsBuffer) => writeFile(join(publicFolderPath, fileName), contentAsBuffer) // writes the picture to the destination
