const fs = require('fs')
const {promisify} = require('util')
var dns = require('dns')

function getMxRecords(domain){
    
    return new Promise(resolve => {
        dns.resolveMx(domain, function (err, addresses) {
            if (err) return resolve(null)
            
            let ex = addresses
                .sort((a,b) => a.priority > b.priority)
                .map(a => `${a.priority} ${a.exchange}`)

            resolve(ex)
        })
    })
}

let out = []
 ;(async () => {
    const raw = await promisify(fs.readFile)('./domaines.txt', 'utf8')
    const domains = raw.split('\n').map(d => d.trim())

    for await(const dom of domains){
        let line = [dom]

        const mx = await getMxRecords(dom) 
        if(mx && mx.length){
            line.push(...mx)
        }else{
            line.push('NO-MX')
        }

        console.log(line.join('\t'))
        out.push(line)
    }

 })()
