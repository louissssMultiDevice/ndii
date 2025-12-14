const axios = require('axios')

async function igee_deel(url) {
  try {
    const endpoint = 'https://igram.website/content.php?url=' + encodeURIComponent(url)

    const { data } = await axios.post(endpoint, '', {
      headers: {
        authority: 'igram.website',
        accept: '*/*',
        'accept-language': 'id-ID,id;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '',
        referer: 'https://igram.website/',
        'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
      }
    })

    return data
  } catch (e) {
    return { error: e.message }
  }
}

function parse(html) {
  const clean = html.replace(/\n|\t/g, '')

  const videoMatch = [...clean.matchAll(/<source src="([^"]+)/g)].map(x => x[1])
  let imageMatch = [...clean.matchAll(/<img src="([^"]+)/g)].map(x => x[1])

  if (imageMatch.length > 0) imageMatch = imageMatch.slice(1)

  const captionRaw = clean.match(/<p class="text-sm"[^>]*>(.*?)<\/p>/)
  const caption = captionRaw ? captionRaw[1].replace(/<br ?\/?>/g, '\n') : ''

  const likes = clean.match(/far fa-heart"[^>]*><\/i>\s*([^<]+)/)
  const comments = clean.match(/far fa-comment"[^>]*><\/i>\s*([^<]+)/)
  const time = clean.match(/far fa-clock"[^>]*><\/i>\s*([^<]+)/)

  return {
    is_video: videoMatch.length > 0,
    videos: videoMatch,
    images: imageMatch,
    caption,
    likes: likes ? likes[1] : null,
    comments: comments ? comments[1] : null,
    time: time ? time[1] : null
  }
}

async function instagram(url) {
  const raw = await igee_deel(url)
  if (!raw || !raw.html) return { error: 'scrape_failed' }

  const parsed = parse(raw.html)

  return {
    status: raw.status,
    username: raw.username,
    type: parsed.is_video ? 'video' : 'image',
    video_url: parsed.is_video && parsed.videos.length > 0 ? parsed.videos[0] : null,
    images: parsed.is_video ? [] : parsed.images,
    caption: parsed.caption,
    likes: parsed.likes,
    comments: parsed.comments,
    time: parsed.time
  }
}

  const result = await instagram('https://www.instagram.com/p/DQi6oEBkjvV/?img_index=2&igsh=aGsxcmZtMjZxenR3')
  return result
