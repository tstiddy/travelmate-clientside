// const citiesURL = "http://localhost:3000/cities"
const citiesURL = "https://travelmate-serverside.herokuapp.com/cities"

// const commentsURL = "http://localhost:3000/comments"
const commentsURL = "https://travelmate-serverside.herokuapp.com/comments"

// const landmarksURL = "http://localhost:3000/landmarks"
const landmarksURL = "https://travelmate-serverside.herokuapp.com/landmarks"

// const usersURL = "http://localhost:3000/users"
const usersURL = "https://travelmate-serverside.herokuapp.com/users"

const cityBar = document.querySelector("#city-list")
const landmarkCard = document.querySelector("#landmark-name")
const newComment = document.querySelector("#new-comment")
const otherComments = document.querySelector("#other-comments")
const landmarkDetails = document.querySelector("#landmark-info")
const landmarkNameField = document.querySelector(".landmark-name")

const getMap = document.querySelector("#map")
const getImage = document.querySelector("#image-area")

const checkbox = document.querySelector("#checkbox")

document.addEventListener("DOMContentLoaded", function () {
    User()
});

function User() {
    const menu = document.querySelector(".menu-wrap")
    menu.style.display = "none"

    const userplace = document.querySelector('#log-in-form')
    const div = document.createElement("div")
    div.className = "new-user-div"

    const input = document.createElement("input")
    input.placeholder = "Username"
    input.className = "new-user"
    input.autofocus = true

    const buttonCreate = document.createElement("button")
    buttonCreate.className = "btn btn-light"
    buttonCreate.innerText = "Create new user"
    buttonCreate.addEventListener("click", event => createUser(event))

    const buttonLogIn = document.createElement("button")
    buttonLogIn.className = "btn btn-light"
    buttonLogIn.innerText = "LogIn"
    buttonLogIn.addEventListener("click", event => logInUser(event))

    const space = document.createElement('br')
    const space2 = document.createElement('br')
    const space3 = document.createElement('p')

    div.append(input, space, space2, buttonCreate, space3,buttonLogIn)
    userplace.appendChild(div)

    return userplace
};

function logInUser(event) {

    const user = document.querySelector('.new-user')

    const userName = user.value;

    fetch(usersURL)
        .then(response => response.json())
        .then(users => checkUser(users, userName))
};

function checkUser(users, userName) {
    const userFound = users.find(user => user.username === userName);

    if (userFound) {
        const menu = document.querySelector(".menu-wrap")
        menu.style.display = "block"
        fetchCities(userFound, citiesURL)
    } else {
        window.alert("Please enter valid credentials");
    };
};

function checkNewUser(users, userName) {
    const userFound = users.find(user => user.username === userName.username);

    if (userFound) {
        return window.alert("Please enter valid credentials");
    } else {
        fetch(usersURL, {
            method: "POST",
            body: JSON.stringify(userName),
            headers: {
              "Content-Type": "application/json"
            }
        }).then(resp => resp.json()
        .then(data => fetchCities(data, citiesURL)))
        const menu = document.querySelector(".menu-wrap")
        menu.style.display = "block"
    };
};

function createUser(event) {

    const newUser = document.querySelector('.new-user')

    const newUserName = {
        "username": newUser.value,
    };

    fetch(usersURL)
        .then(response => response.json())
        .then(users => checkNewUser(users, newUserName))
};

function fetchCities(userFound, citiesURL) {

    fetch(citiesURL)
        .then(citiesData => citiesData.json())
        .then(citiesDataResp => displayCities(citiesDataResp, userFound)
)};

function displayCities(citiesDataResp, userFound) {
    const cityHeader = document.createElement("h2")
    cityHeader.innerText = "Best cities in the world"
    const br= document.createElement("br")
    const hr = document.createElement("hr")
    cityBar.append(cityHeader, hr, br)

    citiesDataResp.map(city => {
        showCitySideBar(city, userFound)
    })
};

function showCitySideBar(city, userFound) {
    const clear = document.querySelector(".container")
    clear.innerHTML = ""

    const cityName = document.createElement("li")
    cityName.innerText = city.name
    cityName.dataset.id = city.id
    cityName.classList.add('list-group-item-light' + 'list-group-item-action')
    cityName.addEventListener("click", event => onCityClick(event, userFound, city))
    checkbox.checked = true
    cityBar.append(cityName)
}

function onCityClick(event, userFound, city) {
    getSingleCity(event.target.dataset.id)
        .then(city => showLandmarkCard(city, userFound))
}

function getSingleCity(id) {
    return fetch(citiesURL + `/${id}`)
        .then(response => response.json())
}

