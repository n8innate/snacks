import React, { useState } from 'react'
import Modal from 'react-modal';
import { useLoggedInContext } from './SnackContext.jsx'
import { useSnackArrayContext, setSnackArrayContext } from "./SnackContext.jsx";
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//needs to be changed to redirect to login modal if user is not logged in.
//if they are logged in works as it does currently

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function AddSnackModal(props) {
  const boxArray = useSnackArrayContext();
  const setBoxArray = setSnackArrayContext();
  const isLoggedIn = useLoggedInContext()
  const [snackModalIsOpen, setSnackModalIsOpen] = useState(false);
  const [stars, setStars] = useState(2);
  const [flavor, setFlavor] = useState('')
  const [type, setType] = useState('')
  const classes = useStyles()

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#FFFFFF'
    }
  };



  const setModalIsOpenToTrue = () => {
    setSnackModalIsOpen(true)
  }

  const setModalIsOpenToFalse = () => {
    setSnackModalIsOpen(false)
  }

  function sendNewSnack() {
    const name = document.getElementById('snackName').value
    const brand = document.getElementById('brandName').value
    const imgUrl = document.getElementById('snackImage').value
    const origin = document.getElementById('origin').value
    if (name === '' || brand === '' || imgUrl === '' || origin === '' || flavor === '' || type === '') return;
    const reqObj = {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' },
      body: JSON.stringify({
        snack_name: name,
        brand_name: brand,
        origin: origin,
        type: type,
        flavor_profile: flavor,
        img: imgUrl
      })
    }

    fetch('/snack/add', reqObj)
      .then(res => res.json())
      .then(snacks => {
        console.log(snacks)
        //can we get back a single snack?
        //then add the returned new item and we'll add that to the array in
        setBoxArray(snacks)
      })
      .catch(err => console.log('error in AddSnack sendNewSnack', err))
    setSnackModalIsOpen(false)
  }

  const flavorChange = (event) => {
    setFlavor(event.target.value);
  };

  const typeChange = (event) => {
    setType(event.target.value)
  }

  // const useStyles = makeStyles((theme) => ({
  //   formControl: {
  //     margin: theme.spacing(1),
  //     minWidth: 120,
  //   },
  //   selectEmpty: {
  //     marginTop: theme.spacing(2),
  //   },
  // }));

  //   CREATE TABLE Snackslist (
  //     snack_id SERIAL PRIMARY KEY,
  //     snack_name VARCHAR(255),
  //     brand_name VARCHAR(255),
  //     origin VARCHAR(255),
  //     type VARCHAR(255),
  //     flavor_profile VARCHAR(255),
  //     img VARCHAR(255)
  // );


  //Need to change order of inputs

  const openCorrectModal = () => {
    if (isLoggedIn) return setModalIsOpenToTrue();
    else props.setLoginModal(true);
  }

  return (
    <div>
      <button id='addSnackButton' onClick={openCorrectModal}>Add Snack</button>
      <Modal style={customStyles}
        isOpen={snackModalIsOpen}
        onRequestClose={setModalIsOpenToFalse}
        appElement={document.getElementById('root')} //this is where the modal gets hung (is in relationto)
      >
        <div className="addSnackContainer">
          <input className='addSnackInputs' id='snackImage' placeholder='Link to png/jpeg' />
          <input className='addSnackInputs' id='brandName' placeholder='Brand Name' />
          <input className='addSnackInputs' id='snackName' placeholder='Snack Name' />
          <input className='addSnackInputs' id='origin' placeholder='Origin' />
          {/* Snack flavor drop down */}
          <div className="formControls">

            <FormControl className={classes.formControl}>
              <InputLabel id="flavorProfile">Flavor</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={flavor}
                onChange={flavorChange}
              >
                <MenuItem value={'Sweet'}>Sweet</MenuItem>
                <MenuItem value={'Salty'}>Salty</MenuItem>
                <MenuItem value={'Spicy'}>Spicy</MenuItem>
                <MenuItem value={'Sour'}>Sour</MenuItem>
                <MenuItem value={'Bitter'}>Bitter</MenuItem>
              </Select>
            </FormControl>


            {/* Snack Type drop down */}
            <FormControl className={classes.formControl}>
              <InputLabel id="snackType">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={typeChange}
              >
                <MenuItem value={'Chips'}>Chips</MenuItem>
                <MenuItem value={'Candy'}>Candy</MenuItem>
                <MenuItem value={'Beverage'}>Beverage</MenuItem>
                <MenuItem value={'Fruit'}>Fruit</MenuItem>
                <MenuItem value={'Tacos'}>Tacos</MenuItem>
              </Select>
            </FormControl>
          </div>
          <button onClick={() => sendNewSnack()}>Submit New Snack!</button>
          <button onClick={setModalIsOpenToFalse}>x</button>
        </div>

      </Modal>
    </div>

  )
}