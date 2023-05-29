async function submitdetails(event) {
  try {
    event.preventDefault();
    let signupdetails = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      signupdetails
    );
    if (response.status === 201) {
      alert(response.data.message);
      window.location.href='../login/login.html'
    } else {
      throw new Error(response.data.err);
    }
  } catch (error) {
    throw new Error(error)
    console.log(error);
  }
}