function showLandmarkCard(city, userFound) {

    checkbox.checked = false
    landmarkCard.innerHTML = " "
    landmarkDetails.innerHTML = " "
    getMap.innerHTML = " "
    getImage.innerHTML = " "
    newComment.innerHTML = " "
    otherComments.innerHTML = " "
    let landmark =' '

    const landmarkHeader = document.createElement("h2")
    landmarkHeader.innerText = `Top landmarks in ${city.name}`
    const br= document.createElement("br")
    const hr = document.createElement("hr")
    landmarkCard.append(landmarkHeader, hr, br)

    Object.entries(city.landmarks).forEach(([key, value]) => {
        landmark = value
        const landmarkName = document.createElement("li")
        landmarkName.dataset.id = landmark.id
        landmarkName.innerText = landmark.name
        landmarkName.dataset.lat = landmark.latitude
        landmarkName.dataset.id = landmark.id
        landmarkName.dataset.lng = landmark.longitude
        landmarkName.dataset.user_ratings_total = landmark.user_ratings_total
 
        landmarkName.dataset.types = landmark.types
        landmarkName.dataset.address = landmark.formatted_address
        landmarkName.dataset.rating = landmark.rating
        landmarkName.dataset.name = landmark.name
        landmarkSplit = landmark.photos.split(" ")
        landmarkSecondSplit = landmarkSplit.slice(4, 5)
        landmarkName.dataset.photo = landmarkSecondSplit[0].slice(20, 210)
        landmarkCard.append(landmarkName)
        landmarkName.addEventListener('click', event => changeContent(event, userFound))
    })
}

function fetchComments(event, userFound) {
    const lId = parseInt(event.target.dataset.id)
    fetch(`${landmarksURL}/${lId}`)
        .then(data => data.json())
        .then(landmark => displayComments(landmark, event, userFound))
};

