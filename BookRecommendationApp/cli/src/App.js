import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import Axios from 'axios';
import './App.css';
import 'primeicons/primeicons.css';
import { SelectButton } from 'primereact/selectbutton';
import Card from 'react-bootstrap/Card';
import { Button } from 'primereact/button';
import { Slider } from "primereact/slider";
import { Menubar } from 'primereact/menubar';
import { Password } from 'primereact/password';
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import { Rating } from 'primereact/rating';
import { SpeedDial } from 'primereact/speeddial';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';



function App() {
  const [inputValue, setInputValue] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const options = ['Genre', 'Title'];
  const [value, setValue] = useState(options[0]);
  const [limit, setLimit] = useState(0);
  const [number, setNumber] = useState(0);
  const [isPreviousButtonDisabled, setIsPreviousButtonDisabled] = useState(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [loginDisabled, setloginDisabled] = useState(false);
  const [signUpDisabled, setSignUpDisabled] = useState(false);
  const [signOutDisabled, setSignOutDisabled] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userLabel, setUserLabel] = useState('');
  const [inputUserDisabled, setInputUserDisabled] = useState(false);
  const [appDisabled, setAppDisabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [disabledRating, setDisabledRating] = useState(false);
  const [liked, setLiked] = useState(0);
  const [iconFill, setIconFill] = useState(true);
  const [icon, setIcon] = useState("pi pi-heart");
  const [visibleFavorites, setVisibleFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoritesRec, setFavoritesRec] = useState([]);
  const [visibleFavoritesRec, setVisibleFavoritesRec] = useState(false);
  const toast = useRef(null);


  const showSuccess = (message, summary) => {
    toast.current.show({severity:'success', summary: summary, detail: message, life: 3000});
  };

  const showWarn = (message, summary) => {
    toast.current.show({severity:'warn', summary: summary, detail: message, life: 3000});
  };

  const showError = (message, summary) => {
    toast.current.show({severity:'error', summary: summary, detail: message, life: 3000});
  };

 const showInfo = (message, summary) => {
  toast.current.show({severity:'info', summary: summary, detail: message, life: 3000});
  };

  const isLoggedIn = () => {
    if (localStorage.getItem("username") !== null && localStorage.getItem("password") !== null) {
      setUserLabel(localStorage.getItem("username"));
      setloginDisabled(true);
      setSignUpDisabled(true);
      setSignOutDisabled(false);
      setInputUserDisabled(true);
      setAppDisabled(false);
      setUsername(localStorage.getItem("username"));
      setPassword(localStorage.getItem("password"));
    }
  };
  
  useEffect(() => {
    isLoggedIn();
  }, []);

  const items = [
    {
        label: 'Recommend',
        icon: 'pi pi-book',
        command: () => {
            setVisibleFavoritesRec(true);
            fav();
        }
    },
  ];

  const fav = async () => {
    const favoritesRec = [];
    for(let i = 0; i < favorites.length; i++){
      const response = await Axios.get(`http://localhost:5000/title/${favorites[i]}/1`)
      favoritesRec.push(response.data.recommended_books_title[0].title);
    }
    setFavoritesRec(favoritesRec);
  };

  const login = async () => {
    
    try {
      const url = `http://localhost:5000/users/${username} ${password}/`;
      const response = await Axios.get(url);
      if (response.status === 200) {
        if((username !== '' || null || undefined) && (password !== '' || null || undefined)){
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        }
        if (response.data === true) {
          showSuccess(`Welcome ${username}`, "Successfully Logged in")
          setUserLabel(username);
          setloginDisabled(true);
          setSignUpDisabled(true);
          setSignOutDisabled(false);
          setInputUserDisabled(true);
          setAppDisabled(false);
        } else {
          showError('Please check your credentials!', 'Error');
        } 
      }
    } catch (error) {
      showError('Request Failed!', 'Error');
    }
  };

  const signUp = () => {
    const query = `http://localhost:5000/addUser/${newUsername} ${newPassword}/`;
    fetch(query, {method: 'POST'})
      .then(response => response.json())
      .then(data => {
        const message = data.message;
        if(message === 'User exists') {
          showInfo(`${newUsername} exists.`)
        } else {
          showSuccess(`${newUsername} successfully signed up!`)
        }; 
      });
  };

  const signOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setloginDisabled(false);
    setUserLabel('');
    setSignUpDisabled(false);
    setSignOutDisabled(true);
    showSuccess(`Successfully logged out ${username}`)
    setInterval(function() {
      window.location.reload();
    }, 500);
  };

  const start = 
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
          <i className="pi pi-user" style={{cursor:'default'}}></i>
      </span>
      <InputText value={username} onChange={e => setUsername((e.target.value))} placeholder="Username" disabled={inputUserDisabled}/>
      <span className="p-inputgroup-addon">
        <i  className="pi pi-key" style={{cursor:'default'}}></i>
      </span>
      <InputText value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' disabled={inputUserDisabled}/>
      <Button label="Login" onClick={() => login()} severity="primary" disabled={loginDisabled} />
      <Button label="Sign Out" onClick={() => signOut()} severity="danger" disabled={signOutDisabled}/>
    </div>;

    const end = 
      <div className="card">
        <Button label="Sign Up" onClick={() => setVisible(true)} severity="success" disabled={signUpDisabled} visible={!signUpDisabled}/>
        <Button label="Favorites" onClick={() => { setVisibleFavorites(true); handleFavorites(); }} severity="warning" visible={signUpDisabled}/>
        <Sidebar visible={visible} onHide={() => setVisible(false)} className="w-full md:w-20rem lg:w-30rem">
            <h2>Sign Up</h2>
            <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user" ></i>
            </span>
            <InputText value={newUsername} onChange={e => setNewUsername((e.target.value))} placeholder="Username" disabled={inputUserDisabled}/>
      </div>
      <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
          <i  className="pi pi-key"></i>
          </span>
          <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Password' toggleMask disabled={inputUserDisabled}/>
          <Button label="Sign Up" onClick={() => signUp()} severity="primary" disabled={loginDisabled} />
      </div>
        </Sidebar>
        <Sidebar visible={visibleFavorites} onHide={() => setVisibleFavorites(false)} className="w-full md:w-30rem lg:w-40rem" >
          <div>
            <SpeedDial style={{ left: 'calc(70%)', top: 10 }} model={items} direction="down" transitionDelay={80} showIcon="pi pi-bolt" hideIcon="pi pi-times" buttonClassName="p-button-outlined" />
            <Sidebar visible={visibleFavoritesRec} onHide={() => setVisibleFavoritesRec(false)} position="right" className="w-full md:w-30rem lg:w-40rem" >
              <h2>Recommendations for your favorites</h2>
              <h5>
                (This list is based on your favorite books.)
                {favorites.length !== favoritesRec.length && favoritesRec.length > 0 ? 
                  <ProgressSpinner style={{width: '50px', height: '50px', float:'right'}} />
                :
                null
                }
                </h5>
              <div>
                  <ul>
                  {favoritesRec.length > 0 ? favoritesRec.map((favoriteRec, index) => (
                    <li style={{textAlign:'left', marginBottom: '10px'}} key={index}>{favoriteRec}</li>
                  ))
                  :
                  <div className="card flex justify-content-center" style={{paddingTop:'80%', cursor:'default'}}>
                    <ProgressSpinner style={{width: '200px', height: '200px'}} />
                  </div>
                  }
                </ul>
              </div>
            </Sidebar>
          </div>
          <h2>{ userLabel } Favorites</h2>
          <div>
          <ul>
            {favorites.length > 0 ?
              <ul>
                {favorites.sort().map((favorite, index) => (
                  <li style={{textAlign:'left', marginBottom: '10px'}} key={index}>{favorite}</li>
                ))}
              </ul>
              :
                <i className="pi pi-book" style={{fontSize: '10em', cursor:'default', paddingTop:'80%', opacity:'.2'}}></i>
            }
          </ul>
          </div>
        </Sidebar>
      </div>;

  useEffect(() => {
    if (value === null) {
      showWarn('You have to select the Genre Button or Title Button for search!', 'Warning');
    };
  }, [value]);


  const getRecommendedBooks = async () => {
    setNumber(0);
    try {
      const response = await Axios.get(`http://localhost:5000/${value.toLowerCase()}/${inputValue}/${limit}`)
      setIsNextButtonDisabled(false);
      setIsPreviousButtonDisabled(true);
      if (value === options[0]) {
        setRecommendedBooks(response.data.recommended_books);
        setCoverImg()
      } else {
        setRecommendedBooks(response.data.recommended_books_title);
      }
      showSuccess('Books successfully fetched!', "Success")

    } catch (error) {
      showError(error.message, "Error");
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (value === options[0]) {
      const words = string.split(' ');
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
      return words.join(' ');
    } else {
      return string;
    }
  }

  const handleCardClick = (event) => {
    setValue(options[1]);
    const bookTitle = event.target.textContent;
    setInputValue('');
    setInputValue(bookTitle);
    getRecommendedBooks();
    setButtonClicked(true);
    event.preventDefault();
  };
  
  const bookDetails = (title) => {
    Axios.get(`http://localhost:5000/more/${title}`)
      .then(response => {
        const { author, publisher, description, coverImg } = response.data.book_details[0];
        setBookTitle(title);
        setBookAuthor(author);
        setBookPublisher(publisher);
        setBookDescription(description);
        setCoverImg(coverImg);
      });
  };

  const handleNext = () => {
    setNumber(number + 5);
    //console.log(number);
    setIsPreviousButtonDisabled(false);
    if(number === (limit - 10) ) {
      setIsNextButtonDisabled(true);
    } else if ( number === limit ) {
      setIsNextButtonDisabled(true);
    }
  };

  const handlePrevious = () => {
    setNumber(number - 5);
    if (number === 0 && number <= 5) {
      setIsPreviousButtonDisabled(true);
      setIsNextButtonDisabled(false);
    }
  };

  const checkRating = async (title) => {
    try {
      const response = await Axios.get(`http://localhost:5000/checkUserRating/${userLabel}/${title}`)
      if(response.data !== false) {
        setRating(response.data.rating);
        //console.log(response.data)
      }
    } catch (error) {
      //console.log(error)
    }
  };

  const updateRating = async (title, rating) => {
    if(rating === 0 || rating !== userRating){
      showInfo('To change the rating, you need to click on the score you want 2 times!');
    }
    try {
      if(rating !== 0){
        const response = await Axios.post(`http://localhost:5000/userRating/${userLabel}/${title}/${parseInt(rating)}/`)
        //console.log(response);
        if(rating === userRating && response.data.message !== false){
          setDisabledRating(true);
          checkRating(title);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkLiked = async (title) => {
    try {
      const response = await Axios.get(`http://localhost:5000/checkUserLikes/${userLabel}/${title}`)
      if(response.data.liked === 0) {
        setIconFill(true);
        setIcon("pi pi-heart");
        //console.log(response.data);
      } else if (response.data.liked === 1) {
        setIconFill(false);
        setIcon("pi pi-heart-fill");
        //console.log(response.data);
      } else if (response.data.liked === false){
        setIconFill(true);
        setIcon("pi pi-heart");
      } else {
        console.log(response.data);
      }
    } catch (error) {
      //console.log(error)
    }
  };

  const updateLike = async (title, liked) => {
    if (liked === 0) {
      setLiked(1);
    } else {
      setLiked(0);
    }
    checkLiked(title);
    try {
        await Axios.post(`http://localhost:5000/bookLikes/${userLabel}/${title}/${parseInt(liked)}/`);
        //console.log(response);
      } catch (error) {
        console.log(error);
    }
  };

  const handleFavorites = async () => {
    try {
      const response = await Axios.get(`http://localhost:5000/checkUserFavorites/${userLabel}/`);
      //console.log(response);
      setFavorites(response.data.books);
      //console.log(favorites);
    } catch(error){
      console.log(error);
    }
  };


  return (
    <div className="container">
      <Toast ref={toast} />
      <div className='navbar'>
      <Avatar onClick={() => handleFavorites()} label={userLabel.charAt(0).toUpperCase()} size="xlarge" style={{ backgroundColor: userLabel.length > 0 ? "rgb(0, 201, 252)" : "white", color: "#ffffff", marginRight: '10px', cursor:'default'}} shape="circle" />
      <Menubar start={start} end={end} />
        </div>
      <h1>Book Recommendation App</h1>  
      <div>
        <SelectButton className="select-button" value={value} onChange={(e) => setValue(e.value)} options={options} disabled={appDisabled} />
      </div>
      <p className='p'>{limit} book shows</p>
      <div className="card flex justify-content-center">
      </div>
      <div className="w-14rem">
            <Slider value={limit} min={0} max={50} onChange={(e) => setLimit(e.value)} className="w-full" step={5} disabled={appDisabled}/>
            <br></br>
        </div>
      <div className='inputText'>
        <InputText size="100" value={inputValue} onChange={e => setInputValue(capitalizeFirstLetter(e.target.value))} placeholder='Type Some Genre or Title' disabled={appDisabled}/>
        <button onClick={() => { setButtonClicked(true); getRecommendedBooks(); }} disabled={appDisabled}><i className="pi pi-arrow-circle-right"></i></button>
        <button onClick={handlePrevious} disabled={isPreviousButtonDisabled || appDisabled}><i className="pi pi-chevron-left"></i></button> 
        <button onClick={handleNext} disabled={isNextButtonDisabled || appDisabled}><i className="pi pi-chevron-right"></i></button>
      </div>
      {buttonClicked && (
        <div className='books'>
            {recommendedBooks.slice(number, number + 5).map((book, index) => (
            <><Card className='card' key={index}>
                <Card.Body>
                  <Card.Img className='card-cover' src={book.coverImg} variant='top' alt={book.title} style={{ cursor: 'default' }} />
                  <Card.Title onClick={handleCardClick}>{book.title}</Card.Title>
                </Card.Body>
                <Button onClick={() => { bookDetails(book.title); setDetailVisible(true); checkRating(book.title); checkLiked(book.title); setDisabledRating(false); } }>Details</Button>
                <div className="card flex justify-content-center">
                  <Sidebar visible={detailVisible} onHide={() => { setDetailVisible(false); setUserRating(0); setLiked(0); } } className="w-full md:w-20rem lg:w-30rem">
                    <h2>
                      {bookTitle}
                      <Button icon={icon} rounded text={iconFill} raised severity="danger" aria-label="Favorite" style={{ float: 'right' }} onClick={() => { updateLike(bookTitle, liked); } } />
                    </h2>
                    <Rating value={rating} onChange={(e) => setRating(e.value)} readOnly cancel={false} />
                    <p>Rating: {rating}</p>
                    <Rating value={userRating} onChange={(e) => setUserRating(e.value)} onClick={() => updateRating(bookTitle, userRating)} disabled={disabledRating} cancel={false} pt={{ onIcon: { className: 'text-orange-400' } }} />
                    <p>Rating will change with: {userRating}</p>
                    <p hidden={disabledRating === false} style={{color:'green'}}>Saved!</p>
                    <br></br>
                    <img src={coverImg} alt={bookTitle} />
                    <p>{bookAuthor}</p>
                    <p>{bookPublisher}</p>
                    <p>{bookDescription}</p>
                  </Sidebar>
                </div>
              </Card><>
                </>
                {index === recommendedBooks.slice(number, number + 5).length - 1 ? null : <Divider layout='vertical' type='solid' />}
                </>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
