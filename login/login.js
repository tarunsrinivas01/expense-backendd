async function onlogin(e) {
  try {
    e.preventDefault();
    let logindetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    const response = await axios.post("http://localhost:3000/user/login",logindetails);
    if (response.status === 201) {
      alert(response.data.message);
      localStorage.setItem('token',response.data.token)
      window.location.href='../expense/expense.html'
    } else {
      throw new Error(response.data.err);
    }
  } catch (error) {
    console.log(error);
  }
}
