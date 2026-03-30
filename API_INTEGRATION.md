# TheAudioDB API Integration

This project uses the [TheAudioDB](https://www.theaudiodb.com/) free music API to fetch real album data.

## API Overview

TheAudioDB provides a free API for accessing music database information including:
- Album information (artwork, descriptions, release dates)
- Artist information
- Track information
- Music videos
- Album reviews

**API Base URL:** `https://www.theaudiodb.com/api/v1/json/2/`

## Available Functions

### `searchAlbums(artistName, albumName)`
Search for albums by artist and optionally by album name.

```javascript
import { searchAlbums } from './api.js';

const albums = await searchAlbums('Frank Ocean', 'Blonde');
```

### `getArtist(artistName)`
Get detailed artist information.

```javascript
import { getArtist } from './api.js';

const artist = await getArtist('Frank Ocean');
```

### `searchByTrack(trackName)`
Search for tracks and get album information.

```javascript
import { searchByTrack } from './api.js';

const tracks = await searchByTrack('Blinded by the Light');
```

### `getAlbumDetails(albumId)`
Get complete album details by TheAudioDB album ID.

```javascript
import { getAlbumDetails } from './api.js';

const album = await getAlbumDetails('2081982');
```

### `formatAlbum(album)`
Convert raw API data to a cleaner format.

```javascript
import { formatAlbum } from './api.js';

const formatted = formatAlbum(rawAlbumData);
```

### `getFeaturedAlbums()`
Get the featured albums collection.

```javascript
import { getFeaturedAlbums } from './api.js';

const featured = await getFeaturedAlbums();
```

## Formatted Album Structure

```javascript
{
  id: 'TheAudioDB ID',
  name: 'Album Title',
  artist: 'Artist Name',
  year: 2016,
  genre: 'R&B',
  style: 'Experimental',
  covers: {
    front: 'URL to front cover',
    back: 'URL to back cover',
    cd: 'URL to CD art',
    spine: 'URL to spine art'
  },
  description: 'Album description',
  review: 'Album review text',
  sales: 1000000,
  score: 8,
  label: 'Label name'
}
```

## File Structure

```
Music-Boxd/
├── js/
│   ├── api.js          # API wrapper and utility functions
│   ├── index.js        # Index page logic
│   ├── album.js        # Album page logic
│   └── profile.js      # Profile page logic
├── styles/
│   ├── shared.css      # Shared styles
│   ├── album.css       # Album page styles
│   ├── index.css       # Index page styles
│   ├── login.css       # Login page styles
│   └── profile.css     # Profile page styles
├── album.html
├── index.html
├── login.html
└── profile.html
```

## How It Works

1. **Index Page** (`index.html` + `js/index.js`)
   - Fetches featured albums from TheAudioDB
   - Displays album grid with real artwork and data
   - Links to individual album pages

2. **Album Page** (`album.html` + `js/album.js`)
   - Accepts album ID via URL parameter: `album.html?id=2081982`
   - Fetches album details from API
   - Displays album hero with artwork, description, and metadata

3. **Profile Page** (`profile.html` + `js/profile.js`)
   - Displays user's reviewed albums from a predefined list
   - Fetches real data from API for each album
   - Shows album artwork and user's ratings

## API Rate Limiting

TheAudioDB free API has rate limiting:
- Allows a reasonable number of requests per minute
- No API key required for basic endpoints
- Requests are cached locally to reduce API calls

## Example Usage

### Linking to Albums
```html
<!-- Link to album page with API ID -->
<a href="album.html?id=2081982">View Album</a>

<!-- Or link with artist/album name parameters -->
<a href="album.html?artist=Frank%20Ocean&album=Blonde">View Album</a>
```

### Manual API Call
```javascript
import { searchAlbums, formatAlbum } from './js/api.js';

async function findAlbum(artist, album) {
  const results = await searchAlbums(artist, album);
  if (results.length > 0) {
    const formatted = formatAlbum(results[0]);
    console.log(formatted);
    return formatted;
  }
}

findAlbum('Frank Ocean', 'Blonde');
```

## Limitations

- TheAudioDB doesn't provide real user ratings or review data
- Tracklist information is limited in the free API
- Some albums may not have all fields populated
- Images may not always be available for all albums

## Future Enhancements

- Add local caching to reduce API calls
- Integrate with a backend database for user reviews
- Add search functionality
- Implement pagination for large result sets
- Add offline support with cached data

## Resources

- [TheAudioDB API Documentation](https://www.theaudiodb.com/api_guide.php)
- [TheAudioDB Free API](https://www.theaudiodb.com/free_music_api)
