var faunadb = window.faunadb
  var q = faunadb.query
  var client = new faunadb.Client({
    secret: 'fnAEfGPHDaAAwhDvHZdDgw6ssEduOQm-UA7NKg3b',
    domain: 'db.eu.fauna.com',
    scheme: 'https',
  })

      
  let nfts = []
  let collectionList = []
  let ABSQEREUM_CONVERSION_RATE = 2928.92 //1 Absqereum converts to x GBP

function getNFTs(){

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
          collectionList.push({name: x.data[i].data.name, id: x.data[i].data.id})
          for (let z = 0; z < x.data[i].data.nfts.length; z++) {
            nfts.push({data: x.data[i].data.nfts[z], name: x.data[i].data.name, verified: x.data[i].data.verified})
          }
        }
        console.log(nfts)

        for (let i = 0; i < nfts.length; i++) {
          let verified = ""
          if(nfts[i].verified == true)
          {
            verified = "<i style=\"color:#1DA1F2; margin-left:5px; font-size:14px; background-image: radial-gradient(at center, white 40%, transparent 40%);\" class=\"fas fa-badge-check\"></i>"
          }
          else{
            verified = ""
          }
            html = html + `
            
            <div class="product-card">
                    <img class="img" onclick="viewNFT('` + nfts[i].data.id + `')" class="img" src="` + nfts[i].data.image + `" /><br><br>
                <h3>` + nfts[i].data.name + `</h3>
                <h4 style="color: #8a939b;"><a href="ko" style="color:#2081e2; text-decoration:none">` + nfts[i].name + verified + `</a></h4><br><br>
            <span><i style="font-size: 18px; color: #6121cf" class="fa-brands fa-ethereum"></i> ` + nfts[i].data.price + `</span>
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

/*client.query(

q.Create(
q.Collection('nfts'),
{ data: { image: url, owner: document.getElementById("owner").value,  name: document.getElementById("name").value,  price: parseFloat(document.getElementById("price").value), id: parseInt(generateId(9)), description: document.getElementById("description").value}},
)
)
.then(function(ret){
console.log(ret)
alert("Your NFT has been minted!")

});*/





client.query(
  q.Get(
    q.Match(q.Index('collection_by_id'),  parseInt(document.getElementById("collections").value))
  )
)
.then(function(ret) {
   
  let nfts = ret.data.nfts
  nfts.push({ image: url, owner: document.getElementById("owner").value,  name: document.getElementById("name").value,  price: parseFloat(document.getElementById("price").value), id: parseInt(generateId(9)), description: document.getElementById("description").value})
  
  client.query(
    q.Update(
      q.Ref(q.Collection('nfts'), ret.ref.value.id),
      {
        data: {
          nfts: nfts
        },
      },
    )
  ).then(function(ret) {

  })
  

})
.catch(function(e){

});


}

function generateId(length) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


function viewNFT(ids){

  document.getElementById("buyButton").innerHTML = "Buy Now"
  document.getElementById("buyButton").disabled = false;
  document.getElementById("buyButton").style.color = "white"
  console.log(ids)
  let pos = nfts.findIndex(id => id.data.id === parseInt(ids))
  console.log(nfts[pos])
  var modal = document.getElementById("nftView");
  var span = document.getElementById("nftClose")
    modal.style.display = "block";
    let owner = nfts[pos].data.owner 
    if(owner == localStorage.getItem("AbsqNFTsUsername"))
    {
      owner = "you"
      document.getElementById("buyButton").innerHTML = "Already Owned"
      document.getElementById("buyButton").disabled = true;
      document.getElementById("buyButton").style.color = "#b5b5b5"
    }
    else{
      owner = nfts[pos].data.owner 
    }

    let verified = ""
          if(nfts[pos].verified == true)
          {
            verified = "<i style=\"color:#1DA1F2; margin-left:7px; background-image: radial-gradient(at center, white 40%, transparent 40%);\" class=\"fas fa-badge-check\"></i>"
          }
          else{
            verified = ""
          }


    document.getElementById("nftName").innerHTML = nfts[pos].data.name
    document.getElementById("nftCollection").innerHTML = nfts[pos].name + verified
    document.getElementById("nftDescription").innerHTML = nfts[pos].data.description
    document.getElementById("nftPrice").innerHTML = "<i style=\"font-size: 18px; color: #6121cf\" class=\"fa-brands fa-ethereum\"></i>" + "<z style=\"margin-left:5px;\">" + nfts[pos].data.price + "<font style=\"color: #a8a8a8; font-size:16px\"> (&pound;" + (Math.round((nfts[pos].data.price * ABSQEREUM_CONVERSION_RATE) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")</font>"
    document.getElementById("nftImage").src = nfts[pos].data.image
    document.getElementById("nftOwner").innerHTML = "Owned by <font style=\"color:#2081e2;\">" + owner + "</font>"
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}


function createCollection(){

  client.query(
    q.Create(
      q.Collection('nfts'),
      { data: { name: document.getElementById("collectionName").value, verified:false, id: parseInt(generateId(15)), nfts:[]} },
    )
  )
  .then(function(ret){
  
       alert("Collection created!")

      })
  

}