const { Pool } = require('pg')

class PlaylistService {
  constructor() {
    this._pool = new Pool()
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT id, name FROM playlist WHERE id=$1',
      values: [playlistId],
    }


    const result = await this._pool.query(query)
    
    return result.rows[0]
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT song.song_id, song.title, song.performer
             FROM song
             INNER JOIN playlist_song ON song.song_id = playlist_song.song_id
             WHERE playlist_song.playlist_id = $1`,
      values: [playlistId],
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async getPlaylistWithSongs(playlistId) {
    const playlist = await this.getPlaylistById(playlistId)
    const songs = await this.getSongsByPlaylistId(playlistId)

    return { playlist : {
      ...playlist,
      songs,
    }
    }
  }
}

module.exports = PlaylistService
