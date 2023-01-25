import Axios from "axios"
import pkg from 'http-errors';
const { BadRequest } = pkg;

export async function validateImageURL(imageUrl) {
  try {
    return (await Axios.get(imageUrl)).status == 200;
  } catch {
    return false
  }
}

export async function mediaGuard(imageURL) {
  if (imageURL) {
    if (!(await validateImageURL(imageURL))) {
      throw new BadRequest(`Image URL is bad: ${imageURL}`)
    }
    return imageURL;
  }
}