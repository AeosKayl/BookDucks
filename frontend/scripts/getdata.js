// export async function getBooks(url){
//   let response = await axios.get(url);
//   let {bookData} = response.data;
//   // console.log(bookData);
//   return bookData;
// }

export async function getAuthorisedData(url){
  let response = await axios.get(url,{
    headers:{
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  let authData = response.data;
  // console.log(authData);
  return authData;

}