import axios from 'axios'

const API = process.env.API_BASE_URL

export const getPlayer = async (discordId) => {
    const res = await axios.get(`${API}/player/by-discord/${discordId}`)
    return res.data
}