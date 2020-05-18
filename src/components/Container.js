import React, { useState, useEffect, useRef, useCallback } from 'react'
import intl from 'react-intl-universal';
import { sources, downloadImage, capitalizeFirstLetter, getRndInteger } from '../utils' // 从封装的工具库中导入一些工具函数
import './Container.styl'

let imgUrl, cachedImages = {} // 定义生成的图片地址与缓存的Image对象

const Container = (props) => {
  const { setShow } = props // 从props中接收setShow方法
  const { loading, output } = props.show
  const [oreoArr, setOreoArr] = useState([]) // 定义state oreoArr
  const oreoCanvas = useRef() // 使用useRef取到组件ref

  /**
   * 返回输入界面
   */
  const backToInput = useCallback(() => {
    setShow({ loading: false, output: false });
    setOreoArr([]) // 重置oreoArr为空
    imgUrl = ''; // 重置生成图片地址为空
  }, [setShow])

  /**
   * 返回oreoArr对应的可读文案
   */
  function oreoStr() {
    let str = ''
    oreoArr.forEach((item, index) => { // 遍历oreoArr并拼接字符串
      switch (item) {
        case 'O':
        case 'Ob':
          str += intl.get('basic_o') // 使用intl.get取到对应的多语言文本
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
    return capitalizeFirstLetter(str) // 首字母大写
  }

  /**
   * 生成随机内容
   */
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

  const strAdd = useCallback((str) => {
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
  }, [oreoArr])

  const generateImage = useCallback(() => {
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
            image: cachedImages[thisLayer],
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
  }, [oreoArr, setShow])

  // 缓存图片
  useEffect(() => {
    const images = {}; // 存储缓存图片

    let index = 0;
    const attCount = Object.getOwnPropertyNames(sources).length;
    for (const imgItem in sources) {
      images[imgItem] = new Image();
      images[imgItem].onload = () => {
        index++;
        if (index === attCount - 1) {
          cachedImages = images
          window.setTimeout(() => {
            setShow({ loading: false, output: false });
          }, 1000);
          console.log('Image loaded.');
        }
      };
      images[imgItem].src = sources[imgItem];
    }
  }, [setShow])

  // 处理点击事件
  useEffect(() => {
    const keyEvent = (ev) => { // 事件处理方法
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

    window.addEventListener('keyup', keyEvent, false);
    return () => {
      window.removeEventListener('keyup', keyEvent, false);
    }
  }, [oreoArr, loading, output, strAdd, generateImage, backToInput])

  return (
    <div className="container" style={{ display: loading ? 'none' : 'block' }}>
      {
        !output &&
        <div className="design">
          <div className="icon tooltip">
            <span className="tooltiptext">{intl.getHTML('tooltip')}</span> {/* 使用intl.getHTML方法传入多语言html */}
          </div>
          <div className="title">
            <div className="meta">{intl.get('input_meta')}</div>
            {
              oreoArr.length > 0 && // 若输入框有内容，则显示可读内容
              <div className="input str">
                <span>{oreoStr()}</span>
              </div>
            }
            {
              oreoArr.length === 0 && // 否则显示占位字符
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
          <canvas width="240rem" height="500rem" ref={oreoCanvas} id="oreoCanvas"></canvas> {/* 画布作为ref */}
        </div>
        <div onClick={() => { downloadImage(imgUrl) }} className="btn">{intl.get('output_save')}</div>
        <div onClick={backToInput} className="btn">{intl.get('output_back')}</div>
      </div>
    </div>
  )
}

export default Container