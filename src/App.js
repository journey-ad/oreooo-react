import React, { useState, useEffect, Fragment } from 'react'; // 引入react和hooks相关函数
import intl from 'react-intl-universal'; // 引入国际化组件
import { bgColorArr } from './utils'
import 'normalize.css' // 重设默认样式
import './assets/style/style.scss' // 引入全局样式

import Loading from './components/Loading' // 加载中提示组件
import Container from './components/Container' // 主容器组件
import Footer from './components/Footer' // 页脚组件

// 引入语言包
const locales = {
  de_de: require('./locales/de_de.json'),
  en_us: require('./locales/en_us.json'),
  ja_jp: require('./locales/ja_jp.json'),
  zh_cn: require('./locales/zh_cn.json'),
}

function App() {
  const [show, setShow] = useState({ loading: true, output: false }) // loading和output的展示状态
  const [i18nLoaded, setI18nLoaded] = useState(false) // 语言包加载完成标识

  useEffect(() => { // 定义一个副作用
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'zh_cn') // 设置默认语言为zh_cn
    const currentLocale = intl.determineLocale({
      localStorageLocaleKey: 'lang' // 定义多语言标识
    })
    intl
      .init({ currentLocale, locales }) // 初始化国际化组件
      .then(() => {
        setI18nLoaded(true) // 设置语言包加载完成标识
      })

    // Set background color
    document.documentElement.style.setProperty(
      '--bg-color',
      bgColorArr[Math.floor(Math.random() * bgColorArr.length)]
    );
    return // 组件卸载时不进行操作
  }, []) // 仅在组件首次渲染时调用一次

  return (
    <div className="App">
      {
        i18nLoaded && // 语言包加载完成后
        <Fragment> {/* 用一层Fragment包裹 */}
          <Loading show={show} /> {/* 加载中提示组件 */}
          <Container // 主容器组件
            show={show}
            setShow={setShow} // 把setShow方法传进去
          />
          <Footer show={show} locales={locales} /> {/* 页脚组件 */}
        </Fragment>
      }
    </div>
  );
}

export default App;
