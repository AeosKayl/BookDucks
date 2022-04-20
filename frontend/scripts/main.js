console.log("all is well")
import { getAuthorisedData } from "../scripts/getdata.js";

let logged = false;
let ownerEmail = document.querySelector(".book-owner");
//* fetching data from strapis api
const fetchData = async (url) => {
  let response = await axios.get(url)
  let {data} = response.data
  return data
}



//* variables for buttons & boxes
let loginBtn = document.querySelector(".login-btn");
let registrationBtn = document.querySelector(".registration-btn");
let backToMain = document.querySelector(".show-main");
let backToProfile = document.querySelector(".show-profile");
// console.log(registrationBtn);
let regFormBtn = document.querySelector(".registration-form-btn");//* not needed with submit form
let logoutBtn = document.querySelector(".logout-btn");
let checkBox = document.querySelector(".genre-boxes"); 
//* variables for book adding section
let addBookBtn = document.querySelector(".add-book-btn");//* for adding book, not needed with sumbit form
let addNewBook = document.querySelector(".add-new-btn"); //* for navigating to adding form

//* variables for login inputs
let loginUsername = document.querySelector("#username");
let loginPassword = document.querySelector("#password");
let loginForm = document.querySelector(".login-form");
let registrationForm = document.querySelector(".registration-form");
let addBookForm = document.querySelector(".add-book-form");
let loggedUser = document.querySelector(".logged-user");
let bookGallery = document.querySelector(".book-gallery");
let profileBooksContainer = document.querySelector(".pro-booklist");


//* variables for section-view
const regSection = document.querySelector(".registration-section");
const loginSection = document.querySelector(".login-section");
const profileSection = document.querySelector(".my-profile");
const addBooksSection = document.querySelector(".add-books");
const bookLibrary = document.querySelector(".book-library");
const welcomeSection = document.querySelector(".welcome-section");

// let userBooks = document.querySelector(".pro-booklist");

fetchData("http://localhost:1337/api/books?populate=*")
.then(data => {
  // console.log(data);
  showBooks(data)});


//* welcome page book library and showing library

const showBooks = (array) => {
    array.forEach(book => {
        let {title, author, type, releaseDate, length, coverImage, rating, genres, owner} = book.attributes;
        let {url} = coverImage.data.attributes;
        //* this code is for adjusting the size of the image, since the initial image doesn't have any other
        //* image sizes besides thumbnail
        if(coverImage.data.attributes.size > 45){
          url = coverImage.data.attributes.formats.small.url;
          // console.log(url);
        }
        let {username, email} = owner.data.attributes;
        let listOfGenres = genres.data;
        // console.log(listOfGenres);
        let allGenres = "";
        
        listOfGenres.forEach(obj => {
            let genre = obj.attributes.category;
            // console.log(genre);
            allGenres += genre + " "
        })

        let bookArticle = document.createElement("article")
        bookArticle.innerHTML = `
        <div class="cover-img">
            <img src="http://localhost:1337${url}" alt="${title} cover Image">
        </div>
        <div class="book-summary">
            <h3 class="book-name">${title}</h3>
            <p class="book-author">Author: ${author}</p>
            <p class="book-genres">Genres: ${allGenres}</p>
            <p class="book-release-date">Date of Release: ${releaseDate}</p>
            <p class="book-rating">Rating: ${rating}/10 ✭</p>
        </div>
        <div class="book-type"> 
            <p class="book-length">Length: ${length} ${type == "audio" ? "minutes" : "pages"}</p>
        </div>
        <div class="book-owner">
            <p>Wish to borrow this book?</p>
            <a href="mailto:${email}" class="book-owner-email">Contact owner: ${username}</a>
        </div>

        `
        bookGallery.append(bookArticle)
        
    });
}

//* toggle functions, not used
const loginToggle = () =>{
  loginSection.classList.toggle("hidden");
}


loginBtn.addEventListener("click", ()=>{
  loginSection.classList.toggle("hidden");
  regSection.classList.add("hidden");
  // loginBtn.classList.toggle("hidden");
})

