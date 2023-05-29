let uid = null;
let token = localStorage.getItem("token");
const Expenselist=document.getElementById('listofexpenses')


const limitselect=document.getElementById('rows');

limitselect.addEventListener('change',()=>{
    const limit=parseInt(limitselect.value);
    localStorage.setItem('limit',limit);
})
function savetolocalstorage(event) {
  event.preventDefault();
  let amount = event.target.expense.value;
  let description = event.target.description.value;
  let choosecategory = event.target.choosecategory.value;

  let obj = {
    amount,
    description,
    choosecategory,
  };
  if (uid === null) {
    axios
      .post("http://localhost:3000/expenses/add-expenses", obj, {
        headers: { Authorisation: token },
      })
      .then((res) => {
        if (res.status === 201) {
          showuserdetails(res.data.newexpenses);
          uid = null;
        }
      })
      .catch((err) => console.log(err));
  } else {
    axios
      .put(`http://localhost:3000/expenses/add-expenses/${uid}`, obj, {
        headers: { Authorisation: token },
      })
      .then((res) => {
        if (res.status === 200) {
          showuserdetails(res.data.newexpenses);
        }
      })
      .catch((err) => console.log(err));
  }
}
function showuserdetails(data) {
  document.getElementById("exp").value = "";
  document.getElementById("des").value = "";
  let parentele = document.getElementById("listofexpenses");
  let childele = `<li id=${data._id}>${data.amount}-${data.description}-${data.category}
                        <button class='btn btn-primary btn-sm' onClick=deluser('${data._id}',event)>delete</button>
                        <button class='btn btn-primary btn-sm' onClick=edituser('${data.amount}','${data.description}','${data.category}','${data._id}')>edit</button></li>`;
  parentele.innerHTML = parentele.innerHTML + childele;
}
function edituser(useramount, userdescription, choosecategory, userid) {
  document.getElementById("exp").value = useramount;
  document.getElementById("des").value = userdescription;
  document.getElementById("cat").value = choosecategory;
  uid = userid;
  removeuser(userid);
}
function deluser(userid, event) {
  axios
    .delete(`http://localhost:3000/expenses/delete/${userid}`, {
      headers: { Authorisation: token },
    })
    .then((res) => {
      if (res.status === 200) {
        removeuser(userid);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  event.stopPropagation();
}
function removeuser(userid) {
  let parnode = document.getElementById("listofexpenses");
  let childnode = document.getElementById(userid);
  if (childnode) {
    parnode.removeChild(childnode);
  }
}
document.getElementById("prm").onclick = async function (e) {
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorisation: token } }
  );
  var options = {
    key: response.data.key_id,
    order_id: response.data.orders.id,
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorisation: token } }
      );
      localStorage.setItem('token',res.data.token)
      alert("you are premiumuser now");
     showpremiumuser()
     showleaderboard()
        downloadedfiles()
        document.getElementById('downloadexpenses').style.visibility=''

    },
  };
  const rzp=new Razorpay(options);
  rzp.open();
  e.preventDefault()
rzp.on('payment.failed',function(response){
   alert('oops something went wrong')
})
};
function showpremiumuser()
{
    document.getElementById("message").innerHTML =
    "you are a premium user now";
  document.getElementById("prm").style.visibility = "hidden";
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function showleaderboard()
{
    const inputelement=document.createElement('input');
    inputelement.class="btn btn-primary"
    inputelement.type="button";
    inputelement.value="show leaderboard"
    inputelement.onclick=async()=>{
        inputelement.style.visibility='hidden'
        let token=localStorage.getItem('token')
        const response=await axios.get('http://localhost:3000/premium/leaderboard',{headers:{'Authorisation':token}})
        var leaderboardele=document.getElementById('leaderboard')
        leaderboardele.innerHTML+=`<h1>Leader Board</h1>`
        
        response.data.forEach((arrofuserexpenses)=>{
            leaderboardele.innerHTML+=`<li>name:${arrofuserexpenses.name}-totalexpenses${arrofuserexpenses.totalexpenses}</li>`
        })

    }
    document.getElementById('message').appendChild(inputelement)
}
document.getElementById('downloadexpenses').onclick=function download()
{
  axios.get('http://localhost:3000/user/download', { headers: {"Authorisation" : token} })
  .then((response) => {
      if(response.status === 201){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
          downloadedfiles()
      } else {
          throw new Error(response.data.message)
      }

  })
  .catch((err) => {
      showError(err)
  });
}
async function downloadedfiles(e){

  try{
      // e.preventDefault();
    //  const token= localStorage.getItem('token');
  const response= await axios.get(`http://localhost:3000/expenses/downloadedfiles`,{headers:{'Authorisation':token}});

  const downloadedfileslist=document.getElementById('downloadedfileslist');
  downloadedfileslist.innerHTML=""
  for(let i=0;i<response.data.files.length;i++){

      console.log(response.data.files[i].url);
      downloadedfileslist.innerHTML+=`<li><a href=${response.data.files[i].url}>TextFile${i}</a></li>`
  }
      

  }catch(err){
      console.log(err);
  }
}
window.addEventListener("DOMContentLoaded", () => {
    const decoded=parseJwt(token)
    console.log(decoded)
    const isadmin=decoded.ispremiumuser
    const page=1
    const limit=localStorage.getItem('limit')
    if(isadmin)
    {
        showpremiumuser()
        showleaderboard()
        // downloadedfiles()
    }
    else{
      // document.getElementById('downloadexpenses').style.visibility='hidden'
    }
  axios
    .get(`http://localhost:3000/expenses/getall?page=${page}&limit=${limit}`, {
      headers: { Authorisation: token },
    })
    .then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.allexpenses.length; i++) {
        showuserdetails(res.data.allexpenses[i]);
      }
      showpages(res.data);
    });
    
});
let pages=document.getElementById('pages')
async function showpages({currentpage,nextpage,previouspage,hasnextpage,haspreviouspage,lastpage}){
  try{
          pages.innerHTML='';

              if(haspreviouspage){
                  const btn2=document.createElement('button');
                  btn2.innerHTML=previouspage;
                  btn2.addEventListener('click',()=>getExpenses(previouspage))
                  pages.appendChild(btn2);
              }
              const btn1=document.createElement('button');
              btn1.innerHTML=`<h3>${currentpage}</h3>`
              btn1.addEventListener('click',()=>getExpenses(currentpage))
              pages.appendChild(btn1);

              if(hasnextpage){
                  const btn3=document.createElement('button')
                  btn3.innerHTML=nextpage;
                  btn3.addEventListener('click',()=>getExpenses(nextpage))
                  pages.appendChild(btn3);
              }

  }catch(err){
          console.log(err);
  }
}

async function getExpenses(page){
  try{
      const limit=localStorage.getItem('limit');
      const token= localStorage.getItem('token');
      const response =await axios.get(`http://localhost:3000/expenses/getall?page=${page}&limit=${limit}`,{headers:{"Authorisation":token}});
  
          console.log("$$$$$$$$$$$",response)

          Expenselist.innerHTML="";
      for(let i=0;i<response.data.allexpenses.length;i++)
      {
          showuserdetails(response.data.allexpenses[i]);
      }
      showpages(response.data);
      

  }catch(err){
      console.log(err);
  }
}