function changeContent(event, userFound) {
    newComment.innerHTML = ""
    landmarkDetails.innerHTML = " "
    getImage.innerHTML = " "
    landmarkNameField.innerHTML = ""

    const landmarkData = event.target.dataset.id

    const landmarkPicture = event.target.dataset.photo
    const imageTest = document.createElement('img')
    let URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=${landmarkPicture}&key=AIzaSyBoTZoPmpuT9QC-vDfUn3Y-Wv-GJGsTkEM`
    imageTest.src = URL
    const landmarkName = event.target.dataset.name

    const landmarkLatitudeValue = event.target.dataset.lat
    const landmarkLongitudeValue = event.target.dataset.lng
    const landmarkTotalRatings = event.target.dataset.user_ratings_total

    const landmarkType = event.target.dataset.types

    const landmarkAddress = event.target.dataset.address
    const landmarkRatingValue = event.target.dataset.rating
    const landmarkNameForMap = event.target.dataset.name
    const hr = document.createElement("hr")
    const landmarkFormattedAddress = document.createElement("p")
    landmarkFormattedAddress.innerText = `Address: ${landmarkAddress}`

    const spaceing = document.createElement("br")
    const spaceing2 = document.createElement("br")

    const landmarkRating = document.createElement("p")
    landmarkRating.innerText = `Rating: ${landmarkRatingValue} / 5`

    const landmarkTotalRating = document.createElement("p")
    landmarkTotalRating.innerText = `Total number of ratings: ${landmarkTotalRatings}`

    let landmarkTypeSection = document.createElement("p")
    landmarkTypeSection.innerText = `Type of landmark: `


    let sliceLandmarkType = landmarkType.replace(/[\[\]']+/g, '')
    let removeQuotesFromLandmarkType = sliceLandmarkType.replace(/['"]+/g, '')
    let removeUnderScoreFromLandmarkType = removeQuotesFromLandmarkType.replace(/[_]+/g, ' ')
    let splitLandmarkType = removeUnderScoreFromLandmarkType.split(',')

    
    splitLandmarkType.forEach(function(splitLand) {
        const landmarkTypeSplit = document.createElement('li')
        landmarkTypeSplit.innerText = splitLand
        landmarkTypeSection.append(landmarkTypeSplit)
    })

    

 
    
    
    landmarkNameField.append(landmarkName, hr)

    landmarkDetails.append(landmarkFormattedAddress, spaceing, landmarkRating, spaceing2, landmarkTotalRating, spaceing, landmarkTypeSection )
    getImage.append(imageTest)
    initMap(landmarkLatitudeValue, landmarkLongitudeValue, landmarkNameForMap)

    createNewCommentForm(landmarkData, userFound, event)
    fetchComments(event, userFound)

};

function createNewCommentForm(landmarkData, userFound, event) {
    const div = document.createElement("div")
    div.className = "new-comment-div"

    const textarea = document.createElement("textarea")
    textarea.placeholder = "Enter your comment here"
    textarea.className = "new-comment"
    textarea.autofocus = true

    const moreSpaceing = document.createElement("br")
    const moreSpaceing2 = document.createElement("br")

    const buttonCreate = document.createElement("button")
    buttonCreate.className = "btn btn-light"
    buttonCreate.innerText = "Create Comment"
    buttonCreate.addEventListener("click", event => createComment(event, landmarkData, userFound))

    newComment.append(textarea, moreSpaceing, moreSpaceing2,buttonCreate)

    return newComment
};

function createComment(event, landmarkData, userFound) {
    const newComment = document.querySelector('.new-comment')

    const newContent = {
        "description": newComment.value,
        "user_id": userFound.id,
        "landmark_id": parseInt(landmarkData),
        "username": userFound.username
    };

    fetch(commentsURL, {
        method: "POST",
        body: JSON.stringify(newContent),
        headers: {
          "Content-Type": "application/json"
        }
    }).then(resp => resp.json()).then(newCommentData => createCommentViewSelf(newCommentData, userFound, landmarkData))
};

function createCommentViewSelf(comment, userFound, landmarkData) {

    if (comment.user_id == userFound.id) {
        newComment.innerHTML = ""

        const div = document.createElement("div")
        div.className = "comment-div"
        div.dataset.id = comment.id

        const textarea = document.createElement("textarea")
        textarea.innerText = comment.description
        textarea.autofocus = true
        textarea.id = comment.id

        const buttonEdit = document.createElement("button")
        buttonEdit.id = comment.id
        buttonEdit.className = "btn btn-light"
        buttonEdit.innerText = "Edit Comment"
        buttonEdit.addEventListener("click", event => updateComment(event, comment, userFound, landmarkData))

        const moreSpaceing = document.createElement("br")
        const moreSpaceing2 = document.createElement("br")

        const buttonDelete = document.createElement("button")
        buttonDelete.id = comment.id
        buttonDelete.className = "btn btn-danger"
        buttonDelete.innerText = "Delete Comment"
        buttonDelete.addEventListener("click", event => deleteComment(event, comment, userFound, landmarkData))

        div.append(textarea, moreSpaceing, moreSpaceing2,  buttonEdit, buttonDelete)
        newComment.appendChild(div)
    }
};

function initMap(landmarkLatitudeValue, landmarkLongitudeValue, landmarkNameForMap) {

    let URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRZAAAAl_v2oJkEPXbqGWsJQFlQJIWS9nHHvd1LoYKXaTbSf2PgslC7CSZInRoaFGnGYe10FIWxF-mcwWPeWDlb_v3WkzMVjcFZJco9Bh_bEeHL019mfJ6nlVNZSvEfSUQ1eKm-EhATpmO79nO47JKV_tX9B4TrGhSDwuC9yoAyLF1yaODkF8OkbV_XRQ&key=AIzaSyBoTZoPmpuT9QC-vDfUn3Y-Wv-GJGsTkEM'

    let latNum = parseFloat(landmarkLatitudeValue);
    let lngNum = parseFloat(landmarkLongitudeValue);

    let lmName = landmarkNameForMap

    let currentLandmark = {lat: latNum, lng: lngNum};

    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 12, center: currentLandmark}
    )

    let infowindow = new google.maps.InfoWindow({content: lmName, URL});

    let marker = new google.maps.Marker({position: currentLandmark, map: map});

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

function displayComments(landmark, event, userFound) {

    const commentsList = document.querySelector("#other-comments")
    commentsList.innerHTML = ""
    const comments = landmark["comments"]
    comments.map(comment => {
        createCommentView(comment, userFound)
    })
};

function createCommentView(comment, userFound) {

    if (comment.id !== userFound.id) {
        const div = document.createElement("div")
        div.className = "comment-div"
        div.dataset.id = comment.id

        const p = document.createElement("p")
        p.innerText = comment.description
        p.id = comment.id

        const h3 = document.createElement("h3")
        h3.innerText = comment.username
        h3.id = comment.id

        div.append(h3, p)
        otherComments.appendChild(div)
    }
};

function updateComment(event, comment) {

    const domNode = document.querySelector(`div[data-id="${comment.id}"`).firstElementChild

    const editedContent = {
        "description": domNode.value,
    };

    fetch(`${commentsURL}/${comment.id}`, {
        method: "PATCH",
        body: JSON.stringify(editedContent),
        headers: {
          "Content-Type": "application/json"
        }
    }).then(quote => quote.json())
};

function deleteComment(event, comment, userFound) {
    return fetch(`${commentsURL}/${comment.id}`, {
        method: "DELETE"
      })
      .then(resp => resp.json())
      .then(comment => removeDOMContent(comment, userFound));
  }

function removeDOMContent(response, userFound, landmarkData) {
    const domNode = document.querySelector(`div[data-id="${response.commentId}"`)
    domNode.remove();
    createNewCommentForm(landmarkData, userFound)
};