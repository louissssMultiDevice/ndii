const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

async function vocalremove(file){
    try{
        if(!fs.existsSync(file)) throw new Error('file not found')

        const form = new FormData()
        form.append('fileName', fs.createReadStream(file))

        return await axios.post(
            'https://aivocalremover.com/api/v2/FileUpload',
            form,
            { headers:{ ...form.getHeaders(), 'User-Agent':'Mozilla/5.0 (Linux; Android 10)' } }
        ).then(async function(r){

            if(!r?.data?.file_name) throw new Error('upload failed')

            const body = new URLSearchParams({
                file_name: r.data.file_name,
                action: 'watermark_video',
                key: 'X9QXlU9PaCqGWpnP1Q4IzgXoKinMsKvMuMn3RYXnKHFqju8VfScRmLnIGQsJBnbZFdcKyzeCDOcnJ3StBmtT9nDEXJn',
                web: 'web'
            })

            return await axios.post(
                'https://aivocalremover.com/api/v2/ProcessFile',
                body,
                {
                    headers:{
                        'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
                        'Content-Type':'application/x-www-form-urlencoded',
                        origin:'https://aivocalremover.com',
                        referer:'https://aivocalremover.com/'
                    }
                }
            ).then(function(x){
                if(!x?.data?.instrumental_path) throw new Error('proses failed')

                return{
                    instrumental: x.data.instrumental_path || null,
                    vocal: x.data.vocal_path || null
                }
            })
        })

    }catch(e){
        return { status:'error', msg:e.message }
    }
}

return await vocalremove('./media/audio/BeranjakDewasa.mp3')
