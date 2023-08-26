import React, { useContext, useEffect } from 'react';
import './UserPanel.css';
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import User from '../assets/user.png';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const UserPanel = (props) => {
  const show = {
    opacity: 1,
    display: "block"
  };

  const hide = {
    opacity: 0,
    transitionEnd: {
      display: "none"
    }
  };

  const [showUser, setShowUser] = useState(false);
  const colorRef = useRef(null);
  const {currentUser, currentUserId} = useContext(UserContext);

  useEffect(() => {
    // 0.5초 뒤에 실행
    const identifier = setTimeout(async () => {
      colorRef.current.value = props.color;
      if (currentUserId !== null && currentUserId !== 'null') {
        // 색상 업데이트 axios 호출문 추가
        // console.log('Color to change:', colorRef.current.value);
        await axios.put('/users/' + currentUserId, { color: colorRef.current.value });
        await axios.put('/pins/' + currentUserId, { color: colorRef.current.value });
        props.setColor(colorRef.current.value);
      }
    }, 500);
    
    return () => {
      clearTimeout(identifier);
    }
  }, [props.color]);

  const logoutClickHandler = () => {
    props.logoutClick();
    setShowUser(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const fileRef = useRef();

  const imageSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', currentUserId);
    formData.append('image', selectedImage);
    console.log(formData);
    fetch('/users/upload', { method: 'POST', body: formData })
      .then(res => {
        console.log(res);
        setSelectedImage(null);
        fileRef.current.value = null;
      })
      .catch(error => {
        console.error(error);
      });
  }

  const imageChangeHandler = (e) => {
    console.log('Image changed!', e.target.files[0]);
    setSelectedImage(e.target.files[0]);
  }

  return (
    <div className='user-panel'>
      <motion.button
        className='user-button'
        onClick={() => setShowUser(prev => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}>
        <img className='user-img' src={User}></img>
      </motion.button>
      <motion.div className='user-info' animate={showUser ? show : hide}>
        <div className='info-container'>
          <div className='info-image'>
            {/* <img src={User} style={{transform: 'scale(2)'}}></img> */}
            <form onSubmit={imageSubmitHandler} encType='multipart/form-data'>
              <input ref={fileRef} type='file' onChange={imageChangeHandler} name='image'></input>
              <div>
                <input type='submit' value='Save'></input>
                <input type='button' value='Cancel'></input>
              </div>
            </form>
          </div>
          <span>Welcome <b>{currentUser}</b>!</span>
          <div className='info-color'>
            <span>Current pin color: </span>
            <input type='color' ref={colorRef} onChange={(event) => props.setColor(event.target.value)}></input>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }} 
            className='button friends'
            onClick={() => props.setShowFriend(prev => !prev)}>
              Friends
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }} 
            className='button logout' 
            onClick={logoutClickHandler}>
              Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserPanel;