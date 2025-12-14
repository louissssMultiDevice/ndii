const axios = require('axios')

async function igstalk(username){
    try{
        if(!username) throw new Error('username required')

        return await axios.post(
            'https://api.boostfluence.com/api/instagram-profile-v2',
            { username },
            {
                headers:{
                    'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
                    'Content-Type':'application/json',
                    origin:'https://www.boostfluence.com',
                    referer:'https://www.boostfluence.com/'
                }
            }
        ).then(function(r){
            if(!r.data) throw new Error('fetch failed')
            return r.data
        })

    }catch(e){
        return { status:'error', msg:e.message }
    }
}

return await igstalk('its.me_ndii')
