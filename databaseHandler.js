var faunadb = window.faunadb
  var q = faunadb.query
  var client = new faunadb.Client({
    secret: 'fnAEfGPHDaAAwhDvHZdDgw6ssEduOQm-UA7NKg3b',
    domain: 'db.eu.fauna.com',
    scheme: 'https',
  })

function getNFTs(){

    
    let nfts = []
    let html = ""
    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("nfts")), { size: 100000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
        for (let i = 0; i < x.data.length; i++) {
            nfts.push(x.data[i].data)
        }

        for (let i = 0; i < nfts.length; i++) {
            html = html + `
            
            <div class="product-card">
                    <img class="img" src="` + nfts[i].image + `" /><br><br>
                <h3>` + nfts[i].name + `</h3>
                <h4 style="color: #8a939b;">Owned by <font style="color:#2081e2;">` + nfts[i].owner + `</font></h4><br><br>
            <span><i style="font-size: 18px; color: #6121cf" class="fa-brands fa-ethereum"></i> ` + nfts[i].price + `</span>
        </div>
        
        `

        document.getElementById("content").innerHTML = html
        }

    });

}


async function uploadNFT(){

    const formdata = new FormData()
    formdata.append("image", image)
    var response = await fetch("https://api.imgur.com/3/image", {
        method: "post",
        headers: {
            Authorization: "Client-ID 0d049d81097cf20"
        },
        body: formdata
    })
let data = await response.json()
url = data.data.link

client.query(

q.Create(
q.Collection('nfts'),
{ data: { image: url, owner: document.getElementById("owner").value,  name: document.getElementById("name").value,  price: parseInt(document.getElementById("price").value)}},
)
)
.then(function(ret){
console.log(ret)
alert("Your NFT has been minted!")

});  



}
