import React, { useState, useEffect, useRef } from 'react'
import intl from 'react-intl-universal';
import {bgColorArr, sources, downloadImage, capitalizeFirstLetter, getRndInteger } from '../utils'
import './Container.styl'

let imgUrl, images = {}

const Container = (props) => {
  const { setShow } = props
  const { loading, output } = props.show
  const [oreoArr, setOreoArr] = useState([])
  const oreoCanvas = useRef()

  function backToInput() {
    setShow({ loading: false, output: false });
    setOreoArr([])
    imgUrl = '';
  }

  function oreoStr() {
    let str = ''
    oreoArr.forEach((item, index) => {
      switch (item) {
        case 'O':
        case 'Ob':
          str += intl.get('basic_o')
          break;
        case 'R':
          str += intl.get('basic_r')
          break;
        case '-':
          str += intl.get('basic_and')
        default:
          break;
      }
    })
    return capitalizeFirstLetter(str)
  }

  function keyEvent(ev) {
    // console.log(oreoArr, ev.keyCode);
    if (!loading && !output) {
      // input Page
      switch (ev.keyCode) {
        case 79:
          strAdd('o');
          break;
        case 82:
          strAdd('r');
          break;
        case 8:
          strAdd('-1');
          break;
        case 32:
        case 189:
          strAdd('-');
          break;
        case 13:
          generateImage();
          break;
        default:
          break;
      }
    } else if (!loading && output) {
      // output Page
      if (ev.keyCode === 8) {
        backToInput();
      }
    }
  }

  function strAdd(str) {
    let arr = [...oreoArr]
    if (typeof str === 'string') str = [str]
    str.forEach(character => {
      switch (character) {
        case 'o':
          if (oreoArr.length === 0) {
            arr.push('O')
          } else {
            arr.push('Ob')
          }
          break;
        case 'r':
          arr.push('R')
          break;
        case '-':
          if (
            oreoArr.length > 0 &&
            oreoArr[oreoArr.length - 1] !== '-'
          ) {
            arr.push('-')
          }
          break;
        case '-1':
          if (oreoArr.length > 0) {
            arr.pop()
          }
          break;
        default:
          break;
      }
    })

    setOreoArr(arr)
  }

  function getRandom() {
    let arr = []
    for (let i = 0; i < getRndInteger(5, 8); i++) {
      const random = Math.random() * 10;
      let str = '';
      if (random < 1) {
        str = '-';
      } else if (random < 6) {
        str = 'o';
      } else {
        str = 'r';
      }
      arr.push(str)
    }
    strAdd(arr)
  }

  function generateImage() {
    if (oreoArr.length > 0) {
      setShow({ loading: true, output: false });
      const drawArr = [];

      // Delete '-' at the end
      if (oreoArr[oreoArr.length - 1] === '-') {
        setOreoArr([...oreoArr].slice(0, -1))
      }

      // Canvas height calculation
      let height = 0;
      for (let index = 0; index < oreoArr.length; index++) {
        const thisLayer = oreoArr[index];
        if (thisLayer !== '-') {
          const drawItem = {
            image: images[thisLayer],
            x: thisLayer === 'R' ? 10 : 0,
            y: height,
            width: thisLayer === 'R' ? 220 : 240,
            height: thisLayer === 'R' ? 155 : 160
          };
          drawArr.splice(0, 0, drawItem);
          height += 24;
        } else {
          height += 72;
        }
      }
      height += 160 - 24; // Add the last image's height.

      const canvas = oreoCanvas.current;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      drawArr.forEach(item => {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
      });

      imgUrl = canvas.toDataURL('image/png');
      setTimeout(() => {
        setShow({ loading: false, output: true });
      }, 1000);
    }
  }

  function loadImages() {
    // Set background color
    document.documentElement.style.setProperty(
      '--bg-color',
      bgColorArr[Math.floor(Math.random() * bgColorArr.length)]
    );
    const cacheImages = {};

    let index = 0;
    const attCount = Object.getOwnPropertyNames(sources).length;
    for (const imgItem in sources) {
      cacheImages[imgItem] = new Image();
      cacheImages[imgItem].onload = () => {
        index++;
        if (index === attCount - 1) {
          images = cacheImages
          window.setTimeout(() => {
            setShow({ loading: false, output: false });
          }, 1000);
          console.log('Image loaded.');
        }
      };
      cacheImages[imgItem].src = sources[imgItem];
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', keyEvent, false);
    return () => {
      window.removeEventListener('keyup', keyEvent, false);
    }
  }, [oreoArr, loading, output])

  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="container" style={{ display: loading ? 'none' : 'block' }}>
      {
        !output &&
        <div className="design">
          <div className="icon tooltip">
            <span className="tooltiptext">{intl.getHTML('tooltip')}</span>
          </div>
          <div className="title">
            <div className="meta">{intl.get('input_meta')}</div>
            {
              oreoArr.length > 0 &&
              <div className="input str">
                <span>{oreoStr()}</span>
              </div>
            }
            {
              oreoArr.length === 0 &&
              <div className="input str placeholder">
                <span>{intl.get('input_placeholder')}</span>
                <img className="icon" onClick={getRandom} src={require('../assets/images/random.svg')} alt="random" />
              </div>
            }
          </div>
          <div className="control">
            <div onClick={() => { strAdd('o') }} className="btn small">{intl.get('input_btn_o')}</div>
            <div onClick={() => { strAdd('r') }} className="btn small">{intl.get('input_btn_r')}</div>
            <div onClick={() => { strAdd('-') }} className="btn small">{intl.get('input_btn_and')}</div>
            <div onClick={() => { strAdd('-1') }} className="btn small">-1</div>
          </div>
          <div onClick={generateImage} className="index-btn">{intl.get('input_generate')}</div>
        </div>
      }
      <div className="output" style={{ display: output ? 'block' : 'none' }}>
        <div className="title">
          <div className="meta">{intl.get('output_meta')}</div>
          <div className="output str">{oreoStr()}</div>
        </div>
        <div className="output-image">
          <canvas width="240rem" height="500rem" ref={oreoCanvas} id="oreoCanvas"></canvas>
        </div>
        <div onClick={() => { downloadImage(imgUrl) }} className="btn">{intl.get('output_save')}</div>
        <div onClick={backToInput} className="btn">{intl.get('output_back')}</div>
      </div>
    </div>
  )
}

export default Container