//* login function and saving jwt token in session storage
const login = async () =>{
  console.log("the button works");
  let {data} =  await axios.post("http://localhost:1337/api/auth/local",{
    identifier: loginUsername.value,
    password: loginPassword.value
  });
  // console.log(data);
  sessionStorage.setItem("user",data.user.username);
  sessionStorage.setItem("id",data.user.id);
  sessionStorage.setItem("token",data.jwt);
  logoutBtn.classList.remove("hidden"); //*shows logout btn;
  if(sessionStorage.getItem("token")){
    regSection.classList.add("hidden");
    getAuthorisedData(`http://localhost:1337/api/users/me`)
    .then(data =>{ showProfile(data)})
    .then(()=>{
      profileSection.classList.remove("hidden");
      // console.log(profileSection)
    })

    fetchData("http://localhost:1337/api/books?populate=*")
        .then(data => {showProfileBooks(data)})
  }
  console.log(`${data.user.username} is logged in`);
  loginStatus();
}

loginForm.addEventListener("submit", (para) =>{
  para.preventDefault();
  login();
})


//* registration function
      //* for showing registration form
registrationBtn.addEventListener("click", (para) =>{
  para.preventDefault();
  loginSection.classList.add("hidden");
  regSection.classList.remove("hidden");

})

const newUserName = document.querySelector(".username-input");
const newUserEmail = document.querySelector(".email-input");
const newUserPass = document.querySelector(".password-input");

const registration = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local/register",
  {
    username: newUserName.value,
    email: newUserEmail.value,
    password: newUserPass.value
  })
  .then(response =>{
    console.log("successful registration");
    console.log('User profile', response.data.user);
  })

  //   //* saving user data to session storage although not using it
  // sessionStorage.setItem("user", response.data.user.username);
  // sessionStorage.setItem("id", response.data.user.id);
  // sessionStorage.setItem("token", response.data.jwt);

  newUserName.value ="";
  newUserEmail.value ="";
  newUserPass.value ="";
  let orText = document.querySelector(".or");
  orText.classList.add("hidden");
  registrationBtn.classList.add("hidden");
  loginSection.classList.remove("hidden");
  regSection.classList.add("hidden");

}

registrationForm.addEventListener("submit", (para)=>{
  para.preventDefault();
  registration()
})


//* function for creating profile section
const showProfile = (profile) =>{
  let {id, username, email, createdAt} = profile;
  let dateInfo =  new Date(createdAt);
  let dayInfo = dateInfo.getDate();
  let monthInfo = dateInfo.toLocaleString("default", {month: `long`});
  let yearInfo = dateInfo.getFullYear();
  let membership = `<strong>Member since:</strong> ${dayInfo} of ${monthInfo} - ${yearInfo}.`
  console.log(membership);
  let memberMail = document.querySelector(".member-email");
  let memberName = document.querySelector(".member-name");
  let memberId = document.querySelector(".member-id");
  // console.log(memberId);
  let membershipInfo = document.querySelector(".membership");
  // console.log(membershipInfo);

  memberName.innerHTML = `${username}`;
  memberId.innerHTML = `<strong>Id-number:</strong> ${id}`;
  membershipInfo.innerHTML = `${membership}`;
  memberMail.innerHTML = `<strong>Email:</strong> ${email}`;
}
//* function for showing personal collection of books
const showProfileBooks = (booklist) => {
  profileBooksContainer.innerHTML = "";
  let userBooks = booklist.filter(book =>{
    return book.attributes.owner.data.attributes.username == sessionStorage.getItem("user")
  })

  // console.log(userBooks);

  userBooks.forEach(book => {
    let {title,coverImage,type} = book.attributes;
    let {url} = coverImage.data.attributes.formats.thumbnail; //* to get the thumbnail format
    // console.log(book.attributes);
    let bookArticle = document.createElement("article");
    bookArticle.innerHTML = `
    <h3 class="book-name">${title}</h3>
    <div class="cover-img">
        <img src="http://localhost:1337${url}" alt="${title} cover image">
    </div>
    <p>Format: ${type} book</p>    
    `
    profileBooksContainer.append(bookArticle);

  });

}

//* function for checking login status and clearing fields
const loginStatus = () =>{
  if(sessionStorage.getItem("token")){
    
    loginSection.classList.add("hidden");
    welcomeSection.classList.add("hidden");
    bookLibrary.classList.add("hidden");
    backToMain.classList.remove("hidden");
    loggedUser.innerText = `Welcome ${sessionStorage.getItem("user")}`
    loggedUser.classList.add("highlight");
    loginUsername.value = "";
    loginPassword.value = "";
    loginBtn.classList.add("hidden");
    logged = true;
  }
}

backToMain.addEventListener("click",() =>{
  welcomeSection.classList.remove("hidden");
  bookLibrary.classList.remove("hidden");
  addBooksSection.classList.add("hidden");
  profileSection.classList.add("hidden");
  backToMain.classList.add("hidden");
  backToProfile.classList.remove("hidden");
})

backToProfile.addEventListener("click",() =>{
  welcomeSection.classList.add("hidden");
  bookLibrary.classList.add("hidden");
  profileSection.classList.remove("hidden");
  backToMain.classList.remove("hidden");
  backToProfile.classList.add("hidden");
  // addBooksSection.classList.remove("hidden");
})


//* function for logging out
logoutBtn.addEventListener("click", ()=>{
  let logoutConfirm = confirm("Continue with logging out?");

  if (logoutConfirm){
      window.sessionStorage.clear();
      logged = false;
      location.reload();
  }
})


//* functions for showing section and adding new books to database and site

addNewBook.addEventListener("click", ()=>{
  addBooksSection.classList.toggle("hidden");
})

fetchData("http://localhost:1337/api/genres")
.then(data =>{

  // console.log(data);
  data.forEach(element =>{
    let {id} = element;
    let {category} = element.attributes;
    // console.log(id,category);
    let checkboxWrap = document.createElement("div");
    checkboxWrap.classList.add("checkbox-wrap");

    checkboxWrap.innerHTML = `
    <label for="${id}">${category}</label>
    <input type="checkbox" name="${category}" value ="${id}" id="${id}">
    `
    checkBox.append(checkboxWrap);

  })
})

//* variables for the adding books section
const bookTitle = document.querySelector(".title");
const audioCheck = document.querySelector("#audio-type");
const physicalCheck = document.querySelector("#physical-type");
const authorName = document.querySelector(".author-name");
const release = document.querySelector(".release-date");
const bookLength = document.querySelector(".pages-minutes");
const starRating = document.querySelector("#star-select");
const coverInput = document.querySelector("#cover-upload");


const uploadBook = async () =>{
  //* get image file and create a new instance of a formdata that houses the image
  let bookCover = coverInput.files;
  let coverData = new FormData();
  coverData.append("files", bookCover[0]);

  //* pushing checked genres into an array
  let bookGenres = [];

  document.querySelectorAll("input[type='checkbox']:checked").forEach(genre =>{
    bookGenres.push(genre.value);
  })
  //* if no genres are checked, alert user
  if(bookGenres.length===0){
    alert('Please select at least one genre!');
    console.log(bookGenres);
    return false;
  }

  //* upload image first to strapi
  await axios.post("http://localhost:1337/api/upload", coverData,{
    //* configuration
    headers: {
      Authorization:  `Bearer ${sessionStorage.getItem("token")}`
    }
  } ).then(response =>{

    axios.post("http://localhost:1337/api/books",{
      //* request body
        data: {
          title: bookTitle.value,
          author:authorName.value,
          type:audioCheck.checked ? audioCheck.value : physicalCheck.value,
          releaseDate:release.value,
          length:bookLength.value,
          coverImage:response.data[0].id,
          rating:starRating.value,
          genres:bookGenres,
          owner:sessionStorage.getItem("id")
        }
    },{
      //* configuration
      headers: {
        Authorization:  `Bearer ${sessionStorage.getItem("token")}`
      }
    })


  })


}

addBookForm.addEventListener("submit", (para) =>{
  para.preventDefault();
  uploadBook();
})

// //* to check login status (not the best solution to check though, this block is repeated many times )
const checkLoginstatus = () =>{

  if(sessionStorage.getItem("token")){
    regSection.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    getAuthorisedData(`http://localhost:1337/api/users/me`)
    .then(data =>{ showProfile(data)})
    .then(()=>{
      profileSection.classList.remove("hidden");
      // console.log(profileSection)
    })

    fetchData("http://localhost:1337/api/books?populate=*")
        .then(data => {showProfileBooks(data)})
  }
  // console.log(`${data.user.username} is logged in`);
  loginStatus();
}

checkLoginstatus();
console.log(logged);


// getBooks("http://localhost:1337/api/books?populate=*");
// getAuthorisedData("http://localhost:1337/api/users/me");
// getData("http://localhost:1337/api/books?populate=*");