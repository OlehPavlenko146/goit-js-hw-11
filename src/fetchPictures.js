import axios from 'axios';
const KEY = '30666690-80ad85c3f2d79ccbcdd2ca85c';
const baseURL = 'https://pixabay.com/api/';
const axios = require('axios').default;

export default class PicturesSearchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getPictures() {
    const url = `${baseURL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
    try {
      const response = await axios.get(url);
      this.incrementPage();
      console.log(this);
      console.log(response.data);
      return response.data.hits;
      // };
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
