import React, { useState, useEffect, Fragment } from 'react';
import intl from 'react-intl-universal';
import logo from './logo.svg';
import 'normalize.css'
import './assets/style/style.scss'

import Loading from './components/Loading'
import Container from './components/Container'
import Footer from './components/Footer'

const locales = {
  de_de: require('./locales/de_de.json'),
  en_us: require('./locales/en_us.json'),
  ja_jp: require('./locales/ja_jp.json'),
  zh_cn: require('./locales/zh_cn.json'),
}

function App() {
  const [show, setShow] = useState({ loading: true, output: false })
  const [i18nLoaded, setI18nLoaded] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'zh_cn')
    const currentLocale = intl.determineLocale({
      localStorageLocaleKey: 'lang'
    })
    intl
      .init({ currentLocale, locales })
      .then(() => {
        setI18nLoaded(true)
      })
    return
  }, [])

  const bgColorArr = [
    '#caad9f',
    '#f0c869',
    '#6abce0',
    '#9ac4bd',
    '#fad0c4',
    '#9ec6cd'
  ]

  function onGenImage() {
    setShow({ ...show, output: true })
  }

  return (
    <div className="App">
      {
        i18nLoaded &&
        <Fragment>
          <Loading show={show} />
          <Container
            bgColorArr={bgColorArr}
            show={show}
            output={show.output}
            onGenImage={onGenImage}
            setShow={setShow}
          />
          <Footer show={show} locales={locales} />
        </Fragment>
      }
    </div>
  );
}

export default App;
