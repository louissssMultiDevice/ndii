
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

async function qrcode(teks, logo){
    try{
        let logoFile = null

        if(logo){
            if(!fs.existsSync(logo)) throw new Error('logo not found')

            const up = new FormData()
            up.append('file', fs.createReadStream(logo))

            logoFile = await axios.post(
                'https://api.qrcode-monkey.com/qr/uploadimage',
                up,
                {
                    headers:{
                        ...up.getHeaders(),
                        'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
                        origin:'https://www.qrcode-monkey.com',
                        referer:'https://www.qrcode-monkey.com/'
                    }
                }
            ).then(r=>{
                if(!r?.data?.file) throw new Error('Logo upload failed')
                return r.data.file
            })
        }

        return await axios.post(
            'https://api.qrcode-monkey.com/qr/custom',
            JSON.stringify({
                data:teks,
                config:{
                    body:'square',
                    eye:'frame0',
                    eyeBall:'ball0',
                    erf1:[],
                    erf2:[],
                    erf3:[],
                    brf1:[],
                    brf2:[],
                    brf3:[],
                    bodyColor:'#000000',
                    bgColor:'#FFFFFF',
                    eye1Color:'#000000',
                    eye2Color:'#000000',
                    eye3Color:'#000000',
                    eyeBall1Color:'#000000',
                    eyeBall2Color:'#000000',
                    eyeBall3Color:'#000000',
                    gradientColor1:'',
                    gradientColor2:'',
                    gradientType:'linear',
                    gradientOnEyes:'true',
                    ...(logoFile ? { logo:logoFile, logoMode:'default' } : {})
                },
                size:1000,
                download:'imageUrl',
                file:'png'
            }),
            {
                headers:{
                    'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
                    'Content-Type':'text/plain;charset=UTF-8',
                    origin:'https://www.qrcode-monkey.com',
                    referer:'https://www.qrcode-monkey.com/'
                }
            }
        ).then(function(r){
            if(!r?.data?.imageUrl) throw new Error('generate failed')

            return{
                input:teks,
                output:'https:'+r.data.imageUrl
            }
        })

    }catch(e){
        return{status:'error',msg:e.message}
    }
}

return await qrcode('NdiiClouD') // kalau pakai logo (),'./media/thumb-1.jpg')
